"use client";

import { site, socialLabels, type SocialKey } from "@/lib/site";
import { Card, SectionTitle, Stagger } from "./ui";

type Item = { label: string; done: boolean; hint: string };

const social = Object.keys(socialLabels) as SocialKey[];

const checklist: Item[] = [
  { label: "Booking requests saved to a database", done: true, hint: "Consultation form saves to Supabase and appears under Bookings." },
  { label: "Admin login protection", done: true, hint: "Only accounts with the admin role can open this dashboard or its data." },
  { label: "Host sign-up and log-in", done: true, hint: "Email + password via Supabase, with email confirmation and password reset." },
  { label: "Visitor statistics", done: true, hint: "Cookieless page views with source and device. No IP addresses stored." },
  { label: "Official wordmark", done: true, hint: "White PNG is in the header. An approved EPS/SVG for the footer is still pending." },
  ...social.map((k) => ({
    label: `${socialLabels[k]} link`,
    done: !!site.social[k],
    hint: `Add the profile URL to lib/site.ts → social.${k}.`,
  })),
  { label: "Contact email", done: !!site.contact.email, hint: "lib/site.ts → contact.email. Shown in the footer." },
  { label: "Contact phone / address", done: !!(site.contact.phone && site.contact.address), hint: "lib/site.ts → contact.phone and contact.address." },
  { label: "Production domain", done: !!site.url, hint: "lib/site.ts → url, then point DNS at the host." },
  { label: "Privacy Policy text", done: false, hint: "Needs approved legal copy. Must list every kind of data collected (see below)." },
  { label: "Terms text", done: false, hint: "Needs approved legal copy." },
  { label: "Confirmation emails", done: false, hint: "Requests are saved but the customer is not emailed yet. Needs an email provider such as Resend." },
  { label: "Email notification to you", done: false, hint: "You are not notified of new requests yet; check Bookings, or add an email provider." },
  { label: "Supabase email sender", done: false, hint: "Default Supabase emails are rate-limited (a few per hour). Add a custom SMTP sender before launch." },
  { label: "Event creation and guest RSVPs", done: false, hint: "Not built. Events and Guests tabs will fill once hosts can create events." },
  { label: "Favicon and share image", done: false, hint: "Add app/icon.png and an Open Graph image for link previews." },
];

const collected = [
  ["Consultation request", "Name, email, phone (optional), event details, requested date and time, how they found LYST."],
  ["Host account", "Name, email, password (stored hashed by Supabase), sign-up time."],
  ["Visits", "Page, traffic source (Instagram, TikTok, Facebook, direct, other), device type, and a daily anonymous hash. No cookies, no IP address, no raw user-agent."],
];

export default function Settings() {
  const done = checklist.filter((c) => c.done).length;
  const pct = Math.round((done / checklist.length) * 100);

  return (
    <div className="space-y-8">
      <SectionTitle eyebrow="Setup" title="Go-live checklist" />

      <Stagger>
        <Card>
          <div className="flex items-baseline justify-between">
            <p className="text-[11px] uppercase tracking-[0.18em]">Launch readiness</p>
            <p className="text-sm tabular-nums">{done} / {checklist.length}</p>
          </div>
          <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Launch readiness" className="mt-4 h-2 bg-[#ece5de]">
            <div className="h-full bg-[#201f1d] transition-[width] duration-[1200ms] ease-out" style={{ width: `${pct}%` }} />
          </div>
        </Card>
      </Stagger>

      <ul className="grid gap-3 md:grid-cols-2">
        {checklist.map((c, i) => (
          <li key={c.label}>
            <Stagger i={i + 1}>
              <Card className="h-full">
                <div className="flex items-start gap-3">
                  <span aria-hidden className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border text-[11px] ${c.done ? "border-[#27401d] bg-[#27401d] text-white" : "border-[#c9bfb6]"}`}>
                    {c.done ? "✓" : ""}
                  </span>
                  <div>
                    <p className="text-sm">
                      {c.label}
                      <span className="sr-only">{c.done ? " — done" : " — still needed"}</span>
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-black/60">{c.hint}</p>
                  </div>
                </div>
              </Card>
            </Stagger>
          </li>
        ))}
      </ul>

      <Stagger>
        <Card>
          <p className="text-[11px] uppercase tracking-[0.18em]">Data we collect (for the Privacy Policy)</p>
          <dl className="mt-4 divide-y divide-[#efe8e2]">
            {collected.map(([k, v]) => (
              <div key={k} className="py-3 text-sm">
                <dt>{k}</dt>
                <dd className="mt-1 text-xs leading-relaxed text-black/60">{v}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </Stagger>

      <Stagger>
        <Card>
          <p className="text-[11px] uppercase tracking-[0.18em]">Social profiles</p>
          <ul className="mt-4 divide-y divide-[#efe8e2]">
            {social.map((k) => (
              <li key={k} className="flex items-center justify-between gap-4 py-3 text-sm">
                <span>{socialLabels[k]}</span>
                {site.social[k] ? (
                  <a href={site.social[k]} target="_blank" rel="noopener noreferrer" className="truncate text-black/70 underline-offset-4 hover:underline">
                    {site.social[k]}
                  </a>
                ) : (
                  <span className="text-black/50">Not added yet</span>
                )}
              </li>
            ))}
          </ul>
        </Card>
      </Stagger>
    </div>
  );
}
