"use client";

import { useMemo, useState } from "react";

const dataset = [
  { id: 1, name: "Sensor A1", reading: 21.4, unit: "°C", timestamp: "09:00" },
  { id: 2, name: "Sensor A2", reading: null, unit: "°C", timestamp: "09:00" },
  { id: 3, name: "Sensor A3", reading: 999, unit: "°C", timestamp: "" },
  { id: 4, name: "Sensor A4", reading: 19.8, unit: "°C", timestamp: "08:59" },
];

const issues = {
  2: "Missing reading value",
  3: "Impossible reading value; timestamp missing",
};

export default function DataQualityCheckerTool() {
  const [showIssues, setShowIssues] = useState(false);
  const [notes, setNotes] = useState({});

  const qualitySummary = useMemo(() => {
    const total = dataset.length;
    const bad = Object.keys(issues).length;
    const completeness = Math.round(((total - bad) / total) * 100);
    return { total, bad, completeness };
  }, []);

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700">
        Spot problems in this tiny dataset. Toggle the notes to reveal the issues we seeded.
      </p>
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="py-2 px-3">Name</th>
              <th className="py-2 px-3">Reading</th>
              <th className="py-2 px-3">Unit</th>
              <th className="py-2 px-3">Timestamp</th>
              <th className="py-2 px-3">Your note</th>
            </tr>
          </thead>
          <tbody>
            {dataset.map((row) => {
              const hasIssue = issues[row.id];
              return (
                <tr key={row.id} className="border-t border-slate-200 text-slate-900">
                  <td className="py-2 px-3 font-semibold">{row.name}</td>
                  <td className="py-2 px-3">{row.reading ?? "N/A"}</td>
                  <td className="py-2 px-3">{row.unit || "N/A"}</td>
                  <td className="py-2 px-3">{row.timestamp || "N/A"}</td>
                  <td className="py-2 px-3">
                    <input
                      className="w-full rounded-lg border border-slate-300 px-2 py-1 text-sm focus:outline-none focus:ring focus:ring-amber-200"
                      placeholder="What could be wrong?"
                      value={notes[row.id] || ""}
                      onChange={(e) => setNotes((prev) => ({ ...prev, [row.id]: e.target.value }))}
                    />
                    {showIssues && hasIssue ? (
                      <p className="mt-1 text-xs text-amber-700">{hasIssue}</p>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-800">
        <button
          type="button"
          onClick={() => setShowIssues((prev) => !prev)}
          className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm focus:outline-none focus:ring focus:ring-amber-200"
        >
          {showIssues ? "Hide seeded issues" : "Show seeded issues"}
        </button>
        <span className="text-xs text-slate-600">
          Quick stats: completeness {qualitySummary.completeness}%, {qualitySummary.bad} of{" "}
          {qualitySummary.total} rows need attention.
        </span>
      </div>
    </div>
  );
}
