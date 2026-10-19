"use client";

import { createElement, Fragment } from "react";
import { useReveal } from "./Reveal";

/**
 * Heading whose words fade up softly, one after another.
 * Works with natural wrapping on any screen width. `breakClass` controls the
 * forced line breaks between `lines` (e.g. "hidden xl:block" = desktop only).
 */
export default function RevealText({
  as = "h2",
  lines,
  className = "",
  breakClass = "",
  delay = 0,
  stagger = 40,
  immediate = false,
}: {
  as?: "h1" | "h2" | "h3" | "p";
  lines: string[];
  className?: string;
  breakClass?: string;
  delay?: number;
  stagger?: number;
  immediate?: boolean;
}) {
  const ref = useReveal<HTMLHeadingElement>(immediate);
  let i = 0;

  const content = lines.map((line, li) => (
    <Fragment key={li}>
      {li > 0 && (
        <>
          {" "}
          <br className={breakClass} />
        </>
      )}
      {line.split(" ").map((word, wi) => (
        <Fragment key={wi}>
          {wi > 0 && " "}
          <span className="rw">
            <span style={{ "--i": i++ } as React.CSSProperties}>{word}</span>
          </span>
        </Fragment>
      ))}
    </Fragment>
  ));

  return createElement(
    as,
    {
      ref,
      className: `reveal-text ${className}`,
      style: { "--d": `${delay}ms`, "--stagger": `${stagger}ms` } as React.CSSProperties,
    },
    content,
  );
}
