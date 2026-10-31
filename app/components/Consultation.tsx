import { useTranslations } from "next-intl";
import { site } from "@/lib/site";
import ModalTrigger from "./modal/ModalTrigger";
import Photo from "./Photo";
import Reveal from "./Reveal";
import RevealText from "./RevealText";

export default function Consultation() {
  const t = useTranslations("consultation");
  const sections = useTranslations("sections");
  return (
    <section
      id="consultation"
      data-tone="dark"
      className="relative min-h-[844px] text-white md:min-h-[1024px] xl:h-[1080px] xl:min-h-0"
    >
      {/* Background photo settles from a slight zoom as the section arrives */}
      <Reveal variant="settle" className="absolute inset-0">
        <Photo
          src="/images/consultation-hd.jpg"
          label={t("photoAlt")}
          overlay="linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0) 65%)"
          className="absolute inset-0"
          imgClassName="object-[40%_center] xl:object-center"
          mobileSrc="/images/consultation-m-hd.jpg"
          // Phone crop is 1:2 in an 844px-tall box, so it needs at least 422px. Wide: 4:3 photo in a ~1080px-tall box.
          mobileSizes="(max-width: 421px) 422px, 100vw"
          sizes="(max-width: 1439px) 1440px, 100vw"
        />
      </Reveal>

      <Reveal variant="fade" className="relative z-10">
        <p className="px-6 pt-10 text-xs uppercase tracking-[0.2em] md:px-10 xl:px-20 xl:pt-[68px]">
          {sections("consultation")}
        </p>
      </Reveal>

      <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-12 md:px-10 xl:px-20 xl:pb-20">
        <RevealText
          lines={t.raw("headline") as string[]}
          breakClass="hidden xl:block"
          stagger={70}
          className="text-[44px] font-light leading-[0.95] tracking-tight md:text-7xl xl:text-[112px] xl:leading-[0.92]"
        />
        <Reveal delay={350}>
          <p className="mt-6 max-w-[320px] text-base font-light leading-relaxed text-white/90 xl:max-w-[440px] xl:text-xl">
            {t("intro")}
          </p>
        </Reveal>
        <Reveal delay={500}>
          <ModalTrigger className="mt-8 flex h-14 w-full items-center justify-center gap-2 glass-hover border border-white/80 text-xs uppercase tracking-[0.12em] xl:w-[280px]">
            {t("cta")} <span aria-hidden>&#8599;</span>
          </ModalTrigger>
          {/* The booking dialog needs JavaScript; without it, offer the same request by email. */}
          <noscript>
            <p className="mt-4 max-w-[440px] text-base font-light leading-relaxed text-white/90">
              {t.rich("noscript", {
                email: site.contact.email,
                link: (chunks) => (
                  <a href={`mailto:${site.contact.email}?subject=Consultation%20request`} className="underline underline-offset-4">
                    {chunks}
                  </a>
                ),
              })}
            </p>
          </noscript>
        </Reveal>
      </div>
    </section>
  );
}
