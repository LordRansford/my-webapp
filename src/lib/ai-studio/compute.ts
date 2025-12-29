/**
 * Compute Cost Estimation Utilities
 * 
 * Calculates costs for AI training and inference operations
 */

export interface ComputeEstimate {
  estimatedCost: number;
  estimatedDuration: number; // in seconds
  computeUnits: number;
  breakdown: {
    model: number;
    dataset: number;
    duration: number;
    gpuHours?: number;
  };
}

export interface ComputeRequest {
  model: string;
  datasetSize?: number; // in bytes
  duration?: number; // in seconds
  computeType: "browser" | "gpu" | "cpu";
  region?: string;
}

/**
 * Pricing tiers (per hour)
 */
const PRICING = {
  browser: {
    base: 0, // Free tier
    perGB: 0,
  },
  cpu: {
    base: 0.10, // $0.10/hour
    perGB: 0.01, // $0.01/GB/hour
  },
  gpu: {
    base: 0.50, // $0.50/hour (entry-level GPU)
    perGB: 0.05, // $0.05/GB/hour
    highEnd: 2.00, // $2.00/hour (high-end GPU)
  },
};

/**
 * Model complexity multipliers
 */
const MODEL_COMPLEXITY: Record<string, number> = {
  "gpt-4": 10,
  "gpt-3.5": 3,
  "bert-base": 1,
  "resnet-50": 2,
  "custom": 1,
};

/**
 * Estimate compute cost for a training job
 */
export async function estimateComputeCost(
  request: ComputeRequest
): Promise<ComputeEstimate> {
  const { model, datasetSize = 0, duration, computeType, region = "us-east-1" } = request;

  // Base pricing
  const pricing = PRICING[computeType];
  if (!pricing) {
    throw new Error(`Invalid compute type: ${computeType}`);
  }

  // Model complexity
  const modelMultiplier = MODEL_COMPLEXITY[model] || MODEL_COMPLEXITY["custom"];

  // Dataset size in GB
  const datasetGB = datasetSize / (1024 * 1024 * 1024);

  // Estimated duration (if not provided, estimate based on dataset size)
  const estimatedDuration = duration || Math.max(300, datasetGB * 60); // Minimum 5 minutes

  // Calculate compute units
  let computeUnits = 1;
  if (computeType === "gpu") {
    computeUnits = Math.ceil(datasetGB / 10) || 1; // 1 GPU per 10GB
  }

  // Calculate cost
  let estimatedCost = 0;
  if (computeType === "browser") {
    estimatedCost = 0; // Free
  } else {
    const hourlyRate = pricing.base * modelMultiplier + pricing.perGB * datasetGB;
    const hours = estimatedDuration / 3600;
    estimatedCost = hourlyRate * hours * computeUnits;
  }

  return {
    estimatedCost: Math.round(estimatedCost * 100) / 100, // Round to 2 decimals
    estimatedDuration,
    computeUnits,
    breakdown: {
      model: pricing.base * modelMultiplier,
      dataset: pricing.perGB * datasetGB,
      duration: estimatedDuration,
      ...(computeType === "gpu" && { gpuHours: (estimatedDuration / 3600) * computeUnits }),
    },
  };
}

/**
 * Format cost for display
 */
export function formatCost(cost: number): string {
  if (cost === 0) return "Free";
  if (cost < 0.01) return "< $0.01";
  return `$${cost.toFixed(2)}`;
}

/**
 * Format duration for display
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

