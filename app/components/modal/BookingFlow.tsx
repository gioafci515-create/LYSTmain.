"use client";

import { useEffect, useRef, useState } from "react";
import {
  DemoNote,
  Eyebrow,
  Field,
  PrimaryButton,
  SummaryRow,
  TextButton,
} from "./ui";

type Step = "date" | "time" | "details" | "review" | "done" | "failed";
type Availability = "loading" | "ready" | "empty";
export type DemoState = "failure" | "empty" | null;

const STEPS: { key: Exclude<Step, "done" | "failed">; label: string }[] = [
  { key: "date", label: "Date" },
  { key: "time", label: "Time" },
  { key: "details", label: "Details" },
  { key: "review", label: "Review" },
];
const TIMES = ["Example time A", "Example time B", "Example time C", "Example time D"];
const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];
const EMAIL_RE = /^\S+@\S+\.\S+$/;

const FLOW_NOTE =
  "One proposed flow for Hero and final Consultation CTAs. Close returns to the originating entry point — intent only.";

export default function BookingFlow({
  titleId,
  demo,
  onClose,
}: {
  titleId: string;
  demo: DemoState;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("date");
  const [availability, setAvailability] = useState<Availability>("loading");
  const [day, setDay] = useState<number | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [context, setContext] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const summaryRef = useRef<HTMLDivElement>(null);

  // Static stand-in for an availability request; no network call is made.
  useEffect(() => {
    if (availability !== "loading") return;
    const t = setTimeout(
      () => setAvailability(demo === "empty" ? "empty" : "ready"),
      600,
    );
    return () => clearTimeout(t);
  }, [availability, demo]);

  useEffect(() => {
    if (errors.name || errors.email) summaryRef.current?.focus();
  }, [errors]);

  const stepIndex = STEPS.findIndex((s) => s.key === step);
  const finished = step === "done" || step === "failed";
  const dateLabel = day ? `Sample month / Day ${day} — design only` : "";
  const timeLabel = time ? `${time} / Time zone — to be confirmed` : "";
  const contactLabel = `${name.trim() || "[Name placeholder]"} · ${email.trim() || "[Email placeholder]"}`;

  function submitDetails() {
    const next: typeof errors = {};
    if (!name.trim()) next.name = "Enter your name.";
    if (!EMAIL_RE.test(email.trim())) next.email = "Enter a complete email address.";
    setErrors(next);
    if (!next.name && !next.email) setStep("review");
  }

  const errorFields = [errors.name && "Name", errors.email && "Email"].filter(Boolean);

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
        {step === "done" ? "Consultation example" : "Book a consultation"}
      </h2>

      <ol className="mt-5 grid grid-cols-4 gap-x-3" aria-label="Progress">
        {STEPS.map((s, i) => {
          const complete = finished ? true : i < stepIndex;
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
        {step === "date" && availability === "loading" && (
          <div className="pt-8">
            <div className="flex gap-1" aria-hidden>
              <span className="h-2 w-2 bg-black" />
              <span className="h-2 w-2 bg-[#e7dfd4]" />
              <span className="h-2 w-2 bg-[#e7dfd4]" />
            </div>
            <p className="mt-6 text-2xl font-light">Checking availability…</p>
            <p className="mt-5 text-base font-light text-black/80">
              Static loading example. No availability request is being made.
            </p>
            <div className="mt-10">
              <PrimaryButton disabled>Please wait — demo</PrimaryButton>
            </div>
          </div>
        )}

        {step === "date" && availability === "empty" && (
          <div className="pt-6">
            <Eyebrow>Sample empty state</Eyebrow>
            <p className="mt-6 text-3xl font-light">No appointments to display</p>
            <p className="mt-6 text-base font-light text-black/80">
              This is an example empty state, not a statement about LYST’s real
              service or availability. No dates are being retrieved.
            </p>
            <div className="mt-10 space-y-2">
              <PrimaryButton onClick={() => setAvailability("loading")}>
                Try again
              </PrimaryButton>
              <TextButton onClick={() => setAvailability("loading")}>
                Back to date
              </TextButton>
            </div>
          </div>
        )}

        {step === "date" && availability === "ready" && (
          <div>
            <p className="text-base font-light leading-relaxed text-black/80 md:text-lg">
              Choose a date to begin. No account signup is required for a
              consultation.
            </p>
            <p className="mt-8 text-[11px] uppercase leading-relaxed tracking-[0.15em]">
              Sample month — design only
              <br />
              <span className="mt-2 inline-block">Not live availability</span>
            </p>

            <div
              role="group"
              aria-label="Sample month, design only"
              className="mt-6 grid grid-cols-7 gap-y-1 text-center"
            >
              {WEEKDAYS.map((w, i) => (
                <span key={i} className="pb-3 text-[11px]" aria-hidden>
                  {w}
                </span>
              ))}
              {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDay(d)}
                  aria-pressed={day === d}
                  aria-label={`Sample day ${d}`}
                  className={`mx-auto h-12 w-12 text-base font-light transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black md:w-[77px] ${
                    day === d ? "bg-[#201f1d] text-white" : "hover:bg-white"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <p className="mt-8 text-[13px] font-medium">
              {day
                ? `Sample month / Day ${day} selected. All numbers are examples only.`
                : "No date selected. All numbers are examples only."}
            </p>
            <div className="mt-6">
              <PrimaryButton disabled={!day} onClick={() => setStep("time")}>
                {day ? "Continue to time →" : "Continue — disabled"}
              </PrimaryButton>
            </div>
          </div>
        )}

        {step === "time" && (
          <div>
            <SummaryRow label="Example date" value={dateLabel} onChange={() => setStep("date")} />
            <p className="mt-8 text-base font-light text-black/80 md:text-lg">
              Example time controls only — not actual appointments.
            </p>
            <div
              role="radiogroup"
              aria-label="Example times"
              className="mt-6 grid gap-2 md:grid-cols-2"
            >
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
                    {t}
                    {on ? (
                      <span>✓ Selected</span>
                    ) : (
                      <span aria-hidden className="h-3 w-3 rounded-full border border-black" />
                    )}
                  </button>
                );
              })}
            </div>
            <p className="mt-6 text-[13px] font-medium">
              Time zone — to be confirmed. Timezone is unknown.
            </p>
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
                  Example validation: {errorFields.join(" and ")} need
                  {errorFields.length === 1 ? "s" : ""} attention. Nothing has
                  been submitted.
                </p>
              </div>
            ) : (
              <p className="mb-6 text-base font-light leading-relaxed text-black/80 md:text-lg">
                Your consultation details. No account signup is required. These
                fields are static placeholders.
              </p>
            )}
            <div className="space-y-6">
              <Field
                label="Name"
                required
                value={name}
                onChange={setName}
                placeholder="Your name"
                error={errors.name}
                autoComplete="name"
              />
              <Field
                label="Email"
                required
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="Your email"
                error={errors.email}
                autoComplete="email"
              />
              <Field
                label="Event context"
                multiline
                value={context}
                onChange={setContext}
                placeholder="A little about your occasion"
              />
            </div>
            {errorFields.length > 0 && (
              <p className="mt-6 text-[13px] font-medium">
                No account signup is required for a consultation.
              </p>
            )}
            <div className="mt-6 space-y-2">
              <PrimaryButton type="submit">Continue to review →</PrimaryButton>
              <TextButton onClick={() => setStep("time")}>Back to time</TextButton>
            </div>
          </form>
        )}

        {step === "review" && (
          <div>
            <p className="mb-8 text-base font-light text-black/80 md:text-lg">
              Review the example details below. Nothing will be submitted.
            </p>
            <SummaryRow label="Example date" value={dateLabel} onChange={() => setStep("date")} />
            <SummaryRow label="Example time" value={timeLabel} onChange={() => setStep("time")} />
            <SummaryRow label="Contact details" value={contactLabel} onChange={() => setStep("details")} />
            <SummaryRow
              label="Event context"
              value={context.trim() || "[Optional context placeholder]"}
              onChange={() => setStep("details")}
            />
            <p className="mt-6 text-[11px] uppercase tracking-[0.15em]">
              Demo action — no actual booking
            </p>
            <div className="mt-4 space-y-2">
              <PrimaryButton onClick={() => setStep(demo === "failure" ? "failed" : "done")}>
                Confirm consultation
              </PrimaryButton>
              <TextButton onClick={() => setStep("details")}>Back to details</TextButton>
            </div>
          </div>
        )}

        {step === "failed" && (
          <div className="pt-4">
            <Eyebrow>Example error state</Eyebrow>
            <p className="mt-6 text-3xl font-light leading-tight">
              Your booking could not be completed.
            </p>
            <p className="mt-6 text-base font-light text-black/80">
              You can try again or review the example details. This disconnected
              demonstration has not created a reservation.
            </p>
            <div className="mt-10 space-y-2">
              <PrimaryButton onClick={() => setStep("review")}>Try again</PrimaryButton>
              <TextButton onClick={() => setStep("details")}>Edit details</TextButton>
            </div>
          </div>
        )}

        {step === "done" && (
          <div>
            <Eyebrow>Prototype confirmation</Eyebrow>
            <p className="mt-6 text-3xl font-light">No booking has been made.</p>
            <p className="mt-5 text-base font-light text-black/80">
              This is a static confirmation specimen, not a real consultation
              confirmation.
            </p>
            <div className="mt-8">
              <SummaryRow label="EXAMPLE date" value={dateLabel} />
              <SummaryRow label="EXAMPLE time" value={timeLabel} />
              <SummaryRow label="EXAMPLE contact" value={contactLabel} />
            </div>
            <div className="mt-6">
              <PrimaryButton onClick={onClose}>Close</PrimaryButton>
            </div>
          </div>
        )}
      </div>

      <DemoNote title="Design demo — not connected">{FLOW_NOTE}</DemoNote>
    </>
  );
}
