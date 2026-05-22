"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { PRIMARY_USERNAME } from "@/lib/profile";
import { DEFAULT_THEME, type Theme } from "@/lib/theme";
import { unfurl } from "@/lib/unfurl";
import { generateText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { isChatEnabled, CHAT_MODEL } from "@/lib/chat";
import { buildNarratePrompt, parseNarrated } from "@/lib/narrate";
import { parseVideoUrl, parseTweetUrl } from "@/lib/video";
import {
  checkPassword,
  createSession,
  destroySession,
  requireAuth,
} from "@/lib/auth";

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/${PRIMARY_USERNAME}`);
}

// ---------- AUTH ----------
export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    redirect("/login?error=1");
  }
  await createSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}

// ---------- PROFILE ----------
function parseSocials(raw: string) {
  // One per line: "Label https://url"
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const m = line.match(/^(.*?)\s+(https?:\/\/\S+)$/);
      if (m) return { label: m[1].trim(), href: m[2].trim() };
      return { label: line, href: line };
    });
}

export async function updateProfileAction(formData: FormData) {
  await requireAuth();
  const socials = parseSocials(String(formData.get("socials") ?? ""));
  await prisma.profile.update({
    where: { username: PRIMARY_USERNAME },
    data: {
      name: String(formData.get("name") ?? ""),
      handle: String(formData.get("handle") ?? ""),
      bio: String(formData.get("bio") ?? ""),
      status: String(formData.get("status") ?? ""),
      location: String(formData.get("location") ?? ""),
      about: String(formData.get("about") ?? "") || null,
      avatarUrl: String(formData.get("avatarUrl") ?? "") || null,
      socials: JSON.stringify(socials),
    },
  });
  revalidateAll();
}

export async function updateThemeAction(theme: Partial<Theme>) {
  await requireAuth();
  const row = await prisma.profile.findUnique({
    where: { username: PRIMARY_USERNAME },
    select: { theme: true },
  });
  let current: Theme = DEFAULT_THEME;
  try {
    current = { ...DEFAULT_THEME, ...JSON.parse(row?.theme ?? "{}") };
  } catch {
    /* keep default */
  }
  await prisma.profile.update({
    where: { username: PRIMARY_USERNAME },
    data: { theme: JSON.stringify({ ...current, ...theme }) },
  });
  revalidateAll();
}

// ---------- EVENTS ----------
export type MediaInput = {
  kind: "image" | "video" | "link" | "tweet";
  url: string;
  poster: string | null;
  provider: string | null;
  title: string | null;
};

export type EventInput = {
  id?: string;
  dateOn: string;
  fullDate: boolean;
  title: string;
  tags: string[];
  featured: boolean;
  body: string;
  icon: string | null;
  linkLabel: string | null;
  linkHref: string | null;
  position: number;
  media: MediaInput[]; // images + videos (0–8)
};

export async function saveEventAction(input: EventInput) {
  await requireAuth();
  const profile = await prisma.profile.findUniqueOrThrow({
    where: { username: PRIMARY_USERNAME },
    select: { id: true },
  });

  const data = {
    dateOn: input.dateOn,
    fullDate: input.fullDate,
    title: input.title,
    tags: input.tags,
    featured: input.featured,
    body: input.body,
    icon: input.icon,
    linkLabel: input.linkLabel,
    linkHref: input.linkHref,
    position: input.position,
  };

  const media = {
    create: input.media.slice(0, 8).map((m, position) => ({
      kind: m.kind,
      url: m.url || null,
      poster: m.poster,
      provider: m.provider,
      title: m.title,
      position,
    })),
  };

  if (input.id) {
    await prisma.media.deleteMany({ where: { eventId: input.id } });
    await prisma.event.update({
      where: { id: input.id },
      data: { ...data, media },
    });
  } else {
    await prisma.event.create({
      data: { ...data, profileId: profile.id, media },
    });
  }
  revalidateAll();
}

export async function deleteEventAction(id: string) {
  await requireAuth();
  await prisma.event.delete({ where: { id } });
  revalidateAll();
}

export type ReviewEvent = {
  dateOn: string;
  fullDate: boolean;
  title: string;
  tags: string[];
  featured: boolean;
  body: string;
  media: MediaInput[];
};

/** Turn URLs from the narrative into media (tweet / video embed / link card). */
async function resolveMedia(links: string[]): Promise<MediaInput[]> {
  const out: MediaInput[] = [];
  for (const url of links.slice(0, 4)) {
    if (parseTweetUrl(url)) {
      out.push({ kind: "tweet", url, poster: null, provider: "x", title: null });
      continue;
    }
    const v = parseVideoUrl(url);
    if (v) {
      out.push({ kind: "video", url: v.embedUrl, poster: v.poster, provider: v.provider, title: null });
      continue;
    }
    try {
      const u = await unfurl(url);
      out.push({ kind: "link", url, poster: u.poster, provider: u.provider, title: u.title });
    } catch {
      out.push({ kind: "link", url, poster: null, provider: null, title: url });
    }
  }
  return out;
}

/** Extract structured events (with link/video/tweet media) from a narrative. */
export async function narrateEventsAction(text: string): Promise<ReviewEvent[]> {
  await requireAuth();
  if (!isChatEnabled()) throw new Error("Chat is not configured.");
  if (!text.trim()) return [];
  const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY! });
  const { text: out } = await generateText({
    model: openrouter.chat(CHAT_MODEL),
    system:
      "You output ONLY a raw JSON object — no prose, no markdown fences, no commentary. " +
      'Shape: {"events":[{"dateOn":"YYYY-MM-DD","fullDate":boolean,"title":string,"tags":string[],"featured":boolean,"body":string,"links":string[]}]}. ' +
      "tags must be a subset of: work, milestone, talk, side_quest, writing. links are full https URLs mentioned for the event.",
    prompt: buildNarratePrompt(text.slice(0, 6000)),
    temperature: 0.2,
  });
  const parsed = parseNarrated(out);
  return Promise.all(
    parsed.map(async (e) => ({
      dateOn: e.dateOn,
      fullDate: e.fullDate,
      title: e.title,
      tags: e.tags,
      featured: e.featured,
      body: e.body,
      media: await resolveMedia(e.links),
    }))
  );
}

/** Bulk-insert events extracted from a narrative (newest get the top slots). */
export async function insertEventsAction(events: ReviewEvent[]) {
  await requireAuth();
  const clean = events
    .filter((e) => e.title?.trim() && /^\d{4}-\d{2}-\d{2}$/.test(e.dateOn))
    .slice(0, 50);
  if (!clean.length) return;
  const profile = await prisma.profile.findUniqueOrThrow({
    where: { username: PRIMARY_USERNAME },
    select: { id: true },
  });
  const agg = await prisma.event.aggregate({ where: { profileId: profile.id }, _min: { position: true } });
  let pos = (agg._min.position ?? 0) - clean.length;
  await prisma.$transaction(
    clean.map((e) =>
      prisma.event.create({
        data: {
          profileId: profile.id,
          dateOn: e.dateOn,
          fullDate: !!e.fullDate,
          title: e.title.trim(),
          tags: e.tags.filter((t) => TAG_OPTIONS_SET.has(t)),
          featured: !!e.featured,
          body: e.body ?? "",
          icon: null,
          linkLabel: null,
          linkHref: null,
          position: pos++,
          media: {
            create: (e.media ?? []).slice(0, 8).map((m, i) => ({
              kind: m.kind,
              url: m.url || null,
              poster: m.poster,
              provider: m.provider,
              title: m.title,
              position: i,
            })),
          },
        },
      })
    )
  );
  revalidateAll();
}

const TAG_OPTIONS_SET = new Set(["work", "milestone", "talk", "side_quest", "writing"]);

/** Fetch Open Graph data for a pasted link, to build a link/article card. */
export async function unfurlLinkAction(url: string): Promise<MediaInput> {
  await requireAuth();
  const { title, poster, provider } = await unfurl(url);
  return { kind: "link", url, poster, provider, title };
}

/** Persist a full drag-reordered list: position = index in `orderedIds`. */
export async function reorderEventsAction(orderedIds: string[]) {
  await requireAuth();
  await prisma.$transaction(
    orderedIds.map((id, i) => prisma.event.update({ where: { id }, data: { position: i } }))
  );
  revalidateAll();
}
