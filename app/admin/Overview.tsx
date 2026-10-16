"use client";

import { useEffect, useState } from "react";
import {
  activity,
  consultations,
  events,
  guests,
  hosts,
  sourceLabel,
  trafficSources,
  weeklyBookings,
} from "./data";
import { Card, Chip, CountUp, fmtDate, SectionTitle, Stagger } from "./ui";

function Kpi({
  label,
  value,
  suffix,
  delta,
  i,
}: {
  label: string;
  value: number;
  suffix?: string;
  delta: string;
  i: number;
}) {
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
        <p className="mt-3 text-xs text-black/60">{delta}</p>
      </Card>
    </Stagger>
  );
}

function WeeklyChart() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setOn(true));
    return () => cancelAnimationFrame(t);
  }, []);
  const max = Math.max(...weeklyBookings);
  return (
    <Card>
      <div className="flex items-baseline justify-between">
        <p className="text-[11px] uppercase tracking-[0.18em]">Consultation requests</p>
        <p className="text-xs text-black/60">Last 12 weeks</p>
      </div>
      <div
        role="img"
        aria-label={`Weekly consultation requests, last 12 weeks: ${weeklyBookings.join(", ")}`}
        className="mt-6 flex h-40 items-end gap-1.5 md:gap-3"
      >
        {weeklyBookings.map((v, i) => (
          <div key={i} className="group relative flex h-full flex-1 items-end">
            <div
              className={`w-full origin-bottom bg-[#201f1d] transition-[height,opacity] duration-[900ms] ease-out group-hover:opacity-70 ${i === weeklyBookings.length - 1 ? "" : "opacity-80"}`}
              style={{
                height: on ? `${(v / max) * 100}%` : "0%",
                transitionDelay: `${i * 45}ms`,
              }}
            />
            <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 text-[11px] opacity-0 transition-opacity group-hover:opacity-100">
              {v}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wider text-black/50">
        <span>12 wks ago</span>
        <span>This week</span>
      </div>
    </Card>
  );
}

function Traffic() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setOn(true));
    return () => cancelAnimationFrame(t);
  }, []);
  const total = trafficSources.reduce((s, x) => s + x.visits, 0);
  return (
    <Card>
      <div className="flex items-baseline justify-between">
        <p className="text-[11px] uppercase tracking-[0.18em]">Where visitors come from</p>
        <p className="text-xs text-black/60">{total.toLocaleString("en-GB")} visits</p>
      </div>
      <ul className="mt-6 space-y-4">
        {trafficSources.map((s, i) => {
          const pct = Math.round((s.visits / total) * 100);
          return (
            <li key={s.source}>
              <div className="flex justify-between text-sm">
                <span>{s.label}</span>
                <span className="tabular-nums text-black/70">{pct}%</span>
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
    </Card>
  );
}

export default function Overview({ goTo }: { goTo: (s: "bookings" | "events") => void }) {
  const upcoming = consultations
    .filter((c) => c.status === "new" || c.status === "confirmed")
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);
  const totalGuests = guests.length;
  const liveEvents = events.filter((e) => e.status === "live").length;
  const newRequests = consultations.filter((c) => c.status === "new").length;

  return (
    <div className="space-y-8">
      <SectionTitle eyebrow="Overview" title="Good to see you." />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <Kpi i={0} label="New requests" value={newRequests} delta="Awaiting a reply" />
        <Kpi i={1} label="Live events" value={liveEvents} delta={`${events.length} total`} />
        <Kpi i={2} label="Active hosts" value={hosts.filter((h) => h.status === "active").length} delta={`${hosts.length} registered`} />
        <Kpi i={3} label="Conversion" value={18} suffix="%" delta="Visit → consultation" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Stagger i={4}><WeeklyChart /></Stagger>
        <Stagger i={5}><Traffic /></Stagger>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Stagger i={6}>
          <Card>
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.18em]">Upcoming consultations</p>
              <button
                type="button"
                onClick={() => goTo("bookings")}
                className="text-[11px] uppercase tracking-[0.12em] underline-offset-4 hover:underline"
              >
                View all
              </button>
            </div>
            <ul className="mt-4 divide-y divide-[#efe8e2]">
              {upcoming.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm">{c.name}</p>
                    <p className="mt-1 text-xs text-black/60">
                      {fmtDate(c.date)} · {c.time} · {c.eventType} · via {sourceLabel[c.source]}
                    </p>
                  </div>
                  <Chip kind={c.status} />
                </li>
              ))}
            </ul>
          </Card>
        </Stagger>

        <Stagger i={7}>
          <Card>
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.18em]">Recent activity</p>
              <button
                type="button"
                onClick={() => goTo("events")}
                className="text-[11px] uppercase tracking-[0.12em] underline-offset-4 hover:underline"
              >
                Events
              </button>
            </div>
            <ul className="relative mt-4 space-y-4 before:absolute before:bottom-1 before:left-[5px] before:top-1 before:w-px before:bg-[#e6dedb]">
              {activity.map((a) => (
                <li key={a.id} className="relative pl-6">
                  <span className="absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full border border-[#201f1d] bg-[#f6f5f1]" />
                  <p className="text-sm">{a.text}</p>
                  <p className="mt-0.5 text-xs text-black/50">{a.time}</p>
                </li>
              ))}
            </ul>
          </Card>
        </Stagger>
      </div>

      <p className="text-xs text-black/50">
        {totalGuests} sample guest RSVPs shown across all events. All figures are placeholders.
      </p>
    </div>
  );
}
