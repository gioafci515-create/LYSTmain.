# Database

| File | Use it for |
|---|---|
| `schema.sql` | A brand-new, empty Supabase project only. Never re-run on the live database. |
| `migrations/*.sql` | Changes to the live database, applied once each, oldest first. |
| `checks/verify_rls.sql` | Read-only check that Row Level Security and policies are in place. |
| `admin_stats.sql` | Already part of `schema.sql`; kept for projects created before the stats function existed. |

Every migration is also mirrored into `schema.sql`, so a new project gets the same result in one go.

## Before applying a migration: back up

Quick (enough for additive migrations): Supabase Dashboard → **Table Editor** → open each table (`profiles`, `consultation_requests`, `page_views`) → **Export → CSV**.

Full dump (schema + data of the `public` schema), needs PostgreSQL 17 client tools (`winget install PostgreSQL.PostgreSQL.17`):

1. Dashboard → **Connect** → copy the **Session pooler** connection string (works over IPv4) and put in your database password.
2. Run:
   ```
   pg_dump "<session pooler connection string>" --schema=public --format=custom --file=lyst-backup-YYYY-MM-DD.dump
   ```
3. Keep the file somewhere private (it contains guest and host personal data). Restore with `pg_restore --clean --no-owner -d "<connection string>" lyst-backup-YYYY-MM-DD.dump` only if needed.

Paid plans also keep automatic daily backups (Dashboard → **Database → Backups**).

## Applying a migration

1. Back up (above).
2. Dashboard → **SQL Editor** → **New query** → paste the whole migration file → **Run**. It runs as one transaction: it either fully applies or changes nothing.
3. Run the check query at the bottom of the migration file.
4. Note the date it was applied in the table below and commit.

| Migration | Applied to live |
|---|---|
| `20261022190000_profiles_age_confirmation.sql` | 2026-10-23 (CSV backup taken first) |
