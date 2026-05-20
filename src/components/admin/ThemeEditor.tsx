"use client";

import { useState, useTransition } from "react";
import { Field, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { updateThemeAction } from "@/lib/actions";
import {
  PALETTES,
  FONT_PAIRS,
  ACCENT_SWATCHES,
  resolvePalette,
  type Theme,
  type PostStyle,
  type DotStyle,
  type PhotoHover,
} from "@/lib/theme";
import { cn } from "@/lib/cn";

const POST_STYLES: PostStyle[] = ["feed", "card", "centered", "terminal", "polaroid", "magazine"];
const DOT_STYLES: DotStyle[] = ["circle", "square", "icon"];
const PHOTO_HOVERS: PhotoHover[] = ["lift", "zoom", "none"];

export function ThemeEditor({ theme }: { theme: Theme }) {
  const [draft, setDraft] = useState<Theme>(theme);
  const [pending, start] = useTransition();
  const toast = useToast();

  function set<K extends keyof Theme>(k: K, v: Theme[K]) {
    setDraft((d) => ({ ...d, [k]: v }));
  }

  function save() {
    start(async () => {
      await updateThemeAction(draft);
      toast("Theme saved");
    });
  }

  const preview = resolvePalette(draft);

  return (
    <div className="space-y-5">
      {/* live palette preview */}
      <div
        className="flex items-center justify-between rounded-xl border border-zinc-200 p-4"
        style={{ background: preview.bg }}
      >
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold" style={{ color: preview.ink }}>
            {PALETTES[draft.palette]?.name ?? draft.palette}
            {draft.dark ? " · dark" : ""}
          </span>
          <span className="text-xs" style={{ color: preview.muted }}>
            {FONT_PAIRS[draft.fonts]?.name} · {draft.postStyle}
          </span>
        </div>
        <div className="flex gap-1.5">
          {[preview.accent, preview.card, preview.rule, preview.ink].map((c, i) => (
            <span key={i} className="h-7 w-7 rounded-full border border-black/10" style={{ background: c }} />
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Palette">
          <Select value={draft.palette} onChange={(e) => set("palette", e.target.value)}>
            {Object.entries(PALETTES).map(([k, p]) => (
              <option key={k} value={k}>{p.name}</option>
            ))}
          </Select>
        </Field>
        <Field label="Font">
          <Select value={draft.fonts} onChange={(e) => set("fonts", e.target.value)}>
            {Object.entries(FONT_PAIRS).map(([k, f]) => (
              <option key={k} value={k}>{f.name}</option>
            ))}
          </Select>
        </Field>
        <Field label="Layout">
          <Select value={draft.postStyle} onChange={(e) => set("postStyle", e.target.value as PostStyle)}>
            {POST_STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </Field>
        <Field label="Timeline dot">
          <Select value={draft.dotStyle} onChange={(e) => set("dotStyle", e.target.value as DotStyle)}>
            {DOT_STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </Field>
        <Field label="Photo hover">
          <Select value={draft.photoHover} onChange={(e) => set("photoHover", e.target.value as PhotoHover)}>
            {PHOTO_HOVERS.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </Field>
        <Field label="Accent">
          <div className="flex flex-wrap gap-1.5 pt-1">
            {ACCENT_SWATCHES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => set("accentOverride", c)}
                title={c}
                className={cn(
                  "h-7 w-7 rounded-full border-2 transition-transform hover:scale-110",
                  draft.accentOverride === c ? "border-zinc-900" : "border-transparent"
                )}
                style={{ background: c }}
              />
            ))}
          </div>
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-5">
        <label className="flex items-center gap-2 text-sm text-[var(--ink)]">
          <input type="checkbox" checked={draft.rounded} onChange={(e) => set("rounded", e.target.checked)} />
          Rounded corners
        </label>
        <label className="flex items-center gap-2 text-sm text-[var(--ink)]">
          <input type="checkbox" checked={draft.dark} onChange={(e) => set("dark", e.target.checked)} />
          Dark mode
        </label>
        <Button className="ml-auto" onClick={save} disabled={pending}>
          {pending ? "Saving…" : "Save theme"}
        </Button>
      </div>
    </div>
  );
}
