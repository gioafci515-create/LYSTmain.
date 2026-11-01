"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import ModalTrigger from "./modal/ModalTrigger";
import TopLink from "./TopLink";

type Mode = "off" | "compact" | "expanded";

// Sections the island names while you scroll ("live activity"). Labels: sections.* in messages.
const SECTIONS = ["about", "capabilities", "experience", "consultation"] as const;

// Colours come from the island's tone (see .island in globals.css), so everything uses currentColor.
const pill =
  "island-pill flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-xs font-medium uppercase tracking-[0.14em] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current md:h-9 md:px-4";

function Wordmark({ tabIndex }: { tabIndex?: number }) {
  return (
    <TopLink tabIndex={tabIndex} className="flex min-h-6 shrink-0 items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current">
      <Image src="/images/lyst-wordmark.png" alt="" width={78} height={29} className="island-logo h-auto w-[50px] md:w-[56px]" />
    </TopLink>
  );
}

function Live({ label }: { label: string }) {
  if (!label) return null;
  return (
    <span className="flex min-w-0 items-center gap-2 text-xs uppercase tracking-[0.16em] opacity-70">
      <span aria-hidden className="island-dot h-1.5 w-1.5 shrink-0 rounded-full" />
      <span key={label} className="island-label truncate">
        {label}
      </span>
    </span>
  );
}

/**
 * Apple-style Dynamic Island header. Appears once the hero header scrolls away:
 * compact while you scroll down, expands when you scroll up, hover (mouse), tap, or tab into it.
 */
export default function DynamicIsland() {
  const t = useTranslations("nav");
  const sections = useTranslations("sections");
  const [past, setPast] = useState(false);
  const [scrollingUp, setScrollingUp] = useState(false);
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  const [tapped, setTapped] = useState(false);
  const [section, setSection] = useState<(typeof SECTIONS)[number] | null>(null);
  const [dark, setDark] = useState(false);

  // On once the hero's own header is fully above the screen.
  useEffect(() => {
    const header = document.getElementById("hero-header");
    if (!header) return;
    const io = new IntersectionObserver(([e]) => setPast(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(header);
    return () => io.disconnect();
  }, []);

  // Scroll direction, with a small dead zone so tiny jitters don't flip it.
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        if (Math.abs(y - last) < 8) return;
        setScrollingUp(y < last);
        setTapped(false);
        last = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Which section is in the middle of the screen.
  useEffect(() => {
    const els = SECTIONS.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const hit = SECTIONS.find((id) => id === e.target.id);
          if (hit) setSection(hit);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Light text over dark sections (sections marked data-tone="dark"), dark text everywhere else.
  // Only the strip at the top of the screen matters: that is where the island sits.
  useEffect(() => {
    const darks = [...document.querySelectorAll<HTMLElement>('[data-tone="dark"]')];
    const under = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) under.add(e.target);
          else under.delete(e.target);
        }
        setDark(under.size > 0);
      },
      { rootMargin: "0px 0px -90% 0px" },
    );
    darks.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const mode: Mode = !past ? "off" : scrollingUp || hover || focused || tapped ? "expanded" : "compact";
  const off = mode === "off";
  const label = section ? sections(section) : "";

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center pt-[max(10px,env(safe-area-inset-top))]">
      <nav
        aria-label={t("quickNavigation")}
        aria-hidden={off}
        inert={off}
        data-mode={mode}
        data-tone={dark ? "dark" : "light"}
        className="island pointer-events-auto relative overflow-hidden rounded-full"
        onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setHover(false)}
        // Only keyboard focus opens it. A tap also focuses the link, and expanding mid-tap
        // would move the link out from under the finger before the click lands.
        onFocus={(e) => (e.target as HTMLElement).matches(":focus-visible") && setFocused(true)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setFocused(false)}
        onClick={(e) => {
          // Tapping the island itself (not a link or button) toggles it, like on iPhone.
          if (!(e.target as HTMLElement).closest("a, button")) setTapped((t) => !t);
        }}
      >
        {/* Compact: a mouse/touch shortcut only. Keyboard and screen readers use the full menu
            below, which opens as soon as it takes focus. */}
        <div className="island-layer justify-between pl-4 pr-2 md:pl-5" data-on={mode === "compact"} aria-hidden>
          <Wordmark tabIndex={-1} />
          <span className="hidden min-w-0 md:block">
            <Live label={label} />
          </span>
          <ModalTrigger className={pill} tabIndex={-1}>
            {t("ctaShort")} <span aria-hidden>&#8599;</span>
          </ModalTrigger>
        </div>

        {/* Expanded */}
        <div className="island-layer gap-3 pl-4 pr-2 md:gap-4 md:pl-6 md:pr-2.5" data-on={mode === "expanded"}>
          <Wordmark />
          <Live label={label} />
          <span className="flex-1" />
          <ModalTrigger className={pill}>
            <span className="md:hidden">{t("ctaShort")}</span>
            <span className="hidden md:inline">{t("cta")}</span>
            <span aria-hidden>&#8599;</span>
          </ModalTrigger>
        </div>
      </nav>
    </div>
  );
}
