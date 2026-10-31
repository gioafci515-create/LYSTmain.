// Version and date shown at the top of /privacy and /terms (in every language).
// LEGAL REVIEW REQUIRED: these documents are drafts awaiting a lawyer (docs/legal/README.md).
// When the text changes: bump the version, set the date, and note the change in docs/legal/README.md.
import type { Locale } from "@/i18n/routing";
import { formatDate } from "@/lib/intl";

export const LEGAL_VERSION = "1.0";
export const LEGAL_UPDATED = "2026-10-30";

/** A paragraph, or a bullet list. */
export type Block = string | { list: string[] };

export type LegalDoc = {
  title: string;
  intro: string;
  sections: { heading: string; body: Block[] }[];
};

export const formatLegalDate = (locale: Locale) => formatDate(locale, new Date(`${LEGAL_UPDATED}T00:00:00Z`));
