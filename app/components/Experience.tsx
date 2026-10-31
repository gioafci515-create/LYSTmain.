import { useTranslations } from "next-intl";
import Photo from "./Photo";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function Experience() {
  const t = useTranslations("experience");
  const sections = useTranslations("sections");
  const steps = t.raw("steps") as { title: string; body: string }[];
  return (
    <section id="experience" className="px-6 py-16 md:px-10 md:py-20 xl:px-20 xl:py-20">
      <div className="mx-auto max-w-[1760px]">
        <SectionHeading
          label={sections("experience")}
          lines={t.raw("headline") as string[]}
          breakClass="hidden xl:block"
          intro={t("intro")}
        />

        <Reveal variant="photo" className="mt-12">
          <Photo
            src="/images/experience-hd.jpg"
            label={t("photoAlt")}
            sizes="100vw"
            className="aspect-[342/192] w-full md:aspect-video xl:aspect-[1760/420]"
          />
        </Reveal>

        <ol className="mt-10 grid md:grid-cols-3 md:gap-x-6 xl:mt-12 xl:grid-cols-5">
          {steps.map((s, i) => (
            <li key={i}>
              <Reveal delay={i * 90} className="pb-6 md:pb-10">
                <div className="rule h-px w-full bg-[#e6dedb] md:bg-[#e8e9e7]" />
                <p className="mt-6 text-xs tracking-wide">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-5 text-xs font-medium uppercase tracking-[0.2em]">{s.title}</h3>
                <p className="mt-4 max-w-[260px] text-sm font-light leading-relaxed text-black/80 md:text-base">
                  {s.body}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
