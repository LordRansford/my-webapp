"use client";

import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";

const scenarios = [
  { id: "replay", text: "Attacker replays a valid message later" },
  { id: "downgrade", text: "Attacker forces weaker options" },
  { id: "error", text: "Protocol leaks detail in error messages" },
];

export default function ProtocolAssumptionsTool() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "protocol-assumptions",
    initial_state: { mitigations: {} },
  });

  if (!is_ready) return <p className="text-sm text-gray-600">Loading.</p>;

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">Pick mitigations that would stop each protocol weakness.</p>

      <div className="space-y-3">
        {scenarios.map((s) => {
          const value = state.mitigations[s.id] || "";
          return (
            <label key={s.id} className="block rounded-lg border px-3 py-3 bg-gray-50">
              <div className="font-medium text-gray-900 mb-1">{s.text}</div>
              <select
                className="w-full rounded-md border px-2 py-2"
                value={value}
                onChange={(e) =>
                  set_state((prev) => ({ ...prev, mitigations: { ...prev.mitigations, [s.id]: e.target.value } }))
                }
              >
                <option value="">Select mitigation</option>
                <option value="nonce">Use nonces and freshness checks</option>
                <option value="version-pin">Pin protocol versions and settings</option>
                <option value="generic-error">Return generic errors and rate limit</option>
                <option value="rekey">Short session lifetimes and re-key</option>
              </select>
            </label>
          );
        })}
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
