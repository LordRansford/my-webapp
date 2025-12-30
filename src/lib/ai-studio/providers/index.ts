export interface AuthResult {
  success: boolean;
  token?: string;
  error?: string;
}

export interface TrainingConfig {
  modelId: string;
  datasetId: string;
  epochs: number;
  batchSize: number;
  learningRate?: number;
}

export interface Job {
  id: string;
  status: "pending" | "running" | "completed" | "failed";
  estimatedTime?: number;
  cost?: number;
}

export interface Deployment {
  id: string;
  endpoint: string;
  status: "deploying" | "active" | "failed";
}

export interface CostEstimate {
  training: number;
  inference: number;
  storage: number;
  total: number;
  currency: string;
}

export interface CloudProvider {
  id: string;
  name: string;
  logo: string;
  services: {
    training: boolean;
    inference: boolean;
    storage: boolean;
    deployment: boolean;
  };
  authenticate: () => Promise<AuthResult>;
  trainModel: (config: TrainingConfig) => Promise<Job>;
  deployModel: (modelId: string) => Promise<Deployment>;
  estimateCost: (config: TrainingConfig) => Promise<CostEstimate>;
}

export class ProviderManager {
  private providers: Map<string, CloudProvider> = new Map();

  registerProvider(provider: CloudProvider) {
    this.providers.set(provider.id, provider);
  }

  getProvider(id: string): CloudProvider | undefined {
    return this.providers.get(id);
  }

  getAllProviders(): CloudProvider[] {
    return Array.from(this.providers.values());
  }

  getProvidersByService(service: keyof CloudProvider["services"]): CloudProvider[] {
    return this.getAllProviders().filter((p) => p.services[service]);
  }
}

export const providerManager = new ProviderManager();

