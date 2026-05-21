"use client";

import { useState, useRef, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Reorder, useDragControls } from "framer-motion";
import { useToast } from "@/components/ui/Toast";
import {
  saveHighlightAction,
  deleteHighlightAction,
  reorderHighlightsAction,
  type HighlightInput,
} from "@/lib/actions";
import { TAG_META } from "@/lib/theme";
import { isImageIcon } from "@/lib/icon";
import { uploadImage } from "@/lib/upload";

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
  return { date: "", year: new Date().getFullYear(), title: "", tag: "work", body: "", icon: null, linkLabel: null, linkHref: null, position, images: [] };
}
function toDraft(h: EditableHighlight): HighlightInput {
  return { id: h.id, date: h.date, year: h.year, title: h.title, tag: h.tag, body: h.body, icon: h.icon, linkLabel: h.linkLabel, linkHref: h.linkHref, position: h.position, images: h.images };
}
function letter(s: string) { return (s.trim()[0] || "·").toLowerCase(); }

// ---------- EDIT / ADD MODAL ----------
function HighlightModal({ initial, onClose, onSaved }: { initial: HighlightInput; onClose: () => void; onSaved: (isNew: boolean) => void }) {
  const [draft, setDraft] = useState<HighlightInput>(initial);
  const [pending, start] = useTransition();
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const iconFileRef = useRef<HTMLInputElement>(null);
  const photoFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  function set<K extends keyof HighlightInput>(k: K, v: HighlightInput[K]) { setDraft((d) => ({ ...d, [k]: v })); }

  async function uploadIcon(file?: File) {
    if (!file) return;
    setBusy(true);
    try { set("icon", await uploadImage(file)); } catch (e) { toast(e instanceof Error ? e.message : "Upload failed", "error"); } finally { setBusy(false); }
  }
  async function addPhotos(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    try {
      const room = 4 - draft.images.length;
      const urls = await Promise.all(Array.from(files).slice(0, room).map(uploadImage));
      set("images", [...draft.images, ...urls]);
    } catch (e) { toast(e instanceof Error ? e.message : "Upload failed", "error"); } finally { setBusy(false); }
  }
  function submit() {
    start(async () => { await saveHighlightAction(draft); onSaved(!initial.id); });
  }

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal__overlay" onClick={onClose} />
      <div className="modal__card">
        <button type="button" className="modal__close" onClick={onClose} aria-label="close">×</button>
        <h2 className="modal__title">{initial.id ? "edit highlight" : "new highlight"}<span className="colon">.</span></h2>
        <p className="modal__sub">a moment on your timeline — work, a milestone, a talk, a side quest.</p>

        <div className="field">
          <label className="field__label">title</label>
          <input type="text" value={draft.title} onChange={(e) => set("title", e.target.value)} placeholder="built something good." autoFocus />
        </div>

        <div className="field-row field-row--three">
          <div className="field">
            <label className="field__label">date</label>
            <input type="text" value={draft.date} onChange={(e) => set("date", e.target.value)} placeholder="2026.04" />
            <span className="field__hint">display text</span>
          </div>
          <div className="field">
            <label className="field__label">year</label>
            <input type="number" value={draft.year} onChange={(e) => set("year", Number(e.target.value))} />
            <span className="field__hint">for sorting</span>
          </div>
          <div className="field">
            <label className="field__label">tag</label>
            <select value={draft.tag} onChange={(e) => set("tag", e.target.value)}>
              {TAG_OPTIONS.map((t) => <option key={t} value={t}>{TAG_META[t]?.label ?? t}</option>)}
            </select>
          </div>
        </div>

        <div className="field">
          <span className="field__label">icon</span>
          <div className="field-icon">
            <span className="field-icon__preview">
              {isImageIcon(draft.icon) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={draft.icon} alt="" />
              ) : (draft.icon || letter(draft.title))}
            </span>
            <input type="text" value={isImageIcon(draft.icon) ? "" : draft.icon ?? ""} onChange={(e) => set("icon", e.target.value || null)} placeholder="🏆" maxLength={4} />
            <span className="field-icon__or" onClick={() => iconFileRef.current?.click()} style={{ cursor: "pointer" }}>
              or <span style={{ color: "var(--user-accent)" }}>upload a logo</span>
            </span>
            <input ref={iconFileRef} type="file" accept="image/*" hidden onChange={(e) => uploadIcon(e.target.files?.[0])} />
          </div>
          <span className="field__hint">a letter, an emoji, or a logo image. shown beside the title.</span>
        </div>

        <div className="field">
          <label className="field__label">body</label>
          <textarea rows={4} value={draft.body} onChange={(e) => set("body", e.target.value)} />
        </div>

        <div className="field-row">
          <div className="field">
            <label className="field__label">link label</label>
            <input type="text" value={draft.linkLabel ?? ""} onChange={(e) => set("linkLabel", e.target.value || null)} placeholder="heysage.me" />
          </div>
          <div className="field">
            <label className="field__label">link url</label>
            <input type="url" value={draft.linkHref ?? ""} onChange={(e) => set("linkHref", e.target.value || null)} placeholder="https://…" />
          </div>
        </div>

        <div className="field">
          <span className="field__label">photos</span>
          <div className="field-photos">
            {draft.images.map((url, i) => (
              <div key={i} className="field-photos__cell">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" />
                <button type="button" onClick={() => set("images", draft.images.filter((_, j) => j !== i))} aria-label="remove">×</button>
              </div>
            ))}
            {draft.images.length < 4 && (
              <button type="button" className="field-photos__add" onClick={() => photoFileRef.current?.click()} disabled={busy}>
                {busy ? "…" : "+ add"}
              </button>
            )}
            <input ref={photoFileRef} type="file" accept="image/*" multiple hidden onChange={(e) => addPhotos(e.target.files)} />
          </div>
          <span className="field__hint">up to 4 — shown as a 1 / 2 grid</span>
        </div>

        <div className="modal__foot">
          <button type="button" className="btn btn--ghost" onClick={onClose}>cancel</button>
          <button type="button" className="btn btn--primary" onClick={submit} disabled={pending || !draft.title.trim()}>
            {pending ? "saving…" : "save highlight →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- LIST ----------
// ---------- DRAGGABLE ROW ----------
function HighlightRow({
  h,
  onEdit,
  onDelete,
  onCommit,
}: {
  h: EditableHighlight;
  onEdit: () => void;
  onDelete: () => void;
  onCommit: () => void;
}) {
  const controls = useDragControls();
  const accent = h.tag === "milestone";
  return (
    <Reorder.Item
      value={h}
      as="div"
      className="hl-row"
      dragListener={false}
      dragControls={controls}
      onDragEnd={onCommit}
      whileDrag={{ scale: 1.01, backgroundColor: "var(--paper)", borderRadius: 10, boxShadow: "0 16px 40px -14px rgba(0,0,0,0.4)", zIndex: 5 }}
    >
      <button
        type="button"
        className="hl-row__handle"
        aria-label="drag to reorder"
        onPointerDown={(e) => controls.start(e)}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <circle cx="6" cy="3" r="1.3" /><circle cx="10" cy="3" r="1.3" /><circle cx="6" cy="8" r="1.3" /><circle cx="10" cy="8" r="1.3" /><circle cx="6" cy="13" r="1.3" /><circle cx="10" cy="13" r="1.3" />
        </svg>
      </button>
      <div className={`hl-row__thumb ${accent ? "hl-row__thumb--accent" : ""}`}>
        {h.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={h.images[0]} alt="" />
        ) : isImageIcon(h.icon) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={h.icon} alt="" />
        ) : (h.icon || letter(h.title))}
      </div>
      <div className="hl-row__copy">
        <span className="hl-row__title">{h.title}</span>
        <span className="hl-row__meta">
          {h.date} · <span className={accent ? "accent" : undefined}>{TAG_META[h.tag]?.label ?? h.tag}</span>
          {h.images.length > 0 && ` · ${h.images.length} photo${h.images.length > 1 ? "s" : ""}`}
          {h.linkLabel && ` · ${h.linkLabel}`}
        </span>
      </div>
      <div className="hl-row__actions">
        <button onClick={onEdit}>edit</button>
        <button className="danger" onClick={onDelete}>delete</button>
      </div>
    </Reorder.Item>
  );
}

export function HighlightsManager({ highlights }: { highlights: EditableHighlight[] }) {
  const router = useRouter();
  const toast = useToast();
  const [dialog, setDialog] = useState<HighlightInput | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<EditableHighlight | null>(null);
  const [pending, start] = useTransition();

  // Local order for drag-and-drop; resynced from props when the set/order changes.
  const [items, setItems] = useState(highlights);
  const sig = highlights.map((h) => h.id).join(",");
  const [prevSig, setPrevSig] = useState(sig);
  if (sig !== prevSig) {
    setPrevSig(sig);
    setItems(highlights);
  }

  const nextPosition = items.length ? Math.min(...items.map((h) => h.position)) - 1 : 0;

  function commitOrder() {
    const order = items.map((i) => i.id);
    start(async () => {
      await reorderHighlightsAction(order);
      toast("Order saved");
    });
  }
  function doDelete(h: EditableHighlight) {
    start(async () => { await deleteHighlightAction(h.id); setConfirmDelete(null); toast("Highlight deleted"); router.refresh(); });
  }

  return (
    <section role="tabpanel">
      <div className="card">
        <div className="hl-head">
          <span className="hl-count"><span className="accent">{items.length}</span> highlights · drag to reorder</span>
          <button type="button" className="btn btn--small" onClick={() => setDialog(emptyDraft(nextPosition))}>+ add highlight</button>
        </div>

        <Reorder.Group as="div" axis="y" values={items} onReorder={setItems} className="hl-list">
          {items.map((h) => (
            <HighlightRow
              key={h.id}
              h={h}
              onEdit={() => setDialog(toDraft(h))}
              onDelete={() => setConfirmDelete(h)}
              onCommit={commitOrder}
            />
          ))}
        </Reorder.Group>
      </div>

      {dialog && (
        <HighlightModal
          initial={dialog}
          onClose={() => setDialog(null)}
          onSaved={(isNew) => { setDialog(null); toast(isNew ? "Highlight added" : "Highlight updated"); router.refresh(); }}
        />
      )}

      {confirmDelete && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal__overlay" onClick={() => setConfirmDelete(null)} />
          <div className="modal__card" style={{ maxWidth: 420 }}>
            <h2 className="modal__title">delete highlight<span className="colon">?</span></h2>
            <p className="modal__sub">“{confirmDelete.title}” will be permanently removed. this can&apos;t be undone.</p>
            <div className="modal__foot">
              <button type="button" className="btn btn--ghost" onClick={() => setConfirmDelete(null)}>cancel</button>
              <button type="button" className="btn btn--primary" disabled={pending} onClick={() => doDelete(confirmDelete)}>
                {pending ? "deleting…" : "delete →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
