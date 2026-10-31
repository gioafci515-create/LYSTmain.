"use client";

import { useLocale, useTranslations } from "next-intl";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { getAccount, signOut, type Account } from "@/app/auth/actions";
import { useRouter } from "@/i18n/navigation";
import { formatDate } from "@/lib/intl";

export default function AccountView() {
  const t = useTranslations("account");
  const locale = useLocale();
  const router = useRouter();
  const [account, setAccount] = useState<Account | null>(null);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const a = await getAccount();
        if (cancelled) return;
        if (!a) return router.replace("/login");
        setAccount(a);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function logout() {
    setBusy(true);
    try {
      await signOut();
    } finally {
      router.push("/");
      router.refresh();
    }
  }

  if (failed) {
    return <p role="alert" className="text-base font-light text-black/80">{t("failed")}</p>;
  }
  if (!account) {
    return <p role="status" className="text-sm font-light text-black/60">{t("loading")}</p>;
  }

  return (
    <div>
      <dl className="divide-y divide-[#e6dedb] border-y border-[#e6dedb] text-sm">
        {[
          [t("name"), account.name || "—"],
          [t("email"), account.email],
          [t("type"), account.role === "admin" ? t("admin") : t("host")],
          [t("since"), formatDate(locale, new Date(account.since))],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 py-4">
            <dt className="text-black/60">{k}</dt>
            <dd className="break-all text-right">{v}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-8 text-base font-light leading-relaxed text-black/80">
        {t("notYet")}
      </p>

      <div className="mt-10 space-y-3">
        {account.role === "admin" && (
          // next/link, not the localized Link: /admin has no language prefix (English only).
          <NextLink
            href="/admin"
            className="flex h-14 w-full items-center justify-center bg-[#201f1d] text-xs uppercase tracking-[0.15em] text-white hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            {t("openAdmin")}
          </NextLink>
        )}
        <button
          type="button"
          onClick={logout}
          disabled={busy}
          className="flex h-14 w-full items-center justify-center border border-[#201f1d] text-xs uppercase tracking-[0.15em] hover:bg-white disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          {busy ? t("loggingOut") : t("logOut")}
        </button>
      </div>
    </div>
  );
}
