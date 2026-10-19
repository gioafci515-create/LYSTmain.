import Reveal from "./Reveal";
import RevealText from "./RevealText";

export default function SectionHeading({
  label,
  lines,
  breakClass,
  intro,
}: {
  label: string;
  lines: string[];
  /** Classes for the forced breaks between lines, e.g. "hidden xl:block" for desktop-only breaks. */
  breakClass?: string;
  intro: string;
}) {
  return (
    <>
      <Reveal variant="fade">
        <p className="text-[11px] uppercase tracking-[0.2em]">{label}</p>
      </Reveal>
      <div className="mt-8 xl:flex xl:items-end xl:justify-between">
        <RevealText
          lines={lines}
          breakClass={breakClass}
          className="text-[34px] font-light leading-[1.05] tracking-tight md:text-5xl xl:text-[80px]"
        />
        <Reveal delay={250} className="mt-6 xl:mb-4 xl:mt-0">
          <p className="max-w-[360px] text-sm font-light leading-relaxed text-black/80 md:text-base xl:max-w-[350px]">
            {intro}
          </p>
        </Reveal>
      </div>
    </>
  );
}
