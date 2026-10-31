import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import AuthForm, { LinkNotice } from "@/app/components/auth/AuthForm";
import AuthShell from "@/app/components/auth/AuthShell";
import { pageLocale, pageMeta } from "@/lib/page-meta";

export function generateMetadata({ params }: PageProps<"/[locale]/login">) {
  return pageMeta(params, "/login", "login", { noindex: true });
}

export default async function LoginPage({ params }: PageProps<"/[locale]/login">) {
  await pageLocale(params);
  const t = await getTranslations("auth");
  return (
    <AuthShell title={t("loginTitle")}>
      <Suspense fallback={null}>
        <LinkNotice />
      </Suspense>
      <AuthForm view="login" />
    </AuthShell>
  );
}
