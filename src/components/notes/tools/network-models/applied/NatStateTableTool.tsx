"use client";

import { useMemo, useState } from "react";

type Mapping = {
  id: string;
  createdAt: number;
  internalIp: string;
  internalPort: number;
  externalIp: string;
  externalPort: number;
  remoteIp: string;
  remotePort: number;
  protocol: "TCP" | "UDP";
  ttlSeconds: number;
};

function randPort(min = 20000, max = 65000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function nowSeconds() {
  return Math.floor(Date.now() / 1000);
}

export default function NatStateTableTool() {
  const [internalIp, setInternalIp] = useState("192.168.1.10");
  const [externalIp, setExternalIp] = useState("203.0.113.5");
  const [remoteIp, setRemoteIp] = useState("93.184.216.34");
  const [remotePortRaw, setRemotePortRaw] = useState("443");
  const [protocol, setProtocol] = useState<"TCP" | "UDP">("TCP");
  const [mappings, setMappings] = useState<Mapping[]>([]);

  const remotePort = useMemo(() => {
    const p = Math.floor(Number(remotePortRaw) || 443);
    return Math.max(1, Math.min(65535, p));
  }, [remotePortRaw]);

  const rows = useMemo(() => {
    const t = nowSeconds();
    return mappings
      .map((m) => {
        const age = t - m.createdAt;
        const remaining = Math.max(0, m.ttlSeconds - age);
        return { ...m, remaining };
      })
      .filter((m) => m.remaining > 0)
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [mappings]);

  function addFlow() {
    const entry: Mapping = {
      id: `m-${Math.random().toString(16).slice(2)}`,
      createdAt: nowSeconds(),
      internalIp: internalIp.trim() || "192.168.1.10",
      internalPort: randPort(40000, 65000),
      externalIp: externalIp.trim() || "203.0.113.5",
      externalPort: randPort(20000, 65000),
      remoteIp: remoteIp.trim() || "93.184.216.34",
      remotePort,
      protocol,
      ttlSeconds: protocol === "UDP" ? 30 : 120,
    };
    setMappings((prev) => [entry, ...prev].slice(0, 24));
  }

  function sweepExpired() {
    const t = nowSeconds();
    setMappings((prev) => prev.filter((m) => t - m.createdAt < m.ttlSeconds));
  }

  function reset() {
    setMappings([]);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Internal host</label>
          <input
            value={internalIp}
            onChange={(e) => setInternalIp(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            placeholder="192.168.1.10"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">External public IP</label>
          <input
            value={externalIp}
            onChange={(e) => setExternalIp(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            placeholder="203.0.113.5"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Remote destination</label>
          <div className="mt-1 grid grid-cols-3 gap-2">
            <input
              value={remoteIp}
              onChange={(e) => setRemoteIp(e.target.value)}
              className="col-span-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              placeholder="93.184.216.34"
            />
            <input
              value={remotePortRaw}
              onChange={(e) => setRemotePortRaw(e.target.value)}
              inputMode="numeric"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              placeholder="443"
              aria-label="Remote port"
            />
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Protocol</label>
          <select
            value={protocol}
            onChange={(e) => setProtocol(e.target.value as any)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            <option value="TCP">TCP</option>
            <option value="UDP">UDP</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={addFlow}
            className="rounded-full bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Add outbound flow
          </button>
          <button
            type="button"
            onClick={sweepExpired}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900/40"
          >
            Sweep expired
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900/40"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600 dark:bg-slate-950/40 dark:text-slate-300">
            <tr>
              <th className="px-3 py-2">Internal</th>
              <th className="px-3 py-2">NAT public</th>
              <th className="px-3 py-2">Remote</th>
              <th className="px-3 py-2">Proto</th>
              <th className="px-3 py-2">TTL left</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {rows.map((m) => (
              <tr key={m.id} className="bg-white dark:bg-transparent">
                <td className="px-3 py-2 font-mono text-slate-900 dark:text-slate-100">
                  {m.internalIp}:{m.internalPort}
                </td>
                <td className="px-3 py-2 font-mono text-slate-900 dark:text-slate-100">
                  {m.externalIp}:{m.externalPort}
                </td>
                <td className="px-3 py-2 font-mono text-slate-700 dark:text-slate-200">
                  {m.remoteIp}:{m.remotePort}
                </td>
                <td className="px-3 py-2 font-semibold text-slate-900 dark:text-slate-100">{m.protocol}</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{m.remaining}s</td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td className="px-3 py-4 text-slate-600 dark:text-slate-300" colSpan={5}>
                  No active mappings. Add an outbound flow to see how a mapping is created.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-slate-700 dark:text-slate-200">
        <p className="m-0">
          NAT often feels like magic until you treat it as a state table. If the state expires or the mapping changes,
          long lived sessions can break.
        </p>
        <p className="mt-2 m-0 text-slate-600 dark:text-slate-300">
          NAT is not a firewall. Many devices bundle NAT with stateful filtering, which is why people confuse them.
        </p>
      </div>
    </div>
  );
}

