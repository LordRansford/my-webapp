"use client";

import { useMemo, useState } from "react";

type Scenario = {
  id: string;
  title: string;
  wireshark: string;
  tcpdump: string;
  whatItShows: string;
  caveats: string;
};

const SCENARIOS: Scenario[] = [
  {
    id: "dns",
    title: "DNS lookups",
    wireshark: "dns",
    tcpdump: "udp port 53 or tcp port 53",
    whatItShows: "DNS queries and responses. Useful for slow resolution, NXDOMAIN, and SERVFAIL.",
    caveats: "Encrypted DNS changes what you can see. DNS over HTTPS is inside TLS on port 443.",
  },
  {
    id: "tls-handshake",
    title: "TLS handshake and certificate exchange",
    wireshark: "tls.handshake",
    tcpdump: "tcp port 443",
    whatItShows: "Handshake messages, SNI, certificate chain exchange, and alert codes.",
    caveats: "Application data is encrypted. You can still observe timing and handshake failures.",
  },
  {
    id: "tcp-reset",
    title: "TCP resets",
    wireshark: "tcp.flags.reset == 1",
    tcpdump: "tcp[tcpflags] & tcp-rst != 0",
    whatItShows: "Connections that are being reset. Useful when sessions drop or fail to establish.",
    caveats: "A reset is a symptom. It can be caused by policy, idle timeouts, or application crashes.",
  },
  {
    id: "retransmissions",
    title: "Retransmissions and loss signals",
    wireshark: "tcp.analysis.retransmission or tcp.analysis.fast_retransmission",
    tcpdump: "tcp",
    whatItShows: "Loss signals and retransmission behaviour. Useful when the site feels slow or flaky.",
    caveats: "Retransmissions can also occur during reordering. Confirm with multiple signals.",
  },
];

export default function PacketCaptureFilterBuilderTool() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const scenario = useMemo(() => SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0], [scenarioId]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Scenario</div>
          <div className="mt-1 text-sm text-slate-700 dark:text-slate-200">{scenario.title}</div>
        </div>
        <div className="w-full sm:w-72">
          <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Pick a filter</label>
          <select
            value={scenarioId}
            onChange={(e) => setScenarioId(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            {SCENARIOS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/40">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Wireshark display filter</div>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-white/70 p-2 text-xs text-slate-900 dark:bg-black/30 dark:text-slate-100">
{scenario.wireshark}
          </pre>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/40">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">tcpdump capture filter</div>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-white/70 p-2 text-xs text-slate-900 dark:bg-black/30 dark:text-slate-100">
{scenario.tcpdump}
          </pre>
        </div>
      </div>

      <div className="mt-4 text-sm text-slate-700 dark:text-slate-200">
        <div className="font-semibold text-slate-900 dark:text-slate-100">What it shows</div>
        <div className="mt-1">{scenario.whatItShows}</div>
        <div className="mt-3 font-semibold text-slate-900 dark:text-slate-100">Caveats</div>
        <div className="mt-1 text-slate-600 dark:text-slate-300">{scenario.caveats}</div>
      </div>
    </div>
  );
}

