"use client";

import { useEffect, useRef, useState } from "react";

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function fmtDate(iso: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  return dateFmt.format(new Date(`${iso}T00:00:00Z`));
}

/** Counts up to `value` on mount. Honors prefers-reduced-motion. */
export function CountUp({
  value,
  suffix = "",
  prefix = "",
  duration = 1100,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const [n, setN] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let start: number | null = null;
    const tick = (t: number) => {
      start ??= t;
      const p = reduce ? 1 : Math.min((t - start) / duration, 1);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return (
    <span className="tabular-nums">
      {prefix}
      {n.toLocaleString("en-GB")}
      {suffix}
    </span>
  );
}

/** Wrapper that fades its children in, staggered by index. */
export function Stagger({
  i = 0,
  children,
  className = "",
}: {
  i?: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`fade-up ${className}`}
      style={{ "--d": `${Math.min(i, 12) * 55}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

const chipStyles: Record<string, string> = {
  new: "bg-[#201f1d] text-white",
  confirmed: "bg-[#e3ecdd] text-[#27401d]",
  completed: "bg-[#e7dfd4] text-[#3b3226]",
  cancelled: "bg-[#f1dcd9] text-[#6b2a22]",
  live: "bg-[#e3ecdd] text-[#27401d]",
  draft: "bg-[#e7dfd4] text-[#3b3226]",
  past: "bg-[#ececec] text-[#444]",
  active: "bg-[#e3ecdd] text-[#27401d]",
  invited: "bg-[#f3ead2] text-[#5b4713]",
  paused: "bg-[#ececec] text-[#444]",
  yes: "bg-[#e3ecdd] text-[#27401d]",
  no: "bg-[#f1dcd9] text-[#6b2a22]",
  pending: "bg-[#f3ead2] text-[#5b4713]",
};

export function Chip({ kind, children }: { kind: string; children?: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] ${chipStyles[kind] ?? "bg-[#ececec]"}`}
    >
      {(kind === "live" || kind === "new") && (
        <span className="h-1.5 w-1.5 animate-[pulse-dot_1.6s_ease-in-out_infinite] rounded-full bg-current" />
      )}
      {children ?? kind}
    </span>
  );
}

export function Card({
  children,
  className = "",
  onClick,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  label?: string;
}) {
  const base =
    "relative overflow-hidden border border-[#e6dedb] bg-white p-5 text-left transition-all duration-300";
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className={`${base} block w-full hover:-translate-y-0.5 hover:border-black hover:shadow-[0_10px_30px_-18px_rgba(0,0,0,0.4)] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${className}`}
      >
        {children}
      </button>
    );
  }
  return <div className={`${base} ${className}`}>{children}</div>;
}

export function SectionTitle({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-black/60">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-light tracking-tight md:text-4xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function SearchBox({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <label className="relative block">
      <span className="sr-only">{placeholder}</span>
      <svg
        aria-hidden
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/50"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      >
        <circle cx="7" cy="7" r="5" />
        <path d="M11 11l3.5 3.5" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 w-full border border-[#e6dedb] bg-white pl-11 pr-4 text-base font-light placeholder:text-black/50 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
      />
    </label>
  );
}

export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string; count?: number }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden"
    >
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={`h-10 shrink-0 border px-4 text-[11px] uppercase tracking-[0.12em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
              on ? "border-[#201f1d] bg-[#201f1d] text-white" : "border-[#e6dedb] bg-white hover:border-black"
            }`}
          >
            {o.label}
            {o.count !== undefined && <span className="ml-2 opacity-60">{o.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

/** Bottom sheet on mobile, right-aligned panel on desktop. Native <dialog> for focus trap + Esc. */
export function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className="fixed inset-x-0 bottom-0 top-auto m-0 max-h-[88dvh] w-full max-w-none overflow-y-auto bg-[#f6f5f1] p-6 text-black backdrop:bg-black/50 md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-[480px] md:p-8"
    >
      {open && children}
    </dialog>
  );
}

export function downloadCsv(filename: string, rows: (string | number)[][]) {
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = rows.map((r) => r.map(esc).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function GhostButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className="inline-flex h-11 items-center justify-center gap-2 border border-[#201f1d] px-4 text-[11px] uppercase tracking-[0.12em] transition-colors hover:bg-[#201f1d] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
    >
      {children}
    </button>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="border border-dashed border-[#d9cfc8] p-10 text-center text-sm font-light text-black/60">
      {text}
    </div>
  );
}
