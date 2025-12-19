export type IntegrityFlags = {
  minimumCompletionThreshold: number;
  reflectionRequired: boolean;
  templateEvidenceRequired: boolean;
  randomisedChecks: boolean;
  antiGamingEnabled: boolean;
};

export const DEFAULT_INTEGRITY: IntegrityFlags = {
  minimumCompletionThreshold: 0.7,
  reflectionRequired: true,
  templateEvidenceRequired: false,
  randomisedChecks: true,
  antiGamingEnabled: true,
};

export function checkIntegrity(flags: IntegrityFlags, completion: number, hasReflection: boolean, hasTemplateEvidence: boolean): {
  passes: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];
  if (completion < flags.minimumCompletionThreshold) {
    reasons.push(`Completion below threshold (${Math.round(flags.minimumCompletionThreshold * 100)}%)`);
  }
  if (flags.reflectionRequired && !hasReflection) {
    reasons.push("Reflection required but not provided");
  }
  if (flags.templateEvidenceRequired && !hasTemplateEvidence) {
    reasons.push("Template evidence required but not provided");
  }
  return {
    passes: reasons.length === 0,
    reasons,
  };
}
