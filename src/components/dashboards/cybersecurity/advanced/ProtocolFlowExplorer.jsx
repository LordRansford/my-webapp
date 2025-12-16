"use client";

import { useState } from "react";

const STEPS = [
  {
    id: 1,
    title: "Redirect to authorisation server",
    detail: "Client sends user to the authorisation server with client_id and redirect_uri.",
    mistakes: ["Leaking client secrets in the URL", "Using insecure redirect URIs"],
  },
  {
    id: 2,
    title: "User grants consent",
    detail: "User authenticates and approves requested scopes.",
    mistakes: ["Over-broad scopes", "Click-jacking the consent page"],
  },
  {
    id: 3,
    title: "Auth code returned",
    detail: "Authorisation code is sent to the client on the redirect_uri.",
    mistakes: ["Putting code in fragments where scripts can read it", "Logging codes in plaintext"],
  },
  {
    id: 4,
    title: "Client swaps code for token",
    detail: "Client posts code plus client secret to get an access token.",
    mistakes: ["Sending secrets over http", "Storing tokens in localStorage without rotation"],
  },
  {
    id: 5,
    title: "Client calls resource server",
    detail: "Client calls API with the bearer token in the Authorization header.",
    mistakes: ["Leaking tokens in URLs", "Not validating audience or expiry"],
  },
];

export default function ProtocolFlowExplorer() {
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
          <p className="mt-1 text-sm text-slate-800">{current.detail}</p>
          <div className="mt-3 text-sm text-slate-900">
            Parties:
            <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-800">
              <li>Client</li>
              <li>Authorisation server</li>
              <li>Resource server</li>
            </ul>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h5 className="text-sm font-semibold text-slate-900">Common mistakes</h5>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-800">
            {current.mistakes.map((m) => (
              <li key={m}>{m}</li>
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
