import { NextRequest, NextResponse } from "next/server";
import { extname } from "path";
import { randomUUID } from "crypto";
import { getUserId } from "@/lib/session";
import { storeImage } from "@/lib/storage";

// Auth-gated image upload. Stores to AWS S3 when configured, else to the
// local filesystem (dev). Returns the stored object's public URL.
export async function POST(req: NextRequest) {
  if (!(await getUserId())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Images only" }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "Max 8MB" }, { status: 400 });
  }

  const ext = extname(file.name) || `.${file.type.split("/")[1] ?? "png"}`;
  const key = `uploads/${randomUUID()}${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  try {
    const url = await storeImage(bytes, file.type, key);
    return NextResponse.json({ url });
  } catch (e) {
    console.error("Upload failed:", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
