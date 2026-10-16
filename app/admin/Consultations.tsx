"use client";

import { useMemo, useState } from "react";
import { sourceLabel } from "@/lib/source";
import type { Consultation, ConsultationStatus } from "./data";
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
const stamp = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" });

function NotesBox({
  saved,
  saving,
  onSave,
}: {
  saved: string;
  saving: boolean;
  onSave: (text: string) => void;
}) {
  const [notes, setNotes] = useState(saved);
  return (
    <>
      <label htmlFor="notes" className="mt-8 block text-[11px] uppercase tracking-[0.18em]">Private notes</label>
      <textarea
        id="notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
        className="mt-3 block w-full border border-[#e6dedb] bg-white p-3 text-sm font-light focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
      />
      <div className="mt-2">
        <GhostButton disabled={saving || notes === saved} onClick={() => onSave(notes)}>
          {saving ? "Saving…" : "Save notes"}
        </GhostButton>
      </div>
    </>
  );
}

export default function Consultations({
  items,
  onChange,
}: {
  items: Consultation[];
  onChange: (c: Consultation) => void;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const open = items.find((c) => c.id === openId) ?? null;

  const openCard = (id: string) => {
    setError("");
    setOpenId(id);
  };

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter(
      (c) =>
        (filter === "all" || c.status === filter) &&
        (!needle ||
          [c.name, c.email, c.phone ?? "", c.event_context ?? "", sourceLabel[c.source]]
            .join(" ")
            .toLowerCase()
            .includes(needle)),
    );
  }, [items, filter, q]);

  async function patch(id: string, body: { status?: ConsultationStatus; admin_notes?: string }) {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/consultations/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      const { consultation } = (await res.json()) as { consultation: Consultation };
      onChange(consultation);
    } catch {
      setError("Could not save. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

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
                ["Submitted", "Name", "Email", "Phone", "Requested date", "Requested time", "Source", "Status", "Event context", "Notes"],
                ...shown.map((c) => [c.created_at, c.name, c.email, c.phone ?? "", c.preferred_date ?? "", c.preferred_time ?? "", sourceLabel[c.source], c.status, c.event_context ?? "", c.admin_notes ?? ""]),
              ])
            }
          >
            Export CSV
          </GhostButton>
        }
      />

      <SearchBox value={q} onChange={setQ} placeholder="Search name, email, phone, notes, source…" />
      <FilterChips<Filter>
        label="Filter by status"
        value={filter}
        onChange={setFilter}
        options={[
          { value: "all", label: "All", count: items.length },
          ...STATUSES.map((s) => ({ value: s, label: s, count: items.filter((c) => c.status === s).length })),
        ]}
      />

      {items.length === 0 ? (
        <EmptyState text="No consultation requests yet. They appear here as soon as someone submits the form." />
      ) : shown.length === 0 ? (
        <EmptyState text="No consultations match your search." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3" aria-live="polite">
          {shown.map((c, i) => (
            <Stagger key={c.id} i={i}>
              <Card onClick={() => openCard(c.id)} label={`Open ${c.name}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-black/50">{stamp.format(new Date(c.created_at))}</p>
                    <p className="mt-1 truncate text-lg font-light">{c.name}</p>
                  </div>
                  <Chip kind={c.status} />
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-y-2 text-xs">
                  <dt className="text-black/50">Requested</dt>
                  <dd>{c.preferred_date ? fmtDate(c.preferred_date) : "—"} · {c.preferred_time?.split(" ")[0] ?? "—"}</dd>
                  <dt className="text-black/50">Source</dt>
                  <dd>{sourceLabel[c.source]}</dd>
                  <dt className="text-black/50">Email</dt>
                  <dd className="truncate">{c.email}</dd>
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
              <p className="text-[11px] uppercase tracking-[0.2em]">{stamp.format(new Date(open.created_at))}</p>
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
                ["Phone", open.phone ?? "—"],
                ["Requested date", open.preferred_date ? fmtDate(open.preferred_date) : "—"],
                ["Requested time", open.preferred_time ?? "—"],
                ["Heard about LYST via", sourceLabel[open.source]],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-3">
                  <dt className="shrink-0 text-black/60">{k}</dt>
                  <dd className="break-words text-right">{v}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-6 text-[11px] uppercase tracking-[0.18em]">Event context</p>
            <p className="mt-2 whitespace-pre-wrap text-sm font-light leading-relaxed text-black/80">{open.event_context || "—"}</p>

            <p className="mt-8 text-[11px] uppercase tracking-[0.18em]">Update status</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={open.status === s}
                  disabled={saving}
                  onClick={() => patch(open.id, { status: s })}
                  className={`h-12 border text-[11px] uppercase tracking-[0.12em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-60 ${
                    open.status === s ? "border-[#201f1d] bg-[#201f1d] text-white" : "border-[#e6dedb] bg-white hover:border-black"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <NotesBox
              key={open.id}
              saved={open.admin_notes ?? ""}
              saving={saving}
              onSave={(text) => patch(open.id, { admin_notes: text })}
            />

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
            {error && <p role="alert" className="mt-4 border-l-2 border-black pl-3 text-xs font-medium">{error}</p>}
          </div>
        )}
      </Sheet>
    </div>
  );
}
