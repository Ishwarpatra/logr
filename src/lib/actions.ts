"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { PRIMARY_USERNAME } from "@/lib/profile";
import { DEFAULT_THEME, type Theme } from "@/lib/theme";
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

// ---------- HIGHLIGHTS ----------
export type HighlightInput = {
  id?: string;
  date: string;
  year: number;
  title: string;
  tag: string;
  body: string;
  icon: string | null;
  linkLabel: string | null;
  linkHref: string | null;
  position: number;
  images: string[]; // image URLs (0–4)
};

export async function saveHighlightAction(input: HighlightInput) {
  await requireAuth();
  const profile = await prisma.profile.findUniqueOrThrow({
    where: { username: PRIMARY_USERNAME },
    select: { id: true },
  });

  const data = {
    date: input.date,
    year: input.year,
    title: input.title,
    tag: input.tag,
    body: input.body,
    icon: input.icon,
    linkLabel: input.linkLabel,
    linkHref: input.linkHref,
    position: input.position,
  };

  const images = {
    create: input.images.slice(0, 4).map((url, position) => ({ url: url || null, position })),
  };

  if (input.id) {
    await prisma.image.deleteMany({ where: { highlightId: input.id } });
    await prisma.highlight.update({
      where: { id: input.id },
      data: { ...data, images },
    });
  } else {
    await prisma.highlight.create({
      data: { ...data, profileId: profile.id, images },
    });
  }
  revalidateAll();
}

export async function deleteHighlightAction(id: string) {
  await requireAuth();
  await prisma.highlight.delete({ where: { id } });
  revalidateAll();
}

/** Move a highlight one slot earlier ("up", newer) or later ("down") and
 *  renormalize all positions to be contiguous. */
export async function moveHighlightAction(id: string, dir: "up" | "down") {
  await requireAuth();
  const profile = await prisma.profile.findUniqueOrThrow({
    where: { username: PRIMARY_USERNAME },
    select: { id: true },
  });
  const items = await prisma.highlight.findMany({
    where: { profileId: profile.id },
    orderBy: { position: "asc" },
    select: { id: true },
  });
  const idx = items.findIndex((i) => i.id === id);
  const swap = dir === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swap < 0 || swap >= items.length) return;
  [items[idx], items[swap]] = [items[swap], items[idx]];
  await prisma.$transaction(
    items.map((it, i) => prisma.highlight.update({ where: { id: it.id }, data: { position: i } }))
  );
  revalidateAll();
}

/** Persist a full drag-reordered list: position = index in `orderedIds`. */
export async function reorderHighlightsAction(orderedIds: string[]) {
  await requireAuth();
  await prisma.$transaction(
    orderedIds.map((id, i) => prisma.highlight.update({ where: { id }, data: { position: i } }))
  );
  revalidateAll();
}
