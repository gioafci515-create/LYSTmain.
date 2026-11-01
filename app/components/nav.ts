// Header links, in order (labels: nav.* in messages). They point at today's home-page sections;
// phases 3-5 of docs/planning/SITE-V2.md swap in Work, How it works, Prices and Occasions as
// those sections are built. Never link a section that doesn't exist yet.
export const NAV_ITEMS = [
  { key: "about", href: "#about" },
  { key: "capabilities", href: "#capabilities" },
  { key: "experience", href: "#experience" },
] as const;
