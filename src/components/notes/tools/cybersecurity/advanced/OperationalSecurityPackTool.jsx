"use client";

import { useMemo, useState } from "react";
import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";

function TextRow({ id, label, value, onChange, placeholder }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
      <label className="block text-sm font-semibold text-slate-900" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        value={String(value || "")}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        placeholder={placeholder}
      />
    </div>
  );
}

function TextAreaRow({ id, label, value, onChange, rows = 4, placeholder }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
      <label className="block text-sm font-semibold text-slate-900" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        value={String(value || "")}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        rows={rows}
        placeholder={placeholder}
      />
    </div>
  );
}

export default function OperationalSecurityPackTool() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "operational-security-pack",
    initial_state: {
      systemName: "",
      scopeSummary: "",
      scopeNotes: "",
      topRisks: ["", "", ""],
      keyControls: ["", "", ""],
      verification: ["", "", ""],
      evidence: ["", "", ""],
      firstHourPlan: "",
    },
  });

  const [copied, setCopied] = useState(false);

  const completion = useMemo(() => {
    const filled = [
      Boolean(String(state.systemName || "").trim()),
      Boolean(String(state.scopeSummary || "").trim()),
      Boolean(String(state.scopeNotes || "").trim()),
      state.topRisks.filter((x) => String(x || "").trim()).length >= 2,
      state.keyControls.filter((x) => String(x || "").trim()).length >= 2,
      state.verification.filter((x) => String(x || "").trim()).length >= 2,
      state.evidence.filter((x) => String(x || "").trim()).length >= 2,
      Boolean(String(state.firstHourPlan || "").trim()),
    ];
    const doneCount = filled.filter(Boolean).length;
    return { doneCount, total: filled.length };
  }, [state]);

  const setListItem = (key, idx, value) => {
    const next = Array.isArray(state[key]) ? [...state[key]] : [];
    next[idx] = value;
    set_state({ ...state, [key]: next });
  };

  const copyText = async () => {
    try {
      const lines = [
        "Operational Security Pack",
        "",
        `System  ${String(state.systemName || "").trim() || "(not set)"}`,
        "",
        "Scope",
        String(state.scopeSummary || "").trim() || "(none)",
        "",
        "Scope notes",
        String(state.scopeNotes || "").trim() || "(none)",
        "",
        "Top risks",
        ...state.topRisks.map((r, i) => `${i + 1}. ${String(r || "").trim() || "(blank)"}`),
        "",
        "Key controls",
        ...state.keyControls.map((c, i) => `${i + 1}. ${String(c || "").trim() || "(blank)"}`),
        "",
        "Verification",
        ...state.verification.map((v, i) => `${i + 1}. ${String(v || "").trim() || "(blank)"}`),
        "",
        "Evidence to keep",
        ...state.evidence.map((e, i) => `${i + 1}. ${String(e || "").trim() || "(blank)"}`),
        "",
        "First hour plan",
        String(state.firstHourPlan || "").trim() || "(none)",
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
        This is a capstone builder. Keep it short. Write only what you can defend with evidence and verification.
      </p>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <div className="text-sm font-semibold text-slate-900">Progress</div>
        <div className="mt-1 text-xs text-slate-700">
          {completion.doneCount} of {completion.total} sections drafted
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <TextRow
          id="osp-system"
          label="System name"
          value={state.systemName}
          onChange={(v) => set_state({ ...state, systemName: v })}
          placeholder="Example payments API"
        />
        <TextRow
          id="osp-scope-summary"
          label="Scope"
          value={state.scopeSummary}
          onChange={(v) => set_state({ ...state, scopeSummary: v })}
          placeholder="Example customer portal plus admin console"
        />
      </div>

      <TextAreaRow
        id="osp-scope-notes"
        label="Scope notes"
        value={state.scopeNotes}
        onChange={(v) => set_state({ ...state, scopeNotes: v })}
        rows={4}
        placeholder="What the system does, who uses it, and what data or privileges it handles."
      />

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="text-sm font-semibold text-slate-900">Top risks</div>
          <TextRow
            id="osp-risk-1"
            label="Risk 1"
            value={state.topRisks[0]}
            onChange={(v) => setListItem("topRisks", 0, v)}
            placeholder="Example access control mistakes expose sensitive data"
          />
          <TextRow
            id="osp-risk-2"
            label="Risk 2"
            value={state.topRisks[1]}
            onChange={(v) => setListItem("topRisks", 1, v)}
            placeholder="Example secrets leak leads to privileged access"
          />
          <TextRow
            id="osp-risk-3"
            label="Risk 3"
            value={state.topRisks[2]}
            onChange={(v) => setListItem("topRisks", 2, v)}
            placeholder="Example logging gaps delay detection and response"
          />
        </div>

        <div className="space-y-3">
          <div className="text-sm font-semibold text-slate-900">Key controls</div>
          <TextRow
            id="osp-control-1"
            label="Control 1"
            value={state.keyControls[0]}
            onChange={(v) => setListItem("keyControls", 0, v)}
            placeholder="Example least privilege roles and access reviews"
          />
          <TextRow
            id="osp-control-2"
            label="Control 2"
            value={state.keyControls[1]}
            onChange={(v) => setListItem("keyControls", 1, v)}
            placeholder="Example secrets in a managed store with rotation"
          />
          <TextRow
            id="osp-control-3"
            label="Control 3"
            value={state.keyControls[2]}
            onChange={(v) => setListItem("keyControls", 2, v)}
            placeholder="Example audit logging plus alerting on key actions"
          />
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="text-sm font-semibold text-slate-900">Verification</div>
          <TextRow
            id="osp-verify-1"
            label="Verification 1"
            value={state.verification[0]}
            onChange={(v) => setListItem("verification", 0, v)}
            placeholder="Example test access denial for a restricted action"
          />
          <TextRow
            id="osp-verify-2"
            label="Verification 2"
            value={state.verification[1]}
            onChange={(v) => setListItem("verification", 1, v)}
            placeholder="Example prove secrets are not in logs or builds"
          />
          <TextRow
            id="osp-verify-3"
            label="Verification 3"
            value={state.verification[2]}
            onChange={(v) => setListItem("verification", 2, v)}
            placeholder="Example run an incident drill and time detection"
          />
        </div>

        <div className="space-y-3">
          <div className="text-sm font-semibold text-slate-900">Evidence to keep</div>
          <TextRow
            id="osp-evidence-1"
            label="Evidence 1"
            value={state.evidence[0]}
            onChange={(v) => setListItem("evidence", 0, v)}
            placeholder="Example access review record"
          />
          <TextRow
            id="osp-evidence-2"
            label="Evidence 2"
            value={state.evidence[1]}
            onChange={(v) => setListItem("evidence", 1, v)}
            placeholder="Example audit log sample and alert tuning notes"
          />
          <TextRow
            id="osp-evidence-3"
            label="Evidence 3"
            value={state.evidence[2]}
            onChange={(v) => setListItem("evidence", 2, v)}
            placeholder="Example incident exercise timeline"
          />
        </div>
      </div>

      <TextAreaRow
        id="osp-first-hour"
        label="First hour plan"
        value={state.firstHourPlan}
        onChange={(v) => set_state({ ...state, firstHourPlan: v })}
        rows={6}
        placeholder="Write what you do in the first hour of a serious incident. Include who leads, what gets contained, and what evidence you preserve."
      />

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={copyText}
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          {copied ? "Copied" : "Copy pack"}
        </button>
      </div>

      <ToolStateActions onReset={reset} onCopy={copy_share_link} onExport={export_json} onImport={import_json} />
    </div>
  );
}

