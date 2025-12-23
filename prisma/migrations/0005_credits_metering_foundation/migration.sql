-- AlterTable: CreditUsageEvent
ALTER TABLE "CreditUsageEvent" ADD COLUMN "runId" TEXT;
ALTER TABLE "CreditUsageEvent" ADD COLUMN "baseFree" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "CreditUsageEvent" ADD COLUMN "estimatedCredits" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "CreditUsageEvent" ADD COLUMN "actualCredits" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "CreditUsageEvent" ADD COLUMN "meteringUnit" TEXT NOT NULL DEFAULT 'ms';
ALTER TABLE "CreditUsageEvent" ADD COLUMN "durationMs" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "CreditUsageEvent" ADD COLUMN "inputBytes" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "CreditUsageEvent" ADD COLUMN "outputBytes" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "CreditUsageEvent" ADD COLUMN "freeTierAppliedMs" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "CreditUsageEvent" ADD COLUMN "paidMs" INTEGER NOT NULL DEFAULT 0;

-- AlterTable: CreditLot
ALTER TABLE "CreditLot" ADD COLUMN "amountCredits" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "CreditLot" ADD COLUMN "remainingCredits" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "CreditLot" ADD COLUMN "stripeCheckoutSessionId" TEXT;
ALTER TABLE "CreditLot" ADD COLUMN "stripePaymentIntentId" TEXT;
ALTER TABLE "CreditLot" ADD COLUMN "purchasedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "CreditUsageEvent_runId_idx" ON "CreditUsageEvent"("runId");
CREATE INDEX "CreditLot_stripeCheckoutSessionId_idx" ON "CreditLot"("stripeCheckoutSessionId");


