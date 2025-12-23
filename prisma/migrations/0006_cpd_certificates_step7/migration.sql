-- CreateTable
CREATE TABLE "CourseCompletion" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "courseId" TEXT NOT NULL,
  "courseVersion" TEXT NOT NULL,
  "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "score" INTEGER,
  "passed" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Certificate" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "courseId" TEXT NOT NULL,
  "courseVersion" TEXT NOT NULL,
  "issuedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "certificateHash" TEXT NOT NULL,
  "pdfKey" TEXT NOT NULL,
  "creditsUsed" INTEGER NOT NULL,
  "issuer" TEXT NOT NULL DEFAULT 'RansfordsNotes',
  "status" TEXT NOT NULL DEFAULT 'issued',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "CourseCompletion_userId_idx" ON "CourseCompletion"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseCompletion_userId_courseId_courseVersion_key" ON "CourseCompletion"("userId", "courseId", "courseVersion");

-- CreateIndex
CREATE INDEX "Certificate_userId_idx" ON "Certificate"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_certificateHash_key" ON "Certificate"("certificateHash");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_userId_courseId_courseVersion_key" ON "Certificate"("userId", "courseId", "courseVersion");


