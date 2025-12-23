import { prisma } from "@/lib/db/prisma";
import { evaluateCertificateEligibility as evaluateCertificateEligibilityCore } from "./eligibility.core";

export function evaluateCertificateEligibility(params: {
  entitlementStatus: string | null;
  evidenceTypes: string[];
}): {
  eligible: boolean;
  reasons: string[];
  summary: { evidenceCount: number; quizzesCompleted: number; sectionsCompleted: number };
} {
  return evaluateCertificateEligibilityCore(params as any);
}

export async function isEligibleForCertificate(
  userId: string,
  courseId: string
): Promise<{
  eligible: boolean;
  reasons: string[];
  summary: { evidenceCount: number; quizzesCompleted: number; sectionsCompleted: number };
}> {
  const entitlement = (prisma as any).certificateEntitlement as {
    findUnique: (args: any) => Promise<any>;
  };
  const evidence = (prisma as any).courseCompletionEvidence as {
    count: (args: any) => Promise<number>;
    countDistinct?: (args: any) => Promise<number>;
    findMany: (args: any) => Promise<any[]>;
  };
  const ent = await entitlement.findUnique({ where: { userId_courseId: { userId, courseId } } });

  const evidenceRows = await evidence.findMany({
    where: { userId, courseId },
    select: { evidenceType: true },
    take: 500,
  });

  return evaluateCertificateEligibility({
    entitlementStatus: ent?.status ?? null,
    evidenceTypes: evidenceRows.map((r) => r.evidenceType),
  });
}


