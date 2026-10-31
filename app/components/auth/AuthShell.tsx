import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LanguageSwitch from "../LanguageSwitch";
import LegalLinks from "../legal/LegalLinks";

// Full-page frame shared by /login, /signup, /forgot-password, /account, /reset-password and the 404 page.
export default function AuthShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}) {
  const t = useTranslations("common");
  const auth = useTranslations("auth");
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[560px] flex-col px-6 pb-16 pt-6 md:pt-10">
      <div className="flex h-12 items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-light tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
        >
          LYST
        </Link>
        <Link
          href="/"
          className="flex h-11 items-center text-xs uppercase tracking-[0.14em] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          {t("backToWebsite")}
        </Link>
      </div>

      <div id="main" className="fade-up mt-14 md:mt-20">
        <p className="text-xs uppercase tracking-[0.2em]">{eyebrow ?? auth("eyebrow")}</p>
        <h1 className="mt-8 text-[40px] font-light leading-[1.05] tracking-tight md:text-5xl">{title}</h1>
        <div className="mt-8">{children}</div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <p className="text-xs text-black/60">
            <LegalLinks />
          </p>
          <LanguageSwitch className="-mr-1.5" linkClassName="text-xs tracking-[0.15em] text-black/70" />
        </div>
      </div>
    </main>
  );
}
