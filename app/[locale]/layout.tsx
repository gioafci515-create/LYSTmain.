import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { routing } from "@/i18n/routing";
import { fontClassName, fontStack } from "@/lib/fonts";
import { alternates } from "@/lib/i18n-meta";
import { site } from "@/lib/site";
import ModalProvider from "../components/modal/ModalProvider";
import SkipLink from "../components/SkipLink";
import Tracker from "../components/Tracker";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(site.url),
    title: t("homeTitle"),
    description: t("homeDescription"),
    alternates: alternates(locale, "/"),
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <html lang={locale} className={`${fontClassName} h-full antialiased`} style={{ "--font-stack": fontStack } as React.CSSProperties}>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <SkipLink label={t("skipToContent")} />
          <ModalProvider>{children}</ModalProvider>
          <Suspense fallback={null}>
            <Tracker />
          </Suspense>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
