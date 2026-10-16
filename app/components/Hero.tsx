import Image from "next/image";
import ModalTrigger from "./modal/ModalTrigger";
import Photo from "./Photo";

function ConsultationButton({ className = "" }: { className?: string }) {
  return (
    <ModalTrigger
      action="booking"
      className={`flex items-center justify-center gap-2 border border-white text-xs font-medium uppercase tracking-[0.09em] text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${className}`}
    >
      Book a consultation <span aria-hidden>&#8599;</span>
    </ModalTrigger>
  );
}

const navLink =
  "flex h-11 items-center text-[13px] font-medium uppercase hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export default function Hero() {
  return (
    <section className="relative min-h-svh text-white md:h-[900px] md:min-h-0">
      <div className="absolute inset-0 overflow-hidden">
        <Photo
          src="/images/hero.jpg"
          label="Friends gathered around a dining table in a Mediterranean home"
          className="hero-zoom absolute inset-0 bg-[position:84%_center] md:bg-center"
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

      <header className="relative z-10 px-6 md:px-10 lg:px-16">
        <div className="flex h-24 items-center justify-between md:h-[84px]">
          <a
            href="#"
            aria-label="LYST — home"
            className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <Image
              src="/images/lyst-wordmark.png"
              alt="LYST"
              width={78}
              height={29}
              priority
              className="h-auto w-[78px]"
            />
          </a>

          <nav aria-label="Account" className="flex items-center">
            <div className="hidden items-center gap-8 md:flex">
              <ModalTrigger action="login" className={`${navLink} px-0`}>
                Log in
              </ModalTrigger>
              <ModalTrigger action="signup" className={`${navLink} px-0`}>
                Sign up
              </ModalTrigger>
            </div>
            <div className="md:hidden">
              <ModalTrigger action="account" className={navLink}>
                Account
              </ModalTrigger>
            </div>
            <div className="ml-10 hidden md:block">
              <ConsultationButton className="h-[58px] w-[280px]" />
            </div>
          </nav>
        </div>

        <div className="md:hidden">
          <ConsultationButton className="h-12 w-full" />
        </div>
      </header>

      <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-12 md:px-10 md:pb-[88px] lg:px-16">
        <h1
          className="fade-up text-[44px] font-light leading-[0.95] tracking-tight md:text-[72px]"
          style={{ "--d": "150ms" } as React.CSSProperties}
        >
          Beyond the
          <br />
          invitation.
        </h1>
        <p
          className="fade-up mt-6 max-w-[300px] text-base font-light leading-relaxed text-white/90 md:max-w-[380px] md:text-lg"
          style={{ "--d": "350ms" } as React.CSSProperties}
        >
          Bespoke digital invitations and connected event experiences.
        </p>
        <div className="fade-up" style={{ "--d": "550ms" } as React.CSSProperties}>
          <ConsultationButton className="mt-8 h-[50px] w-full md:w-[238px]" />
        </div>
      </div>
    </section>
  );
}
