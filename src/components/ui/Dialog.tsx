"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import { useStyleVars } from "./StyleVars";

/** Accessible modal dialog: backdrop, Escape to close, body scroll-lock.
 *  Re-applies the theme vars (via context) since it renders in a portal. */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  const vars = useStyleVars();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      style={vars}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm sm:items-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "my-8 w-full max-w-lg overflow-hidden rounded-3xl border border-[var(--rule,#e4e4e7)] bg-[var(--card,#fff)] text-[var(--ink,#18181b)] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)]",
          "animate-[dialog-in_150ms_cubic-bezier(.2,.8,.2,1)]",
          className
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--rule,#e4e4e7)] px-6 py-4">
          <div>
            <h2
              className="text-lg font-semibold tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {title}
            </h2>
            {description && (
              <p className="mt-0.5 text-sm text-[var(--muted,#71717a)]">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="-mr-1.5 -mt-1 rounded-full p-2 text-[var(--muted,#71717a)] transition-colors hover:bg-[var(--card-hover,#f4f4f5)] hover:text-[var(--ink,#18181b)]"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>

        {footer && (
          <div className="flex justify-end gap-2 border-t border-[var(--rule,#e4e4e7)] bg-[var(--bg,#fafafa)]/40 px-6 py-4">
            {footer}
          </div>
        )}
      </div>

      <style>{`@keyframes dialog-in{from{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:none}}`}</style>
    </div>,
    document.body
  );
}
