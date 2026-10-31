import { getTranslations } from "next-intl/server";
import AuthShell from "@/app/components/auth/AuthShell";
import ResetForm from "./ResetForm";
import { pageLocale, pageMeta } from "@/lib/page-meta";

export function generateMetadata({ params }: PageProps<"/[locale]/reset-password">) {
  return pageMeta(params, "/reset-password", "reset", { noindex: true });
}

export default async function ResetPasswordPage({ params }: PageProps<"/[locale]/reset-password">) {
  await pageLocale(params);
  const t = await getTranslations("auth");
  return (
    <AuthShell title={t("resetTitle")}>
      <ResetForm />
    </AuthShell>
  );
}
