-- TEST HARNESS ONLY. This is not a Supabase migration or an Auth implementation.
-- Minimal managed-schema compatibility fixture for real PostgreSQL WASM SQL tests.
create role anon nologin;
create role authenticated nologin;
create role service_role nologin bypassrls;
create schema auth;
create schema storage;
create schema extensions;
grant usage on schema public,auth,storage,extensions to anon,authenticated;
create table auth.users (
 instance_id uuid, id uuid primary key, aud text, role text, email text unique,
 encrypted_password text, email_confirmed_at timestamptz, banned_until timestamptz,
 raw_app_meta_data jsonb, raw_user_meta_data jsonb, created_at timestamptz, updated_at timestamptz,
 confirmation_token text,email_change text,email_change_token_new text,recovery_token text
);
create table auth.identities(id uuid primary key,user_id uuid references auth.users(id),provider_id text,identity_data jsonb,provider text,last_sign_in_at timestamptz,created_at timestamptz,updated_at timestamptz,unique(provider_id,provider));
create function auth.uid() returns uuid language sql stable as $$ select (nullif(current_setting('request.jwt.claims',true),'')::jsonb->>'sub')::uuid $$;
create function auth.jwt() returns jsonb language sql stable as $$ select coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb $$;
grant execute on function auth.uid(),auth.jwt() to anon,authenticated;
create table storage.buckets(id text primary key,name text,public boolean default false,file_size_limit bigint,allowed_mime_types text[]);
create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text references storage.buckets(id),name text,owner_id text,unique(bucket_id,name));
alter table storage.objects enable row level security;
grant select,insert,update,delete on storage.objects to anon,authenticated;
