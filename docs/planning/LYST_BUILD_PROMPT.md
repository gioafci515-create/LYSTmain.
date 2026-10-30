# Build prompt: LYST website

Paste everything below the line into Claude Code.

---

Build the marketing website and core product for **LYST**, a digital invitations and event-experience platform based in Tbilisi, Georgia. Tagline: "მოიწვიე ჭკვიანურად." ("Invite smartly.")

## What LYST is

LYST replaces paper and chat-message invitations with **one link per event**. That link is a live digital space that follows the guest through three phases:

1. **Before (Anticipation / მოლოდინი):** the guest opens a mobile-first invitation with all details: hosts, date and time, venue with map, dress code, host messages. They RSVP in one tap (attending / not attending), add plus-ones and notes.
2. **During (Participation / მონაწილეობა):** guests use the same link at the event to take photos (Event Camera), record voice messages and toasts (Voice Guestbook), write text letters (Letters From the Room) and join photo challenges.
3. **After (Memory / მოგონება):** all photos, voice notes and messages stay in a permanent digital archive and time capsule the hosts can revisit years later.

Hosts get a **dashboard**: guest list, RSVP counts (confirmed / declined / pending), plus-ones, dress-code notes, recent replies, CSV export.

Target events: weddings, birthdays, private dinners, corporate events, charity events, other.

## Languages

Georgian is the default (`lang="ka"`). Also English and Russian, switchable in the header (ქა / EN / RU) and the footer. Every string must come from translation files, not hard-coded.

## Visual style

- Monochrome and editorial: white background, black text, black pill buttons, thin borders, lots of whitespace. Black-and-white event photography.
- Fonts: **Outfit** for headings (large, about 72px desktop H1) and **Inter** for body. Both need Georgian glyph support. Check this and add a Georgian fallback such as Noto Sans Georgian if needed.
- Logo: wordmark "Lyst." with a period.
- Phone mockups (status bar "9:41") showing the guest invitation, and dashboard mockups showing host stats.
- Premium, calm, emotional tone. No bright colors or gradients.

## Pages and routes

Header nav: Platform `/`, Product `/product`, Invitations `/invitations`, Experiences `/experiences`, How it works `/how-it-works`, Pricing `/pricing`, About `/about`, plus Log in `/login` and a primary CTA "შექმენი მოსაწვევი" (Create invitation) to `/create`.

1. **Home `/`**
   - Hero: eyebrow "DIGITAL INVITATIONS + EVENT EXPERIENCE", H1 "მოიწვიე ჭკვიანურად.", one-paragraph description, CTAs "Create invitation" and "See how it works →", full-width B&W event photo.
   - "Smart technology. Live emotion." section with three numbered cards: 01 Anticipation, 02 Participation, 03 Memory.
   - Guest view / host panel section: phone mockup of an invitation ("Autumn dinner, hosts Nino & Giorgi, 22 Sep 18:30, Veranda Tbilisi, dress code casual") with Attend / Can't attend buttons.
   - Host dashboard preview: Confirmed 32 / Declined 8 / Pending 4, recent replies list, Export button.
   - Experiences showcase with tabs: Event Camera, Voice Guestbook (list of voice messages with names, times, durations, plus a record button), Letters From the Room.
   - Emotional closing block: "The evening ends. The emotion doesn't." with a short list of moments worth keeping, then a final CTA.
2. **Product `/product`:** feature deep-dive (digital invitation, personal guest link, mobile-perfect view, guest management with stats) plus a "real example, not a mockup" link to a live client invitation.
3. **Invitations `/invitations`:** template gallery filterable by event type (All, Wedding, Birthday, Private, Corporate) and style (Minimal, Classic, Modern). Example cards: "Moonlight" wedding, "Gold Leaves" birthday, "Minimalist" corporate, "Garden Party" private dinner, "Classic Elegant" wedding, "Modern" other. Each card has a "View & edit" button.
4. **Experiences `/experiences`:** interactive features (camera, voice guestbook, letters, time capsule, photo challenges, shared gallery).
5. **How it works `/how-it-works`:** four steps: 01 Create (pick type, style, details), 02 Invite (publish, get a unique link like `lyst.ge/autumn-dinner`, collect RSVPs), 03 Experience (guests add photos, voice and text), 04 Memory (archive), each with an illustrative UI mockup.
6. **Pricing `/pricing`:** three tiers, all "price on request":
   - **Starter:** 1 event, up to 50 guests, invitation + RSVP, basic gallery, email support.
   - **Premium (recommended):** 5 events, up to 200 guests, premium styles, voice guestbook, priority support.
   - **Exclusive:** unlimited events and guests, premium archive, personal manager, branded custom domain.
   - Feature comparison table and an FAQ accordion.
7. **About `/about`:** mission, "what we change" (scattered chats → one space; static details → interactive map + RSVP; separate albums → one living memory), vision.
8. **Create `/create`:** multi-step wizard. Step 01 pick event type, then style/template, then details (title, hosts, date/time, location, dress code, text, cover image), then preview and publish to a unique slug URL.
9. **Login `/login`:** host sign-in and sign-up.
10. **Guest invitation `/[slug]`:** the public, mobile-first event page with RSVP, then camera, voice guestbook and letters during and after the event.
11. **Host dashboard `/dashboard`:** events list, guest list with statuses, stats, CSV export, media archive.

Footer: tagline; columns Product (Event space, Letters, Time capsule, Archive), Invitations (Photo challenges, Custom domain, Shared gallery), Experiences (Digital styling, Interactive experiences, URL choice), About (Our story, Studio Tbilisi, Contact), Quick links (How it works, Pricing, Log in), language switch, contact `hello@lyst.app`, Instagram and TikTok `@lystinvites`, Privacy and Terms, "© 2026 Lyst."

## Tech stack (suggested)

- Next.js (App Router) + TypeScript + Tailwind CSS, deployed on Vercel.
- Supabase for auth (hosts), Postgres (events, guests, RSVPs), and Storage (photos, voice recordings).
- i18n with `next-intl` or similar for ka / en / ru.
- Voice recording via the MediaRecorder API; camera uploads via `<input capture>`.
- Use real routes so deep links and page refreshes work. The current reference site returns Vercel 404 on refresh of `/pricing` and other subpages, so don't repeat that bug.

## Build order

1. Design tokens, layout, header and footer, language switching.
2. Marketing pages: Home, Product, How it works, Pricing, About, Invitations gallery.
3. Auth and the database schema.
4. Create wizard → publish → guest invitation page with RSVP.
5. Host dashboard with stats and export.
6. Live-event features: camera upload, voice guestbook, letters, archive.

Start with the brainstorm/plan step, confirm the plan with me, then build phase 1.
