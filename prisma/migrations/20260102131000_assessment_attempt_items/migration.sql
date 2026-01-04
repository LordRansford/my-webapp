-- CreateTable
CREATE TABLE "AssessmentAttemptItem" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "attemptId" TEXT NOT NULL,
  "questionId" TEXT NOT NULL,
  "correct" BOOLEAN NOT NULL,
  "answer" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AssessmentAttemptItem_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "AssessmentAttempt" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "AssessmentAttemptItem_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentAttemptItem_attemptId_questionId_key" ON "AssessmentAttemptItem"("attemptId", "questionId");
CREATE INDEX "AssessmentAttemptItem_attemptId_idx" ON "AssessmentAttemptItem"("attemptId");
CREATE INDEX "AssessmentAttemptItem_questionId_idx" ON "AssessmentAttemptItem"("questionId");
CREATE INDEX "AssessmentAttemptItem_correct_idx" ON "AssessmentAttemptItem"("correct");

