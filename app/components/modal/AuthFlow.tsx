"use client";

import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getBrowserClient } from "@/lib/supabase/browser";
import { DemoNote, Eyebrow, Field, PrimaryButton, TextButton } from "./ui";

export type AuthView = "login" | "signup" | "forgot" | "registered" | "account";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TITLES: Record<AuthView, string> = {
  login: "Host log in",
  signup: "Host sign up",
  forgot: "Forgot password?",
  registered: "Check your email",
  account: "Host account",
};

type Errors = { name?: string; email?: string; password?: string };

function friendly(message: string) {
  const m = message.toLowerCase();
  if (m.includes("invalid login")) return "Email or password is incorrect.";
  if (m.includes("email not confirmed")) return "Please confirm your email first. Check your inbox for our message.";
  if (m.includes("rate limit") || m.includes("too many")) return "Too many attempts. Please wait a few minutes and try again.";
  if (m.includes("password")) return message;
  return "Something went wrong. Please try again.";
}

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
  const [failure, setFailure] = useState("");
  const [busy, setBusy] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    try {
      const sb = getBrowserClient();
      sb.auth.getUser().then(async ({ data }: { data: { user: User | null } }) => {
        if (cancelled) return;
        setUser(data.user);
        if (data.user) {
          const { data: p } = await sb.from("profiles").select("role").eq("id", data.user.id).maybeSingle();
          if (!cancelled) setIsAdmin(p?.role === "admin");
        }
      });
    } catch {
      // Supabase not configured; forms will report the problem on submit.
    }
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (Object.keys(errors).length) summaryRef.current?.focus();
  }, [errors]);

  function go(next: AuthView) {
    setErrors({});
    setNotice("");
    setFailure("");
    setView(next);
  }

  function validate(fields: ("name" | "email" | "password")[], minPassword = 1) {
    const next: Errors = {};
    if (fields.includes("name") && !name.trim()) next.name = "Enter your name.";
    if (fields.includes("email") && !EMAIL_RE.test(email.trim())) next.email = "Enter a complete email address.";
    if (fields.includes("password")) {
      if (!password) next.password = "Enter your password.";
      else if (password.length < minPassword) next.password = `Use at least ${minPassword} characters.`;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setFailure("");
    setNotice("");
    try {
      await action();
    } catch {
      setFailure("We could not reach the server. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  async function loadProfile(u: User) {
    setUser(u);
    const { data: p } = await getBrowserClient().from("profiles").select("role").eq("id", u.id).maybeSingle();
    setIsAdmin(p?.role === "admin");
  }

  const submitLogin = () =>
    run(async () => {
      if (!validate(["email", "password"])) return;
      const { data, error } = await getBrowserClient().auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error || !data.user) return setFailure(friendly(error?.message ?? ""));
      setPassword("");
      await loadProfile(data.user);
      go("account");
    });

  const submitSignup = () =>
    run(async () => {
      if (!validate(["name", "email", "password"], 8)) return;
      const { data, error } = await getBrowserClient().auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: name.trim() },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/`,
        },
      });
      if (error) return setFailure(friendly(error.message));
      setPassword("");
      if (data.session && data.user) {
        await loadProfile(data.user);
        go("account");
      } else {
        go("registered");
      }
    });

  const submitForgot = () =>
    run(async () => {
      if (!validate(["email"])) return;
      const { error } = await getBrowserClient().auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });
      if (error) return setFailure(friendly(error.message));
      setNotice("If an account exists for that email, a reset link is on its way.");
    });

  const logout = () =>
    run(async () => {
      await getBrowserClient().auth.signOut();
      setUser(null);
      setIsAdmin(false);
      setEmail("");
    });

  const errorList = [errors.name && "Name", errors.email && "Email", errors.password && "Password"].filter(Boolean);

  const summary =
    errorList.length > 0 ? (
      <div ref={summaryRef} tabIndex={-1} role="alert" className="mb-6 border-l-2 border-black pl-4 outline-none">
        <p className="text-[13px] font-medium">Please check your details</p>
        <p className="mt-2 text-base font-light text-black/80">
          {errorList.join(", ")} need{errorList.length === 1 ? "s" : ""} attention.
        </p>
      </div>
    ) : null;

  const failureNote = failure ? (
    <p role="alert" className="mt-6 border-l-2 border-black pl-4 text-[13px] font-medium">
      {failure}
    </p>
  ) : null;

  const noticeNote = notice ? (
    <p role="status" className="mt-6 text-[13px] font-medium">
      {notice}
    </p>
  ) : null;

  const intro = "text-base font-light leading-relaxed text-black/80 md:text-lg";

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

      <h2 id={titleId} className="mt-10 text-[40px] font-light leading-[1.05] tracking-tight md:text-5xl">
        {TITLES[view]}
      </h2>

      <div className="mt-8" aria-live="polite">
        {view === "account" && user && (
          <>
            <p className={intro}>Signed in as</p>
            <p className="mt-2 break-all text-xl font-light">{user.email}</p>
            <div className="mt-8 space-y-2">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex h-14 w-full items-center justify-center bg-[#201f1d] text-[11px] uppercase tracking-[0.15em] text-white hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                  Open admin
                </Link>
              )}
              <TextButton onClick={logout} disabled={busy}>
                {busy ? "Signing out…" : "Log out"}
              </TextButton>
            </div>
            {failureNote}
          </>
        )}

        {view === "account" && !user && (
          <>
            <p className={intro}>Host access only. Guests do not need an account.</p>
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
              submitLogin();
            }}
          >
            <p className={`mb-6 ${intro}`}>Log in with the email and password you registered with.</p>
            {summary}
            <div className="space-y-6">
              <Field label="Email" required type="email" value={email} onChange={setEmail} placeholder="Your email" error={errors.email} autoComplete="email" />
              <Field label="Password" required type="password" value={password} onChange={setPassword} placeholder="Your password" error={errors.password} autoComplete="current-password" />
            </div>
            {failureNote}
            <div className="mt-6">
              <PrimaryButton type="submit" disabled={busy}>{busy ? "Logging in…" : "Log in"}</PrimaryButton>
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
              submitSignup();
            }}
          >
            <p className={`mb-6 ${intro}`}>Create your host account with an email and password.</p>
            {summary}
            <p className="mb-6 text-[13px] font-medium">Host-only registration. Guest accounts are excluded.</p>
            <div className="space-y-6">
              <Field label="Name" required value={name} onChange={setName} placeholder="Your name" error={errors.name} autoComplete="name" />
              <Field label="Email" required type="email" value={email} onChange={setEmail} placeholder="Your email" error={errors.email} autoComplete="email" />
              <Field label="Password" required type="password" value={password} onChange={setPassword} placeholder="At least 8 characters" error={errors.password} autoComplete="new-password" />
            </div>
            <div className="mt-8 space-y-4 text-[13px] font-medium">
              <p>Privacy policy — content required</p>
              <p>Terms — content required</p>
            </div>
            {failureNote}
            <div className="mt-8">
              <PrimaryButton type="submit" disabled={busy}>{busy ? "Creating account…" : "Sign up"}</PrimaryButton>
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
              submitForgot();
            }}
          >
            <p className={`mb-6 ${intro}`}>Enter your email and we will send you a link to choose a new password.</p>
            {summary}
            <Field label="Email" required type="email" value={email} onChange={setEmail} placeholder="Your email" error={errors.email} autoComplete="email" />
            {failureNote}
            {noticeNote}
            <div className="mt-6 space-y-2">
              <PrimaryButton type="submit" disabled={busy}>{busy ? "Sending…" : "Send recovery link"}</PrimaryButton>
              <TextButton onClick={() => go("login")}>Back to log in</TextButton>
            </div>
          </form>
        )}

        {view === "registered" && (
          <div>
            <Eyebrow>Almost done</Eyebrow>
            <p className="mt-6 text-3xl font-light">Confirm your email.</p>
            <p className="mt-5 text-base font-light text-black/80">
              We sent a confirmation link to {email.trim()}. Open it to activate your host account, then log in.
              If you do not see it, check your spam folder.
            </p>
            <div className="mt-10">
              <PrimaryButton onClick={() => go("login")}>Go to log in</PrimaryButton>
            </div>
          </div>
        )}
      </div>

      <DemoNote title="Your details">We use these details only to run your host account.</DemoNote>
    </>
  );
}
