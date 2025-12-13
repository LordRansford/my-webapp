"use client";

import { useMemo } from "react";
import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";

const scenarios = [
  { id: "phish", text: "Phishing email steals credentials" },
  { id: "ransom", text: "Ransomware encrypts file server" },
  { id: "leak", text: "Misconfigured bucket exposes data" },
];

const goals = ["Confidentiality", "Integrity", "Availability", "Trust"];

export default function SecurityGoalsSorter() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "security-goals-sorter",
    initial_state: { answers: {} },
  });

  if (!is_ready) return <p className="text-sm text-gray-600">Loading.</p>;

  const answers = state.answers;

  const coverage = useMemo(() => {
    const filled = Object.keys(answers).length;
    return Math.round((filled / scenarios.length) * 100);
  }, [answers]);

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">
        Match each incident to the primary harm. You can pick more than one, but choose the main one first.
      </p>

      <div className="space-y-3">
        {scenarios.map((s) => (
          <div key={s.id} className="rounded-lg border px-3 py-3">
            <p className="font-medium text-gray-900 mb-2">{s.text}</p>
            <div className="flex flex-wrap gap-2">
              {goals.map((g) => {
                const active = answers[s.id] === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() =>
                      set_state((prev) => ({
                        ...prev,
                        answers: {
                          ...prev.answers,
                          [s.id]: prev.answers[s.id] === g ? undefined : g,
                        },
                      }))
                    }
                    className={`px-3 py-1 rounded-full border text-xs ${
                      active ? "border-blue-500 text-blue-700 bg-blue-50" : "border-gray-200 text-gray-700"
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Pick the main harm; secondary harms often follow.
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border px-3 py-3 bg-gray-50 leading-6">
        <div className="font-semibold text-gray-800 mb-1">Progress</div>
        <p className="text-gray-700">
          {coverage}% complete. Aim to explain why you chose each harm in one sentence.
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
