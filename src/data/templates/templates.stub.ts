import registry from "../../../content/templates/registry.json";
import { MathInsight } from "@/components/templates/MathInsightBlock";

export type TemplateSectionItem = { title: string; detail: string };

export type TemplateSection = {
  id: string;
  title: string;
  summary: string;
  items?: TemplateSectionItem[];
  callout?: string;
};

export type TemplatePreview = {
  id: string;
  slug: string;
  category: string;
  title: string;
  description: string;
  shortDescription?: string;
  industries: string[];
  standards: string[];
  sections: TemplateSection[];
  mathsTopics: MathInsight[];
  complexityLevel?: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime?: string;
  mathsIntensity?: "Low" | "Medium" | "High";
  previewOnly?: true;
};

export type TemplateSectionData = TemplateSection;

type TemplateRegistryEntry = {
  id: string;
  category: string;
  title: string;
  description: string;
  route: string;
  area?: string;
};

const industriesByCategory: Record<string, string[]> = {
  cybersecurity: ["Financial services", "Public sector", "Critical infrastructure", "SaaS vendors"],
  ai: ["Product analytics", "Customer support", "E-commerce", "Healthcare research"],
  data: ["Analytics teams", "Data platform squads", "Operations", "Regulated reporting"],
  "software-architecture": ["B2B SaaS", "Payments", "Logistics", "Govtech"],
  digitalisation: ["Public services", "Education", "Utilities", "Retail modernisation"],
};

const standardsByCategory: Record<string, string[]> = {
  cybersecurity: ["NIST CSF alignment", "ISO 27001 control mapping", "SOC 2 evidence framing"],
  ai: ["Model card prompts", "Data minimisation hints", "Evaluation traceability hooks"],
  data: ["Schema stewardship reminders", "OpenAPI/JSON Schema cues", "Data retention checkpoints"],
  "software-architecture": ["ADR hygiene", "C4 notation reminders", "Reliability and latency notes"],
  digitalisation: ["Service design checkpoints", "Assurance and audit readiness", "Risk register hygiene"],
};

const mathsByCategory: Record<string, MathInsight[]> = {
  cybersecurity: [
    {
      title: "Risk scoring sketch",
      explanation: "Simple likelihood × impact framing to explain coloured risk cells without running numbers here.",
      exampleFormula: "risk_score = likelihood_weight * impact_weight",
      application: "Preview talks about normalising scores before painting any traffic-light grids.",
    },
    {
      title: "Bayesian update placeholder",
      explanation: "Shows how a prior incident rate could be nudged after a new signal, but keeps arithmetic disabled.",
      exampleFormula: "posterior = (prior * signal_strength) / evidence_normaliser",
    },
  ],
  ai: [
    {
      title: "Confidence and calibration",
      explanation: "Mentions how probabilities would be clipped and binned for reliability charts.",
      exampleFormula: "brier = mean((forecast_probability - outcome)^2)",
    },
    {
      title: "Class imbalance reminder",
      explanation: "Outlines why weighting might be applied when a class is rare.",
      exampleFormula: "weighted_precision = TP / (TP + FP) * class_weight",
    },
  ],
  data: [
    {
      title: "Outlier hinting",
      explanation: "Explains z-score style detection only conceptually so users know what would happen.",
      exampleFormula: "z = (value - mean) / std_dev",
    },
    {
      title: "Missingness scoring",
      explanation: "Describes how completeness metrics could be derived per column without running a scan.",
      exampleFormula: "completeness = 1 - (null_count / total_rows)",
    },
  ],
  "software-architecture": [
    {
      title: "Latency budgeting sketch",
      explanation: "Shows how a total SLO budget might be split per hop before real calculators exist.",
      exampleFormula: "service_budget_ms = end_to_end_budget_ms - sum(dependencies_ms)",
    },
    {
      title: "Availability stacking",
      explanation: "Explains multiplying component availability to illustrate why redundancy matters.",
      exampleFormula: "overall_availability = a1 * a2 * a3",
    },
  ],
  digitalisation: [
    {
      title: "Weighted scoring",
      explanation: "Preview of how options appraisal would weight criteria in the real tool.",
      exampleFormula: "weighted_score = sum(criterion_score_i * weight_i)",
    },
    {
      title: "Benefit realisation curve",
      explanation: "Textual note about projecting benefit realisation over s-curves without charts yet.",
      exampleFormula: "realised_benefit_t = target * (1 - e^(-k * t))",
    },
  ],
};

const defaultMaths: MathInsight[] = [
  {
    title: "Probability sketch",
    explanation: "Placeholder probability framing so readers see the depth without any live maths.",
    exampleFormula: "P(event) = favourable_outcomes / total_outcomes",
  },
];

const baseSections = (entry: TemplateRegistryEntry, industries: string[], standards: string[]): TemplateSection[] => [
  {
    id: "overview",
    title: "Overview",
    summary: `A calm, read-only walkthrough of ${entry.title}.`,
    items: [
      { title: "Purpose", detail: `${entry.description} without touching production data.` },
      { title: "When to use", detail: "When you want to check the shape, guardrails, and flow before requesting access." },
      { title: "Who it is for", detail: "Specialists who want evidence of thoughtfulness before trying a tool." },
      { title: "Typical industries", detail: industries.join(", ") },
    ],
    callout: "Preview mode keeps everything text-only and side-effect free.",
  },
  {
    id: "conceptual-model",
    title: "Conceptual Model",
    summary: "What the visual story would show once diagrams are unlocked.",
    items: [
      { title: "Diagram placeholder", detail: "Swimlanes for actors, data stores, and decision points with no live canvas yet." },
      { title: "Caption", detail: "Describes the intended diagram so stakeholders can verify the framing first." },
    ],
    callout: "Visuals load in the full experience; here you validate the narrative only.",
  },
  {
    id: "key-inputs",
    title: "Key Inputs",
    summary: "Inputs remain hypothetical; this page clarifies what they would be.",
    items: [
      { title: "Data expectations", detail: "Small, anonymised samples with sensible ranges. Units and scales are spelled out." },
      { title: "Assumptions", detail: "Preview lists the guardrails (volume limits, safe defaults, privacy posture)." },
      { title: "User choices", detail: "Sliders and toggles are described but locked to avoid state changes." },
    ],
  },
  {
    id: "underlying-logic",
    title: "Underlying Logic",
    summary: "Plain-English explanation of how calculations would run once enabled.",
    items: [
      { title: "Flow", detail: "Input validation → lightweight modelling or scoring → explainable outputs." },
      { title: "Error handling", detail: "What happens on bad inputs and how the UI would respond without breaking trust." },
      { title: "Assurance", detail: "Notes on logging, traceability, and the boundaries of this preview-only surface." },
    ],
  },
  {
    id: "outputs",
    title: "Outputs",
    summary: "What you would see when the template is fully live.",
    items: [
      { title: "Scoring", detail: "Colour-coded summaries, rankings, or walkthrough steps with confidence bands." },
      { title: "Narration", detail: "Human-readable callouts explaining why a score or recommendation appeared." },
      { title: "Follow-up", detail: "Prompts for governance or evidence collection without exporting anything here." },
    ],
  },
  {
    id: "professional-notes",
    title: "Professional Notes",
    summary: "Compliance-friendly notes to reassure reviewers this is worth their time.",
    items: [
      { title: "Standards alignment", detail: standards.join("; ") },
      { title: "Governance", detail: "Preview lists what would be logged, who would own reviews, and how changes are tracked." },
      { title: "Audit relevance", detail: "Explains where the real tool would surface evidence or signatures." },
    ],
  },
];

const buildStub = (entry: TemplateRegistryEntry): TemplatePreview => {
  const slug = entry.route?.split("/").filter(Boolean).pop() || entry.id;
  const industries = industriesByCategory[entry.category] || ["Cross-sector teams", "Product delivery", "Internal tooling"];
  const standards = standardsByCategory[entry.category] || ["Good engineering hygiene", "Clear audit trail"];
  const mathsTopics = mathsByCategory[entry.category] || defaultMaths;

  return {
    id: entry.id,
    slug,
    category: entry.category,
    title: entry.title,
    description: entry.description,
    shortDescription: entry.description,
    industries,
    standards,
    mathsTopics,
    sections: baseSections(entry, industries, standards),
    complexityLevel: "Intermediate",
    estimatedTime: "60-90 minutes",
    mathsIntensity: "Low",
    previewOnly: true,
  };
};

const registryEntries = registry as TemplateRegistryEntry[];
const stubEntries = registryEntries.map(buildStub);

const stubMap = Object.fromEntries(stubEntries.map((stub) => [`${stub.category}/${stub.slug}`, stub]));

export function getTemplateStub(category: string, templateId: string): TemplatePreview | null {
  return stubMap[`${category}/${templateId}`] || null;
}

export const templateStubs = stubEntries;
export const TEMPLATE_STUBS = stubEntries;
