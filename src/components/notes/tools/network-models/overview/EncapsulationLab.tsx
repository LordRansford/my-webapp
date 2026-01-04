"use client";

import { useMemo, useState } from "react";

type ScenarioId = "dns" | "https" | "ssh";

const SCENARIOS: Record<
  ScenarioId,
  {
    title: string;
    payloadExample: string;
    appProtocol: string;
    transport: "UDP" | "TCP";
    port: number;
    note: string;
  }
> = {
  dns: {
    title: "DNS lookup",
    payloadExample: "Query A record for www.example.com",
    appProtocol: "DNS",
    transport: "UDP",
    port: 53,
    note: "DNS often uses UDP. If the message is too large or reliability is needed, TCP can be used.",
  },
  https: {
    title: "HTTPS page load",
    payloadExample: "GET / over HTTPS for www.example.com",
    appProtocol: "HTTP over TLS",
    transport: "TCP",
    port: 443,
    note: "HTTPS is HTTP protected by TLS. TLS runs over a reliable transport in almost all common deployments.",
  },
  ssh: {
    title: "SSH remote login",
    payloadExample: "Open SSH session to a server and run a command",
    appProtocol: "SSH",
    transport: "TCP",
    port: 22,
    note: "SSH uses TCP. The encryption and integrity checks are part of the SSH protocol itself.",
  },
};

function cleanText(input: string, maxLen: number) {
  return String(input || "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLen);
}

function byteLen(text: string) {
  try {
    return new TextEncoder().encode(text).byteLength;
  } catch {
    return Math.max(0, String(text || "").length);
  }
}

export default function EncapsulationLab() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("https");
  const scenario = SCENARIOS[scenarioId];
  const [payload, setPayload] = useState(scenario.payloadExample);

  const safePayload = useMemo(() => cleanText(payload, 400), [payload]);

  const example = useMemo(() => {
    const srcIp = "192.0.2.10";
    const dstIp = "203.0.113.20";
    const srcMac = "02:11:22:33:44:55";
    const dstMac = "02:aa:bb:cc:dd:ee";
    const srcPort = 51512;
    const dstPort = scenario.port;

    const appData = safePayload || scenario.payloadExample;
    const appBytes = byteLen(appData);

    const tlsOverhead = scenarioId === "https" ? 85 : 0;
    const appPduLabel = scenario.appProtocol;

    const transportHeader = scenario.transport === "TCP" ? 20 : 8;
    const ipHeader = 20;
    const ethernetHeader = 14;
    const ethernetFcs = 4;

    const totalBytes = ethernetHeader + ipHeader + transportHeader + tlsOverhead + appBytes + ethernetFcs;

    return {
      srcIp,
      dstIp,
      srcMac,
      dstMac,
      srcPort,
      dstPort,
      appPduLabel,
      tlsOverhead,
      transportHeader,
      ipHeader,
      ethernetHeader,
      ethernetFcs,
      appBytes,
      totalBytes,
    };
  }, [safePayload, scenario.appProtocol, scenario.port, scenario.transport, scenarioId]);

  return (
    <div className="not-prose space-y-4">
      <div className="grid gap-3 md:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Scenario</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.entries(SCENARIOS).map(([id, s]) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  const next = id as ScenarioId;
                  setScenarioId(next);
                  setPayload(SCENARIOS[next].payloadExample);
                }}
                className={[
                  "rounded-full border px-3 py-1 text-sm font-semibold shadow-sm transition",
                  scenarioId === id ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
                ].join(" ")}
              >
                {s.title}
              </button>
            ))}
          </div>
          <div className="mt-3 text-sm text-slate-700">{scenario.note}</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Application data</div>
          <textarea
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            rows={4}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
            placeholder="Describe what the application is trying to send"
          />
          <div className="mt-2 text-xs text-slate-600">Keep this descriptive. Do not paste secrets.</div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Encapsulation stack</div>
        <div className="mt-3 grid gap-3 lg:grid-cols-5">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs font-semibold text-slate-700">Application</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{example.appPduLabel}</div>
            <div className="mt-2 text-xs text-slate-700">Data {example.appBytes} bytes</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs font-semibold text-slate-700">Security layer</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{scenarioId === "https" ? "TLS record" : "None"}</div>
            <div className="mt-2 text-xs text-slate-700">Overhead {example.tlsOverhead} bytes</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs font-semibold text-slate-700">Transport</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">
              {scenario.transport} {scenario.transport === "TCP" ? "segment" : "datagram"}
            </div>
            <div className="mt-2 text-xs text-slate-700">
              Src port {example.srcPort} to dst port {example.dstPort}
            </div>
            <div className="mt-1 text-xs text-slate-700">Header {example.transportHeader} bytes</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs font-semibold text-slate-700">Internet</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">IP packet</div>
            <div className="mt-2 text-xs text-slate-700">
              Src {example.srcIp} to dst {example.dstIp}
            </div>
            <div className="mt-1 text-xs text-slate-700">Header {example.ipHeader} bytes</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs font-semibold text-slate-700">Link</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">Ethernet frame</div>
            <div className="mt-2 text-xs text-slate-700">
              Src {example.srcMac} to dst {example.dstMac}
            </div>
            <div className="mt-1 text-xs text-slate-700">
              Header {example.ethernetHeader} bytes and FCS {example.ethernetFcs} bytes
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
          <div className="text-sm font-semibold text-slate-900">Total size estimate</div>
          <div className="mt-1 text-sm text-slate-700">
            About {example.totalBytes} bytes on the wire for this single message, excluding lower level timing and retransmissions.
          </div>
          <div className="mt-2 text-xs text-slate-600">
            This is a teaching model. Real sizes depend on options, extensions, path MTU, and whether the payload is split across multiple packets.
          </div>
        </div>
      </div>
    </div>
  );
}

