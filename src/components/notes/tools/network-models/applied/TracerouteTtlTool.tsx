"use client";

import { useMemo, useState } from "react";

type Hop = {
  hop: number;
  ttl: number;
  result: "time-exceeded" | "destination" | "no-reply";
  note: string;
};

export default function TracerouteTtlTool() {
  const [hopsRaw, setHopsRaw] = useState("8");
  const [lossHopRaw, setLossHopRaw] = useState("");
  const [method, setMethod] = useState<"icmp" | "udp">("icmp");

  const hops = useMemo(() => {
    const n = Math.max(2, Math.min(30, Math.floor(Number(hopsRaw) || 8)));
    const lossHop = Number(lossHopRaw);
    const loss = Number.isFinite(lossHop) ? Math.floor(lossHop) : null;

    const rows: Hop[] = [];
    for (let i = 1; i <= n; i++) {
      const isLoss = loss != null && i === loss;
      const isDest = i === n;
      rows.push({
        hop: i,
        ttl: i,
        result: isLoss ? "no-reply" : isDest ? "destination" : "time-exceeded",
        note: isLoss
          ? "No reply. A router may drop, rate limit, or filter the probe."
          : isDest
            ? method === "icmp"
              ? "Echo reply from destination."
              : "Port unreachable from destination."
            : "ICMP Time Exceeded from the hop.",
      });
    }
    return { n, loss, rows };
  }, [hopsRaw, lossHopRaw, method]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Hops to destination</label>
          <input
            value={hopsRaw}
            onChange={(e) => setHopsRaw(e.target.value)}
            inputMode="numeric"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            aria-label="Hops to destination"
          />
          <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">Parsed as {hops.n}</div>
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Simulate no reply at hop</label>
          <input
            value={lossHopRaw}
            onChange={(e) => setLossHopRaw(e.target.value)}
            inputMode="numeric"
            placeholder="leave empty"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            aria-label="Loss hop"
          />
          <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
            {hops.loss ? `No reply at hop ${hops.loss}` : "No simulated loss"}
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Probe style</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as any)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            <option value="icmp">ICMP (ping style)</option>
            <option value="udp">UDP (classic traceroute)</option>
          </select>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600 dark:bg-slate-950/40 dark:text-slate-300">
            <tr>
              <th className="px-3 py-2">Hop</th>
              <th className="px-3 py-2">TTL</th>
              <th className="px-3 py-2">Response</th>
              <th className="px-3 py-2">Meaning</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {hops.rows.map((r) => (
              <tr key={r.hop} className="bg-white dark:bg-transparent">
                <td className="px-3 py-2 font-mono text-slate-900 dark:text-slate-100">{r.hop}</td>
                <td className="px-3 py-2 font-mono text-slate-900 dark:text-slate-100">{r.ttl}</td>
                <td className="px-3 py-2 font-semibold text-slate-900 dark:text-slate-100">
                  {r.result === "time-exceeded" ? "Time exceeded" : r.result === "destination" ? "Destination reached" : "No reply"}
                </td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-slate-700 dark:text-slate-200">
        <p className="m-0">
          Traceroute works because routers decrement TTL. When TTL hits zero, the router returns an ICMP Time Exceeded
          message. Different traceroute variants use different probes.
        </p>
        <p className="mt-2 m-0 text-slate-600 dark:text-slate-300">
          A missing hop does not always mean the hop is down. Many devices rate limit or filter traceroute traffic.
        </p>
      </div>
    </div>
  );
}

