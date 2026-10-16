import Photo from "./Photo";
import Reveal from "./Reveal";

const features = [
  {
    index: "01",
    title: "Bespoke design",
    body: "Every invitation is a custom creation, thoughtfully designed around your story, your people and your occasion.",
  },
  {
    index: "02",
    title: "Connected experience",
    body: "From the first impression to the final memory, we bring your event to life through a seamless digital experience.",
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
        <Reveal>
          <p className="mb-6 text-[11px] uppercase tracking-[0.2em] md:hidden">
            02 / About
          </p>
          <div className="md:flex md:items-start md:justify-between">
            <h2 className="text-[40px] font-light leading-[1.05] tracking-tight md:text-[56px]">
              More than
              <br />
              an invitation.
            </h2>
            <p className="mt-8 max-w-[300px] text-base font-light leading-relaxed text-black/80 md:mt-10 md:text-sm">
              We create bespoke digital invitations and connected event
              experiences for life&apos;s most meaningful moments.
            </p>
          </div>
        </Reveal>

        {/* Desktop: two photos side by side, captions underneath */}
        <Reveal className="mt-16 hidden md:block" delay={100}>
          <div className="grid gap-3 md:grid-cols-[2fr_1fr]">
            <div className="overflow-hidden">
              <Photo
                src="/images/about-table.jpg"
                label={tableAlt}
                className="h-[393px] transition-transform duration-[1200ms] ease-out hover:scale-105 xl:h-[560px]"
              />
            </div>
            <div className="overflow-hidden">
              <Photo
                src="/images/about-window.jpg"
                label={windowAlt}
                className="h-[393px] transition-transform duration-[1200ms] ease-out hover:scale-105 xl:h-[560px]"
              />
            </div>
          </div>
          <div className="mt-10 grid gap-x-6 md:grid-cols-2">
            {features.map((f) => (
              <Feature key={f.index} {...f} />
            ))}
          </div>
        </Reveal>

        {/* Mobile: image + caption pairs stacked */}
        <div className="mt-10 space-y-12 md:hidden">
          <Reveal>
            <Photo src="/images/about-table.jpg" label={tableAlt} className="h-[222px] w-full" />
            <div className="mt-8">
              <Feature {...features[0]} />
            </div>
          </Reveal>
          <Reveal>
            <Photo src="/images/about-window.jpg" label={windowAlt} className="h-[392px] w-full" />
            <div className="mt-8">
              <Feature {...features[1]} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
