"use client";

import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";
import { useEffect, useState } from "react";

export default function HashingEncryptionLab() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "hashing-encryption-lab",
    initial_state: { mode: "hash", input: "password123" },
  });

  const [copied, setCopied] = useState({});
  const [hashes, setHashes] = useState({});

  const input = state.input || "";
  const mode = state.mode || "hash";

  // Simple hash simulation (browser crypto API for real hashing)
  async function computeHash(algorithm, text) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      let hashBuffer;
      
      if (algorithm === "MD5") {
        // MD5 not available in WebCrypto, show placeholder
        return "MD5: (demonstration only - 5f4dcc3b5aa765d61d8327deb882cf99)";
      } else if (algorithm === "SHA-1") {
        hashBuffer = await crypto.subtle.digest("SHA-1", data);
      } else if (algorithm === "SHA-256") {
        hashBuffer = await crypto.subtle.digest("SHA-256", data);
      }
      
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      return "Error computing hash";
    }
  }

  // Compute hashes on input change
  useEffect(() => {
    let cancelled = false;

    if (!input) {
      setHashes({});
      return () => {
        cancelled = true;
      };
    }

    computeHash("SHA-1", input).then((h) => {
      if (cancelled) return;
      setHashes((prev) => ({ ...prev, "SHA-1": h }));
    });
    computeHash("SHA-256", input).then((h) => {
      if (cancelled) return;
      setHashes((prev) => ({ ...prev, "SHA-256": h }));
    });

    return () => {
      cancelled = true;
    };
  }, [input]);

  function copyHash(hash) {
    navigator.clipboard.writeText(hash);
    setCopied({ [hash]: true });
    setTimeout(() => setCopied({}), 2000);
  }

  if (!is_ready) return <p className="text-sm text-gray-600">Loading...</p>;

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">
        Understand the difference between hashing (one-way) and encryption (two-way). Both are critical for security, but serve different purposes.
      </p>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => set_state({ ...state, mode: "hash" })}
          className={`px-4 py-2 rounded-md font-medium ${
            mode === "hash" 
              ? "bg-blue-600 text-white" 
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Hashing Demo
        </button>
        <button
          onClick={() => set_state({ ...state, mode: "encrypt" })}
          className={`px-4 py-2 rounded-md font-medium ${
            mode === "encrypt" 
              ? "bg-blue-600 text-white" 
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Encryption Demo
        </button>
      </div>

      {mode === "hash" && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Password or text to hash</label>
            <input
              type="text"
              value={input}
              onChange={(e) => set_state({ ...state, input: e.target.value })}
              placeholder="Enter text..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex justify-between items-start mb-1">
                <div className="font-semibold text-red-900">MD5 (BROKEN - Do not use)</div>
                <span className="text-xs text-red-700">⚠️ Deprecated</span>
              </div>
              <div className="font-mono text-xs break-all text-red-800">
                5f4dcc3b5aa765d61d8327deb882cf99
              </div>
              <div className="text-xs text-red-700 mt-2">
                Cryptographically broken since 2004. Collisions easily found. Never use for security.
              </div>
            </div>

            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex justify-between items-start mb-1">
                <div className="font-semibold text-orange-900">SHA-1 (Weak - Avoid)</div>
                <span className="text-xs text-orange-700">⚠️ Deprecated</span>
              </div>
              <div className="font-mono text-xs break-all text-orange-800">
                {hashes["SHA-1"] || "Computing..."}
              </div>
              <div className="text-xs text-orange-700 mt-2">
                Collision attacks practical since 2017. Google deprecated it. Legacy systems only.
              </div>
            </div>

            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex justify-between items-start mb-1">
                <div className="font-semibold text-green-900">SHA-256 (Strong ✓)</div>
                <button
                  onClick={() => copyHash(hashes["SHA-256"])}
                  className="text-xs text-green-700 hover:underline"
                >
                  {copied[hashes["SHA-256"]] ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="font-mono text-xs break-all text-green-800">
                {hashes["SHA-256"] || "Computing..."}
              </div>
              <div className="text-xs text-green-700 mt-2">
                Industry standard. No known practical attacks. Use for file integrity, digital signatures.
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="font-semibold text-blue-900 mb-1">bcrypt / Argon2 (Password Hashing)</div>
              <div className="font-mono text-xs break-all text-blue-800">
                $2b$10$abcdefghijklmnopqrstuv... (demonstration)
              </div>
              <div className="text-xs text-blue-700 mt-2">
                <strong>Key feature:</strong> Intentionally slow with salt. Makes brute-force attacks impractical. Use these for password storage, not SHA-256!
              </div>
            </div>
          </div>

          <div className="p-4 bg-purple-50 border border-purple-300 rounded-lg">
            <div className="font-semibold text-purple-900 mb-2">🔍 Rainbow Table Attack</div>
            <p className="text-xs text-purple-800 mb-2">
              Rainbow tables are precomputed hash databases. If you hash &quot;password123&quot; with SHA-256, an attacker can look it up instantly.
            </p>
            <p className="text-xs text-purple-800">
              <strong>Defense:</strong> Add a random &quot;salt&quot; before hashing. Same password, different salt = different hash. bcrypt/Argon2 do this automatically.
            </p>
          </div>
        </div>
      )}

      {mode === "encrypt" && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Message to encrypt</label>
            <input
              type="text"
              value={input}
              onChange={(e) => set_state({ ...state, input: e.target.value })}
              placeholder="Enter message..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="font-semibold text-slate-900 mb-1">Original Message</div>
            <div className="font-mono text-sm text-slate-800">{input || "(empty)"}</div>
          </div>

          <div className="flex items-center justify-center py-2">
            <div className="text-2xl">🔐 Encrypt with key</div>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="font-semibold text-blue-900 mb-1">Encrypted (Ciphertext)</div>
            <div className="font-mono text-xs break-all text-blue-800">
              U2FsdGVkX1+abc...xyz123 (demonstration)
            </div>
            <div className="text-xs text-blue-700 mt-2">
              Cannot be read without the decryption key. Data is protected in transit/storage.
            </div>
          </div>

          <div className="flex items-center justify-center py-2">
            <div className="text-2xl">🔓 Decrypt with key</div>
          </div>

          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="font-semibold text-green-900 mb-1">Decrypted Message</div>
            <div className="font-mono text-sm text-green-800">{input || "(empty)"}</div>
            <div className="text-xs text-green-700 mt-2">
              ✓ With correct key, original message is recovered perfectly.
            </div>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
            <div className="font-semibold text-yellow-900 mb-2">Key Differences</div>
            <div className="space-y-2 text-xs text-yellow-800">
              <div className="flex gap-2">
                <span className="font-semibold min-w-24">Hashing:</span>
                <span>One-way transformation. Cannot reverse. Used for integrity, passwords.</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold min-w-24">Encryption:</span>
                <span>Two-way transformation. Can decrypt with key. Used for confidentiality.</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold min-w-24">Use hashing:</span>
                <span>Verify file integrity, store passwords, digital signatures.</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold min-w-24">Use encryption:</span>
                <span>Protect data in transit (HTTPS), at rest (disk encryption), backups.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
        <div className="font-semibold text-slate-900 mb-2">Try these examples:</div>
        <div className="space-y-1 text-xs">
          <button onClick={() => set_state({ ...state, input: "password" })} className="text-blue-600 hover:underline block">
            • &quot;password&quot; - Most common password (easily cracked)
          </button>
          <button onClick={() => set_state({ ...state, input: "P@ssw0rd1!" })} className="text-blue-600 hover:underline block">
            • &quot;P@ssw0rd1!&quot; - Common substitution pattern (still weak)
          </button>
          <button onClick={() => set_state({ ...state, input: "correct horse battery staple" })} className="text-blue-600 hover:underline block">
            • &quot;correct horse battery staple&quot; - XKCD famous passphrase
          </button>
          <button onClick={() => set_state({ ...state, input: "Tr0ub4dor&3" })} className="text-blue-600 hover:underline block">
            • &quot;Tr0ub4dor&amp;3&quot; - Complex but short (compare hash)
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
