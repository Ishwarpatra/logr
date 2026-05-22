-- Toggle to show the exact day on the timeline.
ALTER TABLE "Event" ADD COLUMN "fullDate" BOOLEAN NOT NULL DEFAULT false;
