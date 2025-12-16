"use client";

import { useMemo } from "react";
import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";

export default function IntegrityChainTool() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "integrity-chain-tool",
    initial_state: { hash: true, signature: false, logging: true },
  });

  const steps = useMemo(() => {
    const protections = [];
    if (state.hash) protections.push("Hash detects accidental change");
    if (state.signature) protections.push("Signature ties origin and integrity");
    if (state.logging) protections.push("Log preserves evidence over time");
    const covered = protections.length;
    const gap =
      covered === 3
        ? "Strong chain. You can detect tampering and prove origin."
        : covered === 2
        ? "Better than nothing. Think about origin or replay gaps."
        : "Weak chain. Tampering may go unnoticed.";
    return { protections, gap };
  }, [state.hash, state.signature, state.logging]);

  if (!is_ready) return <p className="text-sm text-gray-600">Loading.</p>;

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">Toggle layers to see how integrity is preserved across time and systems.</p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Toggle
          label="Hash on write"
          checked={state.hash}
          onChange={(v) => set_state((prev) => ({ ...prev, hash: v }))}
          helper="Detects unexpected changes."
        />
        <Toggle
          label="Signature"
          checked={state.signature}
          onChange={(v) => set_state((prev) => ({ ...prev, signature: v }))}
          helper="Proves origin and prevents undetected tampering."
        />
        <Toggle
          label="Immutable log"
          checked={state.logging}
          onChange={(v) => set_state((prev) => ({ ...prev, logging: v }))}
          helper="Lets you audit and replay events."
        />
      </div>

      <div className="rounded-lg border px-3 py-2 bg-white">
        <div className="text-xs font-semibold text-gray-700">What you preserve</div>
        <ul className="mt-2 space-y-1 text-gray-800">
          {steps.protections.map((p, i) => (
            <li key={i}>• {p}</li>
          ))}
          {!steps.protections.length ? <li className="text-red-600">• Nothing is protecting integrity yet.</li> : null}
        </ul>
        <p className="mt-2 text-xs text-gray-600">{steps.gap}</p>
      </div>

      <ToolStateActions
        onReset={reset}
        onCopy={copy_share_link}
        onExport={export_json}
        onImport={import_json}
      />
    </div>
  );
}

function Toggle({ label, checked, onChange, helper }) {
  return (
    <label className="flex flex-col rounded-lg border bg-gray-50 px-3 py-2">
      <div className="flex items-center justify-between">
        <span className="text-gray-800 font-medium">{label}</span>
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      </div>
      <span className="text-xs text-gray-600 mt-1">{helper}</span>
    </label>
  );
}
