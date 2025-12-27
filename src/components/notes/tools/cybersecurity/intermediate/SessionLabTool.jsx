"use client";

import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";
import { CheckPill } from "@/components/ui/CheckPill";

export default function SessionLabTool() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "session-lab",
    initial_state: { stolen: false, expiresIn: 15 },
  });

  if (!is_ready) return <p className="text-sm text-gray-600">Loading.</p>;

  const expiryText = state.expiresIn <= 5 ? "High risk: long-lived session" : "Safer: short session lifetime";

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">Adjust session lifetime and see why stolen tokens are dangerous.</p>

      <div className="max-w-xs">
        <CheckPill checked={state.stolen} onCheckedChange={(stolen) => set_state((prev) => ({ ...prev, stolen }))} tone="rose">
          Token stolen
        </CheckPill>
      </div>

      <label className="block space-y-1">
        <span className="text-xs uppercase tracking-wide text-gray-500">Session lifetime (minutes)</span>
        <input
          type="range"
          min="1"
          max="60"
          value={state.expiresIn}
          onChange={(e) => set_state((prev) => ({ ...prev, expiresIn: Number(e.target.value) }))}
          className="w-full"
        />
        <div className="text-sm">{state.expiresIn} minutes</div>
      </label>

      <div className="rounded-lg border px-3 py-2 bg-white">
        <div className="text-xs font-semibold text-gray-700">Outcome</div>
        <p className="text-gray-800">
          {state.stolen
            ? `Attacker can reuse the token for ${state.expiresIn} minutes or until revoked.`
            : "Token is not stolen; exposure is limited to normal use."}
        </p>
        <p className="text-xs text-gray-600 mt-1">{expiryText}</p>
      </div>

      <ToolStateActions onReset={reset} onCopy={copy_share_link} onExport={export_json} onImport={import_json} />
    </div>
  );
}
