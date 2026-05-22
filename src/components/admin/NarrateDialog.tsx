"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { insertEventsAction, narrateEventsAction, type ReviewEvent } from "@/lib/actions";
import { NARRATE_TAGS } from "@/lib/narrate";
import { TAG_META } from "@/lib/theme";
import { DatePicker } from "./DatePicker";

type Tag = (typeof NARRATE_TAGS)[number];
type Item = ReviewEvent & { include: boolean };
const MEDIA_GLYPH: Record<string, string> = { tweet: "𝕏", video: "▶", link: "↗", image: "▦" };

export function NarrateDialog({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState("");
  const [items, setItems] = useState<Item[] | null>(null);
  const [reading, setReading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
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
      arr ? arr.map((it, j) => (j === i ? { ...it, tags: it.tags.includes(t) ? it.tags.filter((x) => x !== t) : [...it.tags, t] } : it)) : arr
    );
  const removeMedia = (i: number, k: number) =>
    setItems((arr) => (arr ? arr.map((it, j) => (j === i ? { ...it, media: it.media.filter((_, n) => n !== k) } : it)) : arr));

  async function extract() {
    if (!text.trim()) return;
    setReading(true);
    setError(null);
    try {
      const events = await narrateEventsAction(text);
      if (!events.length) setError("No events found — try adding more detail or dates.");
      else setItems(events.map((e) => ({ ...e, include: true })));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setReading(false);
    }
  }

  function insert() {
    const chosen = (items ?? [])
      .filter((it) => it.include)
      .map((it) => ({ dateOn: it.dateOn, fullDate: it.fullDate, title: it.title, tags: it.tags, featured: it.featured, body: it.body, media: it.media }));
    if (!chosen.length) { toast("Select at least one event", "error"); return; }
    start(async () => {
      await insertEventsAction(chosen);
      toast(`Added ${chosen.length} event${chosen.length > 1 ? "s" : ""}`);
      router.refresh();
      onClose();
    });
  }

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal__overlay" onClick={onClose} />
      <div className="modal__card modal__card--wide">
        <button type="button" className="modal__close" onClick={onClose} aria-label="close">×</button>
        <h2 className="modal__title">narrate your timeline<span className="colon">.</span></h2>
        <p className="modal__sub">tell your story in plain words — logr drafts the events. review, tweak, and add.</p>

        {!items ? (
          <>
            <div className="field">
              <textarea
                rows={6}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. I authored a blockchain book in 2018, moved to Bangalore in 2019 and founded Consenso Labs. Won the AA hackathon in April 2023 with ZenGuard…"
              />
            </div>
            {error && <p className="field__hint" style={{ color: "var(--user-accent)" }}>{error}</p>}
            <div className="modal__foot">
              <button type="button" className="btn btn--ghost" onClick={onClose}>cancel</button>
              <button type="button" className="btn btn--primary" onClick={extract} disabled={reading || !text.trim()}>
                {reading ? "reading…" : "extract events →"}
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
              <button type="button" className="btn btn--primary" onClick={insert} disabled={pending || !items.some((it) => it.include)}>
                {pending ? "adding…" : `add ${items.filter((it) => it.include).length} events →`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
