"use client";

import { useState } from "react";
import type { Profile } from "./data";
import { Card, Chip, downloadCsv, EmptyState, fmtDate, GhostButton, SearchBox, SectionTitle, Stagger } from "./ui";

export default function Hosts({ hosts }: { hosts: Profile[] }) {
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();
  const shown = hosts.filter((h) => !needle || `${h.full_name ?? ""} ${h.email ?? ""}`.toLowerCase().includes(needle));

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="People"
        title="Hosts"
        action={
          <GhostButton
            onClick={() =>
              downloadCsv("hosts.csv", [
                ["Name", "Email", "Role", "Joined"],
                ...shown.map((h) => [h.full_name ?? "", h.email ?? "", h.role, h.created_at]),
              ])
            }
          >
            Export CSV
          </GhostButton>
        }
      />
      <SearchBox value={q} onChange={setQ} placeholder="Search hosts…" />
      <p className="text-sm text-black/70">{shown.length} account{shown.length === 1 ? "" : "s"}</p>

      {hosts.length === 0 ? (
        <EmptyState text="No host accounts yet." />
      ) : shown.length === 0 ? (
        <EmptyState text="No hosts match." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3">
          {shown.map((h, i) => {
            const label = h.full_name || h.email || "Unnamed";
            return (
              <Stagger key={h.id} i={i}>
                <Card>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span aria-hidden className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#201f1d] text-sm uppercase text-white">
                        {label.split(/\s+/).map((p) => p[0]).slice(0, 2).join("")}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-lg font-light">{label}</p>
                        {h.email && (
                          <a href={`mailto:${h.email}`} className="block truncate text-xs text-black/60 underline-offset-4 hover:underline">
                            {h.email}
                          </a>
                        )}
                      </div>
                    </div>
                    <Chip kind={h.role === "admin" ? "new" : "active"}>{h.role}</Chip>
                  </div>
                  <p className="mt-5 border-t border-[#efe8e2] pt-4 text-xs text-black/50">Joined {fmtDate(h.created_at.slice(0, 10))}</p>
                </Card>
              </Stagger>
            );
          })}
        </div>
      )}
    </div>
  );
}
