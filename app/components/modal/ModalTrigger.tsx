"use client";

import { useModal } from "./ModalProvider";

export default function ModalTrigger({
  className = "",
  children,
  tabIndex,
}: {
  className?: string;
  children: React.ReactNode;
  tabIndex?: number;
}) {
  const modal = useModal();
  return (
    <button type="button" className={className} tabIndex={tabIndex} onClick={() => modal.openBooking()}>
      {children}
    </button>
  );
}
