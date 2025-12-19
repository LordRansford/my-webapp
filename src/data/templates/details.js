import registry from "../../../content/templates/registry.json";

const baseSteps = {
  ai: [
    "Load a small sample or type the scenario. Keep uploads under 5MB.",
    "Tune the sliders or options to see how the AI helper responds.",
    "Review the generated notes, save the state, and export if helpful.",
  ],
  data: [
    "Paste or upload a tiny sample in CSV or JSON where asked.",
    "Pick the checks or mappings you want to run for this data job.",
    "Review the findings and download the rule set or report.",
  ],
  "software-architecture": [
    "Capture the context, constraints, and drivers for the system.",
    "Walk through the guided prompts to map decisions and tradeoffs.",
    "Export the decision record or blueprint and save it to history.",
  ],
  digitalisation: [
    "Define the goal and scope for the digital initiative.",
    "Fill in the guided fields for governance, delivery, and metrics.",
    "Export the plan and keep a history entry for follow up.",
  ],
};

const baseOutputs = {
  ai: ["Structured checklist and metrics summary", "Exportable notes for follow up"],
  data: ["Validation report with suggested fixes", "Downloadable schema or CSV rules"],
  "software-architecture": ["Decision log with options and rationale", "Lightweight diagram or table export"],
  digitalisation: ["Strategy snapshot with owners and timelines", "CSV or PDF export for sharing"],
};

const overrides = {
  "ai-dataset-profile": {
    scenario: "Profile a churn.csv file with 5k rows to spot missing fields and leakage hints.",
    example: {
      input: "customer_id, tenure, churn_flag",
      output: "Churn flag has 0.3 missing. tenure is right skewed. No ID overlap flagged.",
    },
  },
  "ai-tiny-tabular-trainer": {
    scenario: "Train a tiny logistic regression on a toy credit risk sample with accuracy and loss curves.",
    outputs: ["Training and validation accuracy", "Loss curve and quick overfit warning"],
  },
  "ai-image-classifier": {
    scenario: "Upload a 128x128 PNG of a flower to see top-3 class guesses using a small tfjs model.",
    safety: ["Images never leave the browser. Stay under 5MB per file."],
  },
  "ai-ocr-quality": {
    scenario: "Test a scanned receipt image to see text extraction quality and confidence scores.",
    safety: ["Process locally where possible. Do not upload sensitive documents.", "Files are not stored; they stay in memory."],
  },
  "ai-model-card-generator": {
    scenario: "Capture purpose, data, metrics, and risks for a retail propensity model and export a model card.",
  },
  "data-file-format-inspector": {
    scenario: "Inspect sample.csv or sample.json to confirm delimiters, encoding, and row counts.",
    example: {
      input: "Sample CSV with headers and 50 rows",
      output: "Detected UTF-8, 6 columns, comma delimiter, 2 empty cells found.",
    },
  },
  "data-profiling-dashboard": {
    scenario: "Upload a customer extract and see missingness, duplicate counts, and basic ranges.",
  },
  "data-api-payload-validator": {
    scenario: "Paste a JSON payload for /orders and validate against a provided schema.",
  },
  "arch-c4-builder": {
    scenario: "Sketch a payment service context, container, and component view with quick exports.",
  },
  "arch-adr-generator": {
    scenario: "Document the decision to adopt PostgreSQL for the core service with alternatives considered.",
  },
  "arch-threat-model": {
    scenario: "Run a STRIDE pass on an onboarding flow with web, API, and data store nodes.",
  },
  "dig-strategy-canvas": {
    scenario: "Capture a digital strategy for customer self-serve with measures and enablers.",
  },
  "dig-benefits-tracker": {
    scenario: "Track three benefits for a billing portal with baseline vs actual and owners.",
  },
  "dig-risk-register": {
    scenario: "Record delivery and adoption risks for a CRM upgrade with mitigations and due dates.",
  },
};

function buildDetail(entry) {
  const categorySteps = baseSteps[entry.category] || baseSteps.ai;
  const categoryOutputs = baseOutputs[entry.category] || baseOutputs.ai;
  const override = overrides[entry.id] || {};

  return {
    id: entry.id,
    title: entry.title,
    category: entry.category,
    description: entry.description,
    scenario: override.scenario || `Run ${entry.title} on a small, non-sensitive sample to see how it behaves.`,
    steps: override.steps || categorySteps,
    outputs: override.outputs || categoryOutputs,
    example: override.example || {
      input: `${entry.title} example input`,
      output: `Expected output shows a concise summary for ${entry.title.toLowerCase()}.`,
    },
    safety: override.safety || [],
  };
}

export const templateDetails = Object.fromEntries(
  Object.values(registry)
    .flat()
    .map((entry) => [entry.id, buildDetail(entry)])
);
