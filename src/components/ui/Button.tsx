import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "accent" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

// Themed via the active palette's CSS variables (with neutral fallbacks).
const VARIANTS: Record<Variant, string> = {
  // strong solid — mirrors the app's active chip (ink bg / bg-colored fg)
  primary:
    "bg-[var(--chip-bg,#1f1530)] text-[var(--chip-fg,#fff)] hover:opacity-90 disabled:opacity-50",
  accent:
    "bg-[var(--accent,#7a4ee0)] text-white hover:opacity-90 disabled:opacity-50",
  secondary:
    "border border-[var(--rule,#e4e4e7)] bg-[var(--card,#fff)] text-[var(--ink,#18181b)] hover:bg-[var(--card-hover,#f4f4f5)] disabled:opacity-50",
  ghost:
    "text-[var(--muted,#71717a)] hover:bg-[var(--card-hover,#f4f4f5)] hover:text-[var(--ink,#18181b)]",
  danger:
    "border border-red-300/60 bg-[var(--card,#fff)] text-red-600 hover:bg-red-50 disabled:opacity-50",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3.5 text-xs gap-1.5",
  md: "h-10 px-5 text-sm gap-2",
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
        "inline-flex items-center justify-center font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent,#7a4ee0)]/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    />
  );
});
