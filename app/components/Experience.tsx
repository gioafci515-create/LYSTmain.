import Photo from "./Photo";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const steps = [
  { title: "Invite", body: "A personal invitation, crafted for your event." },
  { title: "Respond", body: "Guests confirm their attendance." },
  { title: "Prepare", body: "Details, guidance and updates in one place." },
  { title: "Participate", body: "Shared moments and guest interaction." },
  { title: "Remember", body: "A lasting home for the memories." },
];

export default function Experience() {
  return (
    <section id="experience" className="px-6 py-16 md:px-10 md:py-20 xl:px-20 xl:py-20">
      <div className="mx-auto max-w-[1760px]">
        <SectionHeading
          label="04 / The experience"
          lines={["From the first invitation", "to the last memory."]}
          breakClass="hidden xl:block"
          // COPY PENDING OWNER APPROVAL (2026-10-22). Was: "One thoughtfully connected experience,
          // unfolding before, during and after your event."
          intro="The invitation, replies, updates and shared photos stay together, before, during and after your event."
        />

        <Reveal variant="photo" className="mt-12">
          <Photo
            src="/images/experience-hd.jpg"
            label="Friends laughing together on a terrace at sunset above a harbour"
            sizes="100vw"
            className="aspect-[342/192] w-full md:aspect-video xl:aspect-[1760/420]"
          />
        </Reveal>

        <ol className="mt-10 grid md:grid-cols-3 md:gap-x-6 xl:mt-12 xl:grid-cols-5">
          {steps.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={i * 90} className="pb-6 md:pb-10">
                <div className="rule h-px w-full bg-[#e6dedb] md:bg-[#e8e9e7]" />
                <p className="mt-6 text-[10px] tracking-wide">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-5 text-[11px] font-medium uppercase tracking-[0.2em]">{s.title}</h3>
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
