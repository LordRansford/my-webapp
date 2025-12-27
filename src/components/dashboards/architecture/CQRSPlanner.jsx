"use client";

import { useMemo, useState } from "react";
import { CheckPill } from "@/components/ui/CheckPill";

export function CQRSPlanner() {
  const [writesPercent, setWritesPercent] = useState(20);
  const [splitEnabled, setSplitEnabled] = useState(true);
  const [consistency, setConsistency] = useState("Eventual");

  const result = useMemo(() => {
    const readsPercent = 100 - writesPercent;

    let complexity = splitEnabled ? 3 : 1;
    let maintenance = splitEnabled ? 3 : 1;
    let performanceBenefit = splitEnabled ? Math.max(0, readsPercent - 30) / 70 : 0;

    const summary = [];

    if (!splitEnabled) {
      summary.push("Single model is simpler to maintain and reason about.");
      if (readsPercent > 80) {
        summary.push("You might revisit CQRS if read load grows further.");
      }
    } else {
      summary.push("Commands and queries are separated. This adds moving parts.");
      if (performanceBenefit > 0.6) {
        summary.push("Most load is on reads so CQRS can be a good fit.");
      } else {
        summary.push("The benefit may not justify the extra complexity yet.");
      }
    }

    if (consistency === "Eventual") {
      summary.push(
        "Eventual consistency is acceptable when readers can tolerate short delays and there are clear reconciliation rules.",
      );
    } else {
      summary.push(
        "Strong consistency keeps reads and writes aligned. This limits some scaling options but can simplify reasoning.",
      );
    }

    return {
      readsPercent,
      complexityScore: complexity,
      maintenanceScore: maintenance,
      performanceBenefit,
      summary,
    };
  }, [writesPercent, splitEnabled, consistency]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-600">
        Use this to feel when CQRS starts to make sense. It does not tell you what to do. It makes
        the tradeoffs visible so you can argue with them.
      </p>

      <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
          <div className="space-y-4">
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">Traffic mix</p>
              <label className="block text-xs text-slate-600">
                Percentage of write heavy commands
                <input
                  type="range"
                  min={0}
                  max={80}
                  value={writesPercent}
                  onChange={(e) => setWritesPercent(Number(e.target.value) || 0)}
                  className="mt-1 w-full"
                />
              </label>
              <p className="mt-1 text-xs text-slate-700">
                Writes: <span className="font-semibold">{writesPercent}%</span> - Reads:{" "}
                <span className="font-semibold">{result.readsPercent}%</span>
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="sm:max-w-xs">
                <CheckPill checked={splitEnabled} onCheckedChange={setSplitEnabled} tone="violet">
                  Use separate command and query models
                </CheckPill>
              </div>

              <label className="text-xs text-slate-700">
                Read side consistency
                <select
                  className="ml-2 rounded-xl border border-slate-200 px-2 py-1 text-xs"
                  value={consistency}
                  onChange={(e) => setConsistency(e.target.value)}
                >
                  <option value="Strong">Strong</option>
                  <option value="Eventual">Eventual</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Quick scores</p>
            <p className="text-xs text-slate-700">
              Design complexity: <span className="font-semibold">{result.complexityScore} out of 3</span>
            </p>
            <p className="text-xs text-slate-700">
              Maintenance overhead: <span className="font-semibold">{result.maintenanceScore} out of 3</span>
            </p>
            <p className="text-xs text-slate-700">
              Potential read performance gain:{" "}
              <span className="font-semibold">{(result.performanceBenefit * 100).toFixed(0)} percent</span>
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-700">
            <p className="mb-1 font-medium">How to use this</p>
            <ul className="list-disc space-y-1 pl-4">
              {result.summary.map((line, index) => (
                <li key={index}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
