-- CreateTable
CREATE TABLE "Assessment" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "courseId" TEXT NOT NULL,
  "levelId" TEXT NOT NULL,
  "passThreshold" INTEGER NOT NULL DEFAULT 80,
  "timeLimit" INTEGER,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Question" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "assessmentId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "bloomLevel" INTEGER NOT NULL,
  "difficultyTarget" REAL NOT NULL,
  "discriminationIndex" REAL,
  "question" TEXT NOT NULL,
  "options" TEXT,
  "correctAnswer" TEXT NOT NULL,
  "explanation" TEXT NOT NULL,
  "optionRationales" TEXT,
  "tags" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Question_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AssessmentAttempt" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "assessmentId" TEXT NOT NULL,
  "courseVersion" TEXT NOT NULL,
  "questionIds" TEXT NOT NULL,
  "score" INTEGER NOT NULL,
  "passed" BOOLEAN NOT NULL,
  "answers" TEXT NOT NULL,
  "timeSpent" INTEGER NOT NULL,
  "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AssessmentAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserIdentity" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "AssessmentAttempt_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AssessmentSession" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "assessmentId" TEXT NOT NULL,
  "questionIds" TEXT NOT NULL,
  "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" DATETIME NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AssessmentSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserIdentity" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "AssessmentSession_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LearnerProfile" (
  "userId" TEXT NOT NULL PRIMARY KEY,
  "certificateName" TEXT NOT NULL,
  "lockedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LearnerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserIdentity" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Assessment_courseId_levelId_key" ON "Assessment"("courseId", "levelId");
CREATE INDEX "Assessment_courseId_idx" ON "Assessment"("courseId");
CREATE INDEX "Assessment_levelId_idx" ON "Assessment"("levelId");

-- CreateIndex
CREATE INDEX "Question_assessmentId_idx" ON "Question"("assessmentId");
CREATE INDEX "Question_bloomLevel_idx" ON "Question"("bloomLevel");
CREATE INDEX "Question_type_idx" ON "Question"("type");

-- CreateIndex
CREATE INDEX "AssessmentAttempt_userId_idx" ON "AssessmentAttempt"("userId");
CREATE INDEX "AssessmentAttempt_assessmentId_idx" ON "AssessmentAttempt"("assessmentId");
CREATE INDEX "AssessmentAttempt_passed_idx" ON "AssessmentAttempt"("passed");
CREATE INDEX "AssessmentAttempt_completedAt_idx" ON "AssessmentAttempt"("completedAt");
CREATE INDEX "AssessmentAttempt_courseVersion_idx" ON "AssessmentAttempt"("courseVersion");

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentSession_userId_assessmentId_key" ON "AssessmentSession"("userId", "assessmentId");
CREATE INDEX "AssessmentSession_userId_idx" ON "AssessmentSession"("userId");
CREATE INDEX "AssessmentSession_assessmentId_idx" ON "AssessmentSession"("assessmentId");
CREATE INDEX "AssessmentSession_expiresAt_idx" ON "AssessmentSession"("expiresAt");

