"use client";

import React, { useMemo, useState } from "react";
import { Hash, RefreshCw } from "lucide-react";

async function hashText(text, algorithm = "SHA-256") {
  if (!text) return "";
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function HashingPlaygroundDashboard() {
  const [text, setText] = useState("password123");
  const [salt, setSalt] = useState("randomSalt");
  const [algorithm, setAlgorithm] = useState("SHA-256");
  const [hashPlain, setHashPlain] = useState("");
  const [hashSalted, setHashSalted] = useState("");
  const [loading, setLoading] = useState(false);

  const computeHashes = async () => {
    setLoading(true);
    try {
      const plain = await hashText(text, algorithm);
      const salted = await hashText(text + salt, algorithm);
      setHashPlain(plain);
      setHashSalted(salted);
    } catch (err) {
      console.error("Hash computation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    computeHashes();
  }, [text, salt, algorithm]);

  const changed = useMemo(() => {
    if (!text || !salt) return false;
    const changedText = text + "x";
    return changedText !== text;
  }, [text, salt]);

  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-slate-950/80 p-4 text-slate-50 shadow-sm ring-1 ring-slate-800 md:flex-row md:p-5">
      {/* Left: inputs */}
      <div className="flex flex-1 flex-col gap-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-slate-50">
            Hash and salt playground
          </h3>
          <p className="mt-1 text-xs text-slate-300">
            Enter text and a salt to see how hash functions work. Watch how tiny changes create
            completely different outputs.
          </p>
        </div>

        <div className="rounded-xl bg-slate-900/80 p-3 ring-1 ring-slate-800">
          <label className="mb-2 block text-xs font-medium text-slate-200">Text to hash</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-2 py-1.5 text-xs text-slate-50 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
            placeholder="Enter text..."
          />
        </div>

        <div className="rounded-xl bg-slate-900/80 p-3 ring-1 ring-slate-800">
          <label className="mb-2 block text-xs font-medium text-slate-200">Salt</label>
          <input
            type="text"
            value={salt}
            onChange={(e) => setSalt(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-2 py-1.5 text-xs text-slate-50 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
            placeholder="Enter salt..."
          />
          <p className="mt-1 text-[0.7rem] text-slate-400">
            Salting prevents rainbow table attacks by making each hash unique even for identical inputs.
          </p>
        </div>

        <div className="rounded-xl bg-slate-900/80 p-3 ring-1 ring-slate-800">
          <label className="mb-2 block text-xs font-medium text-slate-200">Algorithm</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-2 py-1.5 text-xs text-slate-50 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
          >
            <option value="SHA-256">SHA-256</option>
            <option value="SHA-512">SHA-512</option>
          </select>
        </div>
      </div>

      {/* Right: results */}
      <div className="flex w-full max-w-xs flex-col gap-4 md:max-w-sm">
        <div className="rounded-2xl bg-slate-900/80 p-4 ring-1 ring-slate-800">
          <div className="mb-3 flex items-center gap-2">
            <Hash size={18} className="text-sky-400" />
            <h4 className="text-xs font-semibold text-slate-100">Hash outputs</h4>
          </div>
          {loading ? (
            <div className="text-xs text-slate-400">Computing...</div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="mb-1 text-[0.7rem] font-medium text-slate-400">Hash of text only</div>
                <div className="rounded-lg border border-slate-700 bg-slate-950/80 p-2 font-mono text-[0.65rem] text-sky-300 break-all">
                  {hashPlain || "No hash yet"}
                </div>
              </div>
              <div>
                <div className="mb-1 text-[0.7rem] font-medium text-slate-400">Hash of text + salt</div>
                <div className="rounded-lg border border-slate-700 bg-slate-950/80 p-2 font-mono text-[0.65rem] text-emerald-300 break-all">
                  {hashSalted || "No hash yet"}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-slate-900/80 p-3 text-xs text-slate-200 ring-1 ring-slate-800">
          <p className="font-semibold text-sky-200">Avalanche effect</p>
          <p className="mt-1 text-[0.7rem] text-slate-300">
            Hash functions are designed so that changing even one character in the input produces a
            completely different output. This makes them useful for detecting changes and for one way
            storage of passwords.
          </p>
          <p className="mt-2 text-[0.7rem] text-slate-400">
            Notice how the salted hash is different from the plain hash, even though the text is the
            same. This is why salting prevents attackers from using pre computed hash tables.
          </p>
        </div>
      </div>
    </div>
  );
}

