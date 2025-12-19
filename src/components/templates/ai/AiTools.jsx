"use client";

import { useMemo } from "react";
import TemplateLayout from "@/components/templates/TemplateLayout";
import TemplateExportPanel from "@/components/templates/TemplateExportPanel";
import { useTemplateState } from "@/hooks/useTemplateState";

const attribution =
  "Created by Ransford for Ransfords Notes. Internal use allowed. Commercial use requires visible attribution.";

const formatTimestamp = (iso) => {
  if (!iso) return "Not saved yet";
  try {
    return new Date(iso).toLocaleString();
  } catch (error) {
    return iso;
  }
};

function StatsList({ items }) {
  return (
    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
      {items.map((line, idx) => (
        <li key={idx}>{line}</li>
      ))}
    </ul>
  );
}

export function DatasetProfile() {
  const storageKey = "template-ai-dataset-profile";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    csv: "",
    delimiter: ",",
  });

  const parsed = useMemo(() => {
    const lines = (state.csv || "").trim().split(/\r?\n/).filter(Boolean);
    if (!lines.length) return { headers: [], rows: [] };
    const delimiter = state.delimiter || ",";
    const headers = lines[0].split(delimiter).map((h) => h.trim());
    const rows = lines.slice(1).map((line) => line.split(delimiter).map((v) => v.trim()));
    return { headers, rows };
  }, [state.csv, state.delimiter]);

  const profile = useMemo(() => {
    const { headers, rows } = parsed;
    if (!headers.length) return [];
    const colStats = headers.map((header, idx) => {
      const values = rows.map((r) => r[idx] || "");
      const missing = values.filter((v) => v === "" || v.toLowerCase() === "na" || v.toLowerCase() === "null").length;
      const numeric = values.filter((v) => v !== "" && !Number.isNaN(Number(v))).length;
      const inferredType = numeric / Math.max(values.length, 1) > 0.6 ? "numeric" : "categorical";
      return `${header}: ${inferredType}; missing ${missing}/${values.length}`;
    });
    return colStats;
  }, [parsed]);

  const buildSections = () => [
    { heading: "Columns", body: parsed.headers.join(", ") || "No headers detected." },
    { heading: "Profile", body: profile },
  ];

  return (
    <TemplateLayout
      title="Dataset Profile Report"
      description="Upload or paste CSV to get quick column stats, missing values, and type hints."
      audience="Data scientists, ML engineers, and analysts."
      useCases={["Profile small datasets before modelling.", "Spot missing values quickly.", "Share a lightweight data summary."]}
      instructions={["Paste CSV data or upload.", "Choose delimiter if needed.", "Review column-level profile.", "Export for sharing."]}
      outputTitle="Profile"
      outputSummary={profile.join(" ")}
      outputInterpretation="Use this as a quick scan. Confirm data types and handle missing values before training."
      outputNextSteps={["Impute or drop missing values.", "Encode categorical columns.", "Document assumptions in the model card."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="ai-dataset-profile"
        title="Dataset Profile Report"
        category="AI"
        version="1.0.0"
        attributionText={attribution}
        captureSelector={[".template-capture-root", ".template-layout"]}
        prepareSections={buildSections}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-medium text-slate-700">Autosaves locally. Last updated: {formatTimestamp(lastUpdated)}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={resetState}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-slate-900">
          CSV data
          <textarea
            value={state.csv}
            onChange={(e) => updateState((prev) => ({ ...prev, csv: e.target.value }))}
            rows={10}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="col1,col2,col3&#10;1,red,yes&#10;2,blue,no"
          />
        </label>
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Settings</p>
          <label className="mt-2 block text-sm font-semibold text-slate-900">
            Delimiter
            <input
              type="text"
              value={state.delimiter}
              onChange={(e) => updateState((prev) => ({ ...prev, delimiter: e.target.value || "," }))}
              className="mt-2 w-20 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </label>
          <p className="mt-2 text-xs text-slate-700">Keep files small (&lt;5MB). Data stays in your browser.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Profile</p>
        {profile.length ? <StatsList items={profile} /> : <p className="text-sm text-slate-700">Add data to see profile.</p>}
      </div>
    </TemplateLayout>
  );
}

export function TinyTabularTrainer() {
  const storageKey = "template-ai-tiny-tabular-trainer";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    data: "x1,x2,label\n1,2,0\n2,2,0\n2,4,1\n3,5,1",
    learningRate: 0.1,
    epochs: 50,
    loss: [],
    weights: [0, 0, 0],
  });

  const parsedData = useMemo(() => {
    const lines = state.data.trim().split(/\r?\n/).filter(Boolean);
    const rows = lines.slice(1).map((line) => line.split(",").map(Number));
    return rows;
  }, [state.data]);

  const train = () => {
    let w0 = 0,
      w1 = 0,
      w2 = 0;
    const lr = Number(state.learningRate) || 0.1;
    const epochs = Number(state.epochs) || 20;
    const losses = [];
    for (let epoch = 0; epoch < epochs; epoch++) {
      let totalLoss = 0;
      parsedData.forEach(([x1, x2, y]) => {
        const z = w0 + w1 * x1 + w2 * x2;
        const pred = 1 / (1 + Math.exp(-z));
        const error = pred - y;
        totalLoss += -(y * Math.log(pred + 1e-6) + (1 - y) * Math.log(1 - pred + 1e-6));
        w0 -= lr * error;
        w1 -= lr * error * x1;
        w2 -= lr * error * x2;
      });
      losses.push(Number((totalLoss / parsedData.length).toFixed(4)));
    }
    updateState((prev) => ({ ...prev, loss: losses, weights: [w0, w1, w2] }));
  };

  const buildSections = () => [
    { heading: "Weights", body: `w0=${state.weights[0].toFixed(3)}, w1=${state.weights[1].toFixed(3)}, w2=${state.weights[2].toFixed(3)}` },
    { heading: "Loss curve", body: state.loss.map((l, i) => `Epoch ${i + 1}: ${l}`) },
  ];

  return (
    <TemplateLayout
      title="Tiny Tabular Trainer"
      description="Toy logistic regression with two features to illustrate training dynamics."
      audience="ML beginners and analysts experimenting with tiny datasets."
      useCases={["Teach basic training dynamics.", "Explore learning rate and epochs.", "Share a lightweight training snapshot."]}
      instructions={[
        "Paste tiny CSV with headers x1,x2,label.",
        "Set learning rate and epochs.",
        "Train to see loss curve and weights.",
        "Export snapshot.",
      ]}
      outputTitle="Training snapshot"
      outputSummary={`Loss after ${state.loss.length} epochs: ${state.loss[state.loss.length - 1] || "n/a"}`}
      outputInterpretation="This is a toy model. Use proper tooling and validation for real data."
      outputNextSteps={["Try different learning rates.", "Shuffle data and retrain.", "Add features and regularisation in a real notebook."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="ai-tiny-tabular-trainer"
        title="Tiny Tabular Trainer"
        category="AI"
        version="1.0.0"
        attributionText={attribution}
        prepareSections={buildSections}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-medium text-slate-700">Autosaves locally. Last updated: {formatTimestamp(lastUpdated)}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={train}
            className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
          >
            Train
          </button>
          <button
            type="button"
            onClick={resetState}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-slate-900">
          CSV data (x1,x2,label)
          <textarea
            value={state.data}
            onChange={(e) => updateState((prev) => ({ ...prev, data: e.target.value }))}
            rows={8}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <label className="block text-sm font-semibold text-slate-900">
            Learning rate
            <input
              type="number"
              step="0.01"
              value={state.learningRate}
              onChange={(e) => updateState((prev) => ({ ...prev, learningRate: e.target.value }))}
              className="mt-2 w-28 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </label>
          <label className="mt-3 block text-sm font-semibold text-slate-900">
            Epochs
            <input
              type="number"
              value={state.epochs}
              onChange={(e) => updateState((prev) => ({ ...prev, epochs: e.target.value }))}
              className="mt-2 w-28 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </label>
          <p className="mt-3 text-xs text-slate-700">Toy-only. Keep datasets tiny.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Weights</p>
          <p className="mt-2 text-sm text-slate-700">
            {`w0=${state.weights[0].toFixed(3)}, w1=${state.weights[1].toFixed(3)}, w2=${state.weights[2].toFixed(3)}`}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Loss</p>
          {state.loss.length ? <StatsList items={state.loss.map((l, i) => `Epoch ${i + 1}: ${l}`)} /> : <p className="text-sm text-slate-700">Train to see loss.</p>}
        </div>
      </div>
    </TemplateLayout>
  );
}

export function LossCurveExplorer() {
  const storageKey = "template-ai-loss-curve-explorer";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    epochs: 50,
    noise: 0.02,
    overfitEpoch: 30,
    curve: [],
  });

  const simulate = () => {
    const epochs = Number(state.epochs) || 50;
    const noise = Number(state.noise) || 0.02;
    const overfitEpoch = Number(state.overfitEpoch) || Math.floor(epochs * 0.6);
    const curve = [];
    for (let i = 1; i <= epochs; i++) {
      const base = Math.exp(-i / 25);
      const bump = i > overfitEpoch ? (i - overfitEpoch) * 0.01 : 0;
      const val = Math.max(0.01, base + bump + (Math.random() - 0.5) * noise);
      curve.push(Number(val.toFixed(4)));
    }
    updateState((prev) => ({ ...prev, curve }));
  };

  const buildSections = () => [
    { heading: "Loss curve", body: state.curve.map((v, idx) => `Epoch ${idx + 1}: ${v}`) },
    { heading: "Overfit epoch", body: `Approx overfit starts near epoch ${state.overfitEpoch}` },
  ];

  return (
    <TemplateLayout
      title="Loss Curve Explorer"
      description="Simulate training loss and see when overfitting starts."
      audience="ML learners and reviewers."
      useCases={["Explain overfitting visually.", "Tune epochs and regularisation budgets.", "Share loss snapshots in reviews."]}
      instructions={["Set epochs and noise.", "Optionally set overfit start.", "Simulate to see curve values.", "Export snapshot."]}
      outputTitle="Curve"
      outputSummary={state.curve.length ? `Min loss ${Math.min(...state.curve).toFixed(4)}` : "Simulate to see curve values."}
      outputInterpretation="Use as a teaching aid. Real training curves come from actual training runs."
      outputNextSteps={["Run on a real dataset.", "Track validation loss separately.", "Use early stopping in production."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="ai-loss-curve-explorer"
        title="Loss Curve Explorer"
        category="AI"
        version="1.0.0"
        attributionText={attribution}
        prepareSections={buildSections}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-medium text-slate-700">Autosaves locally. Last updated: {formatTimestamp(lastUpdated)}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={simulate}
            className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
          >
            Simulate
          </button>
          <button
            type="button"
            onClick={resetState}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="text-sm font-semibold text-slate-900">
          Epochs
          <input
            type="number"
            value={state.epochs}
            onChange={(e) => updateState((prev) => ({ ...prev, epochs: e.target.value }))}
            className="mt-2 w-24 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Noise
          <input
            type="number"
            step="0.01"
            value={state.noise}
            onChange={(e) => updateState((prev) => ({ ...prev, noise: e.target.value }))}
            className="mt-2 w-24 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Overfit starts around epoch
          <input
            type="number"
            value={state.overfitEpoch}
            onChange={(e) => updateState((prev) => ({ ...prev, overfitEpoch: e.target.value }))}
            className="mt-2 w-32 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Loss values</p>
        {state.curve.length ? <StatsList items={state.curve.map((v, i) => `Epoch ${i + 1}: ${v}`)} /> : <p className="text-sm text-slate-700">Simulate to view.</p>}
      </div>
    </TemplateLayout>
  );
}

export function MetricDashboard() {
  const storageKey = "template-ai-metric-dashboard";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    tp: 40,
    fp: 10,
    tn: 30,
    fn: 20,
  });

  const metrics = useMemo(() => {
    const tp = Number(state.tp) || 0;
    const fp = Number(state.fp) || 0;
    const tn = Number(state.tn) || 0;
    const fn = Number(state.fn) || 0;
    const total = tp + fp + tn + fn || 1;
    const accuracy = (tp + tn) / total;
    const precision = tp / Math.max(tp + fp, 1);
    const recall = tp / Math.max(tp + fn, 1);
    const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);
    return {
      accuracy: accuracy.toFixed(3),
      precision: precision.toFixed(3),
      recall: recall.toFixed(3),
      f1: f1.toFixed(3),
    };
  }, [state.fn, state.fp, state.tn, state.tp]);

  const buildSections = () => [
    { heading: "Confusion matrix", body: `TP ${state.tp}, FP ${state.fp}, TN ${state.tn}, FN ${state.fn}` },
    { heading: "Metrics", body: Object.entries(metrics).map(([k, v]) => `${k}: ${v}`) },
  ];

  return (
    <TemplateLayout
      title="Metric Dashboard"
      description="Compute accuracy, precision, recall, and F1 from confusion matrix counts."
      audience="ML practitioners and reviewers."
      useCases={["Check basic metrics before shipping.", "Share quick evaluation snapshots.", "Teach metric trade-offs."]}
      instructions={["Enter confusion matrix counts.", "Review computed metrics.", "Export snapshot for documentation."]}
      outputTitle="Metrics"
      outputSummary={`Acc ${metrics.accuracy}, Prec ${metrics.precision}, Rec ${metrics.recall}, F1 ${metrics.f1}`}
      outputInterpretation="Use this as a quick calculator. For serious evaluation, use proper datasets and ROC/PR analysis."
      outputNextSteps={["Plot ROC/PR curves.", "Check calibration.", "Segment metrics by slices for bias checks."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="ai-metric-dashboard"
        title="Metric Dashboard"
        category="AI"
        version="1.0.0"
        attributionText={attribution}
        prepareSections={buildSections}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-medium text-slate-700">Autosaves locally. Last updated: {formatTimestamp(lastUpdated)}</p>
        <button
          type="button"
          onClick={resetState}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Reset
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {["tp", "fp", "tn", "fn"].map((key) => (
          <label key={key} className="text-sm font-semibold text-slate-900">
            {key.toUpperCase()}
            <input
              type="number"
              value={state[key]}
              onChange={(e) => updateState((prev) => ({ ...prev, [key]: e.target.value }))}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </label>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Metrics</p>
          <StatsList items={[`Accuracy: ${metrics.accuracy}`, `Precision: ${metrics.precision}`, `Recall: ${metrics.recall}`, `F1: ${metrics.f1}`]} />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Interpretation</p>
          <p className="mt-2 text-sm text-slate-700">
            High precision, lower recall: cautious model. High recall, lower precision: permissive model. Balance to your risk appetite.
          </p>
        </div>
      </div>
    </TemplateLayout>
  );
}

export function PromptTemplateBuilder() {
  const storageKey = "template-ai-prompt-template-builder";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    goal: "",
    audience: "",
    constraints: "",
    variables: "",
    prompt: "",
  });

  const buildPrompt = () => {
    const vars = state.variables
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean)
      .map((v) => `{{${v}}}`);
    const template = [
      `You are helping with: ${state.goal || "objective not set"}.`,
      state.audience ? `Audience: ${state.audience}.` : "",
      state.constraints ? `Constraints: ${state.constraints}.` : "",
      vars.length ? `Variables to fill: ${vars.join(", ")}.` : "",
      "Provide structured, concise responses.",
    ]
      .filter(Boolean)
      .join(" ");
    updateState((prev) => ({ ...prev, prompt: template }));
  };

  const buildSections = () => [
    { heading: "Prompt goal", body: state.goal || "Not set" },
    { heading: "Audience", body: state.audience || "Not set" },
    { heading: "Template", body: state.prompt || "Generate to view prompt." },
  ];

  return (
    <TemplateLayout
      title="Prompt Template Builder"
      description="Compose safe, structured prompts with variables and constraints."
      audience="Prompt engineers, product teams, and reviewers."
      useCases={["Design reusable prompt shells.", "Keep constraints explicit.", "Share prompts across teams."]}
      instructions={["Set goal and audience.", "Add constraints and variables.", "Generate a prompt shell.", "Export for reuse."]}
      outputTitle="Prompt"
      outputSummary={state.prompt || "Generate a prompt to view."}
      outputInterpretation="Keep variables clear and avoid leaking secrets. Validate prompts with human review."
      outputNextSteps={["Test with edge cases.", "Add guardrails in code.", "Version prompts and review regularly."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="ai-prompt-template-builder"
        title="Prompt Template Builder"
        category="AI"
        version="1.0.0"
        attributionText={attribution}
        prepareSections={buildSections}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-medium text-slate-700">Autosaves locally. Last updated: {formatTimestamp(lastUpdated)}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={buildPrompt}
            className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
          >
            Generate prompt
          </button>
          <button
            type="button"
            onClick={resetState}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-slate-900">
          Goal
          <input
            type="text"
            value={state.goal}
            onChange={(e) => updateState((prev) => ({ ...prev, goal: e.target.value }))}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="Summarise incidents, generate FAQs..."
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Audience
          <input
            type="text"
            value={state.audience}
            onChange={(e) => updateState((prev) => ({ ...prev, audience: e.target.value }))}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="Security leads, customers, execs..."
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Constraints
          <textarea
            value={state.constraints}
            onChange={(e) => updateState((prev) => ({ ...prev, constraints: e.target.value }))}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="No PII, avoid speculation, keep to 120 words..."
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Variables (comma separated)
          <input
            type="text"
            value={state.variables}
            onChange={(e) => updateState((prev) => ({ ...prev, variables: e.target.value }))}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="topic, tone, length"
          />
        </label>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Prompt</p>
        <p className="mt-2 text-sm text-slate-800">{state.prompt || "Generate to see the prompt shell."}</p>
      </div>
    </TemplateLayout>
  );
}

export function ImageClassifierDemo() {
  const storageKey = "template-ai-image-classifier-demo";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    fileName: "",
    result: "",
    hints: "",
  });

  const classify = (name) => {
    const lower = name.toLowerCase();
    let label = "general object";
    if (lower.includes("cat")) label = "cat (likely)";
    else if (lower.includes("dog")) label = "dog (likely)";
    else if (lower.includes("doc") || lower.includes("pdf")) label = "document";
    else if (lower.includes("face")) label = "face detected";
    updateState((prev) => ({ ...prev, fileName: name, result: label, hints: "Lightweight demo. No image is uploaded off device." }));
  };

  const buildSections = () => [
    { heading: "File", body: state.fileName || "Not uploaded" },
    { heading: "Prediction", body: state.result || "No prediction yet." },
    { heading: "Notes", body: state.hints || "" },
  ];

  return (
    <TemplateLayout
      title="Image Classifier Demo"
      description="Demo classification based on filename hints (no upload leaves the browser)."
      audience="Product owners and learners."
      useCases={["Show how a classifier workflow feels.", "Discuss privacy before enabling uploads.", "Export demo outputs for review."]}
      instructions={["Select an image file.", "Review the inferred label.", "Add notes and export."]}
      outputTitle="Result"
      outputSummary={state.result || "Upload to see a prediction."}
      outputInterpretation="This is a privacy-safe demo. For real inference, integrate vetted models and secure storage."
      outputNextSteps={["Decide on model hosting.", "Add content safety checks.", "Retest with real samples."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="ai-image-classifier-demo"
        title="Image Classifier Demo"
        category="AI"
        version="1.0.0"
        attributionText={attribution}
        prepareSections={buildSections}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-medium text-slate-700">Autosaves locally. Last updated: {formatTimestamp(lastUpdated)}</p>
        <button
          type="button"
          onClick={resetState}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Reset
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <label className="text-sm font-semibold text-slate-900">
          Select an image (name stays local)
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              classify(file.name);
            }}
            className="mt-2 block text-sm"
          />
        </label>
        <p className="mt-2 text-xs text-slate-700">Filename is used as a hint. No upload leaves your device.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Result</p>
        <p className="mt-2 text-sm text-slate-800">{state.result || "Prediction will appear here."}</p>
        <p className="mt-1 text-xs text-slate-700">{state.hints}</p>
      </div>
    </TemplateLayout>
  );
}

export function ModelCardGenerator() {
  const storageKey = "template-ai-model-card-generator";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    modelName: "",
    purpose: "",
    data: "",
    evaluation: "",
    risks: "",
    mitigation: "",
  });

  const buildSections = () => [
    { heading: "Model", body: state.modelName },
    { heading: "Purpose", body: state.purpose },
    { heading: "Data", body: state.data },
    { heading: "Evaluation", body: state.evaluation },
    { heading: "Risks", body: state.risks },
    { heading: "Mitigation", body: state.mitigation },
  ];

  return (
    <TemplateLayout
      title="Model Card Generator"
      description="Capture purpose, data, evaluation, risks, and mitigations into a sharable model card."
      audience="ML teams and governance leads."
      useCases={["Document models before release.", "Share evaluation snapshots.", "Capture risks and mitigations."]}
      instructions={["Fill in each section.", "Call out risks and mitigations.", "Export as PDF/DOCX/PNG."]}
      outputTitle="Model card"
      outputSummary={state.purpose || "Add purpose, data, and risks to build the card."}
      outputInterpretation="Ensure claims match evaluation evidence and data scope."
      outputNextSteps={["Attach eval results.", "Review with governance.", "Version the card after changes."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="ai-model-card-generator"
        title="Model Card Generator"
        category="AI"
        version="1.0.0"
        attributionText={attribution}
        prepareSections={buildSections}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-medium text-slate-700">Autosaves locally. Last updated: {formatTimestamp(lastUpdated)}</p>
        <button
          type="button"
          onClick={resetState}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Reset
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-slate-900">
          Model name and version
          <input
            type="text"
            value={state.modelName}
            onChange={(e) => updateState((prev) => ({ ...prev, modelName: e.target.value }))}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Purpose and scope
          <textarea
            value={state.purpose}
            onChange={(e) => updateState((prev) => ({ ...prev, purpose: e.target.value }))}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Training and evaluation data
          <textarea
            value={state.data}
            onChange={(e) => updateState((prev) => ({ ...prev, data: e.target.value }))}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Evaluation summary
          <textarea
            value={state.evaluation}
            onChange={(e) => updateState((prev) => ({ ...prev, evaluation: e.target.value }))}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Risks
          <textarea
            value={state.risks}
            onChange={(e) => updateState((prev) => ({ ...prev, risks: e.target.value }))}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Mitigations
          <textarea
            value={state.mitigation}
            onChange={(e) => updateState((prev) => ({ ...prev, mitigation: e.target.value }))}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
      </div>
    </TemplateLayout>
  );
}

export function AiRiskAssessment() {
  const storageKey = "template-ai-risk-assessment";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    useCase: "",
    dataRisk: 2,
    modelRisk: 2,
    impact: 2,
    mitigations: "",
  });

  const score = useMemo(() => {
    const total = Number(state.dataRisk) + Number(state.modelRisk) + Number(state.impact);
    if (total <= 5) return { label: "Low", color: "text-emerald-700 bg-emerald-50" };
    if (total <= 7) return { label: "Medium", color: "text-amber-700 bg-amber-50" };
    return { label: "High", color: "text-rose-700 bg-rose-50" };
  }, [state.dataRisk, state.impact, state.modelRisk]);

  const buildSections = () => [
    { heading: "Use case", body: state.useCase },
    { heading: "Risk inputs", body: `Data=${state.dataRisk}, Model=${state.modelRisk}, Impact=${state.impact}` },
    { heading: "Risk rating", body: score.label },
    { heading: "Mitigations", body: state.mitigations || "Not set" },
  ];

  return (
    <TemplateLayout
      title="AI Use Case Risk Assessment"
      description="Rate data, model, and impact risks to get a quick AI risk level."
      audience="AI governance, product, and risk teams."
      useCases={["Triage AI use cases before build.", "Capture mitigations early.", "Export risk snapshot for approvals."]}
      instructions={["Describe the use case.", "Set data, model, and impact risks (1-3).", "Review the rating and add mitigations.", "Export."]}
      outputTitle="Risk rating"
      outputSummary={`${score.label} risk`}
      outputInterpretation="Use this as a fast triage. Deep risk reviews are still required for higher stakes cases."
      outputNextSteps={["Run DPIA where applicable.", "Add guardrails and monitoring.", "Reassess after major changes."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="ai-risk-assessment"
        title="AI Use Case Risk Assessment"
        category="AI"
        version="1.0.0"
        attributionText={attribution}
        prepareSections={buildSections}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-medium text-slate-700">Autosaves locally. Last updated: {formatTimestamp(lastUpdated)}</p>
        <button
          type="button"
          onClick={resetState}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Reset
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-slate-900">
          Use case
          <textarea
            value={state.useCase}
            onChange={(e) => updateState((prev) => ({ ...prev, useCase: e.target.value }))}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm space-y-3">
          {[
            { key: "dataRisk", label: "Data risk (1-3)" },
            { key: "modelRisk", label: "Model risk (1-3)" },
            { key: "impact", label: "Impact (1-3)" },
          ].map((item) => (
            <label key={item.key} className="block text-sm font-semibold text-slate-900">
              {item.label}
              <input
                type="number"
                min="1"
                max="3"
                value={state[item.key]}
                onChange={(e) => updateState((prev) => ({ ...prev, [item.key]: e.target.value }))}
                className="mt-2 w-24 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </label>
          ))}
          <p className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${score.color}`}>Rating: {score.label}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <label className="text-sm font-semibold text-slate-900">
          Mitigations
          <textarea
            value={state.mitigations}
            onChange={(e) => updateState((prev) => ({ ...prev, mitigations: e.target.value }))}
            rows={4}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="Controls, monitoring, human review..."
          />
        </label>
      </div>
    </TemplateLayout>
  );
}

export const aiToolComponents = {
  "ai-dataset-profile": DatasetProfile,
  "ai-tiny-tabular-trainer": TinyTabularTrainer,
  "ai-loss-curve-explorer": LossCurveExplorer,
  "ai-metric-dashboard": MetricDashboard,
  "ai-prompt-template-builder": PromptTemplateBuilder,
  "ai-image-classifier-demo": ImageClassifierDemo,
  "ai-model-card-generator": ModelCardGenerator,
  "ai-risk-assessment": AiRiskAssessment,
};
