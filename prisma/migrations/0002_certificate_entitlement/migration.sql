-- CreateTable
CREATE TABLE "CertificateEntitlement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "stripeSessionId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CertificateEntitlement_userId_courseId_key" ON "CertificateEntitlement"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "CertificateEntitlement_stripeSessionId_key" ON "CertificateEntitlement"("stripeSessionId");


