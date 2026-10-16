"use client";

import { useEffect, useRef, useState } from "react";
import { DemoNote, Eyebrow, Field, PrimaryButton, TextButton } from "./ui";

export type AuthView = "login" | "signup" | "forgot" | "registered" | "account";

const EMAIL_RE = /^\S+@\S+\.\S+$/;
const INTRO =
  "Proposed email/password flow for review. Authentication method is unconfirmed; no integration is connected.";

const TITLES: Record<AuthView, string> = {
  login: "Host log in",
  signup: "Host sign up",
  forgot: "Forgot password?",
  registered: "Registration example",
  account: "Host account",
};

type Errors = { name?: string; email?: string; password?: string };

export default function AuthFlow({
  titleId,
  initialView,
  onClose,
}: {
  titleId: string;
  initialView: AuthView;
  onClose: () => void;
}) {
  const [view, setView] = useState<AuthView>(initialView);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [notice, setNotice] = useState("");
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (Object.keys(errors).length) summaryRef.current?.focus();
  }, [errors]);

  function go(next: AuthView) {
    setErrors({});
    setNotice("");
    setView(next);
  }

  function validate(fields: ("name" | "email" | "password")[]) {
    const next: Errors = {};
    if (fields.includes("name") && !name.trim()) next.name = "Enter your name.";
    if (fields.includes("email") && !EMAIL_RE.test(email.trim()))
      next.email = "Enter a complete email address.";
    if (fields.includes("password") && !password) next.password = "Enter your password.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  const errorList = [errors.name && "Name", errors.email && "Email", errors.password && "Password"].filter(Boolean);

  const summary =
    errorList.length > 0 ? (
      <div
        ref={summaryRef}
        tabIndex={-1}
        role="alert"
        className="mb-6 border-l-2 border-black pl-4 outline-none"
      >
        <p className="text-[13px] font-medium">Please check your details</p>
        <p className="mt-2 text-base font-light text-black/80">
          Example validation: {errorList.join(", ")} need
          {errorList.length === 1 ? "s" : ""} attention. Nothing has been
          submitted.
        </p>
      </div>
    ) : null;

  return (
    <>
      <header className="flex items-start justify-between">
        <Eyebrow>Host access only</Eyebrow>
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
        {TITLES[view]}
      </h2>

      <div className="mt-8" aria-live="polite">
        {view === "account" && (
          <>
            <p className="text-base font-light leading-relaxed text-black/80 md:text-lg">
              Proposed menu for the current Account control. Host access only;
              guest accounts are excluded.
            </p>
            <div className="mt-8 flex gap-8">
              <button type="button" onClick={() => go("login")} className="text-[13px] uppercase tracking-wide hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black">
                Log in
              </button>
              <button type="button" onClick={() => go("signup")} className="text-[13px] uppercase tracking-wide hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black">
                Sign up
              </button>
            </div>
          </>
        )}

        {view === "login" && (
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              setNotice("");
              if (validate(["email", "password"]))
                setNotice("Demo only — no authentication is connected, so no one has been logged in.");
            }}
          >
            <p className="mb-6 text-base font-light leading-relaxed text-black/80 md:text-lg">{INTRO}</p>
            {summary}
            <div className="space-y-6">
              <Field label="Email" required type="email" value={email} onChange={setEmail} placeholder="Your email" error={errors.email} autoComplete="email" />
              <Field label="Password" required type="password" value={password} onChange={setPassword} placeholder="Not entered" error={errors.password} autoComplete="current-password" />
            </div>
            {notice && <p role="status" className="mt-6 text-[13px] font-medium">{notice}</p>}
            <div className="mt-6">
              <PrimaryButton type="submit">Log in</PrimaryButton>
            </div>
            <div className="mt-2 space-y-1">
              <TextButton onClick={() => go("forgot")}>Forgot password?</TextButton>
              <div className="pt-4" />
              <TextButton onClick={() => go("signup")}>New host? Sign up</TextButton>
            </div>
          </form>
        )}

        {view === "signup" && (
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              if (validate(["name", "email", "password"])) go("registered");
            }}
          >
            <p className="mb-6 text-base font-light leading-relaxed text-black/80 md:text-lg">{INTRO}</p>
            {summary}
            <p className="mb-6 text-[13px] font-medium">Host-only registration. Guest accounts are excluded.</p>
            <div className="space-y-6">
              <Field label="Name" required value={name} onChange={setName} placeholder="Your name" error={errors.name} autoComplete="name" />
              <Field label="Email" required type="email" value={email} onChange={setEmail} placeholder="Your email" error={errors.email} autoComplete="email" />
              <Field label="Password" required type="password" value={password} onChange={setPassword} placeholder="Not entered" error={errors.password} autoComplete="new-password" />
            </div>
            <div className="mt-8 space-y-4 text-[13px] font-medium">
              <p>Privacy policy — content required</p>
              <p>Terms — content required</p>
            </div>
            <div className="mt-8">
              <PrimaryButton type="submit">Sign up</PrimaryButton>
            </div>
            <div className="mt-2">
              <TextButton onClick={() => go("login")}>Already a host? Log in</TextButton>
            </div>
          </form>
        )}

        {view === "forgot" && (
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              setNotice("");
              if (validate(["email"])) setNotice("Demo only — no recovery link has been sent.");
            }}
          >
            <p className="text-base font-light leading-relaxed text-black/80 md:text-lg">{INTRO}</p>
            <p className="mb-6 mt-6 text-base font-light leading-relaxed text-black/80 md:text-lg">
              Recovery demonstration only. No recovery link will be sent and no
              message has been sent.
            </p>
            {summary}
            <Field label="Email" required type="email" value={email} onChange={setEmail} placeholder="Your email" error={errors.email} autoComplete="email" />
            {notice && <p role="status" className="mt-6 text-[13px] font-medium">{notice}</p>}
            <div className="mt-6 space-y-2">
              <PrimaryButton type="submit">Send recovery link</PrimaryButton>
              <TextButton onClick={() => go("login")}>Back to log in</TextButton>
            </div>
          </form>
        )}

        {view === "registered" && (
          <div>
            <Eyebrow>Example registration state</Eyebrow>
            <p className="mt-6 text-3xl font-light">No account has been created.</p>
            <p className="mt-5 text-base font-light text-black/80">
              A static host-only registration outcome for review. No account
              information has been submitted or stored.
            </p>
            <div className="mt-10">
              <PrimaryButton onClick={() => go("login")}>Go to log in</PrimaryButton>
            </div>
          </div>
        )}
      </div>

      <DemoNote title="Proposed host UI — not connected" />
    </>
  );
}
