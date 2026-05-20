import Portfolio from "@/components/Portfolio";
import { themeCssVars } from "@/lib/theme";
import type { ProfileDTO } from "@/lib/profile";

/** Server wrapper: inlines the theme's CSS variables (no flash) then renders
 *  the client timeline. Shared by the homepage and the /[username] route. */
export function PortfolioPage({ profile }: { profile: ProfileDTO }) {
  const cssVars = Object.entries(themeCssVars(profile.theme))
    .map(([k, v]) => `${k}:${v}`)
    .join(";");

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `:root{${cssVars}}` }} />
      <Portfolio profile={profile} />
    </>
  );
}
