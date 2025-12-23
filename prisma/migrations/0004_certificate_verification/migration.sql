-- AlterTable
ALTER TABLE "CertificateIssuance" ADD COLUMN "revokedAt" DATETIME;
ALTER TABLE "CertificateIssuance" ADD COLUMN "revokedReason" TEXT;


