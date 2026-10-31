import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const link =
  "underline underline-offset-4 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

function NewTabLink({ href, children }: { href: string; children: React.ReactNode }) {
  const t = useTranslations("common");
  return (
    <Link href={href} target="_blank" rel="noopener" className={link}>
      {children}
      <span className="sr-only"> {t("newTab")}</span>
    </Link>
  );
}

/** Privacy Policy and Terms next to a form. They open in a new tab so a half-filled form is not lost. */
export default function LegalLinks() {
  const t = useTranslations("common");
  return (
    <>
      <NewTabLink href="/privacy">{t("privacyPolicy")}</NewTabLink>
      {" · "}
      <NewTabLink href="/terms">{t("terms")}</NewTabLink>
    </>
  );
}

export { NewTabLink };
