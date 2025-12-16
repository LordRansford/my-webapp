"use client";

import { useMemo } from "react";
import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";

export default function EncodingInspector() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "encoding-inspector",
    initial_state: { input: "A ? ??" },
  });

  const input = state?.input ?? "";
  const bytes = useMemo(() => {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(input || "");
    return Array.from(encoded);
  }, [input]);

  if (!is_ready) return <p className="text-sm text-gray-600">Loading.</p>;

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">
        Type characters and see their UTF-8 bytes. Emojis use multiple bytes; ASCII uses one.
      </p>

      <label className="block space-y-1">
        <span className="text-xs uppercase tracking-wide text-gray-500">Text</span>
        <input
          className="w-full rounded-md border px-2 py-2 text-sm"
          value={input}
          onChange={(e) => set_state((prev) => ({ ...prev, input: e.target.value }))}
        />
      </label>

      <div className="rounded-lg border px-3 py-3 bg-gray-50 leading-6">
        <div className="font-semibold text-gray-800 mb-1">Bytes (UTF-8)</div>
        <div className="font-mono text-[13px] text-gray-900 break-words">{bytes.join(" ")}</div>
        <p className="text-xs text-gray-600 mt-2">
          Length: {bytes.length} byte{bytes.length === 1 ? "" : "s"}.
          ASCII stays 1 byte per character; many symbols and emojis use more.
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
