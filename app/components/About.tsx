import Photo from "./Photo";
import Reveal from "./Reveal";
import RevealText from "./RevealText";

const features = [
  {
    index: "01",
    title: "Bespoke design",
    body: "Every invitation is a custom creation, thoughtfully designed around your story, your people and your occasion.",
  },
  {
    index: "02",
    title: "Connected experience",
    // COPY PENDING OWNER APPROVAL (2026-10-22). Was: "From the first impression to the final memory,
    // we bring your event to life through a seamless digital experience."
    body: "Invitations, guest responses and every detail of your event, kept together in one place.",
  },
];

function Feature({ index, title, body }: (typeof features)[number]) {
  return (
    <div>
      <p className="text-[10px] tracking-wide">{index}</p>
      <h3 className="mt-5 text-[11px] font-medium uppercase tracking-[0.2em]">
        {title}
      </h3>
      <p className="mt-4 max-w-[320px] text-base font-light leading-relaxed text-black/80">
        {body}
      </p>
    </div>
  );
}

const tableAlt = "Linen-covered table with olive branches, wine glass and lemons";
const windowAlt = "Stone interior with a vase and olive branches by a tall window";

export default function About() {
  return (
    <section id="about" className="px-6 py-16 md:px-10 md:py-20 xl:px-20">
      <div className="mx-auto max-w-[1760px]">
        <Reveal variant="fade">
          <p className="mb-6 text-[11px] uppercase tracking-[0.2em] md:hidden">02 / About</p>
        </Reveal>
        <div className="md:flex md:items-start md:justify-between">
          <RevealText
            lines={["More than", "an invitation."]}
            className="text-[40px] font-light leading-[1.05] tracking-tight md:text-[56px]"
          />
          <Reveal delay={250} className="mt-8 md:mt-10">
            <p className="max-w-[300px] text-base font-light leading-relaxed text-black/80 md:text-sm">
              We create bespoke digital invitations and connected event
              experiences for life&apos;s most meaningful moments.
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
