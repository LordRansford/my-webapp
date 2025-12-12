'use client'

import { useState } from "react";

const events = [
  { id: 1, text: "09:14:02 user=alex action=login outcome=success device=laptop-01" },
  { id: 2, text: "09:14:05 user=alex action=download file=pricing.xlsx size=1.2MB" },
  { id: 3, text: "09:15:11 user=alex action=login outcome=success device=unknown-ip" },
  { id: 4, text: "09:15:15 user=alex action=change-mfa outcome=success" },
  { id: 5, text: "09:18:42 user=alex action=download file=customers.csv size=48MB" },
];

const suspiciousId = 3;

export default function LogStoryTool() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">
        Pick the first event that looks suspicious and note why. Look for changes in device, location, or behaviour.
      </p>

      <div className="space-y-2">
        {events.map((e) => (
          <label
            key={e.id}
            className={`flex items-start gap-2 rounded-md border px-3 py-2 ${
              selected === e.id ? "border-blue-500 bg-blue-50" : "border-gray-200"
            }`}
          >
            <input
              type="radio"
              name="log-choice"
              value={e.id}
              checked={selected === e.id}
              onChange={() => setSelected(e.id)}
              className="mt-1"
            />
            <span className="font-mono text-[13px] leading-5 text-gray-900">{e.text}</span>
          </label>
        ))}
      </div>

      <div className="rounded-lg border px-3 py-3 bg-gray-50 leading-6">
        <div className="font-semibold text-gray-800 mb-1">Interpretation</div>
        {selected == null ? (
          <p className="text-gray-700">Select the first suspicious event.</p>
        ) : selected === suspiciousId ? (
          <p className="text-gray-700">
            Correct. A second login from an unknown device soon after a known device suggests account misuse. The MFA
            change that follows is a critical pivot.
          </p>
        ) : (
          <p className="text-gray-700">
            That event may be normal. Check earlier context: new device plus MFA change is the first real signal.
          </p>
        )}
      </div>
    </div>
  );
}
