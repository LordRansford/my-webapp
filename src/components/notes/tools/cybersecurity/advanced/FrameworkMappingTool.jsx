"use client";

import { useMemo } from "react";
import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";

const CONTROLS = [
  { id: "asset-inventory", label: "Asset inventory", hint: "Know what you own and where it lives." },
  { id: "access-reviews", label: "Access reviews", hint: "Check who can reach sensitive systems." },
  { id: "logging", label: "Security logging", hint: "Collect and retain audit evidence." },
  { id: "incident-playbook", label: "Incident playbook", hint: "Document response steps and owners." },
  { id: "backup-recovery", label: "Backup and recovery", hint: "Restore safely after a failure or attack." },
];

const CATEGORIES = ["Identify", "Protect", "Detect", "Respond", "Recover"];

export default function FrameworkMappingTool() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "framework-mapping-tool",
    initial_state: { mapping: {} },
  });

  const summary = useMemo(() => {
    const counts = Object.fromEntries(CATEGORIES.map((c) => [c, 0]));
    Object.values(state.mapping || {}).forEach((category) => {
      if (counts[category] !== undefined) counts[category] += 1;
    });
    return counts;
  }, [state.mapping]);

  if (!is_ready) return <p className="text-sm text-gray-600">Loading.</p>;

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">
        Map each control to the NIST CSF function that fits best. This is a thinking exercise, not a strict rule.
      </p>

      <div className="grid gap-3">
        {CONTROLS.map((control) => (
          <label key={control.id} className="block rounded-lg border bg-gray-50 px-3 py-3">
            <div className="font-medium text-gray-900">{control.label}</div>
            <div className="text-xs text-gray-600">{control.hint}</div>
            <select
              className="mt-2 w-full rounded-md border px-2 py-2 text-sm"
              value={state.mapping?.[control.id] || ""}
              onChange={(e) =>
                set_state((prev) => ({
                  ...prev,
                  mapping: { ...prev.mapping, [control.id]: e.target.value },
                }))
              }
            >
              <option value="">Choose a category</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <div className="rounded-lg border bg-white px-3 py-3">
        <div className="text-xs font-semibold text-gray-700">Coverage snapshot</div>
        <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORIES.map((category) => (
            <div key={category} className="rounded-md border bg-gray-50 px-2 py-2 text-xs text-gray-800">
              <div className="font-semibold">{category}</div>
              <div>{summary[category]} mapped control{summary[category] === 1 ? "" : "s"}</div>
            </div>
          ))}
        </div>
      </div>

      <ToolStateActions onReset={reset} onCopy={copy_share_link} onExport={export_json} onImport={import_json} />
    </div>
  );
}
