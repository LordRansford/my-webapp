-- CreateTable
CREATE TABLE "LearnerProfile" (
  "userId" TEXT NOT NULL,
  "certificateName" TEXT NOT NULL,
  "lockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "LearnerProfile_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "LearnerProfile"
ADD CONSTRAINT "LearnerProfile_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "UserIdentity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

