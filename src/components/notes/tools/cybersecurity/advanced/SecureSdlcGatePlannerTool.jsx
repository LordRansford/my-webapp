"use client";

import { useMemo, useState } from "react";
import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";

function SwitchRow({ label, checked, onChange, hint }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div className="min-w-0">
        <div className="text-sm font-semibold text-slate-900">{label}</div>
        {hint ? <div className="mt-1 text-xs text-slate-700">{hint}</div> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={Boolean(checked)}
        onClick={onChange}
        className={`relative inline-flex h-7 w-12 items-center rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
          checked ? "border-emerald-500/30 bg-emerald-500" : "border-slate-300 bg-slate-200"
        }`}
        aria-label={label}
      >
        <span
          aria-hidden="true"
          className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition ${
            checked ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

export default function SecureSdlcGatePlannerTool() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "secure-sdlc-gate-planner",
    initial_state: {
      requirementsCheck: true,
      threatModelLite: true,
      designReview: true,
      secretScan: true,
      dependencyScan: true,
      ciPolicyGates: true,
      stagingSmokeChecks: true,
      productionGuardrails: true,
      verificationNotes: "",
    },
  });

  const [copied, setCopied] = useState(false);

  const summary = useMemo(() => {
    const items = [
      { key: "requirementsCheck", label: "Security requirements captured", done: Boolean(state.requirementsCheck) },
      { key: "threatModelLite", label: "Threat model for high risk features", done: Boolean(state.threatModelLite) },
      { key: "designReview", label: "Security design review when needed", done: Boolean(state.designReview) },
      { key: "secretScan", label: "Secret scanning in CI", done: Boolean(state.secretScan) },
      { key: "dependencyScan", label: "Dependency and supply chain checks", done: Boolean(state.dependencyScan) },
      { key: "ciPolicyGates", label: "Policy gates before release", done: Boolean(state.ciPolicyGates) },
      { key: "stagingSmokeChecks", label: "Staging smoke checks for auth and logging", done: Boolean(state.stagingSmokeChecks) },
      { key: "productionGuardrails", label: "Production guardrails and rollback plan", done: Boolean(state.productionGuardrails) },
    ];
    const doneCount = items.filter((i) => i.done).length;
    return { items, doneCount };
  }, [
    state.requirementsCheck,
    state.threatModelLite,
    state.designReview,
    state.secretScan,
    state.dependencyScan,
    state.ciPolicyGates,
    state.stagingSmokeChecks,
    state.productionGuardrails,
  ]);

  const copyText = async () => {
    try {
      const lines = [
        "Secure SDLC gate set",
        "",
        `Security requirements captured  ${state.requirementsCheck ? "yes" : "no"}`,
        `Threat model for high risk features  ${state.threatModelLite ? "yes" : "no"}`,
        `Security design review when needed  ${state.designReview ? "yes" : "no"}`,
        `Secret scanning in CI  ${state.secretScan ? "yes" : "no"}`,
        `Dependency and supply chain checks  ${state.dependencyScan ? "yes" : "no"}`,
        `Policy gates before release  ${state.ciPolicyGates ? "yes" : "no"}`,
        `Staging smoke checks for auth and logging  ${state.stagingSmokeChecks ? "yes" : "no"}`,
        `Production guardrails and rollback plan  ${state.productionGuardrails ? "yes" : "no"}`,
        "",
        "Verification notes",
        String(state.verificationNotes || "").trim() || "(none)",
      ];
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  if (!is_ready) return <p className="text-sm text-gray-600">Loading...</p>;

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">
        Choose a minimal set of gates that teams can follow consistently. Keep only what you can verify and maintain.
      </p>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <div className="text-sm font-semibold text-slate-900">Coverage</div>
        <div className="mt-1 text-xs text-slate-700">
          {summary.doneCount} of {summary.items.length} gates enabled
        </div>
      </div>

      <div className="space-y-2">
        <SwitchRow
          label="Security requirements captured"
          hint="Write down what must be protected and what failures are unacceptable."
          checked={Boolean(state.requirementsCheck)}
          onChange={() => set_state({ ...state, requirementsCheck: !state.requirementsCheck })}
        />
        <SwitchRow
          label="Threat model for high risk features"
          hint="Do a short review for new auth flows, payments, admin actions, and sensitive data."
          checked={Boolean(state.threatModelLite)}
          onChange={() => set_state({ ...state, threatModelLite: !state.threatModelLite })}
        />
        <SwitchRow
          label="Security design review when needed"
          hint="Review trust boundaries, access control, and failure modes before building."
          checked={Boolean(state.designReview)}
          onChange={() => set_state({ ...state, designReview: !state.designReview })}
        />
        <SwitchRow
          label="Secret scanning in CI"
          hint="Block obvious leaks and require a clean history for merges."
          checked={Boolean(state.secretScan)}
          onChange={() => set_state({ ...state, secretScan: !state.secretScan })}
        />
        <SwitchRow
          label="Dependency and supply chain checks"
          hint="Track updates and define how you respond when a high risk issue appears."
          checked={Boolean(state.dependencyScan)}
          onChange={() => set_state({ ...state, dependencyScan: !state.dependencyScan })}
        />
        <SwitchRow
          label="Policy gates before release"
          hint="Enforce a small set of requirements such as audit logging and least privilege."
          checked={Boolean(state.ciPolicyGates)}
          onChange={() => set_state({ ...state, ciPolicyGates: !state.ciPolicyGates })}
        />
        <SwitchRow
          label="Staging smoke checks for auth and logging"
          hint="Prove the critical paths work and produce expected signals before go live."
          checked={Boolean(state.stagingSmokeChecks)}
          onChange={() => set_state({ ...state, stagingSmokeChecks: !state.stagingSmokeChecks })}
        />
        <SwitchRow
          label="Production guardrails and rollback plan"
          hint="Use feature flags, rate limits, and a clear rollback for risky changes."
          checked={Boolean(state.productionGuardrails)}
          onChange={() => set_state({ ...state, productionGuardrails: !state.productionGuardrails })}
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <label className="block text-xs font-semibold text-slate-700" htmlFor="sdlc-notes">
          Verification notes
        </label>
        <textarea
          id="sdlc-notes"
          value={String(state.verificationNotes || "")}
          onChange={(e) => set_state({ ...state, verificationNotes: e.target.value })}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          rows={6}
          placeholder="Write how you will verify each gate. Add owners and what evidence you will keep."
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={copyText}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            {copied ? "Copied" : "Copy summary"}
          </button>
        </div>
      </div>

      <ToolStateActions onReset={reset} onCopy={copy_share_link} onExport={export_json} onImport={import_json} />
    </div>
  );
}

