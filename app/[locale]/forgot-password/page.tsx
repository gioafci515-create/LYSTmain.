import { getTranslations } from "next-intl/server";
import AuthForm from "@/app/components/auth/AuthForm";
import AuthShell from "@/app/components/auth/AuthShell";
import { pageLocale, pageMeta } from "@/lib/page-meta";

export function generateMetadata({ params }: PageProps<"/[locale]/forgot-password">) {
  return pageMeta(params, "/forgot-password", "forgot", { noindex: true });
}

export default async function ForgotPasswordPage({ params }: PageProps<"/[locale]/forgot-password">) {
  await pageLocale(params);
  const t = await getTranslations("auth");
  return (
    <AuthShell title={t("forgotTitle")}>
      <AuthForm view="forgot" />
    </AuthShell>
  );
}
