import { redirect } from "next/navigation";
import type { CSSProperties } from "react";
import { loginAction } from "@/lib/actions";
import { isAuthenticated } from "@/lib/auth";
import { DEFAULT_THEME, themeCssVars } from "@/lib/theme";
import { Mark } from "@/components/Mark";

export const metadata = { title: "sign in — logr" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAuthenticated()) redirect("/admin");
  const { error } = await searchParams;
  const vars = themeCssVars(DEFAULT_THEME) as CSSProperties;

  return (
    <div className="dash" style={{ ...vars, display: "flex", minHeight: "100dvh", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <form action={loginAction} className="card" style={{ width: "100%", maxWidth: 380, marginBottom: 0 }}>
        <div className="card__head" style={{ marginBottom: 24 }}>
          <span className="login-brand" style={{ fontFamily: "var(--serif)", fontSize: 24, letterSpacing: "-0.03em", color: "var(--ink)" }}>
            <Mark />logr
          </span>
        </div>
        <p className="modal__sub" style={{ marginBottom: 24 }}>sign in to edit your portfolio.</p>
        <div className="field">
          <label className="field__label" htmlFor="password">password</label>
          <input id="password" name="password" type="password" autoFocus required />
        </div>
        {error && <p className="field__hint" style={{ color: "var(--user-accent)", marginTop: -12, marginBottom: 16 }}>incorrect password.</p>}
        <button type="submit" className="btn btn--primary" style={{ width: "100%", justifyContent: "center" }}>sign in →</button>
      </form>
    </div>
  );
}
