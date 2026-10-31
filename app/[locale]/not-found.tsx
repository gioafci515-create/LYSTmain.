import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import AuthShell from "@/app/components/auth/AuthShell";

const button =
  "flex h-14 w-full items-center justify-center text-xs uppercase tracking-[0.15em] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

// Unknown pages inside a language ("/en/nope"), in that language.
export default function NotFound() {
  const t = useTranslations("notFound");
  const meta = useTranslations("meta");
  return (
    <AuthShell eyebrow={t("eyebrow")} title={t("title")}>
      <title>{meta("notFound")}</title>
      <meta name="robots" content="noindex" />
      <p className="text-base font-light leading-relaxed text-black/80 md:text-lg">{t("body")}</p>
      <div className="mt-10 space-y-3">
        <Link href="/" className={`${button} bg-[#201f1d] text-white hover:bg-black`}>
          {t("home")}
        </Link>
        <Link href="/#consultation" className={`${button} border border-[#201f1d] hover:bg-white`}>
          {t("book")}
        </Link>
      </div>
    </AuthShell>
  );
}
