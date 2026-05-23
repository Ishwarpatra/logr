import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { currentProfileId } from "@/lib/session";
import { Onboarding } from "@/components/onboarding/Onboarding";

export const metadata = { title: "Welcome — logr" };
export const dynamic = "force-dynamic";

export default async function WelcomePage({
  searchParams,
}: {
  searchParams: Promise<{ handle?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (await currentProfileId()) redirect("/dashboard"); // already onboarded

  const { handle } = await searchParams;
  const hinted = (handle ?? "").toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 30);
  const suggested =
    hinted ||
    (session.user.name ?? session.user.email ?? "")
      .toLowerCase()
      .replace(/@.*$/, "")
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 24);

  return (
    <Onboarding
      name={session.user.name ?? ""}
      image={session.user.image ?? ""}
      suggestedHandle={suggested}
    />
  );
}
