"use client";

import { useMemo } from "react";
import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";

const layers = {
  application: {
    name: "Application layer (e.g., end-to-end app encryption)",
    protects: "Payload and app-specific metadata",
    exposes: "Transport headers, IP/port, timing",
  },
  transport: {
    name: "Transport layer (e.g., TLS)",
    protects: "Payload and most application metadata",
    exposes: "IP/port, SNI or endpoint hints, timing",
  },
  network: {
    name: "Network layer (e.g., IPsec tunnel)",
    protects: "Payload and transport headers",
    exposes: "Outer IP addresses, timing, tunnel endpoints",
  },
};

export default function EncryptionPlacementTool() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "encryption-placement-tool",
    initial_state: { layer: "transport" },
  });

  const current = useMemo(() => layers[state.layer], [state.layer]);

  if (!is_ready) return <p className="text-sm text-gray-600">Loading.</p>;

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">Choose where encryption sits and see what an observer can still learn.</p>

      <div className="flex flex-wrap gap-2">
        {Object.keys(layers).map((key) => (
          <button
            key={key}
            onClick={() => set_state((prev) => ({ ...prev, layer: key }))}
            className={`rounded-full border px-3 py-1 text-xs ${
              state.layer === key ? "bg-blue-600 text-white" : "text-gray-700 bg-white"
            }`}
          >
            {layers[key].name.split(" ")[0]}
          </button>
        ))}
      </div>

      <div className="rounded-lg border px-3 py-3 bg-gray-50">
        <div className="text-xs uppercase tracking-wide text-gray-500">Placement</div>
        <div className="font-semibold text-gray-900">{current.name}</div>
        <p className="text-xs text-gray-600 mt-1">Protects: {current.protects}</p>
        <p className="text-xs text-gray-600">Still visible: {current.exposes}</p>
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
