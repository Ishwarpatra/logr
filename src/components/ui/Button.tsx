import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "accent" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

// Themed via the design system CSS variables (--ink, --paper, --user-accent, --muted).
const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-[var(--ink,#1a1a1a)] text-[var(--paper,#faf8f3)] border border-[var(--ink,#1a1a1a)] hover:opacity-88 disabled:opacity-40",
  accent:
    "bg-[var(--user-accent,#d85a30)] text-[var(--paper,#faf8f3)] border border-[var(--user-accent,#d85a30)] hover:opacity-92 disabled:opacity-40",
  secondary:
    "border border-[var(--rule-strong,rgba(26,26,26,0.28))] bg-transparent text-[var(--ink,#1a1a1a)] hover:bg-[var(--ink,#1a1a1a)] hover:text-[var(--paper,#faf8f3)] disabled:opacity-50",
  ghost:
    "text-[var(--muted,#6b6862)] hover:text-[var(--ink,#1a1a1a)] disabled:opacity-40",
  danger:
    "border border-[var(--user-accent,#d85a30)] text-[var(--user-accent,#d85a30)] hover:bg-[var(--user-accent,#d85a30)] hover:text-[var(--paper,#faf8f3)] disabled:opacity-50",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-[10.5px] tracking-[0.04em] gap-1.5",
  md: "h-10 px-4 text-[11.5px] tracking-[0.05em] gap-2",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, type = "button", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center font-mono transition-all outline-none focus-visible:ring-2 focus-visible:ring-[var(--user-accent,#d85a30)]/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    />
  );
});
