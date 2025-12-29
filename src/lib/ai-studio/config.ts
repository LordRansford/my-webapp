/**
 * AI Studio Configuration
 * 
 * Centralized configuration constants
 */

export interface AIStudioConfig {
  features: {
    datasets: boolean;
    models: boolean;
    training: boolean;
    agents: boolean;
    deployment: boolean;
  };
  limits: {
    maxFileSize: number;
    maxDatasets: number;
    maxModels: number;
    maxTrainingJobs: number;
    maxAgents: number;
  };
  compute: {
    browserEnabled: boolean;
    cpuEnabled: boolean;
    gpuEnabled: boolean;
  };
  storage: {
    provider: "vercel-blob" | "s3" | "r2" | "supabase";
    maxFileSize: number;
    allowedTypes: string[];
  };
  pricing: {
    browser: {
      base: number;
      perGB: number;
    };
    cpu: {
      base: number;
      perGB: number;
    };
    gpu: {
      base: number;
      perGB: number;
      highEnd: number;
    };
  };
}

/**
 * Default configuration
 */
export const DEFAULT_CONFIG: AIStudioConfig = {
  features: {
    datasets: true,
    models: true,
    training: true,
    agents: true,
    deployment: true,
  },
  limits: {
    maxFileSize: 100 * 1024 * 1024, // 100MB
    maxDatasets: 100,
    maxModels: 50,
    maxTrainingJobs: 20,
    maxAgents: 30,
  },
  compute: {
    browserEnabled: true,
    cpuEnabled: true,
    gpuEnabled: true,
  },
  storage: {
    provider: "vercel-blob",
    maxFileSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: [".csv", ".json", ".jsonl", ".parquet", ".hdf5"],
  },
  pricing: {
    browser: {
      base: 0,
      perGB: 0,
    },
    cpu: {
      base: 0.10,
      perGB: 0.01,
    },
    gpu: {
      base: 0.50,
      perGB: 0.05,
      highEnd: 2.00,
    },
  },
};

/**
 * Get configuration from environment variables
 */
export function getConfig(): AIStudioConfig {
  const config = { ...DEFAULT_CONFIG };

  // Override with environment variables if present
  if (process.env.AI_STUDIO_MAX_FILE_SIZE) {
    config.limits.maxFileSize = parseInt(process.env.AI_STUDIO_MAX_FILE_SIZE);
    config.storage.maxFileSize = parseInt(process.env.AI_STUDIO_MAX_FILE_SIZE);
  }

  if (process.env.AI_STUDIO_STORAGE_PROVIDER) {
    config.storage.provider = process.env.AI_STUDIO_STORAGE_PROVIDER as any;
  }

  if (process.env.AI_STUDIO_FEATURES) {
    const features = process.env.AI_STUDIO_FEATURES.split(",");
    config.features.datasets = features.includes("datasets");
    config.features.models = features.includes("models");
    config.features.training = features.includes("training");
    config.features.agents = features.includes("agents");
    config.features.deployment = features.includes("deployment");
  }

  return config;
}

/**
 * Check if feature is enabled
 */
export function isFeatureEnabled(feature: keyof AIStudioConfig["features"]): boolean {
  const config = getConfig();
  return config.features[feature];
}

/**
 * Check if compute type is enabled
 */
export function isComputeEnabled(type: "browser" | "cpu" | "gpu"): boolean {
  const config = getConfig();
  switch (type) {
    case "browser":
      return config.compute.browserEnabled;
    case "cpu":
      return config.compute.cpuEnabled;
    case "gpu":
      return config.compute.gpuEnabled;
    default:
      return false;
  }
}

/**
 * Get file size limit
 */
export function getMaxFileSize(): number {
  return getConfig().limits.maxFileSize;
}

/**
 * Get allowed file types
 */
export function getAllowedFileTypes(): string[] {
  return getConfig().storage.allowedTypes;
}

