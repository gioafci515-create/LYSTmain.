import "server-only";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import type en from "@/messages/en.json";
import { alternates } from "./i18n-meta";

type MetaKey = keyof typeof en.meta;

/** The page's language from its URL. Call at the top of every page so it can render statically. */
export async function pageLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return locale;
}

/** Title, description and hreflang links for a page, in the page's language. */
export async function pageMeta(
  params: Promise<{ locale: string }>,
  path: string,
  title: MetaKey,
  { description, noindex }: { description?: MetaKey; noindex?: boolean } = {},
): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = hasLocale(routing.locales, raw) ? raw : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t(title),
    ...(description && { description: t(description) }),
    alternates: alternates(locale, path),
    ...(noindex && { robots: { index: false, follow: false } }),
  };
}
