import { getTranslations } from "next-intl/server";
import AuthShell from "@/app/components/auth/AuthShell";
import AccountView from "./AccountView";
import { pageLocale, pageMeta } from "@/lib/page-meta";

export function generateMetadata({ params }: PageProps<"/[locale]/account">) {
  return pageMeta(params, "/account", "account", { noindex: true });
}

export default async function AccountPage({ params }: PageProps<"/[locale]/account">) {
  await pageLocale(params);
  const t = await getTranslations("auth");
  return (
    <AuthShell title={t("accountTitle")}>
      <AccountView />
    </AuthShell>
  );
}
