import { redirect } from "next/navigation";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import { logoutAction } from "@/lib/actions";
import { getProfile, PRIMARY_USERNAME } from "@/lib/profile";
import { ProfileForm } from "@/components/admin/ProfileForm";
import { ThemeEditor } from "@/components/admin/ThemeEditor";
import { HighlightsManager } from "@/components/admin/HighlightsManager";

export const metadata = { title: "Dashboard — logr" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAuthenticated())) redirect("/login");

  const profile = await getProfile(PRIMARY_USERNAME);
  if (!profile) {
    return <div className="p-8 text-zinc-600">No profile found. Run `npm run db:seed`.</div>;
  }

  const highlights = profile.highlights.map((h) => ({
    id: h.id,
    date: h.date,
    year: h.year,
    title: h.title,
    tag: h.tag,
    body: h.body,
    linkLabel: h.link?.label ?? null,
    linkHref: h.link?.href ?? null,
    position: 0, // replaced below
    images: h.images.filter((u): u is string => !!u),
  }));
  // positions follow array order (already sorted by position asc)
  highlights.forEach((h, i) => (h.position = i));

  return (
    <div className="min-h-screen bg-zinc-100">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
          <span className="font-semibold text-zinc-900">logr · dashboard</span>
          <div className="flex items-center gap-3 text-sm">
            <Link href={`/${profile.username}`} className="text-zinc-600 hover:text-zinc-900" target="_blank">
              View portfolio ↗
            </Link>
            <form action={logoutAction}>
              <button className="rounded-lg border border-zinc-300 px-3 py-1.5 hover:bg-zinc-50">Sign out</button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-8 px-5 py-8">
        <section className="rounded-2xl border border-zinc-200 bg-white p-6">
          <ProfileForm profile={profile} />
        </section>
        <section className="rounded-2xl border border-zinc-200 bg-white p-6">
          <ThemeEditor theme={profile.theme} />
        </section>
        <section className="rounded-2xl border border-zinc-200 bg-white p-6">
          <HighlightsManager highlights={highlights} />
        </section>
      </main>
    </div>
  );
}
