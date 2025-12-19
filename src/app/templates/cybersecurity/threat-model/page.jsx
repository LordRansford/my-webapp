"use client";

import { useMemo } from "react";
import TemplateLayout from "@/components/templates/TemplateLayout";
import TemplateExportPanel from "@/components/templates/TemplateExportPanel";
import { useTemplateState } from "@/hooks/useTemplateState";

const storageKey = "template-cyber-threat-model-v1";
const templateVersion = "1.0.0";
const templateCategory = "Cybersecurity";
const attributionText =
  "Created by Ransford for Ransfords Notes. Internal use allowed. Commercial use requires visible attribution. Downloads will be gated in the next stage.";

const defaultState = {
  assets: "Customer data lake\nAuthentication service\nAdmin console\nCI/CD pipeline",
  threatActors: "External attacker\nDisgruntled insider\nThird-party integrator\nScript kiddie",
  entryPoints: "Public web app login\nAPI gateway\nAdmin VPN\nCI/CD webhook",
  trustBoundaries: "Internet to edge/WAF\nEdge to app services\nApp services to data stores\nCI/CD to runtime",
  mitigations: "MFA on admin paths\nWAF with managed rules\nLeast privilege for service accounts\nSigned releases",
};

const formatTimestamp = (iso) => {
  if (!iso) return "Not saved yet";
  try {
    return new Date(iso).toLocaleString();
  } catch (error) {
    return iso;
  }
};

const toList = (value) =>
  (value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

function CanvasCard({ id, label, hint, value, onChange }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
      <label htmlFor={id} className="text-sm font-semibold text-slate-900">
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        rows={4}
        className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
      />
      <p className="text-xs text-slate-600">{hint}</p>
    </div>
  );
}

export default function ThreatModelPage() {
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, defaultState);

  const updateField = (field) => (event) => {
    updateState((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const lists = useMemo(
    () => ({
      assets: toList(state.assets),
      threatActors: toList(state.threatActors),
      entryPoints: toList(state.entryPoints),
      trustBoundaries: toList(state.trustBoundaries),
      mitigations: toList(state.mitigations),
    }),
    [state.assets, state.entryPoints, state.mitigations, state.threatActors, state.trustBoundaries]
  );

  const summaryPoints = useMemo(() => {
    const keyAsset = lists.assets[0] || "key asset";
    const topThreat = lists.threatActors[0] || "threat actor";
    const entry = lists.entryPoints[0] || "entry point";
    const boundary = lists.trustBoundaries[0] || "trust boundary";
    const mitigation = lists.mitigations[0] || "mitigation";

    return [
      `Protect ${keyAsset} against ${topThreat}.`,
      `Watch the entry point: ${entry}.`,
      `Validate controls at the ${boundary} boundary.`,
      `Primary mitigation in place: ${mitigation}.`,
    ];
  }, [lists.assets, lists.entryPoints, lists.mitigations, lists.threatActors, lists.trustBoundaries]);

  const buildSections = () => [
    { heading: "Assets and value", body: state.assets },
    { heading: "Threat actors", body: state.threatActors },
    { heading: "Entry points", body: state.entryPoints },
    { heading: "Trust boundaries", body: state.trustBoundaries },
    { heading: "Mitigations and owners", body: state.mitigations },
    { heading: "Auto-summary", body: summaryPoints.join(" ") },
  ];

  return (
    <TemplateLayout
      title="Threat Modelling Canvas"
      description="Map assets, actors, entry points, and trust boundaries with a concise summary to brief stakeholders."
      audience="Security architects, product/security partners, platform engineers."
      useCases={[
        "Run lightweight threat modelling on new features.",
        "Document boundaries and assumptions before a pen test.",
        "Align teams on mitigations and ownership.",
      ]}
      instructions={[
        "List assets and their value.",
        "Capture threat actors and likely entry points.",
        "Describe key trust boundaries and the controls in place.",
        "Record mitigations and owners; review the auto-summary.",
      ]}
      outputTitle="Canvas summary"
      outputSummary={summaryPoints.join(" ")}
      outputInterpretation="Use this summary to brief teams and log assumptions. Expand to a full STRIDE or attack tree if risk is high."
      outputNextSteps={[
        "Validate mitigations against the riskiest entry point.",
        "Assign owners and due dates for control gaps.",
        "Schedule a review after major architectural changes.",
      ]}
      attributionText={attributionText}
      version={templateVersion}
    >
      <TemplateExportPanel
        templateId="cyber-threat-model"
        title="Threat Modelling Canvas"
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
        <CanvasCard
          id="assets"
          label="Assets and value"
          hint="List the assets and why they matter (data sensitivity, availability needs). One per line."
          value={state.assets}
          onChange={updateField("assets")}
        />
        <CanvasCard
          id="threatActors"
          label="Threat actors"
          hint="Name specific adversaries or profiles (insider, partner, commodity attacker)."
          value={state.threatActors}
          onChange={updateField("threatActors")}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <CanvasCard
          id="entryPoints"
          label="Entry points"
          hint="Where can the actor start? Web, API, physical, CI/CD, credentials, supply chain. One per line."
          value={state.entryPoints}
          onChange={updateField("entryPoints")}
        />
        <CanvasCard
          id="trustBoundaries"
          label="Trust boundaries"
          hint="Boundary crossings and expected controls (authn/z, rate limiting, validation, isolation)."
          value={state.trustBoundaries}
          onChange={updateField("trustBoundaries")}
        />
      </div>

      <CanvasCard
        id="mitigations"
        label="Mitigations and owners"
        hint="Current or planned mitigations with owners. Note coverage and any gaps that need review."
        value={state.mitigations}
        onChange={updateField("mitigations")}
      />

      <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-5 shadow-sm" aria-live="polite" role="status">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Auto-generated summary</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-800">
          {summaryPoints.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </div>
    </TemplateLayout>
  );
}
