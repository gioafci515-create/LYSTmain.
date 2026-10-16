"use client";

import { useEffect, useState } from "react";
import { events, type EventItem } from "./data";
import { Card, Chip, EmptyState, FilterChips, fmtDate, SectionTitle, Stagger } from "./ui";

type Filter = "all" | EventItem["status"];

function Rsvp({ e }: { e: EventItem }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setOn(true));
    return () => cancelAnimationFrame(t);
  }, []);
  const total = e.yes + e.no + e.pending || 1;
  const seg = (n: number) => (on ? `${(n / total) * 100}%` : "0%");
  return (
    <div className="mt-5">
      <div
        role="img"
        aria-label={`${e.yes} attending, ${e.no} declined, ${e.pending} awaiting reply`}
        className="flex h-2 w-full overflow-hidden bg-[#ece5de]"
      >
        <div className="bg-[#2f5a24] transition-[width] duration-[1100ms] ease-out" style={{ width: seg(e.yes) }} />
        <div className="bg-[#a8483c] transition-[width] duration-[1100ms] ease-out" style={{ width: seg(e.no) }} />
        <div className="bg-[#c9a23d] transition-[width] duration-[1100ms] ease-out" style={{ width: seg(e.pending) }} />
      </div>
      <dl className="mt-3 grid grid-cols-3 text-center text-xs">
        <div><dd className="text-lg font-light tabular-nums">{e.yes}</dd><dt className="text-black/50">Attending</dt></div>
        <div><dd className="text-lg font-light tabular-nums">{e.no}</dd><dt className="text-black/50">Declined</dt></div>
        <div><dd className="text-lg font-light tabular-nums">{e.pending}</dd><dt className="text-black/50">Awaiting</dt></div>
      </dl>
    </div>
  );
}

export default function Events() {
  const [filter, setFilter] = useState<Filter>("all");
  const shown = events.filter((e) => filter === "all" || e.status === filter);
  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Invitations" title="Events" />
      <FilterChips<Filter>
        label="Filter events"
        value={filter}
        onChange={setFilter}
        options={[
          { value: "all", label: "All", count: events.length },
          { value: "live", label: "Live", count: events.filter((e) => e.status === "live").length },
          { value: "draft", label: "Draft", count: events.filter((e) => e.status === "draft").length },
          { value: "past", label: "Past", count: events.filter((e) => e.status === "past").length },
        ]}
      />
      {shown.length === 0 ? (
        <EmptyState text="No events here yet." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3">
          {shown.map((e, i) => (
            <Stagger key={e.id} i={i}>
              <Card>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-black/50">{e.id}</p>
                    <p className="mt-1 text-lg font-light leading-snug">{e.title}</p>
                  </div>
                  <Chip kind={e.status} />
                </div>
                <p className="mt-3 text-xs text-black/60">
                  {fmtDate(e.date)} · {e.location} · Host: {e.host}
                </p>
                <Rsvp e={e} />
              </Card>
            </Stagger>
          ))}
        </div>
      )}
    </div>
  );
}
