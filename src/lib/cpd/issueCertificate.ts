import crypto from "node:crypto";
import { prisma } from "@/lib/db/prisma";
import { deductCreditsFromLots } from "@/lib/credits/deductFromLots";
import { createCreditUsageEvent, getOrCreateCredits } from "@/lib/credits/store";
import { putCertificatePdf } from "@/lib/storage/certificates";
import { getCpdCertificateCredits } from "@/lib/cpd/certificateCredits";
import { getActiveCourseVersion } from "@/lib/cpd/courseVersion";
import { getCourseLevelMeta, type CourseId } from "@/lib/cpd/courseEvidence";
import { generateCpdCertificatePdf } from "@/lib/cpd/certificatePdf";

function base64Url(bytes: Buffer) {
  return bytes.toString("base64url");
}

function makeCertificateHash() {
  // Non-guessable public identifier.
  return base64Url(crypto.randomBytes(24));
}

function initialsFromName(nameOrEmail: string) {
  const src = String(nameOrEmail || "").trim();
  if (!src) return "L";
  const parts = src.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export async function issueCpdCertificate(params: {
  userId: string;
  userDisplayName?: string | null;
  userEmail?: string | null;
  courseId: string; // format: "<courseId>:<levelId>"
  siteUrl: string;
}) {
  const userId = params.userId;
  const courseId = String(params.courseId || "").trim();
  const [baseCourseId, levelId] = courseId.split(":");
  if (!baseCourseId || !levelId) {
    const err = new Error("INVALID_COURSE_ID");
    (err as any).status = 400;
    throw err;
  }

  const courseVersion = getActiveCourseVersion(baseCourseId);

  // Idempotency: return existing certificate without charging again.
  const certModel = (prisma as any).certificate as {
    findUnique: (args: any) => Promise<any>;
    create: (args: any) => Promise<any>;
  };
  const completionModel = (prisma as any).courseCompletion as {
    findUnique: (args: any) => Promise<any>;
  };

  const existing = await certModel
    .findUnique({
      where: { userId_courseId_courseVersion: { userId, courseId, courseVersion } },
    })
    .catch(() => null as any);
  if (existing) {
    return {
      certificateId: existing.id,
      certificateHash: existing.certificateHash,
      pdfUrl: `/api/certificates/${encodeURIComponent(existing.id)}/pdf`,
      verifyUrl: `/verify/certificate/${encodeURIComponent(existing.certificateHash)}`,
      issuedAt: existing.issuedAt.toISOString(),
      creditsUsed: existing.creditsUsed,
      courseVersion: existing.courseVersion,
    };
  }

  const completion = await completionModel
    .findUnique({ where: { userId_courseId_courseVersion: { userId, courseId, courseVersion } } })
    .catch(() => null as any);
  if (!completion || !completion.passed) {
    const err = new Error("CERT_NOT_ELIGIBLE");
    (err as any).status = 400;
    throw err;
  }

  await getOrCreateCredits(userId);

  const creditsCost = getCpdCertificateCredits(baseCourseId);
  const deducted = await deductCreditsFromLots({ userId, credits: creditsCost });
  if (!deducted.ok) {
    const err = new Error("INSUFFICIENT_CREDITS");
    (err as any).status = 402;
    throw err;
  }

  // Generate fields for PDF
  const meta = getCourseLevelMeta(baseCourseId as CourseId, levelId as any);
  const courseTitle = meta?.title || `${baseCourseId} ${levelId}`;
  const cpdHours = meta?.estimatedHours ?? null;

  const issuer = "RansfordsNotes";
  const issuedAtIso = new Date().toISOString();
  const completionDateIso = completion.completedAt ? completion.completedAt.toISOString() : issuedAtIso;
  const certificateHash = makeCertificateHash();

  const display = String(params.userDisplayName || "").trim();
  const email = String(params.userEmail || "").trim();
  const initials = initialsFromName(display || (email ? email.split("@")[0] : userId));
  const learnerName = display || initials;

  // We need the DB id for the PDF URL, but we can create the row after storing the pdf.
  // Create an id up front to avoid a two-phase "create then update".
  const certificateId = crypto.randomUUID();
  const verifyUrl = `${params.siteUrl.replace(/\/$/, "")}/verify/certificate/${encodeURIComponent(certificateHash)}`;

  const pdf = await generateCpdCertificatePdf({
    issuer,
    learnerDisplayName: learnerName,
    learnerInitials: initials,
    courseTitle,
    courseId: baseCourseId,
    courseVersion,
    completionDateISO: completionDateIso,
    issuedAtISO: issuedAtIso,
    certificateId: certificateId,
    certificateHash,
    verifyUrl,
    cpdHours,
  });

  const pdfKey = `cpd-certificates/${userId}/${certificateId}.pdf`;
  await putCertificatePdf({ key: pdfKey, bytes: pdf.bytes, contentType: "application/pdf" });

  // Create immutable certificate row (idempotent by unique constraint).
  let created: any = null;
  try {
    created = await certModel.create({
      data: {
        id: certificateId,
        userId,
        courseId,
        courseVersion,
        certificateHash,
        pdfKey,
        creditsUsed: creditsCost,
        issuer,
        status: "issued",
      },
    });
  } catch (err: any) {
    if (err?.code === "P2002") {
      const row = await certModel.findUnique({
        where: { userId_courseId_courseVersion: { userId, courseId, courseVersion } },
      });
      return {
        certificateId: row.id,
        certificateHash: row.certificateHash,
        pdfUrl: `/api/certificates/${encodeURIComponent(row.id)}/pdf`,
        verifyUrl: `/verify/certificate/${encodeURIComponent(row.certificateHash)}`,
        issuedAt: row.issuedAt.toISOString(),
        creditsUsed: row.creditsUsed,
        courseVersion: row.courseVersion,
      };
    }
    throw err;
  }

  // Append-only ledger entry for transparency. Not time metered.
  await createCreditUsageEvent({
    userId,
    toolId: "cpd-certificate-issue",
    consumed: creditsCost,
    units: creditsCost,
    freeUnits: 0,
    paidUnits: creditsCost,
    runId: created.id,
    baseFree: false,
    estimatedCredits: creditsCost,
    actualCredits: creditsCost,
    meteringUnit: "fixed",
    durationMs: 0,
    inputBytes: 0,
    outputBytes: pdf.bytes.length,
    freeTierAppliedMs: 0,
    paidMs: 0,
  }).catch(() => null);

  return {
    certificateId: created.id,
    certificateHash: created.certificateHash,
    pdfUrl: `/api/certificates/${encodeURIComponent(created.id)}/pdf`,
    verifyUrl: `/verify/certificate/${encodeURIComponent(created.certificateHash)}`,
    issuedAt: created.issuedAt.toISOString(),
    creditsUsed: creditsCost,
    courseVersion: created.courseVersion,
  };
}


