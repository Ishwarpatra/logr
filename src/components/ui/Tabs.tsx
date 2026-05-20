"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type TabItem = { value: string; label: string; icon?: ReactNode };

/** Segmented-control tab bar, themed by the active palette. */
export function Tabs({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: TabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-[var(--rule,#e4e4e7)] bg-[var(--card,#fff)]/60 p-1",
        className
      )}
    >
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.value)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent,#7a4ee0)]/25",
              active
                ? "bg-[var(--card,#fff)] text-[var(--ink,#18181b)] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.12)]"
                : "text-[var(--muted,#71717a)] hover:text-[var(--ink,#18181b)]"
            )}
          >
            <span className={active ? "text-[var(--accent,#7a4ee0)]" : undefined}>{t.icon}</span>
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
