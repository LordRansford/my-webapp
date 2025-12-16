"use client";

import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";

const phases = ["Initial access", "Execution", "Discovery", "Lateral movement", "Impact"];

export default function IncidentTimelineTool() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "incident-timeline-advanced",
    initial_state: { phase: "Initial access", note: "" },
  });

  if (!is_ready) return <p className="text-sm text-gray-600">Loading.</p>;

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">Step through a simple incident timeline. Record your first response action.</p>

      <div className="flex flex-wrap gap-2">
        {phases.map((p) => (
          <button
            key={p}
            onClick={() => set_state((prev) => ({ ...prev, phase: p }))}
            className={`rounded-full border px-3 py-1 text-xs ${
              state.phase === p ? "bg-blue-600 text-white" : "text-gray-700 bg-white"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <label className="block space-y-1">
        <span className="text-xs uppercase tracking-wide text-gray-500">First action</span>
        <input
          className="w-full rounded-md border px-2 py-2"
          value={state.note}
          onChange={(e) => set_state((prev) => ({ ...prev, note: e.target.value }))}
          placeholder="e.g., isolate endpoint, capture memory, disable account"
        />
      </label>

      <div className="rounded-lg border px-3 py-2 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700">Current phase</div>
        <p className="text-gray-800">
          {state.phase}. Your next step should contain spread, preserve evidence, and keep safety in mind.
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
