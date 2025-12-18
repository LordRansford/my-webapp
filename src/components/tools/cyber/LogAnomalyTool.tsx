"use client";

import React, { useMemo, useState } from "react";
import { ScrollText } from "lucide-react";
import { CyberToolCard } from "./CyberToolCard";

type LogFinding = {
  line: string;
  note: string;
};

function analyseLogs(raw: string): LogFinding[] {
  const lines = raw.split(/\r?\n/).filter(Boolean);
  const findings: LogFinding[] = [];
  const methodPattern = /"(GET|POST|PUT|DELETE|PATCH|TRACE|OPTIONS)/i;
  const statusPattern = /\s(\d{3})\s/;
  const statusCounts: Record<string, number> = {};

  for (const line of lines) {
    const statusMatch = line.match(statusPattern);
    if (statusMatch) {
      const status = statusMatch[1];
      statusCounts[status] = (statusCounts[status] || 0) + 1;
      if (status.startsWith("5")) {
        findings.push({ line, note: "Server error (5xx) response spotted." });
      }
      if (status === "401" || status === "403") {
        findings.push({ line, note: "Repeated auth failures or forbidden responses can signal probing." });
      }
    }

    const methodMatch = line.match(methodPattern);
    if (methodMatch && methodMatch[1].toUpperCase() === "TRACE") {
      findings.push({ line, note: "TRACE method detected. This is rarely needed and can be risky." });
    }

    if (line.toLowerCase().includes("../") || line.toLowerCase().includes("%2e%2e")) {
      findings.push({ line, note: "Path traversal attempt pattern seen (../)." });
    }
  }

  for (const [status, count] of Object.entries(statusCounts)) {
    if (count > 5 && (status.startsWith("4") || status.startsWith("5"))) {
      findings.push({
        line: `Status ${status} appears ${count} times`,
        note: "Repeated errors may indicate scanning, misconfiguration, or an outage.",
      });
    }
  }

  return findings;
}

export function LogAnomalyTool() {
  const [rawLogs, setRawLogs] = useState(
    `192.168.1.10 - - [12/Dec/2024:10:15:32 +0000] "GET /index.html HTTP/1.1" 200 1234
192.168.1.11 - - [12/Dec/2024:10:15:33 +0000] "TRACE / HTTP/1.1" 405 234
192.168.1.12 - - [12/Dec/2024:10:15:34 +0000] "GET /../../etc/passwd HTTP/1.1" 403 111
192.168.1.13 - - [12/Dec/2024:10:15:35 +0000] "GET /api/secure HTTP/1.1" 500 42
192.168.1.13 - - [12/Dec/2024:10:15:36 +0000] "GET /api/secure HTTP/1.1" 500 42`
  );

  const findings = useMemo(() => analyseLogs(rawLogs), [rawLogs]);

  return (
    <CyberToolCard
      id="log-anomaly-title"
      title="Log anomaly spotter"
      icon={<ScrollText className="h-4 w-4" aria-hidden="true" />}
      description="Paste HTTP access log lines and get quick hints about unusual methods, status codes and traversal attempts."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <label htmlFor="log-input" className="block text-xs font-semibold text-slate-700">
            Paste log lines
          </label>
          <textarea
            id="log-input"
            value={rawLogs}
            onChange={(e) => setRawLogs(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 min-h-[160px] resize-vertical"
            placeholder='Paste access log lines like: 127.0.0.1 - - [date] "GET / HTTP/1.1" 200 123'
          />
          <p className="text-xs text-slate-500">
            This does not send logs anywhere. It just scans for common red flags to help triage quickly.
          </p>
        </div>

        <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <p className="text-xs font-semibold text-slate-700">Findings</p>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {findings.length === 0 && <p className="text-xs text-slate-500">No obvious anomalies detected in these lines.</p>}
            {findings.map((f, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700 space-y-1">
                <p className="text-[11px] text-slate-500 break-all">{f.line}</p>
                <p className="text-[11px] text-slate-800">• {f.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CyberToolCard>
  );
}
