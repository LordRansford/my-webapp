export type NumericInput = number | undefined | null;

const clamp = (value: number, min = 0, max = 100) => Math.min(Math.max(value, min), max);

const safeNumber = (value: NumericInput) => (typeof value === "number" && !Number.isNaN(value) ? value : 0);

export const calculateRiskScore = (likelihood?: NumericInput, impact?: NumericInput) => {
  const lhs = safeNumber(likelihood);
  const rhs = safeNumber(impact);
  const normalized = clamp(Math.round((lhs * rhs) / 10));
  return normalized;
};

export const calculateCompliancePercentage = (passed?: NumericInput, total?: NumericInput) => {
  const done = safeNumber(passed);
  const max = Math.max(safeNumber(total), 1);
  return clamp(Math.round((done / max) * 100));
};

export const calculateMaturityIndex = (signals: Array<NumericInput>) => {
  if (!signals.length) return 0;
  const scores = signals.map(safeNumber);
  const average = scores.reduce((sum, value) => sum + value, 0) / scores.length;
  return clamp(Math.round(average));
};

export const calculateProbabilityRange = (base?: NumericInput, modifier?: NumericInput) => {
  const b = clamp(safeNumber(base));
  const m = safeNumber(modifier);
  const low = clamp(b - m);
  const high = clamp(b + m);
  return { low, high };
};

export const confidenceFromCompletion = (completionRatio: number, validationErrors: number) => {
  if (completionRatio >= 0.85 && validationErrors === 0) return "High confidence";
  if (completionRatio >= 0.55) return validationErrors > 1 ? "Medium confidence" : "High confidence";
  if (completionRatio >= 0.3) return "Medium confidence";
  return "Low confidence";
};

export const formatPercentage = (value: number | string) => `${value}%`;

export const formatScore = (value: number | string) => `${value}/100`;
