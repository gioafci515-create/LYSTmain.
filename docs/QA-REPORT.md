# LYST customer QA report

**Date:** 2026-10-30 · **Build tested:** `ae4946a` (production build of `D:\dev\lyst`, served locally) · **Live checks:** https://lystmain.vercel.app (Lighthouse and header checks only, read-only)

## Summary

**Verdict: not ready for real clients yet.** The core works and is solid:
- **Booking works for everyone tested**, in Chromium, Firefox and WebKit (Safari) at every screen size.
- **Accessibility tests are clean**: axe found 0 violations and Lighthouse accessibility is 100.
- **The security basics hold**: headers, rate limits, no data leaks, no injected code ever runs.

What stops a launch is mostly **content and trust**, plus two infrastructure gaps:
- **Unfinished placeholders are public.** The footer shows "[details required]", "[content required]" and "PROPOSAL: CONTENT APPROVAL REQUIRED" on every page.
- **There is no way to contact LYST** except the booking form.
- **There is no privacy policy or terms page**, although the site collects personal data.
- **Infrastructure:** the shared rate-limit store (Upstash) isn't connected to the live project, and sign-up and reset emails are not confirmed to arrive.

### Top 5 issues
1. **QA-01 / QA-02 (High):** placeholder text and a "Proposal" line in the footer, and no email, phone or address anywhere. A corporate client (persona 3) can't contact LYST and sees an unfinished site.
2. **QA-03 (High):** no Privacy Policy or Terms, while booking and sign-up collect name, email, phone and event details.
3. **QA-04 (High):** Upstash isn't connected to `lystmain`, so live rate limits are per server instance, not shared.
4. **QA-05 (High, unverified):** sign-up confirmation and password-reset emails rely on Supabase's built-in mailer, which only delivers to Supabase team members (about 2 per hour). They can't be trusted to reach real users.
5. **QA-06 (Medium):** headlines are hidden until JavaScript runs (photos are not affected; see the correction under QA-07). Without JavaScript every heading is invisible, and on phones the hero headline appears late (Lighthouse mobile LCP 4.7 s, of which 2.2 s is "render delay").

## Fix status (updated 2026-10-30)

| Finding | Status |
|---|---|
| QA-01, QA-02 | **Fixed**: placeholders removed; footer shows lystinvites@gmail.com, +995 568 13 02 60, Tbilisi, Georgia. A regression test guards against placeholders. |
| QA-03 | **Drafts published, pending lawyer review**: `/privacy` and `/terms` in English and Georgian, version 1.0. Linked from the footer, every auth page, the sign-up consent line and the booking dialog. Review points are in `docs/legal/README.md`. |
| QA-04, QA-05 | **Open, your settings**: connect Upstash to `lystmain`; set up custom SMTP in Supabase. |
| QA-06 | **Fixed**: headings are visible without JavaScript. The hero headline animates in CSS from the first paint. Local mobile Lighthouse: LCP 4.7 s → 0.8 s, performance 83 → 100. |
| QA-07 | **Fixed**: a `noscript` email fallback for booking (the photo part of this finding was wrong; see the correction). |
| QA-08 | **Fixed**: the booking draft survives Escape, Close, outside clicks and Back. Back closes the dialog and stays on the page. A new form starts only after a request is sent. |
| QA-09 | **Fixed**: review rows wrap long text. Inputs are capped at the server limits (200 / 320 / 50 / 4,000). |
| QA-10 | **Fixed**: branded 404 page with "Go to the home page" and "Book a consultation". |
| QA-11, QA-12, QA-13 | **Not in scope** (not approved for this round). |
| QA-14 | **Fixed**: hero height is `min(900px, screen height)`, at least 480 px. The landscape headline is on the first screen. |
| QA-15 | **Fixed**: no text under 12 px on public pages (admin unchanged). |
| QA-16 | **Fixed**: island logo target is 56×24 px. |
| QA-17 | **Fixed**: a "Skip to content" link is the first Tab stop on every page. |
| QA-18 | **Fixed**: booking requests time out after 20 s with "The server took too long to answer…". |
| QA-19 | **Fixed**: the streak is retouched out of both consultation photos (patched from clean sea in the same rows, with feathered edges). |
| QA-20 | **Mitigated**: the network error message now says to refresh the page. |
| QA-21 | **Documented**: monitoring steps in `supabase/README.md`. |
| QA-22 | **Fixed**: slots are Tbilisi times (GMT+4), and visitors elsewhere also see their local time. Weekends and the 5-week calendar are unchanged (no decision yet). |
| QA-23 | **Partly fixed**: the wordmark is no longer preloaded (WebKit warning gone). Firefox still notes the unused responsive preload for the other screen size; that is how Firefox reports media-specific preloads, and it's harmless. |
| QA-24 | **Fixed**: the 16+ checkbox is 24×24 px. |

## Findings

Severity: Critical / High / Medium / Low / Polish. Screenshots are in `docs/screenshots/qa/`. "P1–P7" are the personas from the brief.

| ID | Sev. | Page | Persona | Steps to reproduce | Expected vs actual | Screenshot | Suggested fix |
|---|---|---|---|---|---|---|---|
| QA-01 | High | All (footer) | P1, P3 | Open any page and scroll to the footer, at any width. | **Expected:** finished content. **Actual:** "Email [details required]", "Privacy Policy [content required]", "Terms [content required]", "Facebook [link required]", "PROPOSAL: CONTENT APPROVAL REQUIRED". | `01-footer-placeholders-desktop.png`, `02-…-320.png` | Fill in the contact email, publish the legal pages (QA-03), add the Facebook link or remove the item, and delete the "Proposal" line before launch. |
| QA-02 | High | Home | P3 | As an HR manager, look for an email, phone or address to discuss a company event. | **Expected:** at least an email and the company name. **Actual:** none anywhere on the site, and nothing mentions corporate or company events. | `01-…png` | Add a contact email (and phone, legal entity and address) to the footer. Consider one line about corporate events. |
| QA-03 | High | All | All | Look for privacy information before booking or signing up. | **Expected:** Privacy Policy and Terms linked from the footer and next to forms that collect data. **Actual:** neither page exists. | `01-…png` | Publish `/privacy` and `/terms`: what is collected, why, retention, the processors (Supabase, Vercel, Upstash), and a contact for deletion requests. Link them near the booking "Send request" and the sign-up button. |
| QA-04 | High | Login, sign-up, reset, booking, visitor stats | P7 | `vercel env ls` on `lystmain`. | **Expected:** `KV_REST_API_URL/_TOKEN` (or `UPSTASH_REDIS_REST_*`) in Production. **Actual:** only the 4 Supabase/analytics variables, so limits run in each serverless instance's memory and an attacker spread across instances gets more attempts. | (none) | Connect the Upstash store to the `lystmain` project (Production and Preview) and redeploy. Check that `lyst:rl:*` keys appear in Upstash after a login attempt. |
| QA-05 | High | Sign-up, forgot password | P4 | Sign up with a real address (reported earlier: no email arrived). | **Expected:** confirmation within a minute, from a LYST sender. **Actual:** not verifiable here. Supabase's default mailer is limited to team members and about 2 emails per hour. | (none) | Configure custom SMTP in Supabase (Resend or Postmark), with sender "LYST" and SPF/DKIM on the domain. Then re-test with a plus-address. |
| QA-06 | Medium | Home (all sections) | P2, P7 | (a) Load the home page with JavaScript disabled. (b) Run Lighthouse on mobile. | **Expected:** headings are visible as soon as the HTML arrives. **Actual:** the hero headline and every section heading have `opacity: 0` until the JavaScript animation runs. Without JavaScript they never appear. The mobile LCP element is a headline word: 4.7 s, with time to first byte 0.3 s and render delay 2.2 s. On slow 3G the LCP is 6.9 s. | `04-no-javascript-headings-missing.png` | Keep text visible by default and only hide it for the animation once JavaScript is running (e.g. a `js` class on `<html>`, or `@media (scripting: enabled)`). Or don't animate the hero headline at all. |
| QA-07 | Medium | Home | P2, P7 | Load with JavaScript disabled. | **Expected:** there is some way to book. **Actual:** the three "Book" buttons do nothing and there is no fallback. *Correction (2026-10-30): the first version of this report also said photos stay brown without JavaScript. That was wrong; the screenshot was taken before the images had finished decoding. All 14 photos load without JavaScript (re-measured), and the screenshot has been replaced.* | `04-no-javascript-headings-missing.png` | Add a `noscript` fallback next to the booking button with the contact email. |
| QA-08 | Medium | Booking dialog | P6 | Fill in details, then press Escape, click outside the dialog, or press the browser's Back button. | **Expected:** the draft is kept, and Back closes the dialog. **Actual:** reopening starts again at "Date" with everything cleared. Back leaves the page (went to `/login` in the test) and the input is lost. | (none) | Keep the booking state when the dialog is closed (don't remount; or save a draft in sessionStorage). Add a history entry when the dialog opens so Back closes it. |
| QA-09 | Medium | Booking review step | P1, P6 | At 320 px, enter `anastasia.kartvelishvili.wedding2027@bagrationi-events-tbilisi.ge` and continue to review. | **Expected:** the text wraps. **Actual:** the dialog scrolls sideways by 73 px and the email is cut off. 5,000-character input makes it 42,000 px wide. The server also silently cuts the name at 200, phone at 50 and context at 4,000 characters, while the review step showed the full text. | `05-long-email-overflows-review-320.png` | Add `overflow-wrap: anywhere` to the review rows. Add `maxLength` to the inputs that matches the server limits (200 / 320 / 50 / 4000). |
| QA-10 | Medium | Any unknown URL | P1, P3 | Open `/does-not-exist`. | **Expected:** a LYST-styled page with a way back. **Actual:** Next.js's default "404: This page could not be found." in the system font, with no navigation. | `06-404-page-unbranded-1440.jpg` | Add `app/not-found.tsx` in the LYST style, with a link home and a "Book a consultation" button. |
| QA-11 | Medium | Booking (admin side) | P5 | Submit a booking. | **Expected:** the admin is alerted and the requester gets a confirmation. **Actual:** no email to either. Requests wait until someone opens `/admin`, even though the success screen says "We will email you". | `13-p1-iphone-request-received.png` | Send an admin notification and a requester confirmation over the same SMTP as QA-05. |
| QA-12 | Medium | Home (mobile) | P1, P2 | Slow 3G and 4× CPU throttling on a 360 px phone. | **Expected:** the page is usable within seconds. **Actual:** DOM ready 5.3 s, LCP 6.9 s, full load 36 s, 1.5 MB transferred. Photos are served at quality 90 (the hero is 157 KB). The booking flow itself then completes in 2 s. | `14-p2-slow-android-booking-done.png` | Use quality 75 for phone variants and enable AVIF (`images.formats`). Combined with QA-06 this brings mobile LCP down. |
| QA-13 | Medium | Whole site | P1, P3 | Look for prices, packages, past work, Georgian/Russian versions. | **Expected (per the QA brief):** pricing guidance, "Selected Work", ka/en/ru. **Actual:** none of these exist (see "Not in the site" below). | (none) | Product decision: add at least a "from" price or "how pricing works", a few past projects, and the languages your clients need. |
| QA-14 | Low | Home hero | P1 | Phone in landscape (844×390), or a short desktop window. | **Expected:** the headline is on the first screen. **Actual:** the hero is a fixed 900 px tall from the `md` breakpoint up, so the first screen is only the photo and the menu. The headline starts about 595 px down. | `03-landscape-first-screen-no-headline.png` | Cap the hero height at the viewport height (e.g. `md:h-[min(900px,100svh)]`). |
| QA-15 | Low | Home, island | P2 | Measure text sizes. | **Expected:** labels readable for older users. **Actual:** 43 elements are 10–11 px (section numbers, uppercase labels, the island's "Book"). | `20-home-full-390-chromium.jpg` | Minimum 12 px for UI labels; 13–14 px where the label carries meaning. |
| QA-16 | Low | Dynamic Island | P2 | Tap the island's logo. | **Expected:** target at least 24×24 px (WCAG 2.2, 2.5.8). **Actual:** about 50×18 px. | (none) | Pad the logo link to at least 24 px tall. |
| QA-17 | Low | All | P7 (keyboard) | Press Tab on any page. | **Expected:** a "Skip to content" link first. **Actual:** none. Focus starts on the logo. | (none) | Add a visually hidden skip link that becomes visible on focus. |
| QA-18 | Low | Booking | P6 | The server never answers. | **Expected:** an error after a reasonable time. **Actual:** still "Sending…" after 30 s, with no timeout. | (none) | Abort the request after about 20 s and show the existing "could not be sent" step. |
| QA-19 | Low | Booking photo (section 05) | P1 | Look at the beach photo above the horizon, top left. | **Expected:** a clean photo. **Actual:** a blurred vertical streak, an artefact in the image file, visible at all sizes. | `02-consultation-photo-artefact-and-footer-320.png` | Retouch or replace `consultation-hd.jpg` and `consultation-m-hd.jpg`. |
| QA-20 | Low | Login and sign-up (after deploys) | P6 | Leave the login page open, deploy a new version, then submit. | **Expected:** it works, or says to refresh. **Actual (inferred from Next.js behaviour, not reproduced):** the old page calls server-action IDs that no longer exist, and the user sees "We could not reach the server". | (none) | On that error, offer "Refresh the page and try again". |
| QA-21 | Low | Auth (infrastructure) | P7 | Many visitors log in at once. | Since auth moved server-side, Supabase sees all login traffic from Vercel's server IPs. Supabase's own per-IP limits are therefore shared by all visitors. | (none) | Watch the Supabase auth logs; raise the auth rate limits in Supabase if 429s appear. |
| QA-22 | Polish | Booking | P1 | Pick a slot from abroad. | The slots are shown in the visitor's time zone (e.g. "09:30 America/New_York"). Weekends are selectable. The calendar shows about 5 weeks with no "next month". | `12-p1-iphone-review-step.png` | Decide whether slots should be fixed Tbilisi times and whether weekends are bookable. |
| QA-23 | Polish | Home | (all) | Firefox and WebKit console. | Warning: the preloaded hero and wordmark images weren't used within a few seconds (responsive preload). | (none) | Check the `priority` and `sizes` on those images. |
| QA-24 | Polish | Sign-up | P2 | The 16+ checkbox. | 20×20 px. The label text is clickable, so it passes, but it's small for older users. | (none) | Make it 24 px. |

### Not in the site (asked for in the brief)

These items from the brief don't exist in the current codebase, so they couldn't be tested:
- **Language switching (ka/en/ru)** and Georgian or Cyrillic copy: the site is English-only.
- **"What is LYST", "Selected Work" and "Start a Project" sections:** the sections are Hero, About, Capabilities, The Experience and Consultation.
- **Pricing.**
- **Guest-count field:** the booking form asks for date, time, name, email, phone and event context.
- **Invitation templates.**

## Passed

- **Layout matrix:** Chromium, Firefox and WebKit × 320 / 375 / 390 / 414 / 768 / 1440 / 1920 px and phone landscape × 8 pages (192 loads). No horizontal overflow, no clipped text, every visible image loads, Inter is self-hosted and loads, and there are no requests to other domains and no console errors (apart from the expected 404).
- **Booking happy path:** on an iPhone 14 (WebKit), a slow Android (Chromium) and desktop Chromium, Firefox and WebKit, through date → time → details → review → "Request received". Escape closes the dialog in every browser.
- **Form input:**
  - Accepted: Georgian, emoji, Cyrillic, apostrophes, hyphens, plus-addressing and uppercase emails.
  - Rejected with a plain message next to the field: empty, spaces-only and invalid emails (`ana@`, `ana@gmail`).
  - Typed input is kept after an error.
  - In the calendar, past dates and today can't be picked.
- **Double submit:** 5 fast clicks send 1 request.
- **Offline mid-submit:** a clear "check your connection, nothing has been saved" message, and "Try again" succeeds once back online.
- **Injection:** `<img onerror>` and `<script>` in every booking field are shown as plain text, never run. SQL-looking input gets a generic error with nothing internal leaked.
- **API probes:** malformed input, wrong types, past, impossible and far-future dates all return 400 with plain words. 25 KB bodies return 413. Admin routes return 401 without a session, and a wrong method returns 405. No stack traces, database errors or secrets appear in any response or error page.
- **Rate limits:** the 6th booking from one IP gets 429, while other IPs are unaffected. The 11th wrong login gets "Too many attempts. Please wait a few minutes and try again."
- **Security headers:** CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy and Permissions-Policy on pages, auth pages, API, static files, images and the 404. No `X-Powered-By`.
- **Auth edge cases:**
  - Wrong password shows a friendly error and keeps the email.
  - "Forgot password" with an unknown email gives the same neutral message, so it doesn't reveal which accounts exist.
  - An expired or invalid confirmation link shows a clear notice.
  - "Choose a new password" without a valid link says the link has expired.
  - Open-redirect attempts (`//evil`, `/\evil`, `https://evil`) stay on the site.
  - Logged-out `/account` goes to `/login`, and logged-out `/admin` shows the admin login.
  - No session cookie is readable from JavaScript.
- **Accessibility:**
  - axe (WCAG 2.2 AA plus best practices): 0 violations on 6 pages at 390 and 1440 px.
  - Heading order is logical, and every field has a label.
  - The dialog is named. Focus moves to "Close" when it opens and returns to the button that opened it after Escape.
  - Visible focus at every tab stop.
- **Conditions:** 200% zoom (no overflow), OS dark mode (stays light and readable), Windows high-contrast/forced colours (headings and borders visible), reduced motion (all content visible).
- **Links:** every internal link returns 200. Instagram and TikTok open in a new tab with `noopener`.
- **Dynamic Island:** hidden on the hero, compact when scrolling down, expanded when scrolling up. Its "Book" opens the dialog, and its logo scrolls to the top.
- **Lighthouse on the live site:**
  - Accessibility 100 and best practices 100 on every page.
  - Performance 100 on desktop everywhere, and 99–100 on mobile for the auth pages.
  - CLS 0 everywhere.
  - Auth-page SEO 63 is intentional: those pages are marked "noindex".
- **Design rules (CLAUDE.md), spot-checked on the screenshots:** no decorative gradients, no em dashes in UI copy, no fade-in on text blocks, no opacity-only hover on the checked buttons.

## Couldn't test, and why

- **Persona 4 end to end** (sign up → confirm email → log in → log out → forgot → reset → log in again → account page): there was no test inbox. Test accounts also couldn't be deleted afterwards: the Supabase connector is logged into a different account, and the service key is "Sensitive" in Vercel, so it couldn't be pulled. **Needed:** an inbox for plus-addresses, plus access to delete test users.
- **Persona 5 (admin)**, `/admin` as a normal user, two devices, logout in another tab, an expired overnight session, a confirmation link opened twice, a reused reset link: these need real accounts and credentials.
- **Emails** (arrival, language, links, mobile Gmail, sender name, spam): there was no inbox. See QA-05.
- **A real booking saved on production:** it would create a row the admin screen can't delete. Locally, saving is impossible because the service key is empty, so success was tested by faking the server's reply in the browser. The server's validation, rate limit and error paths were tested for real.
- **XSS in the admin bookings view:** checked by reading the code only. It renders plain React text and never uses `dangerouslySetInnerHTML`, but it wasn't rendered live without admin access.
- **Rate-limit recovery after the window** (10–60 minutes): not waited out.
- **Cookies blocked:** needs a working login.
- **A real ad-blocker extension:** not installed. The site makes no third-party requests, so the only risk is that `/api/track` gets blocked, which would slightly undercount visits.
- **A real screen reader** (NVDA, VoiceOver): automated equivalents were used instead (axe, accessible names, focus order).
- **Vercel Preview:** all environment variables are Production-only, so a preview deployment would have no Supabase. I used the local production build instead.
- **INP:** needs real user interactions. Lab TBT (≤ 80 ms) was used as a stand-in.

## How this was run

- **Local production build:** `next build && next start` on `http://localhost:3200`, from `D:\dev\lyst` at `ae4946a`.
- **Browsers:** Playwright 1.64.1 driving Chromium 1248, Firefox 157 and WebKit 27.2.
- **Live site:** Lighthouse 13.6, read-only. Lighthouse identifies itself, so the visit counter ignores it.
- **Accessibility:** axe-core 4.14.
- **WebKit over plain HTTP:** the production CSP's `upgrade-insecure-requests` makes WebKit request local assets over HTTPS, which doesn't exist locally. For WebKit runs only, that one directive was removed from local responses in the test browser. On the real HTTPS site it has no effect.
- **No database writes:** the visitor counter was answered inside the browser during tests, and booking success was faked in the browser.
- **Test scripts:** `D:\dev\.qa-lyst\` (`matrix.mjs`, `flows.mjs`, `lh.mjs`, `verify*.mjs`). They're outside the repo and not committed.
