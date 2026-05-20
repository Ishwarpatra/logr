import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PortfolioPage } from "@/components/PortfolioPage";
import { getProfile, PRIMARY_USERNAME } from "@/lib/profile";

// Read fresh from the DB on each request so dashboard edits show immediately.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile(PRIMARY_USERNAME);
  if (!profile) return {};
  return {
    title: `${profile.name} — a record, latest first`,
    description: profile.bio.replace(/\n/g, " "),
  };
}

export default async function Home() {
  const profile = await getProfile(PRIMARY_USERNAME);
  if (!profile) notFound();
  return <PortfolioPage profile={profile} />;
}
