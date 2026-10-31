import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";

/** Path of a page in a language: Georgian has no prefix ("/privacy"), others do ("/en/privacy"). */
export function localePath(locale: Locale, path: string) {
  const clean = path === "/" ? "" : path;
  return locale === routing.defaultLocale ? clean || "/" : `/${locale}${clean}`;
}

/** The language a site path is in ("/en/account" -> "en", "/account" -> Georgian). */
export function localeOf(path: string): Locale {
  const first = path.split("/")[1];
  return routing.locales.find((l) => l === first && l !== routing.defaultLocale) ?? routing.defaultLocale;
}

/** Canonical URL plus hreflang links to the same page in every language (x-default = Georgian). */
export function alternates(locale: Locale, path: string): Metadata["alternates"] {
  return {
    canonical: localePath(locale, path),
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, localePath(l, path)])),
      "x-default": localePath(routing.defaultLocale, path),
    },
  };
}
