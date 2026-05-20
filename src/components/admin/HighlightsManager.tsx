"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "./ImageUploader";
import {
  saveHighlightAction,
  deleteHighlightAction,
  type HighlightInput,
} from "@/lib/actions";
import { TAG_META } from "@/lib/theme";

export type EditableHighlight = {
  id: string;
  date: string;
  year: number;
  title: string;
  tag: string;
  body: string;
  linkLabel: string | null;
  linkHref: string | null;
  position: number;
  images: string[];
};

const TAG_OPTIONS = ["work", "milestone", "talk", "side_quest", "writing"];

const EMPTY = (position: number): HighlightInput => ({
  date: "",
  year: new Date().getFullYear(),
  title: "",
  tag: "work",
  body: "",
  linkLabel: null,
  linkHref: null,
  position,
  images: [],
});

const field = "mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900";
const label = "block text-xs font-medium uppercase tracking-wide text-zinc-500";

function HighlightForm({
  initial,
  onDone,
  onCancel,
}: {
  initial: HighlightInput;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<HighlightInput>(initial);
  const [pending, start] = useTransition();

  function set<K extends keyof HighlightInput>(k: K, v: HighlightInput[K]) {
    setDraft((d) => ({ ...d, [k]: v }));
  }

  function submit() {
    start(async () => {
      await saveHighlightAction(draft);
      onDone();
    });
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className={label}>Title</label>
          <input className={field} value={draft.title} onChange={(e) => set("title", e.target.value)} />
        </div>
        <div>
          <label className={label}>Date (display)</label>
          <input className={field} placeholder="Nov 2025" value={draft.date} onChange={(e) => set("date", e.target.value)} />
        </div>
        <div>
          <label className={label}>Year (sort)</label>
          <input type="number" className={field} value={draft.year} onChange={(e) => set("year", Number(e.target.value))} />
        </div>
        <div>
          <label className={label}>Tag</label>
          <select className={field} value={draft.tag} onChange={(e) => set("tag", e.target.value)}>
            {TAG_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {TAG_META[t]?.label ?? t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Position (lower = newer)</label>
          <input type="number" className={field} value={draft.position} onChange={(e) => set("position", Number(e.target.value))} />
        </div>
        <div className="col-span-2">
          <label className={label}>Body</label>
          <textarea rows={3} className={field} value={draft.body} onChange={(e) => set("body", e.target.value)} />
        </div>
        <div>
          <label className={label}>Link label</label>
          <input className={field} value={draft.linkLabel ?? ""} onChange={(e) => set("linkLabel", e.target.value || null)} />
        </div>
        <div>
          <label className={label}>Link URL</label>
          <input className={field} placeholder="https://…" value={draft.linkHref ?? ""} onChange={(e) => set("linkHref", e.target.value || null)} />
        </div>
        <div className="col-span-2">
          <label className={label}>Photos (up to 4)</label>
          <div className="mt-1">
            <ImageUploader value={draft.images} onChange={(urls) => set("images", urls)} max={4} />
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={submit}
          disabled={pending || !draft.title}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        <button onClick={onCancel} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-100">
          Cancel
        </button>
      </div>
    </div>
  );
}

export function HighlightsManager({ highlights }: { highlights: EditableHighlight[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [, start] = useTransition();

  const nextPosition = highlights.length
    ? Math.min(...highlights.map((h) => h.position)) - 1
    : 0;

  function done() {
    setEditingId(null);
    setAdding(false);
    router.refresh();
  }

  function remove(id: string) {
    if (!confirm("Delete this highlight?")) return;
    start(async () => {
      await deleteHighlightAction(id);
      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900">Highlights</h2>
        {!adding && (
          <button
            onClick={() => {
              setAdding(true);
              setEditingId(null);
            }}
            className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800"
          >
            + Add highlight
          </button>
        )}
      </div>

      {adding && (
        <HighlightForm initial={EMPTY(nextPosition)} onDone={done} onCancel={() => setAdding(false)} />
      )}

      <ul className="space-y-2">
        {highlights.map((h) => (
          <li key={h.id} className="rounded-xl border border-zinc-200 bg-white">
            {editingId === h.id ? (
              <div className="p-1">
                <HighlightForm
                  initial={{
                    id: h.id,
                    date: h.date,
                    year: h.year,
                    title: h.title,
                    tag: h.tag,
                    body: h.body,
                    linkLabel: h.linkLabel,
                    linkHref: h.linkHref,
                    position: h.position,
                    images: h.images,
                  }}
                  onDone={done}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-900">{h.title}</p>
                  <p className="text-xs text-zinc-500">
                    {h.date} · {TAG_META[h.tag]?.label ?? h.tag}
                    {h.images.length > 0 && ` · ${h.images.length} photo${h.images.length > 1 ? "s" : ""}`}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => { setEditingId(h.id); setAdding(false); }} className="rounded-md border border-zinc-300 px-3 py-1 text-xs hover:bg-zinc-100">
                    Edit
                  </button>
                  <button onClick={() => remove(h.id)} className="rounded-md border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
