-- dateOn is now the single source of truth; drop the redundant date + year.
ALTER TABLE "Event" ALTER COLUMN "dateOn" SET NOT NULL;
ALTER TABLE "Event" DROP COLUMN "date";
ALTER TABLE "Event" DROP COLUMN "year";
