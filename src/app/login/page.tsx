import { redirect } from "next/navigation";
import type { CSSProperties } from "react";
import { loginAction } from "@/lib/actions";
import { isAuthenticated } from "@/lib/auth";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { DEFAULT_THEME, themeCssVars } from "@/lib/theme";

export const metadata = { title: "Sign in — logr" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAuthenticated()) redirect("/admin");
  const { error } = await searchParams;
  const vars = themeCssVars(DEFAULT_THEME) as CSSProperties;

  return (
    <div
      style={{ ...vars, fontFamily: "var(--font-body)" }}
      className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4 text-[var(--ink)]"
    >
      <form
        action={loginAction}
        className="w-full max-w-sm space-y-5 rounded-3xl border border-[var(--rule)] bg-[var(--card)] p-8 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.4)]"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            logr
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">Sign in to edit your portfolio.</p>
        </div>

        <Field label="Password">
          <Input type="password" name="password" autoFocus required />
        </Field>
        {error && <p className="-mt-2 text-sm text-red-600">Incorrect password.</p>}

        <Button type="submit" variant="accent" className="w-full">Sign in</Button>
      </form>
    </div>
  );
}
