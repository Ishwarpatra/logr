import NextAuth, { type DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";

declare module "next-auth" {
  interface Session {
    user: { id: string } & DefaultSession["user"];
  }
}

// Google sign-in via Auth.js, with the Prisma adapter (database sessions).
// Reads AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET / AUTH_SECRET from the environment.
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  trustHost: true,
  pages: { signIn: "/login" },
  callbacks: {
    session({ session, user }) {
      if (session.user && user) session.user.id = user.id;
      return session;
    },
  },
});

/** True when Google sign-in is configured (lets us keep it behind a flag). */
export function isGoogleAuthEnabled(): boolean {
  return Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
}
