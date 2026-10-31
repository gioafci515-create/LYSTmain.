import { getTranslations } from "next-intl/server";
import LegalPage from "@/app/components/legal/LegalPage";
import { privacy } from "@/lib/legal/privacy";
import { pageLocale, pageMeta } from "@/lib/page-meta";

export function generateMetadata({ params }: PageProps<"/[locale]/privacy">) {
  return pageMeta(params, "/privacy", "privacyTitle", { description: "privacyDescription" });
}

export default async function PrivacyPage({ params }: PageProps<"/[locale]/privacy">) {
  const locale = await pageLocale(params);
  const t = await getTranslations("common");
  return <LegalPage doc={privacy[locale]} locale={locale} other={{ href: "/terms", label: t("terms") }} />;
}
