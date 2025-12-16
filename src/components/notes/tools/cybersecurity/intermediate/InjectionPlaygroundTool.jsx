"use client";

import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";

export default function InjectionPlaygroundTool() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "injection-playground",
    initial_state: { input: "hello'; DROP TABLE users; --", mode: "unsafe" },
  });

  if (!is_ready) return <p className="text-sm text-gray-600">Loading.</p>;

  const sanitized = state.input.replace(/['";]/g, "");
  const unsafeResult = `Interpreter runs: SELECT * FROM items WHERE name = '${state.input}'`;
  const safeResult = `Interpreter runs: SELECT * FROM items WHERE name = ? with value [${sanitized}]`;

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">Toggle between unsafe string concatenation and safe parameterised handling.</p>

      <label className="block space-y-1">
        <span className="text-xs uppercase tracking-wide text-gray-500">Input</span>
        <input
          className="w-full rounded-md border px-2 py-2"
          value={state.input}
          onChange={(e) => set_state((prev) => ({ ...prev, input: e.target.value }))}
        />
      </label>

      <div className="flex gap-2">
        {["unsafe", "safe"].map((m) => (
          <button
            key={m}
            onClick={() => set_state((prev) => ({ ...prev, mode: m }))}
            className={`rounded-full border px-3 py-1 text-xs ${
              state.mode === m ? "bg-blue-600 text-white" : "text-gray-700 bg-white"
            }`}
          >
            {m === "unsafe" ? "Treat as code (unsafe)" : "Treat as data (safe)"}
          </button>
        ))}
      </div>

      <div className="rounded-lg border px-3 py-3 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700">What the interpreter sees</div>
        <p className="font-mono text-[13px] text-gray-900 break-words">
          {state.mode === "unsafe" ? unsafeResult : safeResult}
        </p>
        <p className="text-xs text-gray-600 mt-2">
          Safe handling uses parameters so input cannot change the command structure.
        </p>
      </div>

      <ToolStateActions onReset={reset} onCopy={copy_share_link} onExport={export_json} onImport={import_json} />
    </div>
  );
}
