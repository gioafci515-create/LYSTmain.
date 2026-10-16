-- Adds ONLY the admin statistics function. Paste into Supabase -> SQL Editor -> Run.
-- (No drop statements, so Supabase will not show a destructive-operation warning.)

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
