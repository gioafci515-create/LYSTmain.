"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useId, useRef, useState } from "react";
import { site, telHref } from "@/lib/site";
import { useModal } from "./modal/ModalProvider";
import { NAV_ITEMS } from "./nav";

const { email, phone } = site.contact;

const textLink =
  "ulink flex h-11 items-center text-[13px] font-medium uppercase focus-visible:outline-2 focus-visible:outline-offset-4";

/**
 * Phones and tablets: the header's links in a full-screen sheet, with the call to action.
 * A native modal dialog: Escape closes it, the page behind is inert, and focus returns to "Menu".
 */
export default function HeaderMenu({ className = "" }: { className?: string }) {
  const t = useTranslations("nav");
  const common = useTranslations("common");
  const footer = useTranslations("footer");
  const modal = useModal();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const id = useId();

  const show = () => {
    dialogRef.current?.showModal();
    document.documentElement.style.overflow = "hidden";
    setOpen(true);
  };
  // The page scrolls again before a section link's jump, not after the dialog's close event.
  const close = () => {
    document.documentElement.style.overflow = "";
    dialogRef.current?.close();
  };

  return (
    <>
      <button
        type="button"
        onClick={show}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={id}
        className={`${textLink} ${className}`}
      >
        <span className="ulink-text">{t("menu")}</span>
      </button>

      <dialog
        ref={dialogRef}
        id={id}
        aria-label={t("menu")}
        onClose={() => {
          document.documentElement.style.overflow = "";
          setOpen(false);
        }}
        className="m-0 h-dvh max-h-dvh w-full max-w-none overflow-y-auto bg-[#f6f5f1] p-0 text-black"
      >
        <div className="flex min-h-full flex-col px-6 pb-[max(32px,env(safe-area-inset-bottom))] md:px-10">
          <div className="flex h-24 shrink-0 items-center justify-between md:h-[84px]">
            <Image src="/images/lyst-wordmark.png" alt="LYST" width={78} height={29} className="h-auto w-[78px] brightness-0" />
            <button type="button" onClick={close} className={`${textLink} focus-visible:outline-black`}>
              <span className="ulink-text">{common("close")}</span>
            </button>
          </div>

          <nav aria-label={t("main")} className="mt-4">
            <ol className="border-t border-black/15">
              {NAV_ITEMS.map((item, i) => (
                <li key={item.key} className="border-b border-black/15">
                  <a
                    href={item.href}
                    onClick={close}
                    className="ulink flex items-baseline gap-5 py-6 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-black"
                  >
                    <span className="w-6 shrink-0 text-xs tracking-wide text-black/60">{String(i + 1).padStart(2, "0")}</span>
                    {/* Scales down on narrow phones: long Georgian words (შესაძლებლობები) must fit on one line. */}
                    <span className="ulink-text text-[clamp(24px,7.5vw,32px)] font-light leading-none tracking-tight">{t(item.key)}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <button
            type="button"
            onClick={() => {
              close();
              modal.openBooking();
            }}
            className="mt-10 flex h-14 w-full shrink-0 items-center justify-center gap-2 border border-black bg-black text-xs uppercase tracking-[0.12em] text-white transition-colors duration-300 hover:bg-transparent hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            {t("cta")} <span aria-hidden>&#8599;</span>
          </button>

          {(email || phone) && (
            <div className="mt-auto pt-12">
              <p className="text-xs uppercase tracking-[0.2em] text-black/60">{footer("contact")}</p>
              <ul className="mt-3">
                {email && (
                  <li>
                    <a href={`mailto:${email}`} className="ulink inline-flex min-h-9 items-center text-[15px] font-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black">
                      <span className="ulink-text">{email}</span>
                    </a>
                  </li>
                )}
                {phone && (
                  <li>
                    <a href={telHref(phone)} className="ulink inline-flex min-h-9 items-center text-[15px] font-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black">
                      <span className="ulink-text">{phone}</span>
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
