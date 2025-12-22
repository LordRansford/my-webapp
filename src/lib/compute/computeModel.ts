export type ComputeIntensity = "low" | "medium" | "high";
export type FreeTierCoverage = "yes" | "likely" | "no";

export type CostDriver = {
  id: "input_size" | "file_size" | "iterations" | "model_complexity" | "execution_class";
  label: string;
  explanation: string;
};

export const COMPUTE_MODEL = {
  // Conceptual only for Prompt 12: this is not enforcement.
  // Set slightly below typical browser safe limits so future limits can be enabled without surprises.
  freeTierLimitUnits: 7_500,
  computeUnitsAreMoney: false,
  computeUnitsLabel: "compute units",
  costDrivers: [
    {
      id: "input_size",
      label: "Input size",
      explanation: "Longer inputs and larger payloads usually take more work to validate, transform, and process.",
    },
    {
      id: "file_size",
      label: "File size",
      explanation: "Larger files take longer to parse and can require more memory during processing.",
    },
    {
      id: "iterations",
      label: "Iterations",
      explanation: "More steps, retries, or runs usually increase compute usage.",
    },
    {
      id: "model_complexity",
      label: "Model complexity",
      explanation: "Heavier models or extra analysis paths can increase compute usage significantly.",
    },
    {
      id: "execution_class",
      label: "Browser vs server",
      explanation: "Browser-powered tools use your device. Server-assisted tools use a small, bounded server helper.",
    },
  ] satisfies CostDriver[],
} as const;

export function computeIntensityFromUnits(units: number): ComputeIntensity {
  const u = Math.max(0, Math.round(units));
  if (u < COMPUTE_MODEL.freeTierLimitUnits * 0.4) return "low";
  if (u < COMPUTE_MODEL.freeTierLimitUnits * 0.9) return "medium";
  return "high";
}

export function freeTierCoverageFromUnits(units: number): FreeTierCoverage {
  const u = Math.max(0, Math.round(units));
  if (u <= COMPUTE_MODEL.freeTierLimitUnits) return "yes";
  if (u <= COMPUTE_MODEL.freeTierLimitUnits * 1.25) return "likely";
  return "no";
}



