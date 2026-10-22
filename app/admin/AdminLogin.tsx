"use client";

import { useState } from "react";
import { signIn } from "@/app/auth/actions";
import { Field, PrimaryButton } from "../components/modal/ui";

export default function AdminLogin({ onSignedIn }: { onSignedIn: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!email.trim() || !password) return setError("Enter your email and password.");
    setBusy(true);
    setError("");
    try {
      const res = await signIn(email.trim(), password);
      if ("error" in res) setError(res.error);
      else onSignedIn(email.trim());
    } catch {
      setError("We could not reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      noValidate
      className="mt-12 space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <h1 className="text-3xl font-light tracking-tight">Admin log in</h1>
      <Field label="Email" required type="email" value={email} onChange={setEmail} placeholder="Your email" autoComplete="email" />
      <Field label="Password" required type="password" value={password} onChange={setPassword} placeholder="Your password" autoComplete="current-password" />
      {error && (
        <p role="alert" className="border-l-2 border-black pl-4 text-[13px] font-medium">
          {error}
        </p>
      )}
      <PrimaryButton type="submit" disabled={busy}>
        {busy ? "Logging in…" : "Log in"}
      </PrimaryButton>
    </form>
  );
}
