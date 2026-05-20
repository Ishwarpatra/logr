# logr

**A personal portfolio + AI context layer.** Most people have a LinkedIn. Nobody has a structured, machine-readable, queryable version of their story that works with any AI tool. logr fills that gap — a personal timeline portfolio that is beautiful for humans to read and structured for AI to query.

You add your story once. It becomes:

- a **timeline** for visitors,
- an exportable **`llm.txt`** for AI tools, and
- eventually a live **chat interface** where anyone can ask your portfolio questions directly.

---

## What makes it different

- **LinkedIn** forces a linear job-history format. It doesn't support side quests, hackathon wins, community moments, or the non-linear paths that builders actually have.
- **Read.cv and Polywork** are closer, but neither exports a machine-readable context file nor has a built-in AI chat layer.
- **The `llm.txt` angle is the real moat.** As people use AI assistants for hiring, investor research, and personal branding, a structured context file any agent can consume becomes genuinely valuable. logr is built natively for the AI-native era.

The intersection of three growing trends — personal branding for builders, AI-native tooling, and structured context files like `llm.txt` — is where this product sits.

---

## The design (from the handoff)

The product UI is a **modern timeline / social feed**: a centered single-column profile header followed by a reverse-chronological, year-grouped timeline of highlights, an "About" section, and a footer. Keyboard navigation (`j`/`k`, `g`/`G`) scrolls between entries.

The design ships a live **theming system** — these are the customization knobs each portfolio owner gets, not just build-time choices.

### Palettes (9 + dark)

`paper` (warm), `arctic` (white), `ink` (dark), `mono` (greyscale), `citrus` (warm bright), `sunset` (peach), `forest` (sage), `ocean` (blue), `lavender` (purple). A dark mode swaps to the `ink` base while preserving the chosen accent. Each palette defines: `bg`, `card`, `cardHover`, `ink`, `muted`, `rule`, `accent`, `chipBg/Fg`, `tagBg/Fg`.

Accent is independently overridable from a swatch set: `#c5532f #2d4cf5 #e8b340 #3e6b4a #d8631f #7a4ee0 #1a73c4 #e25a3c #0d0d0c`.

### Typography (4 pairs)

- **Modern** — Geist
- **Friendly** — Outfit
- **Expressive** — Bricolage Grotesque (display) + Inter Tight (body)
- **Classic** — Inter Tight

Monospace is Geist Mono throughout (used for dates, handle, year pills, footer).

### Layout styles (6)

`feed` (default), `card` (elevated), `centered` (alternating sides), `terminal` (monospace, `$ whoami`, `> title`, `#tag`), `polaroid` (rotated scrapbook cards, photos-first), `magazine` (editorial, large display titles, drop-cap body, photos-first).

### Other knobs

- **Dot style:** circle · square · icon (tag emoji)
- **Photo hover:** lift · zoom · none
- **Rounded corners:** on/off (`--radius` 14px/4px)

### Default theme

The prototype shipped with `magazine` layout; logr defaults to the simpler `feed` layout (closer to a social timeline) while keeping the lavender palette. All six layouts remain selectable per portfolio.

```js
{ palette: "lavender", fonts: "expressive", rounded: true,
  accentOverride: "#c5532f", postStyle: "feed",
  dotStyle: "circle", photoHover: "zoom", dark: false }
```

> The prototype lives in `design/` (HTML/CSS/JS from Claude Design). It is the **source of truth for visual output** — recreate it pixel-perfectly in the production stack; don't copy its internal structure.

---

## Data model

Derived directly from the prototype's `HIGHLIGHTS`, `TAG_META`, and profile data. Designed with the Phase 3 chat layer in mind from day one.

**Profile** — `name`, `handle`, `bio`, `status` (current "building X" line), `location`, `socials[]` (label + href), `avatar`.

**Highlight** — `id`, `date` (display string, e.g. `"Nov 2025"` or `"2014 — 2016"`), `year` (int, for grouping), `title`, `tag`, `body`, `link?` (`label` + `href`), `photos[]` (0–4 images; grid renders 1 / 2 / 4).

**Tags** — `work ⚒` · `milestone ★` · `talk ◉` · `side-quest ✺` · `writing ✎` (plus the synthetic `all ✦` filter). The timeline groups by `year` while preserving reverse-chronological order.

---

## Roadmap

### Phase 1 — Single user, personal portfolio
*Goal: your own portfolio live at a custom domain and `/yourname` on the product domain.*

- [x] Project setup — Next.js (App Router) + TypeScript + Tailwind v4
- [x] Database — **Postgres (Supabase)** via Prisma, with pooled + direct connection URLs
- [x] Data model — Profile + Highlight + Image, per the schema above
- [x] Recreate the timeline UI pixel-perfectly from `design/` — all 6 layout styles
- [x] Theming system — palettes, fonts, layout, dot, photo-hover, rounded, dark, accent as CSS variables
- [x] Profile header — avatar, name, handle, bio, status, location, socials
- [x] Auto-generate `llm.txt` — server route reading profile + highlights into structured text
- [x] Serve at `/llm.txt` **and `/[username]/llm.txt`**
- [x] Seed with real data (18 highlights) + responsive design (carried from `design/`)
- [x] Auth — single-user login (password → HMAC-signed cookie session)
- [x] Add/edit/delete-highlight flow — `/admin` dashboard
- [x] Image upload — `/api/upload` → **AWS S3** when configured, else local filesystem (dev); 1–4 per highlight
- [x] Theme editor — change palette/font/layout/accent and persist it
- [x] `/[username]` public route (the homepage renders the primary user)
- [ ] Custom domain support (Vercel) — DB + image storage are production-ready

### Phase 2 — Multi user
*Goal: anyone can sign up and create their own portfolio.*

- [ ] Auth upgrade — Clerk (multi-user, social login: Google + GitHub)
- [ ] Username selection on signup → public `/username` routes
- [ ] User dashboard — manage highlights, profile, theme settings
- [ ] Onboarding — guided first highlight creation
- [ ] Story-to-timeline — paste a story, AI structures it into highlights *(early cut of Phase 4)*
- [ ] Email — welcome, view-count notifications
- [ ] Analytics — view counts per profile, most-viewed highlights
- [ ] SEO — meta tags, `og:image`, structured data per profile

### Phase 3 — AI chat interface
*Goal: visitors can ask questions about any portfolio.*

- [ ] Embed chat widget on each portfolio page
- [ ] RAG — index each user's highlights + profile into pgvector (Supabase)
- [ ] Chat API — Claude with the user's highlights as grounded context
- [ ] Conversational UI — answers grounded in portfolio content
- [ ] Rate limiting on the chat endpoint
- [ ] Optional session-based chat history
- [ ] Owner analytics — what visitors asked

### Phase 4 — Prompt-based auto population
*Goal: paste your story or LinkedIn and get a structured timeline instantly.*

- [ ] Natural language → timeline extraction
- [ ] LinkedIn export import
- [ ] Smart date extraction from natural language
- [ ] AI tag suggestion per highlight
- [ ] Image suggestions per highlight type
- [ ] Edit-and-confirm review flow before publishing
- [ ] Iterative refinement via chat ("add my ETHGlobal win from 2023")

---

## Tech stack

| Layer | Tool | Reason |
|-------|------|--------|
| Framework | Next.js 16 (App Router) | API routes + SSR in one, easy Vercel deploy |
| Database | Postgres (Supabase) | Pooled + direct URLs; `pgvector` for Phase 3 |
| ORM | Prisma 6 | Type-safe schema + migrations |
| Auth | Single-user (P1) → Clerk (P2) | Fastest path now; multi-user + custom domains later |
| Image storage | AWS S3 (local FS in dev) | Durable object storage; optional CloudFront CDN |
| AI | Anthropic Claude API | Structured extraction + conversational RAG |
| Styling | Tailwind + shadcn/ui | Fast, clean, minimal |
| Hosting | Vercel | Custom domains, edge functions, zero config |
| Vector store | pgvector (Supabase) | No extra infra |

---

## Running locally

```bash
npm install
cp .env.example .env     # then fill in Supabase DATABASE_URL + DIRECT_URL
npx prisma migrate dev   # applies migrations to your Postgres
npm run db:seed          # loads the profile + 18 highlights
npm run dev              # http://localhost:3000
```

The database is **Supabase Postgres**. `.env` needs two connection strings (both from the Supabase dashboard → **Connect**):
- `DATABASE_URL` — Transaction pooler (`:6543`, `?pgbouncer=true`), used by the app at runtime
- `DIRECT_URL` — Session pooler (`:5432`), used by `prisma migrate`

- Portfolio: `http://localhost:3000` (and `/koshik`)
- Machine-readable context file: `http://localhost:3000/llm.txt` (and `/koshik/llm.txt`)
- Editor dashboard: `http://localhost:3000/admin` → sign in with `ADMIN_PASSWORD` (default `logr-dev`, set in `.env`)

In the dashboard you can edit the profile, manage highlights (add/edit/delete, upload up to 4 photos each), and pick a saved theme. The filter bar on the public page also has a live theme switcher (layout + dark mode) for instant preview without saving.

## Project structure

```
design/                     # design handoff — visual source of truth (do not ship)
prisma/
  schema.prisma             # Profile, Highlight, Image
  seed.ts                   # Koshik's real data, ported from design/portfolio.jsx
src/
  app/
    layout.tsx                  # fonts + metadata
    page.tsx                    # homepage → primary user's portfolio
    [username]/page.tsx         # public profile route
    [username]/llm.txt/route.ts # GET /[username]/llm.txt
    llm.txt/route.ts            # GET /llm.txt (primary user)
    login/page.tsx              # single-user sign-in
    admin/page.tsx              # editor dashboard (auth-gated)
    api/upload/route.ts         # POST image upload → /public/uploads
    globals.css                 # Tailwind + imports portfolio.css
    portfolio.css               # ported design system (9 palettes × 6 layouts)
  components/
    Portfolio.tsx               # timeline UI (client) — port of design/portfolio.jsx
    PortfolioPage.tsx           # server wrapper (theme CSS vars + Portfolio)
    admin/                      # ProfileForm, ThemeEditor, HighlightsManager, ImageUploader
  lib/
    db.ts                       # Prisma client singleton
    theme.ts                    # palettes, font pairs, theme → CSS variables
    profile.ts                  # DB → ProfileDTO loader
    storage.ts                  # image storage — S3 when configured, else local FS
    llmtxt.ts                   # llm.txt generator
    auth.ts                     # password check + signed-cookie session
    actions.ts                  # server actions (login, profile, theme, highlights)
```

JSON-shaped fields (`socials`, `theme`, `link`) are stored as serialized strings and tags as plain `String`, so the schema stays portable. Local dev and production both use Postgres — point each environment's `.env` at its own Supabase project (or share one).

---

## Domain and routing

- Product domain: `logr.life`
- Personal portfolio: `logr.life/koshik` (and/or `koshik.logr.life`)
- Custom domain: `koshik.me` → same page
- `llm.txt`: `logr.life/koshik/llm.txt` and `koshik.me/llm.txt`

---

## What to build first

Ship **Phase 1** as a single-user Next.js app: Postgres + Prisma, image upload, the timeline UI recreated from `design/`, and `llm.txt` generation. The `llm.txt` route is the most differentiating feature *and* the simplest — one server route that reads highlights and outputs structured text. Get the personal portfolio live, share it, let real feedback shape Phase 2+.

The chat interface (Phase 3) is what makes people share their link — so the data model is built with it in mind from day one.
