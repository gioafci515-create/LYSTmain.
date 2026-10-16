"use client";

import { useMemo, useState } from "react";
import { consultations as seed, sourceLabel, type Consultation, type ConsultationStatus } from "./data";
import {
  Card,
  Chip,
  downloadCsv,
  EmptyState,
  FilterChips,
  fmtDate,
  GhostButton,
  SearchBox,
  SectionTitle,
  Sheet,
  Stagger,
} from "./ui";

type Filter = "all" | ConsultationStatus;
const STATUSES: ConsultationStatus[] = ["new", "confirmed", "completed", "cancelled"];

export default function Consultations() {
  const [items, setItems] = useState<Consultation[]>(seed);
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter(
      (c) =>
        (filter === "all" || c.status === filter) &&
        (!needle ||
          [c.name, c.email, c.eventType, c.id, sourceLabel[c.source]]
            .join(" ")
            .toLowerCase()
            .includes(needle)),
    );
  }, [items, filter, q]);

  const open = items.find((c) => c.id === openId) ?? null;

  const setStatus = (id: string, status: ConsultationStatus) =>
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));

  async function copyEmail(email: string) {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Bookings"
        title="Consultations"
        action={
          <GhostButton
            onClick={() =>
              downloadCsv("consultations.csv", [
                ["ID", "Name", "Email", "Phone", "Date", "Time", "Event type", "Guests", "Budget", "Source", "Status"],
                ...shown.map((c) => [c.id, c.name, c.email, c.phone, c.date, c.time, c.eventType, c.guests, c.budget, sourceLabel[c.source], c.status]),
              ])
            }
          >
            Export CSV
          </GhostButton>
        }
      />

      <SearchBox value={q} onChange={setQ} placeholder="Search name, email, event type, source…" />
      <FilterChips<Filter>
        label="Filter by status"
        value={filter}
        onChange={setFilter}
        options={[
          { value: "all", label: "All", count: items.length },
          ...STATUSES.map((s) => ({ value: s, label: s, count: items.filter((c) => c.status === s).length })),
        ]}
      />

      {shown.length === 0 ? (
        <EmptyState text="No consultations match your search." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3" aria-live="polite">
          {shown.map((c, i) => (
            <Stagger key={c.id} i={i}>
              <Card onClick={() => setOpenId(c.id)} label={`Open ${c.name}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-black/50">{c.id}</p>
                    <p className="mt-1 truncate text-lg font-light">{c.name}</p>
                  </div>
                  <Chip kind={c.status} />
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-y-2 text-xs">
                  <dt className="text-black/50">When</dt>
                  <dd>{fmtDate(c.date)} · {c.time}</dd>
                  <dt className="text-black/50">Event</dt>
                  <dd>{c.eventType} · {c.guests} guests</dd>
                  <dt className="text-black/50">Source</dt>
                  <dd>{sourceLabel[c.source]}</dd>
                </dl>
              </Card>
            </Stagger>
          ))}
        </div>
      )}

      <Sheet open={!!open} onClose={() => setOpenId(null)} title="Consultation details">
        {open && (
          <div>
            <div className="flex items-start justify-between">
              <p className="text-[11px] uppercase tracking-[0.2em]">{open.id}</p>
              <button
                type="button"
                onClick={() => setOpenId(null)}
                aria-label="Close"
                className="-mt-2 flex h-11 w-11 items-center justify-center border border-[#e6dedb] hover:bg-white focus-visible:outline-2 focus-visible:outline-black"
              >
                <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden>
                  <path d="M3 3l14 14M17 3L3 17" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </button>
            </div>
            <h3 className="mt-4 text-3xl font-light tracking-tight">{open.name}</h3>
            <div className="mt-3"><Chip kind={open.status} /></div>

            <dl className="mt-6 divide-y divide-[#e6dedb] border-y border-[#e6dedb] text-sm">
              {[
                ["Email", open.email],
                ["Phone", open.phone],
                ["Requested slot", `${fmtDate(open.date)} · ${open.time}`],
                ["Event type", open.eventType],
                ["Guests", String(open.guests)],
                ["Budget", open.budget],
                ["Heard about LYST via", sourceLabel[open.source]],
                ["Submitted", fmtDate(open.createdAt)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-3">
                  <dt className="text-black/60">{k}</dt>
                  <dd className="text-right">{v}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-6 text-[11px] uppercase tracking-[0.18em]">Event context</p>
            <p className="mt-2 text-sm font-light leading-relaxed text-black/80">{open.context}</p>

            <p className="mt-8 text-[11px] uppercase tracking-[0.18em]">Update status</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={open.status === s}
                  onClick={() => setStatus(open.id, s)}
                  className={`h-12 border text-[11px] uppercase tracking-[0.12em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
                    open.status === s ? "border-[#201f1d] bg-[#201f1d] text-white" : "border-[#e6dedb] bg-white hover:border-black"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2">
              <a
                href={`mailto:${open.email}?subject=${encodeURIComponent("Your LYST consultation")}`}
                className="flex h-12 items-center justify-center bg-[#201f1d] text-[11px] uppercase tracking-[0.12em] text-white hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                Email
              </a>
              <button
                type="button"
                onClick={() => copyEmail(open.email)}
                className="h-12 border border-[#201f1d] text-[11px] uppercase tracking-[0.12em] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                {copied ? "Copied ✓" : "Copy email"}
              </button>
            </div>
            <p className="mt-4 text-xs text-black/50">
              Status changes are kept in this browser tab only until a backend is connected.
            </p>
          </div>
        )}
      </Sheet>
    </div>
  );
}
