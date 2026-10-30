// Version and date shown at the top of /privacy and /terms.
// LEGAL REVIEW REQUIRED: these documents are drafts awaiting a lawyer (docs/legal/README.md).
// When the text changes: bump the version, set the date, and note the change in docs/legal/README.md.
export const LEGAL_VERSION = "1.0";
export const LEGAL_UPDATED = "2026-10-30";

export type Lang = "en" | "ka";

/** A paragraph, or a bullet list. */
export type Block = string | { list: string[] };

export type LegalDoc = {
  title: string;
  intro: string;
  sections: { heading: string; body: Block[] }[];
};

/** Interface words around the documents, per language. */
export const legalUi: Record<Lang, { language: string; version: string; updated: string; contact: string; address: string }> = {
  en: { language: "English", version: "Version", updated: "Last updated", contact: "Contact", address: "Tbilisi, Georgia" },
  ka: { language: "ქართული", version: "ვერსია", updated: "ბოლო განახლება", contact: "კონტაქტი", address: "თბილისი, საქართველო" },
};

export const formatLegalDate = (lang: Lang) =>
  new Intl.DateTimeFormat(lang === "ka" ? "ka-GE" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${LEGAL_UPDATED}T00:00:00Z`),
  );
