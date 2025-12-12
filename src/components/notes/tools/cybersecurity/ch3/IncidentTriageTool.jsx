'use client'

import { useMemo, useState } from "react";

const scenarios = {
  phishing: {
    alert: "Multiple users reported a similar email with a link to a fake login page.",
    hints: ["Urgency in email", "Domain mismatch", "No MFA prompt after login"],
    bestAction: "Contain",
    note: "Block sender and domain, warn users, reset sessions for any clicks.",
  },
  edr: {
    alert: "EDR reports script execution from temp directory on a finance workstation.",
    hints: ["Unusual process parent", "Critical asset", "Potential lateral movement"],
    bestAction: "Contain",
    note: "Isolate host, capture memory if possible, preserve logs before remediation.",
  },
  mfa: {
    alert: "Spike in MFA push denials for one account outside business hours.",
    hints: ["MFA fatigue attempt", "Account targeting", "Likely credential stuffing"],
    bestAction: "Contain",
    note: "Lock account temporarily, force reset, review access logs.",
  },
};

const actions = ["Observe", "Contain", "Eradicate", "Recover"];

export default function IncidentTriageTool() {
  const [scenarioKey, setScenarioKey] = useState("phishing");
  const [severity, setSeverity] = useState(2);
  const [action, setAction] = useState("Contain");

  const scenario = useMemo(() => scenarios[scenarioKey], [scenarioKey]);

  return (
    <div className="space-y-4 text-sm">
      <div className="flex gap-3 items-center">
        <label className="text-xs uppercase tracking-wide text-gray-500">Scenario</label>
        <select
          value={scenarioKey}
          onChange={(e) => setScenarioKey(e.target.value)}
          className="rounded-md border px-2 py-1 text-sm"
        >
          <option value="phishing">Phishing campaign</option>
          <option value="edr">EDR script alert</option>
          <option value="mfa">MFA fatigue</option>
        </select>
      </div>

      <div className="rounded-lg border px-3 py-3 bg-gray-50 leading-6">
        <div className="font-semibold text-gray-800 mb-1">Alert</div>
        <p className="text-gray-800">{scenario.alert}</p>
        <p className="text-xs text-gray-600 mt-2">Hints: {scenario.hints.join(" · ")}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block space-y-1">
          <span className="text-xs uppercase tracking-wide text-gray-500">Severity (1 low - 5 high)</span>
          <input
            type="range"
            min="1"
            max="5"
            value={severity}
            onChange={(e) => setSeverity(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-sm text-gray-800">Chosen: {severity}</span>
        </label>

        <label className="block space-y-1">
          <span className="text-xs uppercase tracking-wide text-gray-500">First action</span>
          <div className="flex flex-wrap gap-2">
            {actions.map((a) => (
              <button
                key={a}
                className={`px-3 py-1 rounded-full border text-sm ${
                  action === a ? "border-blue-500 text-blue-700 bg-blue-50" : "border-gray-200 text-gray-700"
                }`}
                onClick={() => setAction(a)}
                type="button"
              >
                {a}
              </button>
            ))}
          </div>
        </label>
      </div>

      <div className="rounded-lg border px-3 py-3 leading-6">
        <div className="font-semibold text-gray-800 mb-1">Guidance</div>
        {action === scenario.bestAction ? (
          <p className="text-gray-800">
            Correct. {scenario.note} Severity {severity} means speed matters. Keep evidence intact.
          </p>
        ) : (
          <p className="text-gray-800">
            Consider containing first. {scenario.note} Move to eradication after you have evidence and isolation.
          </p>
        )}
      </div>
    </div>
  );
}
