"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getAccount, requestPasswordReset, signIn, signUp } from "@/app/auth/actions";
import { Field, PrimaryButton } from "../modal/ui";

type View = "login" | "signup" | "forgot";
type Errors = { name?: string; email?: string; password?: string; age?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const textLink =
  "mx-auto block w-fit px-2 py-3 text-[11px] uppercase tracking-[0.15em] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

/** Shows messages passed back from email links, e.g. /login?error=link. */
export function LinkNotice() {
  const params = useSearchParams();
  if (params.get("error") !== "link") return null;
  return (
    <p role="alert" className="mb-6 border-l-2 border-black pl-4 text-[13px] font-medium">
      That link is invalid or has expired. Log in, or request a new link.
    </p>
  );
}

export default function AuthForm({ view }: { view: View }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [failure, setFailure] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [registered, setRegistered] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  // Already signed in? Skip the form.
  useEffect(() => {
    if (view === "forgot") return;
    let cancelled = false;
    getAccount()
      .then((account) => {
        if (!cancelled && account) router.replace("/account");
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [view, router]);

  useEffect(() => {
    if (Object.keys(errors).length) summaryRef.current?.focus();
  }, [errors]);

  function validate(fields: (keyof Errors)[], minPassword = 1) {
    const next: Errors = {};
    if (fields.includes("name") && !name.trim()) next.name = "Enter your name.";
    if (fields.includes("email") && !EMAIL_RE.test(email.trim())) next.email = "Enter a complete email address.";
    if (fields.includes("password")) {
      if (!password) next.password = "Enter your password.";
      else if (password.length < minPassword) next.password = `Use at least ${minPassword} characters.`;
    }
    if (fields.includes("age") && !ageConfirmed) next.age = "Host accounts are for people aged 16 or older.";
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

  function goAfterSignIn(role: "admin" | "host") {
    router.push(role === "admin" ? "/admin" : "/account");
    router.refresh();
  }

  const submit = () =>
    run(async () => {
      if (view === "login") {
        if (!validate(["email", "password"])) return;
        const res = await signIn(email.trim(), password);
        if ("error" in res) return setFailure(res.error);
        goAfterSignIn(res.role);
      } else if (view === "signup") {
        if (!validate(["name", "email", "password", "age"], 8)) return;
        const res = await signUp({ name: name.trim(), email: email.trim(), password, ageConfirmed });
        if ("error" in res) return setFailure(res.error);
        if (res.signedIn) return goAfterSignIn("host");
        setRegistered(true);
      } else {
        if (!validate(["email"])) return;
        const res = await requestPasswordReset(email.trim());
        if ("error" in res) return setFailure(res.error);
        setNotice("If an account exists for that email, a reset link is on its way. Check your inbox and spam folder.");
      }
    });

  if (registered) {
    return (
      <div role="status">
        <p className="text-[11px] uppercase tracking-[0.2em]">Almost done</p>
        <p className="mt-6 text-3xl font-light">Confirm your email.</p>
        <p className="mt-5 text-base font-light leading-relaxed text-black/80">
          We sent a confirmation link to {email.trim()}. Open it on this device to activate your host account.
          If you do not see it, check your spam folder.
        </p>
        <Link
          href="/login"
          className="mt-10 flex h-14 w-full items-center justify-center bg-[#201f1d] text-[11px] uppercase tracking-[0.15em] text-white hover:bg-black"
        >
          Go to log in
        </Link>
      </div>
    );
  }

  const errorList = [errors.name && "Name", errors.email && "Email", errors.password && "Password", errors.age && "Age confirmation"].filter(Boolean);
  const intro = "mb-6 text-base font-light leading-relaxed text-black/80 md:text-lg";

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      {view === "login" && <p className={intro}>Log in with the email and password you registered with.</p>}
      {view === "signup" && (
        <>
          <p className={intro}>Create your host account. Guests do not need an account.</p>
        </>
      )}
      {view === "forgot" && <p className={intro}>Enter your email and we will send you a link to choose a new password.</p>}

      {errorList.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="mb-6 border-l-2 border-black pl-4 outline-none">
          <p className="text-[13px] font-medium">Please check your details</p>
          <p className="mt-2 text-base font-light text-black/80">
            {errorList.join(", ")} need{errorList.length === 1 ? "s" : ""} attention.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {view === "signup" && (
          <Field label="Name" required value={name} onChange={setName} placeholder="Your name" error={errors.name} autoComplete="name" />
        )}
        <Field label="Email" required type="email" value={email} onChange={setEmail} placeholder="Your email" error={errors.email} autoComplete="email" />
        {view !== "forgot" && (
          <Field
            label="Password"
            required
            type="password"
            value={password}
            onChange={setPassword}
            placeholder={view === "signup" ? "At least 8 characters" : "Your password"}
            error={errors.password}
            autoComplete={view === "signup" ? "new-password" : "current-password"}
          />
        )}
        {view === "signup" && (
          <div>
            <label className="flex cursor-pointer items-start gap-3 text-base font-light leading-snug">
              <input
                type="checkbox"
                required
                checked={ageConfirmed}
                onChange={(e) => setAgeConfirmed(e.target.checked)}
                aria-invalid={errors.age ? true : undefined}
                aria-describedby={errors.age ? "age-err" : undefined}
                className="mt-0.5 h-5 w-5 shrink-0 accent-black"
              />
              I confirm I am 16 or older.
            </label>
            {errors.age && (
              <p id="age-err" className="mt-2 text-[13px] font-medium">
                Error: {errors.age}
              </p>
            )}
          </div>
        )}
      </div>

      {failure && (
        <p role="alert" className="mt-6 border-l-2 border-black pl-4 text-[13px] font-medium">
          {failure}
        </p>
      )}
      {notice && (
        <p role="status" className="mt-6 text-[13px] font-medium">
          {notice}
        </p>
      )}

      <div className="mt-8">
        <PrimaryButton type="submit" disabled={busy}>
          {view === "login" && (busy ? "Logging in…" : "Log in")}
          {view === "signup" && (busy ? "Creating account…" : "Sign up")}
          {view === "forgot" && (busy ? "Sending…" : "Send recovery link")}
        </PrimaryButton>
      </div>

      <div className="mt-4 space-y-2">
        {view === "login" && (
          <>
            <Link href="/forgot-password" className={textLink}>Forgot password?</Link>
            <Link href="/signup" className={textLink}>New host? Sign up</Link>
          </>
        )}
        {view === "signup" && <Link href="/login" className={textLink}>Already a host? Log in</Link>}
        {view === "forgot" && <Link href="/login" className={textLink}>Back to log in</Link>}
      </div>
    </form>
  );
}
