"use client";

import { useState, useTransition } from "react";
import { ImageUploader } from "./ImageUploader";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { updateProfileAction } from "@/lib/actions";
import type { ProfileDTO } from "@/lib/profile";

export function ProfileForm({ profile }: { profile: ProfileDTO }) {
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl ?? "");
  const [pending, start] = useTransition();
  const toast = useToast();

  return (
    <form
      action={(fd) => {
        fd.set("avatarUrl", avatarUrl);
        start(async () => {
          await updateProfileAction(fd);
          toast("Profile saved");
        });
      }}
      className="space-y-5"
    >
      <Field label="Avatar">
        <ImageUploader value={avatarUrl ? [avatarUrl] : []} onChange={(u) => setAvatarUrl(u[0] ?? "")} max={1} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name">
          <Input name="name" defaultValue={profile.name} />
        </Field>
        <Field label="Handle">
          <Input name="handle" defaultValue={profile.handle} />
        </Field>
      </div>

      <Field label="Bio">
        <Textarea name="bio" rows={2} defaultValue={profile.bio} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Status">
          <Input name="status" defaultValue={profile.status} placeholder="Building …" />
        </Field>
        <Field label="Location">
          <Input name="location" defaultValue={profile.location} />
        </Field>
      </div>

      <Field label="About" hint="Use a blank line between paragraphs.">
        <Textarea name="about" rows={5} defaultValue={profile.about ?? ""} />
      </Field>

      <Field label="Socials" hint="One per line: “Label https://url”">
        <Textarea
          name="socials"
          rows={3}
          defaultValue={profile.socials.map((s) => `${s.label} ${s.href}`).join("\n")}
        />
      </Field>

      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save profile"}
        </Button>
      </div>
    </form>
  );
}
