"use client";

// Faithful port of design/portfolio.jsx — data now arrives via props.
import {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  Fragment,
  type ReactNode,
} from "react";
import { motion, AnimatePresence, MotionConfig, type Variants } from "framer-motion";
import type { ProfileDTO, HighlightDTO, Social } from "@/lib/profile";
import { Lightbox } from "@/components/ui/Lightbox";
import {
  TAG_META,
  themeCssVars,
  type Theme,
  type PostStyle,
  type DotStyle,
} from "@/lib/theme";
import { isImageIcon } from "@/lib/icon";

// Shared motion config — easing mirrors the design's cubic-bezier(.2,.8,.2,1).
const EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];
const riseIn: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};
const VIEWPORT = { once: true, amount: 0.25, margin: "0px 0px -8% 0px" } as const;

const SOCIAL_ICONS: Record<string, ReactNode> = {
  X: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  ),
  GitHub: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.485 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.455-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.339 4.695-4.566 4.943.359.31.678.92.678 1.856 0 1.34-.012 2.42-.012 2.749 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.485 17.523 2 12 2Z" />
    </svg>
  ),
  LinkedIn: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.024-3.037-1.852-3.037-1.853 0-2.136 1.447-2.136 2.94v5.666H9.351V9h3.414v1.561h.048c.476-.9 1.637-1.852 3.37-1.852 3.601 0 4.268 2.37 4.268 5.455v6.288ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.119 20.452H3.554V9H7.12v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
    </svg>
  ),
};

// ---------- PHOTO GRID ----------
function PhotoGrid({ images, rounded }: { images: string[]; rounded: boolean }) {
  const count = images.length;
  const [viewer, setViewer] = useState<number | null>(null);
  let gridStyle: React.CSSProperties;
  if (count === 1) {
    gridStyle = { gridTemplateColumns: "1fr", aspectRatio: "16 / 10" };
  } else if (count === 2) {
    gridStyle = { gridTemplateColumns: "1fr 1fr", aspectRatio: "16 / 9" };
  } else {
    gridStyle = {
      gridTemplateColumns: "1fr 1fr",
      gridTemplateRows: "1fr 1fr",
      aspectRatio: "4 / 3",
    };
  }
  return (
    <>
      <div
        className={`photo-grid ${rounded ? "photo-grid--rounded" : ""}`}
        style={{ display: "grid", gap: 6, ...gridStyle }}
      >
        {images.map((url, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            className="photo-slot"
            src={url}
            alt=""
            role="button"
            tabIndex={0}
            aria-label="View image"
            style={{ cursor: "zoom-in" }}
            onClick={() => setViewer(i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setViewer(i);
              }
            }}
          />
        ))}
      </div>
      <AnimatePresence>
        {viewer !== null && (
          <Lightbox images={images} startIndex={viewer} onClose={() => setViewer(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

// ---------- DOT ----------
function Dot({ style, tag }: { style: DotStyle; tag: string }) {
  if (style === "icon") {
    const glyph = TAG_META[tag]?.emoji || "●";
    return <span className="post__dot post__dot--icon">{glyph}</span>;
  }
  return <span className={`post__dot post__dot--${style || "circle"}`} />;
}

// ---------- POST ----------
function Post({
  h,
  isFirst,
  isLast,
  isFocused,
  rounded,
  dotStyle,
  side,
}: {
  h: HighlightDTO;
  isFirst: boolean;
  isLast: boolean;
  isFocused: boolean;
  rounded: boolean;
  dotStyle: DotStyle;
  side: "left" | "right";
}) {
  const tag = TAG_META[h.tag] || { label: h.tag };
  return (
    <motion.article
      className={`post post--side-${side} ${isFocused ? "is-focused" : ""}`}
      data-tag={h.tag}
      id={`entry-${h.id}`}
      variants={riseIn}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      <div
        className={`post__rail ${isFirst ? "is-first" : ""} ${isLast ? "is-last" : ""}`}
        aria-hidden="true"
      >
        <Dot style={dotStyle} tag={h.tag} />
      </div>

      <div className="post__content">
        <div className="post__meta">
          <span className="post__date">{h.date}</span>
          <span className="post__sep">·</span>
          <span className="post__tag">{tag.label}</span>
        </div>
        <div className="post__heading">
          {h.icon &&
            (isImageIcon(h.icon) ? (
              <span className="post__icon">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={h.icon} alt="" />
              </span>
            ) : (
              <span className="post__icon post__icon--emoji" aria-hidden="true">
                {h.icon}
              </span>
            ))}
          <h2 className="post__title">{h.title}</h2>
        </div>
        <p className="post__body">{h.body}</p>
        {h.images.length > 0 && (
          <div className="post__photos">
            <PhotoGrid images={h.images} rounded={rounded} />
          </div>
        )}
        {h.link && (
          <a className="post__link" href={h.link.href} target="_blank" rel="noopener noreferrer">
            <span>{h.link.label}</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M3 11L11 3M11 3H4.5M11 3V9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        )}
      </div>
    </motion.article>
  );
}

// ---------- PROFILE HEADER ----------
function ProfileHeader({ profile }: { profile: ProfileDTO }) {
  const bioLines = profile.bio.split("\n");
  return (
    <motion.header
      className="profile"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE }}
    >
      <div className="profile__avatar">
        {profile.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.avatarUrl} alt={profile.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span
            aria-hidden="true"
            style={{
              display: "flex",
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 40,
              color: "var(--muted)",
              background: "var(--card-hover)",
            }}
          >
            {profile.name.trim().charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <h1 className="profile__name">{profile.name}</h1>
      <p className="profile__handle">{profile.handle}</p>
      <p className="profile__bio">
        {bioLines.map((line, i) => (
          <Fragment key={i}>
            {line}
            {i < bioLines.length - 1 && <br />}
          </Fragment>
        ))}
      </p>
      {profile.status && (
        <div className="profile__row">
          <span className="profile__status">
            <span className="profile__dot" aria-hidden="true" />
            {profile.status}
          </span>
        </div>
      )}
      <div className="profile__row">
        {profile.location && <span className="profile__loc">📍 {profile.location}</span>}
        <nav className="profile__socials" aria-label="Elsewhere">
          {profile.socials.map((s: Social) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} title={s.label}>
              {SOCIAL_ICONS[s.label] ?? s.label[0]}
            </a>
          ))}
        </nav>
      </div>
    </motion.header>
  );
}

// ---------- YEAR CHIP ----------
function YearChip({ year }: { year: number }) {
  return (
    <motion.div
      className="year-chip"
      id={`year-${year}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <span className="year-chip__line" />
      <span className="year-chip__pill">{year}</span>
      <span className="year-chip__line" />
    </motion.div>
  );
}

// ---------- STYLE PICKER ----------
const STYLE_OPTIONS: { value: PostStyle; label: string }[] = [
  { value: "feed", label: "Feed" },
  { value: "card", label: "Card" },
  { value: "centered", label: "Centered" },
  { value: "terminal", label: "Terminal" },
  { value: "polaroid", label: "Polaroid" },
  { value: "magazine", label: "Magazine" },
];

const STYLE_ICONS: Record<PostStyle, ReactNode> = {
  feed: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="4" cy="4" r="1.5" fill="currentColor" />
      <rect x="7" y="3" width="7" height="2" rx="1" fill="currentColor" />
      <circle cx="4" cy="8" r="1.5" fill="currentColor" />
      <rect x="7" y="7" width="6" height="2" rx="1" fill="currentColor" />
      <circle cx="4" cy="12" r="1.5" fill="currentColor" />
      <rect x="7" y="11" width="5" height="2" rx="1" fill="currentColor" />
    </svg>
  ),
  card: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="12" height="4" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="2" y="7" width="12" height="4" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="2" y="12" width="12" height="2.5" rx="1" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  ),
  centered: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <line x1="8" y1="1" x2="8" y2="15" stroke="currentColor" strokeWidth="1" />
      <rect x="1" y="2" width="5" height="3" fill="currentColor" />
      <rect x="10" y="6.5" width="5" height="3" fill="currentColor" />
      <rect x="1" y="11" width="5" height="3" fill="currentColor" />
      <circle cx="8" cy="3.5" r="1.2" fill="currentColor" />
      <circle cx="8" cy="8" r="1.2" fill="currentColor" />
      <circle cx="8" cy="12.5" r="1.2" fill="currentColor" />
    </svg>
  ),
  terminal: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.5" y="2.5" width="13" height="11" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4 7L6.5 8.5L4 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="8" y1="10" x2="12" y2="10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  polaroid: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2.5" y="2" width="11" height="12" rx="0.5" stroke="currentColor" strokeWidth="1.3" transform="rotate(-3 8 8)" />
      <rect x="4" y="3.5" width="8" height="6" fill="currentColor" transform="rotate(-3 8 8)" />
    </svg>
  ),
  magazine: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="12" height="5" fill="currentColor" />
      <rect x="2" y="8" width="10" height="1.5" fill="currentColor" />
      <rect x="2" y="10.5" width="12" height="1" fill="currentColor" opacity="0.5" />
      <rect x="2" y="12.5" width="12" height="1" fill="currentColor" opacity="0.5" />
    </svg>
  ),
};

function StylePicker({ value, onChange }: { value: PostStyle; onChange: (v: PostStyle) => void }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const current = STYLE_OPTIONS.find((s) => s.value === value) || STYLE_OPTIONS[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: Event) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [open]);

  return (
    <div className="style-picker" ref={wrapRef}>
      <button
        className="style-picker__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        title="Change style"
      >
        <span className="style-picker__icon">{STYLE_ICONS[current.value]}</span>
        <span className="style-picker__label">{current.label}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M2 4L5 7L8 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="style-picker__menu" role="listbox">
          {STYLE_OPTIONS.map((s) => (
            <button
              key={s.value}
              role="option"
              aria-selected={s.value === value}
              className={`style-picker__opt ${s.value === value ? "is-on" : ""}`}
              onClick={() => {
                onChange(s.value);
                setOpen(false);
              }}
            >
              <span className="style-picker__icon">{STYLE_ICONS[s.value]}</span>
              <span>{s.label}</span>
              {s.value === value && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ marginLeft: "auto" }}>
                  <path d="M2.5 6L5 8.5L9.5 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ThemeToggle({ dark, onChange }: { dark: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      className="theme-toggle"
      onClick={() => onChange(!dark)}
      aria-pressed={dark}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="theme-toggle__icon" aria-hidden="true">
        {dark ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.4" />
            <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <line x1="8" y1="1.5" x2="8" y2="3" />
              <line x1="8" y1="13" x2="8" y2="14.5" />
              <line x1="1.5" y1="8" x2="3" y2="8" />
              <line x1="13" y1="8" x2="14.5" y2="8" />
              <line x1="3.3" y1="3.3" x2="4.3" y2="4.3" />
              <line x1="11.7" y1="11.7" x2="12.7" y2="12.7" />
              <line x1="3.3" y1="12.7" x2="4.3" y2="11.7" />
              <line x1="11.7" y1="4.3" x2="12.7" y2="3.3" />
            </g>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M13 9.5A5.5 5.5 0 016.5 3a5.5 5.5 0 107 6.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
        )}
      </span>
    </button>
  );
}

function Filters({
  tags,
  filter,
  setFilter,
  theme,
  setTweak,
}: {
  tags: string[];
  filter: string;
  setFilter: (t: string) => void;
  theme: Theme;
  setTweak: <K extends keyof Theme>(k: K, v: Theme[K]) => void;
}) {
  return (
    <div className="filters">
      <div className="filters__chips">
        {tags.map((tag) => (
          <button
            key={tag}
            className={`chip ${filter === tag ? "chip--on" : ""}`}
            onClick={() => setFilter(tag)}
          >
            {TAG_META[tag]?.label || tag}
          </button>
        ))}
      </div>
      <div className="filters__controls">
        <StylePicker value={theme.postStyle} onChange={(v) => setTweak("postStyle", v)} />
        <ThemeToggle dark={theme.dark} onChange={(v) => setTweak("dark", v)} />
      </div>
    </div>
  );
}

function About({ profile }: { profile: ProfileDTO }) {
  if (!profile.about) return null;
  const paras = profile.about.split("\n\n");
  return (
    <section className="about" id="about">
      <h2 className="about__title">A little more</h2>
      {paras.map((p, i) => (
        <p key={i} className={i === paras.length - 1 ? "about__cta" : undefined}>
          {p}
        </p>
      ))}
    </section>
  );
}

function Footer({ profile }: { profile: ProfileDTO }) {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <span>© {year} {profile.name}</span>
      <span className="footer__center">
        {profile.socials.map((s, i) => (
          <Fragment key={s.label}>
            <a href={s.href} target="_blank" rel="noopener noreferrer">
              {s.label}
            </a>
            {i < profile.socials.length - 1 && <span aria-hidden="true">·</span>}
          </Fragment>
        ))}
      </span>
      <span>Updated {profile.highlights[0]?.date ?? ""}</span>
    </footer>
  );
}

function KeyboardHint() {
  const [shown, setShown] = useState(true);
  useEffect(() => {
    const seen = sessionStorage.getItem("kbd-hint-seen-v2");
    if (seen) {
      setShown(false);
      return;
    }
    const t = setTimeout(() => {
      setShown(false);
      sessionStorage.setItem("kbd-hint-seen-v2", "1");
    }, 6500);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className={`kbd-hint ${shown ? "" : "kbd-hint--hidden"}`} aria-hidden={!shown}>
      <kbd>J</kbd>
      <kbd>K</kbd> to scroll the timeline
    </div>
  );
}

// ---------- ROOT ----------
export default function Portfolio({ profile }: { profile: ProfileDTO }) {
  const [theme, setTheme] = useState<Theme>(profile.theme);
  const setTweak = useCallback(
    <K extends keyof Theme>(key: K, value: Theme[K]) =>
      setTheme((prev) => ({ ...prev, [key]: value })),
    []
  );

  // Apply CSS variables + data attributes to <html>, mirroring the prototype.
  useEffect(() => {
    const r = document.documentElement;
    const vars = themeCssVars(theme);
    for (const [k, v] of Object.entries(vars)) r.style.setProperty(k, v);
    r.dataset.postStyle = theme.postStyle;
    r.dataset.photoHover = theme.photoHover;
  }, [theme]);

  const tags = useMemo(
    () => ["all", ...Array.from(new Set(profile.highlights.map((h) => h.tag)))],
    [profile.highlights]
  );

  const [filter, setFilter] = useState("all");
  const visible = useMemo(
    () => profile.highlights.filter((h) => filter === "all" || h.tag === filter),
    [filter, profile.highlights]
  );

  const grouped = useMemo(() => {
    const out: Array<
      | { type: "year"; year: number }
      | { type: "item"; h: HighlightDTO; isFirst: boolean; isLast: boolean }
    > = [];
    let lastYear: number | null = null;
    visible.forEach((h, i) => {
      if (h.year !== lastYear) {
        out.push({ type: "year", year: h.year });
        lastYear = h.year;
      }
      out.push({ type: "item", h, isFirst: i === 0, isLast: i === visible.length - 1 });
    });
    return out;
  }, [visible]);

  // j/k keyboard nav
  const [focusedIdx, setFocusedIdx] = useState(0);
  const scrollToIdx = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(visible.length - 1, next));
      setFocusedIdx(clamped);
      const id = visible[clamped]?.id;
      if (id) {
        document.getElementById(`entry-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    },
    [visible]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "j" || e.key === "ArrowDown") {
        e.preventDefault();
        scrollToIdx(focusedIdx + 1);
      } else if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault();
        scrollToIdx(focusedIdx - 1);
      } else if (e.key === "g") scrollToIdx(0);
      else if (e.key === "G") scrollToIdx(visible.length - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusedIdx, scrollToIdx, visible.length]);

  useEffect(() => setFocusedIdx(0), [filter]);

  let postIdx = 0;
  return (
    <MotionConfig reducedMotion="user">
      <div data-post-style={theme.postStyle} data-photo-hover={theme.photoHover}>
      <div className="page">
        <ProfileHeader profile={profile} />

        <main className="feed">
          <Filters tags={tags} filter={filter} setFilter={setFilter} theme={theme} setTweak={setTweak} />

          <div className={`timeline timeline--${theme.postStyle}`}>
            {grouped.map((row) => {
              if (row.type === "year") return <YearChip key={`y-${row.year}`} year={row.year} />;
              const side: "left" | "right" =
                theme.postStyle === "centered" ? (postIdx % 2 === 0 ? "right" : "left") : "right";
              postIdx += 1;
              return (
                <Post
                  key={row.h.id}
                  h={row.h}
                  isFirst={row.isFirst}
                  isLast={row.isLast}
                  isFocused={visible[focusedIdx]?.id === row.h.id}
                  rounded={theme.rounded}
                  dotStyle={theme.dotStyle}
                  side={side}
                />
              );
            })}
          </div>

          <About profile={profile} />
        </main>
      </div>

      <Footer profile={profile} />
      <KeyboardHint />
      </div>
    </MotionConfig>
  );
}
