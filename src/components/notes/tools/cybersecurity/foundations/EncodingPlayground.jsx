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

  // Encoding functions
  function toAscii(str) {
    return str.split('').map(c => c.charCodeAt(0)).join(' ');
  }

  function toUtf8(str) {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(str);
    return Array.from(bytes).join(' ');
  }

  function toBase64(str) {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch {
      return "Error encoding";
    }
  }

  function toHex(str) {
    return str.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
  }

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">
        Enter text to see how different encoding schemes represent the same information. Notice how special characters and emojis behave differently.
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
          <div className="font-semibold text-blue-900 mb-1">ASCII (decimal)</div>
          <div className="font-mono text-xs break-all text-blue-800">{toAscii(input)}</div>
          <div className="text-xs text-blue-700 mt-1">Character codes from 0-127 standard ASCII range</div>
        </div>

        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="font-semibold text-green-900 mb-1">UTF-8 (bytes)</div>
          <div className="font-mono text-xs break-all text-green-800">{toUtf8(input)}</div>
          <div className="text-xs text-green-700 mt-1">Variable-length encoding supporting all Unicode characters</div>
        </div>

        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
          <div className="font-semibold text-purple-900 mb-1">Base64</div>
          <div className="font-mono text-xs break-all text-purple-800">{toBase64(input)}</div>
          <div className="text-xs text-purple-700 mt-1">Binary-to-text encoding, often used in URLs and APIs</div>
        </div>

        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
          <div className="font-semibold text-amber-900 mb-1">Hexadecimal</div>
          <div className="font-mono text-xs break-all text-amber-800">{toHex(input)}</div>
          <div className="text-xs text-amber-700 mt-1">Base-16 representation, each byte shown as two hex digits</div>
        </div>
      </div>

      <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
        <div className="font-semibold text-yellow-900 mb-2">💡 Security Insight</div>
        <p className="text-xs text-yellow-800">
          Attackers sometimes use encoding to bypass basic filters. For example, SQL injection payloads can be hex-encoded or URL-encoded to evade detection. Understanding encoding helps you spot obfuscated malicious input.
        </p>
        <p className="text-xs text-yellow-800 mt-2">
          <strong>Example:</strong> The SQL command <code className="bg-yellow-200 px-1">SELECT</code> could be encoded as <code className="bg-yellow-200 px-1">%53%45%4C%45%43%54</code> (URL encoding) to bypass naive filters looking for plain text keywords.
        </p>
      </div>

      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
        <div className="font-semibold text-slate-900 mb-2">Try these examples:</div>
        <div className="space-y-1 text-xs">
          <button onClick={() => set_state({ input: "SELECT * FROM users" })} className="text-blue-600 hover:underline block">
            • SQL command (watch how encoding could hide it)
          </button>
          <button onClick={() => set_state({ input: "<script>alert('XSS')</script>" })} className="text-blue-600 hover:underline block">
            • XSS payload (observe HTML encoding needs)
          </button>
          <button onClick={() => set_state({ input: "admin' OR '1'='1" })} className="text-blue-600 hover:underline block">
            • SQL injection attempt
          </button>
          <button onClick={() => set_state({ input: "Hello 世界 🌍" })} className="text-blue-600 hover:underline block">
            • Mixed character sets (ASCII + Unicode + Emoji)
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
