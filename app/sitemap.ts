import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { LEGAL_UPDATED } from "@/lib/legal/meta";
import { localePath } from "@/lib/i18n-meta";
import { site } from "@/lib/site";

// Public pages only. Log-in, sign-up and account pages are noindex and stay out.
const pages: { path: string; lastModified?: string }[] = [
  { path: "/" },
  { path: "/privacy", lastModified: LEGAL_UPDATED },
  { path: "/terms", lastModified: LEGAL_UPDATED },
];

/** Every page in every language, each listing its translations (hreflang). */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (locale: (typeof routing.locales)[number], path: string) => `${site.url}${localePath(locale, path)}`;
  return pages.flatMap(({ path, lastModified }) =>
    routing.locales.map((locale) => ({
      url: url(locale, path),
      ...(lastModified && { lastModified }),
      alternates: {
        languages: {
          ...Object.fromEntries(routing.locales.map((l) => [l, url(l, path)])),
          "x-default": url(routing.defaultLocale, path),
        },
      },
    })),
  );
}
