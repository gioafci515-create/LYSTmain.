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
