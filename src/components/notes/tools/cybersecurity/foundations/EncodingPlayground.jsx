"use client";

import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";

export default function EncodingPlayground() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "encoding-playground",
    initial_state: { input: "Hello World!" },
  });

  if (!is_ready) return <p className="text-sm text-gray-600">Loading...</p>;

  const input = state.input || "";

  // Encoding helpers (UTF-8 bytes are the most honest cross-language view in browsers).
  function toUtf8Bytes(str) {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(str);
    return Array.from(bytes);
  }

  function toBase64(str) {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch {
      return "Error encoding";
    }
  }

  function toAsciiBytesOrMessage(str) {
    // ASCII is a 7-bit encoding (0–127). It cannot represent emojis, accented characters, etc.
    // For non-ASCII text, return a clear message instead of misleading numbers.
    const bytes = toUtf8Bytes(str);
    const isAllAscii = bytes.every((b) => b >= 0 && b <= 127);
    if (!isAllAscii) return "(contains non ASCII characters. ASCII cannot represent this text)";
    return bytes.join(" ");
  }

  function toUtf8Decimal(str) {
    return toUtf8Bytes(str).join(" ");
  }

  function toUtf8Hex(str) {
    return toUtf8Bytes(str).map((b) => b.toString(16).padStart(2, "0")).join(" ");
  }

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">
        Enter text to see how different encodings represent the same information. Watch what happens when you include accents or emojis.
      </p>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Your text</label>
        <input
          type="text"
          value={input}
          onChange={(e) => set_state({ input: e.target.value })}
          placeholder="Enter text here..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
      </div>

      <div className="space-y-3">
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="font-semibold text-blue-900 mb-1">ASCII (bytes, decimal)</div>
          <div className="font-mono text-xs break-all text-blue-800">{toAsciiBytesOrMessage(input)}</div>
          <div className="text-xs text-blue-700 mt-1">ASCII is a 7-bit encoding (0–127). It only covers basic English characters.</div>
        </div>

        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="font-semibold text-green-900 mb-1">UTF-8 (bytes)</div>
          <div className="font-mono text-xs break-all text-green-800">{toUtf8Decimal(input)}</div>
          <div className="text-xs text-green-700 mt-1">UTF-8 is a variable-length encoding for Unicode characters.</div>
        </div>

        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
          <div className="font-semibold text-purple-900 mb-1">Base64</div>
          <div className="font-mono text-xs break-all text-purple-800">{toBase64(input)}</div>
          <div className="text-xs text-purple-700 mt-1">Binary-to-text encoding. It is not encryption. It is commonly used in data formats and APIs.</div>
        </div>

        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
          <div className="font-semibold text-amber-900 mb-1">Hexadecimal (UTF-8 bytes)</div>
          <div className="font-mono text-xs break-all text-amber-800">{toUtf8Hex(input)}</div>
          <div className="text-xs text-amber-700 mt-1">Base-16 representation. Each UTF-8 byte is shown as two hex digits.</div>
        </div>
      </div>

      <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
        <div className="font-semibold text-yellow-900 mb-2">💡 Security Insight</div>
        <p className="text-xs text-yellow-800">
          Encoding can hide what a string looks like at first glance. This matters because naive filters that look for simple keywords can be bypassed by encoded variants.
        </p>
        <p className="text-xs text-yellow-800 mt-2">
          <strong>Safety note</strong> Do not paste suspicious strings into real websites. Use controlled labs and defensive testing processes. The goal here is recognition and safe handling.
        </p>
      </div>

      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
        <div className="font-semibold text-slate-900 mb-2">Try these examples</div>
        <div className="space-y-1 text-xs">
          <button onClick={() => set_state({ input: "SELECT" })} className="text-blue-600 hover:underline block">
            1. A keyword (watch how encodings change the visible characters)
          </button>
          <button onClick={() => set_state({ input: "<script>" })} className="text-blue-600 hover:underline block">
            2. A tag like string (helps explain output encoding vs raw rendering)
          </button>
          <button onClick={() => set_state({ input: "name=alice&role=admin" })} className="text-blue-600 hover:underline block">
            3. URL like parameters (common place where encoding shows up)
          </button>
          <button onClick={() => set_state({ input: "Hello 世界 🌍" })} className="text-blue-600 hover:underline block">
            4. Mixed character sets (ASCII + Unicode + Emoji)
          </button>
        </div>
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
