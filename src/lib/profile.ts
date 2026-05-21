import { prisma } from "@/lib/db";
import { DEFAULT_THEME, type Theme } from "@/lib/theme";

export type Social = { label: string; href: string };

export type HighlightDTO = {
  id: string;
  date: string;
  year: number;
  title: string;
  tag: string;
  body: string;
  icon: string | null; // optional glyph/emoji for the timeline dot
  link: { label: string; href: string } | null;
  images: string[]; // real image URLs only (empty placeholder slots dropped)
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
  highlights: HighlightDTO[];
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
      highlights: {
        orderBy: { position: "asc" },
        include: { images: { orderBy: { position: "asc" } } },
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
    highlights: row.highlights.map((h) => ({
      id: h.id,
      date: h.date,
      year: h.year,
      title: h.title,
      tag: h.tag,
      body: h.body,
      icon: h.icon,
      link: h.linkHref ? { label: h.linkLabel ?? h.linkHref, href: h.linkHref } : null,
      images: h.images.map((img) => img.url).filter((u): u is string => !!u),
    })),
  };
}

/** The single-user homepage profile for Phase 1. */
export const PRIMARY_USERNAME = "koshik";
