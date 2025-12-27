"use client";

import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";
import { CheckPill } from "@/components/ui/CheckPill";

const zones = [
  { id: "user", label: "User input enters the app" },
  { id: "service", label: "Service-to-service call" },
  { id: "database", label: "Database query" },
  { id: "third-party", label: "Third-party API call" },
];

export default function TrustBoundaryTool() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "trust-boundary-tool",
    initial_state: { checks: {} },
  });

  const checks = state.checks || {};

  if (!is_ready) return <p className="text-sm text-gray-600">Loading.</p>;

  const marked = Object.keys(checks).filter((k) => checks[k]).length;

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">
        Mark where validation or monitoring should happen. Any hop between components with different trust must be
        treated carefully.
      </p>

      <div className="space-y-2">
        {zones.map((z) => (
          <CheckPill
            key={z.id}
            checked={Boolean(checks[z.id])}
            onCheckedChange={(checked) =>
              set_state((prev) => ({
                ...prev,
                checks: { ...prev.checks, [z.id]: checked },
              }))
            }
            tone="violet"
            className="justify-start"
          >
            {z.label}
          </CheckPill>
        ))}
      </div>

      <div className="rounded-lg border px-3 py-2 bg-white">
        <div className="text-xs font-semibold text-gray-700">Coverage</div>
        <p className="text-gray-800">
          {marked} of {zones.length} boundaries marked. Every unchecked boundary is a place where assumptions can fail.
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
