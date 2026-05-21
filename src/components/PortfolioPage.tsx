import Portfolio from "@/components/Portfolio";
import type { ProfileDTO } from "@/lib/profile";

/** Server wrapper for the public timeline. The client component owns the
 *  themed `.logr` root (palette CSS vars + data-layout), so SSR is themed
 *  with no flash. Shared by the homepage and /[username]. */
export function PortfolioPage({ profile }: { profile: ProfileDTO }) {
  return <Portfolio profile={profile} />;
}
