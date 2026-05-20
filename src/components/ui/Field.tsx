import {
  forwardRef,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  type SelectHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

const base =
  "w-full rounded-xl border border-[var(--rule,#e4e4e7)] bg-[var(--card,#fff)] px-3.5 py-2.5 text-sm text-[var(--ink,#18181b)] outline-none transition-colors placeholder:text-[var(--muted,#a1a1aa)] focus:border-[var(--accent,#7a4ee0)] focus:ring-2 focus:ring-[var(--accent,#7a4ee0)]/15 disabled:opacity-50";

export function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-xs font-medium uppercase tracking-wide text-[var(--muted,#71717a)]"
    >
      {children}
    </label>
  );
}

export function Field({
  label,
  hint,
  className,
  children,
}: {
  label?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && <Label>{label}</Label>}
      {children}
      {hint && <p className="text-xs text-[var(--muted,#a1a1aa)]">{hint}</p>}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn(base, className)} {...props} />;
  }
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return <textarea ref={ref} className={cn(base, "resize-y leading-relaxed", className)} {...props} />;
  }
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...props }, ref) {
    return (
      <select ref={ref} className={cn(base, "cursor-pointer appearance-none pr-8", className)} {...props}>
        {children}
      </select>
    );
  }
);
