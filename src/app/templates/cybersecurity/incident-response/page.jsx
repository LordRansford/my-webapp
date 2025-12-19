"use client";

import { useMemo } from "react";
import TemplateLayout from "@/components/templates/TemplateLayout";
import TemplateExportPanel from "@/components/templates/TemplateExportPanel";
import { useTemplateState } from "@/hooks/useTemplateState";

const storageKey = "template-incident-response-v1";
const templateVersion = "1.0.0";
const templateCategory = "Cybersecurity";
const attributionText =
  "Created by Ransford for Ransfords Notes. Internal use allowed. Commercial use requires visible attribution. Downloads will be gated in the next stage.";

const defaultState = {
  detection: "SIEM alerts triaged within 15 minutes; on-call rotation active; playbooks in pager app.",
  containment: "Isolate affected hosts via EDR; block indicators at firewall/WAF; rotate exposed credentials.",
  eradication: "Remove malicious persistence; patch vulnerable services; validate configs via IaC.",
  recovery: "Restore from clean backups; phased traffic cutover; run smoke tests; monitor for reoccurrence.",
  lessons: "Capture timeline within 24 hours; update runbooks; backlog follow-up actions with owners.",
};

const steps = [
  { key: "detection", title: "Detection", hint: "How is the incident spotted? Alert sources, roles, and initial triage steps." },
  {
    key: "containment",
    title: "Containment",
    hint: "Immediate actions to stop spread or further harm. Network, identity, and access changes.",
  },
  {
    key: "eradication",
    title: "Eradication",
    hint: "Remove the root cause and ensure systems are clean. Consider persistence and backdoors.",
  },
  { key: "recovery", title: "Recovery", hint: "Restore service safely. Validation, traffic ramp-up, and communications." },
  {
    key: "lessons",
    title: "Lessons learned",
    hint: "What will you change? Controls, training, architecture, or processes.",
  },
];

const formatTimestamp = (iso) => {
  if (!iso) return "Not saved yet";
  try {
    return new Date(iso).toLocaleString();
  } catch (error) {
    return iso;
  }
};

export default function IncidentResponsePlannerPage() {
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, defaultState);

  const missingSections = useMemo(
    () => steps.filter((step) => !String(state[step.key] || "").trim()).map((step) => step.title),
    [state]
  );

  const updateField = (field) => (event) => {
    updateState((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const outputSummary =
    missingSections.length === 0
      ? "Incident response plan is complete across detection, containment, eradication, recovery, and lessons."
      : `Missing content in: ${missingSections.join(", ")}. Fill these before circulating the plan.`;

  const outputInterpretation =
    missingSections.length === 0
      ? "Use this plan for tabletop exercises and during real incidents. Keep owners current and rehearse quarterly."
      : "Resolve the gaps, confirm ownership, and rerun a short review. Gaps increase risk during a live incident.";

  const outputNextSteps = [
    "Share with on-call leads and service owners.",
    "Link to runbooks and checklists referenced here.",
    "Schedule a tabletop exercise to validate the plan.",
  ];

  const buildSections = () => [
    { heading: "Detection", body: state.detection },
    { heading: "Containment", body: state.containment },
    { heading: "Eradication", body: state.eradication },
    { heading: "Recovery", body: state.recovery },
    { heading: "Lessons learned", body: state.lessons },
    { heading: "Readiness summary", body: `${outputSummary} ${outputInterpretation}` },
  ];

  return (
    <TemplateLayout
      title="Incident Response Planner"
      description="Timeline-style incident response plan you can rehearse and reuse. Highlights missing sections automatically."
      audience="Incident managers, SRE/on-call leads, security responders."
      useCases={[
        "Prepare for tabletop exercises.",
        "Capture the go-to plan for a specific system or product.",
        "Highlight ownership gaps before an incident.",
      ]}
      instructions={[
        "Draft each phase in order: detection -> containment -> eradication -> recovery -> lessons.",
        "Keep each entry action-oriented and name responsible roles.",
        "Use Reset to clear the plan between exercises; autosave keeps drafts between visits.",
        "Review the missing sections panel before considering the plan ready.",
      ]}
      outputTitle="Readiness summary"
      outputSummary={outputSummary}
      outputInterpretation={outputInterpretation}
      outputNextSteps={outputNextSteps}
      attributionText={attributionText}
      version={templateVersion}
    >
      <TemplateExportPanel
        templateId="incident-response-planner"
        title="Incident Response Planner"
        category={templateCategory}
        version={templateVersion}
        attributionText={attributionText}
        prepareSections={buildSections}
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-medium text-slate-700">Autosaves locally. Last updated: {formatTimestamp(lastUpdated)}</p>
        <button
          type="button"
          onClick={resetState}
          className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Reset template
        </button>
      </div>

      {missingSections.length > 0 ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900" role="alert">
          <p className="font-semibold">Incomplete sections</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {missingSections.map((section) => (
              <li key={section}>{section}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900" role="status">
          All sections filled. Keep owners and contacts up to date.
        </div>
      )}

      <div className="relative rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <div className="absolute left-5 top-10 bottom-10 w-px bg-slate-200" aria-hidden="true" />
        <div className="space-y-6">
          {steps.map((step, index) => {
            const value = state[step.key] || "";
            const isEmpty = !value.trim();
            return (
              <div key={step.key} className="relative pl-10">
                <div
                  className={`absolute left-2 top-1 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white shadow ${
                    isEmpty ? "bg-slate-400" : "bg-slate-900"
                  }`}
                  aria-hidden="true"
                >
                  {index + 1}
                </div>
                <div
                  className={`rounded-2xl border p-4 shadow-sm ${
                    isEmpty ? "border-amber-200 bg-amber-50/80" : "border-slate-200 bg-slate-50/80"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-semibold text-slate-900">{step.title}</h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                        isEmpty ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-900"
                      }`}
                    >
                      {isEmpty ? "Needs detail" : "Ready"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">{step.hint}</p>
                  <textarea
                    id={step.key}
                    name={step.key}
                    value={value}
                    onChange={updateField(step.key)}
                    rows={3}
                    className="mt-3 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </TemplateLayout>
  );
}
