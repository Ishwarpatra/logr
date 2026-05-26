import { ImageResponse } from "next/og";
import { getProfile } from "@/lib/profile";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ username: string }> };

export default async function OgImage({ params }: Props) {
  const { username } = await params;
  const profile = await getProfile(username);
  if (!profile) return new Response("Not found", { status: 404 });

  const sinceYear = profile.events.length
    ? Math.min(...profile.events.map((e) => e.year))
    : null;
  const milestones = profile.events.filter((e) => e.featured).length;
  const bio = profile.bio.length > 110 ? profile.bio.slice(0, 110) + "…" : profile.bio;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#faf8f3",
          color: "#1a1a1a",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "28px 64px",
            borderBottom: "1px solid rgba(26,26,26,0.12)",
          }}
        >
          <span style={{ fontSize: 22, letterSpacing: "-0.04em", color: "#1a1a1a" }}>
            logr
          </span>
          <span style={{ fontSize: 14, color: "#6b6862", letterSpacing: "0.06em", fontFamily: "monospace" }}>
            logr.life/{username}
          </span>
        </div>

        {/* main content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            padding: "0 64px",
            gap: 56,
          }}
        >
          {/* avatar */}
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatarUrl}
              width={156}
              height={156}
              style={{
                borderRadius: "50%",
                border: "1px solid rgba(26,26,26,0.22)",
                objectFit: "cover",
                flexShrink: 0,
              }}
              alt=""
            />
          ) : (
            <div
              style={{
                width: 156,
                height: 156,
                borderRadius: "50%",
                background: "rgba(26,26,26,0.06)",
                border: "1px solid rgba(26,26,26,0.22)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 68,
                flexShrink: 0,
                color: "#1a1a1a",
              }}
            >
              {profile.name.charAt(0).toLowerCase()}
            </div>
          )}

          {/* right: name, bio, meta */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1, minWidth: 0 }}>
            {/* handle */}
            <div style={{ display: "flex", fontSize: 15, color: "#d85a30", letterSpacing: "0.06em", fontFamily: "monospace" }}>
              logr.life/{username}
            </div>

            {/* name */}
            <div style={{ fontSize: 62, letterSpacing: "-0.025em", lineHeight: 1, fontWeight: 400, color: "#1a1a1a" }}>
              {profile.name}
            </div>

            {/* bio */}
            {bio && (
              <div style={{ fontSize: 22, color: "#6b6862", lineHeight: 1.4, fontStyle: "italic" }}>
                {bio}
              </div>
            )}

            {/* meta row */}
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 4,
                fontSize: 14,
                color: "#95918a",
                letterSpacing: "0.05em",
                fontFamily: "monospace",
                alignItems: "center",
              }}
            >
              {sinceYear && <span>since {sinceYear}</span>}
              {sinceYear && profile.events.length > 0 && (
                <span style={{ color: "rgba(26,26,26,0.22)", margin: "0 4px" }}>·</span>
              )}
              {profile.events.length > 0 && <span>{profile.events.length} events</span>}
              {milestones > 0 && (
                <>
                  <span style={{ color: "rgba(26,26,26,0.22)", margin: "0 4px" }}>·</span>
                  <span style={{ color: "#d85a30" }}>{milestones} milestones</span>
                </>
              )}
              {profile.location && (
                <>
                  <span style={{ color: "rgba(26,26,26,0.22)", margin: "0 4px" }}>·</span>
                  <span>{profile.location}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "20px 64px",
            borderTop: "1px solid rgba(26,26,26,0.12)",
            fontSize: 13,
            color: "#95918a",
            letterSpacing: "0.06em",
            fontFamily: "monospace",
          }}
        >
          a record, latest first
        </div>
      </div>
    ),
    { ...size }
  );
}
