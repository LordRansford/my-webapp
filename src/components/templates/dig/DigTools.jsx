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

export function DigitalStrategyCanvas() {
  const storageKey = "template-dig-digital-strategy-canvas";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    vision: "Trusted digital services that are simple and secure.",
    outcomes: "Higher adoption; faster cycle time; better data quality.",
    enablers: "Funding, talent, platform, data governance.",
    risks: "Legacy coupling; skills gaps; funding delays.",
  });

  const summary = useMemo(
    () => [`Vision: ${state.vision}`, `Outcomes: ${state.outcomes}`, `Enablers: ${state.enablers}`, `Risks: ${state.risks}`],
    [state]
  );

  const buildSections = () => [
    { heading: "Vision", body: state.vision },
    { heading: "Outcomes", body: state.outcomes },
    { heading: "Enablers", body: state.enablers },
    { heading: "Risks", body: state.risks },
  ];

  return (
    <TemplateLayout
      title="Digital Strategy Canvas"
      description="Lay out vision, outcomes, enablers, and risks on a concise canvas."
      audience="Digital leaders and programme teams."
      useCases={["Kick off digital strategy.", "Align stakeholders.", "Export a one-page canvas."]}
      instructions={["Capture vision and outcomes.", "List enablers and risks.", "Review with stakeholders.", "Export for sharing."]}
      outputTitle="Strategy canvas"
      outputSummary={summary.join(" ")}
      outputInterpretation="Use this as a living canvas; refine as decisions land."
      outputNextSteps={["Attach benefits and KPIs.", "Sequence enablers on roadmap.", "Review monthly."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="dig-digital-strategy-canvas"
        title="Digital Strategy Canvas"
        category="Digitalisation"
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
          Vision
          <textarea
            value={state.vision}
            onChange={(e) => updateState((prev) => ({ ...prev, vision: e.target.value }))}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Outcomes
          <textarea
            value={state.outcomes}
            onChange={(e) => updateState((prev) => ({ ...prev, outcomes: e.target.value }))}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-slate-900">
          Enablers
          <textarea
            value={state.enablers}
            onChange={(e) => updateState((prev) => ({ ...prev, enablers: e.target.value }))}
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
      </div>
    </TemplateLayout>
  );
}

export function BenefitsTracker() {
  const storageKey = "template-dig-benefits-tracker";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    items: "Cycle time down 20% | Owner: Eng Lead | Baseline: 10d | Target: 8d\nCSAT +5 points | Owner: CX Lead | Baseline: 70 | Target: 75",
  });

  const parsed = useMemo(() => state.items.split(/\r?\n/).filter(Boolean), [state.items]);

  const buildSections = () => [{ heading: "Benefits", body: parsed.join("; ") }];

  return (
    <TemplateLayout
      title="Benefits Realisation Tracker"
      description="Track benefits with owners, baselines, targets, and quick exports."
      audience="Programme managers and sponsors."
      useCases={["Track benefits for reviews.", "Share status updates.", "Export to spreadsheet or PDF."]}
      instructions={["List benefits with owner, baseline, target.", "Keep items small and testable.", "Export for reviews."]}
      outputTitle="Benefits"
      outputSummary={parsed.join(" ")}
      outputInterpretation="Keep owners accountable and revisit baselines after major changes."
      outputNextSteps={["Add measures to dashboards.", "Schedule monthly checks.", "Update targets as needed."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="dig-benefits-tracker"
        title="Benefits Realisation Tracker"
        category="Digitalisation"
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
        Benefits (one per line)
        <textarea
          value={state.items}
          onChange={(e) => updateState((prev) => ({ ...prev, items: e.target.value }))}
          rows={6}
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          placeholder="Outcome | Owner | Baseline | Target"
        />
      </label>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Benefit lines</p>
        <List items={parsed} />
      </div>
    </TemplateLayout>
  );
}

export function CapabilityMaturityAssessment() {
  const storageKey = "template-dig-capability-maturity";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    capability: "Data governance",
    level: "2 - Emerging",
    strengths: "Policies exist; some ownership.",
    gaps: "Tooling gaps; limited automation.",
    nextSteps: "Define controls per domain; add audits.",
  });

  const buildSections = () => [
    { heading: "Capability", body: state.capability },
    { heading: "Level", body: state.level },
    { heading: "Strengths", body: state.strengths },
    { heading: "Gaps", body: state.gaps },
    { heading: "Next steps", body: state.nextSteps },
  ];

  return (
    <TemplateLayout
      title="Capability Maturity Assessment"
      description="Score a capability and capture strengths, gaps, and next steps."
      audience="Transformation and capability owners."
      useCases={["Assess capability health.", "Agree next steps.", "Export for governance packs."]}
      instructions={["Pick capability and level.", "Note strengths and gaps.", "Add next steps.", "Export."]}
      outputTitle="Maturity snapshot"
      outputSummary={`${state.capability}: ${state.level}`}
      outputInterpretation="Use consistent scales. Reassess after key changes."
      outputNextSteps={["Set owners and timelines.", "Fund critical gaps.", "Track progress quarterly."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="dig-capability-maturity"
        title="Capability Maturity Assessment"
        category="Digitalisation"
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
          Capability
          <input
            type="text"
            value={state.capability}
            onChange={(e) => updateState((prev) => ({ ...prev, capability: e.target.value }))}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Level
          <select
            value={state.level}
            onChange={(e) => updateState((prev) => ({ ...prev, level: e.target.value }))}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option>1 - Initial</option>
            <option>2 - Emerging</option>
            <option>3 - Defined</option>
            <option>4 - Managed</option>
            <option>5 - Optimizing</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="text-sm font-semibold text-slate-900">
          Strengths
          <textarea
            value={state.strengths}
            onChange={(e) => updateState((prev) => ({ ...prev, strengths: e.target.value }))}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Gaps
          <textarea
            value={state.gaps}
            onChange={(e) => updateState((prev) => ({ ...prev, gaps: e.target.value }))}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Next steps
          <textarea
            value={state.nextSteps}
            onChange={(e) => updateState((prev) => ({ ...prev, nextSteps: e.target.value }))}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
      </div>
    </TemplateLayout>
  );
}

export function RiskRegisterBuilder() {
  const storageKey = "template-dig-risk-register";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    risks: "Legacy migration delay | Likelihood: Medium | Impact: High | Owner: CTO",
  });

  const lines = useMemo(() => state.risks.split(/\r?\n/).filter(Boolean), [state.risks]);

  const buildSections = () => [{ heading: "Risks", body: lines.join("; ") }];

  return (
    <TemplateLayout
      title="Risk Register Builder"
      description="Capture risks, likelihood, impact, owners, and mitigations for digital change."
      audience="Programme and risk owners."
      useCases={["Maintain a lightweight register.", "Share updates with sponsors.", "Export for governance packs."]}
      instructions={["List risks with likelihood, impact, owner.", "Keep concise.", "Export and review regularly."]}
      outputTitle="Risk register"
      outputSummary={lines.join(" ")}
      outputInterpretation="Sort by impact and likelihood. Track owners and mitigations explicitly."
      outputNextSteps={["Add mitigations and dates.", "Link to delivery plan.", "Review monthly."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="dig-risk-register"
        title="Risk Register Builder"
        category="Digitalisation"
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
        Risks (one per line)
        <textarea
          value={state.risks}
          onChange={(e) => updateState((prev) => ({ ...prev, risks: e.target.value }))}
          rows={6}
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          placeholder="Risk | Likelihood | Impact | Owner"
        />
      </label>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Risk items</p>
        <List items={lines} />
      </div>
    </TemplateLayout>
  );
}

export function InteroperabilityChecklist() {
  const storageKey = "template-dig-interoperability-checklist";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    standards: "OpenAPI for APIs; OAuth2 for auth; JSON with UTF-8",
    testing: "Contract tests per consumer; mock servers; conformance checks",
    governance: "Versioning policy; deprecation plan; owner per domain",
  });

  const checklist = useMemo(
    () => [
      `Standards: ${state.standards}`,
      `Testing: ${state.testing}`,
      `Governance: ${state.governance}`,
    ],
    [state]
  );

  const buildSections = () => [
    { heading: "Standards", body: state.standards },
    { heading: "Testing", body: state.testing },
    { heading: "Governance", body: state.governance },
  ];

  return (
    <TemplateLayout
      title="Interoperability Checklist"
      description="Checklist for standards, APIs, semantics, and testing."
      audience="Digital and integration teams."
      useCases={["Define interoperability rules.", "Share with suppliers.", "Export for onboarding packs."]}
      instructions={["Capture standards, testing, and governance.", "Confirm with teams and suppliers.", "Export for distribution."]}
      outputTitle="Checklist"
      outputSummary={checklist.join(" ")}
      outputInterpretation="Keep the checklist lean; link to detailed playbooks."
      outputNextSteps={["Publish internally.", "Align with suppliers.", "Add validation steps in CI."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="dig-interoperability-checklist"
        title="Interoperability Checklist"
        category="Digitalisation"
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
          Standards
          <textarea
            value={state.standards}
            onChange={(e) => updateState((prev) => ({ ...prev, standards: e.target.value }))}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Testing
          <textarea
            value={state.testing}
            onChange={(e) => updateState((prev) => ({ ...prev, testing: e.target.value }))}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Governance
          <textarea
            value={state.governance}
            onChange={(e) => updateState((prev) => ({ ...prev, governance: e.target.value }))}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
      </div>
    </TemplateLayout>
  );
}

export function RoadmapBuilder() {
  const storageKey = "template-dig-roadmap-builder";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    milestones: "Q1: Discovery; Q2: Platform foundation; Q3: First product; Q4: Expansion",
    risks: "Dependency on vendor; hiring lag",
  });

  const buildSections = () => [
    { heading: "Milestones", body: state.milestones },
    { heading: "Risks", body: state.risks },
  ];

  return (
    <TemplateLayout
      title="Roadmap Builder"
      description="Plan quarterly milestones, dependencies, and risks."
      audience="Product, delivery, and transformation leads."
      useCases={["Draft a simple roadmap.", "Share with leadership.", "Export for updates."]}
      instructions={["List milestones by quarter.", "Add key risks.", "Export to share.", "Review monthly."]}
      outputTitle="Roadmap"
      outputSummary={state.milestones}
      outputInterpretation="Keep milestones outcome-focused; manage risks visibly."
      outputNextSteps={["Add owners and dates.", "Track dependencies.", "Update after reviews."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="dig-roadmap-builder"
        title="Roadmap Builder"
        category="Digitalisation"
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
          Milestones
          <textarea
            value={state.milestones}
            onChange={(e) => updateState((prev) => ({ ...prev, milestones: e.target.value }))}
            rows={5}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Risks
          <textarea
            value={state.risks}
            onChange={(e) => updateState((prev) => ({ ...prev, risks: e.target.value }))}
            rows={5}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
      </div>
    </TemplateLayout>
  );
}

export function OkrGenerator() {
  const storageKey = "template-dig-okr-generator";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    objective: "Improve digital service adoption",
    keyResults: "KR1: 20% increase in weekly active users\nKR2: CSAT +3 points\nKR3: Drop error rate by 30%",
    alignment: "Aligned to strategy and product roadmap",
  });

  const buildSections = () => [
    { heading: "Objective", body: state.objective },
    { heading: "Key results", body: state.keyResults },
    { heading: "Alignment", body: state.alignment },
  ];

  return (
    <TemplateLayout
      title="OKR Generator with Alignment Checks"
      description="Draft OKRs and note alignment with strategy and product plans."
      audience="Product, delivery, and leadership teams."
      useCases={["Draft OKRs quickly.", "Share alignment notes.", "Export for reviews."]}
      instructions={["Write objective.", "Add key results.", "State alignment and anti-patterns.", "Export and review."]}
      outputTitle="OKR set"
      outputSummary={`${state.objective} | ${state.keyResults}`}
      outputInterpretation="Keep 2-4 key results. Avoid vanity metrics. Align to strategy."
      outputNextSteps={["Share for review.", "Define owners and cadence.", "Track weekly."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="dig-okr-generator"
        title="OKR Generator"
        category="Digitalisation"
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
          Objective
          <textarea
            value={state.objective}
            onChange={(e) => updateState((prev) => ({ ...prev, objective: e.target.value }))}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Alignment and risks
          <textarea
            value={state.alignment}
            onChange={(e) => updateState((prev) => ({ ...prev, alignment: e.target.value }))}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
      </div>

      <label className="text-sm font-semibold text-slate-900">
        Key results (one per line)
        <textarea
          value={state.keyResults}
          onChange={(e) => updateState((prev) => ({ ...prev, keyResults: e.target.value }))}
          rows={5}
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
        />
      </label>
    </TemplateLayout>
  );
}

export function KpiTreeBuilder() {
  const storageKey = "template-dig-kpi-tree-builder";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    outcome: "Increase active usage",
    kpis: "WAU growth; Session duration; Task completion rate",
    leading: "Onboarding completion; Time to first value",
  });

  const lines = useMemo(
    () => [
      `Outcome: ${state.outcome}`,
      `KPIs: ${state.kpis}`,
      `Leading indicators: ${state.leading}`,
    ],
    [state]
  );

  const buildSections = () => [
    { heading: "Outcome", body: state.outcome },
    { heading: "KPIs", body: state.kpis },
    { heading: "Leading indicators", body: state.leading },
  ];

  return (
    <TemplateLayout
      title="KPI Tree Builder"
      description="Link outcomes to KPIs and leading indicators."
      audience="Product, analytics, and leadership."
      useCases={["Map KPIs to outcomes.", "Share with teams.", "Export for dashboards."]}
      instructions={["State the outcome.", "List KPIs and leading signals.", "Keep measures clear.", "Export for sharing."]}
      outputTitle="KPI tree"
      outputSummary={lines.join(" ")}
      outputInterpretation="Ensure KPIs are measurable and leading indicators are actionable."
      outputNextSteps={["Attach owners and targets.", "Add to dashboards.", "Review monthly."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="dig-kpi-tree-builder"
        title="KPI Tree Builder"
        category="Digitalisation"
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
          Outcome
          <textarea
            value={state.outcome}
            onChange={(e) => updateState((prev) => ({ ...prev, outcome: e.target.value }))}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Leading indicators
          <textarea
            value={state.leading}
            onChange={(e) => updateState((prev) => ({ ...prev, leading: e.target.value }))}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
      </div>

      <label className="text-sm font-semibold text-slate-900">
        KPIs
        <textarea
          value={state.kpis}
          onChange={(e) => updateState((prev) => ({ ...prev, kpis: e.target.value }))}
          rows={4}
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
        />
      </label>
    </TemplateLayout>
  );
}

export const digToolComponents = {
  "dig-digital-strategy-canvas": DigitalStrategyCanvas,
  "dig-benefits-tracker": BenefitsTracker,
  "dig-capability-maturity": CapabilityMaturityAssessment,
  "dig-risk-register": RiskRegisterBuilder,
  "dig-interoperability-checklist": InteroperabilityChecklist,
  "dig-roadmap-builder": RoadmapBuilder,
  "dig-okr-generator": OkrGenerator,
  "dig-kpi-tree-builder": KpiTreeBuilder,
};
