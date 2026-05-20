import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

// Image storage abstraction. Uses AWS S3 when configured (production),
// otherwise falls back to the local filesystem (zero-config local dev).

const BUCKET = process.env.AWS_S3_BUCKET;
const REGION = process.env.AWS_REGION;

export function isS3Configured(): boolean {
  return Boolean(
    BUCKET &&
      REGION &&
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY
  );
}

let _client: S3Client | null = null;
function client(): S3Client {
  if (!_client) {
    _client = new S3Client({
      region: REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }
  return _client;
}

/** Public URL for a stored object: a CDN base if set, else the S3 URL. */
function publicUrl(key: string): string {
  const base = process.env.S3_PUBLIC_BASE_URL?.replace(/\/$/, "");
  if (base) return `${base}/${key}`;
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
}

/**
 * Store an uploaded image and return its public URL.
 * @param key  object key / filename, e.g. "uploads/<uuid>.png"
 */
export async function storeImage(
  body: Buffer,
  contentType: string,
  key: string
): Promise<string> {
  if (isS3Configured()) {
    await client().send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: body,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      })
    );
    return publicUrl(key);
  }

  // Local-filesystem fallback (dev only; not durable on serverless hosts).
  const filename = key.split("/").pop()!;
  const dir = join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, filename), body);
  return `/uploads/${filename}`;
}
