"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { ToastProvider } from "@/components/ui/Toast";
import { StyleVarsProvider } from "@/components/ui/StyleVars";
import { ProfileForm } from "./ProfileForm";
import { ThemeEditor } from "./ThemeEditor";
import { EventsManager, type EditableEvent } from "./EventsManager";
import { logoutAction } from "@/lib/actions";
import { themeCssVars, type Theme } from "@/lib/theme";
import { Mark } from "@/components/Mark";
import type { ProfileDTO } from "@/lib/profile";

const TABS = [
  { value: "profile", glyph: "01", label: "profile" },
  { value: "events", glyph: "02", label: "events" },
  { value: "appearance", glyph: "03", label: "appearance" },
];

function initial(name: string) {
  return (name.trim().charAt(0) || "·").toLowerCase();
}

export function AdminShell({
  profile,
  events,
}: {
  profile: ProfileDTO;
  events: EditableEvent[];
}) {
  const [tab, setTab] = useState("profile");
  // owner's theme draft — drives the dashboard's own look live (palette + accent)
  const [theme, setTheme] = useState<Theme>(profile.theme);
  const vars = themeCssVars(theme) as CSSProperties;

  return (
    <StyleVarsProvider vars={vars}>
      <ToastProvider>
        <div className="dash" data-mode={theme.palette === "ink" ? "dark" : "light"} style={vars}>
          <header className="bar">
            <span className="bar__brand">
              <Link href="/"><Mark />logr</Link>
              <span className="chip">dashboard</span>
            </span>
            <nav className="bar__util" aria-label="utilities">
              <a href={`/${profile.username}`} target="_blank" rel="noopener noreferrer">view portfolio →</a>
              <form action={logoutAction}><button type="submit">sign out</button></form>
            </nav>
          </header>

          <div className="page">
            <section className="hero">
              <span className="hero__avatar">
                {profile.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatarUrl} alt="" />
                ) : (
                  <span className="hero__avatar__initial">{initial(profile.name)}</span>
                )}
              </span>
              <div className="hero__copy">
                <h1 className="hero__name">{profile.name}<span className="colon">:</span></h1>
                <p className="hero__sub">edit how your story looks and reads.</p>
              </div>
            </section>

            <nav className="tabs" role="tablist" aria-label="dashboard sections">
              {TABS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  className="tab"
                  role="tab"
                  aria-current={tab === t.value}
                  onClick={() => setTab(t.value)}
                >
                  <span className="tab__glyph">{t.glyph}</span>
                  {t.label}
                </button>
              ))}
            </nav>

            {tab === "profile" && <ProfileForm profile={profile} />}
            {tab === "appearance" && <ThemeEditor theme={theme} onChange={setTheme} />}
            {tab === "events" && <EventsManager events={events} />}

            <footer className="foot">
              <span className="brand"><Mark />logr &nbsp;— dashboard</span>
              <span><a href={`/${profile.username}`} target="_blank" rel="noopener noreferrer">view portfolio →</a></span>
            </footer>
          </div>
        </div>
      </ToastProvider>
    </StyleVarsProvider>
  );
}
