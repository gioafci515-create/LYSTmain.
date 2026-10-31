import { getTranslations } from "next-intl/server";
import LegalPage from "@/app/components/legal/LegalPage";
import { terms } from "@/lib/legal/terms";
import { pageLocale, pageMeta } from "@/lib/page-meta";

export function generateMetadata({ params }: PageProps<"/[locale]/terms">) {
  return pageMeta(params, "/terms", "termsTitle", { description: "termsDescription" });
}

export default async function TermsPage({ params }: PageProps<"/[locale]/terms">) {
  const locale = await pageLocale(params);
  const t = await getTranslations("common");
  return <LegalPage doc={terms[locale]} locale={locale} other={{ href: "/privacy", label: t("privacyPolicy") }} />;
}
