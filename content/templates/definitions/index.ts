import type { TemplateDefinition } from "./types";

const clampValue = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const riskBands = [
  { label: "Low", max: 6 },
  { label: "Moderate", max: 12 },
  { label: "High", max: 18 },
  { label: "Critical", max: 25 },
];

const resolveBand = (score: number) => riskBands.find((band) => score <= band.max)?.label || "Critical";

export const templateDefinitions: TemplateDefinition[] = [
  {
    slug: "cyber-risk-register",
    title: "Cyber Risk Register Generator",
    category: "cybersecurity-architecture",
    version: "1.0.0",
    description: "Create a quick risk entry with likelihood, impact, and control strength to focus on the right mitigations.",
    estimatedMinutes: 8,
    fields: [
      { id: "assetType", type: "text", label: "Asset type", placeholder: "Payment gateway", required: true, help: "What needs protection" },
      { id: "threatType", type: "text", label: "Threat type", placeholder: "Credential stuffing", required: true },
      { id: "likelihood", type: "slider", label: "Likelihood", required: true, validation: { min: 1, max: 5 }, defaultValue: 3, step: 1 },
      { id: "impact", type: "slider", label: "Impact", required: true, validation: { min: 1, max: 5 }, defaultValue: 3, step: 1 },
      {
        id: "controlStrength",
        type: "select",
        label: "Control strength",
        required: true,
        options: [
          { label: "Weak", value: "weak" },
          { label: "Adequate", value: "adequate" },
          { label: "Strong", value: "strong" },
        ],
        defaultValue: "adequate",
      },
    ],
    calcFn: (values) => {
      const likelihood = clampValue(Number(values.likelihood) || 1, 1, 5);
      const impact = clampValue(Number(values.impact) || 1, 1, 5);
      const control = values.controlStrength === "strong" ? 0.6 : values.controlStrength === "adequate" ? 0.8 : 1;
      const rawScore = likelihood * impact;
      const adjusted = Math.round(rawScore * control * 10) / 10;
      const band = resolveBand(adjusted);

      const assumptions = [
        "Scores are ordinal; final risk band should be reviewed with context.",
        "Control strength is a rough proxy, not a full control assurance result.",
      ];

      const nextSteps = [
        "Validate control coverage against the specific threat path.",
        "Log the risk entry in your source of truth with owner and review date.",
        "Check monitoring and detection are aligned to this scenario.",
      ];

      return {
        scores: { risk: adjusted, likelihood, impact },
        riskBand: band,
        explanation: `The risk is rated ${band} based on likelihood ${likelihood} and impact ${impact} with control strength adjustment.`,
        assumptions,
        nextSteps,
        matrixPlacement: { row: 5 - impact, col: likelihood - 1 },
        chartData: [
          { name: "Risk", value: adjusted },
          { name: "Likelihood", value: likelihood },
          { name: "Impact", value: impact },
        ],
      };
    },
    charts: [
      { id: "risk-matrix", type: "matrix", title: "Risk matrix" },
      { id: "risk-radar", type: "radar", title: "Risk profile", series: [{ key: "value", label: "Score" }] },
    ],
    exportProfile: { allowPDF: true, allowDOCX: true, allowXLSX: true, allowJSON: true },
    disclaimer: "Informational only. Not legal advice. Results depend on inputs.",
  },
  {
    slug: "phishing-email-triage",
    title: "Phishing Email Triage",
    category: "cybersecurity-architecture",
    version: "1.0.0",
    description: "Score an email scenario for likely phishing risk with clear next actions.",
    estimatedMinutes: 6,
    fields: [
      { id: "senderDomain", type: "text", label: "Sender domain", placeholder: "example.com", required: true },
      { id: "subject", type: "text", label: "Subject", placeholder: "Payment request", required: true },
      {
        id: "urgency",
        type: "slider",
        label: "Urgency",
        required: true,
        validation: { min: 1, max: 5 },
        defaultValue: 3,
        step: 1,
        help: "Higher urgency increases risk.",
      },
      { id: "hasLinks", type: "toggle", label: "Contains links", defaultValue: true },
      {
        id: "languageFlags",
        type: "multiselect",
        label: "Suspicious language cues",
        options: [
          { label: "Payment instructions", value: "payment" },
          { label: "Credential reset", value: "reset" },
          { label: "Threatening tone", value: "threat" },
          { label: "Unexpected attachment mention", value: "attachment" },
        ],
        help: "Tick what you observe.",
      },
    ],
    calcFn: (values) => {
      const urgency = clampValue(Number(values.urgency) || 1, 1, 5);
      const hasLinks = Boolean(values.hasLinks);
      const flags = Array.isArray(values.languageFlags) ? values.languageFlags : [];
      const base = urgency * 2 + (hasLinks ? 2 : 0) + flags.length;
      const score = clampValue(base, 1, 20);
      const band = score > 14 ? "High" : score > 8 ? "Moderate" : "Low";
      const explanation = `Risk scored ${score} due to urgency ${urgency}${hasLinks ? ", links present" : ""}${flags.length ? `, ${flags.length} language flags` : ""}.`;
      const assumptions = [
        "Scoring is heuristic; always confirm with technical controls.",
        "No email body content is processed here.",
      ];
      const nextSteps = [
        "Verify sender via a trusted channel before acting.",
        "Do not click links until the sender is verified.",
        "Report to security if tone or request is unusual.",
      ];
      return {
        scores: { risk: score },
        riskBand: band,
        explanation,
        assumptions,
        nextSteps,
        chartData: [{ name: "Risk score", value: score }],
      };
    },
    charts: [{ id: "risk-bar", type: "bar", title: "Risk factors", xKey: "name", yKeys: ["value"] }],
    exportProfile: { allowPDF: true, allowDOCX: true, allowXLSX: true, allowJSON: true },
    disclaimer: "Informational only. Not legal advice. Results depend on inputs.",
  },
  {
    slug: "ai-model-evaluation-planner",
    title: "AI Model Evaluation Planner",
    category: "ai-systems-models",
    version: "1.0.0",
    description: "Plan metrics, baselines, and risks for an AI model evaluation before rollout.",
    estimatedMinutes: 10,
    fields: [
      {
        id: "taskType",
        type: "select",
        label: "Task type",
        required: true,
        options: [
          { label: "Classification", value: "classification" },
          { label: "Regression", value: "regression" },
          { label: "NLP", value: "nlp" },
        ],
        defaultValue: "classification",
      },
      {
        id: "datasetSize",
        type: "select",
        label: "Dataset size bracket",
        required: true,
        options: [
          { label: "Under 10k rows", value: "small" },
          { label: "10k to 1m rows", value: "medium" },
          { label: "Over 1m rows", value: "large" },
        ],
        defaultValue: "medium",
      },
      { id: "fairness", type: "toggle", label: "Fairness constraints present", defaultValue: false },
      {
        id: "deployment",
        type: "select",
        label: "Deployment context",
        required: true,
        options: [
          { label: "Batch analytics", value: "batch" },
          { label: "Online API", value: "online" },
          { label: "Edge device", value: "edge" },
        ],
        defaultValue: "online",
      },
    ],
    calcFn: (values) => {
      const task = values.taskType || "classification";
      const size = values.datasetSize || "medium";
      const fairness = Boolean(values.fairness);
      const deployment = values.deployment || "online";

      const metrics =
        task === "classification"
          ? ["F1", "Recall", "AUC"]
          : task === "regression"
          ? ["RMSE", "MAE", "R2"]
          : ["BLEU", "ROUGE-L", "Toxicity screens"];

      const plan = [
        `Baseline for ${task}: choose a simple model as control.`,
        `Validation split tailored for ${size} dataset.`,
        fairness ? "Add fairness slices and parity checks." : "Note fairness is not enabled; document rationale.",
        deployment === "edge" ? "Test latency and model size for device limits." : "Check p99 latency and error budgets.",
      ];

      const riskScore = (task === "classification" ? 6 : 5) + (size === "large" ? 3 : 1) + (fairness ? 2 : 0);
      const band = riskScore > 9 ? "High" : riskScore > 6 ? "Moderate" : "Low";

      const assumptions = ["Metrics and plan are guidance; align with your governance and data policies."];
      const nextSteps = ["Document metrics, thresholds, and reviewers.", "Set evaluation cadence and owners.", "Record known risks and mitigations."];

      return {
        scores: { risk: riskScore },
        riskBand: band,
        explanation: `Plan focuses on ${metrics.join(", ")} with risk band ${band}.`,
        assumptions,
        nextSteps,
        chartData: metrics.map((metric, idx) => ({ name: metric, value: 5 - idx })),
      };
    },
    charts: [
      { id: "metrics-radar", type: "radar", title: "Metric emphasis", series: [{ key: "value", label: "Weight" }] },
      { id: "risk-bar", type: "bar", title: "Risk factors", xKey: "name", yKeys: ["value"] },
    ],
    exportProfile: { allowPDF: true, allowDOCX: true, allowXLSX: true, allowJSON: true },
    disclaimer: "Informational only. Not legal advice. Results depend on inputs.",
  },
  {
    slug: "technical-risk-scoring",
    title: "Technical Risk Scoring",
    category: "cybersecurity-architecture",
    description: "Score a scenario with likelihood, impact, and control strength to get a focused recommendation.",
    estimatedMinutes: 5,
    fields: [
      { id: "likelihood", type: "slider", label: "Likelihood (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 3, step: 1 },
      { id: "impact", type: "slider", label: "Impact (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 3, step: 1 },
      {
        id: "controlStrength",
        type: "select",
        label: "Control strength",
        required: true,
        options: [
          { label: "Weak", value: "weak" },
          { label: "Adequate", value: "adequate" },
          { label: "Strong", value: "strong" },
        ],
        defaultValue: "adequate",
      },
    ],
    calcFn: (values) => {
      const likelihood = clampValue(Number(values.likelihood) || 1, 1, 5);
      const impact = clampValue(Number(values.impact) || 1, 1, 5);
      const control = values.controlStrength === "strong" ? 0.6 : values.controlStrength === "adequate" ? 0.8 : 1;
      const rawScore = likelihood * impact;
      const adjusted = Math.round(rawScore * control * 10) / 10;
      const band = resolveBand(adjusted);
      return {
        scores: { risk: adjusted, likelihood, impact },
        riskBand: band,
        explanation: `Score ${adjusted} (${band}) using likelihood ${likelihood}, impact ${impact}, and control strength modifier.`,
        assumptions: ["Ordinal scale; validate with your risk taxonomy.", "Control strength is a heuristic multiplier."],
        nextSteps: [
          "Document owner and review cadence.",
          "Verify controls against the specific threat path.",
          "Align monitoring and response for this scenario.",
        ],
        chartData: [
          { name: "Risk", value: adjusted },
          { name: "Likelihood", value: likelihood },
          { name: "Impact", value: impact },
        ],
        matrixPlacement: { row: 5 - impact, col: likelihood - 1 },
        meaning: "Shows blended risk with a simple control adjustment.",
        whyItMatters: "Helps prioritise mitigations with a transparent formula.",
        whenItBreaks: "If inputs are subjective or scales differ from your programme.",
      };
    },
    charts: [
      { id: "risk-matrix", type: "matrix", title: "Risk matrix" },
      { id: "risk-radar", type: "radar", title: "Risk profile", series: [{ key: "value", label: "Score" }] },
    ],
    exportProfile: { allowPDF: true, allowDOCX: true, allowXLSX: true, allowJSON: true },
    disclaimer: "Informational only. Not legal advice. Results depend on inputs.",
  },
  {
    slug: "data-architecture-maturity",
    title: "Data Architecture Maturity Assessment",
    category: "data-architecture-governance",
    description: "Assess governance, standards, tooling, and skills to gauge data architecture maturity.",
    estimatedMinutes: 7,
    fields: [
      { id: "governance", type: "slider", label: "Governance strength", required: true, validation: { min: 1, max: 5 }, defaultValue: 3, step: 1 },
      { id: "standards", type: "slider", label: "Standards adoption", required: true, validation: { min: 1, max: 5 }, defaultValue: 3, step: 1 },
      { id: "tooling", type: "slider", label: "Tooling coverage", required: true, validation: { min: 1, max: 5 }, defaultValue: 3, step: 1 },
      { id: "skills", type: "slider", label: "Team skills", required: true, validation: { min: 1, max: 5 }, defaultValue: 3, step: 1 },
    ],
    calcFn: (values) => {
      const g = clampValue(Number(values.governance) || 1, 1, 5);
      const s = clampValue(Number(values.standards) || 1, 1, 5);
      const t = clampValue(Number(values.tooling) || 1, 1, 5);
      const k = clampValue(Number(values.skills) || 1, 1, 5);
      const avg = Math.round(((g + s + t + k) / 4) * 20);
      const band = avg >= 80 ? "High" : avg >= 60 ? "Moderate" : "Low";
      const gaps = [
        g < 4 ? "Strengthen governance roles and decision rights." : null,
        s < 4 ? "Standardise schemas, lineage, and change control." : null,
        t < 4 ? "Improve platform coverage and automation." : null,
        k < 4 ? "Upskill teams on data contracts and quality." : null,
      ].filter(Boolean) as string[];
      return {
        scores: { risk: avg },
        riskBand: band,
        explanation: `Maturity is ${avg}/100 (${band}). Governance ${g}, standards ${s}, tooling ${t}, skills ${k}.`,
        assumptions: ["Inputs are self-reported; validate with evidence.", "Scale is coarse; refine per domain if needed."],
        nextSteps: gaps.length ? gaps : ["Maintain cadence of reviews and quality checks."],
        chartData: [
          { name: "Governance", value: g * 20 },
          { name: "Standards", value: s * 20 },
          { name: "Tooling", value: t * 20 },
          { name: "Skills", value: k * 20 },
        ],
        meaning: "Shows a quick read of data architecture maturity.",
        whyItMatters: "Highlights where to invest for reliability and trust in data.",
        whenItBreaks: "If scores are guessed or vary widely across teams.",
      };
    },
    charts: [
      { id: "maturity-radar", type: "radar", title: "Maturity profile", series: [{ key: "value", label: "Score" }] },
      { id: "maturity-bar", type: "bar", title: "Component scores", xKey: "name", yKeys: ["value"] },
    ],
    exportProfile: { allowPDF: true, allowDOCX: true, allowXLSX: true, allowJSON: true },
    disclaimer: "Informational only. Not legal advice. Results depend on inputs.",
  },
];

export const definitionMap = Object.fromEntries(templateDefinitions.map((def) => [def.slug, def]));

export function getTemplateDefinition(slug: string) {
  return definitionMap[slug];
}
