-- ============================================================================
-- MIZNORA SALON & SPA (demo.salonzoft.com) — SUPABASE SQL SCHEMA & SEED
-- Supabase Project: https://supabase.com/dashboard/project/kbjyknzcneuhizhxkbwk/sql/new
-- ============================================================================

create extension if not exists pgcrypto;

-- 1. Salon Instance Settings
create table if not exists public.salon_settings (
  id uuid primary key default gen_random_uuid(),
  salon_slug text not null unique default 'miznora',
  name_en text not null,
  name_ar text not null,
  tagline_en text not null default 'Luxury Hair, Bridal & Wellness Spa',
  tagline_ar text not null default 'الفخامة في العناية بالشعر والعرائس والسبا',
  currency text not null default 'OMR',
  timezone text not null default 'Asia/Muscat',
  whatsapp text not null default '+968 9400 8820',
  primary_color text not null default '#005A38',
  accent_color text not null default '#C89A3B',
  updated_at timestamptz not null default now()
);

-- 2. Salon Branches
create table if not exists public.salon_branches (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name_en text not null,
  name_ar text not null,
  city_en text not null,
  city_ar text not null,
  chairs_label text not null default '12 Styling Chairs · 3 VIP Suites',
  opening_hours text not null default '10:00 – 21:00',
  active boolean not null default true
);

-- 3. Stylists & Specialists
create table if not exists public.salon_staff (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  branch_code text references public.salon_branches(code) on delete set null,
  name_en text not null,
  name_ar text not null,
  role_en text not null,
  role_ar text not null,
  chair_en text not null default 'Chair 01',
  chair_ar text not null default 'كرسي ٠١',
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
  tier_en text not null default 'Emerald VIP · 1 Visit',
  tier_ar text not null default 'نخبة الزمرد · زيارة واحدة',
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
  summary_en text not null,
  summary_ar text not null,
  net_total numeric(10,3) not null,
  payment_method text not null check (payment_method in ('Card', 'Cash', 'Split')),
  time_label text not null default 'Just now',
  created_at timestamptz not null default now()
);

-- ============================================================================
-- ROW LEVEL SECURITY & GRANTS FOR MIZNORA DEMO INSTANCE
-- ============================================================================
alter table public.salon_settings enable row level security;
alter table public.salon_branches enable row level security;
alter table public.salon_staff enable row level security;
alter table public.salon_services enable row level security;
alter table public.salon_clients enable row level security;
alter table public.salon_appointments enable row level security;
alter table public.salon_invoices enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert, update on all tables in schema public to anon, authenticated;

drop policy if exists "Miznora demo access settings" on public.salon_settings;
create policy "Miznora demo access settings" on public.salon_settings for all to anon, authenticated using (true) with check (true);

drop policy if exists "Miznora demo access branches" on public.salon_branches;
create policy "Miznora demo access branches" on public.salon_branches for all to anon, authenticated using (true) with check (true);

drop policy if exists "Miznora demo access staff" on public.salon_staff;
create policy "Miznora demo access staff" on public.salon_staff for all to anon, authenticated using (true) with check (true);

drop policy if exists "Miznora demo access services" on public.salon_services;
create policy "Miznora demo access services" on public.salon_services for all to anon, authenticated using (true) with check (true);

drop policy if exists "Miznora demo access clients" on public.salon_clients;
create policy "Miznora demo access clients" on public.salon_clients for all to anon, authenticated using (true) with check (true);

drop policy if exists "Miznora demo access appointments" on public.salon_appointments;
create policy "Miznora demo access appointments" on public.salon_appointments for all to anon, authenticated using (true) with check (true);

drop policy if exists "Miznora demo access invoices" on public.salon_invoices;
create policy "Miznora demo access invoices" on public.salon_invoices for all to anon, authenticated using (true) with check (true);

-- ============================================================================
-- INITIAL MIZNORA SALON & SPA SEED DATA
-- ============================================================================
insert into public.salon_settings (salon_slug, name_en, name_ar, tagline_en, tagline_ar, currency, timezone, whatsapp)
values ('miznora', 'Miznora Salon & Spa', 'ميزنورا للصالون والسبا', 'Luxury Hair, Bridal & Wellness Spa · Powered by Salonzoft', 'الفخامة في العناية بالشعر والعرائس والسبا · يعمل بنظام سالونزوفت', 'OMR', 'Asia/Muscat', '+968 9400 8820')
on conflict (salon_slug) do nothing;

insert into public.salon_branches (code, name_en, name_ar, city_en, city_ar, chairs_label)
values
  ('muscat-almouj', 'Miznora · Al Mouj Muscat', 'ميزنورا · الموج مسقط', 'Muscat', 'مسقط', '12 Chairs · 3 VIP Suites'),
  ('seeb-boulevard', 'Miznora · Seeb Boulevard', 'ميزنورا · السيب بوليفارد', 'Seeb', 'السيب', '8 Chairs · 2 Bridal Lounges'),
  ('salalah-sanctuary', 'Miznora · Salalah Spa Sanctuary', 'ميزنورا · ملاذ صلالة للسبا', 'Salalah', 'صلالة', '8 Spa Suites · 2 Hammams')
on conflict (code) do nothing;

insert into public.salon_services (code, category_en, category_ar, name_en, name_ar, duration_min, price)
values
  ('balayage-gloss', 'Hair & Colour', 'الشعر والصبغات', 'Miznora Signature Balayage & Gloss', 'بالياج ولمعة ميزنورا المميزة', 150, 44.000),
  ('keratin-ritual', 'Keratin & Treatments', 'الكيراتين والمعالجات', 'Botanical Caviar Keratin Ritual', 'علاج الكيراتين النباتي والكافيار', 120, 55.000),
  ('bridal-styling', 'Bridal & Makeup', 'العرائس والمكياج', 'Royal Bridal Hair & Luminous Makeup', 'تصفيف ومكياج العروس الملكي', 180, 120.000),
  ('royal-hammam', 'Spa & Hammam', 'السبا والحمام الملكي', 'Omani Frankincense Royal Hammam', 'حمام اللبان العُماني الملكي', 90, 68.000),
  ('hydra-scalp', 'Spa & Hammam', 'السبا والحمام الملكي', 'Hydra-Glow Facial & Scalp Spa', 'فيشل النضارة وسبا فروة الرأس', 75, 52.000),
  ('silk-blowout', 'Hair & Colour', 'الشعر والصبغات', 'Couture Cut & Silk Blowout', 'قص كوتور وسشوار حريري', 60, 24.000)
on conflict (code) do nothing;

insert into public.salon_appointments (booking_ref, branch_name, client_name, client_phone, service_code, service_name_en, service_name_ar, stylist_name_en, stylist_name_ar, slot_time, price, status, notes, source)
values
  ('MZ-1042', 'Miznora · Al Mouj Muscat', 'Alya Al-Harthi', '+968 9912 3401', 'balayage-gloss', 'Miznora Signature Balayage & Gloss', 'بالياج ولمعة ميزنورا المميزة', 'Noura · Chair 01', 'نورة · كرسي ٠١', '10:00', 44.000, 'inService', 'Warm honey face-framing highlights', 'online'),
  ('MZ-1043', 'Miznora · Al Mouj Muscat', 'Maha Al-Busaidi', '+968 9820 1140', 'keratin-ritual', 'Botanical Caviar Keratin Ritual', 'علاج الكيراتين النباتي والكافيار', 'Layla · Suite A', 'ليلى · جناح أ', '11:30', 55.000, 'checkedIn', 'Formaldehyde-free botanical blend', 'online'),
  ('MZ-1044', 'Miznora · Seeb Boulevard', 'Reem Al-Zadjali', '+968 9711 8890', 'bridal-styling', 'Royal Bridal Hair & Luminous Makeup', 'تصفيف ومكياج العروس الملكي', 'Sara · VIP Bridal Suite', 'سارة · جناح العرائس VIP', '13:30', 120.000, 'confirmed', 'Includes veil pinning & touch-up kit', 'staff'),
  ('MZ-1045', 'Miznora · Salalah Spa Sanctuary', 'Salma Al-Kathiri', '+968 9544 2210', 'royal-hammam', 'Omani Frankincense Royal Hammam', 'حمام اللبان العُماني الملكي', 'Huda · Hammam 01', 'هدى · حمام ٠١', '15:00', 68.000, 'confirmed', 'Hojari frankincense steam & rose clay mask', 'online')
on conflict (booking_ref) do nothing;
