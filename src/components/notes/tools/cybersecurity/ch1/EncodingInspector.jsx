'use client'

import { useMemo, useState } from "react";

export default function EncodingInspector() {
  const [input, setInput] = useState("A € 😊");
  const bytes = useMemo(() => {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(input || "");
    return Array.from(encoded);
  }, [input]);

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
          onChange={(e) => setInput(e.target.value)}
        />
      </label>

      <div className="rounded-lg border px-3 py-3 bg-gray-50 leading-6">
        <div className="font-semibold text-gray-800 mb-1">Bytes (UTF-8)</div>
        <div className="font-mono text-[13px] text-gray-900 break-words">
          {bytes.join(" ")}
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Length: {bytes.length} byte{bytes.length === 1 ? "" : "s"}.
          ASCII stays 1 byte per character; many symbols and emojis use more.
        </p>
      </div>
    </div>
  );
}
