"use client";

import Link from "next/link";
import { useState } from "react";
import { updatePassword } from "@/app/auth/actions";
import { Field, PrimaryButton } from "../components/modal/ui";

export default function ResetForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit() {
    if (password.length < 8) return setError("Use at least 8 characters.");
    setError("");
    setMessage("");
    setBusy(true);
    try {
      const res = await updatePassword(password);
      if ("error" in res) setMessage(res.error);
      else setDone(true);
    } catch {
      setMessage("We could not reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div>
        <p className="text-2xl font-light">Your password has been updated.</p>
        <Link
          href="/account"
          className="mt-8 flex h-14 w-full items-center justify-center bg-[#201f1d] text-[11px] uppercase tracking-[0.15em] text-white hover:bg-black"
        >
          Go to your account
        </Link>
      </div>
    );
  }

  return (
    <form
      noValidate
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <Field
        label="New password"
        required
        type="password"
        value={password}
        onChange={setPassword}
        placeholder="At least 8 characters"
        error={error}
        autoComplete="new-password"
      />
      {message && (
        <p role="alert" className="border-l-2 border-black pl-4 text-[13px] font-medium">
          {message}
        </p>
      )}
      <PrimaryButton type="submit" disabled={busy}>
        {busy ? "Saving…" : "Save new password"}
      </PrimaryButton>
    </form>
  );
}
