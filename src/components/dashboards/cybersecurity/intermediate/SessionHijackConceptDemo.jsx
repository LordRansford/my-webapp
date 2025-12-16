"use client";

import { useState } from "react";

const STEPS = [
  { id: 1, text: "Legitimate user logs in and receives session ID abc123", token: "abc123", actor: "user" },
  { id: 2, text: "User sends request with session ID abc123", token: "abc123", actor: "user" },
  { id: 3, text: "Attacker observes/replays abc123", token: "abc123", actor: "attacker" },
  { id: 4, text: "Attacker uses abc123 to impersonate user", token: "abc123", actor: "attacker" },
];

export default function SessionHijackConceptDemo() {
  const [step, setStep] = useState(0);

  const play = () => {
    setStep(0);
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setStep(Math.min(i, STEPS.length - 1));
      if (i >= STEPS.length - 1) clearInterval(interval);
    }, 800);
  };

  return (
    <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-slate-200">
      <div className="flex items-center justify-between">
        <h4 className="text-base font-semibold text-slate-900">Session hijack concept</h4>
        <button
          onClick={play}
          className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 shadow-sm hover:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300"
        >
          Play scenario
        </button>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {["user", "attacker"].map((actor) => (
          <div key={actor} className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
            <h5 className="text-sm font-semibold text-slate-900 capitalize">{actor}</h5>
            <div className="space-y-2 text-sm text-slate-800">
              {STEPS.filter((s) => s.actor === actor).map((s) => {
                const active = STEPS[step].id >= s.id;
                return (
                  <div
                    key={s.id}
                    className={`rounded-lg border px-3 py-2 shadow-sm ${
                      active ? "border-sky-300 bg-sky-50" : "border-slate-200 bg-white"
                    }`}
                  >
                    {s.text}
                    <div className="mt-1 inline-flex items-center rounded-full border border-slate-300 bg-white px-2 py-0.5 text-xs font-semibold text-slate-900">
                      Token: {s.token}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 shadow-sm">
        <p className="font-semibold">Defences</p>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-800">
          <li>Use HTTPS everywhere; never expose tokens in URLs.</li>
          <li>Store session ids in httpOnly, secure cookies.</li>
          <li>Regenerate session ids on privilege change and logout.</li>
          <li>Add device/context checks to spot unusual reuse.</li>
        </ul>
      </div>
    </div>
  );
}
