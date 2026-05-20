// Theme system ported from design/portfolio.jsx — the per-portfolio
// customization knobs. Drives CSS variables + data-* attributes.

export type Palette = {
  name: string;
  bg: string;
  card: string;
  cardHover: string;
  ink: string;
  muted: string;
  rule: string;
  accent: string;
  chipBg: string;
  chipFg: string;
  tagBg: string;
  tagFg: string;
};

export const PALETTES: Record<string, Palette> = {
  paper: { name: "Paper", bg: "#f5f2eb", card: "#fbf9f4", cardHover: "#ebe7dc", ink: "#1a1815", muted: "#7a766b", rule: "#dad4c4", accent: "#c5532f", chipBg: "#1a1815", chipFg: "#f5f2eb", tagBg: "#ebe7dc", tagFg: "#3a382f" },
  ink: { name: "Ink", bg: "#0d0d10", card: "#16161b", cardHover: "#1f1f25", ink: "#ececea", muted: "#8b8b85", rule: "#272730", accent: "#e8b340", chipBg: "#ececea", chipFg: "#0d0d10", tagBg: "#1f1f25", tagFg: "#bcbcb6" },
  arctic: { name: "Arctic", bg: "#fafafa", card: "#ffffff", cardHover: "#f1f1f0", ink: "#111111", muted: "#6f6f6f", rule: "#e8e8e6", accent: "#2d4cf5", chipBg: "#111111", chipFg: "#ffffff", tagBg: "#f1f1f0", tagFg: "#363636" },
  citrus: { name: "Citrus", bg: "#fef9ec", card: "#fffdf5", cardHover: "#f7efd2", ink: "#1c1a12", muted: "#7a755e", rule: "#ecd9a4", accent: "#d8631f", chipBg: "#1c1a12", chipFg: "#fef9ec", tagBg: "#f7efd2", tagFg: "#3d2e0c" },
  forest: { name: "Forest", bg: "#eef1ea", card: "#f6f8f1", cardHover: "#e1e7d8", ink: "#15201a", muted: "#5a6957", rule: "#c9d3bc", accent: "#3e6b4a", chipBg: "#15201a", chipFg: "#eef1ea", tagBg: "#e1e7d8", tagFg: "#293a2d" },
  sunset: { name: "Sunset", bg: "#fef3ec", card: "#fffaf4", cardHover: "#fde2cd", ink: "#2a1810", muted: "#9c7864", rule: "#f4ccae", accent: "#e25a3c", chipBg: "#2a1810", chipFg: "#fef3ec", tagBg: "#fde2cd", tagFg: "#5a2a14" },
  lavender: { name: "Lavender", bg: "#f5f2fb", card: "#fbfaff", cardHover: "#ebe5f8", ink: "#1f1530", muted: "#7a6e95", rule: "#dad0ed", accent: "#7a4ee0", chipBg: "#1f1530", chipFg: "#f5f2fb", tagBg: "#ebe5f8", tagFg: "#3a2860" },
  mono: { name: "Mono", bg: "#fafaf9", card: "#ffffff", cardHover: "#eeeeec", ink: "#0d0d0c", muted: "#7a7a76", rule: "#e0e0dd", accent: "#0d0d0c", chipBg: "#0d0d0c", chipFg: "#fafaf9", tagBg: "#eeeeec", tagFg: "#2a2a28" },
  ocean: { name: "Ocean", bg: "#eef4f7", card: "#f6fafc", cardHover: "#dde9f0", ink: "#0e1d2a", muted: "#5b7286", rule: "#c5d6e0", accent: "#1a73c4", chipBg: "#0e1d2a", chipFg: "#eef4f7", tagBg: "#dde9f0", tagFg: "#1f3a4f" },
};

export type FontPair = {
  name: string;
  display: string;
  body: string;
  mono: string;
  displayWeight: number;
  bodyWeight: number;
};

export const FONT_PAIRS: Record<string, FontPair> = {
  modern: { name: "Modern (Geist)", display: '"Geist", "Inter Tight", system-ui, sans-serif', body: '"Geist", "Inter Tight", system-ui, sans-serif', mono: '"Geist Mono", ui-monospace, monospace', displayWeight: 600, bodyWeight: 400 },
  friendly: { name: "Friendly (Outfit)", display: '"Outfit", system-ui, sans-serif', body: '"Outfit", system-ui, sans-serif', mono: '"Geist Mono", ui-monospace, monospace', displayWeight: 600, bodyWeight: 400 },
  expressive: { name: "Expressive (Bricolage)", display: '"Bricolage Grotesque", "Inter Tight", system-ui, sans-serif', body: '"Inter Tight", system-ui, sans-serif', mono: '"Geist Mono", ui-monospace, monospace', displayWeight: 600, bodyWeight: 400 },
  classic: { name: "Classic (Inter)", display: '"Inter Tight", system-ui, sans-serif', body: '"Inter Tight", system-ui, sans-serif', mono: '"Geist Mono", ui-monospace, monospace', displayWeight: 600, bodyWeight: 400 },
};

export type PostStyle = "feed" | "card" | "centered" | "terminal" | "polaroid" | "magazine";
export type DotStyle = "circle" | "square" | "icon";
export type PhotoHover = "lift" | "zoom" | "none";

export type Theme = {
  palette: string;
  fonts: string;
  rounded: boolean;
  accentOverride: string | null;
  postStyle: PostStyle;
  dotStyle: DotStyle;
  photoHover: PhotoHover;
  dark: boolean;
};

// logr default — lavender palette, feed layout (the prototype used magazine).
export const DEFAULT_THEME: Theme = {
  palette: "lavender",
  fonts: "expressive",
  rounded: true,
  accentOverride: "#c5532f",
  postStyle: "feed",
  dotStyle: "circle",
  photoHover: "zoom",
  dark: false,
};

export const ACCENT_SWATCHES = [
  "#c5532f", "#2d4cf5", "#e8b340", "#3e6b4a", "#d8631f", "#7a4ee0", "#1a73c4", "#e25a3c", "#0d0d0c",
];

export type TagKey = "all" | "work" | "milestone" | "talk" | "side_quest" | "writing";

export const TAG_META: Record<string, { label: string; emoji: string }> = {
  all: { label: "All", emoji: "✦" },
  work: { label: "Work", emoji: "⚒" },
  milestone: { label: "Milestone", emoji: "★" },
  talk: { label: "Talk", emoji: "◉" },
  side_quest: { label: "Side quest", emoji: "✺" },
  writing: { label: "Writing", emoji: "✎" },
};

/** Resolve the active palette, applying dark-mode and accent override. */
export function resolvePalette(theme: Theme): Palette {
  const light = PALETTES[theme.palette] ?? PALETTES.paper;
  const base = theme.dark
    ? { ...PALETTES.ink, accent: theme.accentOverride || light.accent }
    : light;
  return { ...base, accent: theme.accentOverride || base.accent };
}

/** Build the CSS custom properties that the stylesheet consumes. */
export function themeCssVars(theme: Theme): Record<string, string> {
  const p = resolvePalette(theme);
  const f = FONT_PAIRS[theme.fonts] ?? FONT_PAIRS.modern;
  return {
    "--bg": p.bg,
    "--card": p.card,
    "--card-hover": p.cardHover,
    "--ink": p.ink,
    "--muted": p.muted,
    "--rule": p.rule,
    "--accent": p.accent,
    "--chip-bg": p.chipBg,
    "--chip-fg": p.chipFg,
    "--tag-bg": p.tagBg,
    "--tag-fg": p.tagFg,
    "--font-display": f.display,
    "--font-body": f.body,
    "--font-mono": f.mono,
    "--display-weight": String(f.displayWeight),
    "--body-weight": String(f.bodyWeight),
    "--radius": theme.rounded ? "14px" : "4px",
    "--radius-sm": theme.rounded ? "8px" : "2px",
  };
}
