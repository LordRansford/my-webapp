'use client'

import { useMemo, useState } from "react";

const chain = [
  {
    stage: "Initial access",
    goal: "Obtain first foothold",
    weakSignals: ["Odd login times", "Unknown device", "Disabled MFA"],
    defender: "Block or challenge login, verify device, reset tokens",
  },
  {
    stage: "Execution",
    goal: "Run code or commands",
    weakSignals: ["Unusual parent process", "Script from temp folder"],
    defender: "Application allow lists, EDR alerts, kill process",
  },
  {
    stage: "Privilege escalation",
    goal: "Gain higher rights",
    weakSignals: ["Token theft", "Admin group change"],
    defender: "Just-in-time admin, alert on privilege changes",
  },
  {
    stage: "Lateral movement",
    goal: "Reach other systems",
    weakSignals: ["New SMB sessions", "RDP from unusual host"],
    defender: "Segment networks, restrict east-west traffic",
  },
  {
    stage: "Impact",
    goal: "Steal, encrypt, disrupt",
    weakSignals: ["Mass file changes", "Data staging"],
    defender: "Isolate host, revoke credentials, restore from backup",
  },
];

export default function AttackChainTool() {
  const [index, setIndex] = useState(0);
  const [breakPoints, setBreakPoints] = useState({});

  const current = chain[index];
  const disrupted = useMemo(() => Object.keys(breakPoints), [breakPoints]);

  function markBreak(stage) {
    setBreakPoints((prev) => ({
      ...prev,
      [stage]: !prev[stage],
    }));
  }

  const coverage = Math.round((disrupted.length / chain.length) * 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Stage</p>
          <p className="text-base font-semibold text-gray-900">{current.stage}</p>
        </div>
        <div className="flex gap-2">
          <button
            className="button ghost text-sm"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
          >
            Back
          </button>
          <button
            className="button ghost text-sm"
            onClick={() => setIndex((i) => Math.min(chain.length - 1, i + 1))}
            disabled={index === chain.length - 1}
          >
            Next
          </button>
        </div>
      </div>

      <div className="rounded-lg border px-3 py-3 bg-gray-50 text-sm leading-6">
        <div className="font-semibold text-gray-800 mb-1">Attacker goal</div>
        <p className="text-gray-700">{current.goal}</p>
        <div className="font-semibold text-gray-800 mt-3 mb-1">Weak signals</div>
        <ul className="list-disc ml-4 text-gray-700">
          {current.weakSignals.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <div className="font-semibold text-gray-800 mt-3 mb-1">Defender focus</div>
        <p className="text-gray-700">{current.defender}</p>
      </div>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-gray-800">
          <input
            type="checkbox"
            checked={!!breakPoints[current.stage]}
            onChange={() => markBreak(current.stage)}
          />
          Mark this stage as disrupted
        </label>
        <span className="text-xs text-gray-600">
          Coverage: {coverage}% of stages planned
        </span>
      </div>

      <div className="rounded-lg border px-3 py-3 text-sm leading-6">
        <div className="font-semibold text-gray-800 mb-1">Disruption plan</div>
        {disrupted.length === 0 ? (
          <p className="text-gray-700">Choose at least one stage to disrupt. Early stages are cheapest to stop.</p>
        ) : (
          <ul className="list-disc ml-4 text-gray-700">
            {disrupted.map((stage) => (
              <li key={stage}>{stage} marked for disruption.</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
