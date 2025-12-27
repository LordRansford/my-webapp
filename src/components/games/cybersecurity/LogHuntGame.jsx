"use client";

import { useMemo, useState } from "react";
import MiniSwitch from "@/components/ui/MiniSwitch";

const LOGS = [
  {
    id: 1,
    ts: "2025-12-16T10:01:22Z",
    source: "auth",
    message: "admin login from 203.0.113.45 user-agent=python-requests",
    suspicious: true,
    explain: "Admin login from an automation user agent and unusual IP.",
  },
  {
    id: 2,
    ts: "2025-12-16T10:02:10Z",
    source: "web",
    message: "GET /health 200 response_time_ms=12",
    suspicious: false,
    explain: "Normal health check.",
  },
  {
    id: 3,
    ts: "2025-12-16T10:03:05Z",
    source: "app",
    message: "POST /payments status=500 correlationId=abc-123",
    suspicious: false,
    explain: "Single 500 could be noise; monitor if it repeats.",
  },
  {
    id: 4,
    ts: "2025-12-16T10:03:40Z",
    source: "auth",
    message: "5 failed logins for user jsmith from 198.51.100.77",
    suspicious: true,
    explain: "Repeated failed logins suggest brute force.",
  },
  {
    id: 5,
    ts: "2025-12-16T10:04:12Z",
    source: "web",
    message: "GET /backup/status 200 job=daily-backup",
    suspicious: false,
    explain: "Expected backup status call.",
  },
  {
    id: 6,
    ts: "2025-12-16T10:04:55Z",
    source: "app",
    message: "DELETE /users/42 status=200 actor=service-account",
    suspicious: true,
    explain: "Deletes by service accounts warrant review.",
  },
];

export default function LogHuntGame() {
  const [selected, setSelected] = useState({});
  const [showResults, setShowResults] = useState(false);

  const counts = useMemo(() => {
    const totalSuspicious = LOGS.filter((l) => l.suspicious).length;
    const found = LOGS.filter((l) => l.suspicious && selected[l.id]).length;
    const missed = totalSuspicious - found;
    return { totalSuspicious, found, missed };
  }, [selected]);

  const setPick = (id, checked) => {
    setSelected((prev) => ({ ...prev, [id]: checked }));
  };

  const reset = () => {
    setSelected({});
    setShowResults(false);
  };

  return (
    <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-slate-200">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
          <span>Tap log lines you think are suspicious.</span>
          {showResults && (
            <span className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 font-semibold text-slate-900">
              Found {counts.found}/{counts.totalSuspicious} suspicious; missed {counts.missed}
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left text-slate-700">
                <th className="px-2 py-2">Pick</th>
                <th className="px-2 py-2">Time</th>
                <th className="px-2 py-2">Source</th>
                <th className="px-2 py-2">Message</th>
              </tr>
            </thead>
            <tbody className="font-mono text-[13px]">
              {LOGS.map((log) => {
                const isChosen = selected[log.id];
                const isSuspicious = log.suspicious;
                const show = showResults;
                const stateClass = show
                  ? isSuspicious && isChosen
                    ? "bg-emerald-50 border-emerald-200"
                    : isSuspicious && !isChosen
                    ? "bg-amber-50 border-amber-200"
                    : !isSuspicious && isChosen
                    ? "bg-rose-50 border-rose-200"
                    : "bg-white"
                  : isChosen
                  ? "bg-sky-50 border-sky-200"
                  : "bg-white";

                return (
                  <tr key={log.id} className={`border-b border-slate-200 align-top ${stateClass}`}>
                    <td className="px-2 py-2">
                      <MiniSwitch
                        checked={!!isChosen}
                        onCheckedChange={(checked) => setPick(log.id, checked)}
                        tone={
                          show
                            ? isSuspicious
                              ? "emerald"
                              : "rose"
                            : "sky"
                        }
                        ariaLabel={`Mark log line ${log.id} as suspicious`}
                      />
                    </td>
                    <td className="px-2 py-2 text-slate-800">{log.ts}</td>
                    <td className="px-2 py-2 text-slate-800">{log.source}</td>
                    <td className="px-2 py-2 text-slate-900">{log.message}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {showResults && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800">
            <p className="font-semibold text-slate-900">Why</p>
            <ul className="mt-1 space-y-1 pl-4 list-disc">
              {LOGS.filter((l) => l.suspicious).map((log) => (
                <li key={log.id}>
                  <span className="font-semibold">{log.message}</span> - {log.explain}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowResults(true)}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:border-sky-300 hover:text-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-300"
          >
            Check my choices
          </button>
          <button
            onClick={reset}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:border-sky-300 hover:text-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-300"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

