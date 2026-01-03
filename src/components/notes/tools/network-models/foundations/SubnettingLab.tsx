"use client";

import { useMemo, useState } from "react";

function parseIpv4(input: string): number | null {
  const parts = input.trim().split(".");
  if (parts.length !== 4) return null;
  const nums = parts.map((p) => Number(p));
  if (nums.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return null;
  return ((nums[0] << 24) >>> 0) + (nums[1] << 16) + (nums[2] << 8) + nums[3];
}

function ipv4ToString(n: number): string {
  const a = (n >>> 24) & 255;
  const b = (n >>> 16) & 255;
  const c = (n >>> 8) & 255;
  const d = n & 255;
  return `${a}.${b}.${c}.${d}`;
}

function prefixToMask(prefix: number): number {
  if (prefix <= 0) return 0;
  if (prefix >= 32) return 0xffffffff >>> 0;
  return ((0xffffffff << (32 - prefix)) >>> 0) >>> 0;
}

function clampPrefix(n: number): number {
  if (!Number.isFinite(n)) return 24;
  return Math.max(0, Math.min(32, Math.floor(n)));
}

export default function SubnettingLab() {
  const [ip, setIp] = useState("192.168.10.42");
  const [prefixRaw, setPrefixRaw] = useState("24");

  const prefix = useMemo(() => clampPrefix(Number(prefixRaw)), [prefixRaw]);

  const result = useMemo(() => {
    const ipNum = parseIpv4(ip);
    if (ipNum == null) return { ok: false as const, error: "Enter a valid IPv4 address." };

    const mask = prefixToMask(prefix);
    const network = (ipNum & mask) >>> 0;
    const broadcast = (network | (~mask >>> 0)) >>> 0;

    const hostBits = 32 - prefix;
    const totalAddresses = hostBits >= 32 ? 2 ** 32 : 2 ** hostBits;

    const isHostSubnet = prefix <= 30;
    const firstHost = isHostSubnet ? (network + 1) >>> 0 : network;
    const lastHost = isHostSubnet ? (broadcast - 1) >>> 0 : broadcast;
    const usableHosts = prefix >= 31 ? (prefix === 31 ? 2 : 1) : Math.max(0, totalAddresses - 2);

    return {
      ok: true as const,
      ip: ipv4ToString(ipNum),
      prefix,
      mask: ipv4ToString(mask),
      network: ipv4ToString(network),
      broadcast: ipv4ToString(broadcast),
      firstHost: ipv4ToString(firstHost),
      lastHost: ipv4ToString(lastHost),
      totalAddresses,
      usableHosts,
      notes:
        prefix === 31
          ? "A /31 is commonly used on point to point links. There is no network and broadcast split in the usual sense."
          : prefix === 32
            ? "A /32 is a single host route."
            : null,
    };
  }, [ip, prefix]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">IPv4 address</label>
          <input
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            inputMode="numeric"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            placeholder="192.168.10.42"
            aria-label="IPv4 address"
          />
        </div>
        <div className="w-full sm:w-40">
          <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">CIDR prefix</label>
          <input
            value={prefixRaw}
            onChange={(e) => setPrefixRaw(e.target.value)}
            inputMode="numeric"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            placeholder="24"
            aria-label="CIDR prefix length"
          />
          <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">Parsed as /{prefix}</div>
        </div>
      </div>

      <div className="mt-4">
        {!result.ok ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200">
            {result.error}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/40">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Network</div>
              <div className="mt-1 font-mono text-sm text-slate-900 dark:text-slate-100">
                {result.network}/{result.prefix}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/40">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Netmask</div>
              <div className="mt-1 font-mono text-sm text-slate-900 dark:text-slate-100">{result.mask}</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/40">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Broadcast</div>
              <div className="mt-1 font-mono text-sm text-slate-900 dark:text-slate-100">{result.broadcast}</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/40">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Usable hosts</div>
              <div className="mt-1 font-mono text-sm text-slate-900 dark:text-slate-100">{result.usableHosts}</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/40">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">First host</div>
              <div className="mt-1 font-mono text-sm text-slate-900 dark:text-slate-100">{result.firstHost}</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/40">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Last host</div>
              <div className="mt-1 font-mono text-sm text-slate-900 dark:text-slate-100">{result.lastHost}</div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-slate-700 dark:text-slate-200">
        <p className="m-0">
          A subnet is a range. Routing decisions use the prefix length. Local delivery uses ARP or NDP inside the local
          link.
        </p>
        {result.ok && result.notes ? <p className="mt-2 m-0 text-slate-600 dark:text-slate-300">{result.notes}</p> : null}
      </div>
    </div>
  );
}

