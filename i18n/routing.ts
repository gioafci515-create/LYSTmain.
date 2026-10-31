import { defineRouting } from "next-intl/routing";

// Georgian at "/" (no prefix), English at "/en/...", Russian at "/ru/...".
// No automatic language detection and no language cookie: the URL alone decides the language,
// so shared links always open as shared and the Privacy Policy needs no extra cookie.
export const routing = defineRouting({
  locales: ["ka", "en", "ru"],
  defaultLocale: "ka",
  localePrefix: "as-needed",
  localeDetection: false,
  localeCookie: false,
});

export type Locale = (typeof routing.locales)[number];

/** Intl locale for dates and numbers. */
export const intlLocale: Record<Locale, string> = { ka: "ka-GE", en: "en-GB", ru: "ru-RU" };
