"use client";

import Link from "next/link";
import { useState } from "react";
import Consultations from "./Consultations";
import Events from "./Events";
import Guests from "./Guests";
import Hosts from "./Hosts";
import Overview from "./Overview";
import Settings from "./Settings";

type Section = "overview" | "bookings" | "hosts" | "events" | "guests" | "setup";

const icon = (d: string) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
    <path d={d} />
  </svg>
);

const NAV: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: icon("M3 12l9-8 9 8M5 10v10h5v-6h4v6h5V10") },
  { id: "bookings", label: "Bookings", icon: icon("M4 5h16v15H4zM4 10h16M9 3v4M15 3v4") },
  { id: "hosts", label: "Hosts", icon: icon("M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4 3.6-7 8-7s8 3 8 7") },
  { id: "events", label: "Events", icon: icon("M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.5 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z") },
  { id: "guests", label: "Guests", icon: icon("M8 11a3 3 0 100-6 3 3 0 000 6zM16 12a2.5 2.5 0 100-5M2 20c0-3 2.7-5 6-5s6 2 6 5M16 15c3 0 6 1.6 6 5") },
  { id: "setup", label: "Setup", icon: icon("M5 12l4 4 10-10") },
];

export default function AdminApp() {
  const [section, setSection] = useState<Section>("overview");

  const go = (s: Section) => {
    setSection(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-dvh md:flex">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-[#e6dedb] bg-[#f1efe9] p-6 md:flex">
        <p className="text-2xl font-light tracking-tight">LYST</p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-black/60">Admin</p>
        <nav aria-label="Admin sections" className="mt-10 space-y-1">
          {NAV.map((n) => {
            const on = n.id === section;
            return (
              <button
                key={n.id}
                type="button"
                aria-current={on ? "page" : undefined}
                onClick={() => go(n.id)}
                className={`flex h-12 w-full items-center gap-3 px-3 text-[12px] uppercase tracking-[0.14em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
                  on ? "bg-[#201f1d] text-white" : "hover:bg-white"
                }`}
              >
                {n.icon}
                {n.label}
              </button>
            );
          })}
        </nav>
        <Link href="/" className="mt-auto text-[11px] uppercase tracking-[0.14em] underline-offset-4 hover:underline">
          ← View website
        </Link>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="border-b border-[#e6dedb] bg-[#201f1d] px-5 py-2.5 text-center text-[10px] uppercase tracking-[0.18em] text-white md:px-10">
          Sample data · not connected · no login yet
        </div>

        <header className="flex items-center justify-between px-5 pt-5 md:hidden">
          <div>
            <p className="text-xl font-light tracking-tight">LYST</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-black/60">Admin</p>
          </div>
          <Link href="/" className="flex h-11 items-center text-[11px] uppercase tracking-[0.14em] underline-offset-4 hover:underline">
            Website ↗
          </Link>
        </header>

        <main key={section} className="fade-up mx-auto max-w-[1280px] px-5 pb-28 pt-6 md:px-10 md:pb-16 md:pt-10">
          {section === "overview" && <Overview goTo={go} />}
          {section === "bookings" && <Consultations />}
          {section === "hosts" && <Hosts />}
          {section === "events" && <Events />}
          {section === "guests" && <Guests />}
          {section === "setup" && <Settings />}
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <nav
        aria-label="Admin sections"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-6 border-t border-[#e6dedb] bg-[#f6f5f1]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      >
        {NAV.map((n) => {
          const on = n.id === section;
          return (
            <button
              key={n.id}
              type="button"
              aria-current={on ? "page" : undefined}
              onClick={() => go(n.id)}
              className="relative flex h-16 flex-col items-center justify-center gap-1 text-[9px] uppercase tracking-[0.1em] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-black"
            >
              <span
                aria-hidden
                className={`absolute inset-x-3 top-0 h-0.5 bg-[#201f1d] transition-transform duration-300 ${on ? "scale-x-100" : "scale-x-0"}`}
              />
              <span className={`transition-all duration-300 ${on ? "-translate-y-0.5 opacity-100" : "opacity-50"}`}>{n.icon}</span>
              <span className={on ? "font-medium" : "text-black/60"}>{n.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
