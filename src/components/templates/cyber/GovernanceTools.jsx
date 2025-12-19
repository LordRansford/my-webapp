"use client";

import { useMemo } from "react";
import TemplateLayout from "@/components/templates/TemplateLayout";
import TemplateExportPanel from "@/components/templates/TemplateExportPanel";
import { useTemplateState } from "@/hooks/useTemplateState";

const attribution =
  "Created by Ransford for Ransfords Notes. Internal use allowed. Commercial use requires visible attribution. Exports are gated per policy.";

const formatTimestamp = (iso) => {
  if (!iso) return "Not saved yet";
  try {
    return new Date(iso).toLocaleString();
  } catch (error) {
    return iso;
  }
};

export function RiskRegister() {
  const storageKey = "template-cyber-governance-risk-register";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    entries: [
      { title: "Data breach", likelihood: "High", impact: "High", owner: "Security", treatment: "Reduce" },
    ],
  });

  const addEntry = () => {
    updateState((prev) => ({
      ...prev,
      entries: [...prev.entries, { title: "", likelihood: "Medium", impact: "Medium", owner: "", treatment: "Reduce" }],
    }));
  };

  const updateEntry = (index, field, value) => {
    updateState((prev) => {
      const entries = prev.entries.map((entry, idx) => (idx === index ? { ...entry, [field]: value } : entry));
      return { ...prev, entries };
    });
  };

  const buildSections = () => [
    {
      heading: "Risks",
      body: state.entries.map((e) => `${e.title}: ${e.likelihood}/${e.impact} owner ${e.owner} treatment ${e.treatment}`).join(" | "),
    },
  ];

  return (
    <TemplateLayout
      title="Risk Register Builder"
      description="Create and rank risks with owners, treatments, and export options."
      audience="Security, risk, and product leaders."
      useCases={["Stand up a basic risk register.", "Share risks with governance forums.", "Track owners and treatments."]}
      instructions={[
        "Add risks with likelihood, impact, owner, and treatment.",
        "Prioritise by sorting likelihood and impact.",
        "Export for sharing and decision forums.",
      ]}
      outputTitle="Risk register summary"
      outputSummary={`Total risks: ${state.entries.length}`}
      outputInterpretation="Focus on high likelihood and high impact first. Ensure owners and due dates exist in your tracking system."
      outputNextSteps={["Create mitigation actions with deadlines.", "Review quarterly.", "Align with enterprise risk taxonomy."]}
      attributionText={attribution}
      version="1.0.0"
    >
      <TemplateExportPanel
        templateId="cyber-governance-risk-register"
        title="Risk Register Builder"
        category="Cybersecurity"
        version="1.0.0"
        attributionText={attribution}
        prepareSections={buildSections}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-medium text-slate-700">Autosaves locally. Last updated: {formatTimestamp(lastUpdated)}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={addEntry}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Add risk
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

      <div className="space-y-3">
        {state.entries.map((entry, index) => (
          <div key={index} className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
            <div className="grid gap-3 md:grid-cols-5">
              <input
                type="text"
                value={entry.title}
                onChange={(e) => updateEntry(index, "title", e.target.value)}
                placeholder="Risk title"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                aria-label="Risk title"
              />
              <select
                value={entry.likelihood}
                onChange={(e) => updateEntry(index, "likelihood", e.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                aria-label="Likelihood"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
              <select
                value={entry.impact}
                onChange={(e) => updateEntry(index, "impact", e.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                aria-label="Impact"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
              <input
                type="text"
                value={entry.owner}
                onChange={(e) => updateEntry(index, "owner", e.target.value)}
                placeholder="Owner"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                aria-label="Owner"
              />
              <select
                value={entry.treatment}
                onChange={(e) => updateEntry(index, "treatment", e.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                aria-label="Treatment"
              >
                <option>Accept</option>
                <option>Reduce</option>
                <option>Transfer</option>
                <option>Avoid</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </TemplateLayout>
  );
}

export function IncidentTimeline() {
  const storageKey = "template-cyber-governance-incident-timeline";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    events: [{ time: "T0", detail: "Detection", owner: "SOC" }],
  });

  const addEvent = () => {
    updateState((prev) => ({ ...prev, events: [...prev.events, { time: "", detail: "", owner: "" }] }));
  };

  const updateEvent = (index, field, value) => {
    updateState((prev) => {
      const events = prev.events.map((evt, idx) => (idx === index ? { ...evt, [field]: value } : evt));
      return { ...prev, events };
    });
  };

  const buildSections = () => [{ heading: "Timeline", body: state.events.map((e) => `${e.time}: ${e.detail} (${e.owner})`).join(" | ") }];

  return (
    <TemplateLayout
      title="Incident Timeline Builder"
      description="Capture incident events, roles, and timestamps for review and export."
      audience="Incident managers and responders."
      useCases={["Document incidents as they unfold.", "Prepare for post-incident review.", "Share concise timelines with leaders."]}
      instructions={[
        "Add events with time markers, details, and owners.",
        "Keep events factual and time ordered.",
        "Export to share with responders and leadership.",
      ]}
      outputTitle="Timeline summary"
      outputSummary={`Events captured: ${state.events.length}`}
      outputInterpretation="A clear timeline improves post-incident reviews and accountability."
      outputNextSteps={["Add evidence links in your ticketing system.", "Confirm times with logs.", "Use in after-action reviews."]}
      attributionText={attribution}
      version="1.0.0"
    >
      <TemplateExportPanel
        templateId="cyber-governance-incident-timeline"
        title="Incident Timeline Builder"
        category="Cybersecurity"
        version="1.0.0"
        attributionText={attribution}
        prepareSections={buildSections}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-medium text-slate-700">Autosaves locally. Last updated: {formatTimestamp(lastUpdated)}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={addEvent}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Add event
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

      <div className="space-y-3">
        {state.events.map((evt, index) => (
          <div key={index} className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
            <div className="grid gap-3 md:grid-cols-3">
              <input
                type="text"
                value={evt.time}
                onChange={(e) => updateEvent(index, "time", e.target.value)}
                placeholder="T+05m"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                aria-label="Time marker"
              />
              <input
                type="text"
                value={evt.detail}
                onChange={(e) => updateEvent(index, "detail", e.target.value)}
                placeholder="What happened"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                aria-label="Detail"
              />
              <input
                type="text"
                value={evt.owner}
                onChange={(e) => updateEvent(index, "owner", e.target.value)}
                placeholder="Owner"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                aria-label="Owner"
              />
            </div>
          </div>
        ))}
      </div>
    </TemplateLayout>
  );
}

const ciaMap = {
  Confidentiality: ["Encryption", "Access control", "Data masking"],
  Integrity: ["Checksums", "Signing", "Input validation"],
  Availability: ["Backups", "Redundancy", "Rate limiting"],
};

export function ControlsMapper() {
  const storageKey = "template-cyber-governance-controls-mapper";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    controls: ["Encryption", "Logging"],
  });

  const toggleControl = (control) => {
    updateState((prev) => {
      const controls = prev.controls.includes(control)
        ? prev.controls.filter((c) => c !== control)
        : [...prev.controls, control];
      return { ...prev, controls };
    });
  };

  const buildSections = () => [
    { heading: "Controls", body: state.controls.join(", ") },
    { heading: "CIA mapping", body: JSON.stringify(ciaMap, null, 2) },
  ];

  return (
    <TemplateLayout
      title="Security Controls Mapper"
      description="Map controls to confidentiality, integrity, availability and note gaps."
      audience="Security architects and auditors."
      useCases={["Plan control coverage.", "Identify gaps for CIA.", "Prepare for compliance mapping."]}
      instructions={["Select controls in place.", "Review which CIA pillar they support.", "Note gaps and plan remediation."]}
      outputTitle="Control coverage"
      outputSummary={`Controls selected: ${state.controls.length}`}
      outputInterpretation="Balanced coverage across CIA is important. Add detective controls alongside preventive ones."
      outputNextSteps={["Add controls to cover gaps.", "Map to NIST or ISO later.", "Track owners and effectiveness."]}
      attributionText={attribution}
      version="1.0.0"
    >
      <TemplateExportPanel
        templateId="cyber-governance-controls-mapper"
        title="Security Controls Mapper"
        category="Cybersecurity"
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
        <p className="text-sm font-semibold text-slate-900">Select controls</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.values(ciaMap)
            .flat()
            .concat(["Logging", "Monitoring", "Alerting"])
            .map((control) => (
              <button
                key={control}
                type="button"
                onClick={() => toggleControl(control)}
                className={`rounded-full px-3 py-2 text-xs font-semibold shadow-sm ${
                  state.controls.includes(control)
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                }`}
              >
                {control}
              </button>
            ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(ciaMap).map(([pillar, controls]) => (
          <div key={pillar} className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">{pillar}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {controls.map((c) => (
                <li key={c}>{c} {state.controls.includes(c) ? "(covered)" : "(gap)"}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </TemplateLayout>
  );
}

export function PersonalChecklist() {
  const storageKey = "template-cyber-governance-personal-checklist";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    role: "Individual",
    device: "Personal",
    extras: "",
  });

  const checklist = useMemo(() => {
    const items = ["Use a password manager", "Enable MFA on important accounts", "Apply updates weekly"];
    if (state.device === "Work") items.push("Use device encryption and company VPN");
    if (state.role === "Engineer") items.push("Use hardware keys for code and cloud access");
    if (state.extras) items.push(state.extras);
    return items;
  }, [state.device, state.extras, state.role]);

  const buildSections = () => [
    { heading: "Role/device", body: `${state.role}, ${state.device}` },
    { heading: "Checklist", body: checklist.join(" | ") },
  ];

  return (
    <TemplateLayout
      title="Personal Security Checklist Generator"
      description="Generate a tailored security checklist based on role and device use."
      audience="Individuals, engineers, and small teams."
      useCases={["Share quick personal hardening steps.", "Coach new joiners.", "Prepare for travel readiness."]}
      instructions={["Select your role and device type.", "Add any specific needs.", "Use the checklist and mark items off."]}
      outputTitle="Checklist"
      outputSummary={`Items: ${checklist.length}`}
      outputInterpretation="Complete these basics to reduce common risks. Add role-specific controls where needed."
      outputNextSteps={["Complete each item.", "Review quarterly.", "Share with your team."]}
      attributionText={attribution}
      version="1.0.0"
    >
      <TemplateExportPanel
        templateId="cyber-governance-personal-checklist"
        title="Personal Security Checklist Generator"
        category="Cybersecurity"
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
          Role
          <select
            value={state.role}
            onChange={(e) => updateState((prev) => ({ ...prev, role: e.target.value }))}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option>Individual</option>
            <option>Engineer</option>
            <option>Security</option>
            <option>Leader</option>
          </select>
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Device type
          <select
            value={state.device}
            onChange={(e) => updateState((prev) => ({ ...prev, device: e.target.value }))}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option>Personal</option>
            <option>Work</option>
          </select>
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Extra requirement
          <input
            type="text"
            value={state.extras}
            onChange={(e) => updateState((prev) => ({ ...prev, extras: e.target.value }))}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="Travel, admin access, etc."
          />
        </label>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Checklist</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
          {checklist.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    </TemplateLayout>
  );
}

export const governanceTools = {
  "cyber-governance-risk-register": RiskRegister,
  "cyber-governance-incident-timeline": IncidentTimeline,
  "cyber-governance-controls-mapper": ControlsMapper,
  "cyber-governance-personal-checklist": PersonalChecklist,
};
