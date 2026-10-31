# Legal documents: LAWYER REVIEW REQUIRED

`/privacy` and `/terms` are **drafts** (version 1.0, 2026-10-30), written in plain English and Georgian from what the site actually does, with a Russian translation added on 2026-10-31. Each language has its own page (`/privacy`, `/en/privacy`, `/ru/privacy`, same for `/terms`) and says the Georgian version prevails. They are live so the site isn't without them, but **a lawyer qualified in Georgian data protection law (and EU GDPR, if you serve EU visitors) must review them before you rely on them.** This note is deliberately not shown on the pages.

- Text: `lib/legal/privacy.ts`, `lib/legal/terms.ts` (all three languages, same sections in the same order)
- "Georgian prevails" sentence: `legal.prevails` in `messages/{ka,en,ru}.json`
- Version and date: `lib/legal/meta.ts`
- Page layout: `app/components/legal/LegalPage.tsx`

## Points for the lawyer

1. **Who the controller is.** The text says "LYST, Tbilisi, Georgia" with lystinvites@gmail.com and +995 568 13 02 60. Add the registered legal name, registration (ID) number and legal address once they exist.
2. **Retention periods (drafted as proposals):** consultation requests 24 months after last contact; accounts deleted within 30 days of a request, with backups overwritten within 90 days; visit statistics 24 months; security counters 1 hour.
3. **Response time to data requests:** drafted as "10 working days" (Georgian Law on Personal Data Protection). Confirm, including whether an extension may be mentioned.
4. **International transfers:** Supabase, Vercel, Upstash and Google (Gmail) may store data outside Georgia (EU/USA). Confirm the wording about contractual safeguards, and sign or confirm the processors' data processing agreements.
5. **Legal bases:** contract or steps you asked for, legitimate interest (security, aggregate statistics) and consent (marketing). Confirm they match the Georgian law's grounds.
6. **Cookies:** the policy says only sign-in cookies are used (no statistics or advertising cookies), so no consent banner is shown. Confirm that this is sufficient.
7. **Children:** host accounts are 16+, and the terms already cover guest uploads (written parental consent for children's images, no marketing use). Confirm before uploads are built.
8. **Terms:** liability limits, the consumer-rights wording, and the governing law and court clause (Georgia / Tbilisi, with consumers' home-country rights preserved).
9. **Language:** say which version prevails if the English and Georgian differ (usually Georgian in Georgia), and have a native speaker proofread the Georgian.
10. **Pricing statement:** "requesting a consultation does not commit you to buying anything". Confirm, and say whether consultations are free.

## When the text changes

Bump `LEGAL_VERSION`, set `LEGAL_UPDATED` in `lib/legal/meta.ts`, and add a line below. For important changes, also email account holders (as both documents promise).

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-10-30 | First drafts (EN + KA), pending lawyer review |
| 1.0 | 2026-10-31 | Russian translation added, one page per language, "Georgian version prevails" line in every language. Content unchanged, so the version stays 1.0. The Russian text needs the same review. |
