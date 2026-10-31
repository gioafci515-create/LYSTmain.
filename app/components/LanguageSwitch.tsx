"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { localePath } from "@/lib/i18n-meta";

// Short labels stay the same in every language; each language's own name is read aloud.
const languages: Record<Locale, { short: string; name: string }> = {
  ka: { short: "ქა", name: "ქართული" },
  en: { short: "EN", name: "English" },
  ru: { short: "RU", name: "Русский" },
};

/**
 * Links to the same page in the other languages. The URL alone decides the language.
 * landmark={false} for a second copy on the same page (the footer), so screen readers don't list
 * two identical "Language" navigation regions.
 */
export default function LanguageSwitch({
  className = "",
  linkClassName = "",
  landmark = true,
}: {
  className?: string;
  linkClassName?: string;
  landmark?: boolean;
}) {
  const t = useTranslations("common");
  const current = useLocale();
  // Without the language prefix, e.g. "/privacy" on /en/privacy.
  const pathname = usePathname();

  const Wrapper = landmark ? "nav" : "div";
  return (
    <Wrapper aria-label={t("language")} role={landmark ? undefined : "group"} className={className}>
      <ul className="flex items-center">
        {routing.locales.map((l) => (
          <li key={l}>
            {/* Plain next/link with the final URL: next-intl's Link would send Georgian through "/ka/...",
                which only redirects back to "/...". */}
            <Link
              href={localePath(l, pathname)}
              lang={l}
              hrefLang={l}
              aria-label={languages[l].name}
              aria-current={l === current ? "true" : undefined}
              // The current language stays underlined (see .ulink[aria-current] in globals.css).
              className={`ulink flex h-11 min-w-9 items-center justify-center px-1.5 font-medium uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current ${linkClassName}`}
            >
              <span className="ulink-text">{languages[l].short}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Wrapper>
  );
}
