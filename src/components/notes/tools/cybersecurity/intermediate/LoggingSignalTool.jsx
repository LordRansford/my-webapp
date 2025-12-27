"use client";

import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";
import { Check } from "lucide-react";

const scenarios = [
  { id: "login", text: "Unusual login" },
  { id: "privilege", text: "Privilege change" },
  { id: "data", text: "Sensitive data access" },
];
const signals = ["Auth logs", "App logs", "Network flow", "Endpoint", "Alerting"];

export default function LoggingSignalTool() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "logging-signal-tool",
    initial_state: { mapping: {} },
  });

  if (!is_ready) return <p className="text-sm text-gray-600">Loading.</p>;

  const coverage = scenarios.map((s) => signals.filter((sig) => state.mapping?.[`${s.id}-${sig}`]).length);
  const good = coverage.filter((c) => c >= 2).length;

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">Assign at least two signals to each scenario to keep detection reliable.</p>

      <div className="overflow-auto rounded-lg border">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="bg-gray-50 text-gray-700">
              <th className="px-3 py-2 text-left">Scenario</th>
              {signals.map((sig) => (
                <th key={sig} className="px-3 py-2 text-left">{sig}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scenarios.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="px-3 py-2 font-medium text-gray-900">{s.text}</td>
                {signals.map((sig) => {
                  const key = `${s.id}-${sig}`;
                  const checked = Boolean(state.mapping?.[key]);
                  return (
                    <td key={key} className="px-3 py-2">
                      <MatrixToggleCell
                        checked={checked}
                        label={`${sig} for ${s.text}`}
                        onCheckedChange={(next) =>
                          set_state((prev) => ({
                            ...prev,
                            mapping: { ...prev.mapping, [key]: next },
                          }))
                        }
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border px-3 py-2 bg-white">
        <div className="text-xs font-semibold text-gray-700">Coverage summary</div>
        <p className="text-gray-800">
          {good} of {scenarios.length} scenarios have two or more signals. Single-signal coverage risks false negatives.
        </p>
      </div>

      <ToolStateActions onReset={reset} onCopy={copy_share_link} onExport={export_json} onImport={import_json} />
    </div>
  );
}

function MatrixToggleCell({ checked, onCheckedChange, label }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onCheckedChange(!checked)}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border text-slate-700 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-emerald-200 ${
        checked ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-700" : "border-slate-200 bg-white hover:bg-slate-50"
      }`}
    >
      {checked ? <Check className="h-4 w-4" aria-hidden="true" /> : null}
    </button>
  );
}
