-- Generalize Image -> Media (data-preserving): rename + add kind/poster/provider.

ALTER TABLE "Image" RENAME TO "Media";
ALTER TABLE "Media" RENAME CONSTRAINT "Image_pkey" TO "Media_pkey";
ALTER TABLE "Media" RENAME CONSTRAINT "Image_eventId_fkey" TO "Media_eventId_fkey";
ALTER INDEX "Image_eventId_position_idx" RENAME TO "Media_eventId_position_idx";

ALTER TABLE "Media" ADD COLUMN "kind" TEXT NOT NULL DEFAULT 'image';
ALTER TABLE "Media" ADD COLUMN "poster" TEXT;
ALTER TABLE "Media" ADD COLUMN "provider" TEXT;
