import { redirect } from "next/navigation";
import { loginAction } from "@/lib/actions";
import { isAuthenticated } from "@/lib/auth";

export const metadata = { title: "Sign in — logr" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAuthenticated()) redirect("/admin");
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <form
        action={loginAction}
        className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm"
      >
        <h1 className="text-xl font-semibold text-zinc-900">logr</h1>
        <p className="mt-1 text-sm text-zinc-500">Sign in to edit your portfolio.</p>

        <label className="mt-6 block text-sm font-medium text-zinc-700">Password</label>
        <input
          type="password"
          name="password"
          autoFocus
          required
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
        />
        {error && <p className="mt-2 text-sm text-red-600">Incorrect password.</p>}

        <button
          type="submit"
          className="mt-5 w-full rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
