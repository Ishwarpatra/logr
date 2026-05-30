"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { insertEventsAction, importFileAction, importUrlAction, type ReviewEvent } from "@/lib/actions";
import { NARRATE_TAGS } from "@/lib/narrate";
import { TAG_META } from "@/lib/theme";
import { DatePicker } from "./DatePicker";

type Tab = "file" | "url";
type Tag = (typeof NARRATE_TAGS)[number];
type Item = ReviewEvent & { include: boolean };
const MEDIA_GLYPH: Record<string, string> = { tweet: "𝕏", video: "▶", link: "↗", image: "▦" };

export function ImportDialog({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("file");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [items, setItems] = useState<Item[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  const setItem = (i: number, patch: Partial<Item>) =>
    setItems((arr) => (arr ? arr.map((it, j) => (j === i ? { ...it, ...patch } : it)) : arr));
  const toggleTag = (i: number, t: Tag) =>
    setItems((arr) =>
      arr
        ? arr.map((it, j) =>
            j === i
              ? { ...it, tags: it.tags.includes(t) ? it.tags.filter((x) => x !== t) : [...it.tags, t] }
              : it
          )
        : arr
    );
  const removeMedia = (i: number, k: number) =>
    setItems((arr) => (arr ? arr.map((it, j) => (j === i ? { ...it, media: it.media.filter((_, n) => n !== k) } : it)) : arr));

  async function extract() {
    setLoading(true);
    setError(null);
    try {
      let events: ReviewEvent[];
      if (tab === "file") {
        if (!file) return;
        const fd = new FormData();
        fd.append("file", file);
        events = await importFileAction(fd);
      } else {
        if (!url.trim()) return;
        events = await importUrlAction(url.trim());
      }
      if (!events.length) setError("No events found — try a different file or URL.");
      else setItems(events.map((e) => ({ ...e, include: true })));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function insert() {
    const chosen = (items ?? [])
      .filter((it) => it.include)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(({ include: _inc, ...e }) => e as ReviewEvent);
    if (!chosen.length) { toast("Select at least one event", "error"); return; }
    start(async () => {
      await insertEventsAction(chosen);
      toast(`Added ${chosen.length} event${chosen.length > 1 ? "s" : ""}`);
      router.refresh();
      onClose();
    });
  }

  const canExtract = tab === "file" ? !!file : !!url.trim();

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal__overlay" onClick={onClose} />
      <div className="modal__card modal__card--wide">
        <button type="button" className="modal__close" onClick={onClose} aria-label="close">×</button>
        <h2 className="modal__title">import events<span className="colon">.</span></h2>
        <p className="modal__sub">upload your resume or link a portfolio site — logr extracts your timeline automatically.</p>

        {!items ? (
          <>
            <div className="import-tabs">
              <button
                type="button"
                className={`import-tab${tab === "file" ? " is-active" : ""}`}
                onClick={() => setTab("file")}
              >
                <span className="import-tab__glyph">↑</span> resume / file
              </button>
              <button
                type="button"
                className={`import-tab${tab === "url" ? " is-active" : ""}`}
                onClick={() => setTab("url")}
              >
                <span className="import-tab__glyph">⊕</span> portfolio url
              </button>
            </div>

            {tab === "file" ? (
              <div className="field">
                <div
                  className={`import-drop${file ? " has-file" : ""}`}
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const f = e.dataTransfer.files[0];
                    if (f) setFile(f);
                  }}
                >
                  {file ? (
                    <>
                      <span className="import-drop__icon">✓</span>
                      <span className="import-drop__name">{file.name}</span>
                      <span className="import-drop__types">click to change</span>
                    </>
                  ) : (
                    <>
                      <span className="import-drop__icon">↑</span>
                      <span className="import-drop__hint">drag & drop or click to upload</span>
                      <span className="import-drop__types">PDF · DOCX · TXT</span>
                    </>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  hidden
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </div>
            ) : (
              <div className="field">
                <label className="field__label">portfolio or LinkedIn URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://yourname.com"
                  autoFocus
                />
                <span className="field__hint">any public portfolio, personal site, or LinkedIn profile</span>
              </div>
            )}

            {error && <p className="field__hint" style={{ color: "var(--user-accent)" }}>{error}</p>}
            <div className="modal__foot">
              <button type="button" className="btn btn--ghost" onClick={onClose}>cancel</button>
              <button
                type="button"
                className="btn btn--primary"
                onClick={extract}
                disabled={loading || !canExtract}
              >
                {loading ? "reading…" : "extract events →"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="narrate__list">
              {items.map((it, i) => (
                <div className={`narrate__item${it.include ? "" : " is-off"}`} key={i}>
                  <label className="check narrate__inc">
                    <input type="checkbox" checked={it.include} onChange={(e) => setItem(i, { include: e.target.checked })} />
                    <span className="check__box" />
                  </label>
                  <div className="narrate__item__body">
                    <input className="narrate__title" value={it.title} onChange={(e) => setItem(i, { title: e.target.value })} />
                    <div className="narrate__row">
                      <DatePicker value={it.dateOn} onChange={(iso) => setItem(i, { dateOn: iso ?? it.dateOn })} />
                      <label className="check narrate__feat">
                        <input type="checkbox" checked={it.featured} onChange={(e) => setItem(i, { featured: e.target.checked })} />
                        <span className="check__box" /><span>highlight</span>
                      </label>
                    </div>
                    <div className="tag-pick">
                      {NARRATE_TAGS.map((t) => (
                        <button key={t} type="button" className="tag-pick__chip" aria-pressed={it.tags.includes(t)} onClick={() => toggleTag(i, t)}>
                          {TAG_META[t]?.label ?? t}
                        </button>
                      ))}
                    </div>
                    {it.media.length > 0 && (
                      <div className="narrate__media">
                        {it.media.map((m, k) => (
                          <span key={k} className="narrate__media__chip">
                            <span className="narrate__media__glyph">{MEDIA_GLYPH[m.kind] ?? "↗"}</span>
                            <span className="narrate__media__label">{m.title ?? m.provider ?? m.url}</span>
                            <button type="button" onClick={() => removeMedia(i, k)} aria-label="remove">×</button>
                          </span>
                        ))}
                      </div>
                    )}
                    <textarea className="narrate__bodytext" rows={2} value={it.body} onChange={(e) => setItem(i, { body: e.target.value })} />
                  </div>
                </div>
              ))}
            </div>
            <div className="modal__foot">
              <button type="button" className="btn btn--ghost" onClick={() => setItems(null)}>← back</button>
              <button
                type="button"
                className="btn btn--primary"
                onClick={insert}
                disabled={pending || !items.some((it) => it.include)}
              >
                {pending ? "adding…" : `add ${items.filter((it) => it.include).length} events →`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
