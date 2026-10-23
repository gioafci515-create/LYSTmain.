-- Read-only security check. Paste into Supabase -> SQL Editor -> Run. Changes nothing.

-- 1. Every table in the public schema, and whether Row Level Security is on.
--    Expect rls_enabled = true on every row.
select c.relname            as table_name,
       c.relrowsecurity     as rls_enabled,
       c.relforcerowsecurity as rls_forced_for_owner,
       (select count(*) from pg_policies p
         where p.schemaname = 'public' and p.tablename = c.relname) as policies
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind in ('r', 'p')
order by 1;

-- 2. Every policy: who it applies to and what it allows.
select tablename, policyname, cmd, roles, qual as using_expr, with_check
from pg_policies
where schemaname = 'public'
order by tablename, policyname;

-- 3. Functions anon (logged-out visitors) may call. Expect only is_admin (returns false for them)
--    and handle_new_user (a trigger function: Postgres refuses to run it as a direct call).
--    admin_stats must NOT be listed.
select p.proname as function_name, p.prosecdef as security_definer
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and has_function_privilege('anon', p.oid, 'execute')
order by 1;
