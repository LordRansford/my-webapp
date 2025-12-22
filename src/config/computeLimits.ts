export type ComputeClass = "A" | "B" | "C";

export type ComputeTier = {
  freeUnitsPerRun: number;
  freeUnitsPerSession: number;
  creditUnitsPerCredit: number;
};

export type ToolFileLimits = {
  freeMaxBytes: number;
  paidMaxBytes: number;
  absoluteMaxBytes: number;
};

export type ToolComputeProfile = {
  toolId: string;
  label: string;
  computeClass: ComputeClass;
  typicalInputBytes: number;
  typicalSteps: number;
  fileLimits?: ToolFileLimits;
  guidance: string[];
  scenarios?: Array<{
    title: string;
    estimateNote: string;
    mediumRunsPerTenCredits?: number;
    largeRunCredits?: number;
    browserOnlyCostsZero?: boolean;
  }>;
};

// These are "compute units", not money. The UI should describe them as an estimate.
// We keep the free tier slightly below typical browser tolerance to avoid freezes on weaker devices.
export const COMPUTE_TIER: ComputeTier = {
  freeUnitsPerRun: 7_500,
  freeUnitsPerSession: 30_000,
  creditUnitsPerCredit: 25_000,
};

const MB = 1024 * 1024;

export const TOOL_COMPUTE_PROFILES: Record<string, ToolComputeProfile> = {
  // Security dashboards (server-assisted, bounded).
  "dns-email-security-dashboard": {
    toolId: "dns-email-security-dashboard",
    label: "DNS email security",
    computeClass: "B",
    typicalInputBytes: 120,
    typicalSteps: 1,
    guidance: ["Shorter inputs reduce retries.", "Repeated checks of the same domain usually add little value. Try a different domain or a different tool."],
    scenarios: [{ title: "Typical runs", estimateNote: "Most runs are small and fit in the free tier.", mediumRunsPerTenCredits: 120, browserOnlyCostsZero: false }],
  },
  "https-redirect-checker": {
    toolId: "https-redirect-checker",
    label: "HTTPS redirect checker",
    computeClass: "B",
    typicalInputBytes: 200,
    typicalSteps: 6,
    guidance: ["Short redirect chains cost less.", "If you only need the final destination, do one check per key entry page."],
    scenarios: [{ title: "Redirect chains", estimateNote: "Costs rise with chain length.", mediumRunsPerTenCredits: 80 }],
  },
  "website-security-lab": {
    toolId: "website-security-lab",
    label: "Website security lab",
    computeClass: "B",
    typicalInputBytes: 240,
    typicalSteps: 6,
    guidance: ["Test one representative URL per site, then expand.", "Avoid long redirect chains or many subpaths unless needed."],
  },
  "email-header-phishing-lab": {
    toolId: "email-header-phishing-lab",
    label: "Email header lab",
    computeClass: "B",
    typicalInputBytes: 6_000,
    typicalSteps: 1,
    guidance: ["Paste headers only, not the message body.", "Trim the header block to the relevant hops if it is extremely long."],
  },
  "phishing-link-explainer": {
    toolId: "phishing-link-explainer",
    label: "Phishing link explainer",
    computeClass: "B",
    typicalInputBytes: 300,
    typicalSteps: 2,
    guidance: ["Short URLs and fewer redirects reduce work.", "Run a second check only if the context changed."],
  },
  "third-party-script-viewer": {
    toolId: "third-party-script-viewer",
    label: "Third party script viewer",
    computeClass: "B",
    typicalInputBytes: 200,
    typicalSteps: 4,
    guidance: ["Use one representative page per application area.", "Focus on scripts that run on authenticated pages first."],
  },

  // API tools (server assisted).
  "dns-lookup": { toolId: "dns-lookup", label: "DNS lookup", computeClass: "B", typicalInputBytes: 120, typicalSteps: 1, guidance: ["Use one hostname at a time."] },
  "tls-inspect": { toolId: "tls-inspect", label: "TLS inspect", computeClass: "B", typicalInputBytes: 120, typicalSteps: 1, guidance: ["Use a hostname rather than an IP.", "Retry only after you confirm the service is up."] },
  "whois-summary": { toolId: "whois-summary", label: "WHOIS summary", computeClass: "B", typicalInputBytes: 120, typicalSteps: 1, guidance: ["Compare results with context and expected registrant."] },
  "ip-reputation": { toolId: "ip-reputation", label: "IP reputation", computeClass: "B", typicalInputBytes: 60, typicalSteps: 1, guidance: ["Combine with logs and behavioural indicators."] },
};

export function getToolComputeProfile(toolId?: string | null): ToolComputeProfile | null {
  if (!toolId) return null;
  return TOOL_COMPUTE_PROFILES[toolId] || null;
}

export function getToolFileLimits(toolId?: string | null): ToolFileLimits | null {
  const p = getToolComputeProfile(toolId);
  return p?.fileLimits || null;
}

export function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  if (bytes < 1024) return `${Math.round(bytes)} B`;
  if (bytes < MB) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / MB).toFixed(1)} MB`;
}


