-- Add course version and served questions to attempts
ALTER TABLE "AssessmentAttempt" ADD COLUMN "courseVersion" TEXT;
ALTER TABLE "AssessmentAttempt" ADD COLUMN "questionIds" TEXT;

UPDATE "AssessmentAttempt" SET "courseVersion" = 'unknown' WHERE "courseVersion" IS NULL;
UPDATE "AssessmentAttempt" SET "questionIds" = '[]' WHERE "questionIds" IS NULL;

ALTER TABLE "AssessmentAttempt" ALTER COLUMN "courseVersion" SET NOT NULL;
ALTER TABLE "AssessmentAttempt" ALTER COLUMN "questionIds" SET NOT NULL;

-- CreateIndex
CREATE INDEX "AssessmentAttempt_courseVersion_idx" ON "AssessmentAttempt"("courseVersion");

