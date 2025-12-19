"use client";

import TemplateLayout from "@/components/templates/TemplateLayout";
import TemplateExportPanel from "@/components/templates/TemplateExportPanel";
import { useTemplateState } from "@/hooks/useTemplateState";

export default function GenericMvpTool({ entry }) {
  const storageKey = `template-${entry.id}`;
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    notes: "",
    findings: "",
    actions: "",
  });

  const buildSections = () => [
    { heading: "Notes", body: state.notes || "No notes yet." },
    { heading: "Findings", body: state.findings || "No findings yet." },
    { heading: "Actions", body: state.actions || "No actions captured." },
  ];

  return (
    <TemplateLayout
      title={entry.title}
      description={entry.description}
      audience="Practitioners and teams using this tool as a quick-start template."
      useCases={[
        "Capture quick notes and findings.",
        "Record actions and owners before export.",
        "Share a consistent snapshot across teams.",
      ]}
      instructions={["Add notes and findings.", "Capture next actions.", "Export or share with your team."]}
      outputTitle="Summary"
      outputSummary={state.findings || "Add findings to summarise what you learned."}
      outputInterpretation="Use this as a lightweight, structured record. Add more detail for deep reviews."
      outputNextSteps={["Export for sharing.", "Assign owners to actions.", "Schedule a follow-up review."]}
      attributionText="Created by Ransford for Ransfords Notes. Internal use allowed. Commercial use requires visible attribution."
    >
      <TemplateExportPanel
        templateId={entry.id}
        title={entry.title}
        category={entry.category}
        version="1.0.0"
        attributionText="Created by Ransford for Ransfords Notes. Internal use allowed. Commercial use requires visible attribution."
        prepareSections={buildSections}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-medium text-slate-700">Autosaves locally. Last updated: {lastUpdated || "Not saved yet"}</p>
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
          Notes
          <textarea
            value={state.notes}
            onChange={(e) => updateState((prev) => ({ ...prev, notes: e.target.value }))}
            rows={4}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="Context, scope, assumptions..."
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Findings
          <textarea
            value={state.findings}
            onChange={(e) => updateState((prev) => ({ ...prev, findings: e.target.value }))}
            rows={4}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="Key observations, risks, wins..."
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Actions
          <textarea
            value={state.actions}
            onChange={(e) => updateState((prev) => ({ ...prev, actions: e.target.value }))}
            rows={4}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="Owners, deadlines, next steps..."
          />
        </label>
      </div>
    </TemplateLayout>
  );
}
