import Portfolio from "@/components/Portfolio";
import { isChatEnabled } from "@/lib/chat";
import type { ProfileDTO } from "@/lib/profile";

/** Server wrapper for the public timeline. The client component owns the
 *  themed `.logr` root (palette CSS vars + data-layout), so SSR is themed
 *  with no flash. Shared by the homepage and /[username]. */
export function PortfolioPage({ profile }: { profile: ProfileDTO }) {
  // Show the "ask" trigger in dev so it can be previewed without a key;
  // in production it only appears once OPENROUTER_API_KEY is configured.
  const chatEnabled = isChatEnabled() || process.env.NODE_ENV !== "production";
  return <Portfolio profile={profile} chatEnabled={chatEnabled} />;
}
