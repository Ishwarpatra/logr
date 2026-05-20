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

  // Highlights arrive sorted by position asc; expose a contiguous index.
  const highlights = profile.highlights.map((h, i) => ({
    id: h.id,
    date: h.date,
    year: h.year,
    title: h.title,
    tag: h.tag,
    body: h.body,
    icon: h.icon,
    linkLabel: h.link?.label ?? null,
    linkHref: h.link?.href ?? null,
    position: i,
    images: h.images,
  }));

  return <AdminShell profile={profile} highlights={highlights} />;
}
