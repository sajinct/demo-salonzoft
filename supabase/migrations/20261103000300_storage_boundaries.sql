insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values
 ('client-files','client-files',false,5242880,array['application/pdf','image/png','image/jpeg','image/webp']),
 ('marketing-assets','marketing-assets',true,5242880,array['image/png','image/jpeg','image/webp']);

create function app_private.can_access_file(p_bucket text,p_name text,p_write boolean default false) returns boolean language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.file_objects f where f.bucket_id=p_bucket and f.object_name=p_name
   and app_private.can_access(f.business_id,case when p_bucket='marketing-assets' then 'marketing.manage' when p_write then 'files.write' else 'files.read' end,f.location_id,p_write));
$$;
revoke all on function app_private.can_access_file(text,text,boolean) from public,anon,authenticated;
grant execute on function app_private.can_access_file(text,text,boolean) to authenticated;
create policy private_file_read on storage.objects for select to authenticated using(bucket_id='client-files' and app_private.can_access_file(bucket_id,name,false));
create policy intentional_marketing_read on storage.objects for select to anon,authenticated using(bucket_id='marketing-assets');
create policy registered_file_insert on storage.objects for insert to authenticated with check(bucket_id in ('client-files','marketing-assets') and app_private.can_access_file(bucket_id,name,true));
create policy registered_file_update on storage.objects for update to authenticated using(app_private.can_access_file(bucket_id,name,true)) with check(app_private.can_access_file(bucket_id,name,true));
create policy registered_file_delete on storage.objects for delete to authenticated using(app_private.can_access_file(bucket_id,name,true));

create function public.register_file(p_business_id uuid,p_location_id uuid,p_extension text,p_public_marketing boolean default false) returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_actor uuid := app_private.verified_uid(); v_id uuid := gen_random_uuid(); v_bucket text; v_path text;
begin
  if p_public_marketing is null or p_extension is null or p_extension not in ('pdf','png','jpg','jpeg','webp') or (p_public_marketing and p_extension='pdf') then raise exception using errcode='22023',message='INVALID_FILE_TYPE'; end if;
  perform 1 from public.businesses where id=p_business_id for update;
  if p_location_id is null or not app_private.can_access(p_business_id,case when p_public_marketing then 'marketing.manage' else 'files.write' end,p_location_id,true) then raise exception using errcode='42501',message='NOT_FOUND_OR_FORBIDDEN'; end if;
  v_bucket := case when p_public_marketing then 'marketing-assets' else 'client-files' end;
  v_path := p_business_id::text || '/' || p_location_id::text || '/' || v_id::text || '.' || p_extension;
  insert into public.file_objects(id,business_id,location_id,bucket_id,object_name,created_by) values(v_id,p_business_id,p_location_id,v_bucket,v_path,v_actor);
  perform app_private.audit(p_business_id,case when p_public_marketing then 'marketing.registered' else 'file.registered' end,v_id,'{}'::jsonb,p_location_id);
  return jsonb_build_object('id',v_id,'bucket',v_bucket,'path',v_path);
end $$;
revoke all on function public.register_file(uuid,uuid,text,boolean) from public,anon,authenticated;
grant execute on function public.register_file(uuid,uuid,text,boolean) to authenticated;
-- No client/medical record upload UI exists yet. These are capability/location
-- boundaries for registered workspace documents; clinical parent rules arrive in 05.
