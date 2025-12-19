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

function List({ items }) {
  if (!items || !items.length) return <p className="text-sm text-slate-700">Add inputs to see outputs.</p>;
  return (
    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
      {items.map((line, idx) => (
        <li key={idx}>{line}</li>
      ))}
    </ul>
  );
}

export function DataFormatInspector() {
  const storageKey = "template-data-format-inspector";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    sample: '{ "name": "Ada", "age": 30 }\nname,age\nAda,30',
    delimiter: ",",
  });

  const detection = useMemo(() => {
    const lines = (state.sample || "").split(/\r?\n/).filter(Boolean);
    if (!lines.length) return ["Add a small sample (no secrets)."];
    const first = lines[0].trim();
    const hints = [];
    if (first.startsWith("{") || first.startsWith("[")) hints.push("JSON likely");
    if (first.includes(state.delimiter)) hints.push(`Delimiter '${state.delimiter}' detected`);
    if (first.startsWith("<")) hints.push("XML/HTML-like structure");
    if (!hints.length) hints.push("Format unclear. Provide a clearer snippet.");
    return hints;
  }, [state.sample, state.delimiter]);

  const buildSections = () => [
    { heading: "Detection", body: detection },
    { heading: "Sample", body: state.sample.slice(0, 400) },
  ];

  return (
    <TemplateLayout
      title="File Format Inspector"
      description="Inspect a small snippet to infer likely format and delimiters."
      audience="Data engineers and analysts."
      useCases={["Sanity check incoming files.", "Spot format issues early.", "Share detection with teammates."]}
      instructions={["Paste a small sample (no secrets).", "Set delimiter if needed.", "Review detected hints.", "Export snapshot."]}
      outputTitle="Detection"
      outputSummary={detection.join(" ")}
      outputInterpretation="Use this as a quick hint. Validate with proper parsers for production."
      outputNextSteps={["Confirm encoding.", "Validate schema.", "Strip PII before sharing."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="data-file-format-inspector"
        title="File Format Inspector"
        category="Data"
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
          Sample (small snippet)
          <textarea
            value={state.sample}
            onChange={(e) => updateState((prev) => ({ ...prev, sample: e.target.value }))}
            rows={8}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
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
          <p className="mt-2 text-xs text-slate-700">Keep under 5MB. Do not paste sensitive data.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Detection</p>
        <StatsList items={detection} />
      </div>
    </TemplateLayout>
  );
}

export function DataProfilingDashboard() {
  const storageKey = "template-data-profiling-dashboard";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    numbers: "1,2,3,4,5,6,6",
  });

  const summary = useMemo(() => {
    const nums = (state.numbers || "")
      .split(/[,\\s]+/)
      .map((n) => Number(n))
      .filter((n) => !Number.isNaN(n));
    if (!nums.length) return {};
    const min = Math.min(...nums);
    const max = Math.max(...nums);
    const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
    const unique = new Set(nums).size;
    return { min, max, avg: Number(avg.toFixed(2)), unique, count: nums.length };
  }, [state.numbers]);

  const buildSections = () => [{ heading: "Summary", body: Object.entries(summary).map(([k, v]) => `${k}: ${v}`) }];

  return (
    <TemplateLayout
      title="Data Profiling Dashboard"
      description="Quick numeric profiling: min, max, average, uniqueness, count."
      audience="Analysts and data engineers."
      useCases={["Profile numeric columns.", "Share quick stats with teams.", "Check for obvious anomalies."]}
      instructions={["Paste numeric values separated by commas or spaces.", "Review min/max/avg/unique counts.", "Export the snapshot."]}
      outputTitle="Profile"
      outputSummary={Object.keys(summary).length ? JSON.stringify(summary) : "Add numbers to see stats."}
      outputInterpretation="Use for quick checks; run full profiling on large datasets separately."
      outputNextSteps={["Handle missing values.", "Check distributions.", "Document data quality rules."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="data-profiling-dashboard"
        title="Data Profiling Dashboard"
        category="Data"
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
          Numeric values
          <textarea
            value={state.numbers}
            onChange={(e) => updateState((prev) => ({ ...prev, numbers: e.target.value }))}
            rows={4}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
      </div>

      {Object.keys(summary).length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Summary</p>
          <StatsList items={Object.entries(summary).map(([k, v]) => `${k}: ${v}`)} />
        </div>
      )}
    </TemplateLayout>
  );
}

export function DataQualityRulesBuilder() {
  const storageKey = "template-data-quality-rules";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    field: "email",
    rules: "Not null; Valid email format; Lowercase",
    severity: "high",
  });

  const buildSections = () => [
    { heading: "Field", body: state.field },
    { heading: "Rules", body: state.rules },
    { heading: "Severity", body: state.severity },
  ];

  return (
    <TemplateLayout
      title="Data Quality Rules Builder"
      description="Define quality checks per field with severity levels."
      audience="Data stewards and engineers."
      useCases={["Document data quality expectations.", "Share rules with engineering.", "Export rules for validation jobs."]}
      instructions={["Select a field.", "List rules separated by semicolons.", "Set severity.", "Export the rules."]}
      outputTitle="Rules"
      outputSummary={state.rules}
      outputInterpretation="Use as a starting point; implement the rules in your pipelines."
      outputNextSteps={["Automate checks.", "Monitor drift.", "Align with governance."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="data-quality-rules-builder"
        title="Data Quality Rules Builder"
        category="Data"
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

      <div className="grid gap-4 md:grid-cols-3">
        <label className="text-sm font-semibold text-slate-900">
          Field
          <input
            type="text"
            value={state.field}
            onChange={(e) => updateState((prev) => ({ ...prev, field: e.target.value }))}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Rules (semicolon separated)
          <textarea
            value={state.rules}
            onChange={(e) => updateState((prev) => ({ ...prev, rules: e.target.value }))}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Severity
          <select
            value={state.severity}
            onChange={(e) => updateState((prev) => ({ ...prev, severity: e.target.value }))}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
        </label>
      </div>
    </TemplateLayout>
  );
}

export function DataDictionaryGenerator() {
  const storageKey = "template-data-dictionary";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    fields: "id: unique identifier; email: user email; created_at: timestamp",
  });

  const buildSections = () => [{ heading: "Fields", body: state.fields }];

  return (
    <TemplateLayout
      title="Data Dictionary Generator"
      description="Capture fields and definitions, ready to export."
      audience="Data stewards and teams."
      useCases={["Draft data dictionaries quickly.", "Share with consumers.", "Keep definitions consistent."]}
      instructions={["List fields and definitions using colon/semicolon.", "Review and export."]}
      outputTitle="Dictionary"
      outputSummary={state.fields}
      outputInterpretation="Use as a quick dictionary; sync to your catalog later."
      outputNextSteps={["Validate with owners.", "Publish to catalog.", "Version as schema evolves."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="data-dictionary-generator"
        title="Data Dictionary Generator"
        category="Data"
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
          Fields and definitions
          <textarea
            value={state.fields}
            onChange={(e) => updateState((prev) => ({ ...prev, fields: e.target.value }))}
            rows={5}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
      </div>
    </TemplateLayout>
  );
}

export function ApiPayloadValidator() {
  const storageKey = "template-data-api-validator";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    payload: '{ "name": "Ada", "age": 30 }',
    required: "name,age",
  });

  const warnings = useMemo(() => {
    const req = (state.required || "")
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);
    let parsed = {};
    try {
      parsed = JSON.parse(state.payload || "{}") || {};
    } catch (error) {
      return ["Invalid JSON payload."];
    }
    const missing = req.filter((r) => !(r in parsed));
    if (missing.length) return ["Missing fields: " + missing.join(", ")];
    return ["Payload looks ok against required fields."];
  }, [state.payload, state.required]);

  const buildSections = () => [
    { heading: "Payload", body: state.payload },
    { heading: "Required", body: state.required },
    { heading: "Warnings", body: warnings },
  ];

  return (
    <TemplateLayout
      title="API Payload Validator"
      description="Validate JSON payloads against a quick required-field list."
      audience="API designers and integrators."
      useCases={["Catch missing fields early.", "Share validation notes.", "Educate teams on JSON requirements."]}
      instructions={["Paste a small JSON payload (no secrets).", "List required fields comma-separated.", "Review warnings and export."]}
      outputTitle="Validation"
      outputSummary={warnings.join(" ")}
      outputInterpretation="Use for small samples; rely on full schema validation in production."
      outputNextSteps={["Add JSON schema validation.", "Document optional fields.", "Add contract tests."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="data-api-payload-validator"
        title="API Payload Validator"
        category="Data"
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
          JSON payload
          <textarea
            value={state.payload}
            onChange={(e) => updateState((prev) => ({ ...prev, payload: e.target.value }))}
            rows={6}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Required fields (comma separated)
          <input
            type="text"
            value={state.required}
            onChange={(e) => updateState((prev) => ({ ...prev, required: e.target.value }))}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Warnings</p>
        <StatsList items={warnings} />
      </div>
    </TemplateLayout>
  );
}

export function DataRaciBuilder() {
  const storageKey = "template-data-raci";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    roles: "Data owner: A; Steward: R; Engineer: R; Security: C; Legal: I",
  });

  const buildSections = () => [{ heading: "RACI", body: state.roles }];

  return (
    <TemplateLayout
      title="Data Governance RACI"
      description="Assign R/A/C/I for data governance roles."
      audience="Data governance leads."
      useCases={["Clarify accountability.", "Share with program teams.", "Export for approvals."]}
      instructions={["List role and R/A/C/I mapping.", "Keep it concise.", "Export for sharing."]}
      outputTitle="RACI"
      outputSummary={state.roles}
      outputInterpretation="Use as a starter; validate with stakeholders."
      outputNextSteps={["Align with policy.", "Publish in the data catalog.", "Review quarterly."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="data-raci-builder"
        title="Data Governance RACI"
        category="Data"
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
          Roles and assignments
          <textarea
            value={state.roles}
            onChange={(e) => updateState((prev) => ({ ...prev, roles: e.target.value }))}
            rows={4}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
      </div>
    </TemplateLayout>
  );
}

export function DataClassificationHelper() {
  const storageKey = "template-data-classification";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    context: "Customer data with emails and IDs",
    level: "internal",
    handling: "Encrypt at rest; restrict access to need-to-know; masking in lower envs",
  });

  const buildSections = () => [
    { heading: "Context", body: state.context },
    { heading: "Classification", body: state.level },
    { heading: "Handling", body: state.handling },
  ];

  return (
    <TemplateLayout
      title="Data Classification Helper"
      description="Assign a simple classification and handling rules."
      audience="Data owners and stewards."
      useCases={["Set handling rules quickly.", "Share with engineering and legal.", "Export for governance reviews."]}
      instructions={["Describe the context.", "Pick a classification.", "List handling rules.", "Export."]}
      outputTitle="Classification"
      outputSummary={state.level}
      outputInterpretation="Use as a starter; align with your formal policy."
      outputNextSteps={["Review with security/legal.", "Implement masking/encryption.", "Revisit when scope changes."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="data-classification-helper"
        title="Data Classification Helper"
        category="Data"
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
          Context
          <textarea
            value={state.context}
            onChange={(e) => updateState((prev) => ({ ...prev, context: e.target.value }))}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Classification
          <select
            value={state.level}
            onChange={(e) => updateState((prev) => ({ ...prev, level: e.target.value }))}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="public">public</option>
            <option value="internal">internal</option>
            <option value="confidential">confidential</option>
            <option value="restricted">restricted</option>
          </select>
        </label>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <label className="text-sm font-semibold text-slate-900">
          Handling rules
          <textarea
            value={state.handling}
            onChange={(e) => updateState((prev) => ({ ...prev, handling: e.target.value }))}
            rows={4}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
      </div>
    </TemplateLayout>
  );
}

export function EntityRelationshipDiagramBuilder() {
  const storageKey = "template-data-entity-relationship-diagram";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    entities: "Customer(id, name)\nOrder(id, customerId, total)\nItem(id, orderId, sku)",
    relationships: "Customer 1..* Order; Order 1..* Item",
    notes: "Identify primary keys and foreign keys; note optionality.",
  });

  const buildSections = () => [
    { heading: "Entities", body: state.entities },
    { heading: "Relationships", body: state.relationships },
    { heading: "Notes", body: state.notes },
  ];

  return (
    <TemplateLayout
      title="Entity Relationship Diagram Builder"
      description="Capture entities, keys, and relationships for a quick ERD outline."
      audience="Data modelers and engineers."
      useCases={["Draft ERDs before formal modelling.", "Share with stakeholders.", "Export for reviews."]}
      instructions={[
        "List entities with keys.",
        "Describe relationships and cardinality.",
        "Add notes for optionality or constraints.",
        "Export snapshot.",
      ]}
      outputTitle="ERD outline"
      outputSummary={`${state.entities} | ${state.relationships}`}
      outputInterpretation="Use this as a lightweight outline; refine in a diagram tool later."
      outputNextSteps={["Add indexes and constraints.", "Align with domain glossary.", "Review with engineering."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="data-entity-relationship-diagram"
        title="Entity Relationship Diagram Builder"
        category="Data"
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

      <div className="grid gap-4 md:grid-cols-3">
        <label className="text-sm font-semibold text-slate-900">
          Entities (one per line)
          <textarea
            value={state.entities}
            onChange={(e) => updateState((prev) => ({ ...prev, entities: e.target.value }))}
            rows={5}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="Customer(id, name)"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Relationships
          <textarea
            value={state.relationships}
            onChange={(e) => updateState((prev) => ({ ...prev, relationships: e.target.value }))}
            rows={5}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="Customer 1..* Order; Order 1..* Item"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Notes
          <textarea
            value={state.notes}
            onChange={(e) => updateState((prev) => ({ ...prev, notes: e.target.value }))}
            rows={5}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
      </div>
    </TemplateLayout>
  );
}

export function KpiDefinitionBuilder() {
  const storageKey = "template-data-kpi-definition-builder";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    metric: "Weekly active users",
    formula: "Unique users active in last 7 days",
    source: "Events table; device events",
    owner: "Product analytics",
    cadence: "Weekly",
  });

  const buildSections = () => [
    { heading: "Metric", body: state.metric },
    { heading: "Formula", body: state.formula },
    { heading: "Source", body: state.source },
    { heading: "Owner", body: state.owner },
    { heading: "Cadence", body: state.cadence },
  ];

  return (
    <TemplateLayout
      title="KPI Definition Builder"
      description="Define a KPI with formula, source, owner, and cadence."
      audience="Product, data, and analytics teams."
      useCases={["Standardise KPI definitions.", "Share with stakeholders.", "Export for governance."]}
      instructions={["Name the metric.", "State formula and source.", "Assign owner and cadence.", "Export definition."]}
      outputTitle="KPI definition"
      outputSummary={`${state.metric}: ${state.formula}`}
      outputInterpretation="Ensure sources are authoritative and formulas reproducible."
      outputNextSteps={["Add to dashboards.", "Set targets.", "Review quarterly."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="data-kpi-definition-builder"
        title="KPI Definition Builder"
        category="Data"
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
          Metric
          <input
            type="text"
            value={state.metric}
            onChange={(e) => updateState((prev) => ({ ...prev, metric: e.target.value }))}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Owner
          <input
            type="text"
            value={state.owner}
            onChange={(e) => updateState((prev) => ({ ...prev, owner: e.target.value }))}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="text-sm font-semibold text-slate-900">
          Formula
          <textarea
            value={state.formula}
            onChange={(e) => updateState((prev) => ({ ...prev, formula: e.target.value }))}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Source
          <textarea
            value={state.source}
            onChange={(e) => updateState((prev) => ({ ...prev, source: e.target.value }))}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Cadence
          <input
            type="text"
            value={state.cadence}
            onChange={(e) => updateState((prev) => ({ ...prev, cadence: e.target.value }))}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="Weekly, Monthly"
          />
        </label>
      </div>
    </TemplateLayout>
  );
}

export function EncodingDetector() {
  const storageKey = "template-data-encoding-detector";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    sample: "Café\nRésumé\nASCII line",
  });

  const hints = useMemo(() => {
    const hasAccents = /[^\x00-\x7F]/.test(state.sample || "");
    const lines = (state.sample || "").split(/\r?\n/).filter(Boolean);
    const possible = [];
    if (hasAccents) possible.push("UTF-8 likely (non-ASCII characters detected).");
    if (!hasAccents) possible.push("ASCII-safe text detected.");
    if (lines.some((l) => /\uFFFD/.test(l))) possible.push("Replacement characters found; encoding mismatch suspected.");
    return possible;
  }, [state.sample]);

  const buildSections = () => [
    { heading: "Detection", body: hints.join(" ") },
    { heading: "Sample", body: state.sample.slice(0, 400) },
    { heading: "Fix guidance", body: "Prefer UTF-8; convert via iconv/iconv-lite; validate before ingest." },
  ];

  return (
    <TemplateLayout
      title="Encoding Detector and Fixer"
      description="Heuristics to spot ASCII vs UTF-8 issues and suggest safe fixes."
      audience="Data engineers and analysts."
      useCases={["Check small text snippets before ingest.", "Spot replacement characters.", "Share remediation steps."]}
      instructions={["Paste a small snippet (no secrets).", "Review detection and guidance.", "Export snapshot for teammates."]}
      outputTitle="Encoding hints"
      outputSummary={hints.join(" ")}
      outputInterpretation="Use full tooling (file command, chardet) for production; keep PII out of samples."
      outputNextSteps={["Convert to UTF-8 where possible.", "Strip or normalise accent issues.", "Re-validate after conversion."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="data-encoding-detector"
        title="Encoding Detector and Fixer"
        category="Data"
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

      <label className="text-sm font-semibold text-slate-900">
        Sample text (keep it non-sensitive)
        <textarea
          value={state.sample}
          onChange={(e) => updateState((prev) => ({ ...prev, sample: e.target.value }))}
          rows={6}
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
        />
      </label>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Hints</p>
        <List items={hints} />
      </div>
    </TemplateLayout>
  );
}

export function SchemaInferenceTool() {
  const storageKey = "template-data-schema-inference";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    sample: '{ "id": 1, "name": "Ada", "active": true }',
  });

  const inferred = useMemo(() => {
    try {
      const obj = JSON.parse(state.sample);
      if (Array.isArray(obj) && obj.length) {
        return Object.entries(obj[0]).map(([k, v]) => `${k}: ${typeof v}`);
      }
      if (typeof obj === "object" && obj) {
        return Object.entries(obj).map(([k, v]) => `${k}: ${typeof v}`);
      }
      return ["Provide a JSON object or array of objects."];
    } catch (err) {
      return ["Invalid JSON. Fix formatting and retry."];
    }
  }, [state.sample]);

  const buildSections = () => [
    { heading: "Sample", body: state.sample.slice(0, 400) },
    { heading: "Inferred schema", body: inferred.join("; ") },
    { heading: "Note", body: "Heuristic only. Use full validators for production." },
  ];

  return (
    <TemplateLayout
      title="Schema Inference Tool"
      description="Infer simple JSON schema hints from a small sample."
      audience="Data engineers and API designers."
      useCases={["Quickly inspect unknown payloads.", "Share inferred types.", "Plan validation rules."]}
      instructions={["Paste small JSON (no secrets).", "Review inferred fields.", "Export snapshot for teammates."]}
      outputTitle="Inferred schema"
      outputSummary={inferred.join(" ")}
      outputInterpretation="Use this as a starting point; add constraints and enums separately."
      outputNextSteps={["Author a full JSON Schema.", "Add validation in services.", "Capture samples in tests."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="data-schema-inference"
        title="Schema Inference Tool"
        category="Data"
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

      <label className="text-sm font-semibold text-slate-900">
        JSON sample
        <textarea
          value={state.sample}
          onChange={(e) => updateState((prev) => ({ ...prev, sample: e.target.value }))}
          rows={6}
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          placeholder='{ "id": 1, "name": "Ada" }'
        />
      </label>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Inferred</p>
        <List items={inferred} />
      </div>
    </TemplateLayout>
  );
}

export function OutlierExplorer() {
  const storageKey = "template-data-outlier-explorer";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    values: "10, 11, 9, 10, 50, 11, 10",
  });

  const stats = useMemo(() => {
    const nums = state.values
      .split(/[, \n]+/)
      .map((v) => Number(v))
      .filter((v) => !Number.isNaN(v));
    if (!nums.length) return { mean: 0, sd: 0, outliers: [] };
    const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
    const sd = Math.sqrt(nums.reduce((a, b) => a + (b - mean) ** 2, 0) / nums.length);
    const outliers = nums.filter((n) => Math.abs(n - mean) > 3 * (sd || 1));
    return { mean: Number(mean.toFixed(2)), sd: Number(sd.toFixed(2)), outliers };
  }, [state.values]);

  const buildSections = () => [
    { heading: "Mean", body: stats.mean },
    { heading: "Std dev", body: stats.sd },
    { heading: "Outliers (>3σ)", body: stats.outliers.join(", ") || "None" },
  ];

  return (
    <TemplateLayout
      title="Outlier Explorer"
      description="Simple robust z-score style check for numeric outliers."
      audience="Analysts and data engineers."
      useCases={["Scan small numeric samples.", "Spot extreme values.", "Share quick summary."]}
      instructions={["Paste numbers separated by commas or spaces.", "Review mean, std dev, and 3σ outliers.", "Export snapshot."]}
      outputTitle="Outlier summary"
      outputSummary={`Mean ${stats.mean}, sd ${stats.sd}, outliers ${stats.outliers.join(", ") || "none"}`}
      outputInterpretation="Use this as a hint; confirm with domain rules and robust methods for production."
      outputNextSteps={["Check data quality rules.", "Winsorize or investigate spikes.", "Align thresholds with stakeholders."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="data-outlier-explorer"
        title="Outlier Explorer"
        category="Data"
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

      <label className="text-sm font-semibold text-slate-900">
        Numeric values
        <textarea
          value={state.values}
          onChange={(e) => updateState((prev) => ({ ...prev, values: e.target.value }))}
          rows={4}
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
        />
      </label>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Outliers</p>
        <List items={stats.outliers.map((o) => `${o}`)} />
      </div>
    </TemplateLayout>
  );
}

export function MetadataCatalogue() {
  const storageKey = "template-data-metadata-catalogue";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    entries: "email: string, pii, owner=data\ncountry: string, refdata, owner=analytics",
  });

  const items = useMemo(() => state.entries.split(/\r?\n/).filter(Boolean), [state.entries]);

  const buildSections = () => [{ heading: "Fields", body: items.join("; ") }];

  return (
    <TemplateLayout
      title="Metadata Catalogue Stub"
      description="Capture dataset fields, owners, and refresh cadence for discovery."
      audience="Data stewards and engineers."
      useCases={["Draft metadata for a dataset.", "Share with requesters.", "Plan governance coverage."]}
      instructions={["List fields and attributes per line.", "Include owner and sensitivity.", "Export snapshot."]}
      outputTitle="Metadata"
      outputSummary={items.join(" ")}
      outputInterpretation="Use a real catalogue for production. Keep PII out of this tool."
      outputNextSteps={["Load into your catalogue.", "Add lineage and quality checks.", "Assign stewards."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="data-metadata-catalogue"
        title="Metadata Catalogue Stub"
        category="Data"
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

      <label className="text-sm font-semibold text-slate-900">
        Fields (one per line)
        <textarea
          value={state.entries}
          onChange={(e) => updateState((prev) => ({ ...prev, entries: e.target.value }))}
          rows={6}
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          placeholder="field: type, tags, owner"
        />
      </label>
    </TemplateLayout>
  );
}

export function LineageMapper() {
  const storageKey = "template-data-lineage-mapper";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    hops: "Source A -> Staging B\nStaging B -> Warehouse C\nWarehouse C -> Dashboard D",
  });

  const hops = useMemo(() => state.hops.split(/\r?\n/).filter(Boolean), [state.hops]);

  const buildSections = () => [{ heading: "Lineage", body: hops.join("; ") }];

  return (
    <TemplateLayout
      title="Lineage Mapper"
      description="Draw source-to-target hops in text for quick lineage sharing."
      audience="Data engineers and analysts."
      useCases={["Capture lineage before formal diagrams.", "Share flows with teams.", "Export for reviews."]}
      instructions={["List hops as Source -> Target per line.", "Keep systems named clearly.", "Export snapshot."]}
      outputTitle="Lineage"
      outputSummary={hops.join(" ")}
      outputInterpretation="Use this as a sketch; back it with automated lineage where possible."
      outputNextSteps={["Automate lineage collection.", "Add owners and SLAs.", "Validate against reality."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="data-lineage-mapper"
        title="Lineage Mapper"
        category="Data"
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

      <label className="text-sm font-semibold text-slate-900">
        Hops (one per line, use &quot;Source -&gt; Target&quot;)
        <textarea
          value={state.hops}
          onChange={(e) => updateState((prev) => ({ ...prev, hops: e.target.value }))}
          rows={6}
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
        />
      </label>
    </TemplateLayout>
  );
}

export function CsvToJsonConverter() {
  const storageKey = "template-data-csv-to-json";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    csv: "id,name\n1,Ada\n2,Grace",
  });

  const result = useMemo(() => {
    const lines = state.csv.trim().split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map((h) => h.trim());
    return lines.slice(1).map((line) => {
      const cols = line.split(",").map((c) => c.trim());
      const obj = {};
      headers.forEach((h, idx) => {
        obj[h] = cols[idx] || "";
      });
      return obj;
    });
  }, [state.csv]);

  const buildSections = () => [
    { heading: "CSV", body: state.csv.slice(0, 400) },
    { heading: "JSON", body: JSON.stringify(result, null, 2) },
  ];

  return (
    <TemplateLayout
      title="CSV to JSON Converter"
      description="Map columns to fields and preview JSON for small CSVs."
      audience="Analysts and engineers."
      useCases={["Quickly transform tiny CSVs.", "Validate column mapping.", "Share JSON previews."]}
      instructions={["Paste CSV (small).", "Review JSON preview.", "Export snapshot."]}
      outputTitle="JSON preview"
      outputSummary={`${result.length} rows converted`}
      outputInterpretation="For larger files use proper ETL; this is a small helper."
      outputNextSteps={["Validate schema.", "Handle types and nulls.", "Load into target system."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="data-csv-to-json"
        title="CSV to JSON Converter"
        category="Data"
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

      <label className="text-sm font-semibold text-slate-900">
        CSV
        <textarea
          value={state.csv}
          onChange={(e) => updateState((prev) => ({ ...prev, csv: e.target.value }))}
          rows={6}
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          placeholder="id,name\n1,Ada"
        />
      </label>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">JSON</p>
        <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-50 p-3 text-xs text-slate-800">{JSON.stringify(result, null, 2)}</pre>
      </div>
    </TemplateLayout>
  );
}

export function OpenApiSnippetBuilder() {
  const storageKey = "template-data-openapi-snippet";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    path: "/datasets/{id}",
    method: "get",
    summary: "Get dataset metadata",
    schema: '{ "id": "string", "name": "string" }',
  });

  const snippet = useMemo(
    () =>
      `paths:\n  ${state.path}:\n    ${state.method}:\n      summary: ${state.summary}\n      responses:\n        '200':\n          content:\n            application/json:\n              schema: ${state.schema}`,
    [state]
  );

  const buildSections = () => [{ heading: "Snippet", body: snippet }];

  return (
    <TemplateLayout
      title="OpenAPI Snippet Builder"
      description="Quickly draft an OpenAPI path snippet with response schema."
      audience="API designers and data platform teams."
      useCases={["Share endpoint drafts.", "Discuss contract changes.", "Export for tickets."]}
      instructions={["Set path, method, summary, and schema.", "Review snippet.", "Export."]}
      outputTitle="OpenAPI snippet"
      outputSummary={snippet}
      outputInterpretation="Treat as a starting point; validate with full OpenAPI tooling."
      outputNextSteps={["Add request bodies and auth.", "Validate schema.", "Publish to developer portal."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="data-openapi-snippet"
        title="OpenAPI Snippet Builder"
        category="Data"
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
          Path
          <input
            type="text"
            value={state.path}
            onChange={(e) => updateState((prev) => ({ ...prev, path: e.target.value }))}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Method
          <select
            value={state.method}
            onChange={(e) => updateState((prev) => ({ ...prev, method: e.target.value }))}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option>get</option>
            <option>post</option>
            <option>put</option>
            <option>delete</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-slate-900">
          Summary
          <input
            type="text"
            value={state.summary}
            onChange={(e) => updateState((prev) => ({ ...prev, summary: e.target.value }))}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Response schema (JSON)
          <textarea
            value={state.schema}
            onChange={(e) => updateState((prev) => ({ ...prev, schema: e.target.value }))}
            rows={4}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Snippet</p>
        <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-50 p-3 text-xs text-slate-800">{snippet}</pre>
      </div>
    </TemplateLayout>
  );
}

export function DpiaTriage() {
  const storageKey = "template-data-dpia-triage";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    description: "Customer analytics dataset with event logs.",
    dataSubjects: "Customers",
    specialCategories: "None",
    automatedDecisions: "No",
  });

  const riskFlag = useMemo(() => {
    const hasSpecial = /yes|y/i.test(state.specialCategories || "");
    const automated = /yes|y/i.test(state.automatedDecisions || "");
    return hasSpecial || automated ? "Likely DPIA required" : "DPIA may not be required, confirm with DPO";
  }, [state.specialCategories, state.automatedDecisions]);

  const buildSections = () => [
    { heading: "Description", body: state.description },
    { heading: "Data subjects", body: state.dataSubjects },
    { heading: "Special categories", body: state.specialCategories },
    { heading: "Automated decisions", body: state.automatedDecisions },
    { heading: "Triage", body: riskFlag },
  ];

  return (
    <TemplateLayout
      title="DPIA Style Risk Triage"
      description="Screen datasets for DPIA triggers, impacts, and mitigations."
      audience="Data protection and data teams."
      useCases={["Decide if a DPIA is needed.", "Capture quick privacy notes.", "Export for DPO review."]}
      instructions={["Describe dataset and subjects.", "Note special categories.", "Note automated decisions.", "Export triage."]}
      outputTitle="DPIA triage"
      outputSummary={riskFlag}
      outputInterpretation="This is a quick triage. Confirm requirements with privacy/legal before processing."
      outputNextSteps={["Contact DPO if flagged.", "Document purposes and retention.", "Review lawful basis."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="data-dpia-triage"
        title="DPIA Style Risk Triage"
        category="Data"
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
          Dataset description
          <textarea
            value={state.description}
            onChange={(e) => updateState((prev) => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Data subjects
          <input
            type="text"
            value={state.dataSubjects}
            onChange={(e) => updateState((prev) => ({ ...prev, dataSubjects: e.target.value }))}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-slate-900">
          Special categories?
          <input
            type="text"
            value={state.specialCategories}
            onChange={(e) => updateState((prev) => ({ ...prev, specialCategories: e.target.value }))}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="Yes/No and details"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Automated decisions?
          <input
            type="text"
            value={state.automatedDecisions}
            onChange={(e) => updateState((prev) => ({ ...prev, automatedDecisions: e.target.value }))}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="Yes/No and details"
          />
        </label>
      </div>
    </TemplateLayout>
  );
}

export function NormalisationCoach() {
  const storageKey = "template-data-normalisation-coach";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    table: "Orders(orderId, customerId, customerName, productName)",
    issues: "Repeating customerName, productName with each order line",
  });

  const steps = useMemo(
    () => [
      "1NF: Ensure atomic columns and primary key.",
      "2NF: Remove partial dependencies on composite keys.",
      "3NF: Remove transitive dependencies (e.g., productName -> productId ref).",
    ],
    []
  );

  const buildSections = () => [
    { heading: "Table", body: state.table },
    { heading: "Issues", body: state.issues },
    { heading: "Coaching steps", body: steps.join(" ") },
  ];

  return (
    <TemplateLayout
      title="Normalisation Coach"
      description="Work through 1NF, 2NF, and 3NF prompts on a sample table."
      audience="Data modelers and engineers."
      useCases={["Spot normalisation issues.", "Teach normalization steps.", "Export quick guidance."]}
      instructions={["Describe the table.", "List issues.", "Walk through 1NF-3NF prompts.", "Export notes."]}
      outputTitle="Normalisation prompts"
      outputSummary={steps.join(" ")}
      outputInterpretation="Use this as guidance; align with domain and performance needs."
      outputNextSteps={["Propose new schema.", "Review with team.", "Test queries post-change."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="data-normalisation-coach"
        title="Normalisation Coach"
        category="Data"
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
          Table description
          <textarea
            value={state.table}
            onChange={(e) => updateState((prev) => ({ ...prev, table: e.target.value }))}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Issues
          <textarea
            value={state.issues}
            onChange={(e) => updateState((prev) => ({ ...prev, issues: e.target.value }))}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
      </div>
    </TemplateLayout>
  );
}

export function DimensionalModelDesigner() {
  const storageKey = "template-data-dimensional-model-designer";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    facts: "Sales (sales_amount, quantity, order_date, customer_id, product_id)",
    dimensions: "Customer, Product, Date",
    scd: "Customer: Type 2 on address",
  });

  const buildSections = () => [
    { heading: "Facts", body: state.facts },
    { heading: "Dimensions", body: state.dimensions },
    { heading: "Slowly changing", body: state.scd },
  ];

  return (
    <TemplateLayout
      title="Dimensional Model Designer"
      description="Draft star schemas with facts, dimensions, and SCD notes."
      audience="Analytics engineers and BI teams."
      useCases={["Plan star schemas.", "Share design notes.", "Export for PRDs."]}
      instructions={["List fact tables and measures.", "List dimensions.", "Note SCD handling.", "Export snapshot."]}
      outputTitle="Star schema sketch"
      outputSummary={`${state.facts} | ${state.dimensions}`}
      outputInterpretation="Validate grain, keys, and SCD types with stakeholders."
      outputNextSteps={["Define grain and keys.", "Model in warehouse.", "Add tests and documentation."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="data-dimensional-model-designer"
        title="Dimensional Model Designer"
        category="Data"
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

      <div className="grid gap-4 md:grid-cols-3">
        <label className="text-sm font-semibold text-slate-900">
          Fact tables and measures
          <textarea
            value={state.facts}
            onChange={(e) => updateState((prev) => ({ ...prev, facts: e.target.value }))}
            rows={4}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Dimensions
          <textarea
            value={state.dimensions}
            onChange={(e) => updateState((prev) => ({ ...prev, dimensions: e.target.value }))}
            rows={4}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Slowly changing notes
          <textarea
            value={state.scd}
            onChange={(e) => updateState((prev) => ({ ...prev, scd: e.target.value }))}
            rows={4}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus-border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
      </div>
    </TemplateLayout>
  );
}

export function AnalyticsSandbox() {
  const storageKey = "template-data-analytics-sandbox";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    data: "category,value\nA,10\nB,15\nA,12",
  });

  const summary = useMemo(() => {
    const lines = state.data.trim().split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return { count: 0, categories: {} };
    const headers = lines[0].split(",");
    const catIdx = headers.findIndex((h) => h.toLowerCase() === "category");
    const valIdx = headers.findIndex((h) => h.toLowerCase() === "value");
    if (catIdx === -1 || valIdx === -1) return { count: 0, categories: {} };
    const categories = {};
    lines.slice(1).forEach((line) => {
      const cols = line.split(",");
      const cat = cols[catIdx] || "unknown";
      const val = Number(cols[valIdx]) || 0;
      categories[cat] = (categories[cat] || 0) + val;
    });
    return { count: lines.length - 1, categories };
  }, [state.data]);

  const buildSections = () => [
    { heading: "Rows", body: `${summary.count}` },
    { heading: "Totals by category", body: Object.entries(summary.categories).map(([k, v]) => `${k}: ${v}`).join("; ") },
  ];

  return (
    <TemplateLayout
      title="Basic Analytics Sandbox"
      description="Load a tiny CSV and see quick grouped totals."
      audience="Analysts and product teams."
      useCases={["Do a fast sense check.", "Share quick totals.", "Export snapshot for decisions."]}
      instructions={["Paste small CSV with category,value columns.", "Review grouped totals.", "Export snapshot."]}
      outputTitle="Grouped totals"
      outputSummary={Object.entries(summary.categories)
        .map(([k, v]) => `${k}:${v}`)
        .join(" ")}
      outputInterpretation="Use this for tiny samples only; move to BI/SQL for production."
      outputNextSteps={["Validate data types.", "Create proper dashboards.", "Add filters and breakdowns as needed."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="data-analytics-sandbox"
        title="Basic Analytics Sandbox"
        category="Data"
        version="1.0.0"
        attributionText={attribution}
        prepareSections={buildSections}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-medium text-slate-700">Autosaves locally. Last updated: {formatTimestamp(lastUpdated)}</p>
        <button
          type="button"
          onClick={resetState}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover-border-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Reset
        </button>
      </div>

      <label className="text-sm font-semibold text-slate-900">
        CSV (category,value)
        <textarea
          value={state.data}
          onChange={(e) => updateState((prev) => ({ ...prev, data: e.target.value }))}
          rows={6}
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
        />
      </label>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Totals</p>
        <List items={Object.entries(summary.categories).map(([k, v]) => `${k}: ${v}`)} />
      </div>
    </TemplateLayout>
  );
}

export const dataToolComponents = {
  "data-file-format-inspector": DataFormatInspector,
  "data-encoding-detector": EncodingDetector,
  "data-schema-inference": SchemaInferenceTool,
  "data-profiling-dashboard": DataProfilingDashboard,
  "data-quality-rules-builder": DataQualityRulesBuilder,
  "data-dictionary-generator": DataDictionaryGenerator,
  "data-api-payload-validator": ApiPayloadValidator,
  "data-raci-builder": DataRaciBuilder,
  "data-classification-helper": DataClassificationHelper,
  "data-outlier-explorer": OutlierExplorer,
  "data-metadata-catalogue": MetadataCatalogue,
  "data-lineage-mapper": LineageMapper,
  "data-csv-to-json": CsvToJsonConverter,
  "data-openapi-snippet": OpenApiSnippetBuilder,
  "data-dpia-triage": DpiaTriage,
  "data-normalisation-coach": NormalisationCoach,
  "data-dimensional-model-designer": DimensionalModelDesigner,
  "data-analytics-sandbox": AnalyticsSandbox,
  "data-entity-relationship-diagram": EntityRelationshipDiagramBuilder,
  "data-kpi-definition-builder": KpiDefinitionBuilder,
};
