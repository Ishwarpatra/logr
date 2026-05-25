import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "accent" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "btn-v-primary",
  accent: "btn-v-accent",
  secondary: "btn-v-secondary",
  ghost: "btn-v-ghost",
  danger: "btn-v-danger",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-[10.5px] tracking-[0.04em] gap-1.5",
  md: "h-10 px-4 text-[11.5px] tracking-[0.05em] gap-2",
  lg: "py-[14px] px-[22px] text-[13px] tracking-[0.06em] gap-3.5",
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
        "inline-flex items-center justify-center font-mono transition-all outline-none focus-visible:ring-2 cursor-pointer active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    />
  );
});
