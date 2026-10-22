"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { getBrowserClient } from "@/lib/supabase/browser";
import type { AdminData, Consultation } from "./data";
import Consultations from "./Consultations";
import Hosts from "./Hosts";
import Overview from "./Overview";
import Settings from "./Settings";
import { ComingSoon } from "./ui";
import AdminLogin from "./AdminLogin";

type Section = "overview" | "bookings" | "hosts" | "events" | "guests" | "setup";
type Phase = "checking" | "login" | "forbidden" | "error" | "ready";

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
  const [phase, setPhase] = useState<Phase>("checking");
  const [data, setData] = useState<AdminData | null>(null);
  const [email, setEmail] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/overview", { cache: "no-store" });
      if (res.status === 401) return setPhase("login");
      if (res.status === 403) return setPhase("forbidden");
      if (!res.ok) return setPhase("error");
      setData((await res.json()) as AdminData);
      setPhase("ready");
    } catch {
      setPhase("error");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: u } = await getBrowserClient().auth.getUser();
        if (cancelled) return;
        if (!u.user) return setPhase("login");
        setEmail(u.user.email ?? "");
        await load();
      } catch {
        if (!cancelled) setPhase("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  const logout = async () => {
    await getBrowserClient().auth.signOut();
    setData(null);
    setPhase("login");
  };

  const go = (s: Section) => {
    setSection(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateConsultation = (c: Consultation) =>
    setData((d) => (d ? { ...d, consultations: d.consultations.map((x) => (x.id === c.id ? c : x)) } : d));

  if (phase !== "ready") {
    return (
      <AdminGate
        phase={phase}
        email={email}
        onSignedIn={async (e) => {
          setEmail(e);
          setPhase("checking");
          await load();
        }}
        onRetry={() => {
          setPhase("checking");
          load();
        }}
        onLogout={logout}
      />
    );
  }

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
        <div className="mt-auto space-y-3">
          <p className="truncate text-xs text-black/60">{email}</p>
          <button type="button" onClick={logout} className="text-[11px] uppercase tracking-[0.14em] underline-offset-4 hover:underline">
            Log out
          </button>
          <Link href="/" className="block text-[11px] uppercase tracking-[0.14em] underline-offset-4 hover:underline">
            ← View website
          </Link>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between px-5 pt-5 md:hidden">
          <div>
            <p className="text-xl font-light tracking-tight">LYST</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-black/60">Admin</p>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={logout} className="flex h-11 items-center text-[11px] uppercase tracking-[0.14em] underline-offset-4 hover:underline">
              Log out
            </button>
            <Link href="/" className="flex h-11 items-center text-[11px] uppercase tracking-[0.14em] underline-offset-4 hover:underline">
              Website ↗
            </Link>
          </div>
        </header>

        <main key={section} className="fade-up mx-auto max-w-[1280px] px-5 pb-28 pt-6 md:px-10 md:pb-16 md:pt-10">
          {section === "overview" && data && <Overview data={data} goTo={go} onRefresh={load} />}
          {section === "bookings" && data && <Consultations items={data.consultations} onChange={updateConsultation} />}
          {section === "hosts" && data && <Hosts hosts={data.hosts} />}
          {section === "events" && (
            <ComingSoon
              eyebrow="Invitations"
              title="Events"
              text="Hosts cannot create events on the website yet, so there is nothing to show here. When event creation is built, every event, its guest list and RSVPs will appear in this tab."
            />
          )}
          {section === "guests" && (
            <ComingSoon
              eyebrow="RSVPs"
              title="Guests"
              text="Guest RSVPs are collected through event invitations, which are not built yet. Once they are, every response, plus-one and dietary note will be listed here."
            />
          )}
          {section === "setup" && <Settings />}
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <nav
        aria-label="Admin sections"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-6 border-t border-[#e6dedb] bg-[#f6f5f1] pb-[env(safe-area-inset-bottom)] md:hidden"
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

function AdminGate({
  phase,
  email,
  onSignedIn,
  onRetry,
  onLogout,
}: {
  phase: Exclude<Phase, "ready">;
  email: string;
  onSignedIn: (email: string) => void;
  onRetry: () => void;
  onLogout: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col justify-center px-6 py-16">
      <p className="text-2xl font-light tracking-tight">LYST</p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-black/60">Admin</p>

      {phase === "checking" && <p className="mt-12 text-sm font-light text-black/60" role="status">Checking your session…</p>}

      {phase === "login" && <AdminLogin onSignedIn={onSignedIn} />}

      {phase === "forbidden" && (
        <div className="mt-12">
          <h1 className="text-3xl font-light tracking-tight">No admin access.</h1>
          <p className="mt-4 text-base font-light text-black/80">
            {email ? `${email} is signed in, but` : "This account"} is not an admin. Ask the site owner to
            grant the admin role, then log in again.
          </p>
          <button type="button" onClick={onLogout} className="mt-8 h-14 w-full border border-[#201f1d] text-[11px] uppercase tracking-[0.15em] hover:bg-white">
            Log out
          </button>
        </div>
      )}

      {phase === "error" && (
        <div className="mt-12">
          <h1 className="text-3xl font-light tracking-tight">Could not load.</h1>
          <p className="mt-4 text-base font-light text-black/80">
            The dashboard data could not be loaded. Check your connection and the Supabase settings, then retry.
          </p>
          <button type="button" onClick={onRetry} className="mt-8 h-14 w-full bg-[#201f1d] text-[11px] uppercase tracking-[0.15em] text-white hover:bg-black">
            Retry
          </button>
        </div>
      )}
    </main>
  );
}
