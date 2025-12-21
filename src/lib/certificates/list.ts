import { getCertificateById } from "./store";

import fs from "node:fs";
import path from "node:path";

const STORE_PATH = process.env.CERTIFICATES_STORE_PATH || "data/certificates.json";

type Cert = {
  certificateId: string;
  userId: string;
  courseId: string;
  levelId: string;
  courseTitle: string;
  hoursEarned: number;
  completionDate: string;
  issuedAt: string;
  version: number;
  learnerName?: string;
  revokedAt?: string | null;
};

export function listCertificatesForUser(userId: string): Cert[] {
  const abs = path.isAbsolute(STORE_PATH) ? STORE_PATH : path.join(process.cwd(), STORE_PATH);
  if (!fs.existsSync(abs)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(abs, "utf8"));
    return (data.certificates || []).filter((c: any) => c.userId === userId);
  } catch {
    return [];
  }
}

export function getCertificateSafe(certificateId: string) {
  return getCertificateById(certificateId);
}


