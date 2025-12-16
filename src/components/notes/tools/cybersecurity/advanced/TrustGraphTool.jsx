"use client";

import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";

const nodes = ["User device", "Service A", "Service B", "Database", "Secrets store"];

export default function TrustGraphTool() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "advanced-trust-graph",
    initial_state: { compromised: "User device", edges: { "User device": ["Service A"] } },
  });

  if (!is_ready) return <p className="text-sm text-gray-600">Loading.</p>;

  const compromised = state.compromised;
  const edges = state.edges || {};

  const reachable = new Set();
  function walk(start) {
    if (!start || reachable.has(start)) return;
    reachable.add(start);
    (edges[start] || []).forEach(walk);
  }
  walk(compromised);

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">Pick a compromised node and add trust edges. See the blast radius grow.</p>

      <label className="block space-y-1">
        <span className="text-xs uppercase tracking-wide text-gray-500">Compromised node</span>
        <select
          className="w-full rounded-md border px-2 py-2"
          value={compromised}
          onChange={(e) => set_state((prev) => ({ ...prev, compromised: e.target.value }))}
        >
          {nodes.map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
      </label>

      <div className="space-y-2">
        {nodes.map((n) => (
          <div key={n} className="rounded-lg border px-3 py-2">
            <div className="text-xs uppercase tracking-wide text-gray-500">Edges from {n}</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {nodes
                .filter((m) => m !== n)
                .map((m) => {
                  const active = edges[n]?.includes(m);
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() =>
                        set_state((prev) => {
                          const current = prev.edges[n] || [];
                          const next = active ? current.filter((x) => x !== m) : [...current, m];
                          return { ...prev, edges: { ...prev.edges, [n]: next } };
                        })
                      }
                      className={`px-3 py-1 rounded-full border text-xs ${
                        active ? "bg-blue-100 border-blue-400 text-blue-800" : "border-gray-200 text-gray-700"
                      }`}
                    >
                      {m}
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border px-3 py-2 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700">Blast radius</div>
        <p className="text-gray-800">
          Compromise of <span className="font-semibold">{compromised}</span> can reach {reachable.size} of {nodes.length} nodes.
        </p>
        <p className="text-xs text-gray-600 mt-1">Reduce edges or permissions to shrink this number.</p>
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
