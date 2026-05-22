-- Canonical picked date for events (ISO YYYY-MM-DD); drives date + year.
ALTER TABLE "Event" ADD COLUMN "dateOn" TEXT;
