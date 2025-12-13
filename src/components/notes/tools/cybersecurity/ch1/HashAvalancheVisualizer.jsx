"use client";

import { useMemo } from "react";
import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";

function sha256Hex(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  return crypto.subtle.digest("SHA-256", data).then((buf) =>
    Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  );
}

export default function HashAvalancheVisualizer() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "hash-avalanche",
    initial_state: { input: "hello", baseline: null, result: null, diff: [] },
  });

  const readyState = useMemo(() => state, [state]);

  async function compute() {
    const base = await sha256Hex(state.input);
    const tweaked = await sha256Hex(state.input + "!");
    const diff = [];
    for (let i = 0; i < Math.min(base.length, tweaked.length); i++) {
      if (base[i] !== tweaked[i]) diff.push(i);
    }
    set_state((prev) => ({ ...prev, baseline: base, result: tweaked, diff }));
  }

  if (!is_ready) return <p className="text-sm text-gray-600">Loading.</p>;

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">See how a tiny change makes a very different hash.</p>

      <label className="block space-y-1">
        <span className="text-xs uppercase tracking-wide text-gray-500">Message</span>
        <input
          className="w-full rounded-md border px-2 py-2"
          value={readyState.input}
          onChange={(e) => set_state((prev) => ({ ...prev, input: e.target.value }))}
        />
      </label>

      <button
        onClick={compute}
        className="rounded-full border px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-200"
      >
        Hash and compare
      </button>

      {readyState.baseline ? (
        <div className="grid gap-3 rounded-lg border bg-gray-50 p-3">
          <HashRow label="Original" value={readyState.baseline} />
          <HashRow label="Changed (+!)" value={readyState.result} />
          <p className="text-xs text-gray-600">Differences: {readyState.diff.length} characters moved.</p>
        </div>
      ) : null}

      <ToolStateActions
        onReset={() => reset()}
        onCopy={copy_share_link}
        onExport={export_json}
        onImport={import_json}
      />
    </div>
  );
}

function HashRow({ label, value }) {
  return (
    <div>
      <div className="text-xs font-semibold text-gray-700">{label}</div>
      <div className="font-mono text-[13px] text-gray-900 break-words">{value}</div>
    </div>
  );
}
