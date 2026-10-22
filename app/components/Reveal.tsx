"use client";

import { useEffect, useRef } from "react";

/** Adds .is-visible to the element once it scrolls into view (or right away if `immediate`). */
export function useReveal<T extends HTMLElement>(immediate = false) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = () => el.classList.add("is-visible");

    // Reduced motion still reveals on scroll; the CSS drops the movement and keeps a soft fade.
    if (immediate || typeof IntersectionObserver === "undefined") {
      const raf = requestAnimationFrame(show);
      return () => cancelAnimationFrame(raf);
    }
    // Small bottom margin so items at the very end of the page still trigger.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -24px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [immediate]);

  return ref;
}

// Text and blocks never fade in on scroll (CLAUDE.md, design rules): "up" and "fade" stay put,
// only their divider lines (.rule) draw in. Headlines reveal through RevealText.
const VARIANTS = {
  up: "reveal",
  fade: "reveal",
  /** Photo: settles from a slight zoom, no fade. */
  photo: "reveal reveal-photo",
  /** Photo that is always visible (e.g. a section background): only the settle. */
  settle: "reveal-photo",
} as const;

export default function Reveal({
  children,
  delay = 0,
  className = "",
  variant = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  variant?: keyof typeof VARIANTS;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`${VARIANTS[variant]} ${className}`}
      style={{ "--d": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
