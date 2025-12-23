export const CPD_CERTIFICATE_CREDITS_DEFAULT = 50;

export const cpdCertificateCreditsByCourseId: Record<string, number> = {
  ai: 50,
  cybersecurity: 50,
  "software-architecture": 50,
  data: 50,
  digitalisation: 50,
};

export function getCpdCertificateCredits(courseId: string): number {
  const v = cpdCertificateCreditsByCourseId[courseId];
  const n = typeof v === "number" ? v : CPD_CERTIFICATE_CREDITS_DEFAULT;
  return Math.max(0, Math.round(n));
}


