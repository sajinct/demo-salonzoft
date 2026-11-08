create function public.bootstrap_business(p_request_id uuid,p_business_name text,p_location_name text) returns uuid language plpgsql security definer set search_path = '' as $$
declare v_actor uuid := app_private.verified_uid(); v_business uuid; v_previous app_private.bootstrap_requests; v_fingerprint text;
begin
  if p_request_id is null or p_business_name is null or char_length(btrim(p_business_name)) not between 2 and 100 or p_location_name is null or char_length(btrim(p_location_name)) not between 2 and 100 then raise exception using errcode='22023',message='VALIDATION_ERROR'; end if;
  v_fingerprint := encode(extensions.digest(jsonb_build_array(btrim(p_business_name),btrim(p_location_name))::text,'sha256'),'hex');
  perform pg_advisory_xact_lock(hashtextextended(v_actor::text,102));
  select * into v_previous from app_private.bootstrap_requests where actor_user_id=v_actor;
  if found then
    if v_previous.request_id=p_request_id and v_previous.fingerprint=v_fingerprint then return v_previous.business_id; end if;
    raise exception using errcode='22023',message='IDEMPOTENCY_CONFLICT_OR_BUSINESS_EXISTS';
  end if;
  if exists(select 1 from public.businesses where owner_user_id=v_actor) then raise exception using errcode='22023',message='BUSINESS_EXISTS'; end if;
  insert into public.businesses(name,owner_user_id) values(btrim(p_business_name),v_actor) returning id into v_business;
  insert into public.locations(business_id,name) values(v_business,btrim(p_location_name));
  insert into public.business_members(business_id,user_id,role_code,scope_mode) values(v_business,v_actor,'owner','all_locations');
  insert into app_private.bootstrap_requests values(v_actor,p_request_id,v_fingerprint,v_business);
  perform app_private.audit(v_business,'business.bootstrapped',v_business);
  return v_business;
end $$;

create function public.set_member_access(p_business_id uuid,p_user_id uuid,p_role text,p_scope_mode text,p_location_ids uuid[],p_active boolean)
returns void language plpgsql security definer set search_path = '' as $$
declare v_actor uuid := app_private.require_owner(p_business_id); v_old public.business_members;
begin
  if p_active is null or p_role is null or p_role not in ('manager','receptionist','professional','finance_viewer') then raise exception using errcode='22023',message='INVALID_ROLE'; end if;
  select * into v_old from public.business_members where business_id=p_business_id and user_id=p_user_id for update;
  if not found then raise exception using errcode='42501',message='NOT_FOUND_OR_FORBIDDEN'; end if;
  if v_old.role_code='owner' then raise exception using errcode='23514',message='TRANSFER_OWNERSHIP_REQUIRED'; end if;
  if p_active then perform app_private.validate_scope(p_business_id,p_scope_mode,p_location_ids); end if;
  update public.business_members set role_code=p_role,scope_mode=case when p_active then p_scope_mode else 'selected_locations' end,active=p_active where business_id=p_business_id and user_id=p_user_id;
  delete from public.member_location_scopes where business_id=p_business_id and user_id=p_user_id;
  if p_active and p_scope_mode='selected_locations' then insert into public.member_location_scopes select p_business_id,p_user_id,x from (select distinct unnest(p_location_ids) x) q; end if;
  perform app_private.audit(p_business_id,'member.access_changed',p_user_id,jsonb_build_object('role',p_role,'active',p_active));
end $$;

create function public.transfer_ownership(p_business_id uuid,p_new_owner uuid) returns void language plpgsql security definer set search_path = '' as $$
declare v_actor uuid := app_private.require_owner(p_business_id);
begin
  if p_new_owner=v_actor then return; end if;
  if not exists(select 1 from public.businesses where id=p_business_id and owner_user_id=v_actor)
    or not exists(select 1 from public.business_members m join auth.users u on u.id=m.user_id where m.business_id=p_business_id and m.user_id=p_new_owner and m.active and u.email_confirmed_at is not null and (u.banned_until is null or u.banned_until<=now()))
  then raise exception using errcode='42501',message='NOT_FOUND_OR_FORBIDDEN'; end if;
  update public.business_members set role_code='manager' where business_id=p_business_id and user_id=v_actor;
  update public.business_members set role_code='owner',scope_mode='all_locations' where business_id=p_business_id and user_id=p_new_owner;
  delete from public.member_location_scopes where business_id=p_business_id and user_id=p_new_owner;
  update public.businesses set owner_user_id=p_new_owner where id=p_business_id;
  perform app_private.audit(p_business_id,'ownership.transferred',p_new_owner);
end $$;

create function public.issue_invitation(p_business_id uuid,p_email text,p_role text,p_scope_mode text,p_location_ids uuid[]) returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_actor uuid := app_private.require_owner(p_business_id); v_token text; v_id uuid; v_expiry timestamptz := now()+interval '7 days';
begin
  if p_email is null or lower(btrim(p_email)) !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' or char_length(p_email)>254 or p_role is null or p_role not in ('manager','receptionist','professional','finance_viewer') then raise exception using errcode='22023',message='VALIDATION_ERROR'; end if;
  perform app_private.validate_scope(p_business_id,p_scope_mode,p_location_ids);
  update app_private.invitations set revoked_at=now() where business_id=p_business_id and email=lower(btrim(p_email)) and accepted_at is null and revoked_at is null;
  v_token := encode(extensions.gen_random_bytes(32),'hex');
  insert into app_private.invitations(business_id,email,role_code,scope_mode,token_hash,expires_at,created_by)
  values(p_business_id,lower(btrim(p_email)),p_role,p_scope_mode,encode(extensions.digest(v_token,'sha256'),'hex'),v_expiry,v_actor) returning id into v_id;
  insert into app_private.invitation_locations select p_business_id,v_id,x from (select distinct unnest(p_location_ids) x) q;
  perform app_private.audit(p_business_id,'invitation.issued',v_id,jsonb_build_object('role',p_role));
  return jsonb_build_object('id',v_id,'token',v_token,'expires_at',v_expiry);
end $$;

create function public.accept_invitation(p_token text) returns uuid language plpgsql security definer set search_path = '' as $$
declare v_actor uuid := app_private.verified_uid(); v_invite app_private.invitations; v_business uuid; v_email text;
begin
  if p_token is null or p_token !~ '^[a-f0-9]{64}$' then raise exception using errcode='42501',message='NOT_FOUND_OR_FORBIDDEN'; end if;
  select business_id into v_business from app_private.invitations where token_hash=encode(extensions.digest(p_token,'sha256'),'hex');
  perform 1 from public.businesses where id=v_business and status='active' for update;
  if not found then raise exception using errcode='42501',message='NOT_FOUND_OR_FORBIDDEN'; end if;
  select * into v_invite from app_private.invitations where token_hash=encode(extensions.digest(p_token,'sha256'),'hex') for update;
  if not found then raise exception using errcode='42501',message='NOT_FOUND_OR_FORBIDDEN'; end if;
  select lower(email) into v_email from auth.users where id=v_actor;
  if v_invite.revoked_at is not null or v_invite.email<>v_email then raise exception using errcode='42501',message='NOT_FOUND_OR_FORBIDDEN'; end if;
  if v_invite.accepted_at is not null then
    if v_invite.accepted_by=v_actor and exists(select 1 from public.business_members where business_id=v_business and user_id=v_actor and active) then return v_business; end if;
    raise exception using errcode='42501',message='NOT_FOUND_OR_FORBIDDEN';
  end if;
  if v_invite.expires_at<=now() or exists(select 1 from public.business_members where business_id=v_business and user_id=v_actor and active) then raise exception using errcode='42501',message='NOT_FOUND_OR_FORBIDDEN'; end if;
  insert into public.business_members(business_id,user_id,role_code,scope_mode,active) values(v_business,v_actor,v_invite.role_code,v_invite.scope_mode,true)
  on conflict(business_id,user_id) do update set role_code=excluded.role_code,scope_mode=excluded.scope_mode,active=true;
  delete from public.member_location_scopes where business_id=v_business and user_id=v_actor;
  insert into public.member_location_scopes select business_id,v_actor,location_id from app_private.invitation_locations where invitation_id=v_invite.id;
  update app_private.invitations set accepted_by=v_actor,accepted_at=now() where id=v_invite.id;
  perform app_private.audit(v_business,'invitation.accepted',v_invite.id);
  return v_business;
end $$;

create function public.revoke_invitation(p_business_id uuid,p_invitation_id uuid) returns void language plpgsql security definer set search_path = '' as $$
declare v_actor uuid := app_private.require_owner(p_business_id);
begin
  update app_private.invitations set revoked_at=coalesce(revoked_at,now()) where id=p_invitation_id and business_id=p_business_id and accepted_at is null;
  if not found then raise exception using errcode='42501',message='NOT_FOUND_OR_FORBIDDEN'; end if;
  perform app_private.audit(p_business_id,'invitation.revoked',p_invitation_id);
end $$;

create function public.get_workspace_context() returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_actor uuid := app_private.verified_uid(); v_result jsonb;
begin
  select coalesce(jsonb_agg(jsonb_build_object(
    'id',b.id,'name',b.name,'status',b.status,'role',m.role_code,'scope_mode',m.scope_mode,
    'permissions',(select coalesce(jsonb_agg(rp.permission_code order by rp.permission_code),'[]'::jsonb) from public.role_permissions rp where rp.role_code=m.role_code),
    'locations',(select coalesce(jsonb_agg(jsonb_build_object('id',l.id,'name',l.name) order by l.name),'[]'::jsonb) from public.locations l where l.business_id=b.id and app_private.can_access(b.id,'workspace.read',l.id))
  ) order by b.name),'[]'::jsonb) into v_result
  from public.business_members m join public.businesses b on b.id=m.business_id
  where m.user_id=v_actor and m.active and app_private.can_access(b.id,'workspace.read');
  return v_result;
end $$;

create function public.list_business_members(p_business_id uuid) returns table(user_id uuid,display_name text,role_code text,scope_mode text,active boolean,location_ids uuid[]) language plpgsql stable security definer set search_path = '' as $$
begin
  if not app_private.can_access(p_business_id,'members.manage') then raise exception using errcode='42501',message='NOT_FOUND_OR_FORBIDDEN'; end if;
  return query select m.user_id,p.display_name,m.role_code,m.scope_mode,m.active,array(select s.location_id from public.member_location_scopes s where s.business_id=m.business_id and s.user_id=m.user_id order by s.location_id)
  from public.business_members m join public.profiles p on p.id=m.user_id where m.business_id=p_business_id order by m.created_at,m.user_id;
end $$;
create function public.list_invitations(p_business_id uuid) returns table(id uuid,email text,role_code text,expires_at timestamptz,accepted_at timestamptz,revoked_at timestamptz) language plpgsql stable security definer set search_path = '' as $$
begin
  if not app_private.can_access(p_business_id,'members.manage') then raise exception using errcode='42501',message='NOT_FOUND_OR_FORBIDDEN'; end if;
  return query select i.id,i.email,i.role_code,i.expires_at,i.accepted_at,i.revoked_at from app_private.invitations i where i.business_id=p_business_id order by i.expires_at desc limit 100;
end $$;

-- Reusable user-RPC/Edge authorization boundary. Caller JWT, never elevated identity.
create function public.authorize_workspace(p_business_id uuid,p_permission text,p_location_id uuid default null) returns void language plpgsql stable security invoker set search_path = '' as $$
begin
  if not app_private.can_access(p_business_id,p_permission,p_location_id,true) then raise exception using errcode='42501',message='NOT_FOUND_OR_FORBIDDEN'; end if;
end $$;

revoke all on function public.bootstrap_business(uuid,text,text),public.set_member_access(uuid,uuid,text,text,uuid[],boolean),public.transfer_ownership(uuid,uuid),public.issue_invitation(uuid,text,text,text,uuid[]),public.accept_invitation(text),public.revoke_invitation(uuid,uuid),public.get_workspace_context(),public.list_business_members(uuid),public.list_invitations(uuid),public.authorize_workspace(uuid,text,uuid) from public,anon,authenticated;
grant execute on function public.bootstrap_business(uuid,text,text),public.set_member_access(uuid,uuid,text,text,uuid[],boolean),public.transfer_ownership(uuid,uuid),public.issue_invitation(uuid,text,text,text,uuid[]),public.accept_invitation(text),public.revoke_invitation(uuid,uuid),public.get_workspace_context(),public.list_business_members(uuid),public.list_invitations(uuid),public.authorize_workspace(uuid,text,uuid) to authenticated;
