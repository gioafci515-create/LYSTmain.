import ModalTrigger from "./modal/ModalTrigger";
import Photo from "./Photo";
import Reveal from "./Reveal";

export default function Consultation() {
  return (
    <section
      id="consultation"
      className="relative min-h-[844px] text-white md:min-h-[1024px] xl:h-[1080px] xl:min-h-0"
    >
      <Photo
        src="/images/consultation.jpg"
        label="Guests dancing on a beach at sunset beside a DJ booth"
        overlay="linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0) 65%)"
        className="absolute inset-0 bg-[position:40%_center] xl:bg-center"
      />

      <p className="relative z-10 px-6 pt-10 text-[11px] uppercase tracking-[0.2em] md:px-10 xl:px-20 xl:pt-[68px]">
        05 / Consultation
      </p>

      <Reveal className="absolute inset-x-0 bottom-0 z-10 px-6 pb-12 md:px-10 xl:px-20 xl:pb-20">
        <h2 className="text-[44px] font-light leading-[0.95] tracking-tight md:text-7xl xl:text-[112px] xl:leading-[0.92]">
          Your moment
          <br className="hidden xl:block" /> starts here.
        </h2>
        <p className="mt-6 max-w-[320px] text-base font-light leading-relaxed text-white/90 xl:max-w-[440px] xl:text-xl">
          Every extraordinary experience begins with a conversation.
        </p>
        <ModalTrigger
          action="booking"
          className="mt-8 flex h-14 w-full items-center justify-center gap-2 border border-white/80 text-[11px] uppercase tracking-[0.12em] transition-colors hover:bg-white hover:text-black xl:w-[280px]"
        >
          Book a consultation <span aria-hidden>&#8599;</span>
        </ModalTrigger>
      </Reveal>
    </section>
  );
}
