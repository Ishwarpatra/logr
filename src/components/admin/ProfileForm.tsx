"use client";

import { useState } from "react";
import { ImageUploader } from "./ImageUploader";
import { updateProfileAction } from "@/lib/actions";
import type { ProfileDTO } from "@/lib/profile";

const field = "mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900";
const label = "block text-xs font-medium uppercase tracking-wide text-zinc-500";

export function ProfileForm({ profile }: { profile: ProfileDTO }) {
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl ?? "");
  const [saved, setSaved] = useState(false);

  return (
    <form
      action={async (fd) => {
        fd.set("avatarUrl", avatarUrl);
        await updateProfileAction(fd);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }}
      className="space-y-3"
    >
      <h2 className="text-lg font-semibold text-zinc-900">Profile</h2>

      <div>
        <label className={label}>Avatar</label>
        <div className="mt-1">
          <ImageUploader value={avatarUrl ? [avatarUrl] : []} onChange={(u) => setAvatarUrl(u[0] ?? "")} max={1} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={label}>Name</label>
          <input name="name" defaultValue={profile.name} className={field} />
        </div>
        <div>
          <label className={label}>Handle</label>
          <input name="handle" defaultValue={profile.handle} className={field} />
        </div>
      </div>

      <div>
        <label className={label}>Bio</label>
        <textarea name="bio" rows={2} defaultValue={profile.bio} className={field} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={label}>Status</label>
          <input name="status" defaultValue={profile.status} className={field} />
        </div>
        <div>
          <label className={label}>Location</label>
          <input name="location" defaultValue={profile.location} className={field} />
        </div>
      </div>

      <div>
        <label className={label}>About (blank line between paragraphs)</label>
        <textarea name="about" rows={5} defaultValue={profile.about ?? ""} className={field} />
      </div>

      <div>
        <label className={label}>Socials (one per line: “Label https://url”)</label>
        <textarea
          name="socials"
          rows={3}
          defaultValue={profile.socials.map((s) => `${s.label} ${s.href}`).join("\n")}
          className={field}
        />
      </div>

      <div className="flex items-center gap-3">
        <button className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800">
          Save profile
        </button>
        {saved && <span className="text-sm text-green-600">Saved ✓</span>}
      </div>
    </form>
  );
}
