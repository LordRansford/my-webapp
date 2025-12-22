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
    slug: "cyber-control-gap-check",
    title: "Control Gap Quick Check (Starter)",
    category: "cybersecurity-architecture",
    description: "Quickly assess whether a scenario has prevention, detection, and recovery controls covered.",
    estimatedMinutes: 8,
    fields: [
      { id: "scenario", type: "text", label: "Scenario", placeholder: "Credential stuffing on login", required: true },
      { id: "prevention", type: "slider", label: "Prevention strength (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 3, step: 1 },
      { id: "detection", type: "slider", label: "Detection strength (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 2, step: 1 },
      { id: "response", type: "slider", label: "Response readiness (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 2, step: 1 },
      { id: "recovery", type: "slider", label: "Recovery readiness (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 2, step: 1 },
    ],
    calcFn: (values) => {
      const p = clampValue(Number(values.prevention) || 1, 1, 5);
      const d = clampValue(Number(values.detection) || 1, 1, 5);
      const r = clampValue(Number(values.response) || 1, 1, 5);
      const rec = clampValue(Number(values.recovery) || 1, 1, 5);
      const weakest = Math.min(p, d, r, rec);
      const score = clampValue(Math.round(((p + d + r + rec) / 20) * 100), 0, 100);
      const band = score >= 75 ? "High" : score >= 55 ? "Moderate" : "Low";
      const gaps = [
        d < 3 ? "Add detection: alerts, rate limits, anomaly rules, logging." : null,
        r < 3 ? "Add response: runbook, on-call, escalation, comms." : null,
        rec < 3 ? "Add recovery: rollback, backups, failover, rebuild steps." : null,
      ].filter(Boolean) as string[];
      return {
        scores: { risk: score, prevention: p, detection: d },
        riskBand: band,
        explanation: `Control coverage score: ${score}/100 (${band}). Weakest area is ${weakest}/5.`,
        assumptions: ["This is a lightweight sanity check, not a formal control assessment."],
        nextSteps: gaps.length ? gaps : ["Validate control effectiveness with tests and tabletop exercises."],
        chartData: [
          { name: "Prevention", value: p * 20 },
          { name: "Detection", value: d * 20 },
          { name: "Response", value: r * 20 },
          { name: "Recovery", value: rec * 20 },
        ],
      };
    },
    charts: [{ id: "control-gap-bar", type: "bar", title: "Signals", xKey: "name", yKeys: ["value"] }],
    exportProfile: { allowPDF: true, allowDOCX: true, allowXLSX: true, allowJSON: true },
    disclaimer: "Informational only. Not legal advice. Results depend on inputs.",
  },
  {
    slug: "data-quality-checklist",
    title: "Data Quality Checklist (Starter)",
    category: "data-architecture-governance",
    description: "Define a minimal quality checklist: completeness, validity, timeliness, and ownership.",
    estimatedMinutes: 10,
    fields: [
      { id: "dataset", type: "text", label: "Dataset", placeholder: "Customer transactions", required: true },
      { id: "completeness", type: "slider", label: "Completeness control (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 3, step: 1 },
      { id: "validity", type: "slider", label: "Validity control (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 3, step: 1 },
      { id: "timeliness", type: "slider", label: "Timeliness control (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 2, step: 1 },
      { id: "owner", type: "toggle", label: "Named owner and escalation path exists", defaultValue: false },
    ],
    calcFn: (values) => {
      const c = clampValue(Number(values.completeness) || 1, 1, 5);
      const v = clampValue(Number(values.validity) || 1, 1, 5);
      const t = clampValue(Number(values.timeliness) || 1, 1, 5);
      const owner = Boolean(values.owner);
      const score = clampValue(Math.round(((c + v + t + (owner ? 2 : 0)) / 17) * 100), 0, 100);
      const band = score >= 75 ? "High" : score >= 55 ? "Moderate" : "Low";
      const nextSteps = [
        c < 4 ? "Add completeness checks on key columns with thresholds." : null,
        v < 4 ? "Add validity checks (ranges, enums, referential integrity)." : null,
        t < 4 ? "Define freshness SLO and alert on delays." : null,
        !owner ? "Assign a named owner + escalation route." : null,
      ].filter(Boolean) as string[];
      return {
        scores: { risk: score, completeness: c, validity: v },
        riskBand: band,
        explanation: `Quality readiness: ${score}/100 (${band}).`,
        assumptions: ["Start small: a few controls are better than none.", "Document definitions so teams interpret metrics consistently."],
        nextSteps: nextSteps.length ? nextSteps : ["Review monthly and refine controls based on incidents and user feedback."],
        chartData: [
          { name: "Completeness", value: c * 20 },
          { name: "Validity", value: v * 20 },
          { name: "Timeliness", value: t * 20 },
          { name: "Ownership", value: owner ? 100 : 0 },
        ],
      };
    },
    charts: [{ id: "dq-bar", type: "bar", title: "Signals", xKey: "name", yKeys: ["value"] }],
    exportProfile: { allowPDF: true, allowDOCX: true, allowXLSX: true, allowJSON: true },
    disclaimer: "Informational only. Not legal advice. Results depend on inputs.",
  },
  {
    slug: "ai-monitoring-plan",
    title: "Model Monitoring Plan (Starter)",
    category: "ai-systems-models",
    description: "Draft a monitoring plan: performance, drift, safety signals, and review cadence.",
    estimatedMinutes: 12,
    fields: [
      { id: "modelName", type: "text", label: "Model/system", placeholder: "Customer support classifier", required: true },
      { id: "criticality", type: "select", label: "Criticality", required: true, options: [
        { label: "Low", value: "low" },
        { label: "Moderate", value: "moderate" },
        { label: "High", value: "high" },
      ], defaultValue: "moderate" },
      { id: "drift", type: "slider", label: "Drift risk (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 3, step: 1 },
      { id: "feedbackLoop", type: "toggle", label: "Human feedback loop exists", defaultValue: false },
      { id: "reviewCadence", type: "select", label: "Review cadence", required: true, options: [
        { label: "Weekly", value: "weekly" },
        { label: "Monthly", value: "monthly" },
        { label: "Quarterly", value: "quarterly" },
      ], defaultValue: "monthly" },
    ],
    calcFn: (values) => {
      const drift = clampValue(Number(values.drift) || 1, 1, 5);
      const fb = Boolean(values.feedbackLoop);
      const criticality = values.criticality || "moderate";
      const base = criticality === "high" ? 60 : criticality === "moderate" ? 45 : 30;
      const score = clampValue(base + drift * 6 + (fb ? 10 : 0), 0, 100);
      const band = score >= 75 ? "High" : score >= 55 ? "Moderate" : "Low";
      return {
        scores: { risk: score, drift },
        riskBand: band,
        explanation: `Monitoring readiness signal: ${score}/100 (${band}).`,
        assumptions: ["This suggests structure; it does not measure true risk.", "Monitoring should be paired with rollback and incident processes."],
        nextSteps: [
          "Define primary metric and slice metrics (by segment).",
          "Add drift checks (input distribution + output distribution).",
          fb ? "Operationalize feedback: sampling + labeling + review." : "Add a lightweight feedback loop (sampling + review).",
          "Set escalation and rollback triggers.",
        ],
        chartData: [
          { name: "Criticality", value: criticality === "high" ? 100 : criticality === "moderate" ? 70 : 40 },
          { name: "Drift risk", value: drift * 20 },
          { name: "Feedback loop", value: fb ? 100 : 0 },
        ],
      };
    },
    charts: [{ id: "ai-monitoring-bar", type: "bar", title: "Signals", xKey: "name", yKeys: ["value"] }],
    exportProfile: { allowPDF: true, allowDOCX: true, allowXLSX: true, allowJSON: true },
    disclaimer: "Informational only. Not legal advice. Results depend on inputs.",
  },
  {
    slug: "ea-target-state-onepager",
    title: "Target State One‑Pager (Starter)",
    category: "digital-enterprise-architecture",
    description: "Draft a concise target state: outcomes, principles, key capabilities, and constraints.",
    estimatedMinutes: 12,
    fields: [
      { id: "initiative", type: "text", label: "Initiative / programme", placeholder: "Digital onboarding", required: true },
      { id: "outcome", type: "textarea", label: "Primary outcome", placeholder: "Reduce onboarding time from 10 days to 1 day", required: true },
      { id: "constraints", type: "multiselect", label: "Constraints", options: [
        { label: "Regulatory", value: "regulatory" },
        { label: "Legacy platforms", value: "legacy" },
        { label: "Budget", value: "budget" },
        { label: "Skills", value: "skills" },
        { label: "Timeline", value: "timeline" },
      ]},
      { id: "principles", type: "slider", label: "Architecture principles clarity (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 3, step: 1 },
      { id: "stakeholders", type: "slider", label: "Stakeholder alignment confidence (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 3, step: 1 },
    ],
    calcFn: (values) => {
      const principles = clampValue(Number(values.principles) || 1, 1, 5);
      const stakeholders = clampValue(Number(values.stakeholders) || 1, 1, 5);
      const constraints = Array.isArray(values.constraints) ? values.constraints : [];
      const penalty = Math.min(20, constraints.length * 4);
      const score = clampValue(Math.round(((principles + stakeholders) / 10) * 100 - penalty), 0, 100);
      const band = score >= 75 ? "High" : score >= 55 ? "Moderate" : "Low";
      return {
        scores: { risk: score, principles, stakeholders },
        riskBand: band,
        explanation: `Target state readiness: ${score}/100 (${band}). Penalty reflects ${constraints.length} constraints that need explicit handling.`,
        assumptions: ["This is a documentation readiness score, not a delivery forecast.", "Treat constraints as items to resolve or design around."],
        nextSteps: [
          "List 6–10 target capabilities and name an owner for each.",
          "Write 3–5 principles (e.g. API-first, least privilege, product analytics).",
          "Validate the one‑pager with security, operations, and delivery leads.",
        ],
        chartData: [
          { name: "Principles", value: principles * 20 },
          { name: "Alignment", value: stakeholders * 20 },
          { name: "Constraints", value: Math.max(0, 100 - penalty) },
        ],
        meaning: "Shows whether the target state is crisp enough to guide decisions.",
        whyItMatters: "Unclear target states create rework and conflicting design choices.",
        whenItBreaks: "If teams score optimistically without evidence or stakeholder input.",
      };
    },
    charts: [{ id: "ea-target-state-bar", type: "bar", title: "Signals", xKey: "name", yKeys: ["value"] }],
    exportProfile: { allowPDF: true, allowDOCX: true, allowXLSX: true, allowJSON: true },
    disclaimer: "Informational only. Not legal advice. Results depend on inputs.",
  },
  {
    slug: "ea-portfolio-slice-prioritiser",
    title: "Portfolio Slice Prioritiser (Starter)",
    category: "digital-enterprise-architecture",
    description: "Rank a portfolio slice using value, feasibility, risk, and dependency load.",
    estimatedMinutes: 10,
    fields: [
      { id: "sliceName", type: "text", label: "Slice name", placeholder: "Customer onboarding automation", required: true },
      { id: "value", type: "slider", label: "Value (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 4, step: 1 },
      { id: "feasibility", type: "slider", label: "Feasibility (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 3, step: 1 },
      { id: "risk", type: "slider", label: "Delivery risk (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 3, step: 1 },
      { id: "dependencies", type: "slider", label: "Dependency load (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 2, step: 1 },
    ],
    calcFn: (values) => {
      const value = clampValue(Number(values.value) || 1, 1, 5);
      const feasibility = clampValue(Number(values.feasibility) || 1, 1, 5);
      const risk = clampValue(Number(values.risk) || 1, 1, 5);
      const dependencies = clampValue(Number(values.dependencies) || 1, 1, 5);
      const raw = value * 2 + feasibility * 2 - risk - dependencies;
      const score = clampValue(Math.round(((raw + 10) / 20) * 100), 0, 100);
      const band = score >= 75 ? "High" : score >= 55 ? "Moderate" : "Low";
      return {
        scores: { risk: score, value, feasibility },
        riskBand: band,
        explanation: `Prioritisation score: ${score}/100 (${band}). Value/feasibility weighted higher than risk/dependencies.`,
        assumptions: ["Heuristic ranking only; validate with cost and capacity.", "Use consistent scoring across candidates."],
        nextSteps: [
          "Capture the top 3 dependencies and the earliest decision needed for each.",
          "Define success measures and the first measurable milestone.",
          "Confirm stakeholder appetite for risk and sequencing.",
        ],
        chartData: [
          { name: "Value", value: value * 20 },
          { name: "Feasibility", value: feasibility * 20 },
          { name: "Risk", value: risk * 20 },
          { name: "Dependencies", value: dependencies * 20 },
        ],
      };
    },
    charts: [{ id: "ea-portfolio-bar", type: "bar", title: "Signals", xKey: "name", yKeys: ["value"] }],
    exportProfile: { allowPDF: true, allowDOCX: true, allowXLSX: true, allowJSON: true },
    disclaimer: "Informational only. Not legal advice. Results depend on inputs.",
  },
  {
    slug: "api-versioning-policy-starter",
    title: "API Versioning Policy (Starter)",
    category: "software-api-design",
    description: "Draft a lightweight versioning and deprecation policy with clear consumer expectations.",
    estimatedMinutes: 10,
    fields: [
      { id: "apiName", type: "text", label: "API name", placeholder: "Orders API", required: true },
      { id: "style", type: "select", label: "Versioning style", required: true, options: [
        { label: "URI versioning (/v1)", value: "uri" },
        { label: "Header versioning", value: "header" },
        { label: "No explicit version (compatibility only)", value: "compat" },
      ], defaultValue: "uri" },
      { id: "deprecationWindow", type: "select", label: "Deprecation window", required: true, options: [
        { label: "30 days", value: "30" },
        { label: "90 days", value: "90" },
        { label: "180 days", value: "180" },
      ], defaultValue: "90" },
      { id: "compatTesting", type: "toggle", label: "Contract tests for backwards compatibility", defaultValue: false },
      { id: "consumerComms", type: "slider", label: "Consumer comms maturity (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 3, step: 1 },
    ],
    calcFn: (values) => {
      const comms = clampValue(Number(values.consumerComms) || 1, 1, 5);
      const compat = Boolean(values.compatTesting) ? 1 : 0;
      const windowDays = Number(values.deprecationWindow) || 90;
      const windowScore = windowDays >= 180 ? 5 : windowDays >= 90 ? 4 : windowDays >= 30 ? 3 : 2;
      const score = clampValue(Math.round(((comms + windowScore + (compat ? 2 : 0)) / 12) * 100), 0, 100);
      const band = score >= 75 ? "High" : score >= 55 ? "Moderate" : "Low";
      return {
        scores: { risk: score, comms, window: windowScore },
        riskBand: band,
        explanation: `Versioning readiness: ${score}/100 (${band}). Window ${windowDays}d, comms ${comms}/5, contract tests ${compat ? "on" : "off"}.`,
        assumptions: ["This scores policy clarity, not API design quality.", "Contract tests materially reduce accidental breaking changes."],
        nextSteps: [
          "Publish compatibility rules and breaking-change definition.",
          "Add changelog + consumer notification process.",
          compat ? "Run contract tests in CI for each release." : "Introduce contract tests for critical consumers.",
        ].filter(Boolean) as string[],
        chartData: [
          { name: "Comms", value: comms * 20 },
          { name: "Window", value: windowScore * 20 },
          { name: "Contract tests", value: compat ? 100 : 0 },
        ],
      };
    },
    charts: [{ id: "api-versioning-bar", type: "bar", title: "Signals", xKey: "name", yKeys: ["value"] }],
    exportProfile: { allowPDF: true, allowDOCX: true, allowXLSX: true, allowJSON: true },
    disclaimer: "Informational only. Not legal advice. Results depend on inputs.",
  },
  {
    slug: "integration-pattern-selector",
    title: "Integration Pattern Selector (Starter)",
    category: "software-api-design",
    description: "Choose an integration style (sync, async, batch) based on reliability, latency, and coupling.",
    estimatedMinutes: 9,
    fields: [
      { id: "useCase", type: "text", label: "Use case", placeholder: "Order created → notify warehouse", required: true },
      { id: "latency", type: "select", label: "Latency need", required: true, options: [
        { label: "Real-time", value: "realtime" },
        { label: "Seconds to minutes", value: "near" },
        { label: "Hours", value: "batch" },
      ], defaultValue: "near" },
      { id: "reliability", type: "slider", label: "Reliability requirement (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 4, step: 1 },
      { id: "coupling", type: "slider", label: "Coupling tolerance (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 3, step: 1 },
      { id: "idempotency", type: "toggle", label: "Idempotency supported", defaultValue: true },
    ],
    calcFn: (values) => {
      const rel = clampValue(Number(values.reliability) || 1, 1, 5);
      const coupling = clampValue(Number(values.coupling) || 1, 1, 5);
      const latency = values.latency || "near";
      const idem = Boolean(values.idempotency);
      const pattern =
        latency === "realtime" && coupling >= 4 ? "Synchronous API (with retries + timeouts)" :
        rel >= 4 && coupling <= 3 ? "Async events/queue (at-least-once + idempotency)" :
        latency === "batch" ? "Batch export/import (scheduled + reconciled)" :
        "API + async fallback (outbox pattern)";
      const score = clampValue(Math.round(((rel + coupling + (idem ? 1 : 0)) / 11) * 100), 0, 100);
      const band = score >= 75 ? "High" : score >= 55 ? "Moderate" : "Low";
      return {
        scores: { risk: score, reliability: rel, coupling },
        riskBand: band,
        explanation: `Suggested pattern: ${pattern}. Confidence score ${score}/100 (${band}).`,
        assumptions: ["Pattern choice depends on operational maturity.", "Idempotency is critical for reliable async delivery."],
        nextSteps: [
          "Define failure modes and retries/timeouts.",
          "Document contracts (schema/versioning) and ownership.",
          idem ? "Add idempotency keys/deduplication where needed." : "Introduce idempotency/deduplication for safe retries.",
        ].filter(Boolean) as string[],
        chartData: [
          { name: "Reliability", value: rel * 20 },
          { name: "Coupling tolerance", value: coupling * 20 },
          { name: "Idempotency", value: idem ? 100 : 0 },
        ],
      };
    },
    charts: [{ id: "integration-bar", type: "bar", title: "Signals", xKey: "name", yKeys: ["value"] }],
    exportProfile: { allowPDF: true, allowDOCX: true, allowXLSX: true, allowJSON: true },
    disclaimer: "Informational only. Not legal advice. Results depend on inputs.",
  },
  {
    slug: "soc2-evidence-pack-starter",
    title: "SOC 2 Evidence Pack Starter (Starter)",
    category: "regulatory-compliance",
    description: "Create an evidence checklist for access, change management, and monitoring controls.",
    estimatedMinutes: 12,
    fields: [
      { id: "system", type: "text", label: "System / scope", placeholder: "Production platform", required: true },
      { id: "controlArea", type: "select", label: "Control focus", required: true, options: [
        { label: "Logical access", value: "access" },
        { label: "Change management", value: "change" },
        { label: "Monitoring and response", value: "monitoring" },
      ], defaultValue: "access" },
      { id: "automation", type: "slider", label: "Automation level (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 3, step: 1 },
      { id: "retention", type: "select", label: "Evidence retention", required: true, options: [
        { label: "30 days", value: "30" },
        { label: "90 days", value: "90" },
        { label: "180 days", value: "180" },
      ], defaultValue: "90" },
      { id: "owner", type: "text", label: "Control owner", placeholder: "Security / Platform", required: true },
    ],
    calcFn: (values) => {
      const automation = clampValue(Number(values.automation) || 1, 1, 5);
      const retention = Number(values.retention) || 90;
      const retentionScore = retention >= 180 ? 5 : retention >= 90 ? 4 : 3;
      const score = clampValue(Math.round(((automation + retentionScore) / 10) * 100), 0, 100);
      const band = score >= 75 ? "High" : score >= 55 ? "Moderate" : "Low";
      const focus = values.controlArea || "access";
      const checklist =
        focus === "access"
          ? ["IdP policy export (MFA, admin access)", "Quarterly access review records", "Joiner/mover/leaver tickets", "Privileged access logs"]
          : focus === "change"
          ? ["PR approvals + CI logs", "Deployment records", "Rollback/runbook evidence", "Change calendar (if used)"]
          : ["Alert definitions", "Incident tickets + timelines", "On-call runbooks", "Post-incident actions"];
      return {
        scores: { risk: score, automation, retention: retentionScore },
        riskBand: band,
        explanation: `Evidence readiness: ${score}/100 (${band}). Focus: ${focus}.`,
        assumptions: ["This helps organise evidence; it is not an audit opinion.", "Evidence should be reproducible and time-bounded."],
        nextSteps: [
          `Create a folder/index for: ${checklist.slice(0, 2).join(", ")}.`,
          `Add remaining items: ${checklist.slice(2).join(", ")}.`,
          "Define a monthly check to ensure evidence is still being produced.",
        ],
        chartData: [
          { name: "Automation", value: automation * 20 },
          { name: "Retention", value: retentionScore * 20 },
        ],
      };
    },
    charts: [{ id: "soc2-bar", type: "bar", title: "Signals", xKey: "name", yKeys: ["value"] }],
    exportProfile: { allowPDF: true, allowDOCX: true, allowXLSX: true, allowJSON: true },
    disclaimer: "Informational only. Not legal advice. Results depend on inputs.",
  },
  {
    slug: "gdpr-dpia-screening",
    title: "DPIA Screening (Starter)",
    category: "regulatory-compliance",
    description: "A quick screening to decide whether a DPIA is likely required and what to document.",
    estimatedMinutes: 10,
    fields: [
      { id: "processing", type: "text", label: "Processing activity", placeholder: "Customer analytics", required: true },
      { id: "specialCategory", type: "toggle", label: "Special category data involved", defaultValue: false },
      { id: "scale", type: "slider", label: "Scale (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 3, step: 1 },
      { id: "automated", type: "toggle", label: "Automated decision-making", defaultValue: false },
      { id: "thirdParties", type: "toggle", label: "Third parties / cross-border transfers", defaultValue: false },
    ],
    calcFn: (values) => {
      const scale = clampValue(Number(values.scale) || 1, 1, 5);
      const special = Boolean(values.specialCategory);
      const automated = Boolean(values.automated);
      const third = Boolean(values.thirdParties);
      const score = clampValue(scale * 15 + (special ? 25 : 0) + (automated ? 20 : 0) + (third ? 15 : 0), 0, 100);
      const band = score >= 70 ? "High" : score >= 40 ? "Moderate" : "Low";
      const likely = score >= 70 || (special && scale >= 3) || automated;
      return {
        scores: { risk: score, scale },
        riskBand: band,
        explanation: `DPIA screening score ${score}/100 (${band}). ${likely ? "A DPIA is likely appropriate." : "A DPIA may not be required; document rationale."}`,
        assumptions: ["This is a screening aid; consult your DPO/legal where required.", "Jurisdiction and regulator guidance may vary."],
        nextSteps: likely
          ? ["Document purpose, lawful basis, and data minimisation.", "Assess risks to individuals and mitigations.", "Record approvals and review cadence."]
          : ["Record purpose and lawful basis.", "Capture key mitigations (security, retention).", "Revisit if scope expands."],
        chartData: [
          { name: "Scale", value: scale * 20 },
          { name: "Special category", value: special ? 100 : 0 },
          { name: "Automated decision", value: automated ? 100 : 0 },
          { name: "Third parties", value: third ? 100 : 0 },
        ],
      };
    },
    charts: [{ id: "dpia-bar", type: "bar", title: "Signals", xKey: "name", yKeys: ["value"] }],
    exportProfile: { allowPDF: true, allowDOCX: true, allowXLSX: true, allowJSON: true },
    disclaimer: "Informational only. Not legal advice. Results depend on inputs.",
  },
  {
    slug: "slo-error-budget-planner",
    title: "SLO & Error Budget Planner (Starter)",
    category: "engineering-systems-design",
    description: "Turn an availability target into an error budget and response policy.",
    estimatedMinutes: 10,
    fields: [
      { id: "service", type: "text", label: "Service", placeholder: "Checkout API", required: true },
      { id: "availability", type: "select", label: "Availability target", required: true, options: [
        { label: "99.0%", value: "99.0" },
        { label: "99.5%", value: "99.5" },
        { label: "99.9%", value: "99.9" },
        { label: "99.95%", value: "99.95" },
      ], defaultValue: "99.9" },
      { id: "windowDays", type: "select", label: "SLO window", required: true, options: [
        { label: "7 days", value: "7" },
        { label: "28 days", value: "28" },
        { label: "90 days", value: "90" },
      ], defaultValue: "28" },
      { id: "oncall", type: "toggle", label: "On-call coverage exists", defaultValue: true },
    ],
    calcFn: (values) => {
      const target = Number(values.availability) || 99.9;
      const windowDays = Number(values.windowDays) || 28;
      const minutes = windowDays * 24 * 60;
      const errorBudgetMinutes = Math.round(minutes * (1 - target / 100));
      const score = clampValue(Math.round((target / 100) * 100), 0, 100);
      const band = target >= 99.9 ? "Moderate" : "Low";
      const oncall = Boolean(values.oncall);
      return {
        scores: { risk: score },
        riskBand: band,
        explanation: `Error budget ≈ ${errorBudgetMinutes} minutes over ${windowDays} days for target ${target}%.`,
        assumptions: ["Availability is measured against a clearly defined indicator (SLI).", "Error budget burn should guide release pacing."],
        nextSteps: [
          "Define SLI: what constitutes success for a request or job.",
          "Choose burn alerts (fast and slow) and an escalation policy.",
          oncall ? "Run a game day to validate response." : "Establish on-call ownership before committing to tight targets.",
        ].filter(Boolean) as string[],
        chartData: [
          { name: "Target (%)", value: target },
          { name: "Budget (mins)", value: Math.min(100, Math.round((errorBudgetMinutes / minutes) * 100)) },
        ],
        meaning: "Connects reliability targets to operational decisions.",
        whyItMatters: "Teams ship safer when error budget burn informs change pace.",
        whenItBreaks: "If the SLI is unclear or measurement is inconsistent.",
      };
    },
    charts: [{ id: "slo-bar", type: "bar", title: "Signals", xKey: "name", yKeys: ["value"] }],
    exportProfile: { allowPDF: true, allowDOCX: true, allowXLSX: true, allowJSON: true },
    disclaimer: "Informational only. Not legal advice. Results depend on inputs.",
  },
  {
    slug: "incident-severity-classifier",
    title: "Incident Severity Classifier (Starter)",
    category: "engineering-systems-design",
    description: "Classify severity based on user impact, duration, and data exposure indicators.",
    estimatedMinutes: 8,
    fields: [
      { id: "impactPct", type: "slider", label: "Users impacted (%)", required: true, validation: { min: 0, max: 100 }, defaultValue: 10, step: 5 },
      { id: "duration", type: "select", label: "Duration", required: true, options: [
        { label: "Under 15 minutes", value: "short" },
        { label: "15–60 minutes", value: "medium" },
        { label: "1–4 hours", value: "long" },
        { label: "Over 4 hours", value: "critical" },
      ], defaultValue: "medium" },
      { id: "dataRisk", type: "toggle", label: "Possible sensitive data exposure", defaultValue: false },
      { id: "workaround", type: "toggle", label: "Workaround available", defaultValue: false },
    ],
    calcFn: (values) => {
      const impactPct = clampValue(Number(values.impactPct) || 0, 0, 100);
      const duration = values.duration || "medium";
      const dataRisk = Boolean(values.dataRisk);
      const workaround = Boolean(values.workaround);
      const durationScore = duration === "critical" ? 40 : duration === "long" ? 25 : duration === "medium" ? 15 : 8;
      const impactScore = impactPct >= 50 ? 40 : impactPct >= 20 ? 25 : impactPct >= 5 ? 15 : 8;
      const score = clampValue(durationScore + impactScore + (dataRisk ? 25 : 0) - (workaround ? 10 : 0), 0, 100);
      const severity = score >= 80 ? "SEV-1" : score >= 55 ? "SEV-2" : score >= 30 ? "SEV-3" : "SEV-4";
      const band = score >= 80 ? "Critical" : score >= 55 ? "High" : score >= 30 ? "Moderate" : "Low";
      return {
        scores: { risk: score },
        riskBand: band,
        explanation: `Suggested severity: ${severity} (${band}). Score ${score}/100 based on impact and duration${dataRisk ? ", with data risk" : ""}.`,
        assumptions: ["Use your org’s definitions if they exist.", "Severity should be adjusted with context (regulatory, customer type)."],
        nextSteps: [
          severity === "SEV-1" ? "Start incident command, customer comms, and executive updates." : "Assign incident lead and run the checklist.",
          dataRisk ? "Engage security/privacy and preserve evidence." : "Confirm no data exposure and document checks.",
          "Capture timeline and follow-up actions for learning.",
        ],
        chartData: [
          { name: "Impact", value: impactScore },
          { name: "Duration", value: durationScore },
          { name: "Data risk", value: dataRisk ? 25 : 0 },
          { name: "Workaround", value: workaround ? -10 : 0 },
        ],
      };
    },
    charts: [{ id: "sev-bar", type: "bar", title: "Components", xKey: "name", yKeys: ["value"] }],
    exportProfile: { allowPDF: true, allowDOCX: true, allowXLSX: true, allowJSON: true },
    disclaimer: "Informational only. Not legal advice. Results depend on inputs.",
  },
  {
    slug: "operating-model-raci-builder",
    title: "Operating Model RACI Builder (Starter)",
    category: "strategy-operating-models",
    description: "Create a simple RACI for a capability or process and expose ownership gaps.",
    estimatedMinutes: 10,
    fields: [
      { id: "capability", type: "text", label: "Capability / process", placeholder: "Change management", required: true },
      { id: "rolesCount", type: "slider", label: "Number of roles involved (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 3, step: 1 },
      { id: "clarity", type: "slider", label: "Role clarity (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 3, step: 1 },
      { id: "decisionRights", type: "slider", label: "Decision rights clarity (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 3, step: 1 },
      { id: "singleOwner", type: "toggle", label: "Single accountable owner exists", defaultValue: false },
    ],
    calcFn: (values) => {
      const roles = clampValue(Number(values.rolesCount) || 1, 1, 5);
      const clarity = clampValue(Number(values.clarity) || 1, 1, 5);
      const rights = clampValue(Number(values.decisionRights) || 1, 1, 5);
      const owner = Boolean(values.singleOwner);
      const score = clampValue(Math.round(((clarity + rights + (owner ? 2 : 0)) / 12) * 100) - (roles >= 5 ? 8 : 0), 0, 100);
      const band = score >= 75 ? "High" : score >= 55 ? "Moderate" : "Low";
      return {
        scores: { risk: score, clarity, rights },
        riskBand: band,
        explanation: `Operating model clarity: ${score}/100 (${band}). Roles ${roles}/5; single owner ${owner ? "yes" : "no"}.`,
        assumptions: ["RACI works best when kept small and reviewed periodically.", "Accountability should be singular for core outcomes."],
        nextSteps: [
          owner ? "Publish the accountable owner and escalation route." : "Assign a single accountable owner for the outcome.",
          "Define decision boundaries (what can be decided within the team vs escalated).",
          "Run a 30-minute review with the people named in the RACI.",
        ],
        chartData: [
          { name: "Clarity", value: clarity * 20 },
          { name: "Decision rights", value: rights * 20 },
          { name: "Single owner", value: owner ? 100 : 0 },
        ],
      };
    },
    charts: [{ id: "raci-bar", type: "bar", title: "Signals", xKey: "name", yKeys: ["value"] }],
    exportProfile: { allowPDF: true, allowDOCX: true, allowXLSX: true, allowJSON: true },
    disclaimer: "Informational only. Not legal advice. Results depend on inputs.",
  },
  {
    slug: "north-star-metric-definition",
    title: "North Star Metric Definition (Starter)",
    category: "strategy-operating-models",
    description: "Define a north star metric with guardrails and anti-gaming checks.",
    estimatedMinutes: 10,
    fields: [
      { id: "product", type: "text", label: "Product / service", placeholder: "Learning platform", required: true },
      { id: "metric", type: "text", label: "Candidate north star metric", placeholder: "Weekly active learners completing a lab", required: true },
      { id: "decisionUse", type: "slider", label: "Decision usefulness (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 4, step: 1 },
      { id: "measurability", type: "slider", label: "Measurability (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 3, step: 1 },
      { id: "gameable", type: "slider", label: "Gaming risk (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 3, step: 1 },
    ],
    calcFn: (values) => {
      const decision = clampValue(Number(values.decisionUse) || 1, 1, 5);
      const measurable = clampValue(Number(values.measurability) || 1, 1, 5);
      const gameable = clampValue(Number(values.gameable) || 1, 1, 5);
      const score = clampValue(Math.round(((decision + measurable) / 10) * 100 - (gameable - 1) * 10), 0, 100);
      const band = score >= 75 ? "High" : score >= 55 ? "Moderate" : "Low";
      return {
        scores: { risk: score, decision, measurable },
        riskBand: band,
        explanation: `North star quality: ${score}/100 (${band}). Higher gaming risk reduces the score.`,
        assumptions: ["A north star metric should map to user value and business value.", "Guardrails reduce perverse incentives."],
        nextSteps: [
          "Define 2–3 guardrail metrics (quality, reliability, cost).",
          "Document exclusions (internal users, bots, test traffic).",
          "Create an anti-gaming check (e.g. completion quality threshold).",
        ],
        chartData: [
          { name: "Decision usefulness", value: decision * 20 },
          { name: "Measurability", value: measurable * 20 },
          { name: "Gaming risk", value: gameable * 20 },
        ],
      };
    },
    charts: [{ id: "northstar-bar", type: "bar", title: "Signals", xKey: "name", yKeys: ["value"] }],
    exportProfile: { allowPDF: true, allowDOCX: true, allowXLSX: true, allowJSON: true },
    disclaimer: "Informational only. Not legal advice. Results depend on inputs.",
  },
  {
    slug: "experiment-hypothesis-checker",
    title: "Experiment Hypothesis Checker (Starter)",
    category: "analytics-decision-making",
    description: "Stress-test a hypothesis for clarity, measurability, and decision impact.",
    estimatedMinutes: 8,
    fields: [
      { id: "hypothesis", type: "textarea", label: "Hypothesis", placeholder: "If we reduce checkout steps, conversion will increase", required: true },
      { id: "metricDefined", type: "toggle", label: "Primary metric defined", defaultValue: true },
      { id: "baselineKnown", type: "toggle", label: "Baseline known", defaultValue: false },
      { id: "sample", type: "select", label: "Expected sample size", required: true, options: [
        { label: "Small", value: "small" },
        { label: "Medium", value: "medium" },
        { label: "Large", value: "large" },
      ], defaultValue: "medium" },
      { id: "decisionImpact", type: "slider", label: "Decision impact (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 4, step: 1 },
    ],
    calcFn: (values) => {
      const impact = clampValue(Number(values.decisionImpact) || 1, 1, 5);
      const metric = Boolean(values.metricDefined);
      const baseline = Boolean(values.baselineKnown);
      const sample = values.sample || "medium";
      const sampleScore = sample === "large" ? 5 : sample === "medium" ? 4 : 3;
      const score = clampValue(Math.round(((impact + sampleScore + (metric ? 2 : 0) + (baseline ? 1 : 0)) / 13) * 100), 0, 100);
      const band = score >= 75 ? "High" : score >= 55 ? "Moderate" : "Low";
      return {
        scores: { risk: score, impact, sample: sampleScore },
        riskBand: band,
        explanation: `Hypothesis readiness: ${score}/100 (${band}).`,
        assumptions: ["This does not compute power; it checks readiness signals.", "Baseline and metric definition reduce wasted experiments."],
        nextSteps: [
          metric ? "Write the metric definition (window, exclusions)." : "Define a single primary metric and how it is calculated.",
          baseline ? "Set a minimum detectable effect and decision rule." : "Capture baseline and define a minimum detectable effect.",
          "Add guardrails (e.g. error rate, latency) and stopping rules.",
        ],
        chartData: [
          { name: "Decision impact", value: impact * 20 },
          { name: "Sample signal", value: sampleScore * 20 },
          { name: "Metric defined", value: metric ? 100 : 0 },
          { name: "Baseline known", value: baseline ? 100 : 0 },
        ],
      };
    },
    charts: [{ id: "experiment-bar", type: "bar", title: "Signals", xKey: "name", yKeys: ["value"] }],
    exportProfile: { allowPDF: true, allowDOCX: true, allowXLSX: true, allowJSON: true },
    disclaimer: "Informational only. Not legal advice. Results depend on inputs.",
  },
  {
    slug: "metric-guardrail-builder",
    title: "Metric Guardrail Builder (Starter)",
    category: "analytics-decision-making",
    description: "Define guardrails and anti-gaming checks for a KPI or north star metric.",
    estimatedMinutes: 9,
    fields: [
      { id: "metricName", type: "text", label: "Primary metric", placeholder: "Activation rate (7d)", required: true },
      { id: "guardrailsCount", type: "slider", label: "Number of guardrails (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 3, step: 1 },
      { id: "qualitySignal", type: "toggle", label: "Quality signal included", defaultValue: true },
      { id: "costSignal", type: "toggle", label: "Cost signal included", defaultValue: false },
      { id: "latencySignal", type: "toggle", label: "Reliability/latency signal included", defaultValue: true },
    ],
    calcFn: (values) => {
      const count = clampValue(Number(values.guardrailsCount) || 1, 1, 5);
      const q = Boolean(values.qualitySignal);
      const c = Boolean(values.costSignal);
      const l = Boolean(values.latencySignal);
      const coverage = (q ? 1 : 0) + (c ? 1 : 0) + (l ? 1 : 0);
      const score = clampValue(Math.round(((count + coverage * 2) / 11) * 100), 0, 100);
      const band = score >= 75 ? "High" : score >= 55 ? "Moderate" : "Low";
      return {
        scores: { risk: score },
        riskBand: band,
        explanation: `Guardrail strength: ${score}/100 (${band}). Coverage signals: ${coverage}/3.`,
        assumptions: ["Guardrails should be monitored with the primary metric.", "Anti-gaming checks should be reviewed after changes."],
        nextSteps: [
          "Write definitions for each guardrail (calculation + threshold).",
          "Add an anti-gaming check (e.g. minimum quality threshold).",
          "Document ownership and escalation route when guardrails breach.",
        ],
        chartData: [
          { name: "Guardrails count", value: count * 20 },
          { name: "Quality", value: q ? 100 : 0 },
          { name: "Cost", value: c ? 100 : 0 },
          { name: "Reliability", value: l ? 100 : 0 },
        ],
      };
    },
    charts: [{ id: "guardrail-bar", type: "bar", title: "Signals", xKey: "name", yKeys: ["value"] }],
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
  {
    slug: "ea-capability-map-scope",
    title: "Capability Map Scoping (Starter)",
    category: "digital-enterprise-architecture",
    description: "Quickly scope a capability map slice and identify the first 3 capabilities to detail.",
    estimatedMinutes: 9,
    fields: [
      { id: "domain", type: "text", label: "Business domain", placeholder: "Customer onboarding", required: true },
      {
        id: "horizon",
        type: "select",
        label: "Planning horizon",
        required: true,
        options: [
          { label: "0–3 months", value: "0-3" },
          { label: "3–12 months", value: "3-12" },
          { label: "12–24 months", value: "12-24" },
        ],
        defaultValue: "3-12",
      },
      { id: "complexity", type: "slider", label: "Complexity (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 3, step: 1 },
      { id: "risk", type: "slider", label: "Delivery risk (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 3, step: 1 },
      { id: "value", type: "slider", label: "Business value (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 4, step: 1 },
    ],
    calcFn: (values) => {
      const complexity = clampValue(Number(values.complexity) || 1, 1, 5);
      const risk = clampValue(Number(values.risk) || 1, 1, 5);
      const value = clampValue(Number(values.value) || 1, 1, 5);
      const score = clampValue(Math.round(((value * 2 - complexity - risk + 10) / 20) * 100), 0, 100);
      const band = score >= 75 ? "High" : score >= 55 ? "Moderate" : "Low";
      return {
        scores: { risk: score, complexity, value },
        riskBand: band,
        explanation: `Starter prioritisation score: ${score}/100 (${band}). Value is weighted higher than complexity and risk.`,
        assumptions: ["This is a lightweight heuristic, not a portfolio model.", "Use consistent scoring across candidates for comparability."],
        nextSteps: [
          "List 8–12 capabilities in scope for this domain.",
          "Pick the top 3 by score to detail (owner, measures, dependencies).",
          "Validate scope with stakeholders and adjust for constraints.",
        ],
        chartData: [
          { name: "Value", value: value * 20 },
          { name: "Complexity", value: complexity * 20 },
          { name: "Risk", value: risk * 20 },
        ],
        meaning: "Helps decide which capability slice to detail first.",
        whyItMatters: "Early focus prevents capability maps from becoming unmaintained diagrams.",
        whenItBreaks: "If scoring is inconsistent or political rather than evidence-led.",
      };
    },
    charts: [{ id: "ea-scope-radar", type: "radar", title: "Signal profile", series: [{ key: "value", label: "Score" }] }],
    exportProfile: { allowPDF: true, allowDOCX: true, allowXLSX: true, allowJSON: true },
    disclaimer: "Informational only. Not legal advice. Results depend on inputs.",
  },
  {
    slug: "api-contract-quality-check",
    title: "API Contract Quality Check (Starter)",
    category: "software-api-design",
    description: "A quick checklist score for API contract clarity, stability, and consumer ergonomics.",
    estimatedMinutes: 8,
    fields: [
      { id: "apiName", type: "text", label: "API name", placeholder: "Payments API", required: true },
      { id: "versioning", type: "slider", label: "Versioning clarity (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 3, step: 1 },
      { id: "errors", type: "slider", label: "Error model quality (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 3, step: 1 },
      { id: "docs", type: "slider", label: "Docs completeness (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 3, step: 1 },
      { id: "idempotency", type: "toggle", label: "Idempotency supported for write operations", defaultValue: false },
    ],
    calcFn: (values) => {
      const versioning = clampValue(Number(values.versioning) || 1, 1, 5);
      const errors = clampValue(Number(values.errors) || 1, 1, 5);
      const docs = clampValue(Number(values.docs) || 1, 1, 5);
      const idem = Boolean(values.idempotency) ? 1 : 0;
      const score = clampValue(Math.round(((versioning + errors + docs + (idem ? 1 : 0)) / 16) * 100), 0, 100);
      const band = score >= 75 ? "High" : score >= 55 ? "Moderate" : "Low";
      const nextSteps = [
        versioning < 4 ? "Document compatibility policy and deprecation windows." : null,
        errors < 4 ? "Standardise error shapes, codes, and retry guidance." : null,
        docs < 4 ? "Add end-to-end examples (happy path + failures)." : null,
        !idem ? "Add idempotency keys to write endpoints where possible." : null,
      ].filter(Boolean) as string[];
      return {
        scores: { risk: score, versioning, docs },
        riskBand: band,
        explanation: `Contract quality score: ${score}/100 (${band}).`,
        assumptions: ["Scoring is subjective; calibrate with a small rubric.", "This is a starter view; run real consumer tests."],
        nextSteps: nextSteps.length ? nextSteps : ["Maintain contract tests and publish a consumer-facing changelog."],
        chartData: [
          { name: "Versioning", value: versioning * 20 },
          { name: "Errors", value: errors * 20 },
          { name: "Docs", value: docs * 20 },
          { name: "Idempotency", value: idem ? 100 : 0 },
        ],
        meaning: "Highlights contract areas that usually cause integration friction.",
        whyItMatters: "Better contracts reduce breakages and support load.",
        whenItBreaks: "If the API is still evolving rapidly without governance.",
      };
    },
    charts: [{ id: "api-quality-bar", type: "bar", title: "Component scores", xKey: "name", yKeys: ["value"] }],
    exportProfile: { allowPDF: true, allowDOCX: true, allowXLSX: true, allowJSON: true },
    disclaimer: "Informational only. Not legal advice. Results depend on inputs.",
  },
  {
    slug: "control-evidence-pack-starter",
    title: "Control Evidence Pack (Starter)",
    category: "regulatory-compliance",
    description: "Prioritise which controls to evidence first and outline what ‘good evidence’ looks like.",
    estimatedMinutes: 10,
    fields: [
      { id: "framework", type: "select", label: "Framework", required: true, options: [{ label: "ISO 27001", value: "iso27001" }, { label: "SOC 2", value: "soc2" }, { label: "NIS2", value: "nis2" }], defaultValue: "soc2" },
      { id: "auditWindow", type: "slider", label: "Audit window urgency (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 3, step: 1 },
      { id: "controlMaturity", type: "slider", label: "Control maturity (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 2, step: 1 },
      { id: "evidenceAutomation", type: "slider", label: "Evidence automation (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 2, step: 1 },
    ],
    calcFn: (values) => {
      const urgency = clampValue(Number(values.auditWindow) || 1, 1, 5);
      const maturity = clampValue(Number(values.controlMaturity) || 1, 1, 5);
      const automation = clampValue(Number(values.evidenceAutomation) || 1, 1, 5);
      const score = clampValue(Math.round(((urgency * 2 + (6 - maturity) + (6 - automation)) / 18) * 100), 0, 100);
      const band = score >= 75 ? "High" : score >= 55 ? "Moderate" : "Low";
      return {
        scores: { risk: score, urgency, maturity },
        riskBand: band,
        explanation: `Evidence priority score: ${score}/100 (${band}). Higher means start evidence work sooner.`,
        assumptions: ["This prioritises evidence readiness, not control effectiveness.", "Map to your actual control set and scoping."],
        nextSteps: [
          "Write a 1-page control narrative (what, who, when, tools).",
          "List 3 evidence artefacts per control (policy, logs, screenshots, tickets).",
          "Automate recurring evidence capture where possible.",
        ],
        chartData: [
          { name: "Urgency", value: urgency * 20 },
          { name: "Maturity gap", value: (6 - maturity) * 20 },
          { name: "Automation gap", value: (6 - automation) * 20 },
        ],
        meaning: "Helps decide where to start evidence collection for audit readiness.",
        whyItMatters: "Evidence work often blocks audits even when controls exist.",
        whenItBreaks: "If audit scope is unclear or ownership is missing.",
      };
    },
    charts: [{ id: "evidence-pack-radar", type: "radar", title: "Readiness signals", series: [{ key: "value", label: "Score" }] }],
    exportProfile: { allowPDF: true, allowDOCX: true, allowXLSX: true, allowJSON: true },
    disclaimer: "Informational only. Not legal advice. Results depend on inputs.",
  },
  {
    slug: "slo-budget-starter",
    title: "SLO + Error Budget Starter",
    category: "engineering-systems-design",
    description: "Set a starter SLO and estimate an error budget to align engineering and product expectations.",
    estimatedMinutes: 7,
    fields: [
      { id: "service", type: "text", label: "Service name", placeholder: "Checkout", required: true },
      { id: "availabilityTarget", type: "slider", label: "Availability target (%)", required: true, validation: { min: 95, max: 99.99 }, defaultValue: 99.5, step: 0.05 },
      { id: "windowDays", type: "select", label: "Measurement window", required: true, options: [{ label: "7 days", value: "7" }, { label: "28 days", value: "28" }, { label: "90 days", value: "90" }], defaultValue: "28" },
      { id: "userImpact", type: "slider", label: "User impact if down (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 4, step: 1 },
    ],
    calcFn: (values) => {
      const target = clampValue(Number(values.availabilityTarget) || 99, 95, 99.99);
      const days = clampValue(Number(values.windowDays) || 28, 1, 365);
      const minutes = days * 24 * 60;
      const errorBudgetMinutes = Math.max(0, Math.round(minutes * (1 - target / 100)));
      const impact = clampValue(Number(values.userImpact) || 1, 1, 5);
      const score = clampValue(Math.round(((impact + (100 - target)) / 10) * 100), 0, 100);
      const band = score >= 75 ? "High" : score >= 55 ? "Moderate" : "Low";
      return {
        scores: { risk: score, impact, target },
        riskBand: band,
        explanation: `Error budget is ~${errorBudgetMinutes} minutes over ${days} days for a ${target}% target.`,
        assumptions: ["This assumes a simple uptime SLI; tailor to real user journeys.", "Budgets should be reviewed after observing real performance."],
        nextSteps: [
          "Define the SLI precisely (what counts as ‘good’ and ‘bad’).",
          "Add alerts on burn rate, not just availability.",
          "Agree escalation + release gates when budget is burned.",
        ],
        chartData: [
          { name: "Target (%)", value: target },
          { name: "Budget (mins)", value: errorBudgetMinutes },
        ],
        meaning: "Makes reliability targets tangible in time you can spend on incidents.",
        whyItMatters: "Aligns product tradeoffs with engineering operational reality.",
        whenItBreaks: "If SLIs are misdefined or traffic patterns vary dramatically.",
      };
    },
    charts: [{ id: "slo-budget-bar", type: "bar", title: "Budget summary", xKey: "name", yKeys: ["value"] }],
    exportProfile: { allowPDF: true, allowDOCX: true, allowXLSX: true, allowJSON: true },
    disclaimer: "Informational only. Not legal advice. Results depend on inputs.",
  },
  {
    slug: "operating-model-decisions-starter",
    title: "Operating Model Decisions (Starter)",
    category: "strategy-operating-models",
    description: "Identify the top decision areas and clarify who decides, who inputs, and who executes.",
    estimatedMinutes: 9,
    fields: [
      { id: "orgUnit", type: "text", label: "Org unit / team", placeholder: "Platform engineering", required: true },
      { id: "decisionClarity", type: "slider", label: "Decision clarity today (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 2, step: 1 },
      { id: "handoffs", type: "slider", label: "Handoffs / dependencies (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 3, step: 1 },
      { id: "conflictRate", type: "slider", label: "Decision conflict rate (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 3, step: 1 },
    ],
    calcFn: (values) => {
      const clarity = clampValue(Number(values.decisionClarity) || 1, 1, 5);
      const handoffs = clampValue(Number(values.handoffs) || 1, 1, 5);
      const conflict = clampValue(Number(values.conflictRate) || 1, 1, 5);
      const score = clampValue(Math.round((((6 - clarity) * 2 + handoffs + conflict) / 16) * 100), 0, 100);
      const band = score >= 75 ? "High" : score >= 55 ? "Moderate" : "Low";
      return {
        scores: { risk: score, clarity, handoffs },
        riskBand: band,
        explanation: `Operating model friction score: ${score}/100 (${band}). Lower clarity usually drives higher friction.`,
        assumptions: ["This is directional; confirm with stakeholder interviews.", "Use the same definitions for scoring across teams."],
        nextSteps: [
          "List 5 recurring decisions (e.g., prioritisation, standards, incident response).",
          "Assign a single accountable owner per decision area.",
          "Publish a lightweight decision record template and cadence.",
        ],
        chartData: [
          { name: "Clarity gap", value: (6 - clarity) * 20 },
          { name: "Handoffs", value: handoffs * 20 },
          { name: "Conflict", value: conflict * 20 },
        ],
        meaning: "Highlights where decision ownership and process needs tightening.",
        whyItMatters: "Faster decisions reduce delays and improve accountability.",
        whenItBreaks: "If the real problem is capacity or incentives, not process.",
      };
    },
    charts: [{ id: "opmodel-radar", type: "radar", title: "Friction signals", series: [{ key: "value", label: "Score" }] }],
    exportProfile: { allowPDF: true, allowDOCX: true, allowXLSX: true, allowJSON: true },
    disclaimer: "Informational only. Not legal advice. Results depend on inputs.",
  },
  {
    slug: "decision-register-quality-starter",
    title: "Decision Register Quality (Starter)",
    category: "analytics-decision-making",
    description: "Score how well a decision is documented (context, options, metrics, follow-up) to improve learning loops.",
    estimatedMinutes: 6,
    fields: [
      { id: "decisionTitle", type: "text", label: "Decision title", placeholder: "Adopt event-driven ingestion", required: true },
      { id: "context", type: "slider", label: "Context clarity (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 3, step: 1 },
      { id: "options", type: "slider", label: "Options considered (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 2, step: 1 },
      { id: "metrics", type: "slider", label: "Success metrics defined (1-5)", required: true, validation: { min: 1, max: 5 }, defaultValue: 2, step: 1 },
      { id: "review", type: "toggle", label: "Review date set", defaultValue: false },
    ],
    calcFn: (values) => {
      const context = clampValue(Number(values.context) || 1, 1, 5);
      const options = clampValue(Number(values.options) || 1, 1, 5);
      const metrics = clampValue(Number(values.metrics) || 1, 1, 5);
      const review = Boolean(values.review) ? 1 : 0;
      const score = clampValue(Math.round(((context + options + metrics + (review ? 1 : 0)) / 16) * 100), 0, 100);
      const band = score >= 75 ? "High" : score >= 55 ? "Moderate" : "Low";
      const nextSteps = [
        options < 3 ? "Write 2 alternative options and why they were rejected." : null,
        metrics < 3 ? "Define 1–3 measurable success indicators and a baseline." : null,
        !review ? "Set a review date to check outcomes and capture learning." : null,
      ].filter(Boolean) as string[];
      return {
        scores: { risk: score, context, metrics },
        riskBand: band,
        explanation: `Decision record quality: ${score}/100 (${band}).`,
        assumptions: ["This scores documentation quality, not decision correctness.", "Keep records short and focused."],
        nextSteps: nextSteps.length ? nextSteps : ["Share the decision record with stakeholders and store it where it will be found later."],
        chartData: [
          { name: "Context", value: context * 20 },
          { name: "Options", value: options * 20 },
          { name: "Metrics", value: metrics * 20 },
          { name: "Review", value: review ? 100 : 0 },
        ],
        meaning: "Improves traceability and learning from decisions over time.",
        whyItMatters: "Teams avoid repeating mistakes when decisions are reviewable.",
        whenItBreaks: "If records are never revisited or ownership is unclear.",
      };
    },
    charts: [{ id: "decision-quality-bar", type: "bar", title: "Component scores", xKey: "name", yKeys: ["value"] }],
    exportProfile: { allowPDF: true, allowDOCX: true, allowXLSX: true, allowJSON: true },
    disclaimer: "Informational only. Not legal advice. Results depend on inputs.",
  },
];

export const definitionMap = Object.fromEntries(templateDefinitions.map((def) => [def.slug, def]));

export function getTemplateDefinition(slug: string) {
  return definitionMap[slug];
}
