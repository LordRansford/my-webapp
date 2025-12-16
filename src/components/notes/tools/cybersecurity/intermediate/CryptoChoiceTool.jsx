"use client";

import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";

const goals = {
  "Store passwords": "Slow hash with salt (e.g., bcrypt, Argon2), never reversible encryption.",
  "Send secret message": "Symmetric encryption (e.g., AES-GCM) with fresh keys and nonces.",
  "Verify integrity": "Hash (e.g., SHA-256) or HMAC when authenticity also matters.",
  "Prove identity": "Digital signature with asymmetric keys and proper certificate validation.",
  "Exchange keys": "Asymmetric key exchange (e.g., Diffie-Hellman or ECDH).",
};

export default function CryptoChoiceTool() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "crypto-choice-tool",
    initial_state: { goal: "Store passwords" },
  });

  if (!is_ready) return <p className="text-sm text-gray-600">Loading.</p>;

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">Pick a goal and see the appropriate primitive and why.</p>

      <label className="block space-y-1">
        <span className="text-xs uppercase tracking-wide text-gray-500">Goal</span>
        <select
          className="w-full rounded-md border px-2 py-2"
          value={state.goal}
          onChange={(e) => set_state((prev) => ({ ...prev, goal: e.target.value }))}
        >
          {Object.keys(goals).map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
      </label>

      <div className="rounded-lg border px-3 py-2 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700">Recommended</div>
        <p className="text-gray-800">{goals[state.goal]}</p>
        <p className="text-xs text-gray-600 mt-1">Cryptography is a tool. The goal determines the primitive.</p>
      </div>

      <ToolStateActions onReset={reset} onCopy={copy_share_link} onExport={export_json} onImport={import_json} />
    </div>
  );
}
