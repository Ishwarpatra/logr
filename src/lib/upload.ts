/** Upload an image to /api/upload (S3 or local fallback) and return its URL. */
export async function uploadImage(file: File): Promise<string> {
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
