import localFont from "next/font/local";

// Self-hosted fonts (SIL OFL; licences next to the files in app/fonts). Cyrillic and Georgian faces
// carry a unicode-range, so a page only downloads them when it shows those characters.
const interLatin = localFont({
  src: "../app/fonts/InterVariable-latin.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const interCyrillic = localFont({
  src: "../app/fonts/InterVariable-cyrillic.woff2",
  weight: "100 900",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116" }],
});

const notoGeorgian = localFont({
  src: "../app/fonts/NotoSansGeorgianVariable-georgian.woff2",
  weight: "100 900",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [
    { prop: "unicode-range", value: "U+0589,U+10A0-10FF,U+1C90-1CBA,U+1CBD-1CBF,U+205A,U+2D00-2D2F,U+2E31" },
  ],
});

const first = (family: string) => family.split(",")[0].trim();
const rest = (family: string) => family.split(",").slice(1).join(",").trim();

// All three real faces come before Inter's metric-matched fallback; otherwise the fallback
// (a local Arial) would draw Cyrillic and Georgian before our fonts got a chance.
export const fontStack = [
  first(interLatin.style.fontFamily),
  first(interCyrillic.style.fontFamily),
  first(notoGeorgian.style.fontFamily),
  rest(interLatin.style.fontFamily),
  "system-ui",
  "sans-serif",
]
  .filter(Boolean)
  .join(", ");

export const fontClassName = interLatin.variable;
