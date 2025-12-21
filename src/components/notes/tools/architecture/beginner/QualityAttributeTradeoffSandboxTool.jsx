"use client";

import { useMemo, useState } from "react";

const ATTRIBUTES = [
  "Performance",
  "Scalability",
  "Reliability",
  "Security",
  "Maintainability",
  "Operability",
  "Testability",
];

const TRADEOFFS = {
  Performance: [
    { hurts: "Observability", why: "Removing logs and checks can make debugging harder." },
    { hurts: "Security", why: "Extra validation and encryption can add overhead." },
    { hurts: "Maintainability", why: "Hand tuned optimisations can make code brittle." },
  ],
  Scalability: [
    { hurts: "Operability", why: "More moving parts increases on call complexity." },
    { hurts: "Testability", why: "Distributed behaviour is harder to reproduce locally." },
    { hurts: "Reliability", why: "More dependencies means more partial failures to manage." },
  ],
  Reliability: [
    { hurts: "Cost", why: "Redundancy, retries, and failovers cost money." },
    { hurts: "Performance", why: "Safety checks and replication can add latency." },
    { hurts: "Simplicity", why: "Resilience patterns add complexity." },
  ],
  Security: [
    { hurts: "Performance", why: "Encryption and checks add work per request." },
    { hurts: "Usability", why: "Friction can increase user errors." },
    { hurts: "Velocity", why: "Good security work adds steps to delivery." },
  ],
  Maintainability: [
    { hurts: "Short term delivery speed", why: "Refactoring and clarity take time." },
    { hurts: "Peak performance", why: "Clean abstractions can add small overheads." },
    { hurts: "Feature scope", why: "You may cut features to keep change safe." },
  ],
  Operability: [
    { hurts: "Performance", why: "Instrumentation and safety checks add overhead." },
    { hurts: "Delivery speed", why: "Runbooks and alerts take time to build." },
    { hurts: "Cost", why: "Monitoring and logs have ongoing cost." },
  ],
  Testability: [
    { hurts: "Time to ship", why: "Test harnesses and fixtures take time." },
    { hurts: "Peak performance", why: "Test seams can add small complexity." },
    { hurts: "Short term simplicity", why: "Good tests often require better design." },
  ],
};

export default function QualityAttributeTradeoffSandboxTool() {
  const [primary, setPrimary] = useState("Reliability");

  const items = useMemo(() => {
    return TRADEOFFS[primary] || [];
  }, [primary]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-700">
        Pick one attribute to optimise. The point is not to be perfect. The point is to name what you are sacrificing
        and why.
      </p>

      <label className="block space-y-1">
        <span className="text-sm font-semibold text-slate-800">Primary attribute</span>
        <select
          className="w-full rounded-xl border border-slate-200 bg-white p-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          value={primary}
          onChange={(e) => setPrimary(e.target.value)}
        >
          {ATTRIBUTES.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </label>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Likely trade offs</p>
        <div className="mt-3 grid gap-2">
          {items.map((t) => (
            <div key={`${primary}-${t.hurts}`} className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
              <p className="text-sm text-slate-800">
                <span className="font-semibold">{t.hurts}</span>
                <span className="text-slate-600">: {t.why}</span>
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-600">
          Professional practice: write the trade off down in the decision record so future you knows it was intentional.
        </p>
      </div>
    </div>
  );
}


