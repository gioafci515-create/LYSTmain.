# LYST project rules

Permanent rules for anyone (human or AI) changing this codebase. They apply to every new feature, including ones not built yet (invitations, Disposable Camera, voice notes, music). If a change would break a rule, stop and raise it instead of working around it.

## Legal and privacy

### 1. No third-party requests from the browser
- Fonts are self-hosted with `next/font/local` from `app/fonts/` (licence file next to each font). Never use `next/font/google`, `<link>` or `@import` to fonts.googleapis.com, fonts.gstatic.com, Adobe Fonts or any other font CDN.
- Scripts are bundled or served from `/public`. No `<script src>` from a CDN, no tag managers.
- Embeds (Google Maps, YouTube, Vimeo, Spotify, SoundCloud, any iframe player) load only after the visitor gives consent for that specific embed. Default: a static image plus a plain "Open in Maps" / "Watch on YouTube" link.
- Images come from this site or our Supabase storage, never hot-linked from third parties.

### 2. No surveillance
- No session replay, heatmaps, keystroke or mouse recording (Hotjar, Clarity, FullStory, LogRocket, PostHog recordings, rrweb and the like).
- Analytics stays as built: cookieless, no IP or raw user-agent stored, daily-rotating hash (`app/components/Tracker.tsx`, `app/api/track/route.ts`).
- No tracking pixels or ad tags (Meta, TikTok, Google Ads, LinkedIn) anywhere. Guest invitation pages get no analytics beyond what the host needs (e.g. RSVP counts): exclude them from `Tracker` when they are built.

### 3. Children
- Invitations can involve children (christenings, birthdays). Guest photos and uploads are private by default: visible only to the host and the guests of that event, never public, never indexed.
- Nothing from a guest or event is used in LYST marketing, portfolio or social media without written consent; for any child in it, written consent from a parent or guardian.

### 4. Uploads (Disposable Camera, voice notes, host photos)
- Terms must state: uploaders keep ownership and grant LYST only a limited licence to store and show the content to that event's host and guests.
- Every upload has a visible "Report" button. Publish an abuse/copyright contact address.
- The host can remove any upload on their event; admins can remove any upload.
- Strip EXIF/metadata (including GPS) from every image on upload, server-side, before storing.

### 5. Music on invitations
- Only licensed or royalty-free tracks from a library LYST controls. No user-uploaded audio as invitation music, no copyrighted songs, no streaming-service embeds as a workaround.

### 6. E-mail
- Marketing e-mail goes only to hosts who opted in, with a visible unsubscribe link and `List-Unsubscribe` / `List-Unsubscribe-Post` headers.
- Never send marketing to guests. Guest e-mails (invitation, RSVP confirmation, reminders) are transactional only: no promotions, no "create your own event" upsell.

### 7. Age
- Host accounts are for people aged 16 or older. Sign-up requires ticking the confirmation (`app/components/auth/AuthForm.tsx`); it is recorded as `profiles.age_confirmed_at` (`supabase/schema.sql`). Any new way to create a host account must ask for the same confirmation.

## Design: no "AI-made" tells

Brand: monochrome Radical Premium Minimalism. Near-black `#0b0b0b` on warm off-white `#f6f5f1`, photography carries the colour, hairline rules, generous space, few words. Applies to the site, admin and every invitation template.

1. **No purple/blue (or any decorative) gradients.** Gradients are allowed only as black legibility scrims over photos.
2. **No gradient text.** Headlines are solid ink or solid white over a photo.
3. **No emojis in headings or copy.** A plain ✓ is fine as a status mark in UI.
4. **Typeface: Inter is the current brand spec (open decision for the new branding).** Don't add a second typeface without a brand decision; hierarchy comes from size, weight 300/400/500 and tracking.
5. **No coloured left-border cards.** The only left rule is the 2px black rule on error/alert messages.
6. **No glassmorphism** for new UI: solid surfaces. The Dynamic Island glass and the consultation CTA's glass hover are deliberate owner choices; don't spread them further.
7. **No low-contrast text, light or dark.** Body text at least 4.5:1: on `#f6f5f1` nothing lighter than `text-black/60`. If a dark mode is ever added it must meet the same ratios.
8. **No rows of three icon boxes.** Use photographs, numbered lists (01, 02…) and hairline rules.
9. **No pill badge above a headline.** Section labels are plain small caps text ("03 / Capabilities").
10. **No icon library sprinkled everywhere** (Lucide, Heroicons…). Icons only where they carry meaning, drawn as inline SVG at 1.3px stroke.
11. **No untouched shadcn/ui** look (default radius, shadows, slate palette). If a primitive library is added, restyle it to these tokens.
12. **No fade-in on scroll for text and blocks.** Content is there when you arrive. Allowed motion: headline line reveal (`RevealText`), photo settle, divider draw-in, the island's morph.
13. **No cursor-following beams, spotlights or magnetic effects.**
14. **No buttons fading on hover.** Hover inverts (fill ↔ outline) or draws an underline (`.ulink`); never just lowers opacity.
15. **Consistent spacing.** Page gutters `px-6 md:px-10 xl:px-20`, content `max-w-[1760px]`, section padding `py-16 md:py-20`. Use the existing scale; no one-off values without a reason.
16. **No em dashes in UI copy or titles.** Use a colon, comma, full stop or parentheses; page titles are "Page | LYST". "—" is only an empty-value marker in data tables.
17. **No generic buzzword copy** ("seamless", "elevate", "unlock", "curated experiences", "next-level"). Say concretely what happens: who, what, when.
18. **No serif italic accent words** inside sans headlines.
19. **No Space Grotesk + Instrument Serif** (or any trending AI font pairing).
20. **No grain/noise over gradients.** Texture only comes from real photography.

## Security

1. **Access control.** Every query is scoped to its owner: hosts only reach their own events (RLS `host_id = auth.uid()`), admins go through `requireAdmin()` (`lib/supabase/server.ts`). Guest invitation/RSVP links use long random tokens (at least 128 bits, `crypto.randomBytes`), never sequential or guessable ids; store only a SHA-256 hash of the token and look guests up by hash. A guest token only ever reaches that guest's own invitation and response. Every new table gets RLS enabled with explicit policies in `supabase/schema.sql`.
2. **Secrets.** No keys, DB URLs or tokens in client code or git. `NEXT_PUBLIC_` is only for values that are public by design (Supabase URL and anon key). Server secrets (`SUPABASE_SERVICE_ROLE_KEY`, `ANALYTICS_SALT`, payment keys) are read only in files that `import "server-only"`. gitleaks runs in the pre-commit hook (`.githooks/pre-commit`, enabled by `npm install`) and in CI (`.github/workflows/security.yml`); never bypass it with `--no-verify`. Anything that leaks is rotated in its provider first, then removed from history.
3. **Packages.** Before adding a dependency, check it on npm: real, official, maintained, needed. CI runs `npm audit --omit=dev --audit-level=high`. Remove packages that are no longer used.
4. **Uploads** (photos, voice notes, host images). Check the type from the file's content (magic bytes), not the extension or the browser's MIME type. Enforce size limits on the server. Re-encode images server-side (which also strips EXIF/GPS) before storing. Store in a private Supabase bucket and serve through short-lived signed URLs; never a public bucket.
5. **SQL.** Only the Supabase query builder / RPC with named arguments. No SQL built from strings; inside SQL functions no `EXECUTE` with concatenated input (use `format()` with `%L`/`%I` if dynamic SQL is ever unavoidable).
6. **Auth tokens.** Sessions live only in httpOnly, Secure, SameSite=Lax cookies set by the server (`lib/supabase/server.ts`). Browser code never creates a Supabase client and never stores a token in localStorage, sessionStorage or a readable cookie: all auth goes through `app/auth/actions.ts`.
7. **Payments.** Verify every webhook signature with the provider's SDK on the raw body. Recalculate amounts on the server from our own prices; never trust an amount, price or "paid" flag from the browser. An order becomes paid only from a verified webhook.
8. **Security headers** are set in `next.config.ts` for every route: CSP (`default-src 'self'`, `frame-ancestors 'none'`, `object-src 'none'`), HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`. Loosen a directive only for a specific need, in that file, with a comment.
9. **XSS.** Host story text, guest messages and names are rendered as React text, never with `dangerouslySetInnerHTML`. If markdown or rich text is ever supported, render it with a sanitiser (allow-list of tags, no raw HTML, no `javascript:` links).
10. **Errors and logs.** Users see fixed, friendly sentences. Stack traces, Supabase/Postgres error messages and codes go to the server log (`console.error`) only, never into a response body or the UI. Never log passwords, tokens or full request bodies; Server Action argument logging stays off (`logging.serverFunctions: false` in `next.config.ts`).
11. **Rate limits** on every public write: login, sign-up, password reset, consultation and response (RSVP) forms, uploads, tracking. Use `rateLimited(name, id)` from `lib/rate-limit.ts` (Upstash Redis, shared across instances) with a named limit added to `LIMITS`; key by `visitorIp()` (Vercel's own headers, not spoofable) and never put raw IPs or emails in Redis keys (they are hashed). Without `UPSTASH_REDIS_REST_URL`/`_TOKEN` it falls back to per-instance memory, which is not acceptable in production.
12. **Database changes** go in a new file in `supabase/migrations/` (additive, one transaction), mirrored into `supabase/schema.sql`. Never re-run `schema.sql` on the live database. Back up first (`supabase/README.md`).
