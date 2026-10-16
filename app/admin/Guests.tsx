"use client";

import { useState } from "react";
import { guests, type Guest } from "./data";
import { Card, Chip, downloadCsv, EmptyState, FilterChips, GhostButton, SearchBox, SectionTitle, Stagger } from "./ui";

type Filter = "all" | Guest["response"];

export default function Guests() {
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();
  const shown = guests.filter(
    (g) =>
      (filter === "all" || g.response === filter) &&
      (!needle || `${g.name} ${g.event} ${g.diet}`.toLowerCase().includes(needle)),
  );
  const heads = shown.filter((g) => g.response === "yes").reduce((n, g) => n + 1 + g.plusOnes, 0);

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="RSVPs"
        title="Guests"
        action={
          <GhostButton
            onClick={() =>
              downloadCsv("guests.csv", [
                ["ID", "Name", "Event", "Response", "Plus ones", "Dietary", "Responded"],
                ...shown.map((g) => [g.id, g.name, g.event, g.response, g.plusOnes, g.diet, g.respondedAt]),
              ])
            }
          >
            Export CSV
          </GhostButton>
        }
      />
      <SearchBox value={q} onChange={setQ} placeholder="Search guest, event, dietary need…" />
      <FilterChips<Filter>
        label="Filter by response"
        value={filter}
        onChange={setFilter}
        options={[
          { value: "all", label: "All", count: guests.length },
          { value: "yes", label: "Attending", count: guests.filter((g) => g.response === "yes").length },
          { value: "no", label: "Declined", count: guests.filter((g) => g.response === "no").length },
          { value: "pending", label: "Awaiting", count: guests.filter((g) => g.response === "pending").length },
        ]}
      />
      <p className="text-sm text-black/70" aria-live="polite">
        {shown.length} shown · {heads} confirmed attendees including plus-ones
      </p>

      {shown.length === 0 ? (
        <EmptyState text="No guests match." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3">
          {shown.map((g, i) => (
            <Stagger key={g.id} i={i}>
              <Card>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-base">{g.name}</p>
                  <Chip kind={g.response}>{g.response === "yes" ? "attending" : g.response === "no" ? "declined" : "awaiting"}</Chip>
                </div>
                <p className="mt-2 text-xs text-black/60">{g.event}</p>
                <dl className="mt-4 grid grid-cols-2 gap-y-1.5 text-xs">
                  <dt className="text-black/50">Plus-ones</dt><dd>{g.plusOnes}</dd>
                  <dt className="text-black/50">Dietary</dt><dd>{g.diet}</dd>
                  <dt className="text-black/50">Responded</dt><dd>{g.respondedAt}</dd>
                </dl>
              </Card>
            </Stagger>
          ))}
        </div>
      )}
    </div>
  );
}
