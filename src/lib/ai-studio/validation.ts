/**
 * AI Studio Validation Utilities
 * 
 * Legal compliance and data quality validation functions
 */

export interface ValidationResult {
  status: "valid" | "invalid" | "needs-review";
  checks: {
    license: {
      status: "pass" | "fail" | "warning";
      detected: string | null;
      verified: boolean;
      message: string;
    };
    copyright: {
      status: "pass" | "fail" | "warning";
      watermarks: boolean;
      knownContent: boolean;
      message: string;
    };
    quality: {
      status: "pass" | "fail" | "warning";
      score: number;
      issues: string[];
      message: string;
    };
    pii: {
      status: "pass" | "fail" | "warning";
      detected: boolean;
      types: string[];
      message: string;
    };
  };
  warnings: string[];
  errors: string[];
}

/**
 * Permissive licenses that are safe to use
 */
export const PERMISSIVE_LICENSES = [
  "MIT",
  "Apache-2.0",
  "BSD-3-Clause",
  "BSD-2-Clause",
  "ISC",
  "CC0",
  "CC-BY",
  "user-owned",
  "public-domain",
];

/**
 * Validate license string
 */
export function validateLicense(license: string): boolean {
  return PERMISSIVE_LICENSES.some(
    (permissive) => license.toLowerCase().includes(permissive.toLowerCase())
  );
}

/**
 * Detect PII patterns in text
 */
export function detectPII(text: string): {
  detected: boolean;
  types: string[];
} {
  const patterns = {
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
    ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
    creditCard: /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g,
  };

  const detectedTypes: string[] = [];

  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(text)) {
      detectedTypes.push(type);
    }
  }

  return {
    detected: detectedTypes.length > 0,
    types: detectedTypes,
  };
}

/**
 * Calculate data quality score
 */
export function calculateQualityScore(data: {
  missingValues: number;
  totalValues: number;
  duplicates: number;
  totalRows: number;
  typeConsistency: number; // 0-1
}): number {
  const {
    missingValues,
    totalValues,
    duplicates,
    totalRows,
    typeConsistency,
  } = data;

  // Completeness score (0-1)
  const completeness = 1 - missingValues / totalValues;

  // Uniqueness score (0-1)
  const uniqueness = 1 - duplicates / totalRows;

  // Overall quality score (weighted average)
  const qualityScore =
    completeness * 0.4 + uniqueness * 0.3 + typeConsistency * 0.3;

  return Math.max(0, Math.min(1, qualityScore));
}

/**
 * Format validation result for display
 */
export function formatValidationResult(result: ValidationResult): {
  summary: string;
  canProceed: boolean;
  requiresReview: boolean;
} {
  const hasErrors = result.errors.length > 0;
  const hasWarnings = result.warnings.length > 0;

  let summary = "";
  if (result.status === "valid") {
    summary = "Validation passed. Dataset is ready to use.";
  } else if (result.status === "invalid") {
    summary = "Validation failed. Please address the errors before proceeding.";
  } else {
    summary = "Validation requires review. Please check warnings.";
  }

  return {
    summary,
    canProceed: result.status === "valid",
    requiresReview: result.status === "needs-review",
  };
}

