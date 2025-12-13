"use client";

import { useMemo } from "react";
import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";

export default function BitFlipVisualizer() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "bit-flip-visualizer",
    initial_state: { bits: Array(8).fill(0) },
  });

  const value = useMemo(
    () =>
      state.bits.reduce((sum, bit, idx) => {
        const power = 7 - idx;
        return sum + bit * Math.pow(2, power);
      }, 0),
    [state.bits]
  );

  if (!is_ready) return <p className="text-sm text-gray-600">Loading.</p>;

  const toggleBit = (index) => {
    set_state((prev) => ({
      ...prev,
      bits: prev.bits.map((b, i) => (i === index ? (b === 1 ? 0 : 1) : b)),
    }));
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-700">
        Toggle bits to see how binary values change. The leftmost bit is the most significant.
      </div>

      <div className="flex gap-2 flex-wrap">
        {state.bits.map((bit, idx) => (
          <button
            key={idx}
            onClick={() => toggleBit(idx)}
            className={`w-10 h-10 rounded-md border text-lg font-mono transition ${
              bit === 1 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
            }`}
            aria-label={`Bit ${idx}`}
          >
            {bit}
          </button>
        ))}
      </div>

      <div className="text-sm">
        Decimal value: <span className="font-semibold">{value}</span>
      </div>

      <ToolStateActions
        onReset={() => reset()}
        onCopy={copy_share_link}
        onExport={export_json}
        onImport={import_json}
      />
    </div>
  );
}
