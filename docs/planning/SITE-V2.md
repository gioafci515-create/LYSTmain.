# LYST site v2: product & conversion plan

**Status:** approved 2026-10-31, with the answers below. **Built:** phase 0 (languages), 2026-10-31; phase 1 (header and navigation), 2026-11-01. **Next:** phase 2 (inquiries).
**Constraints:** minimal premium monochrome; every rule in `CLAUDE.md` (design anti-patterns, legal, security); Lighthouse mobile ≥ 95 on the live site; no third-party requests from the browser.

---

## Decisions (answers of 2026-10-31)

| # | Topic | Decision |
|---|---|---|
| 1 | Domain | None yet. Everything reads **one `SITE_URL` env var** (canonical URLs, share images, sitemap, structured data, email links). Default: `https://lystmain.vercel.app`. Switching to `lyst.ge` (or similar) is a one-variable change. |
| 2 | Email | **Resend with LYST's own domain**, once it exists. Sending sits behind an adapter (`lib/email/`), so switching provider or turning it on is one config change. No Gmail SMTP. Until the domain exists the adapter is "off": inquiries are still saved, and the success screen doesn't promise an email. (Supabase SMTP is also waiting on dashboard access.) |
| 3 | WhatsApp & hours | +995 568 13 02 60. **Mon–Sat 10:00–20:00 Tbilisi.** Inside those hours: "We reply within 2 hours." Outside: "We'll reply tomorrow morning." Always computed in Tbilisi time, wherever the visitor is. |
| 4 | Packages | See section 4. Prices are "starting from". **Only features that exist and work today are listed; anything else is labelled "Coming soon".** See the feature audit below. |
| 5 | Process | Inquiry → proposal **within 24 h**. Essential ready **3 days** after the brief, Signature **7 days**. Revisions per package. Details (time, place, info) can be updated any time after sending, **free**; date changes free. Payment: **50% deposit** to start, **50% before the invitation is sent**, by bank transfer or card payment link. |
| 6 | Hero | Keep **"Beyond the invitation."** as the hero headline, translated per language (Georgian written natively, listed for review). **"Invite Smarter."** stays English everywhere, as a lockup with the wordmark: **"LYST · Invite Smarter."** in the footer (and on the share image). |
| 7 | Imagery | Showcases use **typography and LYST's real invitation design**, with **no AI-generated people**. Photo licences: see the photo audit below. |
| 8 | Planners & venues | A "Work with us" page: benefits (a better experience for their clients, a clean final guest count, credit on recaps) and a **partner inquiry form**. No public commission numbers ("partner terms on request"). |
| 9 | Russian legal pages | Yes, translated, with a line in every language saying **the Georgian version prevails**. |
| 10 | Old consultation requests | **Migrated** into Inquiries with source "legacy consultation". No data lost. |
| 11 | Order | Languages first. |
| 12 | Envelope | **Direction B.** No hero animation. The envelope appears only in the showcases and the inquiry success state. |

## Feature audit: what is real today

Your rule is to list only features that exist and work. This is what I could verify on 2026-10-31.

**In this repository (the LYST website):** none of the invitation features. It has the marketing site, consultation requests, host accounts (sign-up, login, password reset, account page) and the admin dashboard.

**In the separate `lyst-invite-1/2/3` apps** (live on Vercel; their code is not in this repo, so this was checked from the outside only):

| Feature | Seen? | Evidence |
|---|---|---|
| Guest reply with name | yes | reply form; `/api/rsvp` (invite-3) |
| Plus-ones / companions | yes | "Add companion" field (invite-3), "plus-one" (invite-2) |
| Dietary / access notes | yes | field (invite-1) |
| Schedule, dress code, map | yes | sections on all three |
| Add to calendar | yes | invite-1, invite-2 |
| Photo uploads + live gallery | yes | `/api/blob/upload`, `/api/gallery`, `/api/live` (invite-2) |
| Letters | yes | `/api/letters` (invite-1) |
| Time capsule | yes, protected | `/api/capsule/archive` answers 403 (invite-1) |
| Push notifications | yes | `/api/push/*` (invite-2) |
| **Personal link per guest/household with their name** | **not seen** | guests type their own name |
| **2 reminder rounds** | **not seen** | |
| **Live guest count for hosts** | **not seen** | |
| **Up to 3 languages** | **not seen** | all three are English-only |
| Multi-part events (engagement / ceremony / reception) | not seen | |
| Voice Guestbook, Smart Seating, recap | not seen | |

**Needed from you:** confirm which of these work in production today and who maintains the `lyst-invite` apps. Until then, the **not seen** items appear on the site only as "Coming soon". Also, `lyst-invite-1` lists `hello@lyst.events` as its contact, but `lyst.events` has no DNS records, so **email to that address bounces today**.

## Photo audit: source and licence

All 15 photos in `public/images/` were added in commit `25919ce` (2026-10-19). They carry **no metadata**: no camera, no generator, no stock-agency tags. Their source and licence can't be determined from the files.

`about-table-hd`, `about-window-hd`, `cap-1-hd`, `cap-2-hd`, `cap-2-m-hd`, `cap-3-hd`, `cap-3-m-hd`, `cap-4-hd`, `cap-4-m-hd`, `cap-5-hd`, `consultation-hd`, `consultation-m-hd`, `experience-hd`, `hero-hd`, `hero-m-hd`: **source unknown, licence unknown.** `lyst-wordmark.png` is LYST's own logo.

**Needed from you:** where they came from (photographer, stock licence, generator and its terms). Per your rule, anything without a clear licence gets replaced. Replacements will come with the source written down in `docs/legal/image-sources.md`.

---

## Build order

| Phase | Item | Size |
|---|---|---|
| 0 | **Languages:** routing, message files, existing copy in ka/en/ru, legal pages per language (with Russian), `SITE_URL` | L |
| 1 | Header and navigation, "Client login" in the footer, "LYST · Invite Smarter." lockup | S |
| 2 | Inquiry form + partner inquiry + admin Inquiries (with legacy migration) + email adapter + WhatsApp + reply-time logic | L |
| 3 | Selected Work: 4 showcase invitations (envelope → invitation → reply → details) | L |
| 4 | How it works + "Starting from" prices + FAQ | M |
| 5 | Occasion pages (Weddings, Christenings, Birthdays, Corporate, Work with us) | M |
| 6 | Sticky mobile CTA (no hero animation, decision 12) | S |
| 7 | Share image, structured data, wordmark alt text | S |

Each phase is pushed separately. Each one gets smoke tests, axe and a Lighthouse check, a Privacy Policy update when what's collected changes, and screenshots at 390 and 1440 px.

## 0 · Languages: Georgian (default), English, Russian

- **Library:** `next-intl` 4.x. `ka` at `/` (no prefix), `en` at `/en/...`, `ru` at `/ru/...`. English URL slugs in every language.
- **No automatic redirects and no language cookie.** The URL decides the language; the switcher links to the same page in another language.
- **All copy in message files:** `messages/{ka,en,ru}.json`. Admin stays English-only.
- **Wording rules** (in `CLAUDE.md`):
  - Never "RSVP". Georgian **„დასწრების დადასტურება“**; English "replies" or "attendance confirmation"; Russian «подтверждение присутствия».
  - **"Invite Smarter."** is never translated.
  - Georgian is written natively. Every ka and ru string goes into `docs/planning/copy-review.md` for a native-speaker review.
- **Fonts, still self-hosted:**
  - Inter gains its Cyrillic subset.
  - **Noto Sans Georgian** (OFL licence) is added as the Georgian fallback.
- **SEO:**
  - `hreflang` alternates on every page
  - `sitemap.xml` with all three languages
  - `<html lang>` set per language
  - metadata in each language
- **Legal pages:**
  - One per language: `/privacy`, `/en/privacy`, `/ru/privacy`.
  - **Russian translation added.**
  - Each version says the Georgian version prevails.
  - Version stays 1.0, since the content is unchanged; adding Russian is logged in `docs/legal/README.md`.
- **Server messages** (auth and booking errors) become codes that the browser shows in the visitor's language.
- **URL change:** `/` becomes Georgian; English moves to `/en`.

## 1 · Header and navigation

- **Desktop header:** wordmark · Work · How it works · Prices · Occasions · language switch (ქა / EN / RU) · **one CTA**.
- **Phone header:** wordmark · language switch · "Menu" sheet.
- **Island:** wordmark · current section · CTA (on phones the CTA moves to the sticky bar).
- **Footer:** **"LYST · Invite Smarter."**, plus a small **"Client login"** link. Sign-up and Account are unlinked (the routes still work, marked `noindex`).
- **CTA label:** EN "Plan your invitation" · KA „დაგეგმე მოსაწვევი“ · RU «Спланировать приглашение».
- **As built (2026-11-01):**
  - Work, How it works, Prices and Occasions don't exist yet, so the header links to today's sections (About, Capabilities, The experience). Phases 3 to 5 each swap their own link in (`app/components/nav.ts`). No link points at a section that isn't built.
  - Links sit inline from 1024 px wide. Below that, "Menu" opens a full-screen sheet with the links, the CTA and the contact details.
  - Until phase 2, the CTA opens today's consultation booking, and the consultation section keeps its "Book a consultation" button.
  - Until phase 6, the island keeps a short CTA on phones: "Plan" · „დაგეგმე“ · «Начать» (Russian «Спланировать» doesn't fit; listed in `copy-review.md`).

## 2 · Inquiry, partner inquiry, admin, email, WhatsApp

- **Inquiry fields:**
  - event type: Wedding · Christening · Birthday · Corporate · Other
  - event date, or "not decided yet"
  - guests: up to 50 · 50–100 · 100–200 · 200–500 · 500+
  - preferred contact: WhatsApp · Phone · Email
  - name, email (required), phone (required for WhatsApp or Phone), message
- **How it behaves:** one screen; full-screen on phones; the draft is kept across closing; server-side validation, honeypot, rate limit and timeout.
- **Partner inquiry** (Work with us): company / venue name, role, city, roughly how many events a year, contact, message. Saved as the inquiry type "partnership".
- **Next to submit:**
  - reply-time line (decision 3)
  - quiet WhatsApp text link
  - Privacy Policy link
- **Success state:** an envelope that closes and seals (decision 12, reduced motion respected) and a summary. It promises an email only when the email adapter is on.
- **Data:**
  - New `inquiries` table (migration + `schema.sql`).
  - Fields: kind (event / partnership), event_type, event_date, guests_range, contact_pref, name, email, phone, company, message, locale, source, status (`new` / `contacted` / `proposal` / `booked` / `done`), notes, timestamps.
  - RLS: admins read and update; inserts only through the server.
  - **Migration copies every `consultation_requests` row** in with source `legacy consultation` (the old table is kept, read-only).
- **Admin "Inquiries" tab:**
  - status filters, search, notes, CSV
  - one-tap WhatsApp (`wa.me`, greeting pre-filled in the inquiry's language), plus `tel:` and `mailto:`
- **Email adapter** (`lib/email/`): providers `off` (the default, until there's a domain) and `resend`. When on, it sends an auto-confirmation to the person (in their language) and a new-inquiry alert to lystinvites@gmail.com. Transactional only, with every value escaped.
- **Legal:** Privacy Policy v1.1 in all three languages: new fields, partner data, Resend as processor once on, WhatsApp messages handled by Meta.

## 3 · Selected Work: four showcase invitations

- **Four fictional invitations, marked "Showcase":** Wedding "Nino & Giorgi" · Christening "Luka's christening" · Birthday "Ana is 30" · Corporate "Annual gala 2027".
- **Look:** typography and LYST's real invitation design language (decision 7), no AI-generated people, no child imagery.
- **Flow:**
  1. Envelope opens.
  2. Invitation.
  3. „დასწრების დადასტურება“ reply. Local only, no network request; a "This is a showcase, nothing is sent" note.
  4. Details: schedule, dress code, a static map image with an "Open in Maps" link (no embedded map).
- **Opening:**
  - Desktop: a dialog with a thin phone frame.
  - Phones: full-screen.
  - Each also has its own URL (`/work/<slug>`).
- **Under the hood:**
  - One data-driven `<Invitation>` renderer.
  - Loaded only when opened.
  - Focus trap; Escape and Back close it; reduced motion respected; no tracking.

## 4 · How it works, prices, FAQ

**How it works** (replaces "The Experience"):
1. Tell us about your event: the inquiry, with the reply-time line.
2. **Proposal within 24 hours.**
3. Design: **ready in 3 days (Essential) or 7 days (Signature)**, with revision rounds.
4. Send and follow replies: one link; „დასწრების დადასტურება“ replies arrive as guests answer.
5. On the day: schedule, map and updates. **Details can be changed any time, free.**

**"Starting from" prices** (₾ only; no guest limit stated: "up to 500 guests included, larger on request"):

| | Essential | Signature | Atelier |
|---|---|---|---|
| Weddings | **from 290 ₾** | **from 590 ₾** | **on request** |
| Christenings & birthdays | **from 190 ₾** | **from 390 ₾** | **on request** |
| Includes (your list; *italic* = Coming soon unless you confirm it works today) | designed invitation from a LYST collection · *personal link per guest/household with their name* · replies incl. plus-ones · schedule + map + dress code · *2 reminder rounds* · *live guest count* · *up to 3 languages* · 1 revision round · ready in 3 days | custom-styled design · *multi-part events* · guest experiences (only those confirmed working) · 3 revision rounds · ready in 7 days | fully bespoke design and motion intro · all experiences · event-day support |

Corporate pricing: on request. Signature is labelled "Most chosen".

**FAQ** (answers from decision 5; `<details>` accordion plus FAQ structured data):
- **Do guests need an app or an account?** No: they open a link.
- **Which languages?** Georgian, English, Russian. Shown as Coming soon until confirmed (feature audit).
- **How long does it take?** A proposal within 24 h; ready in 3 or 7 days after the brief.
- **How many changes can we ask for?** 1, 3, or unlimited bespoke rounds, by package.
- **Can we change details after sending?** Yes: time, place and information any time, free; date changes free.
- **How do guests confirm attendance, and how do we see the replies?** One tap; you see the replies (the live count is Coming soon unless confirmed).
- **How do we pay?** 50% deposit to start, 50% before sending, by bank transfer or card payment link.
- **Is our guests' information private?** Yes, with a link to the Privacy Policy.
- **Do you work with planners and venues?** Yes: link to Work with us.

## 5 · Occasion pages

- **Pages:** `/weddings`, `/christenings`, `/birthdays`, `/corporate`, `/planners` (Work with us). Each has its own metadata and structured data.
- **Blocks on each page:**
  - occasion hero
  - three "What LYST does for you" points
  - the matching showcase
  - condensed How it works
  - that occasion's prices
  - relevant FAQ entries
  - the inquiry form with the event type pre-selected (on the planners page, the partner form)
- **Christenings:** no child imagery.
- **Corporate:** invoices, languages, large guest lists, "on request" pricing.

## 6 · Sticky mobile CTA

- **When:** phones only, after the hero header has scrolled away.
- **What:** a 56 px bar with the CTA and a small WhatsApp icon link.
- **Placement:** respects the safe area, with matching page padding.
- **Hides:** over the inquiry form, a showcase or the footer.
- **One primary CTA:** the island drops its own CTA on phones.

## 7 · Share image, structured data, alt text

- **Share image:** `next/og`, 1200×630, monochrome, on `#f6f5f1`, showing "LYST · Invite Smarter." and a thin-line envelope.
  - Made in each language, with a variant per occasion page.
  - Needs a TTF/WOFF copy of Inter in `app/fonts/`.
- **Structured data (JSON-LD):** `Organization` + `LocalBusiness` (opening hours Mon–Sat 10:00–20:00, Tbilisi), and `FAQPage` where there's an FAQ.
- **Wordmark alt text:** "LYST" where the image is the content; empty where the surrounding link already names it.

## Cross-cutting

- **Home page order:** Hero → short intro → Selected Work → Capabilities → How it works → Prices → Occasions → FAQ → Inquiry → Footer.
- **Budgets** (live, mobile): LCP ≤ 2.5 s, CLS ≤ 0.05, no growth in home-page JavaScript from showcases. Images at quality 75 on phones, in AVIF.
- **CLAUDE.md additions:** language and copy rules, showcase rules (fictional data, no network calls, no child photos), and the "only real features" rule.

## Still open (needs you)

1. **`lyst-invite` apps:** which features work in production, and who maintains them? (Feature audit.) Also, the `hello@lyst.events` contact bounces.
2. **Photo sources and licences** for the 15 site photos. (Photo audit.)
3. **Supabase dashboard access**, for SMTP settings and the `lyst-dev` project.
