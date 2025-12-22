"use client";

import { useMemo, useState } from "react";
import WizardShell from "@/components/architecture-diagrams/Wizard/WizardShell";
import WizardStepper from "@/components/architecture-diagrams/Wizard/WizardStepper";
import StepGoal from "@/components/architecture-diagrams/Wizard/steps/StepGoal";
import StepAudience from "@/components/architecture-diagrams/Wizard/steps/StepAudience";
import StepSystem from "@/components/architecture-diagrams/Wizard/steps/StepSystem";
import StepBuildingBlocks from "@/components/architecture-diagrams/Wizard/steps/StepBuildingBlocks";
import StepFlows from "@/components/architecture-diagrams/Wizard/steps/StepFlows";
import StepSecurity from "@/components/architecture-diagrams/Wizard/steps/StepSecurity";
import StepReview from "@/components/architecture-diagrams/Wizard/steps/StepReview";

import { useTemplateState } from "@/hooks/useTemplateState";
import { validateArchitectureDiagramInput } from "@/lib/architecture-diagrams/validate";
import { EXAMPLE_KID_FRIENDLY } from "@/lib/architecture-diagrams/examples";

const steps = [
  { id: "goal", label: "Goal", hint: "Why you need diagrams" },
  { id: "audience", label: "Audience", hint: "Who this is for" },
  { id: "system", label: "System basics", hint: "Name and description" },
  { id: "blocks", label: "Building blocks", hint: "Users, systems, containers" },
  { id: "flows", label: "Key flows", hint: "Important interactions" },
  { id: "security", label: "Security and data", hint: "Boundaries and sensitivity" },
  { id: "review", label: "Review", hint: "Validated summary" },
];

const storageKey = "studio-architecture-diagram-wizard-v1";

const emptyDraft = {
  goal: "explain",
  audience: "students",
  systemName: "",
  systemDescription: "",
  users: [],
  externalSystems: [],
  containers: [],
  dataTypes: [],
  dataStores: [],
  flows: [],
  security: {
    authenticationMethod: "",
    trustBoundaries: [],
    hasNoTrustBoundariesConfirmed: false,
    adminAccess: false,
    sensitiveDataCategories: [],
  },
  versionName: "",
};

function findStepErrors(validation, stepId) {
  if (!validation || validation.ok) return [];
  const errors = validation.errors || [];
  const wants = (prefixes) => errors.filter((e) => prefixes.some((p) => e.path === p || e.path.startsWith(`${p}.`) || e.path.startsWith(`${p}[`)));

  if (stepId === "goal") return wants(["goal"]).map((e) => e.message);
  if (stepId === "audience") return wants(["audience"]).map((e) => e.message);
  if (stepId === "system") return wants(["systemName", "systemDescription"]).map((e) => e.message);
  if (stepId === "blocks") return wants(["users", "externalSystems", "containers"]).map((e) => `${e.path}: ${e.message}`);
  if (stepId === "flows") return wants(["flows"]).map((e) => `${e.path}: ${e.message}`);
  if (stepId === "security") return wants(["security", "dataTypes"]).map((e) => `${e.path}: ${e.message}`);
  if (stepId === "review") return errors.map((e) => `${e.path}: ${e.message}`);
  return [];
}

export default function WizardPageClient() {
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, emptyDraft);
  const [activeStep, setActiveStep] = useState("goal");

  const validatedInput = useMemo(() => {
    const input = {
      systemName: state.systemName,
      systemDescription: state.systemDescription,
      audience: state.audience,
      goal: state.goal,
      users: state.users,
      externalSystems: state.externalSystems,
      containers: state.containers,
      dataTypes: state.dataTypes,
      dataStores: state.dataStores,
      flows: state.flows,
      security: state.security,
      versionName: state.versionName || undefined,
    };
    return validateArchitectureDiagramInput(input);
  }, [state]);

  const flowOptions = useMemo(() => {
    const opts = new Set();
    (state.users || []).forEach((u) => u?.name && opts.add(u.name));
    (state.externalSystems || []).forEach((s) => s?.name && opts.add(s.name));
    (state.containers || []).forEach((c) => c?.name && opts.add(c.name));
    return Array.from(opts);
  }, [state.containers, state.externalSystems, state.users]);

  const stepErrors = findStepErrors(validatedInput, activeStep);

  const content = (() => {
    if (activeStep === "goal") {
      return (
        <StepGoal
          value={state.goal}
          onChange={(goal) => updateState((prev) => ({ ...prev, goal }))}
          errors={stepErrors}
        />
      );
    }
    if (activeStep === "audience") {
      return (
        <StepAudience
          value={state.audience}
          onChange={(audience) => updateState((prev) => ({ ...prev, audience }))}
          errors={stepErrors}
        />
      );
    }
    if (activeStep === "system") {
      return (
        <StepSystem
          systemName={state.systemName}
          systemDescription={state.systemDescription}
          onChange={(patch) => updateState((prev) => ({ ...prev, ...patch }))}
          errors={stepErrors}
        />
      );
    }
    if (activeStep === "blocks") {
      return (
        <StepBuildingBlocks
          users={state.users}
          externalSystems={state.externalSystems}
          containers={state.containers}
          onChange={(patch) => updateState((prev) => ({ ...prev, ...patch }))}
          errors={stepErrors}
        />
      );
    }
    if (activeStep === "flows") {
      return (
        <StepFlows
          flows={state.flows}
          options={flowOptions}
          onChange={(patch) => updateState((prev) => ({ ...prev, ...patch }))}
          errors={stepErrors}
        />
      );
    }
    if (activeStep === "security") {
      return (
        <StepSecurity
          security={state.security}
          dataTypes={state.dataTypes}
          onChange={(patch) =>
            updateState((prev) => ({
              ...prev,
              ...patch,
              security: patch.security ? patch.security : prev.security,
            }))
          }
          errors={stepErrors}
        />
      );
    }
    return (
      <StepReview
        input={{
          ...state,
        }}
        validation={validatedInput}
        generationEnabled={false}
        onGenerate={() => {}}
      />
    );
  })();

  const activeIndex = steps.findIndex((s) => s.id === activeStep);
  const canGoBack = activeIndex > 0;
  const canGoNext = activeIndex < steps.length - 1;

  return (
    <WizardShell
      title="Guided wizard"
      subtitle="Step by step input capture. Diagram generation comes next."
      lastUpdated={lastUpdated ? new Date(lastUpdated).toLocaleString() : null}
      onReset={() => resetState()}
      left={
        <div className="space-y-4">
          <WizardStepper steps={steps} activeId={activeStep} onJump={setActiveStep} />
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Draft tools</p>
            <p className="mt-2 text-sm text-slate-700">Start from a safe example if you want a quick preview.</p>
            <button
              type="button"
              onClick={() => updateState(() => ({ ...EXAMPLE_KID_FRIENDLY }))}
              className="mt-3 w-full rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            >
              Load kid friendly example
            </button>
            <p className="mt-3 text-xs text-slate-600">
              Examples are validated. You can edit them on the next steps.
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {content}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={() => setActiveStep(steps[Math.max(0, activeIndex - 1)].id)}
            disabled={!canGoBack}
            className={`rounded-full px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${
              canGoBack ? "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50" : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            Back
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {activeStep !== "review" ? (
              <p className="text-xs text-slate-600">
                Validation runs continuously. You can move ahead, and fix issues on the review step.
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => setActiveStep(steps[Math.min(steps.length - 1, activeIndex + 1)].id)}
            disabled={!canGoNext}
            className={`rounded-full px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${
              canGoNext ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-slate-200 text-slate-500 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </WizardShell>
  );
}


