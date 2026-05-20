"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { ToastProvider } from "@/components/ui/Toast";
import { StyleVarsProvider } from "@/components/ui/StyleVars";
import { Button } from "@/components/ui/Button";
import { ProfileForm } from "./ProfileForm";
import { ThemeEditor } from "./ThemeEditor";
import { HighlightsManager, type EditableHighlight } from "./HighlightsManager";
import { logoutAction } from "@/lib/actions";
import { themeCssVars } from "@/lib/theme";
import type { ProfileDTO } from "@/lib/profile";

const TABS: TabItem[] = [
  {
    value: "profile",
    label: "Profile",
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="2.6" stroke="currentColor" strokeWidth="1.4" /><path d="M2.8 13.5a5.2 5.2 0 0 1 10.4 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
    ),
  },
  {
    value: "appearance",
    label: "Appearance",
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" /><circle cx="5.5" cy="6" r="1" fill="currentColor" /><circle cx="10" cy="5.5" r="1" fill="currentColor" /><circle cx="11" cy="9" r="1" fill="currentColor" /></svg>
    ),
  },
  {
    value: "highlights",
    label: "Highlights",
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="3.5" cy="4" r="1.4" fill="currentColor" /><rect x="7" y="3" width="7" height="2" rx="1" fill="currentColor" /><circle cx="3.5" cy="8" r="1.4" fill="currentColor" /><rect x="7" y="7" width="6" height="2" rx="1" fill="currentColor" /><circle cx="3.5" cy="12" r="1.4" fill="currentColor" /><rect x="7" y="11" width="5" height="2" rx="1" fill="currentColor" /></svg>
    ),
  },
];

export function AdminShell({
  profile,
  highlights,
}: {
  profile: ProfileDTO;
  highlights: EditableHighlight[];
}) {
  const [tab, setTab] = useState("profile");
  const vars = themeCssVars(profile.theme) as CSSProperties;

  return (
    <StyleVarsProvider vars={vars}>
      <ToastProvider>
        <div
          style={{ ...vars, fontFamily: "var(--font-body)" }}
          className="min-h-screen bg-[var(--bg)] text-[var(--ink)]"
        >
          <header className="sticky top-0 z-30 border-b border-[var(--rule)] bg-[var(--card)]/80 backdrop-blur">
            <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
              <div className="flex items-center gap-2.5">
                <span
                  className="text-lg font-semibold tracking-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  logr
                </span>
                <span className="h-4 w-px bg-[var(--rule)]" />
                <span
                  className="rounded-full bg-[var(--tag-bg)] px-2.5 py-0.5 text-xs font-medium text-[var(--tag-fg)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  dashboard
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/${profile.username}`} target="_blank">
                  <Button size="sm" variant="secondary">View portfolio ↗</Button>
                </Link>
                <form action={logoutAction}>
                  <Button size="sm" variant="ghost" type="submit">Sign out</Button>
                </form>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-3xl px-5 py-8">
            <div className="mb-6 flex items-center gap-4">
              <span className="grid h-14 w-14 place-items-center overflow-hidden rounded-full border-2 border-[var(--card)] bg-[var(--card-hover)] shadow-[0_0_0_1px_var(--rule)]">
                {profile.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span style={{ fontFamily: "var(--font-mono)" }} className="text-xs text-[var(--muted)]">
                    {profile.name.slice(0, 1)}
                  </span>
                )}
              </span>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                  {profile.name}
                </h1>
                <p className="text-sm text-[var(--muted)]">Edit how your story looks and reads.</p>
              </div>
            </div>

            <Tabs tabs={TABS} value={tab} onChange={setTab} className="mb-5" />

            <div className="rounded-3xl border border-[var(--rule)] bg-[var(--card)] p-6 shadow-[0_12px_40px_-24px_rgba(0,0,0,0.25)] sm:p-7">
              {tab === "profile" && <ProfileForm profile={profile} />}
              {tab === "appearance" && <ThemeEditor theme={profile.theme} />}
              {tab === "highlights" && <HighlightsManager highlights={highlights} />}
            </div>
          </main>
        </div>
      </ToastProvider>
    </StyleVarsProvider>
  );
}
