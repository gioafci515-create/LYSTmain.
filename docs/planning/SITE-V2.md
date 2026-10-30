# LYST site v2: product & conversion plan

**Status:** proposal, waiting for approval. Nothing below is built yet. · **Date:** 2026-10-30
**Constraints:** minimal premium monochrome; every rule in `CLAUDE.md` (design anti-patterns, legal, security); Lighthouse mobile ≥ 95 on the live site; no third-party requests from the browser.

Your answers to the **Questions** at the end decide the details. Where a decision has an obvious default, it's listed under **Defaults** instead of being asked.

---

## Build order

Your order, with one change I recommend: **languages (7) first**.

| Phase | Item | Size | Why this position |
|---|---|---|---|
| 0 | **7. Languages** (routing, message files; existing copy moved into ka/en/ru) | L | Every later item adds a lot of copy. Built in English first, it would all have to be redone. |
| 1 | 4. Header and navigation | S | Small, and every later page uses it. |
| 2 | 2. Inquiry form + admin + emails + WhatsApp | L | Conversion core; replaces today's booking dialog. |
| 3 | 1. Selected Work (4 interactive showcase invitations) | L | Biggest design piece; reuses the inquiry CTA. |
| 4 | 3. How it works + "Starting from" prices + FAQ | M | |
| 5 | 6. Occasion pages (5) | M | Reuse the blocks from phases 2–4. |
| 6 | 8. Hero envelope motion + sticky mobile CTA | M | Last, so the motion is designed around the final hero. |
| 7 | 5. Share image, structured data, alt text | S | Needs the final copy and the domain. |

Each phase is one pushed commit (or a few). Each one gets smoke tests, axe, a Lighthouse check, a privacy-policy update if what's collected changes, and screenshots at 390 and 1440 px for you before the next phase starts.

---

## 0 · Languages: Georgian (default), English, Russian

- **Library:** `next-intl` 4.x (supports Next 16). Routing: `ka` at `/` (no prefix), `en` at `/en/...`, `ru` at `/ru/...`.
- **No automatic redirects and no language cookie.** The URL decides the language, and the switcher just links to the same page in another language. This means no new cookie to declare in the Privacy Policy, and links people share always open in the language they were shared in.
- **All copy in message files:** `messages/ka.json`, `en.json` and `ru.json`. No hard-coded user-facing strings. Admin stays English-only (internal).
- **Wording rules** (added to `CLAUDE.md`):
  - "RSVP" is never used. Georgian: **„დასწრების დადასტურება“**; English: "attendance confirmation" or "replies"; Russian: «подтверждение присутствия».
  - **"Invite Smarter."** is never translated. It appears in English in all three languages.
  - Georgian is written naturally, not translated word for word. Every ka and ru string goes into `docs/planning/copy-review.md` for a native-speaker review before launch.
- **Fonts:** Inter (self-hosted) gains its Cyrillic subset. Georgian gets **Noto Sans Georgian**, self-hosted under the OFL licence, as a per-character fallback, so Georgian text no longer depends on each device's own font. Everything stays served by our own site.
- **SEO:** `hreflang` alternates on every page, a `sitemap.xml` covering all three languages, and `<html lang>` set per language.
- **Formats:** dates, numbers and prices use each language's formatting via `Intl` (e.g. "290 ₾").
- **Legal pages** move to one page per language (`/privacy`, `/en/privacy`, `/ru/privacy`). Whether Russian gets its own legal text is question 9.
- **URL change to note:** `/` becomes Georgian. English moves to `/en`.

## 1 · Header and navigation (item 4)

| | Desktop | Phone |
|---|---|---|
| Hero header | Wordmark · Work · How it works · Prices · Occasions · language switch (ქა / EN / RU) · **one CTA button** | Wordmark · language switch · "Menu" (simple full-screen sheet with the same links) |
| Dynamic Island (after scroll) | Wordmark · current section · CTA | Wordmark · current section (the CTA moves to the sticky bottom bar, item 8) |
| Footer | adds **"Client login"** (small) → `/login` | same |

- **CTA label** (one wording everywhere): EN "Plan your invitation" · KA „დაგეგმე მოსაწვევი“ · RU «Спланировать приглашение». It opens the inquiry form.
- **Account and sign-up:** "Log in", "Sign up" and "Account" are removed from the header and the island. The routes keep working by direct URL (marked `noindex`), so nothing breaks for existing accounts.
- Only one element is styled as a button (rule: one primary CTA). Nav links use the existing `.ulink` underline.

## 2 · Inquiry form, admin list, emails, WhatsApp (item 2)

This replaces today's "Book a consultation" dialog (date/time slot picking) with an inquiry for the **event** itself.

**Form fields:**

| Field | Input | Rule |
|---|---|---|
| Event type | Wedding · Christening · Birthday · Corporate · Other | required |
| Event date | date picker with "Not decided yet" | optional; past dates rejected |
| Approximate guests | Up to 50 · 50–100 · 100–200 · 200+ | required. Ranges, so no "0", "‑5" or "99999" |
| Preferred contact | WhatsApp · Phone · Email | required |
| Name | text, max 200 | required |
| Email | max 320 | required (it's where the auto-confirmation goes) |
| Phone | max 50 | required if WhatsApp or Phone is chosen |
| Message | max 2,000 | optional |

**Form behaviour:**
- One calm screen, not a multi-step wizard. On phones it opens full-screen.
- Each occasion page and showcase pre-selects the event type.
- The draft is kept across closing (as the booking dialog does now).
- The same protections as today: server-side validation, honeypot, rate limit, 20 s timeout. It never shows an error as code.
- Near the submit button: "We reply within 2 hours" (exact hours: question 3), a quiet WhatsApp text link ("Prefer WhatsApp? Message us"), and the Privacy Policy link.
- **Success state:** "Thank you. We'll reply within 2 hours by <chosen method>", plus a copy of what was sent.

**Data:**
- New table `inquiries`, created by migration and mirrored into `schema.sql`.
- Fields: event_type, event_date, guests_range, contact_pref, name, email, phone, message, locale, source, status (`new` / `contacted` / `proposal` / `booked` / `done`), notes, created_at, updated_at.
- RLS (row-level security): admins can read and update. Inserts happen only through the server route.
- What happens to the existing `consultation_requests` is question 10.

**Admin:** the "Bookings" tab becomes **"Inquiries"**:
- A list with status filters and search, a detail sheet with notes, and CSV export.
- One-tap **WhatsApp** (`https://wa.me/<number>?text=…`, with a greeting pre-filled in the inquiry's language), plus `tel:` and `mailto:` links.
- The overview KPIs switch to inquiries.

**Emails** (transactional only, per CLAUDE.md rule 6):
- (a) An **auto-confirmation** to the person, in their language: what we received, when we'll reply, and our contacts.
- (b) A **new-inquiry alert** to lystinvites@gmail.com, which also fixes QA-11.
- Plain, monochrome HTML with a text version. Every value is escaped.
- The provider is question 2. The same provider then fixes Supabase sign-up emails (QA-05).

**WhatsApp:**
- **Quiet**: a text link, plus an icon in the mobile sticky bar. No floating chat bubble, and no WhatsApp script or widget. It's a plain `wa.me` link, so no third-party request happens until someone taps it (legal rule 1).

**Legal:** Privacy Policy v1.1 in all its languages (new fields, the email provider, a note that WhatsApp messages are handled by Meta), logged in `docs/legal/README.md`.

## 3 · Selected Work: four showcase invitations (item 1)

- **Four fictional invitations.** All names and details are invented and marked "Showcase". No real guest data.
  - **Wedding:** "Nino & Giorgi", an evening in Kakheti
  - **Christening:** "Luka's christening", Sioni
  - **Birthday:** "Ana is 30", a rooftop dinner
  - **Corporate:** "Annual gala 2027", a product evening
- **On the home page:** a 4-card grid (2×2 on phones). Each card shows the invitation's cover and the occasion.
- **Opening:**
  - On **desktop** the invitation opens in a dialog inside a minimal **phone frame**: a thin 1 px ink outline with a rounded rectangle and no fake status bar.
  - On **phones** it opens full-screen, because a phone inside a phone looks odd.
  - Each also has its own URL (`/work/wedding` and so on) for sharing.
- **Flow inside each invitation:**
  1. **Envelope:** closed, with the names; "Open" (tap or Enter).
  2. **Invitation:** design, date, hosts, a short message.
  3. **Response:** „დასწრების დადასტურება“: Attending / Can't attend, plus guests and a note. It's local only: a gentle "This is a showcase, nothing is sent" confirmation, with **no network request**.
  4. **Details:** schedule, dress code, venue as a **static image with an "Open in Maps" link** (no embedded map: legal rule 1), and the host's contact.
- **One reusable `<Invitation>` renderer driven by data** (`content/showcases/*.ts`). The same renderer can later power real invitations.
- **Loaded only when opened** (dynamic import), so the home page doesn't get heavier.
- **Accessibility:** a focus trap; Escape closes; Back closes (as with booking); reduced motion makes the envelope open instantly.
- **No visitor tracking** inside showcases.
- **Children (legal rule 3):** the christening showcase uses no child photos at all, only typography and objects (candle, cross, linen).
- **Imagery** is question 7. The showcase style should match what you actually deliver; question 7 also asks about the `lyst-invite-*` projects.

## 4 · How it works, prices, FAQ (item 3)

**How it works** replaces "The Experience" section. It's a 5-step horizontal timeline on desktop and a vertical one on phones, with the existing hairline rules and numbered labels:
1. **Tell us about your event:** the inquiry, answered within 2 hours.
2. **Proposal:** style, package and price. *Timing: question 5.*
3. **Design:** your invitation, with revision rounds. *Timing and number of rounds: question 5.*
4. **Send and follow replies:** one link for every guest; „დასწრების დადასტურება“ answers arrive in real time.
5. **On the day:** schedule, map and last-minute updates in the same link.

(The "after the event" memories step comes back once photos and uploads are built. Until then it isn't promised.)

**"Starting from" prices:** three columns. Essential and Signature say "from"; only the recommended one (Signature) gets a quiet "Most chosen" label.

| | Essential | Signature | Atelier |
|---|---|---|---|
| Price | **from 290 ₾** | **from 590 ₾** | **on request** |
| What's included | *Draft, question 4* | *Draft, question 4* | *Draft, question 4* |

The draft inclusions for question 4 are below, based on `LYST_BUILD_PROMPT.md` and what the site offers today:
- **Essential:** one LYST style adapted to your event · your text and up to 3 photos · venue with map link · one personal link for all guests · „დასწრების დადასტურება“ with plus-ones · downloadable guest list · one language · 1 revision round.
- **Signature:** a design made around your story · envelope opening · schedule, dress code and guest FAQ · reminders to guests who haven't answered · two languages · 2 revision rounds.
- **Atelier:** fully bespoke art direction and illustration · several events (e.g. engagement and wedding) · all three languages · a personal coordinator.

**FAQ:** an accessible accordion (`<details>`, so it works without JavaScript), plus FAQ structured data. The questions below are drafted; the answers marked *(?)* need your facts (question 5):
- Do guests need an app or an account? *(No: they open a link.)*
- Which languages can our invitation be in? *(Georgian, English, Russian.)*
- How long does it take? *(?)*
- How many changes can we ask for? *(?)*
- Can we change details after sending? *(?)*
- How do guests confirm attendance, and how do we see the replies?
- How do we pay? *(?)*
- Is our guests' information private? *(Yes, with a link to the Privacy Policy.)*
- Do you work with planners and venues? *(Link to that page.)*

## 5 · Occasion pages (item 6)

Five pages:
- `/weddings`
- `/christenings`
- `/birthdays`
- `/corporate`
- `/planners` (For planners & venues)

They use English slugs in every language: `/en/weddings`, `/ru/weddings`. Each page has its own title, description, share image and structured data.

**Each page reuses the same blocks, in this order:**
- an occasion hero (a photo or the showcase cover, plus the headline)
- "What LYST does for your <occasion>": 3 short points
- the matching **showcase invitation**, openable in place
- "How it works", condensed
- "Starting from" prices
- the 4–5 most relevant FAQ entries
- the inquiry form with the event type pre-selected

**Christenings:** no child imagery (legal rule 3). Copy mentions that guest photos are private by default.

**Corporate:** a professional tone; mentions invoices, multiple languages and large guest lists. This also addresses QA persona 3.

**Planners & venues:** the offer is question 8. Until you answer, the page is "Work with us" plus the inquiry form with event type "Partnership".

## 6 · Hero envelope motion and sticky mobile CTA (item 8)

**Envelope motion: recommended direction (A).**
- On first load, the hero photo is revealed as if lifted from an envelope. A warm off-white panel (`#f6f5f1`) covers the photo.
- The panel's **flap** opens: a 1 px ink line and a triangle, `rotateX`, about 500 ms, using the existing `--spring` easing.
- Then the panel slides down out of view (about 600 ms, `--reveal-ease`) and the photo settles, reusing the existing `hero-zoom`.
- **The headline is not part of the animation.** It's visible from the first frame (as fixed in QA-06), so LCP stays where it is now (live mobile 2.4 s, target ≤ 2.5 s).
- **Implementation:** CSS only (transform, opacity and clip-path), so it runs without JavaScript, with no layout shift. It plays **once per visit** (`sessionStorage`); later visits show the final state.
- **Reduced motion:** no animation at all.
- **Rules:** added to `CLAUDE.md` as the one signature motion, alongside the headline reveal, photo settle, dividers and island.
- **Quieter alternative (B):** no hero animation. The envelope motif only appears where it means something: opening a showcase invitation, and the inquiry success state.

**Sticky mobile CTA** (phones only):
- **Appears** once the hero header has scrolled away (the same trigger as the island).
- **Contents:** a 56 px bottom bar with the CTA button and a small WhatsApp icon link.
- **Placement:** it respects the iPhone home-bar safe area, and the page gets matching bottom padding so nothing is hidden behind it.
- **Hides** while the inquiry form, a showcase or the footer is on screen. It never covers form fields.
- **Rule compliance:** on phones the island drops its own CTA, so there's still only one primary CTA on screen.

## 7 · Share image, structured data, alt text (item 5)

- **Share image** (1200×630, monochrome):
  - wordmark, "Invite Smarter." and a thin-line envelope, on `#f6f5f1`.
  - Generated at build time with `next/og`, in each language (the tagline is never translated).
  - Each occasion page gets its own variant with the occasion name.
  - Needs a TTF/WOFF copy of Inter in `app/fonts/` (OFL); `next/og` can't read `.woff2`.
  - Twitter/X uses the large-image card.
- **Structured data (JSON-LD):** `Organization` + `LocalBusiness`. Fields:
  - name LYST, url, logo
  - email lystinvites@gmail.com, telephone +995 568 13 02 60
  - address Tbilisi, GE
  - `sameAs` Instagram and TikTok
  - `priceRange`, and opening hours from question 3
  - plus `FAQPage` on pages with an FAQ
  - It's a data block, not executed script, so the CSP doesn't change.
- **Wordmark alt text:** "LYST" wherever the image is the content. Where it sits inside a link that already has a name (back to top), it stays `alt=""` so screen readers don't hear it twice. That's checked page by page.
- **Needs the production domain (question 1)** for canonical URLs, share links and structured data.

## Cross-cutting

- **Home page order (v2):** Hero → short intro (condensed About) → **Selected Work** → Capabilities (what's included) → **How it works** → **Prices** → **Occasions** (5 cards linking to the pages) → **FAQ** → **Inquiry** (replaces the Consultation section) → Footer.
- **Performance budgets** (each phase must pass them on the live site):
  - mobile LCP ≤ 2.5 s, CLS ≤ 0.05
  - no growth in home-page JavaScript from showcases (they load on demand)
  - images: the QA-12 changes (quality 75 on phones, AVIF) folded into phase 3
- **Security:** inquiries reuse the hardened booking path (server validation, rate limit `inquiry`, honeypot, escaped emails). Admin routes keep `requireAdmin()` with RLS.
- **Tests:** Playwright for every feature, in all three languages for the key flows. Real submissions run against the `lyst-dev` database (not production); mocked responses are used elsewhere. Plus axe and a Lighthouse check per phase.
- **CLAUDE.md additions:**
  - i18n/copy rules (message files, the „დასწრების დადასტურება“ wording, the untranslated tagline, copy review)
  - the signature motion
  - showcase rules (fictional data, no network calls, no child photos)

## Defaults (I'll use these unless you say otherwise)

1. English URL slugs in all languages (`/ru/weddings`).
2. No language auto-detection, no language cookie.
3. Admin stays English-only.
4. Email is always required in the inquiry; phone is required only for WhatsApp/phone contact.
5. Guests are chosen as ranges, not typed numbers.
6. Showcases open in a dialog on desktop, full-screen on phones, and each has its own shareable URL.
7. `/login`, `/signup` and `/account` keep working but are unlinked (except "Client login" in the footer) and `noindex`.
8. Prices are shown in ₾ only.
9. No floating WhatsApp bubble.

## Questions for you

1. **Domain.** What's the production domain (e.g. `lyst.ge`)? It's needed for share images, canonical URLs, structured data and the email sender. If there isn't one yet, is `lystmain.vercel.app` fine for now?
2. **Email provider for the auto-confirmation (and to fix Supabase emails, QA-05):**
   - (a) **Resend** with your own domain: best deliverability, needs DNS records on the domain.
   - (b) **Gmail SMTP** from lystinvites@gmail.com with an app password: works today, about 500 emails a day, weaker deliverability.

   Which one?
3. **WhatsApp and reply time.** Is WhatsApp the same number (+995 568 13 02 60)? "We reply within 2 hours": during which hours and days (e.g. 10:00–20:00 Tbilisi, every day)? What should it say outside those hours ("we reply by 10:00 the next morning")?
4. **Packages.** Confirm or correct the draft inclusions for Essential / Signature / Atelier in section 4, especially the guest limits (if any), languages and revision rounds.
5. **Facts for How it works and the FAQ:**
   - How long from inquiry to proposal, and from approval to a finished invitation?
   - How many revision rounds?
   - Can details be changed after sending?
   - How do clients pay (bank transfer or card; deposit or not)?
6. **Hero headline.** Should **"Invite Smarter."** become the hero headline (in English, in every language)? Or stay as the tagline (share image, footer) with the current "Beyond the invitation." translated as the headline?
7. **Imagery and real invitations.** The Vercel account has `lyst-invite-1`, `-2` and `-3`. Are those your real invitations? If so, the showcases should match their format and features. For showcase and occasion visuals, which should I use:
   - (a) typography-only invitations (no photos)
   - (b) generated imagery like the current site's
   - (c) photos you supply
8. **Planners and venues.** What's the offer: a referral commission, partner pricing, co-branded or white-label invitations? Or just "work with us" for now?
9. **Russian legal pages.** Translate the Privacy Policy and Terms into Russian too (more lawyer-review work)? Or keep them in Georgian and English and link from the Russian site?
10. **Existing consultation requests.** Move them into the new Inquiries list, or keep them as a read-only "Archive" tab?
11. **Order.** OK to build languages first (phase 0), as recommended above?
12. **Envelope motion.** Direction A (photo revealed from an envelope on first load) or B (no hero animation; envelope only in showcases and the inquiry success state)?
