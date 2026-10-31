"use client";

import { useTranslations } from "next-intl";
import { useId } from "react";

const inputBase =
  "block w-full border bg-white px-4 text-base font-light placeholder:text-black/60 focus:border-black focus:outline-none focus:ring-1 focus:ring-black";

export function Field({
  label,
  required,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  multiline,
  autoComplete,
  maxLength,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  error?: string;
  multiline?: boolean;
  autoComplete?: string;
  /** Match the server's limit, so nothing is cut off silently after sending. */
  maxLength?: number;
}) {
  const t = useTranslations("form");
  const id = useId();
  const errId = `${id}-err`;
  const common = {
    id,
    value,
    placeholder,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errId : undefined,
    required,
    autoComplete,
    maxLength,
    className: `${inputBase} ${error ? "border-black" : "border-[#efe3dc]"}`,
  };

  return (
    <div>
      <label htmlFor={id} className="mb-3 block text-[13px] font-medium">
        {label} ({required ? t("required") : t("optional")})
      </label>
      {multiline ? (
        <textarea
          {...common}
          rows={3}
          onChange={(e) => onChange(e.target.value)}
          className={`${common.className} min-h-[88px] resize-y py-4`}
        />
      ) : (
        <input
          {...common}
          type={type}
          onChange={(e) => onChange(e.target.value)}
          className={`${common.className} h-14`}
        />
      )}
      {error && (
        <p id={errId} className="mt-2 text-[13px] font-medium">
          {t("error", { message: error })}
        </p>
      )}
    </div>
  );
}

export function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className="flex h-14 w-full items-center justify-center bg-[#201f1d] px-4 text-xs uppercase tracking-[0.15em] text-white transition-colors hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:border disabled:border-[#201f1d] disabled:bg-[#e7dfd4] disabled:text-[#201f1d] disabled:hover:bg-[#e7dfd4]"
    >
      {children}
    </button>
  );
}

export function TextButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className="mx-auto block px-2 py-3 text-xs uppercase tracking-[0.15em] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
    >
      {children}
    </button>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs uppercase tracking-[0.2em]">{children}</p>
  );
}

export function DemoNote({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mt-10 border-t border-[#efe3dc] pt-6">
      <p className="text-xs font-medium uppercase tracking-[0.15em]">
        {title}
      </p>
      {children && (
        <p className="mt-3 max-w-[520px] text-xs leading-relaxed text-black/80">
          {children}
        </p>
      )}
    </div>
  );
}

export function SummaryRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange?: () => void;
}) {
  const t = useTranslations("form");
  return (
    <div className="border-b border-[#efe3dc] py-5 first:pt-0">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium">{label}</p>
        {onChange && (
          <button
            type="button"
            onClick={onChange}
            aria-label={t("changeLabel", { item: label.toLowerCase() })}
            className="px-2 py-1 text-xs uppercase tracking-[0.15em] hover:underline focus-visible:outline-2 focus-visible:outline-black"
          >
            {t("change")}
          </button>
        )}
      </div>
      {/* Long emails or text without spaces wrap instead of pushing the dialog sideways. */}
      <p className="mt-3 whitespace-pre-wrap text-base font-light text-black/80 [overflow-wrap:anywhere]">{value}</p>
    </div>
  );
}
