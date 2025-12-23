-- AlterTable
ALTER TABLE "CertificateEntitlement" ADD COLUMN "issuedAt" DATETIME;
ALTER TABLE "CertificateEntitlement" ADD COLUMN "issuedCertificateId" TEXT;

-- CreateTable
CREATE TABLE "CourseCompletionEvidence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "evidenceType" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CertificateIssuance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "certificateId" TEXT NOT NULL,
    "entitlementId" TEXT NOT NULL,
    "issuedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pdfStorageKey" TEXT NOT NULL,
    "pdfSha256" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "metadata" TEXT
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "actorUserId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "details" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "CertificateEntitlement_issuedCertificateId_key" ON "CertificateEntitlement"("issuedCertificateId");

-- CreateIndex
CREATE INDEX "CourseCompletionEvidence_userId_courseId_idx" ON "CourseCompletionEvidence"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "CertificateIssuance_certificateId_key" ON "CertificateIssuance"("certificateId");


