import type { ReactNode } from "react";

// Line icons for each layout — shared by the user-page picker and the dashboard.
export const LAYOUT_ICONS: Record<string, ReactNode> = {
  timeline: (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1">
      <line x1="5" y1="3" x2="5" y2="17" /><circle cx="5" cy="6" r="1.8" fill="currentColor" /><circle cx="5" cy="11" r="1.3" fill="currentColor" /><circle cx="5" cy="15" r="0.9" fill="currentColor" /><line x1="9" y1="6" x2="17" y2="6" /><line x1="9" y1="11" x2="15" y2="11" /><line x1="9" y1="15" x2="14" y2="15" />
    </svg>
  ),
  journal: (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1">
      <line x1="2" y1="5" x2="5" y2="5" /><line x1="7" y1="5" x2="17" y2="5" /><line x1="7" y1="7.5" x2="15" y2="7.5" /><line x1="2" y1="11" x2="5" y2="11" /><line x1="7" y1="11" x2="17" y2="11" /><line x1="7" y1="13.5" x2="14" y2="13.5" /><line x1="2" y1="17" x2="5" y2="17" /><line x1="7" y1="17" x2="16" y2="17" />
    </svg>
  ),
  magazine: (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1">
      <rect x="3" y="3" width="14" height="7" fill="currentColor" stroke="none" /><line x1="3" y1="12.5" x2="17" y2="12.5" strokeWidth="1.5" /><line x1="3" y1="15" x2="15" y2="15" /><line x1="3" y1="17" x2="13" y2="17" />
    </svg>
  ),
  terminal: (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1">
      <rect x="2.5" y="3.5" width="15" height="13" strokeDasharray="1 1" /><line x1="5" y1="8" x2="9" y2="8" /><line x1="5" y1="12" x2="15" y2="12" /><line x1="5" y1="14" x2="12" y2="14" />
    </svg>
  ),
  feed: (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1">
      <circle cx="4" cy="5" r="1.3" fill="currentColor" /><line x1="7" y1="5" x2="16" y2="5" /><circle cx="4" cy="10" r="1.3" fill="currentColor" /><line x1="7" y1="10" x2="16" y2="10" /><circle cx="4" cy="15" r="1.3" fill="currentColor" /><line x1="7" y1="15" x2="14" y2="15" />
    </svg>
  ),
  card: (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1">
      <rect x="3" y="3" width="14" height="6" rx="1" /><rect x="3" y="11" width="14" height="6" rx="1" />
    </svg>
  ),
  centered: (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1">
      <line x1="10" y1="3" x2="10" y2="17" /><rect x="2" y="5" width="6" height="3" fill="currentColor" stroke="none" /><rect x="12" y="11" width="6" height="3" fill="currentColor" stroke="none" />
    </svg>
  ),
  polaroid: (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1">
      <rect x="4" y="3" width="12" height="14" transform="rotate(-4 10 10)" /><rect x="6" y="5" width="8" height="6" transform="rotate(-4 10 10)" fill="currentColor" stroke="none" />
    </svg>
  ),
};
