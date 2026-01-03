"use client";

import { useMemo, useState } from "react";

type LayerRow = {
  layer: string;
  pdu: string;
  whatItAdds: string;
  whatToObserve: string;
};

type Scenario = {
  id: string;
  title: string;
  stack: LayerRow[];
  note: string;
};

const SCENARIOS: Scenario[] = [
  {
    id: "https",
    title: "Load an HTTPS page",
    note: "HTTPS is HTTP inside TLS over TCP. You can observe the full flow using browser DevTools without special tools.",
    stack: [
      {
        layer: "Application",
        pdu: "HTTP request and response",
        whatItAdds: "Method, path, headers, body. This is what your program thinks it is sending.",
        whatToObserve: "DevTools Network shows request headers, status codes, and timing.",
      },
      {
        layer: "Security",
        pdu: "TLS records",
        whatItAdds: "Encryption and integrity. Certificates and key agreement during the handshake.",
        whatToObserve: "DevTools Security panel. Certificate details. Handshake timing.",
      },
      {
        layer: "Transport",
        pdu: "TCP segments",
        whatItAdds: "Ports, sequence numbers, acknowledgements, retransmission, flow control.",
        whatToObserve: "Connection setup timing. Resets. Retransmissions if the link is unstable.",
      },
      {
        layer: "Internet",
        pdu: "IP packets",
        whatItAdds: "Source and destination IP. TTL. Routing across networks.",
        whatToObserve: "Traceroute style hop behaviour. MTU related symptoms. Packet loss patterns.",
      },
      {
        layer: "Link",
        pdu: "Frames",
        whatItAdds: "Local delivery using MAC addresses. Framing and checks at the local link.",
        whatToObserve: "ARP or NDP resolution when the local destination is unknown.",
      },
      {
        layer: "Physical",
        pdu: "Bits and signals",
        whatItAdds: "Electrical or radio signalling. No meaning until upper layers interpret it.",
        whatToObserve: "Link up or down. Wi Fi quality. Cable issues.",
      },
    ],
  },
  {
    id: "dns",
    title: "Resolve a domain name",
    note: "DNS is usually UDP. When responses are too large or for some operations, DNS uses TCP.",
    stack: [
      {
        layer: "Application",
        pdu: "DNS query and response",
        whatItAdds: "A question section and answer section. Record types such as A, AAAA, CNAME.",
        whatToObserve: "Resolver logs, OS resolver behaviour, and repeatability with dig or nslookup.",
      },
      {
        layer: "Transport",
        pdu: "UDP datagrams",
        whatItAdds: "Ports and lightweight delivery. No retransmission at this layer.",
        whatToObserve: "Timeouts. Retries. Packet loss. Fragmentation issues with large responses.",
      },
      {
        layer: "Internet",
        pdu: "IP packets",
        whatItAdds: "Routing and addressing across networks.",
        whatToObserve: "Path instability and loss. VPN routing conflicts.",
      },
      {
        layer: "Link",
        pdu: "Frames",
        whatItAdds: "Local delivery for the next hop.",
        whatToObserve: "Local ARP issues. Wi Fi roaming delays.",
      },
      {
        layer: "Physical",
        pdu: "Bits and signals",
        whatItAdds: "Radio or cable transport.",
        whatToObserve: "Link quality. Noise. Drops.",
      },
    ],
  },
];

export default function PduStackBuilderTool() {
  const [scenarioId, setScenarioId] = useState<string>(SCENARIOS[0].id);
  const scenario = useMemo(() => SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0], [scenarioId]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Scenario</div>
          <div className="mt-1 text-sm text-slate-700 dark:text-slate-200">{scenario.title}</div>
        </div>
        <div className="w-full sm:w-72">
          <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Pick a flow</label>
          <select
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            value={scenarioId}
            onChange={(e) => setScenarioId(e.target.value)}
          >
            {SCENARIOS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200">
        {scenario.note}
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-1 divide-y divide-slate-200 dark:divide-slate-800">
          {scenario.stack.map((row) => (
            <div key={row.layer} className="p-3">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div className="font-semibold text-slate-900 dark:text-slate-100">{row.layer}</div>
                <div className="font-mono text-sm text-slate-700 dark:text-slate-200">{row.pdu}</div>
              </div>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">What it adds</div>
                  <div className="mt-1">{row.whatItAdds}</div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">What to observe</div>
                  <div className="mt-1">{row.whatToObserve}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
        If you can name the PDU and one observable signal at each boundary, you can troubleshoot without guessing.
      </div>
    </div>
  );
}

