import { getTranslations } from "next-intl/server";
import AuthForm from "@/app/components/auth/AuthForm";
import AuthShell from "@/app/components/auth/AuthShell";
import { pageLocale, pageMeta } from "@/lib/page-meta";

export function generateMetadata({ params }: PageProps<"/[locale]/signup">) {
  return pageMeta(params, "/signup", "signup", { noindex: true });
}

export default async function SignupPage({ params }: PageProps<"/[locale]/signup">) {
  await pageLocale(params);
  const t = await getTranslations("auth");
  return (
    <AuthShell title={t("signupTitle")}>
      <AuthForm view="signup" />
    </AuthShell>
  );
}
