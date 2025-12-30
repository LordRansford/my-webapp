export interface ModelConfig {
  type: "classification" | "regression" | "clustering" | "generation" | "other";
  architecture: string;
  parameters: Record<string, unknown>;
}

export interface DatasetConfig {
  source?: string;
  format?: string;
  size?: number;
  columns?: string[];
}

export interface TrainingConfig {
  epochs: number;
  batchSize: number;
  learningRate?: number;
  validationSplit?: number;
}

export interface DeploymentConfig {
  platform: "api" | "edge" | "cloud";
  endpoint?: string;
  region?: string;
}

export interface TutorialStep {
  step: number;
  title: string;
  description: string;
  action: string;
}

export interface PreviewData {
  input: string | Record<string, unknown>;
  output: string | Record<string, unknown>;
  explanation: string;
}

export interface AIStudioExample {
  id: string;
  title: string;
  description: string;
  audience: "children" | "student" | "professional" | "all";
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  useCase: string;
  estimatedCredits: number;
  estimatedTime: string;
  prerequisites: string[];
  config: {
    model: ModelConfig;
    dataset?: DatasetConfig;
    training?: TrainingConfig;
    deployment?: DeploymentConfig;
  };
  tutorial: TutorialStep[];
  preview: PreviewData;
}

