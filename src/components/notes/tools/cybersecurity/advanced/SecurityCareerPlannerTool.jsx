"use client";

import { useMemo } from "react";
import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";
import { CheckPill } from "@/components/ui/CheckPill";

const PATHS = [
  {
    id: "incident",
    label: "Incident response",
    skills: ["Log triage", "Containment steps", "Clear comms under pressure"],
    next: "Run a tabletop exercise or write a short incident summary.",
  },
  {
    id: "cloud",
    label: "Cloud security",
    skills: ["Identity and access reviews", "Network segmentation", "Logging for cloud services"],
    next: "Review a cloud account and list the top three misconfig risks.",
  },
  {
    id: "appsec",
    label: "Application security",
    skills: ["Threat modeling", "Auth and session flows", "Secure coding habits"],
    next: "Trace a login flow and list each trust boundary.",
  },
  {
    id: "governance",
    label: "Governance and risk",
    skills: ["Control objectives", "Risk appetite language", "Evidence and audit trails"],
    next: "Map one control to a framework and draft the evidence you would show.",
  },
];

export default function SecurityCareerPlannerTool() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "security-career-planner",
    initial_state: { selected: {} },
  });

  const selected = useMemo(
    () => PATHS.filter((path) => state.selected?.[path.id]),
    [state.selected]
  );

  if (!is_ready) return <p className="text-sm text-gray-600">Loading.</p>;

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">
        Pick one or two paths you are curious about. The tool will surface skills and a next step to test interest.
      </p>

      <div className="grid gap-2 sm:grid-cols-2">
        {PATHS.map((path) => (
          <CheckPill
            key={path.id}
            checked={Boolean(state.selected?.[path.id])}
            onCheckedChange={(checked) =>
              set_state((prev) => ({
                ...prev,
                selected: { ...prev.selected, [path.id]: checked },
              }))
            }
            tone="emerald"
            className="justify-start"
          >
            {path.label}
          </CheckPill>
        ))}
      </div>

      <div className="rounded-lg border bg-white px-3 py-3">
        <div className="text-xs font-semibold text-gray-700">Your draft path</div>
        {selected.length === 0 ? (
          <p className="text-sm text-gray-700 mt-2">Select a path to see suggested skills and a next step.</p>
        ) : (
          <div className="mt-2 grid gap-3">
            {selected.map((path) => (
              <div key={path.id} className="rounded-lg border bg-gray-50 px-3 py-3">
                <div className="text-sm font-semibold text-gray-900">{path.label}</div>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-gray-700">
                  {path.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-gray-700">Next step: {path.next}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <ToolStateActions onReset={reset} onCopy={copy_share_link} onExport={export_json} onImport={import_json} />
    </div>
  );
}
