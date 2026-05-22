"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { PRIMARY_USERNAME } from "@/lib/profile";
import { DEFAULT_THEME, type Theme } from "@/lib/theme";
import { unfurl } from "@/lib/unfurl";
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
