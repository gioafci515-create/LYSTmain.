import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { site, socialLabels, telHref, type SocialKey } from "@/lib/site";
import LanguageSwitch from "./LanguageSwitch";
import Reveal from "./Reveal";
import TopLink from "./TopLink";

// No href = plain text (e.g. the city). Details that aren't supplied yet are left out entirely:
// the public site never shows a placeholder.
type Item = { label: string; href?: string; external?: boolean };

const socialKeys = Object.keys(socialLabels) as SocialKey[];
const { email, phone, address } = site.contact;

const eyebrow = "text-xs uppercase tracking-[0.2em] text-black/60";
const linkClass =
  "ulink inline-flex min-h-9 items-center gap-1.5 text-[15px] font-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current";

function FooterLink({ label, href, external, newTab }: Item & { newTab: string }) {
  if (!href) {
    return <span className="flex min-h-9 items-center text-[15px] font-light">{label}</span>;
  }
  // Pages of this site keep the visitor's language.
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={linkClass}>
        <span className="ulink-text">{label}</span>
      </Link>
    );
  }
  return (
    <a href={href} {...(external && { target: "_blank", rel: "noopener noreferrer" })} className={linkClass}>
      <span className="ulink-text">{label}</span>
      {external && (
        <>
          <span aria-hidden className="text-xs">&#8599;</span>
          <span className="sr-only">{newTab}</span>
        </>
      )}
    </a>
  );
}

export default function Footer() {
  const t = useTranslations("footer");
  const common = useTranslations("common");

  const columns: { title: string; items: Item[]; className?: string }[] = [
    {
      title: t("contact"),
      className: "col-span-2 sm:col-span-1",
      items: [
        email && { label: email, href: `mailto:${email}` },
        phone && { label: phone, href: telHref(phone) },
        address && { label: t("address") },
      ].filter((i): i is Item => !!i),
    },
    {
      title: t("legal"),
      items: [
        { label: common("privacyPolicy"), href: "/privacy" },
        { label: common("terms"), href: "/terms" },
      ],
    },
    {
      title: t("follow"),
      items: socialKeys
        .filter((k) => site.social[k])
        .map((k) => ({ label: socialLabels[k], href: site.social[k], external: true })),
    },
  ].filter((c) => c.items.length > 0);

  return (
    <footer className="border-t border-[#e6dedb] px-6 pb-8 pt-14 md:px-10 md:pt-16 xl:px-20 xl:pt-20">
      <div className="mx-auto max-w-[1760px]">
        <div className="grid gap-12 xl:grid-cols-[1fr_auto] xl:gap-16">
          <Reveal>
            {/* Lockup: the wordmark, then "Invite Smarter." (never translated, so marked English). */}
            <div className="flex items-center gap-3">
              <TopLink className="inline-block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current">
                <Image src="/images/lyst-wordmark.png" alt="" width={78} height={29} className="h-auto w-[88px] brightness-0" />
              </TopLink>
              <p className="text-[22px] font-light leading-none">
                <span aria-hidden>&middot; </span>
                <span lang="en" className="tracking-tight">
                  {common("slogan")}
                </span>
              </p>
            </div>
            <p className="mt-6 max-w-[300px] text-base font-light leading-relaxed text-black/70">
              {t("tagline")}
            </p>
          </Reveal>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 md:gap-x-16 xl:gap-x-24">
            {columns.map((c, i) => (
              <Reveal key={c.title} delay={(i + 1) * 90} className={c.className}>
                <p className={eyebrow}>{c.title}</p>
                <ul className="mt-4">
                  {c.items.map((item) => (
                    <li key={item.label}>
                      <FooterLink {...item} newTab={common("newTab")} />
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal variant="fade" delay={450}>
          <div className="mt-16 flex items-center justify-between gap-6 border-t border-[#e6dedb] pt-4 text-xs font-medium uppercase tracking-[0.15em] text-black/60 xl:mt-24">
            <div className="flex flex-wrap items-center gap-x-6">
              <p>&copy; LYST</p>
              <Link
                href="/login"
                className="ulink flex h-11 items-center text-black/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
              >
                <span className="ulink-text">{t("clientLogin")}</span>
              </Link>
            </div>
            <LanguageSwitch landmark={false} className="-mr-1.5" linkClassName="text-xs tracking-[0.15em] text-black/70" />
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
