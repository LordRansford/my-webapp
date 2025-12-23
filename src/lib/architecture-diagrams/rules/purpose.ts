import type { ArchitectureDiagramInput } from "../schema";

export type PurposeWarning = {
  kind: "warning";
  message: string;
};

export type PurposeAssessment = {
  warnings: PurposeWarning[];
  suitableFor: string[];
  notSuitableFor: string[];
};

export function assessPurpose(input: ArchitectureDiagramInput): PurposeAssessment {
  const warnings: PurposeWarning[] = [];

  const hasTrustBoundary = (input.security?.trustBoundaries || []).filter(Boolean).length > 0;
  const hasTrustBoundaryAck = Boolean(input.security?.hasNoTrustBoundariesConfirmed);
  const hasAuth = String(input.security?.authenticationMethod || "").trim().length > 0;
  const hasSensitiveCategories = (input.dataTypes || []).length > 0;
  const hasDescription = String(input.systemDescription || "").trim().length > 0;

  if ((input.goal === "security-review" || input.goal === "data-review") && !hasTrustBoundary && !hasTrustBoundaryAck) {
    warnings.push({
      kind: "warning",
      message: "Consider adding at least one trust boundary, or confirm that the system has no trust boundaries.",
    });
  }

  if (input.goal === "data-review" && !hasSensitiveCategories) {
    warnings.push({
      kind: "warning",
      message: "Consider selecting data categories so the data review is easier to interpret.",
    });
  }

  if (input.goal === "cpd" && !hasDescription) {
    warnings.push({
      kind: "warning",
      message: "Consider adding a clearer system description for CPD evidence.",
    });
  }

  if (input.security?.adminAccess && !hasAuth) {
    warnings.push({
      kind: "warning",
      message: "Consider specifying an authentication method when admin access exists.",
    });
  }

  const suitableFor: string[] = [];
  const notSuitableFor: string[] = [];

  suitableFor.push("Explanation only");
  suitableFor.push("Design discussion");

  if (input.goal === "security-review") suitableFor.push("Security review draft");
  if (input.goal === "data-review") suitableFor.push("Data review draft");
  if (input.goal === "cpd") suitableFor.push("CPD artefact draft");

  notSuitableFor.push("Not suitable for implementation decisions");

  return { warnings, suitableFor, notSuitableFor };
}


