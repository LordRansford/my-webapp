export type ComputeClass = "A" | "B" | "C";

export type ComputeTier = {
  freeUnitsPerRun: number;
  freeUnitsPerSession: number;
  creditUnitsPerCredit: number;
};

/**
 * Job Runner compute limits (server-side execution).
 *
 * This is separate from UI-oriented compute profiles above. The Job Runner needs
 * hard caps and free-tier accounting in milliseconds, plus per-tool allowlists.
 */
export type JobRunnerToolLimits = {
  toolId: string;
  maxInputBytesFreeAnon: number;
  maxInputBytesFreeAuthed: number;
  maxRunMsHardCap: number;
  freeMsPerDayAuthed: number;
  freeMsPerDayAnon: number;
  creditsPerMsPaid: number;
  allowAnonymous: boolean;
  allowAuthed: boolean;
};

const SECOND_MS = 1000;

export const JOB_RUNNER_TOOL_LIMITS: Record<string, JobRunnerToolLimits> = {
  "mentor-query": {
    toolId: "mentor-query",
    maxInputBytesFreeAnon: 1_000,
    maxInputBytesFreeAuthed: 6_000,
    maxRunMsHardCap: 60 * SECOND_MS,
    freeMsPerDayAuthed: 30 * SECOND_MS,
    freeMsPerDayAnon: 8 * SECOND_MS,
    creditsPerMsPaid: 1 / (10 * SECOND_MS), // 1 credit per 10s paid
    allowAnonymous: true,
    allowAuthed: true,
  },
  "whois-summary": {
    toolId: "whois-summary",
    maxInputBytesFreeAnon: 300,
    maxInputBytesFreeAuthed: 2_000,
    maxRunMsHardCap: 20 * SECOND_MS,
    freeMsPerDayAuthed: 60 * SECOND_MS,
    freeMsPerDayAnon: 15 * SECOND_MS,
    creditsPerMsPaid: 1 / (20 * SECOND_MS), // 1 credit per 20s paid
    allowAnonymous: true,
    allowAuthed: true,
  },
  "templates-request-download": {
    toolId: "templates-request-download",
    maxInputBytesFreeAnon: 600,
    maxInputBytesFreeAuthed: 2_000,
    maxRunMsHardCap: 30 * SECOND_MS,
    freeMsPerDayAuthed: 20 * SECOND_MS,
    freeMsPerDayAnon: 0,
    creditsPerMsPaid: 1 / (10 * SECOND_MS),
    allowAnonymous: false,
    allowAuthed: true,
  },
  "sandbox-echo": {
    toolId: "sandbox-echo",
    maxInputBytesFreeAnon: 2_000,
    maxInputBytesFreeAuthed: 10_000,
    maxRunMsHardCap: 15 * SECOND_MS,
    freeMsPerDayAuthed: 20 * SECOND_MS,
    freeMsPerDayAnon: 10 * SECOND_MS,
    creditsPerMsPaid: 1 / (10 * SECOND_MS),
    allowAnonymous: true,
    allowAuthed: true,
  },
  "code-runner": {
    toolId: "code-runner",
    maxInputBytesFreeAnon: 6_500,
    maxInputBytesFreeAuthed: 6_500,
    maxRunMsHardCap: 8 * SECOND_MS,
    freeMsPerDayAuthed: 20 * SECOND_MS,
    freeMsPerDayAnon: 10 * SECOND_MS,
    creditsPerMsPaid: 1 / (10 * SECOND_MS),
    allowAnonymous: true,
    allowAuthed: true,
  },
};

export function getJobRunnerToolLimits(toolId: string): JobRunnerToolLimits | null {
  return JOB_RUNNER_TOOL_LIMITS[toolId] || null;
}

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

  // Mentor (server assisted, bounded).
  "mentor-query": {
    toolId: "mentor-query",
    label: "Mentor",
    computeClass: "B",
    typicalInputBytes: 2_000,
    typicalSteps: 6,
    guidance: ["Ask one focused question at a time.", "Include the page link so the match is tighter.", "Shorter questions usually respond faster."],
  },

  // Template access evaluation (server assisted, bounded).
  "templates-request-download": {
    toolId: "templates-request-download",
    label: "Template download request",
    computeClass: "B",
    typicalInputBytes: 800,
    typicalSteps: 3,
    guidance: ["Choose one template at a time.", "Keep the requested use clear and short."],
  },

  // AI Studio (Model Forge): local training but metered for predictable limits and future paid tiers.
  "model-forge-train": {
    toolId: "model-forge-train",
    label: "Model Forge training",
    computeClass: "B",
    typicalInputBytes: 250_000,
    typicalSteps: 200,
    fileLimits: { freeMaxBytes: 350 * 1024, paidMaxBytes: 2 * MB, absoluteMaxBytes: 4 * MB },
    guidance: ["Start with fewer rows and fewer epochs.", "Try one target column at a time.", "Avoid high-cardinality text columns in a tabular demo."],
    scenarios: [
      { title: "Small CSV", estimateNote: "A small CSV with light training usually fits in the free tier.", mediumRunsPerTenCredits: 40 },
      { title: "Bigger dataset", estimateNote: "Larger datasets and more iterations can exceed the free tier.", largeRunCredits: 2 },
    ],
  },

  // Software Development Studio: trade-off simulator is local-first and low compute by default.
  "software-tradeoff-sim": {
    toolId: "software-tradeoff-sim",
    label: "Engineering trade-off simulator",
    computeClass: "A",
    typicalInputBytes: 400,
    typicalSteps: 50,
    guidance: ["Keep constraints realistic.", "Change one variable at a time so you can explain causality.", "Write down the decision rule you are using."],
  },

  // Data and Digitalisation Studio: lightweight governance-led simulators (local only).
  "data-roadmap-sim": {
    toolId: "data-roadmap-sim",
    label: "Data and digitalisation roadmap simulator",
    computeClass: "A",
    typicalInputBytes: 600,
    typicalSteps: 60,
    guidance: ["Keep the first pass simple: purpose, owners, and controls.", "Improve quality at source before building bigger dashboards.", "Write down your decision rule."],
  },

  // Cybersecurity Studio: lightweight risk/control mapping simulator (local).
  "cyber-risk-sim": {
    toolId: "cyber-risk-sim",
    label: "Cyber risk mapping simulator",
    computeClass: "A",
    typicalInputBytes: 700,
    typicalSteps: 70,
    guidance: ["Start with one asset and one realistic threat.", "Pick controls you can operate and measure.", "Write the acceptance criteria for residual risk."],
  },

  // Responsible AI Studio: lightweight, illustrative tools (local only).
  "ai-prompt-compare": {
    toolId: "ai-prompt-compare",
    label: "Prompt comparison playground",
    computeClass: "A",
    typicalInputBytes: 2_000,
    typicalSteps: 40,
    guidance: ["Compare small prompt changes only.", "Write what success looks like before you run.", "Treat results as illustrative, not definitive."],
  },
  "ai-consistency-test": {
    toolId: "ai-consistency-test",
    label: "Output consistency tester",
    computeClass: "A",
    typicalInputBytes: 2_500,
    typicalSteps: 80,
    guidance: ["Run a few samples first, then increase.", "Separate prompt quality from model randomness.", "Log both the prompt and the settings."],
  },
  "ai-bias-sim": {
    toolId: "ai-bias-sim",
    label: "Bias scenario explorer",
    computeClass: "A",
    typicalInputBytes: 1_500,
    typicalSteps: 90,
    guidance: ["Bias often comes from data and labels, not intent.", "Check base rates before blaming the model.", "Always define who is harmed by errors."],
  },
  "ai-behaviour-compare": {
    toolId: "ai-behaviour-compare",
    label: "Model behaviour comparison (simulated)",
    computeClass: "A",
    typicalInputBytes: 2_200,
    typicalSteps: 70,
    guidance: ["Compare behaviours, not vibes.", "Look for quiet failures and edge cases.", "Decide when not to use AI."],
  },

  // AI Studio project compute demos (server metered, deterministic).
  "ai-story-generator": {
    toolId: "ai-story-generator",
    label: "Story generator (safe demo)",
    computeClass: "A",
    typicalInputBytes: 160,
    typicalSteps: 40,
    guidance: ["Keep prompts short for cheaper runs.", "Add detail gradually.", "Use child-friendly language for child projects."],
  },
  "ai-homework-helper": {
    toolId: "ai-homework-helper",
    label: "Homework helper (safe demo)",
    computeClass: "A",
    typicalInputBytes: 220,
    typicalSteps: 55,
    guidance: ["Write the exact equation if possible.", "Ask for steps, not just answers.", "Check the final answer by substitution."],
  },
  "ai-support-bot": {
    toolId: "ai-support-bot",
    label: "Support bot (safe demo)",
    computeClass: "A",
    typicalInputBytes: 220,
    typicalSteps: 55,
    guidance: ["Keep one intent per message (return/refund/delivery).", "Avoid sensitive personal data in demos.", "Save strong replies as templates."],
  },

  "studio-help-assistant": {
    toolId: "studio-help-assistant",
    label: "Studios help assistant",
    computeClass: "A",
    typicalInputBytes: 420,
    typicalSteps: 70,
    guidance: ["Ask one clear question at a time.", "Paste your requirements to tailor examples.", "Use the light preset for cheaper runs."],
  },
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


