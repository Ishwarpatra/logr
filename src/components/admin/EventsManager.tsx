"use client";

import { useState, useRef, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Reorder, useDragControls } from "framer-motion";
import { useToast } from "@/components/ui/Toast";
import {
  saveEventAction,
  deleteEventAction,
  reorderEventsAction,
  type EventInput,
} from "@/lib/actions";
import { TAG_META } from "@/lib/theme";
import { isImageIcon } from "@/lib/icon";
import { uploadImage } from "@/lib/upload";
import { parseVideoUrl } from "@/lib/video";
import type { MediaItem } from "@/lib/profile";

export type EditableEvent = {
  id: string;
  date: string;
  year: number;
  title: string;
  tags: string[];
  featured: boolean;
  body: string;
  icon: string | null;
  linkLabel: string | null;
  linkHref: string | null;
  position: number;
  media: MediaItem[];
};

const TAG_OPTIONS = ["work", "milestone", "talk", "side_quest", "writing"];

function emptyDraft(position: number): EventInput {
  return { date: "", year: new Date().getFullYear(), title: "", tags: ["work"], featured: true, body: "", icon: null, linkLabel: null, linkHref: null, position, media: [] };
}
function toDraft(e: EditableEvent): EventInput {
  return { id: e.id, date: e.date, year: e.year, title: e.title, tags: e.tags, featured: e.featured, body: e.body, icon: e.icon, linkLabel: e.linkLabel, linkHref: e.linkHref, position: e.position, media: e.media };
}
function letter(s: string) { return (s.trim()[0] || "·").toLowerCase(); }

// ---------- EDIT / ADD MODAL ----------
function EventModal({ initial, onClose, onSaved }: { initial: EventInput; onClose: () => void; onSaved: (isNew: boolean) => void }) {
  const [draft, setDraft] = useState<EventInput>(initial);
  const [pending, start] = useTransition();
  const [busy, setBusy] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
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

  function set<K extends keyof EventInput>(k: K, v: EventInput[K]) { setDraft((d) => ({ ...d, [k]: v })); }
  function toggleTag(t: string) {
    set("tags", draft.tags.includes(t) ? draft.tags.filter((x) => x !== t) : [...draft.tags, t]);
  }

  async function uploadIcon(file?: File) {
    if (!file) return;
    setBusy(true);
    try { set("icon", await uploadImage(file)); } catch (e) { toast(e instanceof Error ? e.message : "Upload failed", "error"); } finally { setBusy(false); }
  }
  async function addPhotos(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    try {
      const room = 8 - draft.media.length;
      const urls = await Promise.all(Array.from(files).slice(0, room).map(uploadImage));
      set("media", [...draft.media, ...urls.map((url) => ({ kind: "image" as const, url, poster: null, provider: null }))]);
    } catch (e) { toast(e instanceof Error ? e.message : "Upload failed", "error"); } finally { setBusy(false); }
  }
  function addVideo() {
    const parsed = parseVideoUrl(videoUrl);
    if (!parsed) { toast("Paste a YouTube, Vimeo, or Loom link", "error"); return; }
    if (draft.media.length >= 8) { toast("Up to 8 media items", "error"); return; }
    set("media", [...draft.media, { kind: "video", url: parsed.embedUrl, poster: parsed.poster, provider: parsed.provider }]);
    setVideoUrl("");
  }
  function submit() {
    start(async () => { await saveEventAction(draft); onSaved(!initial.id); });
  }

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal__overlay" onClick={onClose} />
      <div className="modal__card">
        <button type="button" className="modal__close" onClick={onClose} aria-label="close">×</button>
        <h2 className="modal__title">{initial.id ? "edit event" : "new event"}<span className="colon">.</span></h2>
        <p className="modal__sub">a moment on your timeline — work, a milestone, a talk, a side quest.</p>

        <div className="field">
          <label className="field__label">title</label>
          <input type="text" value={draft.title} onChange={(e) => set("title", e.target.value)} placeholder="built something good." autoFocus />
        </div>

        <div className="field-row">
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
        </div>

        <div className="field">
          <span className="field__label">tags</span>
          <div className="tag-pick">
            {TAG_OPTIONS.map((t) => (
              <button key={t} type="button" className="tag-pick__chip" aria-pressed={draft.tags.includes(t)} onClick={() => toggleTag(t)}>
                {TAG_META[t]?.label ?? t}
              </button>
            ))}
          </div>
          <span className="field__hint">pick one or more</span>
        </div>

        <label className="check">
          <input type="checkbox" checked={draft.featured} onChange={(e) => set("featured", e.target.checked)} />
          <span className="check__box" />
          <span>include in highlights <span className="field__hint">— shown by default on your page</span></span>
        </label>

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
          <span className="field__label">media</span>
          <div className="field-photos">
            {draft.media.map((m, i) => (
              <div key={i} className={`field-photos__cell${m.kind === "video" ? " field-photos__cell--video" : ""}`}>
                {m.kind === "video" ? (
                  m.poster ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.poster} alt="" />
                  ) : (
                    <span className="field-photos__vbg">{m.provider ?? "video"}</span>
                  )
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.url} alt="" />
                )}
                {m.kind === "video" && <span className="field-photos__play" aria-hidden="true">▶</span>}
                <button type="button" onClick={() => set("media", draft.media.filter((_, j) => j !== i))} aria-label="remove">×</button>
              </div>
            ))}
            {draft.media.length < 8 && (
              <button type="button" className="field-photos__add" onClick={() => photoFileRef.current?.click()} disabled={busy}>
                {busy ? "…" : "+ photo"}
              </button>
            )}
            <input ref={photoFileRef} type="file" accept="image/*" multiple hidden onChange={(e) => addPhotos(e.target.files)} />
          </div>
          <div className="field-video">
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addVideo(); } }}
              placeholder="paste a YouTube / Vimeo / Loom link"
            />
            <button type="button" className="btn btn--small" onClick={addVideo} disabled={!videoUrl.trim() || draft.media.length >= 8}>+ video</button>
          </div>
          <span className="field__hint">up to 8 — photos and videos, shown as a 1 / 2 grid</span>
        </div>

        <div className="modal__foot">
          <button type="button" className="btn btn--ghost" onClick={onClose}>cancel</button>
          <button type="button" className="btn btn--primary" onClick={submit} disabled={pending || !draft.title.trim()}>
            {pending ? "saving…" : "save event →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- DRAGGABLE ROW ----------
function EventRow({
  e,
  onEdit,
  onDelete,
  onCommit,
}: {
  e: EditableEvent;
  onEdit: () => void;
  onDelete: () => void;
  onCommit: () => void;
}) {
  const controls = useDragControls();
  const accent = e.tags.includes("milestone");
  const tagLabels = e.tags.map((t) => TAG_META[t]?.label ?? t).join(", ");
  const photos = e.media.filter((m) => m.kind === "image");
  const videos = e.media.filter((m) => m.kind === "video");
  const thumb = photos[0]?.url ?? videos[0]?.poster ?? null;
  const counts = [
    photos.length ? `${photos.length} photo${photos.length > 1 ? "s" : ""}` : "",
    videos.length ? `${videos.length} video${videos.length > 1 ? "s" : ""}` : "",
  ].filter(Boolean).join(" · ");
  return (
    <Reorder.Item
      value={e}
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
        onPointerDown={(ev) => controls.start(ev)}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <circle cx="6" cy="3" r="1.3" /><circle cx="10" cy="3" r="1.3" /><circle cx="6" cy="8" r="1.3" /><circle cx="10" cy="8" r="1.3" /><circle cx="6" cy="13" r="1.3" /><circle cx="10" cy="13" r="1.3" />
        </svg>
      </button>
      <div className={`hl-row__thumb ${accent ? "hl-row__thumb--accent" : ""}`}>
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt="" />
        ) : isImageIcon(e.icon) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={e.icon} alt="" />
        ) : (e.icon || letter(e.title))}
      </div>
      <div className="hl-row__copy">
        <span className="hl-row__title">{e.title}{e.featured && <span className="hl-row__star" title="in highlights"> ★</span>}</span>
        <span className="hl-row__meta">
          {e.date} · <span className={accent ? "accent" : undefined}>{tagLabels}</span>
          {counts && ` · ${counts}`}
          {e.linkLabel && ` · ${e.linkLabel}`}
        </span>
      </div>
      <div className="hl-row__actions">
        <button onClick={onEdit}>edit</button>
        <button className="danger" onClick={onDelete}>delete</button>
      </div>
    </Reorder.Item>
  );
}

export function EventsManager({ events }: { events: EditableEvent[] }) {
  const router = useRouter();
  const toast = useToast();
  const [dialog, setDialog] = useState<EventInput | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<EditableEvent | null>(null);
  const [pending, start] = useTransition();

  // Local order for drag-and-drop; resynced from props when the set/order changes.
  const [items, setItems] = useState(events);
  const sig = events.map((e) => e.id).join(",");
  const [prevSig, setPrevSig] = useState(sig);
  if (sig !== prevSig) {
    setPrevSig(sig);
    setItems(events);
  }

  const nextPosition = items.length ? Math.min(...items.map((e) => e.position)) - 1 : 0;
  const featuredCount = items.filter((e) => e.featured).length;

  function commitOrder() {
    const order = items.map((i) => i.id);
    start(async () => {
      await reorderEventsAction(order);
      toast("Order saved");
    });
  }
  function doDelete(e: EditableEvent) {
    start(async () => { await deleteEventAction(e.id); setConfirmDelete(null); toast("Event deleted"); router.refresh(); });
  }

  return (
    <section role="tabpanel">
      <div className="card">
        <div className="hl-head">
          <span className="hl-count"><span className="accent">{items.length}</span> events · <span className="accent">{featuredCount}</span> in highlights · drag to reorder</span>
          <button type="button" className="btn btn--small" onClick={() => setDialog(emptyDraft(nextPosition))}>+ add event</button>
        </div>

        <Reorder.Group as="div" axis="y" values={items} onReorder={setItems} className="hl-list">
          {items.map((e) => (
            <EventRow
              key={e.id}
              e={e}
              onEdit={() => setDialog(toDraft(e))}
              onDelete={() => setConfirmDelete(e)}
              onCommit={commitOrder}
            />
          ))}
        </Reorder.Group>
      </div>

      {dialog && (
        <EventModal
          initial={dialog}
          onClose={() => setDialog(null)}
          onSaved={(isNew) => { setDialog(null); toast(isNew ? "Event added" : "Event updated"); router.refresh(); }}
        />
      )}

      {confirmDelete && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal__overlay" onClick={() => setConfirmDelete(null)} />
          <div className="modal__card" style={{ maxWidth: 420 }}>
            <h2 className="modal__title">delete event<span className="colon">?</span></h2>
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
