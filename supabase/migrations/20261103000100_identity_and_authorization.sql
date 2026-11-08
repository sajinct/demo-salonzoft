-- Phase 02. Managed auth.users/storage.* are supplied by Supabase, not duplicated.
create schema if not exists app_private;
create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;
revoke all on schema app_private from public, anon, authenticated;
grant usage on schema app_private to authenticated, anon;
alter default privileges in schema app_private revoke execute on functions from public;
alter default privileges in schema public revoke execute on functions from public;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 100),
  locale text not null default 'en' check (locale in ('en','ar')),
  created_at timestamptz not null default now()
);
create table public.app_roles (code text primary key);
create table public.app_permissions (code text primary key);
create table public.role_permissions (
  role_code text references public.app_roles(code),
  permission_code text references public.app_permissions(code),
  primary key(role_code, permission_code)
);
insert into public.app_roles values ('owner'),('manager'),('receptionist'),('professional'),('finance_viewer');
insert into public.app_permissions values ('workspace.read'),('members.manage'),('audit.read'),('files.read'),('files.write'),('marketing.manage');
insert into public.role_permissions
select 'owner', code from public.app_permissions;
insert into public.role_permissions values
 ('manager','workspace.read'),('manager','audit.read'),('manager','files.read'),('manager','files.write'),
 ('receptionist','workspace.read'),('professional','workspace.read'),('finance_viewer','workspace.read');

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 2 and 100),
  owner_user_id uuid not null references auth.users(id),
  status text not null default 'active' check (status in ('active','suspended','archived')),
  currency text not null default 'OMR' check (currency = 'OMR'),
  time_zone text not null default 'Asia/Muscat',
  created_at timestamptz not null default now()
);
create table public.locations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id),
  name text not null check (char_length(btrim(name)) between 2 and 100),
  unique(business_id,id)
);
create table public.business_members (
  business_id uuid not null references public.businesses(id),
  user_id uuid not null references auth.users(id),
  role_code text not null references public.app_roles(code),
  scope_mode text not null check (scope_mode in ('all_locations','selected_locations')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  primary key(business_id,user_id),
  check (role_code <> 'owner' or (scope_mode = 'all_locations' and active))
);
create index business_members_by_user on public.business_members(user_id,business_id) where active;
create table public.member_location_scopes (
  business_id uuid not null,
  user_id uuid not null,
  location_id uuid not null,
  primary key(business_id,user_id,location_id),
  foreign key(business_id,user_id) references public.business_members(business_id,user_id),
  foreign key(business_id,location_id) references public.locations(business_id,id)
);
-- Scheduling identities are independent from application membership/logins.
create table public.staff_members (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id),
  display_name text not null check (char_length(btrim(display_name)) between 1 and 100),
  unique(business_id,id)
);
create table public.staff_identity_links (
  business_id uuid not null,
  staff_id uuid not null,
  user_id uuid not null,
  primary key(business_id,staff_id),
  unique(business_id,user_id),
  foreign key(business_id,staff_id) references public.staff_members(business_id,id),
  foreign key(business_id,user_id) references public.business_members(business_id,user_id)
);
create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id),
  location_id uuid,
  actor_user_id uuid not null references auth.users(id),
  action text not null,
  object_id uuid not null,
  detail jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  foreign key(business_id,location_id) references public.locations(business_id,id)
);
create index audit_events_business_time on public.audit_events(business_id,occurred_at desc);
create table app_private.bootstrap_requests (
  actor_user_id uuid primary key references auth.users(id),
  request_id uuid not null,
  fingerprint text not null,
  business_id uuid not null references public.businesses(id)
);
create table app_private.invitations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id),
  email text not null check (email = lower(btrim(email)) and char_length(email) <= 254),
  role_code text not null references public.app_roles(code) check (role_code <> 'owner'),
  scope_mode text not null check (scope_mode in ('all_locations','selected_locations')),
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_by uuid not null references auth.users(id),
  accepted_by uuid references auth.users(id),
  accepted_at timestamptz,
  revoked_at timestamptz,
  unique(business_id,id)
);
create unique index one_pending_invite on app_private.invitations(business_id,email) where accepted_at is null and revoked_at is null;
create table app_private.invitation_locations (
  business_id uuid not null,
  invitation_id uuid not null,
  location_id uuid not null,
  primary key(invitation_id,location_id),
  foreign key(business_id,invitation_id) references app_private.invitations(business_id,id),
  foreign key(business_id,location_id) references public.locations(business_id,id)
);
-- Explicit object registry: a guessed tenant prefix is never sufficient authority.
create table public.file_objects (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id),
  location_id uuid not null,
  bucket_id text not null check (bucket_id in ('client-files','marketing-assets')),
  object_name text not null unique,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  foreign key(business_id,location_id) references public.locations(business_id,id),
  unique(bucket_id,object_name)
);

create function app_private.verified_uid() returns uuid language plpgsql stable security definer set search_path = '' as $$
declare v_user uuid;
begin
  select id into v_user from auth.users where id = auth.uid() and email is not null and email <> '' and email_confirmed_at is not null and (banned_until is null or banned_until <= now());
  if v_user is null then raise exception using errcode='42501', message='UNAUTHENTICATED'; end if;
  return v_user;
end $$;
create function app_private.can_access(p_business_id uuid,p_permission text,p_location_id uuid default null,p_write boolean default false)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.business_members m join public.businesses b on b.id=m.business_id
    join auth.users u on u.id=m.user_id
    join public.role_permissions rp on rp.role_code=m.role_code and rp.permission_code=p_permission
    where m.business_id=p_business_id and m.user_id=auth.uid() and m.active
      and u.email_confirmed_at is not null and (u.banned_until is null or u.banned_until<=now())
      and (b.status='active' or (not p_write and m.role_code='owner'))
      and (p_location_id is null or exists (
        select 1 from public.locations l where l.id=p_location_id and l.business_id=p_business_id
        and (m.scope_mode='all_locations' or exists (select 1 from public.member_location_scopes s where s.business_id=m.business_id and s.user_id=m.user_id and s.location_id=l.id))
      ))
  );
$$;
create function app_private.require_owner(p_business_id uuid) returns uuid language plpgsql security definer set search_path = '' as $$
declare v_actor uuid := app_private.verified_uid();
begin
  -- All membership/invitation/ownership writers lock the business first.
  perform 1 from public.businesses where id=p_business_id for update;
  if not app_private.can_access(p_business_id,'members.manage',null,true) then raise exception using errcode='42501',message='NOT_FOUND_OR_FORBIDDEN'; end if;
  return v_actor;
end $$;
create function app_private.validate_scope(p_business_id uuid,p_scope_mode text,p_locations uuid[]) returns void language plpgsql security definer set search_path = '' as $$
begin
  if p_scope_mode is null or p_scope_mode not in ('all_locations','selected_locations') or p_locations is null
    or (p_scope_mode='all_locations' and cardinality(p_locations)<>0)
    or (p_scope_mode='selected_locations' and cardinality(p_locations)=0)
    or exists (select 1 from unnest(p_locations) x where x is null or not exists(select 1 from public.locations l where l.id=x and l.business_id=p_business_id))
  then raise exception using errcode='22023',message='INVALID_LOCATION_SCOPE'; end if;
end $$;
create function app_private.audit(p_business_id uuid,p_action text,p_object_id uuid,p_detail jsonb default '{}'::jsonb,p_location_id uuid default null)
returns void language sql security definer set search_path = '' as $$
  insert into public.audit_events(business_id,location_id,actor_user_id,action,object_id,detail)
  values(p_business_id,p_location_id,app_private.verified_uid(),p_action,p_object_id,p_detail);
$$;
create function app_private.immutable_tenant() returns trigger language plpgsql set search_path = '' as $$
begin
  if new.business_id is distinct from old.business_id then raise exception using errcode='42501',message='IMMUTABLE_BUSINESS'; end if;
  if tg_table_name='business_members' and (to_jsonb(new)->>'user_id') is distinct from (to_jsonb(old)->>'user_id') then raise exception using errcode='42501',message='IMMUTABLE_IDENTITY'; end if;
  return new;
end $$;
create function app_private.audit_is_append_only() returns trigger language plpgsql set search_path = '' as $$
begin raise exception using errcode='42501',message='AUDIT_IMMUTABLE'; end $$;
create trigger audit_append_only before update or delete on public.audit_events for each row execute function app_private.audit_is_append_only();
do $$ declare t text; begin
  foreach t in array array['locations','business_members','member_location_scopes','staff_members','staff_identity_links','file_objects'] loop
    execute format('create trigger immutable_tenant before update on public.%I for each row execute function app_private.immutable_tenant()',t);
  end loop;
end $$;
create function app_private.owner_invariant() returns trigger language plpgsql security definer set search_path = '' as $$
declare v_business uuid;
begin
  if tg_table_name='businesses' then v_business := new.id; else v_business := coalesce(new.business_id,old.business_id); end if;
  if exists(select 1 from public.businesses b where b.id=v_business and not exists(select 1 from public.business_members m where m.business_id=b.id and m.user_id=b.owner_user_id and m.role_code='owner' and m.active and m.scope_mode='all_locations'))
  then raise exception using errcode='23514',message='LAST_OWNER_REQUIRED'; end if;
  return null;
end $$;
create constraint trigger owner_required after insert or update on public.businesses deferrable initially deferred for each row execute function app_private.owner_invariant();
create constraint trigger owner_required after insert or update or delete on public.business_members deferrable initially deferred for each row execute function app_private.owner_invariant();
create function app_private.new_profile() returns trigger language plpgsql security definer set search_path = '' as $$
begin insert into public.profiles(id) values(new.id) on conflict do nothing; return new; end $$;
create trigger create_profile after insert on auth.users for each row execute function app_private.new_profile();
insert into public.profiles(id) select id from auth.users on conflict do nothing;

-- Deny by default, including the private invite/hash/idempotency tables.
do $$ declare t record; begin
  for t in select tablename,schemaname from pg_tables where schemaname='app_private' or (schemaname='public' and tablename in ('profiles','app_roles','app_permissions','role_permissions','businesses','locations','business_members','member_location_scopes','staff_members','staff_identity_links','audit_events','file_objects')) loop
    execute format('alter table %I.%I enable row level security',t.schemaname,t.tablename);
    execute format('revoke all on %I.%I from public,anon,authenticated',t.schemaname,t.tablename);
  end loop;
end $$;
grant select on public.profiles,public.app_roles,public.app_permissions,public.role_permissions,public.businesses,public.locations,public.business_members,public.member_location_scopes,public.staff_members,public.staff_identity_links,public.audit_events,public.file_objects to authenticated;
grant update(display_name,locale) on public.profiles to authenticated;
grant execute on function app_private.can_access(uuid,text,uuid,boolean) to authenticated;
create policy profile_self_read on public.profiles for select to authenticated using(id=auth.uid());
create policy profile_self_update on public.profiles for update to authenticated using(id=auth.uid()) with check(id=auth.uid());
create policy role_definitions on public.app_roles for select to authenticated using(true);
create policy permission_definitions on public.app_permissions for select to authenticated using(true);
create policy role_permission_definitions on public.role_permissions for select to authenticated using(true);
create policy business_read on public.businesses for select to authenticated using(app_private.can_access(id,'workspace.read'));
create policy location_read on public.locations for select to authenticated using(app_private.can_access(business_id,'workspace.read',id));
create policy membership_read on public.business_members for select to authenticated using(app_private.can_access(business_id,'members.manage') or (user_id=auth.uid() and active and app_private.can_access(business_id,'workspace.read')));
create policy member_scope_read on public.member_location_scopes for select to authenticated using(app_private.can_access(business_id,'members.manage') or (user_id=auth.uid() and app_private.can_access(business_id,'workspace.read',location_id)));
create policy staff_read on public.staff_members for select to authenticated using(app_private.can_access(business_id,'members.manage') or (app_private.can_access(business_id,'workspace.read') and exists(select 1 from public.staff_identity_links i where i.business_id=staff_members.business_id and i.staff_id=staff_members.id and i.user_id=auth.uid())));
create policy staff_link_read on public.staff_identity_links for select to authenticated using(app_private.can_access(business_id,'members.manage') or (user_id=auth.uid() and app_private.can_access(business_id,'workspace.read')));
create policy audit_read on public.audit_events for select to authenticated using(app_private.can_access(business_id,'members.manage') or (location_id is not null and app_private.can_access(business_id,'audit.read',location_id)));
create policy file_registry_read on public.file_objects for select to authenticated using(app_private.can_access(business_id,case when bucket_id='marketing-assets' then 'marketing.manage' else 'files.read' end,location_id));
revoke all on all functions in schema app_private from public,anon,authenticated;
grant execute on function app_private.can_access(uuid,text,uuid,boolean) to authenticated;
