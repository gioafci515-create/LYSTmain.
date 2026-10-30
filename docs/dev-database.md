# Local development database (`lyst-dev`)

Local development and testing use a **separate, free Supabase project called `lyst-dev`**, never the production database (`fdolchqrxdstgtluwcyj`). Sign-up tests, admin tests and test bookings then can't touch real clients' data, and test accounts can be deleted freely.

Production keys live only in Vercel. `D:\dev\lyst\.env.local` holds only `lyst-dev` keys.

## 1. Create the project (about 5 minutes)

1. Go to https://supabase.com/dashboard and sign in with **your own** account.
   - Tip: if you use the account the Claude Supabase connector is logged into (it shows "gioafci515-create's Project"), Claude can also run read-only database checks on `lyst-dev` directly.
2. **New project** and fill in:
   - **Organization:** your personal one. The free plan allows 2 active projects per organization.
   - **Name:** `lyst-dev`
   - **Database password:** generate a strong one and save it in your password manager.
   - **Region:** Central EU (Frankfurt), the closest to Tbilisi.
   - **Plan:** Free
3. Wait until the project shows as healthy (1–2 minutes).

Free projects pause after about a week without activity. Restore them from the dashboard with one click; no data is lost.

## 2. Create the tables

1. Open `lyst-dev`, then **SQL Editor**, then **New query**.
2. Paste the **whole** of `supabase/schema.sql` and click **Run**. On a new, empty project this is the right file: it already contains every migration. The warning about "destructive operations" is expected here, because there is nothing to destroy yet.
3. New query: paste `supabase/checks/verify_rls.sql` and click **Run**. Expect `profiles`, `consultation_requests` and `page_views`, each with `rls_enabled = true`.

## 3. Auth settings

1. **Authentication → URL Configuration:**
   - **Site URL:** `http://localhost:3000`
   - **Redirect URLs:** add `http://localhost:3000/**`
2. **Authentication → Sign In / Providers → Email:** keep **Confirm email** on, so confirmation emails can be tested.
3. Supabase's built-in mailer only delivers to members of the project's team, and only a few per hour. For email tests, sign up with **the email of your Supabase account**. For extra test users, use **Authentication → Users → Add user → Create new user** and tick **Auto Confirm User**.

## 4. Point local development at it

1. **Project Settings → API Keys** and copy three values: the **Project URL**, the **anon / publishable** key, and the **service_role / secret** key.
2. Open `D:\dev\lyst\.env.local` and replace the values. Keep `ANALYTICS_SALT` as it is; it's already a local-only value.
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<your-lyst-dev-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<lyst-dev anon key>
   SUPABASE_SERVICE_ROLE_KEY=<lyst-dev service_role key>
   ANALYTICS_SALT=<leave the existing value>
   ```
3. Check it's not production. `fdolchqrxdstgtluwcyj` must **not** appear anywhere in the file:
   ```
   findstr fdolchqrxdstgtluwcyj D:\dev\lyst\.env.local
   ```
   No output means it's safe.
4. **Never** add `lyst-dev` keys to Vercel. Vercel keeps the production keys.
5. Restart `npm run dev`.

## 5. Make yourself admin in dev

1. Sign up at http://localhost:3000/signup with your Supabase account email, then open the confirmation email.
2. In `lyst-dev` → **SQL Editor**:
   ```sql
   update public.profiles set role = 'admin' where email = 'YOUR-EMAIL';
   ```
3. Log in at http://localhost:3000/admin.

## Cleaning up test data

Test users: **Authentication → Users** → select → **Delete**. Their profile row is deleted with them. Test bookings: **Table Editor → consultation_requests** → select rows → **Delete**. None of this affects production.
