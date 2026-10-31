"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getAccount, requestPasswordReset, signIn, signUp, type AuthError } from "@/app/auth/actions";
import { Link } from "@/i18n/navigation";
import { localePath } from "@/lib/i18n-meta";
import { joinList } from "@/lib/intl";
import { NewTabLink } from "../legal/LegalLinks";
import { Field, PrimaryButton } from "../modal/ui";

type View = "login" | "signup" | "forgot";
type Errors = { name?: string; email?: string; password?: string; age?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const textLink =
  "mx-auto block w-fit px-2 py-3 text-xs uppercase tracking-[0.15em] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

/** Shows messages passed back from email links, e.g. /login?error=link. */
export function LinkNotice() {
  const t = useTranslations("auth");
  const params = useSearchParams();
  if (params.get("error") !== "link") return null;
  return (
    <p role="alert" className="mb-6 border-l-2 border-black pl-4 text-[13px] font-medium">
      {t("linkInvalid")}
    </p>
  );
}

export default function AuthForm({ view }: { view: View }) {
  const t = useTranslations("auth");
  const errT = useTranslations("errors");
  const form = useTranslations("form");
  const locale = useLocale();
  // next/navigation's router: /admin has no language prefix, so paths are built with localePath.
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
        if (!cancelled && account) router.replace(localePath(locale, "/account"));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [view, router, locale]);

  useEffect(() => {
    if (Object.keys(errors).length) summaryRef.current?.focus();
  }, [errors]);

  function validate(fields: (keyof Errors)[], minPassword = 1) {
    const next: Errors = {};
    if (fields.includes("name") && !name.trim()) next.name = errT("name_required");
    if (fields.includes("email") && !EMAIL_RE.test(email.trim())) next.email = errT("invalid_email");
    if (fields.includes("password")) {
      if (!password) next.password = errT("password_required");
      else if (password.length < minPassword) next.password = t("minChars", { count: minPassword });
    }
    if (fields.includes("age") && !ageConfirmed) next.age = errT("age");
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  const errorText = (code: AuthError) => (errT.has(code) ? errT(code) : errT("generic"));

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setFailure("");
    setNotice("");
    try {
      await action();
    } catch {
      // Also covers a page left open across a new deployment (its server action no longer exists).
      setFailure(t("network"));
    } finally {
      setBusy(false);
    }
  }

  function goAfterSignIn(role: "admin" | "host") {
    router.push(role === "admin" ? "/admin" : localePath(locale, "/account"));
    router.refresh();
  }

  const submit = () =>
    run(async () => {
      if (view === "login") {
        if (!validate(["email", "password"])) return;
        const res = await signIn(email.trim(), password);
        if ("error" in res) return setFailure(errorText(res.error));
        goAfterSignIn(res.role);
      } else if (view === "signup") {
        if (!validate(["name", "email", "password", "age"], 8)) return;
        const res = await signUp({ name: name.trim(), email: email.trim(), password, ageConfirmed, locale });
        if ("error" in res) return setFailure(errorText(res.error));
        if (res.signedIn) return goAfterSignIn("host");
        setRegistered(true);
      } else {
        if (!validate(["email"])) return;
        const res = await requestPasswordReset(email.trim(), locale);
        if ("error" in res) return setFailure(errorText(res.error));
        setNotice(t("resetSent"));
      }
    });

  if (registered) {
    return (
      <div role="status">
        <p className="text-xs uppercase tracking-[0.2em]">{t("almostDone")}</p>
        <p className="mt-6 text-3xl font-light">{t("confirmEmail")}</p>
        <p className="mt-5 text-base font-light leading-relaxed text-black/80">
          {t("confirmSent", { email: email.trim() })}
        </p>
        <Link
          href="/login"
          className="mt-10 flex h-14 w-full items-center justify-center bg-[#201f1d] text-xs uppercase tracking-[0.15em] text-white hover:bg-black"
        >
          {t("goToLogin")}
        </Link>
      </div>
    );
  }

  const errorList = [errors.name && t("name"), errors.email && t("email"), errors.password && t("password"), errors.age && t("ageConfirmation")].filter(
    (f): f is string => !!f,
  );
  const intro = "mb-6 text-base font-light leading-relaxed text-black/80 md:text-lg";

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      {view === "login" && <p className={intro}>{t("loginIntro")}</p>}
      {view === "signup" && <p className={intro}>{t("signupIntro")}</p>}
      {view === "forgot" && <p className={intro}>{t("forgotIntro")}</p>}

      {errorList.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="mb-6 border-l-2 border-black pl-4 outline-none">
          <p className="text-[13px] font-medium">{form("checkDetails")}</p>
          <p className="mt-2 text-base font-light text-black/80">
            {form("needAttention", { fields: joinList(locale, errorList) })}
          </p>
        </div>
      )}

      <div className="space-y-6">
        {view === "signup" && (
          <Field label={t("name")} required value={name} onChange={setName} placeholder={t("namePlaceholder")} error={errors.name} autoComplete="name" maxLength={200} />
        )}
        <Field label={t("email")} required type="email" value={email} onChange={setEmail} placeholder={t("emailPlaceholder")} error={errors.email} autoComplete="email" maxLength={320} />
        {view !== "forgot" && (
          <Field
            label={t("password")}
            required
            type="password"
            value={password}
            onChange={setPassword}
            placeholder={view === "signup" ? t("passwordPlaceholderNew") : t("passwordPlaceholder")}
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
                className="h-6 w-6 shrink-0 accent-black"
              />
              {t("ageConfirm")}
            </label>
            {errors.age && (
              <p id="age-err" className="mt-2 text-[13px] font-medium">
                {form("error", { message: errors.age })}
              </p>
            )}
            <p className="mt-4 text-sm font-light leading-relaxed text-black/80">
              {t.rich("consent", {
                terms: (chunks) => <NewTabLink href="/terms">{chunks}</NewTabLink>,
                privacy: (chunks) => <NewTabLink href="/privacy">{chunks}</NewTabLink>,
              })}
            </p>
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
          {view === "login" && (busy ? t("loggingIn") : t("logIn"))}
          {view === "signup" && (busy ? t("creatingAccount") : t("signUp"))}
          {view === "forgot" && (busy ? t("sendingLink") : t("sendLink"))}
        </PrimaryButton>
      </div>

      <div className="mt-4 space-y-2">
        {view === "login" && (
          <>
            <Link href="/forgot-password" className={textLink}>{t("forgotLink")}</Link>
            <Link href="/signup" className={textLink}>{t("newHost")}</Link>
          </>
        )}
        {view === "signup" && <Link href="/login" className={textLink}>{t("alreadyHost")}</Link>}
        {view === "forgot" && <Link href="/login" className={textLink}>{t("backToLogin")}</Link>}
      </div>
    </form>
  );
}
