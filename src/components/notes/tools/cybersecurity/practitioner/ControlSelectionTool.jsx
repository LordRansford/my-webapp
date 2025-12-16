"use client";

import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";

const threats = ["Credential theft", "Insider misuse", "Ransomware", "Supply chain"];
const controls = ["MFA", "Least privilege", "Network segmentation", "Backup and recovery", "Monitoring"];

export default function ControlSelectionTool() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "practitioner-control-selection",
    initial_state: { mapping: {} },
  });

  if (!is_ready) return <p className="text-sm text-gray-600">Loading.</p>;

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">Match threats to primary controls. Aim for layered protection.</p>

      <div className="space-y-3">
        {threats.map((t) => (
          <div key={t} className="rounded-lg border px-3 py-3 bg-gray-50">
            <div className="font-semibold text-gray-900">{t}</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {controls.map((c) => {
                const key = `${t}-${c}`;
                const active = state.mapping?.[key];
                return (
                  <button
                    key={c}
                    onClick={() =>
                      set_state((prev) => ({
                        ...prev,
                        mapping: { ...prev.mapping, [key]: !active },
                      }))
                    }
                    className={`px-3 py-1 rounded-full border text-xs ${
                      active ? "bg-blue-100 border-blue-400 text-blue-800" : "border-gray-200 text-gray-700"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
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
