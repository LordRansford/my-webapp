export type CertificateRecord = {
  certificateId: string;
  userId: string;
  courseId: string;
  levelId: string;
  courseTitle: string;
  hoursEarned: number;
  completionDate: string;
  issuedAt: string;
  version: number;
  learnerName: string;
  revokedAt?: string | null;
  revokedReason?: string;
};

const core = require("./store.core.js");

export const issueCertificate: (params: {
  userId: string;
  courseId: string;
  levelId: string;
  courseTitle: string;
  hoursEarned: number;
  completionDate: string;
  learnerName?: string;
}) => CertificateRecord = core.issueCertificate;

export const getCertificateById: (certificateId: string) => CertificateRecord | null = core.getCertificateById;
export const revokeCertificate: (certificateId: string, reason?: string) => CertificateRecord | null = core.revokeCertificate;


