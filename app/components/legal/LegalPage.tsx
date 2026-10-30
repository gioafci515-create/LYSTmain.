import Link from "next/link";
import { site, telHref } from "@/lib/site";
import { formatLegalDate, LEGAL_VERSION, legalUi, type Block, type Lang, type LegalDoc } from "@/lib/legal/meta";

const LANGS: Lang[] = ["en", "ka"];
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

/** A legal document in English and Georgian on one page, with the version and date of each. */
export default function LegalPage({
  docs,
  other,
}: {
  docs: Record<Lang, LegalDoc>;
  /** The companion document, linked at the end (Privacy <-> Terms). */
  other: { href: string; label: string };
}) {
  const { email, phone } = site.contact;
  return (
    <main className="mx-auto w-full max-w-[720px] px-6 pb-20 pt-6 md:pt-10">
      <div className="flex h-12 items-center justify-between">
        <Link href="/" className="text-2xl font-light tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black">
          LYST
        </Link>
        <Link href="/" className={navLink}>
          <span className="ulink-text">← Back to website</span>
        </Link>
      </div>

      <div id="main" className="mt-14 md:mt-20">
        <h1 className="text-[40px] font-light leading-[1.05] tracking-tight md:text-5xl">
          {docs.en.title}
          <span lang="ka" className="mt-3 block text-2xl md:text-3xl">
            {docs.ka.title}
          </span>
        </h1>
        <nav aria-label="Language" className="mt-8 flex gap-6">
          {LANGS.map((l) => (
            <a key={l} href={`#${l}`} lang={l} hrefLang={l} className={navLink}>
              <span className="ulink-text">{legalUi[l].language}</span>
            </a>
          ))}
        </nav>

        {LANGS.map((l, i) => {
          const doc = docs[l];
          const ui = legalUi[l];
          return (
            <article key={l} id={l} lang={l} className={`scroll-mt-6 ${i ? "mt-20 border-t border-[#e6dedb] pt-16" : "mt-12"}`}>
              <h2 className="text-3xl font-light tracking-tight">{doc.title}</h2>
              <p className="mt-3 text-xs uppercase tracking-[0.15em] text-black/60">
                {ui.version} {LEGAL_VERSION} · {ui.updated}: {formatLegalDate(l)}
              </p>
              <p className={`mt-8 ${text} md:text-lg`}>{doc.intro}</p>
              {doc.sections.map((s) => (
                <section key={s.heading} className="mt-10">
                  <h3 className="text-lg font-medium">{s.heading}</h3>
                  {s.body.map((block, j) => (
                    <Body key={j} block={block} />
                  ))}
                </section>
              ))}
              <section className="mt-10">
                <h3 className="text-lg font-medium">{ui.contact}</h3>
                <p className={`mt-4 ${text}`}>
                  LYST · {ui.address}
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
            </article>
          );
        })}

        <p className="mt-16 border-t border-[#e6dedb] pt-6">
          <Link href={other.href} className={navLink}>
            <span className="ulink-text">{other.label}</span>
          </Link>
        </p>
      </div>
    </main>
  );
}
