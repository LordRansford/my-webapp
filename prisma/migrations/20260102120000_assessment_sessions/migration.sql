-- CreateTable
CREATE TABLE "AssessmentSession" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "assessmentId" TEXT NOT NULL,
  "questionIds" TEXT NOT NULL,
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AssessmentSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentSession_userId_assessmentId_key" ON "AssessmentSession"("userId", "assessmentId");

-- CreateIndex
CREATE INDEX "AssessmentSession_userId_idx" ON "AssessmentSession"("userId");

-- CreateIndex
CREATE INDEX "AssessmentSession_assessmentId_idx" ON "AssessmentSession"("assessmentId");

-- CreateIndex
CREATE INDEX "AssessmentSession_expiresAt_idx" ON "AssessmentSession"("expiresAt");

-- AddForeignKey
ALTER TABLE "AssessmentSession"
ADD CONSTRAINT "AssessmentSession_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "UserIdentity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentSession"
ADD CONSTRAINT "AssessmentSession_assessmentId_fkey"
FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

