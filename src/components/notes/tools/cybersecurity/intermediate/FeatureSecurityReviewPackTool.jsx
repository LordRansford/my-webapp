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

function TextAreaRow({ id, label, value, onChange, rows = 5, placeholder }) {
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

export default function FeatureSecurityReviewPackTool() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "feature-security-review-pack",
    initial_state: {
      featureName: "",
      userJourney: "",
      trustBoundaries: "",
      topRisks: ["", "", ""],
      controls: ["", "", ""],
      verification: ["", "", ""],
      evidence: ["", "", ""],
      notes: "",
    },
  });

  const [copied, setCopied] = useState(false);

  const completion = useMemo(() => {
    const filled = [
      Boolean(String(state.featureName || "").trim()),
      Boolean(String(state.userJourney || "").trim()),
      Boolean(String(state.trustBoundaries || "").trim()),
      state.topRisks.filter((x) => String(x || "").trim()).length >= 2,
      state.controls.filter((x) => String(x || "").trim()).length >= 2,
      state.verification.filter((x) => String(x || "").trim()).length >= 2,
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
        "Feature Security Review Pack",
        "",
        `Feature  ${String(state.featureName || "").trim() || "(not set)"}`,
        "",
        "User journey",
        String(state.userJourney || "").trim() || "(none)",
        "",
        "Trust boundaries",
        String(state.trustBoundaries || "").trim() || "(none)",
        "",
        "Top risks",
        ...state.topRisks.map((r, i) => `${i + 1}. ${String(r || "").trim() || "(blank)"}`),
        "",
        "Controls",
        ...state.controls.map((c, i) => `${i + 1}. ${String(c || "").trim() || "(blank)"}`),
        "",
        "Verification",
        ...state.verification.map((v, i) => `${i + 1}. ${String(v || "").trim() || "(blank)"}`),
        "",
        "Evidence",
        ...state.evidence.map((e, i) => `${i + 1}. ${String(e || "").trim() || "(blank)"}`),
        "",
        "Notes",
        String(state.notes || "").trim() || "(none)",
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
        This pack is a lightweight feature review. Keep it practical and defensible. Aim for clear risks, realistic
        controls, and verification you can actually perform.
      </p>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <div className="text-sm font-semibold text-slate-900">Progress</div>
        <div className="mt-1 text-xs text-slate-700">
          {completion.doneCount} of {completion.total} areas drafted
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <TextRow
          id="fsrp-feature"
          label="Feature name"
          value={state.featureName}
          onChange={(v) => set_state({ ...state, featureName: v })}
          placeholder="Example password reset"
        />
        <TextRow
          id="fsrp-journey-short"
          label="User journey summary"
          value={state.userJourney}
          onChange={(v) => set_state({ ...state, userJourney: v })}
          placeholder="Example user requests reset and receives a link"
        />
      </div>

      <TextAreaRow
        id="fsrp-boundaries"
        label="Trust boundaries and entry points"
        value={state.trustBoundaries}
        onChange={(v) => set_state({ ...state, trustBoundaries: v })}
        rows={5}
        placeholder="Write the boundaries and the inputs you do not fully trust. Include browser, API, third parties, and admin actions."
      />

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="text-sm font-semibold text-slate-900">Top risks</div>
          <TextRow
            id="fsrp-risk-1"
            label="Risk 1"
            value={state.topRisks[0]}
            onChange={(v) => setListItem("topRisks", 0, v)}
            placeholder="Example account takeover through weak recovery"
          />
          <TextRow
            id="fsrp-risk-2"
            label="Risk 2"
            value={state.topRisks[1]}
            onChange={(v) => setListItem("topRisks", 1, v)}
            placeholder="Example token leakage through logs or referrers"
          />
          <TextRow
            id="fsrp-risk-3"
            label="Risk 3"
            value={state.topRisks[2]}
            onChange={(v) => setListItem("topRisks", 2, v)}
            placeholder="Example broken access control on admin endpoints"
          />
        </div>

        <div className="space-y-3">
          <div className="text-sm font-semibold text-slate-900">Controls</div>
          <TextRow
            id="fsrp-control-1"
            label="Control 1"
            value={state.controls[0]}
            onChange={(v) => setListItem("controls", 0, v)}
            placeholder="Example rate limits and step up auth"
          />
          <TextRow
            id="fsrp-control-2"
            label="Control 2"
            value={state.controls[1]}
            onChange={(v) => setListItem("controls", 1, v)}
            placeholder="Example signed tokens with short expiry"
          />
          <TextRow
            id="fsrp-control-3"
            label="Control 3"
            value={state.controls[2]}
            onChange={(v) => setListItem("controls", 2, v)}
            placeholder="Example allow list for admin actions"
          />
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="text-sm font-semibold text-slate-900">Verification</div>
          <TextRow
            id="fsrp-verify-1"
            label="Verification 1"
            value={state.verification[0]}
            onChange={(v) => setListItem("verification", 0, v)}
            placeholder="Example prove access is denied for a low privilege role"
          />
          <TextRow
            id="fsrp-verify-2"
            label="Verification 2"
            value={state.verification[1]}
            onChange={(v) => setListItem("verification", 1, v)}
            placeholder="Example verify tokens cannot be replayed after use"
          />
          <TextRow
            id="fsrp-verify-3"
            label="Verification 3"
            value={state.verification[2]}
            onChange={(v) => setListItem("verification", 2, v)}
            placeholder="Example confirm audit logs include admin actions"
          />
        </div>

        <div className="space-y-3">
          <div className="text-sm font-semibold text-slate-900">Evidence</div>
          <TextRow
            id="fsrp-evidence-1"
            label="Evidence 1"
            value={state.evidence[0]}
            onChange={(v) => setListItem("evidence", 0, v)}
            placeholder="Example threat model notes"
          />
          <TextRow
            id="fsrp-evidence-2"
            label="Evidence 2"
            value={state.evidence[1]}
            onChange={(v) => setListItem("evidence", 1, v)}
            placeholder="Example access control test result"
          />
          <TextRow
            id="fsrp-evidence-3"
            label="Evidence 3"
            value={state.evidence[2]}
            onChange={(v) => setListItem("evidence", 2, v)}
            placeholder="Example log sample for key actions"
          />
        </div>
      </div>

      <TextAreaRow
        id="fsrp-notes"
        label="Notes"
        value={state.notes}
        onChange={(v) => set_state({ ...state, notes: v })}
        rows={5}
        placeholder="Write any trade offs and what you would monitor after release."
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

