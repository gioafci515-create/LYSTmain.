"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

/**
 * Logo link. On the home page it glides back to the top instead of reloading;
 * from any other page it is a normal link home.
 */
export default function TopLink({
  children,
  className,
  tabIndex,
}: {
  children: React.ReactNode;
  className?: string;
  tabIndex?: number;
}) {
  const t = useTranslations("common");
  // Without the language prefix: "/" is the home page in every language.
  const pathname = usePathname();

  return (
    <Link
      href="/"
      aria-label={t("backToTop")}
      tabIndex={tabIndex}
      className={className}
      onClick={(e) => {
        if (pathname !== "/" || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        // Keyboard users land on the hero logo instead of losing focus when the island hides.
        document.querySelector<HTMLElement>("#hero-header a")?.focus({ preventScroll: true });
      }}
    >
      {children}
    </Link>
  );
}
