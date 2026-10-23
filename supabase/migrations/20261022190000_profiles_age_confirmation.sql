-- Migration: record the "I confirm I am 16 or older" tick from sign-up on each host profile.
--
-- Adds profiles.age_confirmed_at and updates the sign-up trigger function to fill it.
-- Safe on a live database: nothing is dropped, no existing rows change, and it runs as one
-- transaction (all or nothing). Running it twice is harmless.
-- Order matters: the column must exist before the new function body refers to it.

begin;

alter table public.profiles
  add column if not exists age_confirmed_at timestamptz;

comment on column public.profiles.age_confirmed_at is
  'When the host ticked "I confirm I am 16 or older" at sign-up. Null for accounts created before 2026-10-22 or outside the sign-up form.';

-- Same signature, owner and security settings as before; the existing on_auth_user_created
-- trigger keeps pointing at it, so the trigger itself is not touched.
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

commit;

-- ── Check (run after applying; expect one row: age_confirmed_at | timestamp with time zone) ──
-- select column_name, data_type
-- from information_schema.columns
-- where table_schema = 'public' and table_name = 'profiles' and column_name = 'age_confirmed_at';
--
-- ── Undo (only if something is wrong): restore the previous function, then drop the column ──
-- begin;
-- create or replace function public.handle_new_user()
-- returns trigger language plpgsql security definer set search_path = '' as $$
-- begin
--   insert into public.profiles (id, email, full_name)
--   values (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
--   return new;
-- end;
-- $$;
-- alter table public.profiles drop column if exists age_confirmed_at;
-- commit;
