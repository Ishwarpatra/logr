import "server-only";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

/** The signed-in Google user id, if any. */
export async function getUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

/** The profile the current request may edit: the signed-in user's own profile,
 *  or null (not signed in, or signed in but not onboarded yet). */
export async function currentProfileId(): Promise<string | null> {
  const userId = await getUserId();
  if (!userId) return null;
  const p = await prisma.profile.findUnique({ where: { userId }, select: { id: true } });
  return p?.id ?? null;
}

export async function requireProfileId(): Promise<string> {
  const id = await currentProfileId();
  if (!id) throw new Error("No editable profile for the current session");
  return id;
}

/** Signed in — for owner actions without a profile yet (e.g. onboarding narration). */
export async function requireSignedIn(): Promise<void> {
  if (await getUserId()) return;
  throw new Error("Unauthorized");
}
