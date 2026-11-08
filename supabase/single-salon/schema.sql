-- ============================================================================
-- SALONZOFT — SINGLE-SALON INSTANCE SCHEMA (SUPABASE SQL EDITOR)
-- Architecture: 1 Dedicated Supabase Project + 1 GitHub Pages Site per Salon
-- ============================================================================

create extension if not exists pgcrypto;

-- 1. Salon Instance Settings (1 row per salon deployment)
create table if not exists public.salon_settings (
  id uuid primary key default gen_random_uuid(),
  salon_slug text not null unique default 'default-salon',
  name_en text not null,
  name_ar text not null,
  tagline_en text not null default 'Luxury Hair, Beauty & Wellness Studio',
  tagline_ar text not null default 'استوديو الفخامة للشعر والتجميل والعناية',
  currency text not null default 'OMR',
  timezone text not null default 'Asia/Muscat',
  whatsapp text not null default '+968 9000 0000',
  primary_color text not null default '#005A38',
  accent_color text not null default '#C89A3B',
  updated_at timestamptz not null default now()
);

-- 2. Salon Branches / Studios
create table if not exists public.salon_branches (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name_en text not null,
  name_ar text not null,
  city_en text not null,
  city_ar text not null,
  chairs_label text not null default '8 Styling Chairs · 2 VIP Suites',
  opening_hours text not null default '10:00 – 21:00',
  active boolean not null default true
);

-- 3. Stylists & Specialists
create table if not exists public.salon_staff (
  id uuid primary key default gen_random_uuid(),
  branch_code text references public.salon_branches(code) on delete set null,
  name_en text not null,
  name_ar text not null,
  role_en text not null,
  role_ar text not null,
  commission_percent numeric(5,2) not null default 35.00,
  active boolean not null default true
);

-- 4. Service Menu & Pricing
create table if not exists public.salon_services (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  category_en text not null,
  category_ar text not null,
  name_en text not null,
  name_ar text not null,
  duration_min integer not null check (duration_min > 0),
  price numeric(10,3) not null check (price >= 0),
  active boolean not null default true
);

-- 5. Client CRM & Colour Formulas
create table if not exists public.salon_clients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  vip_tier text not null default 'Emerald VIP',
  visits_count integer not null default 1,
  colour_formula text not null default '',
  care_notes text not null default '',
  patch_test_verified boolean not null default true,
  created_at timestamptz not null default now()
);

-- 6. Appointments (Online Client Bookings + Staff Walk-Ins)
create table if not exists public.salon_appointments (
  id uuid primary key default gen_random_uuid(),
  booking_ref text not null unique,
  branch_name text not null,
  client_name text not null,
  client_phone text not null,
  service_code text not null,
  service_name_en text not null,
  service_name_ar text not null,
  stylist_name_en text not null,
  stylist_name_ar text not null,
  booking_date date not null default current_date,
  slot_time text not null,
  price numeric(10,3) not null check (price >= 0),
  status text not null default 'confirmed'
    check (status in ('confirmed', 'checkedIn', 'inService', 'completed', 'cancelled')),
  notes text not null default '',
  source text not null default 'online' check (source in ('online', 'staff')),
  created_at timestamptz not null default now()
);

-- 7. POS Invoices & Daily Register
create table if not exists public.salon_invoices (
  id uuid primary key default gen_random_uuid(),
  receipt_no text not null unique,
  client_name text not null,
  itemsSummary text not null,
  subtotal numeric(10,3) not null,
  discount numeric(10,3) not null default 0,
  net_total numeric(10,3) not null,
  payment_method text not null check (payment_method in ('Card', 'Cash', 'Split')),
  created_at timestamptz not null default now()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) FOR SINGLE-SALON INSTANCE
-- ============================================================================
alter table public.salon_settings enable row level security;
alter table public.salon_branches enable row level security;
alter table public.salon_staff enable row level security;
alter table public.salon_services enable row level security;
alter table public.salon_clients enable row level security;
alter table public.salon_appointments enable row level security;
alter table public.salon_invoices enable row level security;

-- Public visitors (GitHub Pages online booking) can read public catalog tables:
create policy "Public read salon settings" on public.salon_settings for select using (true);
create policy "Public read active branches" on public.salon_branches for select using (active = true);
create policy "Public read active staff" on public.salon_staff for select using (active = true);
create policy "Public read active services" on public.salon_services for select using (active = true);

-- Public visitors can submit new online bookings:
create policy "Public create online appointment" on public.salon_appointments
  for insert to anon, authenticated
  with check (status = 'confirmed' and source = 'online');

-- Authenticated salon staff/owners have full operational access:
create policy "Staff full access settings" on public.salon_settings
  for all to authenticated using (true) with check (true);
create policy "Staff full access branches" on public.salon_branches
  for all to authenticated using (true) with check (true);
create policy "Staff full access staff" on public.salon_staff
  for all to authenticated using (true) with check (true);
create policy "Staff full access services" on public.salon_services
  for all to authenticated using (true) with check (true);
create policy "Staff full access clients" on public.salon_clients
  for all to authenticated using (true) with check (true);
create policy "Staff full access appointments" on public.salon_appointments
  for all to authenticated using (true) with check (true);
create policy "Staff full access invoices" on public.salon_invoices
  for all to authenticated using (true) with check (true);
