"use client";

import { useMemo, useState } from "react";

const LEVELS = [
  { id: "root", label: "Root CA", toggle: "trusted" },
  { id: "intermediate", label: "Intermediate CA", toggle: "valid" },
  { id: "leaf", label: "Leaf certificate", toggle: "valid" },
];

export default function PkiChainVisualizer() {
  const [trustedRoot, setTrustedRoot] = useState(true);
  const [validIntermediate, setValidIntermediate] = useState(true);
  const [validLeaf, setValidLeaf] = useState(true);

  const status = useMemo(() => {
    if (!trustedRoot) return "Chain is not trusted: root is untrusted.";
    if (!validIntermediate) return "Chain is not trusted: intermediate is invalid.";
    if (!validLeaf) return "Chain is not trusted: leaf is invalid.";
    return "Chain is trusted.";
  }, [trustedRoot, validIntermediate, validLeaf]);

  return (
    <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-slate-200">
      <div className="space-y-3">
        {LEVELS.map((level) => {
          const toggle =
            level.id === "root"
              ? trustedRoot
              : level.id === "intermediate"
              ? validIntermediate
              : validLeaf;
          const setToggle =
            level.id === "root"
              ? setTrustedRoot
              : level.id === "intermediate"
              ? setValidIntermediate
              : setValidLeaf;
          return (
            <div
              key={level.id}
              className={`flex items-center justify-between rounded-xl border px-3 py-3 shadow-sm ${
                toggle ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"
              }`}
            >
              <div>
                <div className="text-sm font-semibold text-slate-900">{level.label}</div>
                <div className="text-xs text-slate-700">
                  {level.id === "root" ? "Trust anchor" : level.id === "leaf" ? "End entity" : "Issuer for leaf"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-900">{toggle ? "Valid" : "Invalid"}</span>
                <button
                  onClick={() => setToggle((v) => !v)}
                  className="rounded-full border border-slate-300 px-3 py-1 text-sm font-medium text-slate-800 shadow-sm hover:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300"
                >
                  {toggle ? "Toggle off" : "Toggle on"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 shadow-sm">
        {status}
      </div>
    </div>
  );
}
