"use client";

import { useState, useTransition } from "react";
import { updateThemeAction } from "@/lib/actions";
import {
  PALETTES,
  FONT_PAIRS,
  ACCENT_SWATCHES,
  type Theme,
  type PostStyle,
  type DotStyle,
  type PhotoHover,
} from "@/lib/theme";

const POST_STYLES: PostStyle[] = ["feed", "card", "centered", "terminal", "polaroid", "magazine"];
const DOT_STYLES: DotStyle[] = ["circle", "square", "icon"];
const PHOTO_HOVERS: PhotoHover[] = ["lift", "zoom", "none"];

const field = "mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm capitalize outline-none focus:border-zinc-900";
const label = "block text-xs font-medium uppercase tracking-wide text-zinc-500";

export function ThemeEditor({ theme }: { theme: Theme }) {
  const [draft, setDraft] = useState<Theme>(theme);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);

  function set<K extends keyof Theme>(k: K, v: Theme[K]) {
    setDraft((d) => ({ ...d, [k]: v }));
  }

  function save() {
    start(async () => {
      await updateThemeAction(draft);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-zinc-900">Theme</h2>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={label}>Palette</label>
          <select className={field} value={draft.palette} onChange={(e) => set("palette", e.target.value)}>
            {Object.entries(PALETTES).map(([k, p]) => (
              <option key={k} value={k}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Font</label>
          <select className={field} value={draft.fonts} onChange={(e) => set("fonts", e.target.value)}>
            {Object.entries(FONT_PAIRS).map(([k, f]) => (
              <option key={k} value={k}>{f.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Layout</label>
          <select className={field} value={draft.postStyle} onChange={(e) => set("postStyle", e.target.value as PostStyle)}>
            {POST_STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>Timeline dot</label>
          <select className={field} value={draft.dotStyle} onChange={(e) => set("dotStyle", e.target.value as DotStyle)}>
            {DOT_STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>Photo hover</label>
          <select className={field} value={draft.photoHover} onChange={(e) => set("photoHover", e.target.value as PhotoHover)}>
            {PHOTO_HOVERS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>Accent</label>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {ACCENT_SWATCHES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => set("accentOverride", c)}
                title={c}
                className={`h-7 w-7 rounded-full border-2 ${draft.accentOverride === c ? "border-zinc-900" : "border-transparent"}`}
                style={{ background: c }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-5">
        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input type="checkbox" checked={draft.rounded} onChange={(e) => set("rounded", e.target.checked)} />
          Rounded corners
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input type="checkbox" checked={draft.dark} onChange={(e) => set("dark", e.target.checked)} />
          Dark mode
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={pending}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save theme"}
        </button>
        {saved && <span className="text-sm text-green-600">Saved ✓</span>}
      </div>
    </div>
  );
}
