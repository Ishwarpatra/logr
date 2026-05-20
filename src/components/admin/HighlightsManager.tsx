"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "./ImageUploader";
import { Field, Input, Textarea, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { useToast } from "@/components/ui/Toast";
import {
  saveHighlightAction,
  deleteHighlightAction,
  moveHighlightAction,
  type HighlightInput,
} from "@/lib/actions";
import { TAG_META } from "@/lib/theme";
import { isImageIcon } from "@/lib/icon";

export type EditableHighlight = {
  id: string;
  date: string;
  year: number;
  title: string;
  tag: string;
  body: string;
  icon: string | null;
  linkLabel: string | null;
  linkHref: string | null;
  position: number;
  images: string[];
};

const TAG_OPTIONS = ["work", "milestone", "talk", "side_quest", "writing"];

function emptyDraft(position: number): HighlightInput {
  return {
    date: "",
    year: new Date().getFullYear(),
    title: "",
    tag: "work",
    body: "",
    icon: null,
    linkLabel: null,
    linkHref: null,
    position,
    images: [],
  };
}

function toDraft(h: EditableHighlight): HighlightInput {
  return {
    id: h.id,
    date: h.date,
    year: h.year,
    title: h.title,
    tag: h.tag,
    body: h.body,
    icon: h.icon,
    linkLabel: h.linkLabel,
    linkHref: h.linkHref,
    position: h.position,
    images: h.images,
  };
}

function HighlightDialog({
  open,
  initial,
  onClose,
  onSaved,
}: {
  open: boolean;
  initial: HighlightInput;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [draft, setDraft] = useState<HighlightInput>(initial);
  const [pending, start] = useTransition();

  function set<K extends keyof HighlightInput>(k: K, v: HighlightInput[K]) {
    setDraft((d) => ({ ...d, [k]: v }));
  }

  function submit() {
    start(async () => {
      await saveHighlightAction(draft);
      onSaved();
    });
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={initial.id ? "Edit highlight" : "New highlight"}
      description="A moment on your timeline — work, a milestone, a talk, a side quest."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} disabled={pending || !draft.title.trim()}>
            {pending ? "Saving…" : "Save highlight"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Title">
          <Input autoFocus value={draft.title} onChange={(e) => set("title", e.target.value)} placeholder="Built something great" />
        </Field>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Date" hint="Display text">
            <Input value={draft.date} onChange={(e) => set("date", e.target.value)} placeholder="Nov 2025" />
          </Field>
          <Field label="Year" hint="For sorting">
            <Input type="number" value={draft.year} onChange={(e) => set("year", Number(e.target.value))} />
          </Field>
          <Field label="Tag">
            <Select value={draft.tag} onChange={(e) => set("tag", e.target.value)}>
              {TAG_OPTIONS.map((t) => (
                <option key={t} value={t}>{TAG_META[t]?.label ?? t}</option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="Icon" hint="Optional — a logo image or an emoji, shown beside the title">
          <div className="flex flex-wrap items-center gap-3">
            <ImageUploader
              value={isImageIcon(draft.icon) ? [draft.icon] : []}
              onChange={(u) => set("icon", u[0] ?? null)}
              max={1}
            />
            <span className="text-xs text-[var(--muted)]">or emoji</span>
            <Input
              value={isImageIcon(draft.icon) ? "" : draft.icon ?? ""}
              onChange={(e) => set("icon", e.target.value || null)}
              placeholder="🏆"
              maxLength={4}
              className="w-24"
            />
          </div>
        </Field>

        <Field label="Body">
          <Textarea rows={3} value={draft.body} onChange={(e) => set("body", e.target.value)} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Link label">
            <Input value={draft.linkLabel ?? ""} onChange={(e) => set("linkLabel", e.target.value || null)} placeholder="see the post" />
          </Field>
          <Field label="Link URL">
            <Input value={draft.linkHref ?? ""} onChange={(e) => set("linkHref", e.target.value || null)} placeholder="https://…" />
          </Field>
        </div>

        <Field label="Photos" hint="Up to 4 — shown as a 1 / 2 / 4 grid">
          <ImageUploader value={draft.images} onChange={(urls) => set("images", urls)} max={4} />
        </Field>
      </div>
    </Dialog>
  );
}

export function HighlightsManager({ highlights }: { highlights: EditableHighlight[] }) {
  const router = useRouter();
  const toast = useToast();
  const [dialog, setDialog] = useState<{ initial: HighlightInput } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<EditableHighlight | null>(null);
  const [pending, start] = useTransition();

  const nextPosition = highlights.length
    ? Math.min(...highlights.map((h) => h.position)) - 1
    : 0;

  function move(id: string, dir: "up" | "down") {
    start(async () => {
      await moveHighlightAction(id, dir);
      router.refresh();
    });
  }

  function doDelete(h: EditableHighlight) {
    start(async () => {
      await deleteHighlightAction(h.id);
      setConfirmDelete(null);
      toast("Highlight deleted");
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--muted)]">{highlights.length} highlights · newest first</p>
        <Button size="sm" variant="accent" onClick={() => setDialog({ initial: emptyDraft(nextPosition) })}>
          + Add highlight
        </Button>
      </div>

      <ul className="space-y-2">
        {highlights.map((h, i) => (
          <li
            key={h.id}
            className="group flex items-center gap-3 rounded-2xl border border-[var(--rule)] bg-[var(--bg)]/40 p-3 transition-colors hover:bg-[var(--card-hover)]"
          >
            <div className="flex flex-col">
              <button
                onClick={() => move(h.id, "up")}
                disabled={i === 0 || pending}
                aria-label="Move up"
                className="rounded-md p-0.5 text-[var(--muted)] hover:bg-[var(--card-hover)] hover:text-[var(--ink)] disabled:opacity-30"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 10l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button
                onClick={() => move(h.id, "down")}
                disabled={i === highlights.length - 1 || pending}
                aria-label="Move down"
                className="rounded-md p-0.5 text-[var(--muted)] hover:bg-[var(--card-hover)] hover:text-[var(--ink)] disabled:opacity-30"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>

            <span className="hidden h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[var(--rule)] bg-[var(--card)] sm:block">
              {h.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={h.images[0]} alt="" className="h-full w-full object-cover" />
              ) : isImageIcon(h.icon) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={h.icon} alt="" className="h-full w-full object-contain p-1.5" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-base text-[var(--muted)] opacity-70">
                  {h.icon || TAG_META[h.tag]?.emoji || "•"}
                </span>
              )}
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[var(--ink)]">{h.title}</p>
              <p className="truncate text-xs text-[var(--muted)]">
                {h.date} · {TAG_META[h.tag]?.label ?? h.tag}
                {h.images.length > 0 && ` · ${h.images.length} photo${h.images.length > 1 ? "s" : ""}`}
              </p>
            </div>

            <div className="flex shrink-0 gap-1.5">
              <Button size="sm" variant="secondary" onClick={() => setDialog({ initial: toDraft(h) })}>
                Edit
              </Button>
              <Button size="sm" variant="danger" onClick={() => setConfirmDelete(h)}>
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {dialog && (
        <HighlightDialog
          open
          initial={dialog.initial}
          onClose={() => setDialog(null)}
          onSaved={() => {
            setDialog(null);
            toast(dialog.initial.id ? "Highlight updated" : "Highlight added");
            router.refresh();
          }}
        />
      )}

      <Dialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete highlight?"
        description={confirmDelete ? `“${confirmDelete.title}” will be permanently removed.` : ""}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button variant="danger" disabled={pending} onClick={() => confirmDelete && doDelete(confirmDelete)}>
              {pending ? "Deleting…" : "Delete"}
            </Button>
          </>
        }
      >
        <p className="text-sm text-[var(--muted)]">This can&apos;t be undone.</p>
      </Dialog>
    </div>
  );
}
