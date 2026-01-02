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

export default function PersonalSecurityBaselineTool() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "personal-security-baseline",
    initial_state: {
      mfaEnabled: false,
      passwordManagerStarted: false,
      recoveryChecked: false,
      updatesEnabled: false,
      note: "",
    },
  });

  const [copied, setCopied] = useState(false);

  const summary = useMemo(() => {
    const items = [
      { key: "mfaEnabled", label: "MFA enabled where it matters", done: Boolean(state.mfaEnabled) },
      { key: "passwordManagerStarted", label: "Password manager in use", done: Boolean(state.passwordManagerStarted) },
      { key: "recoveryChecked", label: "Account recovery checked", done: Boolean(state.recoveryChecked) },
      { key: "updatesEnabled", label: "Updates enabled", done: Boolean(state.updatesEnabled) },
    ];
    const doneCount = items.filter((i) => i.done).length;
    return { items, doneCount };
  }, [state.mfaEnabled, state.passwordManagerStarted, state.recoveryChecked, state.updatesEnabled]);

  const copyText = async () => {
    try {
      const lines = [
        "Personal Security Baseline",
        "",
        `MFA enabled where it matters  ${state.mfaEnabled ? "yes" : "no"}`,
        `Password manager in use  ${state.passwordManagerStarted ? "yes" : "no"}`,
        `Account recovery checked  ${state.recoveryChecked ? "yes" : "no"}`,
        `Updates enabled  ${state.updatesEnabled ? "yes" : "no"}`,
        "",
        "Notes",
        String(state.note || "").trim() || "(none)",
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
        This is a simple capstone. It helps you turn the course into a small set of real actions you can explain and repeat.
      </p>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <div className="text-sm font-semibold text-slate-900">Progress</div>
        <div className="mt-1 text-xs text-slate-700">{summary.doneCount} of {summary.items.length} actions done</div>
      </div>

      <div className="space-y-2">
        <SwitchRow
          label="MFA enabled where it matters"
          hint="Start with email, banking, and anything that can reset other accounts."
          checked={Boolean(state.mfaEnabled)}
          onChange={() => set_state({ ...state, mfaEnabled: !state.mfaEnabled })}
        />
        <SwitchRow
          label="Password manager in use"
          hint="Aim for unique passwords. Avoid reusing passwords across sites."
          checked={Boolean(state.passwordManagerStarted)}
          onChange={() => set_state({ ...state, passwordManagerStarted: !state.passwordManagerStarted })}
        />
        <SwitchRow
          label="Account recovery checked"
          hint="Review recovery email and phone. Remove anything you do not control."
          checked={Boolean(state.recoveryChecked)}
          onChange={() => set_state({ ...state, recoveryChecked: !state.recoveryChecked })}
        />
        <SwitchRow
          label="Updates enabled"
          hint="Turn on automatic updates for your device and key apps where possible."
          checked={Boolean(state.updatesEnabled)}
          onChange={() => set_state({ ...state, updatesEnabled: !state.updatesEnabled })}
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <label className="block text-xs font-semibold text-slate-700" htmlFor="psb-note">
          Your notes
        </label>
        <textarea
          id="psb-note"
          value={String(state.note || "")}
          onChange={(e) => set_state({ ...state, note: e.target.value })}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          rows={5}
          placeholder="Write a short plan. What will you change this week. What will you check next."
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={copyText}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            aria-label="Copy baseline summary"
          >
            {copied ? "Copied" : "Copy summary"}
          </button>
        </div>
      </div>

      <ToolStateActions onReset={reset} onCopy={copy_share_link} onExport={export_json} onImport={import_json} />
    </div>
  );
}

