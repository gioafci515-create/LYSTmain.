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
  const [session, setSession] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  const openBooking = useCallback(() => {
    setSession((s) => s + 1);
    setOpen(true);
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

  const api = useMemo<ModalApi>(() => ({ openBooking }), [openBooking]);

  const close = () => dialogRef.current?.close();

  return (
    <ModalContext.Provider value={api}>
      {children}
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        className="m-auto h-dvh max-h-dvh w-full max-w-none overflow-y-auto bg-[#f6f5f1] p-6 text-black backdrop:bg-black/50 md:h-auto md:max-h-[calc(100dvh-48px)] md:max-w-[640px] md:p-12"
      >
        {open && <BookingFlow key={session} titleId={titleId} onClose={close} />}
      </dialog>
    </ModalContext.Provider>
  );
}
