"use client";

import { useMemo, useState } from "react";

const FEATURES = [
  {
    id: "registration",
    name: "User registration",
    failures: ["Broken auth", "Weak validation"],
    note: "Adds forms, identity storage, and flows to secure.",
  },
  {
    id: "upload",
    name: "File upload",
    failures: ["Injection", "Unsafe file handling"],
    note: "Requires content validation and storage controls.",
  },
  {
    id: "admin",
    name: "Admin dashboard",
    failures: ["Broken access control", "Privilege escalation"],
    note: "High impact entry point; needs strict authz.",
  },
  {
    id: "third-party",
    name: "Third party API integration",
    failures: ["Dependency risk", "Data exposure"],
    note: "Expands trust boundary to partners and tokens.",
  },
  {
    id: "search",
    name: "Full text search",
    failures: ["Injection", "Data exposure"],
    note: "Indexes sensitive data; query parsing adds risk.",
  },
];

export default function AttackSurfaceExplorer() {
  const [enabled, setEnabled] = useState({});

  const surfaceScore = useMemo(() => Object.values(enabled).filter(Boolean).length * 2 + 2, [enabled]);

  const failureCounts = useMemo(() => {
    const counts = {};
    FEATURES.forEach((f) => {
      if (enabled[f.id]) {
        f.failures.forEach((fail) => {
          counts[fail] = (counts[fail] || 0) + 1;
        });
      }
    });
    return counts;
  }, [enabled]);

  const toggle = (id) => setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-slate-200">
      <h4 className="text-base font-semibold text-slate-900">Toggle features</h4>
      <p className="text-sm text-slate-700">See how adding features increases attack surface and likely failure classes.</p>

      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {FEATURES.map((f) => (
          <button
            key={f.id}
            onClick={() => toggle(f.id)}
            className={`rounded-xl border px-3 py-3 text-left text-sm font-medium shadow-sm transition focus:outline-none focus:ring-2 focus:ring-sky-300 ${
              enabled[f.id] ? "border-sky-300 bg-sky-50 text-slate-900" : "border-slate-200 bg-white text-slate-800 hover:border-sky-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{f.name}</span>
              <span className="text-xs font-semibold">{enabled[f.id] ? "On" : "Off"}</span>
            </div>
            <div className="mt-1 text-xs text-slate-700">{f.note}</div>
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
          <h5 className="text-sm font-semibold text-slate-900">Surface score</h5>
          <div className="mt-2 h-2 rounded-full bg-white">
            <div className="h-full rounded-full bg-rose-400" style={{ width: `${Math.min(100, surfaceScore * 10)}%` }} />
          </div>
          <p className="mt-2 text-sm text-slate-800">
            More features mean more inputs, dependencies, and assumptions to defend.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h5 className="text-sm font-semibold text-slate-900">Likely failure classes</h5>
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.keys(failureCounts).length === 0 ? (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-800">
                Toggle a feature to see likely failures.
              </span>
            ) : (
              Object.entries(failureCounts).map(([fail, count]) => (
                <span
                  key={fail}
                  className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm"
                >
                  {fail} ×{count}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
