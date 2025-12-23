export type UploadPolicy = {
  toolId: string;
  allowExtensions: string[];
  freeMaxBytes: number;
  paidMaxBytes: number;
};

const MB = 1024 * 1024;

export function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  if (bytes < 1024) return `${Math.round(bytes)} B`;
  if (bytes < MB) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / MB).toFixed(1)} MB`;
}

// Central, explicit upload policies.
// These are UX policies (pre-flight checks) and must not weaken server-side limits.
const POLICIES: Record<string, UploadPolicy> = {
  "model-forge-train": {
    toolId: "model-forge-train",
    allowExtensions: [".csv", ".json"],
    freeMaxBytes: 2 * MB,
    paidMaxBytes: 12 * MB,
  },
  "docs-data-lab": {
    toolId: "docs-data-lab",
    allowExtensions: [".pdf", ".docx", ".txt", ".csv"],
    freeMaxBytes: 4 * MB,
    paidMaxBytes: 12 * MB,
  },
  "speech-lab-audio": {
    toolId: "speech-lab-audio",
    allowExtensions: [".wav", ".mp3", ".m4a", ".webm"],
    freeMaxBytes: 5 * MB,
    paidMaxBytes: 15 * MB,
  },
  "vision-lab-image": {
    toolId: "vision-lab-image",
    allowExtensions: [".png", ".jpg", ".jpeg"],
    freeMaxBytes: 3 * MB,
    paidMaxBytes: 10 * MB,
  },
};

export function getUploadPolicy(toolId: string): UploadPolicy | null {
  const id = String(toolId || "").trim();
  return POLICIES[id] || null;
}


