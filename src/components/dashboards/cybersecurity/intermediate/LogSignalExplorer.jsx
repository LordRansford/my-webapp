"use client";

import { useMemo, useState } from "react";

const LOGS = [
  { id: 1, text: "login success user=alice ip=10.0.0.5", label: "normal" },
  { id: 2, text: "login failure user=alice ip=203.0.113.8", label: "interesting" },
  { id: 3, text: "admin action: changed role user=bob -> admin", label: "suspicious" },
  { id: 4, text: "api call /payments 200 user=service-account", label: "normal" },
  { id: 5, text: "login failure user=alice ip=203.0.113.8", label: "suspicious" },
  { id: 6, text: "unusual country login success user=carol ip=198.51.100.20", label: "suspicious" },
];

const TAGS = ["normal", "interesting", "suspicious"];

export default function LogSignalExplorer() {
  const [tags, setTags] = useState({});
  const [showResults, setShowResults] = useState(false);

  const counts = useMemo(() => {
    const totalSuspicious = LOGS.filter((l) => l.label === "suspicious").length;
    const found = LOGS.filter((l) => l.label === "suspicious" && tags[l.id] === "suspicious").length;
    const missed = totalSuspicious - found;
    return { totalSuspicious, found, missed };
  }, [tags]);

  const setTag = (id, tag) => setTags((prev) => ({ ...prev, [id]: tag }));

  const reset = () => {
    setTags({});
    setShowResults(false);
  };

  return (
    <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-slate-200">
      <p className="text-sm text-slate-700">Tag each log line, then check your picks.</p>

      <div className="mt-3 space-y-2">
        {LOGS.map((log) => {
          const chosen = tags[log.id];
          return (
            <div key={log.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
              <div className="font-mono text-sm text-slate-900">{log.text}</div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setTag(log.id, tag)}
                    className={`rounded-full border px-3 py-1 font-semibold transition focus:outline-none focus:ring-2 focus:ring-sky-300 ${
                      chosen === tag
                        ? "border-sky-300 bg-sky-50 text-slate-900"
                        : "border-slate-300 bg-white text-slate-800 hover:border-sky-200"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              {showResults && (
                <div
                  className={`mt-2 rounded-lg border p-2 text-xs ${
                    log.label === "suspicious"
                      ? "border-rose-200 bg-rose-50 text-slate-900"
                      : log.label === "interesting"
                      ? "border-amber-200 bg-amber-50 text-slate-900"
                      : "border-emerald-200 bg-emerald-50 text-slate-900"
                  }`}
                >
                  Analyst view: {analysis(log)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showResults && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 shadow-sm">
          Found {counts.found}/{counts.totalSuspicious} suspicious; missed {counts.missed}.
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => setShowResults(true)}
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300"
        >
          Check my tagging
        </button>
        <button
          onClick={reset}
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function analysis(log) {
  switch (log.id) {
    case 1:
      return "Normal login from internal IP.";
    case 2:
    case 5:
      return "Repeated failures from the same IP; could indicate brute force.";
    case 3:
      return "Role change is high impact; monitor and alert.";
    case 4:
      return "Normal service account call; watch for unusual patterns.";
    case 6:
      return "Login success from unusual country; check MFA and device context.";
    default:
      return "Consider context to decide signal vs noise.";
  }
}
