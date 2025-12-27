"use client";

import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";
import { Check } from "lucide-react";

const attacks = ["Credential theft", "Lateral movement", "Data exfiltration", "Persistence", "Command and control"];
const signals = ["Auth logs", "Endpoint telemetry", "Network flow", "DNS", "App logs"];

export default function DetectionCoverageTool() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "detection-coverage-tool",
    initial_state: { mapping: {} },
  });

  if (!is_ready) return <p className="text-sm text-gray-600">Loading.</p>;

  const coverage = attacks.map((a) => signals.filter((s) => state.mapping?.[`${a}-${s}`]).length);
  const fullyCovered = coverage.filter((c) => c >= 2).length;

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">Map which signals would detect which attack stage. Aim for at least two signals per attack.</p>

      <div className="overflow-auto rounded-lg border">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="bg-gray-50 text-gray-700">
              <th className="px-3 py-2 text-left">Attack</th>
              {signals.map((s) => (
                <th key={s} className="px-3 py-2 text-left">{s}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attacks.map((a) => (
              <tr key={a} className="border-t">
                <td className="px-3 py-2 font-medium text-gray-900">{a}</td>
                {signals.map((s) => {
                  const key = `${a}-${s}`;
                  const checked = Boolean(state.mapping?.[key]);
                  return (
                    <td key={key} className="px-3 py-2">
                      <MatrixToggleCell
                        checked={checked}
                        label={`${s} for ${a}`}
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

      <div className="rounded-lg border px-3 py-2 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700">Coverage summary</div>
        <p className="text-gray-800">
          {fullyCovered} of {attacks.length} attack stages have at least two signals. Fewer signals means higher false negative risk.
        </p>
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
