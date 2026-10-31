"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { updatePassword } from "@/app/auth/actions";
import { Field, PrimaryButton } from "@/app/components/modal/ui";
import { Link } from "@/i18n/navigation";

export default function ResetForm() {
  const t = useTranslations("reset");
  const auth = useTranslations("auth");
  const errT = useTranslations("errors");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit() {
    if (password.length < 8) return setError(errT("short_password"));
    setError("");
    setMessage("");
    setBusy(true);
    try {
      const res = await updatePassword(password);
      if ("error" in res) setMessage(errT.has(res.error) ? errT(res.error) : errT("generic"));
      else setDone(true);
    } catch {
      setMessage(auth("network"));
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div>
        <p className="text-2xl font-light">{t("updated")}</p>
        <Link
          href="/account"
          className="mt-8 flex h-14 w-full items-center justify-center bg-[#201f1d] text-xs uppercase tracking-[0.15em] text-white hover:bg-black"
        >
          {t("goToAccount")}
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
        label={t("newPassword")}
        required
        type="password"
        value={password}
        onChange={setPassword}
        placeholder={auth("passwordPlaceholderNew")}
        error={error}
        autoComplete="new-password"
      />
      {message && (
        <p role="alert" className="border-l-2 border-black pl-4 text-[13px] font-medium">
          {message}
        </p>
      )}
      <PrimaryButton type="submit" disabled={busy}>
        {busy ? t("saving") : t("save")}
      </PrimaryButton>
    </form>
  );
}
