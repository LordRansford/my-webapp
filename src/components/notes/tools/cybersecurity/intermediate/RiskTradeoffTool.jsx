"use client";

import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";
import { CheckPill } from "@/components/ui/CheckPill";

const controls = [
  { id: "mfa", label: "MFA", benefit: 3, cost: 1 },
  { id: "logging", label: "Deep logging", benefit: 2, cost: 2 },
  { id: "segmentation", label: "Network segmentation", benefit: 3, cost: 3 },
  { id: "training", label: "User training", benefit: 1, cost: 1 },
];

export default function RiskTradeoffTool() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "risk-tradeoff-tool",
    initial_state: { chosen: {} },
  });

  if (!is_ready) return <p className="text-sm text-gray-600">Loading.</p>;

  const totals = controls.reduce(
    (acc, c) => {
      if (state.chosen?.[c.id]) {
        acc.benefit += c.benefit;
        acc.cost += c.cost;
      }
      return acc;
    },
    { benefit: 0, cost: 0 }
  );

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">Pick controls and see benefit versus complexity cost.</p>

      <div className="space-y-2">
        {controls.map((c) => (
          <CheckPill
            key={c.id}
            checked={Boolean(state.chosen?.[c.id])}
            onCheckedChange={(checked) =>
              set_state((prev) => ({ ...prev, chosen: { ...prev.chosen, [c.id]: checked } }))
            }
            tone="emerald"
            className="justify-start"
          >
            {c.label} (benefit {c.benefit}, cost {c.cost})
          </CheckPill>
        ))}
      </div>

      <div className="rounded-lg border px-3 py-2 bg-white">
        <div className="text-xs font-semibold text-gray-700">Totals</div>
        <p className="text-gray-800">Benefit: {totals.benefit} | Complexity cost: {totals.cost}</p>
        <p className="text-xs text-gray-600 mt-1">Security adds complexity. Balance both deliberately.</p>
      </div>

      <ToolStateActions onReset={reset} onCopy={copy_share_link} onExport={export_json} onImport={import_json} />
    </div>
  );
}
