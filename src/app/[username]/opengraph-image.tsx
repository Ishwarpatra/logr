import { ImageResponse } from "next/og";
import { getProfile } from "@/lib/profile";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ username: string }> };

const INK    = "#1a1a1a";
const PAPER  = "#faf8f3";
const CANVAS = "#e0dbd0";
const MUTED  = "#6b6862";
const FAINT  = "#95918a";
const ACCENT = "#d85a30";
const RULE   = "rgba(26,26,26,0.12)";

const SOCIAL_PATHS: Record<string, string> = {
  x:        "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z",
  twitter:  "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z",
  github:   "M12 2C6.477 2 2 6.485 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.455-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.339 4.695-4.566 4.943.359.31.678.92.678 1.856 0 1.34-.012 2.42-.012 2.749 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.485 17.523 2 12 2Z",
  linkedin: "M20.447 20.452h-3.554v-5.569c0-1.328-.024-3.037-1.852-3.037-1.853 0-2.136 1.447-2.136 2.94v5.666H9.351V9h3.414v1.561h.048c.476-.9 1.637-1.852 3.37-1.852 3.601 0 4.268 2.37 4.268 5.455v6.288ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.119 20.452H3.554V9H7.12v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z",
};

function LogrMark({ px = 18 }: { px?: number }) {
  const top = Math.round(px * 0.34);
  const bot = Math.round(px * 0.20);
  const gap = Math.round(px * 0.18);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap, marginBottom: 1 }}>
      <div style={{ width: top, height: top, borderRadius: "50%", background: ACCENT }} />
      <div style={{ width: bot, height: bot, borderRadius: "50%", background: INK }} />
    </div>
  );
}

export default async function OgImage({ params }: Props) {
  const { username } = await params;
  const profile = await getProfile(username);
  if (!profile) return new Response("Not found", { status: 404 });

  const sinceYear = profile.events.length
    ? Math.min(...profile.events.map((e) => e.year))
    : null;

  const bio    = profile.bio.length > 120    ? profile.bio.slice(0, 120) + "…"    : profile.bio;
  const status = profile.status.length > 110 ? profile.status.slice(0, 110) + "…" : profile.status;

  // Polaroid frame: square image + white border (more at the bottom, classic polaroid)
  const IMG    = 172;
  const PAD_S  = 10;   // side + top padding of white frame
  const PAD_B  = 30;   // bottom padding (the polaroid "tab")
  const FRAME_W = PAD_S + IMG + PAD_S;
  const FRAME_H = PAD_S + IMG + PAD_B;

  const hasMeta = sinceYear || profile.location || profile.socials.length > 0;

  return new ImageResponse(
    (
      // canvas — darker warm background makes the card shadow read clearly
      <div
        style={{
          width: "100%",
          height: "100%",
          background: CANVAS,
          display: "flex",
          padding: "52px",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* shadow layer — a slightly larger dark rectangle behind the card */}
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 58,
            right: 58,
            bottom: 44,
            borderRadius: "22px",
            background: "rgba(0,0,0,0.22)",
            filter: "blur(0px)",
          }}
        />

        {/* card */}
        <div
          style={{
            width: "100%",
            height: "100%",
            background: PAPER,
            border: `1px solid rgba(26,26,26,0.07)`,
            borderRadius: "18px",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            padding: "48px 52px",
            gap: "13px",
          }}
        >
          {/* polaroid — absolute top-right, rotated, single shadow */}
          {profile.avatarUrl ? (
            <div
              style={{
                position: "absolute",
                top: 32,
                right: 44,
                width: FRAME_W,
                height: FRAME_H,
                background: "#ffffff",
                boxShadow: "3px 8px 20px rgba(0,0,0,0.25)",
                transform: "rotate(4deg)",
                display: "flex",
                flexDirection: "column",
                padding: `${PAD_S}px ${PAD_S}px ${PAD_B}px`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.avatarUrl}
                width={IMG}
                height={IMG}
                style={{ objectFit: "cover", display: "block" }}
                alt=""
              />
            </div>
          ) : (
            <div
              style={{
                position: "absolute",
                top: 32,
                right: 44,
                width: FRAME_W,
                height: FRAME_H,
                background: "#ffffff",
                boxShadow: "3px 8px 20px rgba(0,0,0,0.25)",
                transform: "rotate(4deg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 64,
                color: MUTED,
                fontStyle: "italic",
              }}
            >
              {profile.name.charAt(0).toLowerCase()}
            </div>
          )}

          {/* text column — paddingRight clears the polaroid for all children */}
          <div style={{ display: "flex", flexDirection: "column", gap: "13px", paddingRight: FRAME_W + 36 }}>

          {/* handle */}
          <div style={{ display: "flex", fontSize: 16, color: MUTED, fontFamily: "monospace", letterSpacing: "0.07em" }}>
            logr.life<span style={{ color: ACCENT }}>/</span>{username}
          </div>

          {/* name + cursor */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              fontSize: 80,
              letterSpacing: "-0.035em",
              lineHeight: 1.02,
              fontWeight: 400,
              color: INK,
              marginTop: -2,
            }}
          >
            {profile.name}
            <div style={{ width: 5, height: 64, background: ACCENT, marginLeft: 8, marginBottom: 6, flexShrink: 0 }} />
          </div>

          {/* bio */}
          {bio && (
            <div style={{ fontSize: 26, color: INK, fontStyle: "italic", lineHeight: 1.44, marginTop: 2 }}>
              {bio}
            </div>
          )}

          {/* meta */}
          {hasMeta && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 7,
                fontFamily: "monospace",
                fontSize: 16,
                marginTop: 10,
              }}
            >
              {sinceYear && (
                <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                  <span style={{ color: FAINT, width: 80 }}>since</span>
                  <span style={{ color: INK }}>{sinceYear}</span>
                </div>
              )}
              {profile.location && (
                <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                  <span style={{ color: FAINT, width: 80 }}>place</span>
                  <span style={{ color: INK }}>{profile.location}</span>
                </div>
              )}
              {profile.socials.length > 0 && (
                <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                  <span style={{ color: FAINT, width: 80 }}>elsewhere</span>
                  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    {profile.socials.map((s) => {
                      const path = SOCIAL_PATHS[s.label.toLowerCase()];
                      if (path) {
                        return (
                          <svg key={s.label} width="22" height="22" viewBox="0 0 24 24" fill={MUTED}>
                            <path d={path} />
                          </svg>
                        );
                      }
                      return (
                        <span key={s.label} style={{ color: MUTED, fontFamily: "monospace", fontSize: 15, letterSpacing: "0.04em" }}>
                          {s.label.toLowerCase()}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          </div>{/* end text column */}

          {/* spacer */}
          <div style={{ flex: 1 }} />

          {/* footer — now / status  +  logr mark */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              paddingTop: 20,
              borderTop: `1px solid ${RULE}`,
            }}
          >
            {status ? (
              <div style={{ display: "flex", gap: 16, alignItems: "baseline", flex: 1, minWidth: 0 }}>
                <span style={{ fontFamily: "monospace", fontSize: 14, color: ACCENT, letterSpacing: "0.1em", flexShrink: 0 }}>
                  now /
                </span>
                <span style={{ fontSize: 24, color: INK, lineHeight: 1.4 }}>{status}</span>
              </div>
            ) : (
              <div style={{ flex: 1 }} />
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0, paddingLeft: 24 }}>
              <LogrMark px={18} />
              <span style={{ fontFamily: "Georgia, serif", fontSize: 20, letterSpacing: "-0.045em", color: MUTED, lineHeight: 1 }}>
                logr
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
