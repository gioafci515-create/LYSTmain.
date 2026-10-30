"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  DemoNote,
  Eyebrow,
  Field,
  PrimaryButton,
  SummaryRow,
  TextButton,
} from "./ui";

type Step = "date" | "time" | "details" | "review" | "done" | "failed";

const STEPS: { key: Exclude<Step, "done" | "failed">; label: string }[] = [
  { key: "date", label: "Date" },
  { key: "time", label: "Time" },
  { key: "details", label: "Details" },
  { key: "review", label: "Review" },
];
// Consultation slots are Tbilisi times. Georgia is UTC+4 all year (no daylight saving).
const TIMES = ["09:30", "11:00", "14:00", "16:30"];
const TBILISI = "Asia/Tbilisi";
const SEND_TIMEOUT_MS = 20_000;
const localTime = (date: string, time: string, timeZone: string) =>
  new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone }).format(
    new Date(`${date}T${time}:00+04:00`),
  );
const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];
const WEEKS_SHOWN = 5;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const longDate = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const fmtIso = (s: string) => longDate.format(new Date(`${s}T00:00:00Z`));

type Cell = { iso: string; day: number; disabled: boolean };

function buildCalendar(): { cells: Cell[]; label: string } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7)); // back to Monday
  const cells: Cell[] = Array.from({ length: WEEKS_SHOWN * 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return { iso: iso(d), day: d.getDate(), disabled: d <= today };
  });
  const first = new Date(`${cells.find((c) => !c.disabled)!.iso}T00:00:00Z`);
  const last = new Date(`${cells[cells.length - 1].iso}T00:00:00Z`);
  const m = new Intl.DateTimeFormat("en-GB", { month: "long", timeZone: "UTC" });
  const y = new Intl.DateTimeFormat("en-GB", { year: "numeric", timeZone: "UTC" });
  const label =
    m.format(first) === m.format(last)
      ? `${m.format(first)} ${y.format(first)}`
      : `${m.format(first)} – ${m.format(last)} ${y.format(last)}`;
  return { cells, label };
}

export default function BookingFlow({
  titleId,
  onClose,
  onSent,
}: {
  titleId: string;
  onClose: () => void;
  /** Called once the request is saved, so the next booking starts from a clean form. */
  onSent: () => void;
}) {
  const [step, setStep] = useState<Step>("date");
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [context, setContext] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [sending, setSending] = useState(false);
  const [failMessage, setFailMessage] = useState("");
  const summaryRef = useRef<HTMLDivElement>(null);

  const calendar = useMemo(() => buildCalendar(), []);
  const timeZone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);

  useEffect(() => {
    if (errors.name || errors.email) summaryRef.current?.focus();
  }, [errors]);

  const stepIndex = step === "failed" ? 3 : STEPS.findIndex((s) => s.key === step);
  const finished = step === "done";
  const dateLabel = date ? fmtIso(date) : "";
  // Visitors outside Georgia also see each slot in their own time.
  const showLocal = !!date && timeZone !== TBILISI && localTime(date, "12:00", timeZone) !== "12:00";
  const timeLabel = time
    ? `${time} Tbilisi time${showLocal && date ? ` (${localTime(date, time, timeZone)} your time)` : ""}`
    : "";
  const contactLabel = `${name.trim()} · ${email.trim()}${phone.trim() ? ` · ${phone.trim()}` : ""}`;
  const errorFields = [errors.name && "Name", errors.email && "Email"].filter(Boolean);

  function submitDetails() {
    const next: typeof errors = {};
    if (!name.trim()) next.name = "Enter your name.";
    if (!EMAIL_RE.test(email.trim())) next.email = "Enter a complete email address.";
    setErrors(next);
    if (!next.name && !next.email) setStep("review");
  }

  async function confirm() {
    if (sending || !date || !time) return;
    setSending(true);
    const q = new URLSearchParams(window.location.search);
    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          context,
          date,
          time: `${time} ${TBILISI}`,
          website,
          referrer: document.referrer,
          utm_source: q.get("utm_source") ?? "",
        }),
        // A server that never answers must not leave the button on "Sending…" forever.
        signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
      });
      if (res.ok) {
        setStep("done");
        onSent();
      } else {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
          fields?: Record<string, string>;
        } | null;
        if (res.status === 400 && data?.fields && (data.fields.name || data.fields.email)) {
          setErrors({ name: data.fields.name, email: data.fields.email });
          setStep("details");
        } else {
          setFailMessage(data?.error ?? "");
          setStep("failed");
        }
      }
    } catch (err) {
      setFailMessage(
        err instanceof DOMException && err.name === "TimeoutError"
          ? "The server took too long to answer. Please try again. Nothing has been saved."
          : "",
      );
      setStep("failed");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <header className="flex items-start justify-between">
        <Eyebrow>Consultation</Eyebrow>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="-mt-3 flex h-12 w-12 items-center justify-center border border-[#efe3dc] hover:bg-white focus-visible:outline-2 focus-visible:outline-black"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
            <path d="M3 3l14 14M17 3L3 17" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
      </header>

      <h2
        id={titleId}
        className="mt-10 text-[40px] font-light leading-[1.05] tracking-tight md:text-5xl"
      >
        {step === "done" ? "Request received" : "Book a consultation"}
      </h2>

      <ol className="mt-5 grid grid-cols-4 gap-x-3" aria-label="Progress">
        {STEPS.map((s, i) => {
          const complete = finished || i < stepIndex;
          const current = !finished && i === stepIndex;
          return (
            <li
              key={s.key}
              aria-current={current ? "step" : undefined}
              className={`border-b pb-2 text-[13px] ${
                complete || current
                  ? `border-black ${current ? "border-b-2" : ""}`
                  : "border-[#e4dcd5] text-black/80"
              } ${current ? "font-medium" : "font-normal"}`}
            >
              {s.label}
              {complete && <span aria-label=" completed"> ✓</span>}
            </li>
          );
        })}
      </ol>

      <div className="mt-8" aria-live="polite">
        {step === "date" && (
          <div>
            <p className="text-base font-light leading-relaxed text-black/80 md:text-lg">
              Choose the day you would like to talk. No account is required.
            </p>
            <p className="mt-8 text-xs uppercase tracking-[0.15em]">{calendar.label}</p>

            <div role="group" aria-label={calendar.label} className="mt-6 grid grid-cols-7 gap-y-1 text-center">
              {WEEKDAYS.map((w, i) => (
                <span key={i} className="pb-3 text-xs" aria-hidden>
                  {w}
                </span>
              ))}
              {calendar.cells.map((c) => (
                <button
                  key={c.iso}
                  type="button"
                  disabled={c.disabled}
                  onClick={() => setDate(c.iso)}
                  aria-pressed={date === c.iso}
                  aria-label={fmtIso(c.iso)}
                  className={`mx-auto h-12 w-12 text-base font-light transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black md:w-[77px] ${
                    date === c.iso
                      ? "bg-[#201f1d] text-white"
                      : c.disabled
                        ? "cursor-not-allowed text-black/25"
                        : "hover:bg-white"
                  }`}
                >
                  {c.day}
                </button>
              ))}
            </div>

            <p className="mt-8 text-[13px] font-medium">
              {date ? `${dateLabel} selected.` : "No date selected."}
            </p>
            <div className="mt-6">
              <PrimaryButton disabled={!date} onClick={() => setStep("time")}>
                {date ? "Continue to time →" : "Choose a date to continue"}
              </PrimaryButton>
            </div>
          </div>
        )}

        {step === "time" && (
          <div>
            <SummaryRow label="Date" value={dateLabel} onChange={() => setStep("date")} />
            <p className="mt-8 text-base font-light text-black/80 md:text-lg">
              Choose a preferred time in Tbilisi (GMT+4). We will confirm availability by email.
            </p>
            <div role="radiogroup" aria-label="Preferred time" className="mt-6 grid gap-2 md:grid-cols-2">
              {TIMES.map((t) => {
                const on = time === t;
                return (
                  <button
                    key={t}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setTime(t)}
                    className={`flex h-14 items-center justify-between border px-4 text-left text-[13px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
                      on
                        ? "border-[#201f1d] bg-[#201f1d] text-white"
                        : "border-[#efe3dc] bg-white hover:border-black"
                    }`}
                  >
                    <span>
                      {t}
                      {showLocal && date && (
                        <span className="block text-xs font-normal opacity-80">{localTime(date, t, timeZone)} your time</span>
                      )}
                    </span>
                    {on ? (
                      <span>✓ Selected</span>
                    ) : (
                      <span aria-hidden className="h-3 w-3 rounded-full border border-black" />
                    )}
                  </button>
                );
              })}
            </div>
            {showLocal && (
              <p className="mt-6 text-[13px] font-medium">Your own time ({timeZone}) is shown under each slot.</p>
            )}
            <div className="mt-6 space-y-2">
              <PrimaryButton disabled={!time} onClick={() => setStep("details")}>
                Continue to details →
              </PrimaryButton>
              <TextButton onClick={() => setStep("date")}>Back to date</TextButton>
            </div>
          </div>
        )}

        {step === "details" && (
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              submitDetails();
            }}
          >
            {errorFields.length > 0 ? (
              <div
                ref={summaryRef}
                tabIndex={-1}
                role="alert"
                className="mb-6 border-l-2 border-black pl-4 outline-none"
              >
                <p className="text-[13px] font-medium">Please check your contact details</p>
                <p className="mt-2 text-base font-light text-black/80">
                  {errorFields.join(" and ")} need{errorFields.length === 1 ? "s" : ""} attention.
                </p>
              </div>
            ) : (
              <p className="mb-6 text-base font-light leading-relaxed text-black/80 md:text-lg">
                Your consultation details. No account is required.
              </p>
            )}
            <div className="space-y-6">
              {/* Limits match app/api/consultations/route.ts. */}
              <Field label="Name" required value={name} onChange={setName} placeholder="Your name" error={errors.name} autoComplete="name" maxLength={200} />
              <Field label="Email" required type="email" value={email} onChange={setEmail} placeholder="Your email" error={errors.email} autoComplete="email" maxLength={320} />
              <Field label="Phone" type="tel" value={phone} onChange={setPhone} placeholder="Your phone number" autoComplete="tel" maxLength={50} />
              <Field label="Event context" multiline value={context} onChange={setContext} placeholder="A little about your occasion" maxLength={4000} />
              {/* Honeypot: hidden from people, tempting to bots. */}
              <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label>
                  Website
                  <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                </label>
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <PrimaryButton type="submit">Continue to review →</PrimaryButton>
              <TextButton onClick={() => setStep("time")}>Back to time</TextButton>
            </div>
          </form>
        )}

        {step === "review" && (
          <div>
            <p className="mb-8 text-base font-light text-black/80 md:text-lg">
              Check your details, then send your request. We will reply by email to confirm.
            </p>
            <SummaryRow label="Date" value={dateLabel} onChange={() => setStep("date")} />
            <SummaryRow label="Time" value={timeLabel} onChange={() => setStep("time")} />
            <SummaryRow label="Contact details" value={contactLabel} onChange={() => setStep("details")} />
            <SummaryRow label="Event context" value={context.trim() || "—"} onChange={() => setStep("details")} />
            <div className="mt-6 space-y-2">
              <PrimaryButton onClick={confirm} disabled={sending}>
                {sending ? "Sending…" : "Send request"}
              </PrimaryButton>
              <TextButton onClick={() => setStep("details")}>Back to details</TextButton>
            </div>
          </div>
        )}

        {step === "failed" && (
          <div className="pt-4">
            <Eyebrow>Something went wrong</Eyebrow>
            <p className="mt-6 text-3xl font-light leading-tight">
              Your request could not be sent.
            </p>
            <p className="mt-6 text-base font-light text-black/80">
              {failMessage || "Please check your connection and try again. Nothing has been saved."}
            </p>
            <div className="mt-10 space-y-2">
              <PrimaryButton onClick={() => setStep("review")}>Try again</PrimaryButton>
              <TextButton onClick={() => setStep("details")}>Edit details</TextButton>
            </div>
          </div>
        )}

        {step === "done" && (
          <div>
            <Eyebrow>Thank you</Eyebrow>
            <p className="mt-6 text-3xl font-light leading-tight">We have your request.</p>
            <p className="mt-5 text-base font-light text-black/80">
              We will email {email.trim()} to confirm a time. Until then, your
              slot is a request, not a confirmed booking.
            </p>
            <div className="mt-8">
              <SummaryRow label="Requested date" value={dateLabel} />
              <SummaryRow label="Requested time" value={timeLabel} />
              <SummaryRow label="Contact" value={contactLabel} />
            </div>
            <div className="mt-6">
              <PrimaryButton onClick={onClose}>Close</PrimaryButton>
            </div>
          </div>
        )}
      </div>

      <DemoNote title="Your details">
        We use these details only to respond to your request.
      </DemoNote>
    </>
  );
}
