"use client";

import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";

const steps = ["Root CA", "Intermediate CA", "Leaf certificate"];

export default function CertificateChainTool() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "certificate-chain-tool",
    initial_state: { broken: false, missing: false, nameMismatch: false },
  });

  if (!is_ready) return <p className="text-sm text-gray-600">Loading.</p>;

  const issues = [];
  if (state.broken) issues.push("Signature invalid");
  if (state.missing) issues.push("Missing intermediate");
  if (state.nameMismatch) issues.push("Hostname mismatch");

  const status = issues.length ? "Chain should fail validation" : "Chain should validate";

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">Toggle failures in the chain and see what the validator should do.</p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {steps.map((s, idx) => (
          <div key={s} className="rounded-lg border px-3 py-3 bg-gray-50">
            <div className="text-xs uppercase tracking-wide text-gray-500">Step {idx + 1}</div>
            <div className="font-semibold text-gray-900">{s}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Toggle label="Break signature" checked={state.broken} onChange={(v) => set_state((p) => ({ ...p, broken: v }))} />
        <Toggle label="Remove intermediate" checked={state.missing} onChange={(v) => set_state((p) => ({ ...p, missing: v }))} />
        <Toggle label="Name mismatch" checked={state.nameMismatch} onChange={(v) => set_state((p) => ({ ...p, nameMismatch: v }))} />
      </div>

      <div className="rounded-lg border px-3 py-2 bg-white">
        <div className="text-xs font-semibold text-gray-700">Expected outcome</div>
        <p className="text-gray-800">{status}</p>
        <p className="text-xs text-gray-600 mt-1">If validation still passes when these are set, your validation is broken.</p>
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

function Toggle({ label, checked, onChange }) {
  return (
    <label className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-gray-800">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}
