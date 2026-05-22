import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getProfile, PRIMARY_USERNAME } from "@/lib/profile";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata = { title: "Dashboard — logr" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAuthenticated())) redirect("/login");

  const profile = await getProfile(PRIMARY_USERNAME);
  if (!profile) {
    return <div className="p-8 text-zinc-600">No profile found. Run `npm run db:seed`.</div>;
  }

  // Events arrive sorted by position asc; expose a contiguous index.
  const events = profile.events.map((e, i) => ({
    id: e.id,
    date: e.date,
    year: e.year,
    title: e.title,
    tags: e.tags,
    featured: e.featured,
    body: e.body,
    icon: e.icon,
    linkLabel: e.link?.label ?? null,
    linkHref: e.link?.href ?? null,
    position: i,
    media: e.media,
  }));

  return <AdminShell profile={profile} events={events} />;
}
