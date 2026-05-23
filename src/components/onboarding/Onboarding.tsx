"use client";

import { useState, useEffect, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import Portfolio from "@/components/Portfolio";
import { Mark } from "@/components/Mark";
import { LAYOUTS, PALETTES } from "@/lib/theme";
import {
  narrateEventsAction,
  createProfileAction,
  insertEventsAction,
  updateThemeAction,
  checkHandleAction,
  type ReviewEvent,
} from "@/lib/actions";
import type { ProfileDTO, MediaItem } from "@/lib/profile";

const M = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const disp = (iso: string, full: boolean) => {
  const [y, mo, d] = iso.split("-").map(Number);
  return full ? `${M[mo - 1]} ${d}, ${y}` : `${M[mo - 1]} ${y}`;
};

type HandleState = "" | "checking" | "ok" | "taken" | "invalid";

export function Onboarding({ name: initialName, image, suggestedHandle }: { name: string; image: string; suggestedHandle: string }) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [handle, setHandle] = useState(suggestedHandle);
  const [bio, setBio] = useState("");
  const [story, setStory] = useState("");
  const [events, setEvents] = useState<ReviewEvent[]>([]);
  const [palette, setPalette] = useState("paper");
  const [layout, setLayout] = useState("timeline");
  const [hstate, setHState] = useState<HandleState>("");
  const [herror, setHError] = useState<string | null>(null);
  const [reading, setReading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publishing, startPublish] = useTransition();

  // debounced handle availability
  useEffect(() => {
    const h = handle.trim().toLowerCase();
    const t = setTimeout(async () => {
      if (!h) { setHState(""); return; }
      setHState("checking");
      try {
        const r = await checkHandleAction(h);
        setHState(r.available ? "ok" : r.error === "taken" ? "taken" : "invalid");
        setHError(r.available ? null : r.error ?? null);
      } catch {
        setHState("invalid");
      }
    }, 400);
    return () => clearTimeout(t);
  }, [handle]);

  async function narrate() {
    if (!story.trim() || reading) return;
    setReading(true);
    setError(null);
    try {
      const evs = await narrateEventsAction(story);
      setEvents((prev) => [...prev, ...evs]);
      setStory("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't read that.");
    } finally {
      setReading(false);
    }
  }

  function publish() {
    setError(null);
    startPublish(async () => {
      const res = await createProfileAction({ handle, name, bio, avatarUrl: image || null });
      if (!res.ok) { setError(res.error); return; }
      if (events.length) await insertEventsAction(events);
      await updateThemeAction({ palette, layout, accentOverride: null });
      router.push(`/${res.username}`);
    });
  }

  const preview: ProfileDTO = useMemo(() => ({
    id: "preview",
    username: handle || "you",
    name: name || "Your name",
    handle: `@${handle || "you"}`,
    bio: bio || "a line about you.",
    status: "",
    location: "",
    about: null,
    avatarUrl: image || null,
    socials: [],
    theme: { palette, layout, accentOverride: null },
    events: events.map((e, i) => ({
      id: `p${i}`,
      dateOn: e.dateOn,
      date: disp(e.dateOn, e.fullDate),
      year: Number(e.dateOn.slice(0, 4)),
      title: e.title,
      tags: e.tags,
      featured: e.featured,
      fullDate: e.fullDate,
      body: e.body,
      icon: null,
      link: null,
      media: e.media as MediaItem[],
    })),
  }), [handle, name, bio, image, palette, layout, events]);

  const canPublish = hstate === "ok" && !!name.trim() && !publishing;

  return (
    <div className="onb">
      <div className="onb__panel">
        <div className="onb__brand"><Mark />logr</div>
        <h1 className="onb__h1">let&apos;s build your logr<span className="onb__caret" /></h1>
        <p className="onb__lead">a few words about you, then tell your story — watch it become a timeline on the right.</p>

        {/* identity */}
        <div className="onb__step">
          <span className="onb__num">01 — you</span>
          <div className="onb__id">
            <span className="onb__avatar">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image} alt="" />
              ) : (
                <span>{(name || "·").charAt(0).toLowerCase()}</span>
              )}
            </span>
            <div className="onb__id__fields">
              <input className="onb__input" value={name} onChange={(e) => setName(e.target.value)} placeholder="your name" />
              <div className="onb__handle">
                <span className="onb__handle__prefix">logr.life/</span>
                <input value={handle} onChange={(e) => setHandle(e.target.value.toLowerCase())} placeholder="handle" />
                <span className={`onb__handle__status onb__handle__status--${hstate}`}>
                  {hstate === "checking" ? "…" : hstate === "ok" ? "available ✓" : hstate === "taken" ? "taken" : herror ?? ""}
                </span>
              </div>
            </div>
          </div>
          <input className="onb__input" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="one-line bio (e.g. a builder, in crypto since 2018)" />
        </div>

        {/* narrate */}
        <div className="onb__step">
          <span className="onb__num">02 — your story <span className="onb__hint">the magic ✶</span></span>
          <textarea className="onb__textarea" rows={5} value={story} onChange={(e) => setStory(e.target.value)} placeholder="In plain words: what you've built, won, shipped — with rough dates and any links. e.g. 'Founded Consenso Labs in 2019. Won the AA hackathon in April 2023 with ZenGuard. Launched brewit in April 2025…'" />
          <div className="onb__row">
            <button type="button" className="onb__btn" onClick={narrate} disabled={reading || !story.trim()}>
              {reading ? "reading…" : events.length ? "+ add more →" : "build my timeline →"}
            </button>
            {events.length > 0 && <span className="onb__count">{events.length} event{events.length > 1 ? "s" : ""} drafted</span>}
          </div>
          {error && <p className="onb__error">{error}</p>}
        </div>

        {/* look */}
        <div className="onb__step">
          <span className="onb__num">03 — look</span>
          <div className="onb__layouts">
            {Object.entries(LAYOUTS).map(([k, l]) => (
              <button key={k} type="button" className="onb__layout" aria-current={layout === k} onClick={() => setLayout(k)}>{l.name}</button>
            ))}
          </div>
          <div className="onb__palettes">
            {Object.entries(PALETTES).map(([k, p]) => (
              <button key={k} type="button" className="onb__pal" aria-current={palette === k} title={p.name} onClick={() => setPalette(k)} style={{ background: p.paper }}>
                <span style={{ background: p.ink }} /><span style={{ background: p.accent }} />
              </button>
            ))}
          </div>
        </div>

        <button type="button" className="onb__publish" onClick={publish} disabled={!canPublish}>
          {publishing ? "publishing…" : "publish & go live →"}
        </button>
        <p className="onb__fineprint">you can edit everything in the dashboard after.</p>
      </div>

      <div className="onb__preview">
        <div className="onb__preview__frame">
          <Portfolio profile={preview} chatEnabled={false} />
        </div>
      </div>
    </div>
  );
}
