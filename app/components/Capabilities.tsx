import Photo from "./Photo";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const items = [
  {
    title: "Bespoke invitations",
    body: "Unique designs that set the tone for your event, crafted around your story.",
    desktop: "/images/cap-1.jpg",
    mobile: "/images/cap-1.jpg",
    alt: "Phone showing a digital invitation on a stone table with olives",
  },
  {
    title: "Guest management",
    body: "Send, track and manage with ease, all in one place.",
    desktop: "/images/cap-2.jpg",
    mobile: "/images/cap-2-m.jpg",
    alt: "Guests mingling at an evening reception",
  },
  {
    title: "Interactive experiences",
    body: "Guest photos, voice messages, polls and more — for a more engaging event.",
    desktop: "/images/cap-3.jpg",
    mobile: "/images/cap-3-m.jpg",
    alt: "Friends laughing around a table by the sea",
  },
  {
    title: "Real-time updates",
    body: "Share changes, important details and last-minute information instantly.",
    desktop: "/images/cap-4.jpg",
    mobile: "/images/cap-4.jpg",
    alt: "Crowd at an outdoor festival at sunset",
  },
  {
    title: "Lasting memories",
    body: "A shared space to relive and keep the moments that matter.",
    desktop: "/images/cap-5.jpg",
    mobile: "/images/cap-5.jpg",
    alt: "Printed event photographs on a stone table",
  },
];

export default function Capabilities() {
  return (
    <section
      id="capabilities"
      className="px-6 py-16 md:px-10 md:py-20 xl:px-20 xl:py-20"
    >
      <div className="mx-auto max-w-[1760px]">
        <Reveal>
          <SectionHeading
            label="03 / Capabilities"
            intro="A more connected way to bring people together — before, during and after the event."
          >
            One invitation.
            <br />
            More possibilities.
          </SectionHeading>
        </Reveal>

        <ol className="mt-14 grid gap-12 md:grid-cols-2 md:gap-x-6 xl:grid-cols-5 xl:gap-x-6">
          {items.map((item, i) => (
            <li key={item.title}>
              <Reveal delay={(i % 5) * 90} className="group">
                <div className="overflow-hidden">
                  <Photo
                    src={item.mobile}
                    label={item.alt}
                    className="aspect-[342/456] w-full transition-transform duration-[900ms] ease-out group-hover:scale-105 xl:hidden"
                  />
                  <Photo
                    src={item.desktop}
                    label={item.alt}
                    className="hidden aspect-[2/3] w-full transition-transform duration-[900ms] ease-out group-hover:scale-105 xl:block"
                  />
                </div>
                <p className="mt-9 text-[10px] tracking-wide">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-5 text-[11px] font-medium uppercase tracking-[0.2em]">
                  {item.title}
                </h3>
                <div className="mt-4 h-px w-10 bg-[#e6cfd0] transition-all duration-500 group-hover:w-20" />
                <p className="mt-5 max-w-[340px] text-sm font-light leading-relaxed text-black/80 md:text-base">
                  {item.body}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
