"use client";

import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";

export default function PrivacyThreatModeler() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "privacy-threat-modeler",
    initial_state: {},
  });

  if (!is_ready) return <p className="text-sm text-gray-600">Loading...</p>;

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">
        Interactive tool for PrivacyThreatModeler. Full implementation pending.
      </p>
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="font-semibold text-blue-900">Tool Purpose</div>
        <p className="text-xs text-blue-800 mt-1">
          This tool helps you practice essential cybersecurity concepts through interactive exercises.
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
