export type RunnerJobRequest = {
  toolId: string;
  jobId: string;
  payload: unknown;
  limits: {
    maxRunMs: number;
    maxOutputBytes: number;
    maxMemoryMb: number;
  };
};

export type RunnerJobResponse = {
  ok: boolean;
  stdout?: string;
  stderr?: string;
  artifacts?: Array<{ key: string; contentType: string; sizeBytes: number; ref: string }>;
  metrics: { runMs: number; peakMemoryMb?: number };
  error?: { code: string; message: string };
};


