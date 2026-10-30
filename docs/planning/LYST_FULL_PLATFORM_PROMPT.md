# Build prompt: LYST full platform

Paste everything below the line into Claude Code, in a new empty folder.

---

Build **LYST**, a production-ready digital invitation and event-experience platform from Tbilisi, Georgia. Tagline: "მოიწვიე ჭკვიანურად." ("Invite smartly."). Reference site for content and tone: https://lyst-nu.vercel.app/

It must be **fully functional, not a mockup**: real accounts, real database, real file uploads, real emails, a working admin panel. Every button must do something. No placeholder links (`#`), no fake data in production. Show proper empty states instead.

## 1. Product summary

Each event gets **one link**. That link follows the guest through three phases:

1. **Before:** a mobile-first invitation with hosts, date and time, venue with map, dress code, schedule and host message. The guest replies in one tap (attending / not attending / maybe) and adds plus-ones, dietary needs and a note. They can add the event to their calendar.
2. **During:** guests use the same link to upload photos (Event Camera), record voice messages (Voice Guestbook), write letters (Letters From the Room) and join photo challenges.
3. **After:** all content stays in a private archive and a "time capsule" (messages that unlock on a chosen date). Hosts can download everything.

Event types: wedding, birthday, private dinner, corporate, charity, other.

## 2. Design direction: super professional, minimalist

Think Linear, Vercel, Aesop and Apple editorial pages. Quiet confidence, nothing decorative without a job.

- **Color:** near-monochrome. Define tokens on `:root`:
  - background `#FFFFFF`, surface `#FAFAFA`, border `#EAEAEA`, text `#0A0A0A`, muted text `#6B6B6B`
  - one accent only, used sparingly for focus rings and key states (a deep neutral like `#111` or a muted warm tone)
  - semantic colors for success, warning and error, all desaturated
  - full dark mode with the same tokens
- **Typography:** Outfit for headings and Inter for body, plus Noto Sans Georgian as a fallback so Georgian renders perfectly. Use a strict type scale (12 / 14 / 16 / 20 / 24 / 32 / 48 / 72). Headlines get tight tracking. Body is 16px with a line height of 1.6. Keep lines to 65 characters or fewer.
- **Layout:** 12-column grid, 1200px max width, 8px spacing system, generous whitespace (96–160px between sections on desktop). Mobile first, with no horizontal scroll at 360px.
- **Components:** 1px hairline borders, 8–12px radius, no heavy shadows (at most one subtle shadow for overlays). Primary button is solid black; secondary is outline; links are ghost style. Large touch targets of at least 44px.
- **Imagery:** black-and-white event photography, consistent crop ratios, optimized with `next/image`.
- **Motion:** subtle and purposeful only. 150–250ms ease-out fades and small translates on scroll reveal. No bouncing, parallax overload or autoplaying carousels. Respect `prefers-reduced-motion`.
- **Copy:** short, calm, confident. No exclamation marks or emoji in the UI.
- **Banned:** gradients, glassmorphism, stock 3D blobs, more than one accent color, centered walls of text, generic SaaS templates.
- Build a small design system first (`/components/ui`): Button, Input, Textarea, Select, Checkbox, Radio, Switch, Dialog, Drawer, Dropdown, Tabs, Toast, Table, Badge, Avatar, Skeleton, EmptyState, Pagination, FileUpload. Use it everywhere.

## 3. Languages

Georgian is the default (`/ka`), with English (`/en`) and Russian (`/ru`) via `next-intl`. Use locale-prefixed routes, a switcher in the header and footer, and remember the user's choice. All UI strings, emails and the invitation page itself must be translated. Hosts pick their invitation's language.

## 4. User roles and permissions

| Role | Can do |
|---|---|
| **Guest** (no account needed) | Open the invitation link, RSVP, upload photos and voice, write letters. Identified by a personal guest token in the link. |
| **Host** (registered user) | Create and manage their own events, guests, templates, media and settings. |
| **Admin** | Everything: all users, events, content, templates, plans, site settings, moderation and analytics. |
| **Super admin** | Same as admin, plus managing other admins. |

Enforce permissions **on the server and in the database** (Supabase Row Level Security), never only in the UI.

## 5. Authentication: every user can sign in

- Sign up and sign in with email and password, Google OAuth, and a passwordless magic link.
- Email verification is required before publishing an event.
- Forgot password and reset password flows.
- Password rules: at least 8 characters, with a strength meter.
- "Remember me" and secure HTTP-only cookie sessions (`@supabase/ssr`).
- Sign out, plus "sign out of all devices."
- Account settings: name, avatar, email change (with re-verification), password change, language, notification preferences, delete account (with confirmation and data removal).
- Protected routes via middleware: `/dashboard/**` needs a signed-in user, `/admin/**` needs the admin role. Redirect back to the original page after sign-in.
- Rate limiting and Cloudflare Turnstile on sign-up, sign-in, reset and public forms.
- Optional: 2FA (TOTP) for admins.

## 6. Pages

### Public marketing site
- `/` **Home:** hero, three phases (Anticipation / Participation / Memory), invitation phone mockup, host dashboard preview, experiences showcase (Event Camera / Voice Guestbook / Letters), testimonials, final CTA.
- `/product`: feature deep-dive.
- `/invitations`: template gallery, filterable by event type and style, with a live preview of each template.
- `/experiences`: the interactive features.
- `/how-it-works`: Create → Invite → Experience → Memory.
- `/pricing`: Starter, Premium (recommended) and Exclusive; a comparison table; FAQ.
- `/about`: mission, story, Studio Tbilisi.
- `/contact`: contact form (saved to the database and emailed to the team), plus email and socials.
- `/privacy`, `/terms`, `/cookies`: real legal pages.
- Custom 404 and 500 pages in the same style.

### Auth
- `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/verify-email`, `/auth/callback`.

### Host app (`/dashboard`)
- **Overview:** upcoming events, RSVP totals, recent activity.
- **Events:** list with search, filter and status (draft / published / ended / archived).
- **Create event wizard** (autosaves as a draft):
  1. event type
  2. template and style (colors, font pairing, cover image)
  3. details (title, hosts, date and time with timezone, venue plus Google Maps or Mapbox picker, dress code, schedule or agenda, message, FAQ)
  4. RSVP settings (deadline, plus-ones allowed, custom questions, meal choices, capacity)
  5. features on or off (camera, voice guestbook, letters, time capsule, photo challenges, gallery visibility)
  6. preview on a phone frame
  7. publish, choosing a custom slug such as `lyst.ge/nino-giorgi`
- **Event detail:**
  - **Guests:** add one by one, bulk import from CSV, groups and tables, personal invite links, QR codes, send invites by email, copy a share link (WhatsApp and Messenger ready).
  - **RSVPs:** live stats (confirmed / declined / pending / maybe, total headcount including plus-ones), filters, CSV and Excel export, reminder emails to people who haven't answered.
  - **Media:** photo gallery, voice messages with a player, letters. Approve or hide items, download all as ZIP.
  - **Time capsule:** set an unlock date. Notify guests when it opens.
  - **Settings:** edit details, duplicate the event, unpublish, password-protect, delete.
- **Templates:** saved custom styles.
- **Billing:** current plan, limits used (events, guests, storage), upgrade request.
- **Account settings.**

### Guest invitation (`/e/[slug]`, personal: `/e/[slug]?g=<token>`)
- Mobile-first and fast, with a perfect Lighthouse score.
- Shows the event details, map, add-to-calendar (`.ics` plus a Google Calendar link), countdown, RSVP form, schedule and FAQ.
- During and after the event: camera upload (multiple photos, client-side compression), voice recorder (MediaRecorder, maximum 60 seconds, playback before sending), letter form and a shared gallery if the host allows it.
- Open Graph image generated per event, so links look good in WhatsApp and Messenger.

### Admin panel (`/admin`)
- **Dashboard:** KPIs (users, new signups, events created and published, RSVPs, uploads, storage used), charts over time, visitor analytics (page views, sources, devices, countries; privacy-friendly with no raw IPs).
- **Users:** search, filter, view profile and events, change role, suspend or unsuspend, reset password email, delete, impersonate (read-only "view as user" with an audit log).
- **Events:** all events, filter by status, type and owner; view, unpublish, feature or delete.
- **Moderation:** queue of reported or flagged photos, voice and letters; approve or remove.
- **Templates:** create, edit, publish and unpublish invitation templates shown in `/invitations`, with categories and preview images.
- **Plans and limits:** edit pricing tiers and feature limits; assign a plan to a user manually.
- **Leads and requests:** contact form submissions and plan upgrade requests, with status (new / contacted / closed) and notes.
- **Content:** edit homepage texts, FAQ, testimonials and legal pages in all three languages without code.
- **Emails:** view sent-email logs and edit email templates.
- **Settings:** site name, logo, socials, contact email, maintenance mode, feature flags.
- **Audit log:** every admin action, with who did it, what and when.

## 7. Notifications and emails

Send transactional emails with Resend (or Supabase SMTP), using React Email templates in the same minimalist style and all three languages:

- welcome
- verify email
- password reset
- magic link
- invitation sent to a guest
- RSVP confirmation to the guest
- new RSVP alert to the host (instant or daily digest)
- RSVP reminder
- event reminder 24 hours before
- time capsule unlocked
- contact form auto-reply
- admin alert for new reports

There is also an in-app notification bell for hosts.

## 8. Data model (Supabase Postgres)

Tables:

- `profiles` (role, plan, locale, suspended)
- `events`
- `event_settings`
- `templates`
- `guests` (token, group, table)
- `rsvps`
- `rsvp_questions` and `rsvp_answers`
- `media` (type: photo / voice / letter; status; storage path)
- `time_capsule_messages`
- `reports`
- `plans`
- `subscriptions`
- `contact_requests`
- `site_content` (key, locale, value)
- `notifications`
- `email_log`
- `audit_log`
- `page_views`

Requirements:

- RLS on every table. Hosts only ever see their own events, guests only their own RSVP, and admins see everything.
- Storage buckets with policies; private by default and served through signed URLs.
- File limits: photos 15MB, compressed to WebP; voice 60 seconds as webm/m4a. Enforce per-plan storage quotas.
- Migrations live in `supabase/migrations`, plus a seed script with demo data for local development only.

## 9. Must-have extras

- **SEO:** metadata per page and locale, `hreflang`, sitemap.xml, robots.txt, JSON-LD (Organization, Product, FAQ), Open Graph images. Guest event pages are `noindex`.
- **Accessibility:** WCAG 2.2 AA, keyboard navigation, visible focus states, labels, alt text, AA contrast.
- **Performance:** Lighthouse 95+ on mobile, optimized images, fonts via `next/font`, minimal client JavaScript.
- **Security:** server-side validation with Zod, CSRF-safe server actions, rate limits, secure headers (CSP, HSTS), no secrets in client code, `.env.example` documented.
- **Privacy:** cookie consent banner (necessary-only by default), GDPR data export and account deletion.
- **Analytics:** Vercel Analytics or Plausible, plus the internal `page_views` table for the admin dashboard.
- **Error tracking:** Sentry.
- **Payments (phase 2):** structure the code for Stripe or a Georgian provider (TBC or BOG) later. For now, plans are "price on request" with an upgrade request form that admins handle manually.
- **Deep links must work:** refreshing any route, such as `/ka/pricing`, must load, never a 404.

## 10. Tech stack

- Next.js (latest, App Router, Server Components and Server Actions) with TypeScript in strict mode.
- Tailwind CSS with design tokens, plus shadcn/ui as a base, restyled to match section 2.
- Supabase for Auth, Postgres, Storage and Realtime (live RSVP counts on the dashboard).
- `next-intl`, React Hook Form + Zod, TanStack Table for the admin tables, Recharts for charts, React Email + Resend.
- Vitest for unit tests and Playwright for end-to-end tests of sign-up, create event, guest RSVP, upload and admin actions.
- Deploy to Vercel. A README covers setup, env vars, how to make the first admin, and deployment.

## 11. Build phases

Work in phases. At the end of each phase: run the build, lint and tests, check the result in a browser at 390px and 1440px, show me screenshots, and wait for my OK before the next phase.

1. Project setup, design system, layout, header and footer, i18n.
2. Marketing pages with final copy in ka, en and ru.
3. Supabase schema, RLS, auth (all sign-in methods), account settings.
4. Host dashboard: create wizard, events, guests, publish.
5. Guest invitation page: RSVP, calendar, map.
6. Live features: camera, voice guestbook, letters, gallery, time capsule.
7. Emails and notifications.
8. Admin panel (every section in section 6).
9. SEO, accessibility, performance, security hardening, legal pages.
10. Tests, README, Vercel deploy.

Start by asking me any questions that block you (brand colors, domain, email sender, map provider). Then show the plan for phase 1.
