"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import AuthFlow, { type AuthView } from "./AuthFlow";
import BookingFlow, { type DemoState } from "./BookingFlow";

type Open = { kind: "booking" } | { kind: "auth"; view: AuthView } | null;

type ModalApi = {
  openBooking: () => void;
  openAuth: (view: AuthView) => void;
};

const ModalContext = createContext<ModalApi | null>(null);

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used inside <ModalProvider>");
  return ctx;
}

export default function ModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<Open>(null);
  const [session, setSession] = useState(0);
  const [demo, setDemo] = useState<DemoState>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  // ?demo=failure | ?demo=empty previews the error and empty booking states.
  const show = useCallback((next: Exclude<Open, null>) => {
    const d = new URLSearchParams(window.location.search).get("demo");
    setDemo(d === "failure" || d === "empty" ? d : null);
    setSession((s) => s + 1);
    setOpen(next);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    }
    if (!open) document.documentElement.style.overflow = "";
  }, [open]);

  const api = useMemo<ModalApi>(
    () => ({
      openBooking: () => show({ kind: "booking" }),
      openAuth: (view) => show({ kind: "auth", view }),
    }),
    [show],
  );

  const close = () => dialogRef.current?.close();

  return (
    <ModalContext.Provider value={api}>
      {children}
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={() => setOpen(null)}
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        className="m-auto h-dvh max-h-dvh w-full max-w-none overflow-y-auto bg-[#f6f5f1] p-6 text-black backdrop:bg-black/50 md:h-auto md:max-h-[calc(100dvh-48px)] md:max-w-[640px] md:p-12"
      >
        {open?.kind === "booking" && (
          <BookingFlow key={session} titleId={titleId} demo={demo} onClose={close} />
        )}
        {open?.kind === "auth" && (
          <AuthFlow key={session} titleId={titleId} initialView={open.view} onClose={close} />
        )}
      </dialog>
    </ModalContext.Provider>
  );
}
