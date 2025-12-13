"use client";

import { useMemo } from "react";
import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";

export default function EntropySimulator() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "entropy-simulator",
    initial_state: { length: 12, charset: "lower+upper+digits" },
  });

  const charsets = {
    lower: 26,
    "lower+upper": 52,
    "lower+upper+digits": 62,
    "lower+upper+digits+symbols": 90,
  };

  const charsetSize = charsets[state.charset] || 26;
  const entropy = useMemo(() => state.length * Math.log2(charsetSize), [state.length, charsetSize]);

  if (!is_ready) return <p className="text-sm text-gray-600">Loading.</p>;

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">
        Adjust length and character set to see estimated entropy (guessing difficulty). This is a simplified model.
      </p>

      <label className="block space-y-1">
        <span className="text-xs uppercase tracking-wide text-gray-500">Length</span>
        <input
          type="range"
          min="4"
          max="32"
          value={state.length}
          onChange={(e) => set_state((prev) => ({ ...prev, length: Number(e.target.value) }))}
          className="w-full"
        />
        <div className="text-sm">{state.length} characters</div>
      </label>

      <label className="block space-y-1">
        <span className="text-xs uppercase tracking-wide text-gray-500">Character set</span>
        <select
          className="w-full rounded-md border px-2 py-2 text-sm"
          value={state.charset}
          onChange={(e) => set_state((prev) => ({ ...prev, charset: e.target.value }))}
        >
          <option value="lower">Lowercase only</option>
          <option value="lower+upper">Lowercase + uppercase</option>
          <option value="lower+upper+digits">Letters + digits</option>
          <option value="lower+upper+digits+symbols">Letters + digits + symbols</option>
        </select>
      </label>

      <div className="rounded-lg border px-3 py-3 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700">Estimated entropy</div>
        <div className="text-2xl font-semibold text-gray-900 mt-1">{entropy.toFixed(1)} bits</div>
        <p className="text-xs text-gray-600 mt-1">
          Formula: H = L \times log2(N) where L is length and N is character set size.
        </p>
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
