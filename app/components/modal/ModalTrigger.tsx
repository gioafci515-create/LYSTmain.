"use client";

import { useModal } from "./ModalProvider";

type Action = "booking" | "login" | "signup" | "account";

export default function ModalTrigger({
  action,
  className = "",
  children,
}: {
  action: Action;
  className?: string;
  children: React.ReactNode;
}) {
  const modal = useModal();
  return (
    <button
      type="button"
      className={className}
      onClick={() =>
        action === "booking" ? modal.openBooking() : modal.openAuth(action)
      }
    >
      {children}
    </button>
  );
}
