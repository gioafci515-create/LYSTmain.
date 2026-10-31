import { intlLocale, type Locale } from "@/i18n/routing";

// Chrome and Edge ship trimmed locale data without Georgian, so Intl falls back to English there
// ("November", "and"). Georgian names are spelled out here (CLDR forms, listed in
// docs/planning/copy-review.md); English and Russian use Intl. Dates are read in UTC.
const KA = {
  months: ["იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი", "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"],
  // Monday first, like the booking calendar.
  weekdays: ["ორშაბათი", "სამშაბათი", "ოთხშაბათი", "ხუთშაბათი", "პარასკევი", "შაბათი", "კვირა"],
  narrow: ["ო", "ს", "ო", "ხ", "პ", "შ", "კ"],
};

const mondayFirst = (d: Date) => (d.getUTCDay() + 6) % 7;

/** "1 November 2026", "1 ноября 2026 г.", "1 ნოემბერი, 2026"; optionally with the weekday first. */
export function formatDate(locale: Locale, date: Date, { weekday = false } = {}) {
  if (locale === "ka") {
    const d = `${date.getUTCDate()} ${KA.months[date.getUTCMonth()]}, ${date.getUTCFullYear()}`;
    return weekday ? `${KA.weekdays[mondayFirst(date)]}, ${d}` : d;
  }
  return new Intl.DateTimeFormat(intlLocale[locale], {
    ...(weekday && { weekday: "long" }),
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** The month on its own: "November", "ноябрь", "ნოემბერი". */
export function monthName(locale: Locale, date: Date) {
  if (locale === "ka") return KA.months[date.getUTCMonth()];
  return new Intl.DateTimeFormat(intlLocale[locale], { month: "long", timeZone: "UTC" }).format(date);
}

/** One-letter weekday names, Monday first. */
export function weekdaysNarrow(locale: Locale) {
  if (locale === "ka") return KA.narrow;
  const f = new Intl.DateTimeFormat(intlLocale[locale], { weekday: "narrow", timeZone: "UTC" });
  return Array.from({ length: 7 }, (_, i) => f.format(new Date(Date.UTC(2024, 0, 1 + i)))); // 1 Jan 2024 was a Monday
}

/** "Name and Email", "Имя и Эл. почта", "სახელი და ელფოსტა". */
export function joinList(locale: Locale, items: string[]) {
  if (locale !== "ka") return new Intl.ListFormat(intlLocale[locale], { type: "conjunction" }).format(items);
  return items.length < 2 ? (items[0] ?? "") : `${items.slice(0, -1).join(", ")} და ${items[items.length - 1]}`;
}
