"use client";

import { site, socialLabels, type SocialKey } from "@/lib/site";
import { Card, SectionTitle, Stagger } from "./ui";

type Item = { label: string; done: boolean; hint: string };

const social = Object.keys(socialLabels) as SocialKey[];

const checklist: Item[] = [
  { label: "Official wordmark", done: true, hint: "White PNG from Figma is in the header. An approved EPS/SVG for the footer is still pending." },
  ...social.map((k) => ({
    label: `${socialLabels[k]} link`,
    done: !!site.social[k],
    hint: `Add the profile URL to lib/site.ts → social.${k}.`,
  })),
  { label: "Contact email", done: !!site.contact.email, hint: "lib/site.ts → contact.email. Shown in the footer." },
  { label: "Contact phone / address", done: !!(site.contact.phone && site.contact.address), hint: "lib/site.ts → contact.phone and contact.address." },
  { label: "Production domain", done: !!site.url, hint: "lib/site.ts → url, then point DNS at the host." },
  { label: "Privacy Policy text", done: false, hint: "Needs approved legal copy. Footer shows a placeholder." },
  { label: "Terms text", done: false, hint: "Needs approved legal copy. Footer shows a placeholder." },
  { label: "Cookie / analytics consent", done: false, hint: "Required before adding analytics or social pixels in the EU/UK." },
  { label: "Booking backend", done: false, hint: "Consultation flow is a front-end demo. Needs a calendar/DB and email confirmations." },
  { label: "Host authentication", done: false, hint: "Log in / sign up are demos. Needs an auth provider." },
  { label: "Admin login protection", done: false, hint: "This /admin page has NO login. Do not deploy publicly until auth is added." },
  { label: "Favicon and share image", done: false, hint: "Add app/icon.png and an Open Graph image for link previews." },
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
          <div
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Launch readiness"
            className="mt-4 h-2 bg-[#ece5de]"
          >
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
                  <span
                    aria-hidden
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border text-[11px] ${c.done ? "border-[#27401d] bg-[#27401d] text-white" : "border-[#c9bfb6]"}`}
                  >
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
