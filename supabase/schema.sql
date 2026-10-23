-- LYST database schema: the full picture, for setting up a NEW, empty Supabase project.
-- Do NOT re-run it on the live database. It keeps data, but it drops and recreates the
-- sign-up trigger and every policy and overwrites functions. Changes to an existing
-- database go in supabase/migrations/ (see supabase/README.md), and are also mirrored here.

-- ─────────────────────────────────────────────────────────────
-- Profiles: one row per signed-up host (Supabase Auth users).
-- Role 'admin' unlocks /admin. Set it manually (see bottom of file).
-- ─────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  created_at  timestamptz not null default now(),
  full_name   text,
  email       text,
  role        text not null default 'host' check (role in ('host', 'admin')),
  -- When the host ticked "I confirm I am 16 or older" at sign-up. Null for accounts made elsewhere.
  age_confirmed_at timestamptz
);
-- Databases created before the column existed.
alter table public.profiles add column if not exists age_confirmed_at timestamptz;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, age_confirmed_at)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    case when (new.raw_user_meta_data ->> 'age_confirmed_16') = 'true' then now() end
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles where id = (select auth.uid()) and role = 'admin'
  );
$$;

-- ─────────────────────────────────────────────────────────────
-- Consultation requests (from the "Book a consultation" flow).
-- ─────────────────────────────────────────────────────────────
create table if not exists public.consultation_requests (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  name            text not null check (char_length(name) between 1 and 200),
  email           text not null check (char_length(email) between 3 and 320),
  phone           text check (char_length(phone) <= 50),
  event_context   text check (char_length(event_context) <= 4000),
  preferred_date  date,
  preferred_time  text check (char_length(preferred_time) <= 50),
  source          text not null default 'direct'
                  check (source in ('instagram', 'tiktok', 'facebook', 'direct', 'other')),
  status          text not null default 'new'
                  check (status in ('new', 'confirmed', 'completed', 'cancelled')),
  admin_notes     text
);
create index if not exists consultation_requests_created_idx
  on public.consultation_requests (created_at desc);

-- ─────────────────────────────────────────────────────────────
-- Page views: cookieless, no IP or raw user-agent stored.
-- visitor_hash = sha256(ip + user-agent + daily-rotating salt), computed server-side,
-- so we can count unique visitors per day without tracking anyone across days.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.page_views (
  id            bigint generated always as identity primary key,
  created_at    timestamptz not null default now(),
  path          text not null check (char_length(path) <= 500),
  source        text not null default 'direct'
                check (source in ('instagram', 'tiktok', 'facebook', 'direct', 'other')),
  referrer_host text check (char_length(referrer_host) <= 255),
  utm_campaign  text check (char_length(utm_campaign) <= 255),
  device        text not null default 'unknown' check (device in ('mobile', 'tablet', 'desktop', 'unknown')),
  visitor_hash  text not null
);
create index if not exists page_views_created_idx on public.page_views (created_at desc);

-- ─────────────────────────────────────────────────────────────
-- Row Level Security.
-- Public site writes go through server routes using the service-role key
-- (which bypasses RLS). Browsers get NO direct table access.
-- Only signed-in admins can read, and update consultation status.
-- ─────────────────────────────────────────────────────────────
alter table public.profiles               enable row level security;
alter table public.consultation_requests  enable row level security;
alter table public.page_views             enable row level security;

drop policy if exists "profiles: read own or admin" on public.profiles;
create policy "profiles: read own or admin" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or public.is_admin());

drop policy if exists "consultations: admin read" on public.consultation_requests;
create policy "consultations: admin read" on public.consultation_requests
  for select to authenticated using (public.is_admin());

drop policy if exists "consultations: admin update" on public.consultation_requests;
create policy "consultations: admin update" on public.consultation_requests
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "page_views: admin read" on public.page_views;
create policy "page_views: admin read" on public.page_views
  for select to authenticated using (public.is_admin());

-- ─────────────────────────────────────────────────────────────
-- Admin dashboard statistics (visitors, sources, devices, top pages, daily series).
-- Only callable by a signed-in admin. "visitors" = sum of each day's unique visitors.
-- ─────────────────────────────────────────────────────────────
create or replace function public.admin_stats(days int default 30)
returns json
language plpgsql
stable
security definer set search_path = ''
as $$
declare
  since timestamptz := now() - make_interval(days => days);
begin
  if not public.is_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  return json_build_object(
    'days', days,
    'views', (select count(*) from public.page_views where created_at >= since),
    'visitors', (
      select coalesce(sum(u), 0) from (
        select count(distinct visitor_hash) as u
        from public.page_views where created_at >= since
        group by (created_at at time zone 'utc')::date
      ) d
    ),
    'sources', (
      select coalesce(json_agg(json_build_object('source', source, 'views', c, 'visitors', u) order by c desc), '[]'::json)
      from (
        select source, count(*) as c, count(distinct visitor_hash) as u
        from public.page_views where created_at >= since group by source
      ) s
    ),
    'devices', (
      select coalesce(json_agg(json_build_object('device', device, 'views', c) order by c desc), '[]'::json)
      from (
        select device, count(*) as c from public.page_views where created_at >= since group by device
      ) dv
    ),
    'top_pages', (
      select coalesce(json_agg(json_build_object('path', path, 'views', c) order by c desc), '[]'::json)
      from (
        select path, count(*) as c from public.page_views where created_at >= since
        group by path order by c desc limit 8
      ) tp
    ),
    'daily', (
      select coalesce(json_agg(json_build_object('day', day, 'views', c, 'visitors', u) order by day), '[]'::json)
      from (
        select (created_at at time zone 'utc')::date as day, count(*) as c, count(distinct visitor_hash) as u
        from public.page_views where created_at >= since group by 1
      ) x
    )
  );
end;
$$;

revoke all on function public.admin_stats(int) from public, anon;
grant execute on function public.admin_stats(int) to authenticated;

-- ─────────────────────────────────────────────────────────────
-- AFTER you sign up once on the site, make yourself admin:
--   update public.profiles set role = 'admin' where email = 'YOUR-EMAIL-HERE';
-- ─────────────────────────────────────────────────────────────
