/**
 * Link an existing (password-auth) Profile to a Google-authenticated User.
 *
 * The User row is created by Auth.js the first time you sign in with Google,
 * so the order is:
 *   1. Sign in with Google once (lands you on /welcome — do NOT publish).
 *   2. Run this script to point the Profile at that User.
 *   3. From then on, signing in with Google opens that Profile's dashboard.
 *
 * Usage:
 *   npx tsx scripts/link-user.ts [email] [username]
 *   (defaults: koshik.raj@gmail.com  koshik)
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = (process.argv[2] ?? "koshik.raj@gmail.com").toLowerCase();
  const username = process.argv[3] ?? "koshik";

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error(
      `No User with email "${email}". Sign in with Google once first (that creates the User), then re-run.`
    );
  }

  const profile = await prisma.profile.findUnique({ where: { username } });
  if (!profile) throw new Error(`No Profile with username "${username}".`);

  if (profile.userId === user.id) {
    console.log(`✓ Already linked: ${username} → ${email}`);
    return;
  }
  if (profile.userId) {
    throw new Error(`Profile "${username}" is already linked to a different user (${profile.userId}).`);
  }

  // userId is @unique — make sure this user doesn't already own another profile.
  const other = await prisma.profile.findUnique({ where: { userId: user.id } });
  if (other) {
    throw new Error(
      `User ${email} already owns profile "${other.username}". Delete that empty onboarding profile first, then re-run.`
    );
  }

  await prisma.profile.update({ where: { id: profile.id }, data: { userId: user.id } });
  console.log(`✓ Linked profile "${username}" → ${email} (user ${user.id})`);
}

main()
  .catch((e) => {
    console.error("✗", e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
