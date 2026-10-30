import Photo from "./Photo";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const items = [
  {
    title: "Bespoke invitations",
    body: "Unique designs that set the tone for your event, crafted around your story.",
    desktop: "/images/cap-1-hd.jpg",
    mobile: "/images/cap-1-hd.jpg",
    ratios: [2 / 3, 2 / 3],
    alt: "Phone showing a digital invitation on a stone table with olives",
  },
  {
    title: "Guest management",
    body: "Send, track and manage with ease, all in one place.",
    desktop: "/images/cap-2-hd.jpg",
    mobile: "/images/cap-2-m-hd.jpg",
    ratios: [3 / 4, 2 / 3],
    alt: "Guests mingling at an evening reception",
  },
  {
    title: "Interactive experiences",
    body: "Guest photos, voice messages, polls and more, for a more engaging event.",
    desktop: "/images/cap-3-hd.jpg",
    mobile: "/images/cap-3-m-hd.jpg",
    ratios: [3 / 4, 3 / 2],
    alt: "Friends laughing around a table by the sea",
  },
  {
    title: "Real-time updates",
    body: "Share changes, important details and last-minute information instantly.",
    desktop: "/images/cap-4-hd.jpg",
    mobile: "/images/cap-4-m-hd.jpg",
    ratios: [3 / 4, 4 / 3],
    alt: "Crowd at an outdoor festival at sunset",
  },
  {
    title: "Lasting memories",
    body: "A shared space to relive and keep the moments that matter.",
    desktop: "/images/cap-5-hd.jpg",
    mobile: "/images/cap-5-hd.jpg",
    ratios: [3 / 4, 3 / 4],
    alt: "Printed event photographs on a stone table",
  },
];

// ratios = [mobile photo, desktop photo] width/height. A photo wider than its card is
// height-limited, so it has to be fetched wider than the card itself to stay sharp.
const MOBILE_CARD = 342 / 456;
const DESKTOP_CARD = 2 / 3;
const widen = (photo: number, card: number) => Math.max(1, photo / card);

export default function Capabilities() {
  return (
    <section id="capabilities" className="px-6 py-16 md:px-10 md:py-20 xl:px-20 xl:py-20">
      <div className="mx-auto max-w-[1760px]">
        <SectionHeading
          label="03 / Capabilities"
          lines={["One invitation.", "More possibilities."]}
          intro="A more connected way to bring people together: before, during and after the event."
        />

        <ol className="mt-14 grid gap-12 md:grid-cols-2 md:gap-x-6 xl:grid-cols-5 xl:gap-x-6">
          {items.map((item, i) => {
            // Stagger across a row on wide screens; on phones each card reveals on its own.
            const delay = (i % 5) * 110;
            const m = widen(item.ratios[0], MOBILE_CARD);
            const d = widen(item.ratios[1], DESKTOP_CARD);
            return (
              <li key={item.title}>
                <Reveal variant="photo" delay={delay}>
                  <Photo
                    src={item.mobile}
                    label={item.alt}
                    sizes={`(min-width: 768px) ${Math.ceil(50 * m)}vw, ${Math.ceil(100 * m)}vw`}
                    className="aspect-[342/456] w-full xl:hidden"
                  />
                  <Photo
                    src={item.desktop}
                    label={item.alt}
                    sizes={`${Math.ceil(18 * d)}vw`}
                    className="hidden aspect-[2/3] w-full xl:block"
                  />
                </Reveal>
                <Reveal delay={delay + 200}>
                  <p className="mt-9 text-xs tracking-wide">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-5 text-xs font-medium uppercase tracking-[0.2em]">{item.title}</h3>
                  <div className="rule mt-4 h-px w-10 bg-[#e8e9e7]" />
                  <p className="mt-5 max-w-[340px] text-sm font-light leading-relaxed text-black/80 md:text-base">
                    {item.body}
                  </p>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
