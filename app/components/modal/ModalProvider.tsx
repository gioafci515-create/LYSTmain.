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
import BookingFlow from "./BookingFlow";

type ModalApi = {
  openBooking: () => void;
};

const ModalContext = createContext<ModalApi | null>(null);

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used inside <ModalProvider>");
  return ctx;
}

export default function ModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  // The flow stays mounted after the first open, so closing the dialog by accident (Escape,
  // a click outside, Back) keeps the draft. It starts fresh only after a request was sent.
  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState(0);
  const sent = useRef(false);
  // True while the open dialog owns a history entry: Back then closes it instead of leaving the page.
  const ownsHistoryEntry = useRef(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  const openBooking = useCallback(() => {
    if (sent.current) {
      sent.current = false;
      setSession((s) => s + 1);
    }
    setMounted(true);
    setOpen(true);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
      window.history.pushState(null, "");
      ownsHistoryEntry.current = true;
    }
    if (!open) document.documentElement.style.overflow = "";
  }, [open]);

  useEffect(() => {
    const onBack = () => {
      if (!ownsHistoryEntry.current) return;
      ownsHistoryEntry.current = false;
      dialogRef.current?.close();
    };
    window.addEventListener("popstate", onBack);
    return () => window.removeEventListener("popstate", onBack);
  }, []);

  const api = useMemo<ModalApi>(() => ({ openBooking }), [openBooking]);

  const close = () => dialogRef.current?.close();

  const onDialogClose = () => {
    setOpen(false);
    // Closed some other way (Escape, Close, a click outside): remove the entry it added.
    if (ownsHistoryEntry.current) {
      ownsHistoryEntry.current = false;
      window.history.back();
    }
  };

  return (
    <ModalContext.Provider value={api}>
      {children}
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={onDialogClose}
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        className="m-auto h-dvh max-h-dvh w-full max-w-none overflow-y-auto bg-[#f6f5f1] p-6 text-black backdrop:bg-black/50 md:h-auto md:max-h-[calc(100dvh-48px)] md:max-w-[640px] md:p-12"
      >
        {mounted && (
          <BookingFlow key={session} titleId={titleId} onClose={close} onSent={() => (sent.current = true)} />
        )}
      </dialog>
    </ModalContext.Provider>
  );
}
