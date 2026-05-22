import { prisma } from "@/lib/db";
import { DEFAULT_THEME, type Theme } from "@/lib/theme";

export type Social = { label: string; href: string };

export type MediaItem = {
  kind: "image" | "video" | "link" | "tweet";
  url: string; // image URL, video embed URL, or external link
  poster: string | null; // thumbnail (video frame / og:image)
  provider: string | null; // youtube | vimeo | loom | site name
  title: string | null; // card title for links
};

export type EventDTO = {
  id: string;
  date: string;
  year: number;
  title: string;
  tags: string[];
  featured: boolean; // shown in the page's "highlights" view
  body: string;
  icon: string | null; // optional glyph/emoji for the timeline dot
  link: { label: string; href: string } | null;
  media: MediaItem[]; // images + videos, in order (empty placeholder slots dropped)
};

export type ProfileDTO = {
  id: string;
  username: string;
  name: string;
  handle: string;
  bio: string;
  status: string;
  location: string;
  about: string | null;
  avatarUrl: string | null;
  socials: Social[];
  theme: Theme;
  events: EventDTO[];
};

function parseJSON<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export async function getProfile(username: string): Promise<ProfileDTO | null> {
  const row = await prisma.profile.findUnique({
    where: { username },
    include: {
      events: {
        orderBy: { position: "asc" },
        include: { media: { orderBy: { position: "asc" } } },
      },
    },
  });
  if (!row) return null;

  return {
    id: row.id,
    username: row.username,
    name: row.name,
    handle: row.handle,
    bio: row.bio,
    status: row.status,
    location: row.location,
    about: row.about,
    avatarUrl: row.avatarUrl,
    socials: parseJSON<Social[]>(row.socials, []),
    theme: { ...DEFAULT_THEME, ...parseJSON<Partial<Theme>>(row.theme, {}) },
    events: row.events.map((e) => ({
      id: e.id,
      date: e.date,
      year: e.year,
      title: e.title,
      tags: e.tags,
      featured: e.featured,
      body: e.body,
      icon: e.icon,
      link: e.linkHref ? { label: e.linkLabel ?? e.linkHref, href: e.linkHref } : null,
      media: e.media
        .filter((m) => !!m.url)
        .map((m) => ({
          kind:
            m.kind === "video"
              ? ("video" as const)
              : m.kind === "link"
                ? ("link" as const)
                : m.kind === "tweet"
                  ? ("tweet" as const)
                  : ("image" as const),
          url: m.url as string,
          poster: m.poster,
          provider: m.provider,
          title: m.title,
        })),
    })),
  };
}

/** The single-user homepage profile for Phase 1. */
export const PRIMARY_USERNAME = "koshik";
