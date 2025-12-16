"use client";

import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";

const roles = ["User", "Support", "Admin"];
const resources = ["Own profile", "Any profile", "Billing", "System settings"];

const policy = {
  User: ["Own profile"],
  Support: ["Own profile", "Any profile"],
  Admin: ["Own profile", "Any profile", "Billing", "System settings"],
};

export default function AuthzSimulatorTool() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "authz-simulator",
    initial_state: { role: "User", resource: "Own profile" },
  });

  if (!is_ready) return <p className="text-sm text-gray-600">Loading.</p>;

  const allowed = policy[state.role]?.includes(state.resource);

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">Pick a role and resource to see whether access should be allowed.</p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-xs uppercase tracking-wide text-gray-500">Role</span>
          <select
            className="w-full rounded-md border px-2 py-2"
            value={state.role}
            onChange={(e) => set_state((prev) => ({ ...prev, role: e.target.value }))}
          >
            {roles.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-xs uppercase tracking-wide text-gray-500">Resource</span>
          <select
            className="w-full rounded-md border px-2 py-2"
            value={state.resource}
            onChange={(e) => set_state((prev) => ({ ...prev, resource: e.target.value }))}
          >
            {resources.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="rounded-lg border px-3 py-2 bg-white">
        <div className="text-xs font-semibold text-gray-700">Decision</div>
        <p className={`font-semibold ${allowed ? "text-green-700" : "text-red-700"}`}>
          {allowed ? "Allow" : "Deny"}
        </p>
        <p className="text-xs text-gray-600 mt-1">
          {allowed
            ? "Matches policy for this role."
            : "This would be broken access control if allowed."}
        </p>
      </div>

      <ToolStateActions onReset={reset} onCopy={copy_share_link} onExport={export_json} onImport={import_json} />
    </div>
  );
}
