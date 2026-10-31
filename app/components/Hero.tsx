import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LanguageSwitch from "./LanguageSwitch";
import TopLink from "./TopLink";
import Photo from "./Photo";
import RevealText from "./RevealText";

const navLink =
  "ulink flex h-11 items-center text-[13px] font-medium uppercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

export default function Hero() {
  const t = useTranslations("hero");
  const nav = useTranslations("nav");
  return (
    // Never taller than the screen (min 480px), so the headline is on the first screen in phone landscape too.
    <section data-tone="dark" className="relative min-h-svh text-white md:h-[min(900px,100svh)] md:min-h-[480px]">
      <div className="absolute inset-0 overflow-hidden">
        <Photo
          src="/images/hero-hd.jpg"
          label={t("photoAlt")}
          className="hero-zoom absolute inset-0"
          mobileSrc="/images/hero-m-hd.jpg"
          // Phone crop is 0.56 wide per 1 tall: on tall screens it is drawn at 56% of the screen height.
          // Wide screens: the 900px-tall hero needs at least 1600px of a 16:9 photo.
          mobileSizes="(max-aspect-ratio: 14/25) 58vh, 100vw"
          sizes="(max-width: 1599px) 1600px, 100vw"
          priority
        />
      </div>

      {/* Legibility layers from Figma: content gradient + local navigation fade */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_45%,rgba(0,0,0,0.7)_100%)] md:bg-[linear-gradient(to_right,rgba(0,0,0,0.62)_0%,rgba(0,0,0,0.28)_45%,rgba(0,0,0,0)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[260px] bg-[linear-gradient(to_bottom,rgba(0,0,0,0.68)_0%,rgba(0,0,0,0.68)_60%,rgba(0,0,0,0)_100%)] md:h-[190px] md:bg-[linear-gradient(to_bottom,rgba(0,0,0,0.76)_0%,rgba(0,0,0,0)_100%)]"
      />

      <header id="hero-header" className="relative z-10 px-6 md:px-10 xl:px-20">
        <div className="flex h-24 items-center justify-between md:h-[84px]">
          <TopLink className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            <Image
              src="/images/lyst-wordmark.png"
              alt="LYST"
              width={78}
              height={29}
              loading="eager"
              className="h-auto w-[78px]"
            />
          </TopLink>

          <div className="flex items-center gap-4 md:gap-8">
          <LanguageSwitch linkClassName="text-[13px] focus-visible:outline-white" />
          <nav aria-label={nav("accountNav")} className="flex items-center">
            <div className="hidden items-center gap-8 md:flex">
              <Link href="/login" className={navLink}>
                <span className="ulink-text">{nav("logIn")}</span>
              </Link>
              <Link href="/signup" className={navLink}>
                <span className="ulink-text">{nav("signUp")}</span>
              </Link>
            </div>
            <div className="md:hidden">
              <Link href="/account" className={navLink}>
                <span className="ulink-text">{nav("account")}</span>
              </Link>
            </div>
          </nav>
          </div>
        </div>
      </header>

      <div id="main" className="absolute inset-x-0 bottom-0 z-10 px-6 pb-14 md:px-10 md:pb-[88px] xl:px-20">
        <RevealText
          as="h1"
          immediate
          delay={250}
          stagger={80}
          lines={t.raw("headline") as string[]}
          className="text-[44px] font-light leading-[0.95] tracking-tight md:text-[72px]"
        />
        <p
          className="fade-up mt-6 max-w-[300px] text-base font-light leading-relaxed text-white/90 md:max-w-[380px] md:text-lg"
          style={{ "--d": "650ms" } as React.CSSProperties}
        >
          {t("intro")}
        </p>
      </div>
    </section>
  );
}
