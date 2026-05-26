import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PortfolioPage } from "@/components/PortfolioPage";
import { getProfile } from "@/lib/profile";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { username } = await params;
  const profile = await getProfile(username);
  if (!profile) return {};
  const meta: Metadata = {
    title: `${profile.name} — a record, latest first`,
    description: profile.bio.replace(/\n/g, " "),
  };
  if (profile.avatarUrl) {
    meta.openGraph = { images: [profile.avatarUrl] };
    meta.twitter = { card: "summary", images: [profile.avatarUrl] };
  }
  return meta;
}

export default async function UserPortfolio({ params }: Params) {
  const { username } = await params;
  const profile = await getProfile(username);
  if (!profile) notFound();
  return <PortfolioPage profile={profile} />;
}
