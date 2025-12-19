"use client";

import { useMemo } from "react";
import TemplateLayout from "@/components/templates/TemplateLayout";
import TemplateExportPanel from "@/components/templates/TemplateExportPanel";
import { useTemplateState } from "@/hooks/useTemplateState";

const storageKey = "template-cyber-risk-assessment-v1";
const templateVersion = "1.0.0";
const templateCategory = "Cybersecurity";
const attributionText =
  "Created by Ransford for Ransfords Notes. Internal use allowed. Commercial use requires visible attribution. Downloads will be gated in the next stage.";

const defaultState = {
  likelihood: 3,
  impact: 3,
  context: "Customer data platform handling authentication and billing.",
  keyAssets: "Customer data, auth service, billing provider, admin console.",
  threatNotes: "Phishing against admins; credential stuffing; supply chain on dependencies.",
  mitigations: "MFA on admin; rate limiting; dependency checks; privileged access reviews.",
};

const riskLevels = [
  { id: "low", label: "Low", maxScore: 8, color: "bg-emerald-50 text-emerald-900 border-emerald-200" },
  { id: "medium", label: "Medium", maxScore: 15, color: "bg-amber-50 text-amber-900 border-amber-200" },
  { id: "high", label: "High", maxScore: 25, color: "bg-rose-50 text-rose-900 border-rose-200" },
];

const formatTimestamp = (iso) => {
  if (!iso) return "Not saved yet";
  try {
    return new Date(iso).toLocaleString();
  } catch (error) {
    return iso;
  }
};

const getRiskLevel = (score) => riskLevels.find((level) => score <= level.maxScore) || riskLevels[riskLevels.length - 1];

export default function CyberRiskAssessmentPage() {
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, defaultState);
  const { likelihood, impact, context, keyAssets, threatNotes, mitigations } = state;

  const riskScore = useMemo(() => Number(likelihood) * Number(impact), [likelihood, impact]);
  const riskLevel = useMemo(() => getRiskLevel(riskScore), [riskScore]);

  const outputSummary = `Risk score ${riskScore}/25 (${riskLevel.label}). Likelihood ${likelihood}/5, impact ${impact}/5.`;
  const outputInterpretation =
    riskLevel.id === "high"
      ? "High risk: immediate mitigation and executive visibility required. Validate controls and owners this week."
      : riskLevel.id === "medium"
        ? "Medium risk: confirm compensating controls, monitor drift, and schedule a mitigation checkpoint."
        : "Low risk: maintain controls and monitor for change in exposure or threat landscape.";
  const outputNextSteps = [
    "Document the scenario and control owners.",
    "Track mitigation actions with due dates.",
    "Re-run this assessment when architecture, data sensitivity, or threat intel changes.",
  ];

  const buildSections = () => [
    {
      heading: "Scenario",
      body: context,
    },
    {
      heading: "Key assets and exposure",
      body: keyAssets,
    },
    {
      heading: "Threats and assumptions",
      body: threatNotes,
    },
    {
      heading: "Mitigations and owners",
      body: mitigations,
    },
    {
      heading: "Risk score",
      body: `${outputSummary} ${outputInterpretation}`,
    },
  ];

  const handleSliderChange = (field) => (event) => {
    updateState((prev) => ({ ...prev, [field]: Number(event.target.value) }));
  };

  const handleTextChange = (field) => (event) => {
    updateState((prev) => ({ ...prev, [field]: event.target.value }));
  };

  return (
    <TemplateLayout
      title="Cyber Risk Assessment Tool"
      description="Score likelihood and impact, see the colour-coded risk, and capture mitigation intent for the scenario."
      audience="Security leads, risk owners, product/security partnership teams."
      useCases={[
        "Assess product or feature changes before launch.",
        "Quantify risk for steering committees or architecture boards.",
        "Track mitigation progress between security and delivery teams.",
      ]}
      instructions={[
        "Describe the scenario and assets at stake.",
        "Set likelihood and impact on the sliders (1-5).",
        "Capture threats and mitigations in the workspace.",
        "Review the colour-coded risk and share next steps.",
      ]}
      outputTitle="Risk interpretation"
      outputSummary={outputSummary}
      outputInterpretation={outputInterpretation}
      outputNextSteps={outputNextSteps}
      attributionText={attributionText}
      version={templateVersion}
    >
      <TemplateExportPanel
        templateId="cyber-risk-assessment"
        title="Cyber Risk Assessment Tool"
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

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <label className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">Likelihood (1-5)</span>
              <span className="text-sm font-medium text-slate-700">{likelihood}</span>
            </div>
            <input
              id="likelihood-slider"
              name="likelihood"
              type="range"
              min="1"
              max="5"
              step="1"
              value={likelihood}
              onChange={handleSliderChange("likelihood")}
              aria-describedby="likelihood-hint"
              className="accent-slate-900"
            />
            <span id="likelihood-hint" className="text-xs text-slate-600">
              1 = rare, 5 = almost certain. Use your best estimate backed by evidence.
            </span>
          </label>

          <label className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">Impact (1-5)</span>
              <span className="text-sm font-medium text-slate-700">{impact}</span>
            </div>
            <input
              id="impact-slider"
              name="impact"
              type="range"
              min="1"
              max="5"
              step="1"
              value={impact}
              onChange={handleSliderChange("impact")}
              aria-describedby="impact-hint"
              className="accent-slate-900"
            />
            <span id="impact-hint" className="text-xs text-slate-600">
              1 = negligible, 5 = catastrophic. Anchor this to business, regulatory, and customer impact.
            </span>
          </label>
        </div>

        <div
          className={`flex flex-col gap-3 rounded-2xl border p-5 shadow-sm ${riskLevel.color}`}
          aria-live="polite"
          role="status"
        >
          <p className="text-sm font-semibold uppercase tracking-wide">{riskLevel.label} risk</p>
          <p className="text-3xl font-bold leading-tight">
            {riskScore}/25 <span className="text-base font-semibold">score</span>
          </p>
          <p className="text-sm">
            Combine this score with control effectiveness and threat intelligence before finalising your decision. Capture
            mitigations below to shift likelihood or impact.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <label htmlFor="context" className="text-sm font-semibold text-slate-900">
            Scenario / context
          </label>
          <textarea
            id="context"
            name="context"
            value={context}
            onChange={handleTextChange("context")}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
          <p className="mt-2 text-xs text-slate-600">What system, data, or change are you assessing?</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <label htmlFor="keyAssets" className="text-sm font-semibold text-slate-900">
            Key assets and exposure
          </label>
          <textarea
            id="keyAssets"
            name="keyAssets"
            value={keyAssets}
            onChange={handleTextChange("keyAssets")}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
          <p className="mt-2 text-xs text-slate-600">List the assets, data classifications, and exposure (internet/internal).</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <label htmlFor="threatNotes" className="text-sm font-semibold text-slate-900">
            Threats and assumptions
          </label>
          <textarea
            id="threatNotes"
            name="threatNotes"
            value={threatNotes}
            onChange={handleTextChange("threatNotes")}
            rows={4}
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
          <p className="mt-2 text-xs text-slate-600">Note the threat actors, likely techniques, and any assumptions you rely on.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <label htmlFor="mitigations" className="text-sm font-semibold text-slate-900">
            Mitigations and owners
          </label>
          <textarea
            id="mitigations"
            name="mitigations"
            value={mitigations}
            onChange={handleTextChange("mitigations")}
            rows={4}
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
          <p className="mt-2 text-xs text-slate-600">List controls, owners, and timelines that change likelihood or impact.</p>
        </div>
      </div>
    </TemplateLayout>
  );
}
