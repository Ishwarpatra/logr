// Portfolio — Koshik Raj  (modern timeline / social feed)
const { useState, useEffect, useMemo, useRef, useCallback } = React;

// ---------- DATA (reverse-chronological) ----------
const HIGHLIGHTS = [
  {
    id: 'sage-2026',
    date: 'Apr 2026',
    year: 2026,
    title: 'Built Sage on Solana',
    tag: 'work',
    body:
      "A personal AI co-signer for Solana wallets, built on Squads Protocol and submitted to the Colosseum Frontier hackathon. Live on Solana mainnet from day one — no testnet hand-wringing.",
    link: { label: 'heysage.me', href: 'https://heysage.me' },
    photos: 2,
  },
  {
    id: 'zhentan-2026',
    date: 'Feb 2026',
    year: 2026,
    title: 'Built Zhentan — BNB Hackathon winner',
    tag: 'milestone',
    body:
      "Won top project at the BNB OpenClaw Hackathon out of 600 builders. The community spun up a $ZHENTAN token within hours; it hit a $250k market cap and crossed 150 users in week one. Felt good.",
    link: { label: 'zhentan.me', href: 'https://zhentan.me' },
    photos: 4,
  },
  {
    id: 'devconnect-2025',
    date: 'Nov 2025',
    year: 2025,
    title: 'Presented agentic payments at Devconnect Argentina',
    tag: 'talk',
    body:
      "Nominated by the EF ERC-4337 team to present an agentic payments vision — x402 on smart accounts with delegated access. Buenos Aires in November is a kind of magic.",
    link: { label: 'see the post', href: 'https://x.com/brewitmoney/status/1991485944474517821' },
    photos: 4,
  },
  {
    id: 'brewit-2025',
    date: 'Apr 2025',
    year: 2025,
    title: 'Launched Brewit',
    tag: 'work',
    body:
      "Led the team to build agentic crypto account infrastructure for individuals and teams, powered by Safe. Claude desktop integration, ~5k users, $1.5M in volume, $200k AUM. Still my favourite thing we've shipped.",
    photos: 4,
  },
  {
    id: 'ethindia-2024',
    date: 'Nov 2024',
    year: 2024,
    title: 'Finalist at ETHIndia 2024',
    tag: 'side-quest',
    body:
      "Two sleepless nights in Bengaluru, one stubborn idea, a very good team. Made it to the final stage.",
    photos: 2,
  },
  {
    id: 'aahub-devcon-2024',
    date: 'Nov 2024',
    year: 2024,
    title: 'Smart account delegation at AA Hub Devcon',
    tag: 'talk',
    body:
      "Demoed delegated access for automation on ERC-4337 smart accounts in front of Vitalik Buterin at AA Hub Devcon Bangkok. Tried not to think about who was in the room.",
    link: { label: 'see the post', href: 'https://x.com/brewitmoney/status/1988212787525607823' },
    photos: 2,
  },
  {
    id: 'obra-grant-2024',
    date: 'Feb 2024',
    year: 2024,
    title: 'Received the OBRA Grant from Safe',
    tag: 'milestone',
    body:
      "A grant from Safe to build developer tools for the Module Marketplace on Safe smart accounts. The kind of support that changes a year.",
    photos: 1,
  },
  {
    id: 'ethindia-2023',
    date: 'Nov 2023',
    year: 2023,
    title: 'Finalist at ETHIndia 2023',
    tag: 'side-quest',
    body:
      "Year one of many. The hallway was the best part.",
    photos: 2,
  },
  {
    id: 'zenguard-marketplace-2023',
    date: 'Jun 2023',
    year: 2023,
    title: 'ZenGuard — the Safe Module Marketplace',
    tag: 'work',
    body:
      "Kept building ZenGuard as a module marketplace for Safe smart accounts. A second grant from Safe followed.",
    photos: 1,
  },
  {
    id: 'zenguard-2023',
    date: 'Apr 2023',
    year: 2023,
    title: 'Built ZenGuard — won the AA hackathon',
    tag: 'milestone',
    body:
      "Built ZenGuard and won the Account Abstraction hackathon — a modular authorization layer and marketplace for Safe smart-account plugins. The thread that pulled the next two years.",
    photos: 2,
  },
  {
    id: 'safient-2021',
    date: 'Mar 2021',
    year: 2021,
    title: 'Built Safient',
    tag: 'work',
    body:
      "Co-founded Consenso Labs and built Safient — a non-custodial way to recover and inherit crypto assets using MPC. Passionate team, real problem, the early days of smart-wallet UX.",
    photos: 2,
  },
  {
    id: 'consenso-2019',
    date: 'Jan 2019',
    year: 2019,
    title: 'Founded Consenso Labs',
    tag: 'milestone',
    body:
      "Started a Web3 research and development lab focused on blockchain infrastructure and smart-account tooling. Mostly: a quiet bet that this would matter.",
    photos: 1,
  },
  {
    id: 'amity-2019',
    date: '2019 — 2020',
    year: 2019,
    title: 'Blockchain Faculty — Amity Online',
    tag: 'side-quest',
    body:
      "Part-time faculty for the PGD-BTM blockchain programme at Amity Online. Teaching the thing while learning the thing.",
    photos: 1,
  },
  {
    id: 'book-2019',
    date: '2018 — 2019',
    year: 2018,
    title: 'Authored “Foundations of Blockchain”',
    tag: 'writing',
    body:
      "One of the earliest developer books in crypto, published by Packt. A year of writing discipline after quitting a full-time job to chase this.",
    photos: 1,
  },
  {
    id: 'cowrks-2017',
    date: '2016 — 2017',
    year: 2017,
    title: 'Senior Developer — CoWrks',
    tag: 'work',
    body:
      "Full-stack developer with managerial responsibilities. Led design and build of an internal network-enhancement project.",
    photos: 1,
  },
  {
    id: 'rsa-fte-2016',
    date: 'Jul 2016',
    year: 2016,
    title: 'Software Engineer — RSA Security',
    tag: 'work',
    body:
      "Worked on RSA's flagship network and log analytics tool, Security Analytics. Deployment and operations strategy during active development.",
    photos: 1,
  },
  {
    id: 'rsa-intern-2015',
    date: 'Jul 2015',
    year: 2015,
    title: 'Intern — RSA Security',
    tag: 'work',
    body:
      "First professional experience in information security at one of the most respected names in the field.",
    photos: 1,
  },
  {
    id: 'mtech-2014',
    date: '2014 — 2016',
    year: 2014,
    title: 'MTech — Computer & Information Systems Security',
    tag: 'milestone',
    body:
      "Master of Technology from Manipal Institute of Technology, specialising in Information Assurance and Systems Security. The foundation of everything built since.",
    photos: 1,
  },
];

const TAG_META = {
  all: { label: 'All', emoji: '✦' },
  work: { label: 'Work', emoji: '⚒' },
  milestone: { label: 'Milestone', emoji: '★' },
  talk: { label: 'Talk', emoji: '◉' },
  'side-quest': { label: 'Side quest', emoji: '✺' },
  writing: { label: 'Writing', emoji: '✎' },
};
const ALL_TAGS = ['all', ...Array.from(new Set(HIGHLIGHTS.map((h) => h.tag)))];

const SOCIALS = [
  {
    label: 'X',
    href: 'https://x.com/rajkoshik',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"/>
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com/koshikraj',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.485 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.455-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.339 4.695-4.566 4.943.359.31.678.92.678 1.856 0 1.34-.012 2.42-.012 2.749 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.485 17.523 2 12 2Z"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/koshikraj/',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.024-3.037-1.852-3.037-1.853 0-2.136 1.447-2.136 2.94v5.666H9.351V9h3.414v1.561h.048c.476-.9 1.637-1.852 3.37-1.852 3.601 0 4.268 2.37 4.268 5.455v6.288ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.119 20.452H3.554V9H7.12v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z"/>
      </svg>
    ),
  },
];

// ---------- TWEAK PRESETS ----------
const PALETTES = {
  paper: {
    name: 'Paper',
    bg: '#f5f2eb',
    card: '#fbf9f4',
    cardHover: '#ebe7dc',
    ink: '#1a1815',
    muted: '#7a766b',
    rule: '#dad4c4',
    accent: '#c5532f',
    chipBg: '#1a1815',
    chipFg: '#f5f2eb',
    tagBg: '#ebe7dc',
    tagFg: '#3a382f',
  },
  ink: {
    name: 'Ink',
    bg: '#0d0d10',
    card: '#16161b',
    cardHover: '#1f1f25',
    ink: '#ececea',
    muted: '#8b8b85',
    rule: '#272730',
    accent: '#e8b340',
    chipBg: '#ececea',
    chipFg: '#0d0d10',
    tagBg: '#1f1f25',
    tagFg: '#bcbcb6',
  },
  arctic: {
    name: 'Arctic',
    bg: '#fafafa',
    card: '#ffffff',
    cardHover: '#f1f1f0',
    ink: '#111111',
    muted: '#6f6f6f',
    rule: '#e8e8e6',
    accent: '#2d4cf5',
    chipBg: '#111111',
    chipFg: '#ffffff',
    tagBg: '#f1f1f0',
    tagFg: '#363636',
  },
  citrus: {
    name: 'Citrus',
    bg: '#fef9ec',
    card: '#fffdf5',
    cardHover: '#f7efd2',
    ink: '#1c1a12',
    muted: '#7a755e',
    rule: '#ecd9a4',
    accent: '#d8631f',
    chipBg: '#1c1a12',
    chipFg: '#fef9ec',
    tagBg: '#f7efd2',
    tagFg: '#3d2e0c',
  },
  forest: {
    name: 'Forest',
    bg: '#eef1ea',
    card: '#f6f8f1',
    cardHover: '#e1e7d8',
    ink: '#15201a',
    muted: '#5a6957',
    rule: '#c9d3bc',
    accent: '#3e6b4a',
    chipBg: '#15201a',
    chipFg: '#eef1ea',
    tagBg: '#e1e7d8',
    tagFg: '#293a2d',
  },
  sunset: {
    name: 'Sunset',
    bg: '#fef3ec',
    card: '#fffaf4',
    cardHover: '#fde2cd',
    ink: '#2a1810',
    muted: '#9c7864',
    rule: '#f4ccae',
    accent: '#e25a3c',
    chipBg: '#2a1810',
    chipFg: '#fef3ec',
    tagBg: '#fde2cd',
    tagFg: '#5a2a14',
  },
  lavender: {
    name: 'Lavender',
    bg: '#f5f2fb',
    card: '#fbfaff',
    cardHover: '#ebe5f8',
    ink: '#1f1530',
    muted: '#7a6e95',
    rule: '#dad0ed',
    accent: '#7a4ee0',
    chipBg: '#1f1530',
    chipFg: '#f5f2fb',
    tagBg: '#ebe5f8',
    tagFg: '#3a2860',
  },
  mono: {
    name: 'Mono',
    bg: '#fafaf9',
    card: '#ffffff',
    cardHover: '#eeeeec',
    ink: '#0d0d0c',
    muted: '#7a7a76',
    rule: '#e0e0dd',
    accent: '#0d0d0c',
    chipBg: '#0d0d0c',
    chipFg: '#fafaf9',
    tagBg: '#eeeeec',
    tagFg: '#2a2a28',
  },
  ocean: {
    name: 'Ocean',
    bg: '#eef4f7',
    card: '#f6fafc',
    cardHover: '#dde9f0',
    ink: '#0e1d2a',
    muted: '#5b7286',
    rule: '#c5d6e0',
    accent: '#1a73c4',
    chipBg: '#0e1d2a',
    chipFg: '#eef4f7',
    tagBg: '#dde9f0',
    tagFg: '#1f3a4f',
  },
};

const FONT_PAIRS = {
  modern: {
    name: 'Modern (Geist)',
    display: '"Geist", "Inter Tight", system-ui, sans-serif',
    body: '"Geist", "Inter Tight", system-ui, sans-serif',
    mono: '"Geist Mono", ui-monospace, monospace',
    displayWeight: 600,
    bodyWeight: 400,
    italic: false,
  },
  friendly: {
    name: 'Friendly (Outfit)',
    display: '"Outfit", system-ui, sans-serif',
    body: '"Outfit", system-ui, sans-serif',
    mono: '"Geist Mono", ui-monospace, monospace',
    displayWeight: 600,
    bodyWeight: 400,
    italic: false,
  },
  expressive: {
    name: 'Expressive (Bricolage)',
    display: '"Bricolage Grotesque", "Inter Tight", system-ui, sans-serif',
    body: '"Inter Tight", system-ui, sans-serif',
    mono: '"Geist Mono", ui-monospace, monospace',
    displayWeight: 600,
    bodyWeight: 400,
    italic: false,
  },
  classic: {
    name: 'Classic (Inter)',
    display: '"Inter Tight", system-ui, sans-serif',
    body: '"Inter Tight", system-ui, sans-serif',
    mono: '"Geist Mono", ui-monospace, monospace',
    displayWeight: 600,
    bodyWeight: 400,
    italic: false,
  },
};

// ---------- HELPERS ----------
function PhotoGrid({ count, id, rounded }) {
  const slots = Array.from({ length: count }, (_, i) => i);
  let gridStyle;
  if (count === 1) {
    gridStyle = { gridTemplateColumns: '1fr', aspectRatio: '16 / 10' };
  } else if (count === 2) {
    gridStyle = { gridTemplateColumns: '1fr 1fr', aspectRatio: '16 / 9' };
  } else {
    gridStyle = {
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '1fr 1fr',
      aspectRatio: '4 / 3',
    };
  }
  return (
    <div className={`photo-grid ${rounded ? 'photo-grid--rounded' : ''}`} style={{ display: 'grid', gap: 6, ...gridStyle }}>
      {slots.map((i) => (
        <image-slot
          key={i}
          id={`${id}-photo-${i}`}
          shape="rect"
          placeholder={count === 1 ? 'Drop a photo' : `${i + 1}`}
          style={{ width: '100%', height: '100%' }}
        ></image-slot>
      ))}
    </div>
  );
}

// ---------- POST (timeline entry) ----------
function Post({ h, isFirst, isLast, isFocused, rounded, dotStyle, side }) {
  const tag = TAG_META[h.tag] || { label: h.tag };
  return (
    <article
      className={`post post--side-${side || 'right'} ${isFocused ? 'is-focused' : ''}`}
      data-tag={h.tag}
      id={`entry-${h.id}`}
    >
      <div className={`post__rail ${isFirst ? 'is-first' : ''} ${isLast ? 'is-last' : ''}`} aria-hidden="true">
        <Dot style={dotStyle} tag={h.tag} />
      </div>

      <div className="post__content">
        <div className="post__meta">
          <span className="post__date">{h.date}</span>
          <span className="post__sep">·</span>
          <span className="post__tag">{tag.label}</span>
        </div>
        <h2 className="post__title">{h.title}</h2>
        <p className="post__body">{h.body}</p>
        {h.photos > 0 && (
          <div className="post__photos">
            <PhotoGrid count={h.photos} id={h.id} rounded={rounded} />
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
    </article>
  );
}

function Dot({ style, tag }) {
  if (style === 'icon') {
    const glyph = TAG_META[tag]?.emoji || '●';
    return <span className="post__dot post__dot--icon">{glyph}</span>;
  }
  return <span className={`post__dot post__dot--${style || 'circle'}`} />;
}

// ---------- APP ----------
function App() {
  const [tw, setTweak] = window.useTweaks(window.TWEAK_DEFAULTS);
  const lightPalette = PALETTES[tw.palette] || PALETTES.paper;
  const palette = tw.dark
    ? { ...PALETTES.ink, accent: tw.accentOverride || lightPalette.accent }
    : lightPalette;
  const fonts = FONT_PAIRS[tw.fonts] || FONT_PAIRS.modern;

  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty('--bg', palette.bg);
    r.style.setProperty('--card', palette.card);
    r.style.setProperty('--card-hover', palette.cardHover);
    r.style.setProperty('--ink', palette.ink);
    r.style.setProperty('--muted', palette.muted);
    r.style.setProperty('--rule', palette.rule);
    r.style.setProperty('--accent', tw.accentOverride || palette.accent);
    r.style.setProperty('--chip-bg', palette.chipBg);
    r.style.setProperty('--chip-fg', palette.chipFg);
    r.style.setProperty('--tag-bg', palette.tagBg);
    r.style.setProperty('--tag-fg', palette.tagFg);
    r.style.setProperty('--font-display', fonts.display);
    r.style.setProperty('--font-body', fonts.body);
    r.style.setProperty('--font-mono', fonts.mono);
    r.style.setProperty('--display-weight', fonts.displayWeight);
    r.style.setProperty('--body-weight', fonts.bodyWeight);
    r.style.setProperty('--radius', tw.rounded ? '14px' : '4px');
    r.style.setProperty('--radius-sm', tw.rounded ? '8px' : '2px');
    r.dataset.postStyle = tw.postStyle || 'feed';
    r.dataset.photoHover = tw.photoHover || 'lift';
  }, [tw, palette, fonts]);

  const [filter, setFilter] = useState('all');
  const visible = useMemo(
    () => HIGHLIGHTS.filter((h) => filter === 'all' || h.tag === filter),
    [filter]
  );

  // Group by year while preserving order
  const grouped = useMemo(() => {
    const out = [];
    let lastYear = null;
    visible.forEach((h, i) => {
      if (h.year !== lastYear) {
        out.push({ type: 'year', year: h.year });
        lastYear = h.year;
      }
      out.push({ type: 'item', h, isFirst: i === 0, isLast: i === visible.length - 1 });
    });
    return out;
  }, [visible]);

  // j/k keyboard nav
  const [focusedIdx, setFocusedIdx] = useState(0);
  const scrollToIdx = useCallback((next) => {
    const clamped = Math.max(0, Math.min(visible.length - 1, next));
    setFocusedIdx(clamped);
    const id = visible[clamped]?.id;
    if (id) {
      const el = document.getElementById(`entry-${id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [visible]);

  useEffect(() => {
    const onKey = (e) => {
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'j' || e.key === 'ArrowDown') { e.preventDefault(); scrollToIdx(focusedIdx + 1); }
      else if (e.key === 'k' || e.key === 'ArrowUp') { e.preventDefault(); scrollToIdx(focusedIdx - 1); }
      else if (e.key === 'g') scrollToIdx(0);
      else if (e.key === 'G') scrollToIdx(visible.length - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [focusedIdx, scrollToIdx, visible.length]);

  useEffect(() => { setFocusedIdx(0); }, [filter]);

  return (
    <div className="page">
      <Profile />

      <main className="feed">
        <Filters filter={filter} setFilter={setFilter} count={visible.length} tw={tw} setTweak={setTweak} />

        <div className={`timeline timeline--${tw.postStyle || 'feed'}`}>
          {(() => {
            let postIdx = 0;
            return grouped.map((row) => {
              if (row.type === 'year') {
                return <YearChip key={`y-${row.year}`} year={row.year} />;
              }
              const side = tw.postStyle === 'centered' ? (postIdx % 2 === 0 ? 'right' : 'left') : 'right';
              postIdx += 1;
              return (
                <Post
                  key={row.h.id}
                  h={row.h}
                  isFirst={row.isFirst}
                  isLast={row.isLast}
                  isFocused={visible[focusedIdx]?.id === row.h.id}
                  rounded={tw.rounded}
                  dotStyle={tw.dotStyle}
                  side={side}
                />
              );
            });
          })()}
        </div>

        <About />
      </main>

      <Footer />
      <KeyboardHint />
      <PortfolioTweaks tw={tw} setTweak={setTweak} />
    </div>
  );
}

function Profile() {
  return (
    <header className="profile">
      <div className="profile__avatar">
        <image-slot id="profile-avatar" shape="circle" placeholder="Drop avatar"></image-slot>
      </div>
      <h1 className="profile__name">Koshik Raj</h1>
      <p className="profile__handle">@rajkoshik</p>
      <p className="profile__bio">
        Deep into crypto since 2018, with a background in information security.
        <br />
        Always a builder at heart — full of caffeine.
      </p>
      <div className="profile__row">
        <span className="profile__status">
          <span className="profile__dot" aria-hidden="true"></span>
          Building <em>Sage</em> — a co-pilot for every crypto move
        </span>
      </div>
      <div className="profile__row">
        <span className="profile__loc">📍 Bengaluru, India</span>
        <nav className="profile__socials" aria-label="Elsewhere">
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} title={s.label}>
              {s.icon}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Filters({ filter, setFilter, count, tw, setTweak }) {
  return (
    <div className="filters">
      <div className="filters__chips">
        {ALL_TAGS.map((tag) => (
          <button
            key={tag}
            className={`chip ${filter === tag ? 'chip--on' : ''}`}
            onClick={() => setFilter(tag)}
          >
            {TAG_META[tag]?.label || tag}
          </button>
        ))}
      </div>
      <div className="filters__controls">
        <StylePicker value={tw.postStyle} onChange={(v) => setTweak('postStyle', v)} />
        <ThemeToggle dark={!!tw.dark} onChange={(v) => setTweak('dark', v)} />
      </div>
    </div>
  );
}

// --- inline icons for the style picker ---
const STYLE_ICONS = {
  feed: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="4" cy="4" r="1.5" fill="currentColor"/>
      <rect x="7" y="3" width="7" height="2" rx="1" fill="currentColor"/>
      <circle cx="4" cy="8" r="1.5" fill="currentColor"/>
      <rect x="7" y="7" width="6" height="2" rx="1" fill="currentColor"/>
      <circle cx="4" cy="12" r="1.5" fill="currentColor"/>
      <rect x="7" y="11" width="5" height="2" rx="1" fill="currentColor"/>
    </svg>
  ),
  card: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="12" height="4" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="2" y="7" width="12" height="4" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="2" y="12" width="12" height="2.5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  ),
  centered: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <line x1="8" y1="1" x2="8" y2="15" stroke="currentColor" strokeWidth="1"/>
      <rect x="1" y="2" width="5" height="3" fill="currentColor"/>
      <rect x="10" y="6.5" width="5" height="3" fill="currentColor"/>
      <rect x="1" y="11" width="5" height="3" fill="currentColor"/>
      <circle cx="8" cy="3.5" r="1.2" fill="currentColor"/>
      <circle cx="8" cy="8" r="1.2" fill="currentColor"/>
      <circle cx="8" cy="12.5" r="1.2" fill="currentColor"/>
    </svg>
  ),
  terminal: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.5" y="2.5" width="13" height="11" rx="1" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M4 7L6.5 8.5L4 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="8" y1="10" x2="12" y2="10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  polaroid: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2.5" y="2" width="11" height="12" rx="0.5" stroke="currentColor" strokeWidth="1.3" transform="rotate(-3 8 8)"/>
      <rect x="4" y="3.5" width="8" height="6" fill="currentColor" transform="rotate(-3 8 8)"/>
    </svg>
  ),
  magazine: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="12" height="5" fill="currentColor"/>
      <rect x="2" y="8" width="10" height="1.5" fill="currentColor"/>
      <rect x="2" y="10.5" width="12" height="1" fill="currentColor" opacity="0.5"/>
      <rect x="2" y="12.5" width="12" height="1" fill="currentColor" opacity="0.5"/>
    </svg>
  ),
};

const STYLE_OPTIONS = [
  { value: 'feed', label: 'Feed' },
  { value: 'card', label: 'Card' },
  { value: 'centered', label: 'Centered' },
  { value: 'terminal', label: 'Terminal' },
  { value: 'polaroid', label: 'Polaroid' },
  { value: 'magazine', label: 'Magazine' },
];

function StylePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const current = STYLE_OPTIONS.find((s) => s.value === value) || STYLE_OPTIONS[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
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
          <path d="M2 4L5 7L8 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div className="style-picker__menu" role="listbox">
          {STYLE_OPTIONS.map((s) => (
            <button
              key={s.value}
              role="option"
              aria-selected={s.value === value}
              className={`style-picker__opt ${s.value === value ? 'is-on' : ''}`}
              onClick={() => { onChange(s.value); setOpen(false); }}
            >
              <span className="style-picker__icon">{STYLE_ICONS[s.value]}</span>
              <span>{s.label}</span>
              {s.value === value && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ marginLeft: 'auto' }}>
                  <path d="M2.5 6L5 8.5L9.5 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ThemeToggle({ dark, onChange }) {
  return (
    <button
      className="theme-toggle"
      onClick={() => onChange(!dark)}
      aria-pressed={dark}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="theme-toggle__icon" aria-hidden="true">
        {dark ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.4"/>
            <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <line x1="8" y1="1.5" x2="8" y2="3"/>
              <line x1="8" y1="13" x2="8" y2="14.5"/>
              <line x1="1.5" y1="8" x2="3" y2="8"/>
              <line x1="13" y1="8" x2="14.5" y2="8"/>
              <line x1="3.3" y1="3.3" x2="4.3" y2="4.3"/>
              <line x1="11.7" y1="11.7" x2="12.7" y2="12.7"/>
              <line x1="3.3" y1="12.7" x2="4.3" y2="11.7"/>
              <line x1="11.7" y1="4.3" x2="12.7" y2="3.3"/>
            </g>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M13 9.5A5.5 5.5 0 016.5 3a5.5 5.5 0 107 6.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
          </svg>
        )}
      </span>
    </button>
  );
}

function YearChip({ year }) {
  return (
    <div className="year-chip" id={`year-${year}`}>
      <span className="year-chip__line" />
      <span className="year-chip__pill">{year}</span>
      <span className="year-chip__line" />
    </div>
  );
}

function About() {
  return (
    <section className="about" id="about">
      <h2 className="about__title">A little more</h2>
      <p>
        I have been building in crypto since 2018. Before that, I spent years inside
        information security — first as an intern, then a software engineer at RSA —
        which is where I learned to love hard problems and paranoid systems thinking.
      </p>
      <p>
        In 2019 I founded <strong>Consenso Labs</strong>, a small R&amp;D lab for blockchain
        infrastructure and smart-account tooling. Since then I have shipped
        <em> Safient</em>, <em> ZenGuard</em>, <em> Brewit</em>, <em> Zhentan</em>, and most
        recently <em> Sage</em> — a personal AI co-signer for Solana wallets, live on mainnet
        from day one.
      </p>
      <p>
        Along the way: a developer book with Packt, two grants from Safe, two ETHIndia
        finals, talks at Devcon and Devconnect, and one really loud hackathon win at
        BNB OpenClaw.
      </p>
      <p className="about__cta">
        If you are working on smart accounts, agentic crypto, or the uncomfortable middle
        ground between AI and on-chain identity — <a href="https://x.com/rajkoshik" target="_blank" rel="noopener noreferrer">say hi</a>.
      </p>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <span>© 2026 Koshik Raj</span>
      <span className="footer__center">
        {SOCIALS.map((s, i) => (
          <React.Fragment key={s.label}>
            <a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
            {i < SOCIALS.length - 1 && <span aria-hidden="true">·</span>}
          </React.Fragment>
        ))}
      </span>
      <span>Updated Apr 2026</span>
    </footer>
  );
}

function KeyboardHint() {
  const [shown, setShown] = useState(true);
  useEffect(() => {
    const seen = sessionStorage.getItem('kbd-hint-seen-v2');
    if (seen) { setShown(false); return; }
    const t = setTimeout(() => { setShown(false); sessionStorage.setItem('kbd-hint-seen-v2', '1'); }, 6500);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className={`kbd-hint ${shown ? '' : 'kbd-hint--hidden'}`} aria-hidden={!shown}>
      <kbd>J</kbd><kbd>K</kbd> to scroll the timeline
    </div>
  );
}

// ---------- TWEAKS PANEL ----------
function PortfolioTweaks({ tw, setTweak }) {
  const { TweaksPanel, TweakSection, TweakColor, TweakRadio, TweakSelect, TweakToggle } = window;
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Palette">
        <TweakSelect
          label="Mood"
          value={tw.palette}
          onChange={(v) => setTweak('palette', v)}
          options={[
            { value: 'paper', label: 'Paper (warm)' },
            { value: 'arctic', label: 'Arctic (white)' },
            { value: 'ink', label: 'Ink (dark)' },
            { value: 'mono', label: 'Mono (greyscale)' },
            { value: 'citrus', label: 'Citrus (warm bright)' },
            { value: 'sunset', label: 'Sunset (peach)' },
            { value: 'forest', label: 'Forest (sage)' },
            { value: 'ocean', label: 'Ocean (blue)' },
            { value: 'lavender', label: 'Lavender (purple)' },
          ]}
        />
        <TweakColor
          label="Accent"
          value={tw.accentOverride}
          onChange={(v) => setTweak('accentOverride', v)}
          options={['#c5532f', '#2d4cf5', '#e8b340', '#3e6b4a', '#d8631f', '#7a4ee0', '#1a73c4', '#e25a3c', '#0d0d0c']}
        />
      </TweakSection>

      <TweakSection label="Typography">
        <TweakSelect
          label="Font"
          value={tw.fonts}
          onChange={(v) => setTweak('fonts', v)}
          options={[
            { value: 'modern', label: 'Modern (Geist)' },
            { value: 'friendly', label: 'Friendly (Outfit)' },
            { value: 'expressive', label: 'Expressive (Bricolage)' },
            { value: 'classic', label: 'Classic (Inter)' },
          ]}
        />
      </TweakSection>

      <TweakSection label="Layout">
        <TweakSelect
          label="Style"
          value={tw.postStyle}
          onChange={(v) => setTweak('postStyle', v)}
          options={[
            { value: 'feed', label: 'Feed (default)' },
            { value: 'card', label: 'Card (elevated)' },
            { value: 'centered', label: 'Centered (alternating)' },
            { value: 'terminal', label: 'Terminal (mono)' },
            { value: 'polaroid', label: 'Polaroid (scrapbook)' },
            { value: 'magazine', label: 'Magazine (editorial)' },
          ]}
        />
        <TweakRadio
          label="Dot"
          value={tw.dotStyle}
          onChange={(v) => setTweak('dotStyle', v)}
          options={[
            { value: 'circle', label: 'Circle' },
            { value: 'square', label: 'Square' },
            { value: 'icon', label: 'Icon' },
          ]}
        />
      </TweakSection>

      <TweakSection label="Style">
        <TweakToggle
          label="Rounded corners"
          value={tw.rounded}
          onChange={(v) => setTweak('rounded', v)}
        />
        <TweakRadio
          label="Photo hover"
          value={tw.photoHover}
          onChange={(v) => setTweak('photoHover', v)}
          options={[
            { value: 'lift', label: 'Lift' },
            { value: 'zoom', label: 'Zoom' },
            { value: 'none', label: 'None' },
          ]}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

Object.assign(window, { App });
