"use client";

import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";
import { CheckPill } from "@/components/ui/CheckPill";

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
          <CheckPill
            key={d}
            checked={Boolean(state.critical?.[d])}
            onCheckedChange={(checked) => set_state((prev) => ({ ...prev, critical: { ...prev.critical, [d]: checked } }))}
            tone="amber"
            className="justify-start"
          >
            {d}
          </CheckPill>
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
