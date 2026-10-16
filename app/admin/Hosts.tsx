"use client";

import { useState } from "react";
import { hosts, type Host } from "./data";
import { Card, Chip, downloadCsv, EmptyState, FilterChips, fmtDate, GhostButton, SearchBox, SectionTitle, Stagger } from "./ui";

type Filter = "all" | Host["status"];

export default function Hosts() {
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();
  const shown = hosts.filter(
    (h) =>
      (filter === "all" || h.status === filter) &&
      (!needle || `${h.name} ${h.email} ${h.plan}`.toLowerCase().includes(needle)),
  );

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="People"
        title="Hosts"
        action={
          <GhostButton
            onClick={() =>
              downloadCsv("hosts.csv", [
                ["ID", "Name", "Email", "Plan", "Events", "Guests", "Status", "Joined"],
                ...shown.map((h) => [h.id, h.name, h.email, h.plan, h.events, h.guests, h.status, h.joined]),
              ])
            }
          >
            Export CSV
          </GhostButton>
        }
      />
      <SearchBox value={q} onChange={setQ} placeholder="Search hosts…" />
      <FilterChips<Filter>
        label="Filter hosts"
        value={filter}
        onChange={setFilter}
        options={[
          { value: "all", label: "All", count: hosts.length },
          { value: "active", label: "Active", count: hosts.filter((h) => h.status === "active").length },
          { value: "invited", label: "Invited", count: hosts.filter((h) => h.status === "invited").length },
          { value: "paused", label: "Paused", count: hosts.filter((h) => h.status === "paused").length },
        ]}
      />
      {shown.length === 0 ? (
        <EmptyState text="No hosts match." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3">
          {shown.map((h, i) => (
            <Stagger key={h.id} i={i}>
              <Card>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      aria-hidden
                      className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#201f1d] text-sm text-white"
                    >
                      {h.name.split(" ").map((p) => p[0]).slice(-2).join("")}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-lg font-light">{h.name}</p>
                      <a href={`mailto:${h.email}`} className="block truncate text-xs text-black/60 underline-offset-4 hover:underline">
                        {h.email}
                      </a>
                    </div>
                  </div>
                  <Chip kind={h.status} />
                </div>
                <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-[#efe8e2] pt-4 text-center">
                  <div><dd className="text-xl font-light tabular-nums">{h.events}</dd><dt className="text-[10px] uppercase tracking-wider text-black/50">Events</dt></div>
                  <div><dd className="text-xl font-light tabular-nums">{h.guests}</dd><dt className="text-[10px] uppercase tracking-wider text-black/50">Guests</dt></div>
                  <div><dd className="text-xl font-light">{h.plan}</dd><dt className="text-[10px] uppercase tracking-wider text-black/50">Plan</dt></div>
                </dl>
                <p className="mt-4 text-xs text-black/50">Joined {fmtDate(h.joined)}</p>
              </Card>
            </Stagger>
          ))}
        </div>
      )}
    </div>
  );
}
