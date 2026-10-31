import { useTranslations } from "next-intl";
import Photo from "./Photo";
import Reveal from "./Reveal";
import RevealText from "./RevealText";

type FeatureText = { index: string; title: string; body: string };

function Feature({ index, title, body }: FeatureText) {
  return (
    <div>
      <p className="text-xs tracking-wide">{index}</p>
      <h3 className="mt-5 text-xs font-medium uppercase tracking-[0.2em]">
        {title}
      </h3>
      <p className="mt-4 max-w-[320px] text-base font-light leading-relaxed text-black/80">
        {body}
      </p>
    </div>
  );
}

export default function About() {
  const t = useTranslations("about");
  const sections = useTranslations("sections");
  const features: FeatureText[] = (t.raw("features") as Omit<FeatureText, "index">[]).map((f, i) => ({
    ...f,
    index: String(i + 1).padStart(2, "0"),
  }));
  const tableAlt = t("tableAlt");
  const windowAlt = t("windowAlt");
  return (
    <section id="about" className="px-6 py-16 md:px-10 md:py-20 xl:px-20">
      <div className="mx-auto max-w-[1760px]">
        <Reveal variant="fade">
          <p className="mb-6 text-xs uppercase tracking-[0.2em] md:hidden">{sections("about")}</p>
        </Reveal>
        <div className="md:flex md:items-start md:justify-between">
          <RevealText
            lines={t.raw("headline") as string[]}
            className="text-[40px] font-light leading-[1.05] tracking-tight md:text-[56px]"
          />
          <Reveal delay={250} className="mt-8 md:mt-10">
            <p className="max-w-[300px] text-base font-light leading-relaxed text-black/80 md:text-sm">
              {t("intro")}
            </p>
          </Reveal>
        </div>

        {/* Desktop: two photos side by side, captions underneath */}
        <div className="mt-16 hidden gap-3 md:grid md:grid-cols-[2fr_1fr]">
          <Reveal variant="photo">
            <Photo src="/images/about-table-hd.jpg" label={tableAlt} sizes="(min-width: 1280px) 62vw, 560px" className="h-[393px] xl:h-[560px]" />
          </Reveal>
          <Reveal variant="photo" delay={150}>
            <Photo src="/images/about-window-hd.jpg" label={windowAlt} sizes="(min-width: 1280px) 33vw, 300px" className="h-[393px] xl:h-[560px]" />
          </Reveal>
        </div>
        <div className="mt-10 hidden gap-x-6 md:grid md:grid-cols-2">
          {features.map((f, i) => (
            <Reveal key={f.index} delay={i * 120}>
              <Feature {...f} />
            </Reveal>
          ))}
        </div>

        {/* Mobile: image + caption pairs stacked */}
        <div className="mt-10 space-y-12 md:hidden">
          <div>
            <Reveal variant="photo">
              <Photo src="/images/about-table-hd.jpg" label={tableAlt} className="h-[222px] w-full" />
            </Reveal>
            <Reveal className="mt-8">
              <Feature {...features[0]} />
            </Reveal>
          </div>
          <div>
            <Reveal variant="photo">
              <Photo src="/images/about-window-hd.jpg" label={windowAlt} className="h-[392px] w-full" />
            </Reveal>
            <Reveal className="mt-8">
              <Feature {...features[1]} />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
