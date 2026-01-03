"use client";

import { useMemo, useState } from "react";

type Symptom = "slow" | "timeouts" | "cannot-connect" | "only-some-users";

type Row = {
  layer: string;
  question: string;
  smallestTest: string;
  likelyCauses: string;
};

const MATRIX: Record<Symptom, Row[]> = {
  slow: [
    {
      layer: "Link and Wi Fi",
      question: "Is there loss, low signal quality, or interference",
      smallestTest: "Compare a wired device and a Wi Fi device. Check retransmissions and loss signals.",
      likelyCauses: "Weak signal, congestion, interference, overloaded access point.",
    },
    {
      layer: "Transport",
      question: "Is the connect phase slow or unstable",
      smallestTest: "Measure connect time versus server response time. Look for resets and retries.",
      likelyCauses: "SYN loss, middlebox timeouts, overloaded edge, bad path.",
    },
    {
      layer: "Application",
      question: "Is the server slow after the request is received",
      smallestTest: "Check TTFB and server timings. Compare cached and uncached paths.",
      likelyCauses: "Slow database, slow upstream call, CPU saturation, contention.",
    },
  ],
  timeouts: [
    {
      layer: "DNS",
      question: "Are name lookups timing out or returning inconsistent answers",
      smallestTest: "Resolve with a known resolver and compare results. Check if the issue is cache related.",
      likelyCauses: "Resolver outage, delegation issue, split DNS, captive portal.",
    },
    {
      layer: "Transport",
      question: "Do connections hang or drop mid session",
      smallestTest: "Check for idle timeouts and NAT expiry. Look for retransmissions then a reset.",
      likelyCauses: "NAT mapping expiry, firewall idle timeout, path MTU issues, loss bursts.",
    },
    {
      layer: "Application",
      question: "Are requests hitting a slow code path or failing under load",
      smallestTest: "Look for correlated error spikes and latency spikes.",
      likelyCauses: "Overload, thread pool exhaustion, rate limiting, upstream dependency failure.",
    },
  ],
  "cannot-connect": [
    {
      layer: "Local network",
      question: "Do you have an IP, default gateway, and DNS",
      smallestTest: "Confirm a valid IP lease and that the gateway is reachable.",
      likelyCauses: "DHCP failure, wrong VLAN, Wi Fi auth problem, cable issue.",
    },
    {
      layer: "Routing",
      question: "Is there a valid route to the destination network",
      smallestTest: "Traceroute to find where the path stops. Compare with and without VPN.",
      likelyCauses: "Missing route, policy route, VPN conflict, upstream outage.",
    },
    {
      layer: "Firewall policy",
      question: "Is the destination port blocked",
      smallestTest: "Try a known open port and compare. Check if only one port fails.",
      likelyCauses: "Blocked egress, blocked ingress, geo policy, service down.",
    },
  ],
  "only-some-users": [
    {
      layer: "DNS and geo",
      question: "Do different users resolve to different IPs",
      smallestTest: "Compare DNS answers from different networks and locations.",
      likelyCauses: "Geo DNS, CDN edge issue, stale cache, split horizon DNS.",
    },
    {
      layer: "Path and MTU",
      question: "Do some paths drop large packets",
      smallestTest: "Compare behaviour on VPN versus direct. Look for handshake stalls.",
      likelyCauses: "Path MTU black hole, asymmetric routing, middlebox quirks.",
    },
    {
      layer: "Application and auth",
      question: "Do only some accounts or sessions fail",
      smallestTest: "Compare anonymous and signed in traffic. Check cookies and auth flows.",
      likelyCauses: "Broken authorisation path, cache key mistakes, session bugs.",
    },
  ],
};

export default function SignalTriageMatrixTool() {
  const [symptom, setSymptom] = useState<Symptom>("slow");

  const rows = useMemo(() => MATRIX[symptom], [symptom]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Symptom</div>
          <div className="mt-1 text-sm text-slate-700 dark:text-slate-200">
            Pick the user level symptom, then isolate boundaries.
          </div>
        </div>
        <div className="w-full sm:w-80">
          <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Choose one</label>
          <select
            value={symptom}
            onChange={(e) => setSymptom(e.target.value as any)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            <option value="slow">The site is slow</option>
            <option value="timeouts">Requests time out</option>
            <option value="cannot-connect">Cannot connect at all</option>
            <option value="only-some-users">Only some users are affected</option>
          </select>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {rows.map((r) => (
          <div key={r.layer} className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/40">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="font-semibold text-slate-900 dark:text-slate-100">{r.layer}</div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Boundary question</div>
            </div>
            <div className="mt-1 text-sm text-slate-700 dark:text-slate-200">{r.question}</div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900/40">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Smallest test</div>
                <div className="mt-1 text-sm text-slate-700 dark:text-slate-200">{r.smallestTest}</div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900/40">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Likely causes</div>
                <div className="mt-1 text-sm text-slate-700 dark:text-slate-200">{r.likelyCauses}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
        The point is not to memorise. The point is to isolate one boundary, measure, then update your hypothesis.
      </div>
    </div>
  );
}

