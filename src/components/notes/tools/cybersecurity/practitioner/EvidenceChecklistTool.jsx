"use client";

import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";
import { CheckPill } from "@/components/ui/CheckPill";

const evidenceItems = ["Log event", "Metric threshold", "Trace span", "User report", "Automated test"];

export default function EvidenceChecklistTool() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "evidence-checklist",
    initial_state: { selected: {} },
  });

  if (!is_ready) return <p className="text-sm text-gray-600">Loading.</p>;

  const picked = Object.values(state.selected || {}).filter(Boolean).length;

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">Select which evidence you need to prove a control works.</p>

      <div className="space-y-2">
        {evidenceItems.map((item) => (
          <CheckPill
            key={item}
            checked={Boolean(state.selected?.[item])}
            onCheckedChange={(checked) =>
              set_state((prev) => ({ ...prev, selected: { ...prev.selected, [item]: checked } }))
            }
            tone="emerald"
            className="justify-start"
          >
            {item}
          </CheckPill>
        ))}
      </div>

      <div className="rounded-lg border px-3 py-2 bg-white">
        <div className="text-xs font-semibold text-gray-700">Coverage</div>
        <p className="text-gray-800">
          {picked} of {evidenceItems.length} evidence types selected. More than one makes tests more reliable.
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
