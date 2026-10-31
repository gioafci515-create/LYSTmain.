"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "@/i18n/routing";
import { formatDate, joinList, monthName, weekdaysNarrow } from "@/lib/intl";
import type en from "@/messages/en.json";
import { NewTabLink } from "../legal/LegalLinks";
import {
  DemoNote,
  Eyebrow,
  Field,
  PrimaryButton,
  SummaryRow,
  TextButton,
} from "./ui";

type Step = "date" | "time" | "details" | "review" | "done" | "failed";
/** Error codes from validation and app/api/consultations/route.ts; texts are booking.errors.* */
type ErrorCode = keyof typeof en.booking.errors;

const STEPS = [
  { key: "date", label: "stepDate" },
  { key: "time", label: "stepTime" },
  { key: "details", label: "stepDetails" },
  { key: "review", label: "stepReview" },
] as const satisfies { key: Exclude<Step, "done" | "failed">; label: string }[];
// Consultation slots are Tbilisi times. Georgia is UTC+4 all year (no daylight saving).
const TIMES = ["09:30", "11:00", "14:00", "16:30"];
const TBILISI = "Asia/Tbilisi";
const SEND_TIMEOUT_MS = 20_000;
const localTime = (date: string, time: string, timeZone: string) =>
  new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone }).format(
    new Date(`${date}T${time}:00+04:00`),
  );
const WEEKS_SHOWN = 5;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

type Cell = { iso: string; day: number; disabled: boolean };

function buildCalendar(locale: Locale): { cells: Cell[]; label: string } {
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
  const m = (d: Date) => monthName(locale, d);
  const label =
    m(first) === m(last) ? `${m(first)} ${first.getUTCFullYear()}` : `${m(first)} – ${m(last)} ${last.getUTCFullYear()}`;
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
  const t = useTranslations("booking");
  const errT = useTranslations("booking.errors");
  const form = useTranslations("form");
  const common = useTranslations("common");
  const locale = useLocale();
  const [step, setStep] = useState<Step>("date");
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [context, setContext] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [errors, setErrors] = useState<{ name?: ErrorCode; email?: ErrorCode }>({});
  const [sending, setSending] = useState(false);
  const [failCode, setFailCode] = useState("");
  const summaryRef = useRef<HTMLDivElement>(null);

  const calendar = useMemo(() => buildCalendar(locale), [locale]);
  const fmtIso = (s: string) => formatDate(locale, new Date(`${s}T00:00:00Z`), { weekday: true });
  const weekdayNames = weekdaysNarrow(locale);
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
    ? showLocal && date
      ? t("timeLabelLocal", { time, local: localTime(date, time, timeZone) })
      : t("timeLabel", { time })
    : "";
  const contactLabel = `${name.trim()} · ${email.trim()}${phone.trim() ? ` · ${phone.trim()}` : ""}`;
  const errorFields = [errors.name && t("name"), errors.email && t("email")].filter((f): f is string => !!f);
  const isCode = (code: unknown): code is ErrorCode => typeof code === "string" && errT.has(code as ErrorCode);

  function submitDetails() {
    const next: typeof errors = {};
    if (!name.trim()) next.name = "nameRequired";
    if (!EMAIL_RE.test(email.trim())) next.email = "emailInvalid";
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
        const fields = data?.fields ?? {};
        if (res.status === 400 && (isCode(fields.name) || isCode(fields.email))) {
          setErrors({ name: isCode(fields.name) ? fields.name : undefined, email: isCode(fields.email) ? fields.email : undefined });
          setStep("details");
        } else {
          setFailCode(fields.date ?? fields.time ?? data?.error ?? "");
          setStep("failed");
        }
      }
    } catch (err) {
      setFailCode(err instanceof DOMException && err.name === "TimeoutError" ? "timeout" : "");
      setStep("failed");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <header className="flex items-start justify-between">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <button
          type="button"
          onClick={onClose}
          aria-label={common("close")}
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
        {step === "done" ? t("titleDone") : t("title")}
      </h2>

      <ol className="mt-5 grid grid-cols-4 gap-x-3" aria-label={t("progress")}>
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
              {t(s.label)}
              {complete && <span aria-label={` ${t("completed")}`}> ✓</span>}
            </li>
          );
        })}
      </ol>

      <div className="mt-8" aria-live="polite">
        {step === "date" && (
          <div>
            <p className="text-base font-light leading-relaxed text-black/80 md:text-lg">
              {t("dateIntro")}
            </p>
            <p className="mt-8 text-xs uppercase tracking-[0.15em]">{calendar.label}</p>

            <div role="group" aria-label={calendar.label} className="mt-6 grid grid-cols-7 gap-y-1 text-center">
              {weekdayNames.map((w, i) => (
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
              {date ? t("dateSelected", { date: dateLabel }) : t("noDate")}
            </p>
            <div className="mt-6">
              <PrimaryButton disabled={!date} onClick={() => setStep("time")}>
                {date ? t("continueToTime") : t("chooseDateToContinue")}
              </PrimaryButton>
            </div>
          </div>
        )}

        {step === "time" && (
          <div>
            <SummaryRow label={t("stepDate")} value={dateLabel} onChange={() => setStep("date")} />
            <p className="mt-8 text-base font-light text-black/80 md:text-lg">
              {t("timeIntro")}
            </p>
            <div role="radiogroup" aria-label={t("preferredTime")} className="mt-6 grid gap-2 md:grid-cols-2">
              {TIMES.map((slot) => {
                const on = time === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setTime(slot)}
                    className={`flex h-14 items-center justify-between border px-4 text-left text-[13px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
                      on
                        ? "border-[#201f1d] bg-[#201f1d] text-white"
                        : "border-[#efe3dc] bg-white hover:border-black"
                    }`}
                  >
                    <span>
                      {slot}
                      {showLocal && date && (
                        <span className="block text-xs font-normal opacity-80">{t("yourTime", { time: localTime(date, slot, timeZone) })}</span>
                      )}
                    </span>
                    {on ? (
                      <span>{t("selected")}</span>
                    ) : (
                      <span aria-hidden className="h-3 w-3 rounded-full border border-black" />
                    )}
                  </button>
                );
              })}
            </div>
            {showLocal && (
              <p className="mt-6 text-[13px] font-medium">{t("localNote", { zone: timeZone })}</p>
            )}
            <div className="mt-6 space-y-2">
              <PrimaryButton disabled={!time} onClick={() => setStep("details")}>
                {t("continueToDetails")}
              </PrimaryButton>
              <TextButton onClick={() => setStep("date")}>{t("backToDate")}</TextButton>
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
                <p className="text-[13px] font-medium">{t("checkContact")}</p>
                <p className="mt-2 text-base font-light text-black/80">
                  {form("needAttention", { fields: joinList(locale, errorFields) })}
                </p>
              </div>
            ) : (
              <p className="mb-6 text-base font-light leading-relaxed text-black/80 md:text-lg">
                {t("detailsIntro")}
              </p>
            )}
            <div className="space-y-6">
              {/* Limits match app/api/consultations/route.ts. */}
              <Field label={t("name")} required value={name} onChange={setName} placeholder={t("namePlaceholder")} error={errors.name && errT(errors.name)} autoComplete="name" maxLength={200} />
              <Field label={t("email")} required type="email" value={email} onChange={setEmail} placeholder={t("emailPlaceholder")} error={errors.email && errT(errors.email)} autoComplete="email" maxLength={320} />
              <Field label={t("phone")} type="tel" value={phone} onChange={setPhone} placeholder={t("phonePlaceholder")} autoComplete="tel" maxLength={50} />
              <Field label={t("context")} multiline value={context} onChange={setContext} placeholder={t("contextPlaceholder")} maxLength={4000} />
              {/* Honeypot: hidden from people, tempting to bots. */}
              <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label>
                  Website
                  <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                </label>
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <PrimaryButton type="submit">{t("continueToReview")}</PrimaryButton>
              <TextButton onClick={() => setStep("time")}>{t("backToTime")}</TextButton>
            </div>
          </form>
        )}

        {step === "review" && (
          <div>
            <p className="mb-8 text-base font-light text-black/80 md:text-lg">
              {t("reviewIntro")}
            </p>
            <SummaryRow label={t("stepDate")} value={dateLabel} onChange={() => setStep("date")} />
            <SummaryRow label={t("stepTime")} value={timeLabel} onChange={() => setStep("time")} />
            <SummaryRow label={t("contactDetails")} value={contactLabel} onChange={() => setStep("details")} />
            <SummaryRow label={t("context")} value={context.trim() || "—"} onChange={() => setStep("details")} />
            <div className="mt-6 space-y-2">
              <PrimaryButton onClick={confirm} disabled={sending}>
                {sending ? t("sending") : t("send")}
              </PrimaryButton>
              <TextButton onClick={() => setStep("details")}>{t("backToDetails")}</TextButton>
            </div>
          </div>
        )}

        {step === "failed" && (
          <div className="pt-4">
            <Eyebrow>{t("failedEyebrow")}</Eyebrow>
            <p className="mt-6 text-3xl font-light leading-tight">
              {t("failedTitle")}
            </p>
            <p className="mt-6 text-base font-light text-black/80">
              {isCode(failCode) ? errT(failCode) : t("failedDefault")}
            </p>
            <div className="mt-10 space-y-2">
              <PrimaryButton onClick={() => setStep("review")}>{t("tryAgain")}</PrimaryButton>
              <TextButton onClick={() => setStep("details")}>{t("editDetails")}</TextButton>
            </div>
          </div>
        )}

        {step === "done" && (
          <div>
            <Eyebrow>{t("doneEyebrow")}</Eyebrow>
            <p className="mt-6 text-3xl font-light leading-tight">{t("doneTitle")}</p>
            <p className="mt-5 text-base font-light text-black/80">
              {t("doneBody", { email: email.trim() })}
            </p>
            <div className="mt-8">
              <SummaryRow label={t("requestedDate")} value={dateLabel} />
              <SummaryRow label={t("requestedTime")} value={timeLabel} />
              <SummaryRow label={t("contact")} value={contactLabel} />
            </div>
            <div className="mt-6">
              <PrimaryButton onClick={onClose}>{common("close")}</PrimaryButton>
            </div>
          </div>
        )}
      </div>

      <DemoNote title={t("noteTitle")}>
        {t.rich("noteBody", { link: (chunks) => <NewTabLink href="/privacy">{chunks}</NewTabLink> })}
      </DemoNote>
    </>
  );
}
