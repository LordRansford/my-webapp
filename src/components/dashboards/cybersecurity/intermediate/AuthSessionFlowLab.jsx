"use client";

import { useState } from "react";

const STEPS = [
  {
    id: 1,
    title: "User submits credentials",
    client: "Sends username/password over HTTPS",
    server: "Receives credentials, checks rate limits",
    failures: ["Weak password policy", "No rate limiting", "Credentials sent over http"],
  },
  {
    id: 2,
    title: "Server validates credentials",
    client: "Waits for response",
    server: "Validates hash, checks MFA",
    failures: ["Password stored in plaintext", "Missing MFA", "Verbose errors revealing account validity"],
  },
  {
    id: 3,
    title: "Session or token is issued",
    client: "Stores token/session id (should be httpOnly cookie or secure storage)",
    server: "Creates session state with expiry and scope",
    failures: ["Session id in URL", "No expiry/rotation", "Over-broad scopes"],
  },
  {
    id: 4,
    title: "Authenticated request",
    client: "Sends cookie or Authorization header with token",
    server: "Authorises based on session and permissions",
    failures: ["CSRF missing", "Broken access control", "Token leaked in logs"],
  },
  {
    id: 5,
    title: "Session renews or expires",
    client: "Renews or re-authenticates when token expires",
    server: "Rotates tokens and clears sessions on logout/privilege change",
    failures: ["No rotation on privilege change", "Long-lived tokens", "No logout invalidation"],
  },
];

export default function AuthSessionFlowLab() {
  const [step, setStep] = useState(0);

  const current = STEPS[step];

  return (
    <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-slate-200">
      <div className="flex items-center justify-between text-sm text-slate-700">
        <span>
          Step {step + 1} / {STEPS.length}
        </span>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
          <h4 className="text-base font-semibold text-slate-900">{current.title}</h4>
          <div className="mt-2 text-sm text-slate-800">
            <span className="font-semibold">Client sends:</span> {current.client}
          </div>
          <div className="mt-1 text-sm text-slate-800">
            <span className="font-semibold">Server does:</span> {current.server}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h5 className="text-sm font-semibold text-slate-900">Common failures</h5>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-800">
            {current.failures.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:opacity-50"
          disabled={step === 0}
        >
          Previous
        </button>
        <button
          onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:opacity-50"
          disabled={step === STEPS.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}
