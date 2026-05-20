"use client";

import { useState, useRef } from "react";

async function uploadFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: "Upload failed" }));
    throw new Error(error || "Upload failed");
  }
  const { url } = await res.json();
  return url as string;
}

/** Manage 0–`max` image URLs. Uploads to /api/upload and reports URLs up. */
export function ImageUploader({
  value,
  onChange,
  max = 4,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onPick(files: FileList | null) {
    if (!files?.length) return;
    setErr(null);
    setBusy(true);
    try {
      const room = max - value.length;
      const picked = Array.from(files).slice(0, room);
      const urls = await Promise.all(picked.map(uploadFile));
      onChange([...value, ...urls]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {value.map((url, i) => (
          <div key={i} className="relative h-20 w-20 overflow-hidden rounded-lg border border-zinc-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="absolute right-1 top-1 rounded bg-black/60 px-1 text-xs text-white"
              aria-label="Remove image"
            >
              ✕
            </button>
          </div>
        ))}
        {value.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="h-20 w-20 rounded-lg border border-dashed border-zinc-300 text-xs text-zinc-500 hover:border-zinc-500 disabled:opacity-50"
          >
            {busy ? "Uploading…" : "+ Add"}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={max > 1}
        hidden
        onChange={(e) => onPick(e.target.files)}
      />
      {err && <p className="mt-1 text-xs text-red-600">{err}</p>}
    </div>
  );
}
