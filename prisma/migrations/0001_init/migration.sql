-- CreateTable
CREATE TABLE "UserIdentity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoginAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Credits" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Credits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserIdentity" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CreditUsageEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,
    "consumed" INTEGER NOT NULL,
    "units" INTEGER NOT NULL,
    "freeUnits" INTEGER NOT NULL,
    "paidUnits" INTEGER NOT NULL,
    "occurredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CreditUsageEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserIdentity" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CreditLot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "stripeEventId" TEXT,
    "stripePriceId" TEXT,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CreditLot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserIdentity" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StripeWebhookEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "processedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Purchase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "stripeSessionId" TEXT NOT NULL,
    "stripeEventId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "FeedbackSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT,
    "name" TEXT,
    "source" TEXT NOT NULL,
    "pageUrl" TEXT NOT NULL,
    "pageTitle" TEXT,
    "category" TEXT,
    "followUp" TEXT,
    "clientSummary" TEXT,
    "message" TEXT NOT NULL,
    "screenshotName" TEXT,
    "screenshotType" TEXT,
    "screenshotDataUrl" TEXT,
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CpdState" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "stateJson" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CpdState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserIdentity" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Progress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "levelId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "minutes" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserIdentity" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UserIdentity_email_key" ON "UserIdentity"("email");

-- CreateIndex
CREATE INDEX "UserIdentity_provider_providerAccountId_idx" ON "UserIdentity"("provider", "providerAccountId");

-- CreateIndex
CREATE INDEX "CreditUsageEvent_userId_occurredAt_idx" ON "CreditUsageEvent"("userId", "occurredAt");

-- CreateIndex
CREATE INDEX "CreditUsageEvent_toolId_occurredAt_idx" ON "CreditUsageEvent"("toolId", "occurredAt");

-- CreateIndex
CREATE INDEX "CreditLot_userId_createdAt_idx" ON "CreditLot"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "CreditLot_stripeEventId_idx" ON "CreditLot"("stripeEventId");

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_stripeSessionId_key" ON "Purchase"("stripeSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_stripeEventId_key" ON "Purchase"("stripeEventId");

-- CreateIndex
CREATE INDEX "FeedbackSubmission_submittedAt_idx" ON "FeedbackSubmission"("submittedAt");

-- CreateIndex
CREATE INDEX "FeedbackSubmission_source_idx" ON "FeedbackSubmission"("source");

-- CreateIndex
CREATE INDEX "FeedbackSubmission_sessionId_idx" ON "FeedbackSubmission"("sessionId");

-- CreateIndex
CREATE INDEX "Progress_userId_courseId_levelId_idx" ON "Progress"("userId", "courseId", "levelId");

-- CreateIndex
CREATE UNIQUE INDEX "Progress_userId_courseId_levelId_sectionId_key" ON "Progress"("userId", "courseId", "levelId", "sectionId");


