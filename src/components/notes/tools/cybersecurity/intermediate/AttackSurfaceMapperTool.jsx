"use client";

import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";
import { CheckPill } from "@/components/ui/CheckPill";

const entries = ["Login", "API", "File upload", "Admin actions", "Third-party webhook"];

export default function AttackSurfaceMapperTool() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "attack-surface-mapper",
    initial_state: { validated: {} },
  });

  if (!is_ready) return <p className="text-sm text-gray-600">Loading.</p>;

  const validatedCount = Object.values(state.validated || {}).filter(Boolean).length;

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">Mark which entry points have input validation and monitoring.</p>

      <div className="space-y-2">
        {entries.map((e) => (
          <CheckPill
            key={e}
            checked={Boolean(state.validated?.[e])}
            onCheckedChange={(checked) =>
              set_state((prev) => ({ ...prev, validated: { ...prev.validated, [e]: checked } }))
            }
            tone="violet"
            className="justify-start"
          >
            {e}
          </CheckPill>
        ))}
      </div>

      <div className="rounded-lg border px-3 py-2 bg-white">
        <div className="text-xs font-semibold text-gray-700">Coverage</div>
        <p className="text-gray-800">
          {validatedCount} of {entries.length} entry points validated. Any unchecked item is potential attack surface.
        </p>
      </div>

      <ToolStateActions onReset={reset} onCopy={copy_share_link} onExport={export_json} onImport={import_json} />
    </div>
  );
}
