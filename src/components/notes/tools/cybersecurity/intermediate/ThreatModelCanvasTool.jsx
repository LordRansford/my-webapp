"use client";

import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";

const assets = ["Credentials", "Personal data", "Money flow", "Availability"];
const actors = ["Curious user", "Insider", "Criminal", "Targeted attacker"];
const surfaces = ["Login", "API", "File upload", "Admin console"];

export default function ThreatModelCanvasTool() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "intermediate-threat-model",
    initial_state: { assets: [], actors: [], surfaces: [] },
  });

  if (!is_ready) return <p className="text-sm text-gray-600">Loading.</p>;

  const coverage =
    ["assets", "actors", "surfaces"].reduce((sum, key) => sum + (state[key]?.length ? 1 : 0), 0) / 3;

  const toggle = (key, item) => {
    set_state((prev) => {
      const list = new Set(prev[key] || []);
      if (list.has(item)) list.delete(item);
      else list.add(item);
      return { ...prev, [key]: Array.from(list) };
    });
  };

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">Select what matters, who might attack, and where they could enter.</p>

      <Choice title="Assets" items={assets} selected={state.assets} onToggle={(i) => toggle("assets", i)} />
      <Choice title="Threat actors" items={actors} selected={state.actors} onToggle={(i) => toggle("actors", i)} />
      <Choice title="Entry points" items={surfaces} selected={state.surfaces} onToggle={(i) => toggle("surfaces", i)} />

      <div className="rounded-lg border px-3 py-2 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700">Canvas completeness</div>
        <p className="text-gray-800">{Math.round(coverage * 100)}% filled. Ensure each column has at least one item.</p>
      </div>

      <ToolStateActions onReset={reset} onCopy={copy_share_link} onExport={export_json} onImport={import_json} />
    </div>
  );
}

function Choice({ title, items, selected = [], onToggle }) {
  return (
    <div className="rounded-lg border px-3 py-2 bg-white">
      <div className="text-xs uppercase tracking-wide text-gray-500">{title}</div>
      <div className="flex flex-wrap gap-2 mt-2">
        {items.map((item) => {
          const active = selected.includes(item);
          return (
            <button
              key={item}
              onClick={() => onToggle(item)}
              className={`px-3 py-1 rounded-full border text-xs ${
                active ? "bg-blue-100 border-blue-400 text-blue-800" : "border-gray-200 text-gray-700"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}
