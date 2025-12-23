export function evaluateCertificateEligibility(params) {
  const reasons = [];
  const entitlementStatus = params?.entitlementStatus ?? null;
  const evidenceTypes = Array.isArray(params?.evidenceTypes) ? params.evidenceTypes : [];

  if (entitlementStatus !== "eligible") {
    reasons.push("Entitlement is not eligible.");
  }

  const evidenceCount = evidenceTypes.length;
  const quizzesCompleted = evidenceTypes.filter((t) => t === "quiz").length;
  const sectionsCompleted = evidenceTypes.filter((t) => t === "progress").length;

  if (evidenceCount < 3) reasons.push("Not enough evidence recorded.");
  if (quizzesCompleted < 1) reasons.push("At least one quiz evidence is required.");

  return {
    eligible: reasons.length === 0,
    reasons,
    summary: { evidenceCount, quizzesCompleted, sectionsCompleted },
  };
}


