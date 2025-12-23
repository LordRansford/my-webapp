/*
  Warnings:

  - You are about to alter the column `details` on the `AuditEvent` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `metadata` on the `CertificateIssuance` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `payload` on the `CourseCompletionEvidence` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to drop the column `processedAt` on the `StripeWebhookEvent` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `StripeWebhookEvent` table. All the data in the column will be lost.
  - Added the required column `eventType` to the `StripeWebhookEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeEventId` to the `StripeWebhookEvent` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "SupportTicket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "name" TEXT,
    "email" TEXT,
    "category" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SupportTicketAttachment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ticketId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "storageKey" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SupportTicketAttachment_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "SupportTicket" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SupportTicketNote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ticketId" TEXT NOT NULL,
    "adminUserId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SupportTicketNote_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "SupportTicket" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CreditLedgerEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amountPence" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "toolId" TEXT,
    "runId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT
);

-- CreateTable
CREATE TABLE "ToolRun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "toolId" TEXT NOT NULL,
    "courseId" TEXT,
    "pageId" TEXT,
    "inputSizeBytes" INTEGER,
    "computeUnits" INTEGER NOT NULL DEFAULT 0,
    "computeMs" INTEGER NOT NULL DEFAULT 0,
    "costPence" INTEGER NOT NULL DEFAULT 0,
    "freeTierCoveredPence" INTEGER NOT NULL DEFAULT 0,
    "paidTierChargedPence" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'success',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT,
    "anonKey" TEXT,
    "toolId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "inputBytes" INTEGER,
    "startedAt" DATETIME,
    "finishedAt" DATETIME,
    "durationMs" INTEGER,
    "estimatedCostCredits" INTEGER,
    "chargedCredits" INTEGER,
    "freeTierAppliedMs" INTEGER,
    "requestId" TEXT,
    "idempotencyKey" TEXT,
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "errorStack" TEXT,
    "outputRef" TEXT,
    "payloadJson" JSONB,
    "resultJson" JSONB
);

-- CreateTable
CREATE TABLE "JobEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "jobId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "level" TEXT NOT NULL DEFAULT 'info',
    "message" TEXT NOT NULL,
    "data" JSONB,
    CONSTRAINT "JobEvent_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DailyUsage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dayUtc" TEXT NOT NULL,
    "userId" TEXT,
    "anonKey" TEXT,
    "toolId" TEXT,
    "usedMs" INTEGER NOT NULL DEFAULT 0,
    "usedCredits" INTEGER NOT NULL DEFAULT 0,
    "requestCount" INTEGER NOT NULL DEFAULT 0,
    "lastRequestAt" DATETIME
);

-- CreateTable
CREATE TABLE "AdminAuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "adminUserId" TEXT NOT NULL,
    "adminRole" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT,
    "reason" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AuditEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "actorUserId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "details" JSONB,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_AuditEvent" ("action", "actorUserId", "createdAt", "details", "entityId", "entityType", "id", "ip", "userAgent") SELECT "action", "actorUserId", "createdAt", "details", "entityId", "entityType", "id", "ip", "userAgent" FROM "AuditEvent";
DROP TABLE "AuditEvent";
ALTER TABLE "new_AuditEvent" RENAME TO "AuditEvent";
CREATE TABLE "new_CertificateIssuance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "certificateId" TEXT NOT NULL,
    "entitlementId" TEXT NOT NULL,
    "issuedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" DATETIME,
    "revokedReason" TEXT,
    "pdfStorageKey" TEXT NOT NULL,
    "pdfSha256" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "metadata" JSONB
);
INSERT INTO "new_CertificateIssuance" ("certificateId", "courseId", "entitlementId", "id", "issuedAt", "metadata", "pdfSha256", "pdfStorageKey", "revokedAt", "revokedReason", "userId", "version") SELECT "certificateId", "courseId", "entitlementId", "id", "issuedAt", "metadata", "pdfSha256", "pdfStorageKey", "revokedAt", "revokedReason", "userId", "version" FROM "CertificateIssuance";
DROP TABLE "CertificateIssuance";
ALTER TABLE "new_CertificateIssuance" RENAME TO "CertificateIssuance";
CREATE UNIQUE INDEX "CertificateIssuance_certificateId_key" ON "CertificateIssuance"("certificateId");
CREATE TABLE "new_CourseCompletionEvidence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "evidenceType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_CourseCompletionEvidence" ("courseId", "createdAt", "evidenceType", "id", "payload", "userId") SELECT "courseId", "createdAt", "evidenceType", "id", "payload", "userId" FROM "CourseCompletionEvidence";
DROP TABLE "CourseCompletionEvidence";
ALTER TABLE "new_CourseCompletionEvidence" RENAME TO "CourseCompletionEvidence";
CREATE INDEX "CourseCompletionEvidence_userId_courseId_idx" ON "CourseCompletionEvidence"("userId", "courseId");
CREATE TABLE "new_StripeWebhookEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stripeEventId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "receivedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_StripeWebhookEvent" ("id") SELECT "id" FROM "StripeWebhookEvent";
DROP TABLE "StripeWebhookEvent";
ALTER TABLE "new_StripeWebhookEvent" RENAME TO "StripeWebhookEvent";
CREATE UNIQUE INDEX "StripeWebhookEvent_stripeEventId_key" ON "StripeWebhookEvent"("stripeEventId");
CREATE INDEX "StripeWebhookEvent_receivedAt_idx" ON "StripeWebhookEvent"("receivedAt");
CREATE INDEX "StripeWebhookEvent_eventType_receivedAt_idx" ON "StripeWebhookEvent"("eventType", "receivedAt");
CREATE TABLE "new_UserIdentity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoginAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adminRole" TEXT,
    "accountStatus" TEXT NOT NULL DEFAULT 'active',
    "lastActiveAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_UserIdentity" ("createdAt", "email", "id", "lastLoginAt", "provider", "providerAccountId") SELECT "createdAt", "email", "id", "lastLoginAt", "provider", "providerAccountId" FROM "UserIdentity";
DROP TABLE "UserIdentity";
ALTER TABLE "new_UserIdentity" RENAME TO "UserIdentity";
CREATE UNIQUE INDEX "UserIdentity_email_key" ON "UserIdentity"("email");
CREATE INDEX "UserIdentity_provider_providerAccountId_idx" ON "UserIdentity"("provider", "providerAccountId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "SupportTicket_status_createdAt_idx" ON "SupportTicket"("status", "createdAt");

-- CreateIndex
CREATE INDEX "SupportTicket_category_createdAt_idx" ON "SupportTicket"("category", "createdAt");

-- CreateIndex
CREATE INDEX "SupportTicket_userId_createdAt_idx" ON "SupportTicket"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "SupportTicketAttachment_ticketId_createdAt_idx" ON "SupportTicketAttachment"("ticketId", "createdAt");

-- CreateIndex
CREATE INDEX "SupportTicketNote_ticketId_createdAt_idx" ON "SupportTicketNote"("ticketId", "createdAt");

-- CreateIndex
CREATE INDEX "CreditLedgerEvent_userId_createdAt_idx" ON "CreditLedgerEvent"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "CreditLedgerEvent_type_createdAt_idx" ON "CreditLedgerEvent"("type", "createdAt");

-- CreateIndex
CREATE INDEX "CreditLedgerEvent_runId_idx" ON "CreditLedgerEvent"("runId");

-- CreateIndex
CREATE INDEX "ToolRun_userId_createdAt_idx" ON "ToolRun"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ToolRun_toolId_createdAt_idx" ON "ToolRun"("toolId", "createdAt");

-- CreateIndex
CREATE INDEX "ToolRun_status_createdAt_idx" ON "ToolRun"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Job_idempotencyKey_key" ON "Job"("idempotencyKey");

-- CreateIndex
CREATE INDEX "Job_status_createdAt_idx" ON "Job"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Job_toolId_createdAt_idx" ON "Job"("toolId", "createdAt");

-- CreateIndex
CREATE INDEX "Job_userId_createdAt_idx" ON "Job"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Job_anonKey_createdAt_idx" ON "Job"("anonKey", "createdAt");

-- CreateIndex
CREATE INDEX "JobEvent_jobId_createdAt_idx" ON "JobEvent"("jobId", "createdAt");

-- CreateIndex
CREATE INDEX "DailyUsage_dayUtc_userId_idx" ON "DailyUsage"("dayUtc", "userId");

-- CreateIndex
CREATE INDEX "DailyUsage_dayUtc_anonKey_idx" ON "DailyUsage"("dayUtc", "anonKey");

-- CreateIndex
CREATE UNIQUE INDEX "DailyUsage_dayUtc_userId_anonKey_toolId_key" ON "DailyUsage"("dayUtc", "userId", "anonKey", "toolId");

-- CreateIndex
CREATE INDEX "AdminAuditLog_adminUserId_timestamp_idx" ON "AdminAuditLog"("adminUserId", "timestamp");

-- CreateIndex
CREATE INDEX "AdminAuditLog_actionType_timestamp_idx" ON "AdminAuditLog"("actionType", "timestamp");

-- CreateIndex
CREATE INDEX "AdminAuditLog_targetType_timestamp_idx" ON "AdminAuditLog"("targetType", "timestamp");
