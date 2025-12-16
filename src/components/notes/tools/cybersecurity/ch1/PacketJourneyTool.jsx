"use client";

import { useMemo } from "react";
import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";

const stages = ["Split into packets", "Add headers", "Route hop by hop", "Reassemble", "Deliver to app"];

export default function PacketJourneyTool() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "packet-journey-tool",
    initial_state: { step: 0 },
  });

  const step = state.step ?? 0;

  const info = useMemo(() => {
    return [
      "Large messages are cut into packets to survive loss and allow routing.",
      "Headers carry addressing and ordering. Payload stays separate.",
      "Routers forward based on headers. Each hop is a trust boundary.",
      "Receiver orders packets and detects gaps.",
      "Application reads the payload after transport checks succeed.",
    ][step];
  }, [step]);

  if (!is_ready) return <p className="text-sm text-gray-600">Loading.</p>;

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">Step through how a packet moves. Watch how headers and payload flow separately.</p>

      <div className="flex items-center gap-3">
        <button
          className="rounded-full border px-3 py-1 text-xs text-gray-700 disabled:opacity-50"
          onClick={() => set_state((prev) => ({ ...prev, step: Math.max(0, step - 1) }))}
          disabled={step === 0}
        >
          Previous
        </button>
        <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
          <div className="h-full bg-blue-500 transition-all" style={{ width: `${((step + 1) / stages.length) * 100}%` }} />
        </div>
        <button
          className="rounded-full border px-3 py-1 text-xs text-gray-700 disabled:opacity-50"
          onClick={() => set_state((prev) => ({ ...prev, step: Math.min(stages.length - 1, step + 1) }))}
          disabled={step === stages.length - 1}
        >
          Next
        </button>
      </div>

      <ol className="space-y-2 text-gray-800">
        {stages.map((s, idx) => (
          <li
            key={s}
            className={`rounded-lg border px-3 py-2 ${idx === step ? "border-blue-400 bg-blue-50" : "bg-white"}`}
          >
            <div className="text-xs uppercase tracking-wide text-gray-500">Step {idx + 1}</div>
            <div className="font-medium">{s}</div>
          </li>
        ))}
      </ol>

      <div className="rounded-lg border px-3 py-2 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700">What to notice</div>
        <p className="text-gray-800">{info}</p>
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
