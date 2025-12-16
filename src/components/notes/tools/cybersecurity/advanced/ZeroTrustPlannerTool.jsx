"use client";

import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";

const steps = ["Identify implicit trust", "Verify identity and device", "Segment access", "Monitor continuously"];

export default function ZeroTrustPlannerTool() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "zero-trust-planner",
    initial_state: { completed: {} },
  });

  if (!is_ready) return <p className="text-sm text-gray-600">Loading.</p>;

  const done = Object.values(state.completed || {}).filter(Boolean).length;

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">Tick off the core zero trust steps and see coverage.</p>

      <div className="space-y-2">
        {steps.map((s) => (
          <label key={s} className="flex items-start gap-2 rounded-lg border bg-gray-50 px-3 py-2">
            <input
              type="checkbox"
              checked={Boolean(state.completed?.[s])}
              onChange={(e) =>
                set_state((prev) => ({
                  ...prev,
                  completed: { ...prev.completed, [s]: e.target.checked },
                }))
              }
              className="mt-1"
            />
            <span className="text-gray-800">{s}</span>
          </label>
        ))}
      </div>

      <div className="rounded-lg border px-3 py-2 bg-white">
        <div className="text-xs font-semibold text-gray-700">Coverage</div>
        <p className="text-gray-800">
          {done} of {steps.length} complete. Any unchecked item is a place where implicit trust still exists.
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
