"use client";

import { useMemo, useState } from "react";

type OsiLayer = { id: string; name: string; key: string; example: string };
type TcpLayer = { id: string; name: string; key: string; example: string };

const OSI: OsiLayer[] = [
  { id: "7", name: "Application", key: "application", example: "HTTP, DNS, SMTP" },
  { id: "6", name: "Presentation", key: "presentation", example: "Encoding, compression, cryptographic framing" },
  { id: "5", name: "Session", key: "session", example: "Session setup patterns and state management" },
  { id: "4", name: "Transport", key: "transport", example: "TCP, UDP" },
  { id: "3", name: "Network", key: "network", example: "IP, routing" },
  { id: "2", name: "Data link", key: "datalink", example: "Ethernet, Wi Fi, ARP on local segment" },
  { id: "1", name: "Physical", key: "physical", example: "Signals, media, NICs" },
];

const TCPIP: TcpLayer[] = [
  { id: "4", name: "Application", key: "app", example: "HTTP, DNS, TLS, SSH" },
  { id: "3", name: "Transport", key: "trans", example: "TCP, UDP" },
  { id: "2", name: "Internet", key: "internet", example: "IP, ICMP" },
  { id: "1", name: "Link", key: "link", example: "Ethernet, Wi Fi" },
];

const CORRECT_MAPPING: Record<string, string> = {
  application: "app",
  presentation: "app",
  session: "app",
  transport: "trans",
  network: "internet",
  datalink: "link",
  physical: "link",
};

export default function OsiTcpIpMapperTool() {
  const [mapping, setMapping] = useState<Record<string, string>>({});

  const score = useMemo(() => {
    const keys = Object.keys(CORRECT_MAPPING);
    let correct = 0;
    for (const k of keys) {
      if (mapping[k] === CORRECT_MAPPING[k]) correct += 1;
    }
    return { correct, total: keys.length };
  }, [mapping]);

  return (
    <div className="not-prose space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Exercise</div>
            <div className="mt-1 text-base font-semibold text-slate-900">Map OSI layers to TCP IP layers</div>
            <div className="mt-2 text-sm text-slate-700">
              OSI is a conceptual model. TCP IP is a protocol suite model. The mapping is a teaching tool, not a perfect rule.
            </div>
          </div>
          <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900">
            Score {score.correct} of {score.total}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">OSI layers</div>
          <div className="mt-3 space-y-3">
            {OSI.map((l) => (
              <div key={l.key} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      Layer {l.id} {l.name}
                    </div>
                    <div className="mt-1 text-xs text-slate-700">Examples {l.example}</div>
                  </div>
                  <select
                    value={mapping[l.key] || ""}
                    onChange={(e) => setMapping((m) => ({ ...m, [l.key]: e.target.value }))}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                  >
                    <option value="">Choose</option>
                    {TCPIP.map((t) => (
                      <option key={t.key} value={t.key}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                {mapping[l.key] ? (
                  <div className="mt-2 text-xs text-slate-700">
                    {mapping[l.key] === CORRECT_MAPPING[l.key] ? "Correct mapping for a typical mental model." : "Recheck. Think about where the protocol suite draws boundaries."}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">TCP IP layers</div>
          <div className="mt-3 space-y-3">
            {TCPIP.map((t) => (
              <div key={t.key} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-sm font-semibold text-slate-900">
                  Layer {t.id} {t.name}
                </div>
                <div className="mt-1 text-xs text-slate-700">Examples {t.example}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
            A protocol can span boundaries. TLS is often described as presentation layer in OSI explanations, but in TCP IP it is usually treated as part of the application layer stack.
          </div>
        </div>
      </div>
    </div>
  );
}

