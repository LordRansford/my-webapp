"use client";

import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";

const deps = ["Library", "Build tool", "Container base", "Cloud service", "Identity provider"];

export default function SupplyChainRiskTool() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "supply-chain-risk-tool",
    initial_state: { critical: {} },
  });

  if (!is_ready) return <p className="text-sm text-gray-600">Loading.</p>;

  const marked = Object.values(state.critical || {}).filter(Boolean).length;

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">Mark which dependencies are critical. Think about what happens if they are compromised.</p>

      <div className="space-y-2">
        {deps.map((d) => (
          <label key={d} className="flex items-start gap-2 rounded-lg border bg-gray-50 px-3 py-2">
            <input
              type="checkbox"
              checked={Boolean(state.critical?.[d])}
              onChange={(e) => set_state((prev) => ({ ...prev, critical: { ...prev.critical, [d]: e.target.checked } }))}
              className="mt-1"
            />
            <span className="text-gray-800">{d}</span>
          </label>
        ))}
      </div>

      <div className="rounded-lg border px-3 py-2 bg-white">
        <div className="text-xs font-semibold text-gray-700">Impact</div>
        <p className="text-gray-800">
          {marked} of {deps.length} dependencies marked critical. Critical dependencies need verification, isolation, and rollback paths.
        </p>
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
