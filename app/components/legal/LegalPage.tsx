import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { formatLegalDate, LEGAL_VERSION, type Block, type LegalDoc } from "@/lib/legal/meta";
import { site, telHref } from "@/lib/site";
import LanguageSwitch from "../LanguageSwitch";

const text = "text-base font-light leading-relaxed text-black/80";
const navLink =
  "ulink flex h-11 items-center text-xs uppercase tracking-[0.14em] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

function Body({ block }: { block: Block }) {
  if (typeof block === "string") return <p className={`mt-4 ${text}`}>{block}</p>;
  return (
    <ul className={`mt-4 list-disc space-y-2 pl-5 marker:text-black/40 ${text}`}>
      {block.list.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

/** A legal document in the page's language, with its version, date and the "Georgian prevails" note. */
export default function LegalPage({
  doc,
  locale,
  other,
}: {
  doc: LegalDoc;
  locale: Locale;
  /** The companion document, linked at the end (Privacy <-> Terms). */
  other: { href: string; label: string };
}) {
  const t = useTranslations("legal");
  const common = useTranslations("common");
  const footer = useTranslations("footer");
  const { email, phone } = site.contact;
  return (
    <main className="mx-auto w-full max-w-[720px] px-6 pb-20 pt-6 md:pt-10">
      <div className="flex h-12 items-center justify-between">
        <Link href="/" className="text-2xl font-light tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black">
          LYST
        </Link>
        <Link href="/" className={navLink}>
          <span className="ulink-text">{common("backToWebsite")}</span>
        </Link>
      </div>

      <article id="main" className="mt-14 md:mt-20">
        <h1 className="text-[40px] font-light leading-[1.05] tracking-tight md:text-5xl">{doc.title}</h1>
        <p className="mt-4 text-xs uppercase tracking-[0.15em] text-black/60">
          {t("version")} {LEGAL_VERSION} · {t("updated")}: {formatLegalDate(locale)}
        </p>
        <LanguageSwitch className="mt-4 -ml-1.5" linkClassName="text-xs tracking-[0.14em]" />
        <p className="mt-6 border-l-2 border-black pl-4 text-sm font-light leading-relaxed text-black/80">{t("prevails")}</p>

        <p className={`mt-10 ${text} md:text-lg`}>{doc.intro}</p>
        {doc.sections.map((s) => (
          <section key={s.heading} className="mt-10">
            <h2 className="text-lg font-medium">{s.heading}</h2>
            {s.body.map((block, j) => (
              <Body key={j} block={block} />
            ))}
          </section>
        ))}
        <section className="mt-10">
          <h2 className="text-lg font-medium">{t("contact")}</h2>
          <p className={`mt-4 ${text}`}>
            LYST · {footer("address")}
            <br />
            <a href={`mailto:${email}`} className="underline underline-offset-4">
              {email}
            </a>
            {" · "}
            <a href={telHref(phone)} className="underline underline-offset-4">
              {phone}
            </a>
          </p>
        </section>

        <p className="mt-16 border-t border-[#e6dedb] pt-6">
          <Link href={other.href} className={navLink}>
            <span className="ulink-text">{other.label}</span>
          </Link>
        </p>
      </article>
    </main>
  );
}
