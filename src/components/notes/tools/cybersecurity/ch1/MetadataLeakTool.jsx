"use client";

import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";
import { CheckPill } from "@/components/ui/CheckPill";

const signals = [
  { id: "addresses", label: "Source and destination addresses" },
  { id: "timing", label: "Timing and frequency" },
  { id: "size", label: "Message size patterns" },
  { id: "dns", label: "DNS lookups" },
];

export default function MetadataLeakTool() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "metadata-leak-tool",
    initial_state: { encrypted: true, observed: {} },
  });

  const encrypted = state.encrypted ?? true;
  const observed = state.observed || {};

  if (!is_ready) return <p className="text-sm text-gray-600">Loading.</p>;

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">
        Toggle encryption and see which signals remain visible to an observer. Payload secrecy does not hide behaviour.
      </p>

      <CheckPill checked={encrypted} onCheckedChange={(v) => set_state((prev) => ({ ...prev, encrypted: v }))} tone="emerald">
        Payload encrypted
      </CheckPill>

      <div className="space-y-2">
        {signals.map((s) => (
          <CheckPill
            key={s.id}
            checked={Boolean(observed[s.id])}
            onCheckedChange={(checked) =>
              set_state((prev) => ({
                ...prev,
                observed: { ...prev.observed, [s.id]: checked },
              }))
            }
            tone="violet"
            className="justify-start"
          >
            {s.label}
          </CheckPill>
        ))}
      </div>

      <div className="rounded-lg border px-3 py-2 bg-white">
        <div className="text-xs font-semibold text-gray-700">What the observer sees</div>
        <ul className="mt-1 space-y-1 text-gray-800">
          {signals.map((s) => (
            <li key={s.id}>
              {s.label}:{" "}
              <span className="font-medium">
                {encrypted
                  ? observed[s.id]
                    ? "Still visible"
                    : "Hidden if channel metadata is protected"
                  : "Visible because traffic is plaintext"}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-gray-600 mt-2">
          Even with encryption on, traffic analysis can reveal patterns. Reduce metadata leaks with padding, aggregation,
          or different placement of encryption.
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
