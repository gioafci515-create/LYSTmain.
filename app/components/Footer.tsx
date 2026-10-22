import Image from "next/image";
import { site, socialLabels, type SocialKey } from "@/lib/site";
import Reveal from "./Reveal";
import TopLink from "./TopLink";

type Item = { label: string; href?: string; external?: boolean; note: string };

const socialKeys = Object.keys(socialLabels) as SocialKey[];

// Empty href = not supplied yet: shown muted with its "[... required]" note.
const columns: { title: string; items: Item[]; className?: string }[] = [
  {
    title: "Contact",
    className: "col-span-2 sm:col-span-1",
    items: [
      {
        label: site.contact.email || "Email",
        href: site.contact.email && `mailto:${site.contact.email}`,
        note: "[details required]",
      },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Privacy Policy", note: "[content required]" },
      { label: "Terms", note: "[content required]" },
    ],
  },
  {
    title: "Follow",
    items: socialKeys.map((k) => ({
      label: socialLabels[k],
      href: site.social[k],
      external: true,
      note: "[link required]",
    })),
  },
];

const eyebrow = "text-[11px] uppercase tracking-[0.2em] text-black/60";

function FooterLink({ label, href, external, note }: Item) {
  if (!href) {
    return (
      <span className="flex flex-col py-1.5 text-[15px] font-light text-black/60">
        {label}
        <span className="text-[11px]">{note}</span>
      </span>
    );
  }
  return (
    <a
      href={href}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      className="ulink inline-flex min-h-9 items-center gap-1.5 text-[15px] font-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
    >
      <span className="ulink-text">{label}</span>
      {external && <span aria-hidden className="text-xs">&#8599;</span>}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-[#e6dedb] px-6 pb-8 pt-14 md:px-10 md:pt-16 xl:px-20 xl:pt-20">
      <div className="mx-auto max-w-[1760px]">
        <div className="grid gap-12 xl:grid-cols-[1fr_auto] xl:gap-16">
          <Reveal>
            <TopLink className="inline-block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current">
              <Image src="/images/lyst-wordmark.png" alt="" width={78} height={29} className="h-auto w-[88px] brightness-0" />
            </TopLink>
            <p className="mt-6 max-w-[300px] text-base font-light leading-relaxed text-black/70">
              Bespoke digital invitations and connected event experiences.
            </p>
          </Reveal>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 md:gap-x-16 xl:gap-x-24">
            {columns.map((c, i) => (
              <Reveal key={c.title} delay={(i + 1) * 90} className={c.className}>
                <p className={eyebrow}>{c.title}</p>
                <ul className="mt-4">
                  {c.items.map((item) => (
                    <li key={item.label}>
                      <FooterLink {...item} />
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal variant="fade" delay={450}>
          <div className="mt-16 flex flex-col gap-2 border-t border-[#e6dedb] pt-6 text-[10px] font-medium uppercase tracking-[0.15em] text-black/55 md:flex-row md:justify-between xl:mt-24">
            <p>&copy; LYST</p>
            <p>Proposal: content approval required</p>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
