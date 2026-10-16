"use client";

import { useEffect, useMemo, useState } from "react";
import { sourceLabel, type Source } from "@/lib/source";
import type { AdminData } from "./data";
import { Card, Chip, CountUp, EmptyState, fmtDate, GhostButton, SectionTitle, Stagger } from "./ui";

function Kpi({ label, value, suffix, note, i }: { label: string; value: number; suffix?: string; note: string; i: number }) {
  return (
    <Stagger i={i}>
      <Card className="group h-full">
        <span
          aria-hidden
          className="absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-black/[0.04] to-transparent transition-transform duration-700 group-hover:translate-x-[400%]"
        />
        <p className="text-[10px] uppercase tracking-[0.18em] text-black/60">{label}</p>
        <p className="mt-4 text-4xl font-light tracking-tight md:text-5xl">
          <CountUp value={value} suffix={suffix} />
        </p>
        <p className="mt-3 text-xs text-black/60">{note}</p>
      </Card>
    </Stagger>
  );
}

function useGrow() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setOn(true));
    return () => cancelAnimationFrame(t);
  }, []);
  return on;
}

function Bars({ values, label, caption }: { values: number[]; label: string; caption: [string, string] }) {
  const on = useGrow();
  const max = Math.max(1, ...values);
  return (
    <>
      <div role="img" aria-label={`${label}: ${values.join(", ")}`} className="mt-6 flex h-40 items-end gap-[3px] md:gap-1.5">
        {values.map((v, i) => (
          <div key={i} className="group relative flex h-full flex-1 items-end">
            <div
              className="w-full bg-[#201f1d] opacity-80 transition-[height,opacity] duration-[900ms] ease-out group-hover:opacity-60"
              style={{ height: on ? `${Math.max((v / max) * 100, v > 0 ? 3 : 0.6)}%` : "0%", transitionDelay: `${Math.min(i, 30) * 25}ms` }}
            />
            <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 text-[11px] opacity-0 transition-opacity group-hover:opacity-100">
              {v}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wider text-black/50">
        <span>{caption[0]}</span>
        <span>{caption[1]}</span>
      </div>
    </>
  );
}

function Meter({ rows }: { rows: { key: string; label: string; value: number }[] }) {
  const on = useGrow();
  const total = rows.reduce((s, r) => s + r.value, 0) || 1;
  return (
    <ul className="mt-6 space-y-4">
      {rows.map((r, i) => {
        const pct = Math.round((r.value / total) * 100);
        return (
          <li key={r.key}>
            <div className="flex justify-between gap-4 text-sm">
              <span className="truncate">{r.label}</span>
              <span className="shrink-0 tabular-nums text-black/70">
                {r.value.toLocaleString("en-GB")} · {pct}%
              </span>
            </div>
            <div className="mt-2 h-1.5 bg-[#ece5de]">
              <div
                className="h-full bg-[#201f1d] transition-[width] duration-[1100ms] ease-out"
                style={{ width: on ? `${pct}%` : "0%", transitionDelay: `${i * 90}ms` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

const SOURCE_ORDER: Source[] = ["instagram", "tiktok", "facebook", "direct", "other"];
const DEVICE_LABEL: Record<string, string> = { mobile: "Mobile", tablet: "Tablet", desktop: "Desktop", unknown: "Unknown" };

export default function Overview({
  data,
  goTo,
  onRefresh,
}: {
  data: AdminData;
  goTo: (s: "bookings") => void;
  onRefresh: () => void;
}) {
  const { consultations, hosts, stats, weekly } = data;

  const [now] = useState(() => Date.now());
  const newRequests = consultations.filter((c) => c.status === "new").length;
  const last30 = useMemo(() => {
    const cutoff = now - 30 * 86_400_000;
    return consultations.filter((c) => new Date(c.created_at).getTime() >= cutoff).length;
  }, [consultations, now]);
  const conversion = stats && stats.visitors > 0 ? Math.round((last30 / stats.visitors) * 1000) / 10 : 0;

  // Fill gaps so the daily chart always shows 30 consecutive days.
  const daily = useMemo(() => {
    if (!stats) return [];
    const byDay = new Map(stats.daily.map((d) => [d.day, d.visitors]));
    const out: number[] = [];
    for (let i = stats.days - 1; i >= 0; i--) {
      out.push(byDay.get(new Date(now - i * 86_400_000).toISOString().slice(0, 10)) ?? 0);
    }
    return out;
  }, [stats, now]);

  const sources = stats
    ? SOURCE_ORDER.map((s) => ({
        key: s,
        label: sourceLabel[s],
        value: stats.sources.find((x) => x.source === s)?.visitors ?? 0,
      }))
    : [];

  const recent = consultations.slice(0, 5);

  return (
    <div className="space-y-8">
      <SectionTitle
        eyebrow="Overview"
        title="Good to see you."
        action={<GhostButton onClick={onRefresh}>Refresh</GhostButton>}
      />

      {!stats && (
        <Card>
          <p className="text-[11px] uppercase tracking-[0.18em]">Visitor statistics need one more step</p>
          <p className="mt-3 text-sm font-light leading-relaxed text-black/80">
            Re-run <code>supabase/schema.sql</code> in the Supabase SQL Editor to add the statistics function, then
            press Refresh. {data.statsError && <span className="block text-xs text-black/50">Detail: {data.statsError}</span>}
          </p>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <Kpi i={0} label="New requests" value={newRequests} note={`${consultations.length} total`} />
        <Kpi i={1} label="Visitors, 30 days" value={stats?.visitors ?? 0} note="Unique per day, summed" />
        <Kpi i={2} label="Page views, 30 days" value={stats?.views ?? 0} note="All pages" />
        <Kpi i={3} label="Request rate" value={conversion} suffix="%" note={`${last30} requests / visitors`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Stagger i={4}>
          <Card>
            <div className="flex items-baseline justify-between">
              <p className="text-[11px] uppercase tracking-[0.18em]">Visitors per day</p>
              <p className="text-xs text-black/60">Last 30 days</p>
            </div>
            <Bars values={daily.length ? daily : Array(30).fill(0)} label="Daily visitors, last 30 days" caption={["30 days ago", "Today"]} />
          </Card>
        </Stagger>
        <Stagger i={5}>
          <Card>
            <div className="flex items-baseline justify-between">
              <p className="text-[11px] uppercase tracking-[0.18em]">Consultation requests</p>
              <p className="text-xs text-black/60">Last 12 weeks</p>
            </div>
            <Bars values={weekly} label="Requests per week, last 12 weeks" caption={["12 wks ago", "This week"]} />
          </Card>
        </Stagger>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Stagger i={6}>
          <Card className="h-full">
            <p className="text-[11px] uppercase tracking-[0.18em]">Where visitors come from</p>
            {stats && stats.visitors > 0 ? <Meter rows={sources} /> : <p className="mt-6 text-sm font-light text-black/60">No visits recorded yet.</p>}
          </Card>
        </Stagger>
        <Stagger i={7}>
          <Card className="h-full">
            <p className="text-[11px] uppercase tracking-[0.18em]">Devices</p>
            {stats && stats.devices.length > 0 ? (
              <Meter rows={stats.devices.map((d) => ({ key: d.device, label: DEVICE_LABEL[d.device] ?? d.device, value: d.views }))} />
            ) : (
              <p className="mt-6 text-sm font-light text-black/60">No visits recorded yet.</p>
            )}
          </Card>
        </Stagger>
        <Stagger i={8}>
          <Card className="h-full">
            <p className="text-[11px] uppercase tracking-[0.18em]">Top pages</p>
            {stats && stats.top_pages.length > 0 ? (
              <Meter rows={stats.top_pages.map((p) => ({ key: p.path, label: p.path, value: p.views }))} />
            ) : (
              <p className="mt-6 text-sm font-light text-black/60">No visits recorded yet.</p>
            )}
          </Card>
        </Stagger>
      </div>

      <Stagger i={9}>
        <Card>
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.18em]">Latest consultation requests</p>
            <button type="button" onClick={() => goTo("bookings")} className="text-[11px] uppercase tracking-[0.12em] underline-offset-4 hover:underline">
              View all
            </button>
          </div>
          {recent.length === 0 ? (
            <div className="mt-4"><EmptyState text="No consultation requests yet." /></div>
          ) : (
            <ul className="mt-4 divide-y divide-[#efe8e2]">
              {recent.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm">{c.name}</p>
                    <p className="mt-1 text-xs text-black/60">
                      {c.preferred_date ? fmtDate(c.preferred_date) : "No date"} · {c.preferred_time ?? "—"} · via {sourceLabel[c.source]}
                    </p>
                  </div>
                  <Chip kind={c.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </Stagger>

      <p className="text-xs text-black/50">
        {hosts.filter((h) => h.role === "host").length} host accounts · visits are counted without cookies; no IP addresses are stored.
      </p>
    </div>
  );
}
