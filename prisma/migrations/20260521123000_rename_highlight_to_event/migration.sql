-- Rename Highlight -> Event (data-preserving), add `tags` (multi) + `featured`.

-- 1) rename the table and its constraints/index
ALTER TABLE "Highlight" RENAME TO "Event";
ALTER TABLE "Event" RENAME CONSTRAINT "Highlight_pkey" TO "Event_pkey";
ALTER TABLE "Event" RENAME CONSTRAINT "Highlight_profileId_fkey" TO "Event_profileId_fkey";
ALTER INDEX "Highlight_profileId_position_idx" RENAME TO "Event_profileId_position_idx";

-- 2) Image.highlightId -> eventId
ALTER TABLE "Image" RENAME COLUMN "highlightId" TO "eventId";
ALTER TABLE "Image" RENAME CONSTRAINT "Image_highlightId_fkey" TO "Image_eventId_fkey";
ALTER INDEX "Image_highlightId_position_idx" RENAME TO "Image_eventId_position_idx";

-- 3) new columns
ALTER TABLE "Event" ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Event" ADD COLUMN "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- 4) migrate the single tag into the tags array, then drop it
UPDATE "Event" SET "tags" = ARRAY["tag"] WHERE "tag" IS NOT NULL AND "tag" <> '';
ALTER TABLE "Event" DROP COLUMN "tag";
