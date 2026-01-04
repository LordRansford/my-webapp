"use client";

import { useMemo, useState } from "react";

type Entry = {
  port: number;
  transport: "TCP" | "UDP";
  protocol: string;
  purpose: string;
  notes: string;
};

const ENTRIES: Entry[] = [
  { port: 53, transport: "UDP", protocol: "DNS", purpose: "Name to record lookup", notes: "TCP is also used for zone transfers and some large responses." },
  { port: 53, transport: "TCP", protocol: "DNS", purpose: "Transfers and some responses", notes: "Most client queries start on UDP and retry on TCP when needed." },
  { port: 67, transport: "UDP", protocol: "DHCP", purpose: "IPv4 address lease", notes: "Client uses 68. Server uses 67. Broadcast is common during discovery." },
  { port: 68, transport: "UDP", protocol: "DHCP", purpose: "Client side of IPv4 leasing", notes: "Often the first sign of a local network issue is DHCP failure." },
  { port: 80, transport: "TCP", protocol: "HTTP", purpose: "Web traffic without TLS", notes: "Many sites redirect to HTTPS. Treat plain HTTP as unsafe for secrets." },
  { port: 443, transport: "TCP", protocol: "HTTPS", purpose: "HTTP over TLS", notes: "TLS provides confidentiality and integrity. It does not fix broken app logic." },
  { port: 123, transport: "UDP", protocol: "NTP", purpose: "Time synchronisation", notes: "Time drift breaks authentication and logs. NTP is an operations dependency." },
  { port: 22, transport: "TCP", protocol: "SSH", purpose: "Secure remote shell", notes: "A management plane tool. Treat it as sensitive and restrict access." },
  { port: 25, transport: "TCP", protocol: "SMTP", purpose: "Mail transfer", notes: "Modern deployments often use 587 for submission plus authentication." },
  { port: 587, transport: "TCP", protocol: "SMTP submission", purpose: "Client mail submission", notes: "Common in hosted mail. Often uses STARTTLS." },
  { port: 143, transport: "TCP", protocol: "IMAP", purpose: "Mail retrieval", notes: "Prefer IMAPS on 993 for encryption by default." },
  { port: 993, transport: "TCP", protocol: "IMAPS", purpose: "IMAP over TLS", notes: "Encrypted mail retrieval." },
  { port: 110, transport: "TCP", protocol: "POP3", purpose: "Mail retrieval", notes: "Prefer POP3S on 995 for encryption by default." },
  { port: 995, transport: "TCP", protocol: "POP3S", purpose: "POP3 over TLS", notes: "Encrypted mail retrieval." },
  { port: 3389, transport: "TCP", protocol: "RDP", purpose: "Remote desktop", notes: "High value target. Restrict and monitor. Avoid exposing directly to the Internet." },
  { port: 443, transport: "UDP", protocol: "QUIC", purpose: "HTTP 3 transport", notes: "Runs over UDP. Connection setup and encryption are built into the protocol." },
];

function normaliseQuery(q: string) {
  return q.trim().toLowerCase();
}

export default function PortProtocolExplorerTool() {
  const [query, setQuery] = useState("");
  const [transport, setTransport] = useState<"any" | "TCP" | "UDP">("any");

  const filtered = useMemo(() => {
    const q = normaliseQuery(query);
    return ENTRIES.filter((e) => {
      if (transport !== "any" && e.transport !== transport) return false;
      if (!q) return true;
      if (String(e.port).includes(q)) return true;
      if (e.protocol.toLowerCase().includes(q)) return true;
      if (e.purpose.toLowerCase().includes(q)) return true;
      return e.notes.toLowerCase().includes(q);
    }).sort((a, b) => a.port - b.port || a.transport.localeCompare(b.transport));
  }, [query, transport]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Search</label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            placeholder="443, DNS, mail, time"
          />
        </div>
        <div className="w-full sm:w-40">
          <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Transport</label>
          <select
            value={transport}
            onChange={(e) => setTransport(e.target.value as any)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            <option value="any">Any</option>
            <option value="TCP">TCP</option>
            <option value="UDP">UDP</option>
          </select>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600 dark:bg-slate-950/40 dark:text-slate-300">
            <tr>
              <th className="px-3 py-2">Port</th>
              <th className="px-3 py-2">Transport</th>
              <th className="px-3 py-2">Protocol</th>
              <th className="px-3 py-2">Purpose</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {filtered.map((e) => (
              <tr key={`${e.port}-${e.transport}`} className="bg-white dark:bg-transparent">
                <td className="px-3 py-2 font-mono text-slate-900 dark:text-slate-100">{e.port}</td>
                <td className="px-3 py-2 font-semibold text-slate-900 dark:text-slate-100">{e.transport}</td>
                <td className="px-3 py-2 text-slate-900 dark:text-slate-100">{e.protocol}</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{e.purpose}</td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td className="px-3 py-4 text-slate-600 dark:text-slate-300" colSpan={4}>
                  No matches.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-slate-700 dark:text-slate-200">
        <p className="m-0">
          Port numbers are not identity. They are conventions and can be changed. Use them to form a hypothesis, then
          verify with evidence.
        </p>
        <p className="mt-2 m-0 text-slate-600 dark:text-slate-300">
          Example. If DNS is failing, you can test reachability to UDP 53 and inspect resolver behaviour, but you still
          need to confirm the correct server, record, and response.
        </p>
      </div>
    </div>
  );
}

