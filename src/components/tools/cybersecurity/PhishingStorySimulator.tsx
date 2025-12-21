"use client";

import React, { useState } from "react";

type Spot = {
  id: string;
  label: string;
  explanation: string;
};

const spots: Spot[] = [
  {
    id: "display-name",
    label: "Suspicious display name",
    explanation:
      "The display name is vague and generic. Real organisations use clear names and consistent branding.",
  },
  {
    id: "sender-domain",
    label: "Look alike domain",
    explanation:
      "The sender domain is example-payments.com not example.com. Attackers often register look alike domains.",
  },
  {
    id: "urgency",
    label: "Urgent tone",
    explanation:
      "The message claims your account is suspended and pushes you to act quickly. Pressure is a classic phishing signal.",
  },
  {
    id: "link",
    label: "Login link",
    explanation:
      "The link points to a sign in page hosted on a different domain. Always check where a link really goes before clicking.",
  },
];

export function PhishingStorySimulator() {
  const [selected, setSelected] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);

  const toggle = (id: string) => {
    setRevealed(false);
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const allFound = spots.every((spot) => selected.includes(spot.id));

  return (
    <section
      aria-labelledby="phishing-story-title"
      className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 p-6 sm:p-8 space-y-6"
    >
      <header className="space-y-2">
        <h2
          id="phishing-story-title"
          className="text-lg sm:text-xl font-semibold text-slate-900"
        >
          Phishing story simulator
        </h2>
        <p className="text-sm text-slate-600 max-w-xl">
          Explore a realistic example email and tap on the parts you think are
          suspicious. Then compare your view with an analyst view.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-3 text-sm text-slate-800">
          <header className="border-b border-slate-200 pb-2">
            <div className="flex justify-between text-xs text-slate-500">
              <span>From: Payments team &lt;billing@example-payments.com&gt;</span>
              <button
                type="button"
                className={`rounded-full px-2 py-0.5 text-sm font-medium border ${
                  allFound
                    ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                    : "border-slate-300 text-slate-700 bg-white"
                }`}
              >
                {allFound ? "Nice spotting" : "Find the signals"}
              </button>
            </div>
            <p className="mt-1 text-xs text-slate-600">
              Subject: Urgent: account suspended, update details now
            </p>
          </header>

          <p className="mt-2">
            Hi,
            <br />
            <br />
            We tried to process your latest payment but your account details are
            out of date. Your account has been temporarily suspended.
          </p>
          <p>
            To restore access, please log in within the next 24 hours and
            confirm your billing information. If you do not act, your services
            may be permanently disabled.
          </p>
          <p className="mt-3">
            <button
              type="button"
              onClick={() => toggle("link")}
              className={`rounded-full px-3 py-1 text-xs font-semibold shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 ${
                selected.includes("link")
                  ? "bg-rose-600 text-white"
                  : "bg-sky-600 text-white"
              }`}
            >
              Verify my account
            </button>
          </p>
          <p className="mt-3 text-xs text-slate-500">
            Thank you,  
            <br />
            Payments team
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {spots.map((spot) => (
              <button
                key={spot.id}
                type="button"
                onClick={() => toggle(spot.id)}
                className={`rounded-full border px-2.5 py-1 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 ${
                  selected.includes(spot.id)
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                    : "border-slate-300 bg-white text-slate-700"
                }`}
              >
                {spot.label}
              </button>
            ))}
          </div>
        </article>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">
              How did you do
            </h3>
            <p className="text-xs text-slate-700">
              You have spotted {selected.length} of {spots.length} key signals.
              When you feel ready, reveal the analyst view to see the full
              breakdown.
            </p>
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="mt-3 inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-800 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            >
              Reveal analyst view
            </button>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4 space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Analyst explanation
            </h3>
            {!revealed ? (
              <p className="text-xs text-slate-500">
                The analyst view is hidden until you choose to reveal it. Try to
                find as many suspicious points as you can first.
              </p>
            ) : (
              <ul className="space-y-2 text-xs text-slate-700">
                {spots.map((spot) => (
                  <li key={spot.id}>
                    <p className="font-semibold">
                      {spot.label}{" "}
                      {selected.includes(spot.id) ? (
                        <span className="ml-1 text-emerald-600">✓</span>
                      ) : (
                        <span className="ml-1 text-rose-500">•</span>
                      )}
                    </p>
                    <p>{spot.explanation}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 text-xs text-slate-700 space-y-1.5">
            <p className="font-semibold">Practice tip</p>
            <p>
              Try reading the email once as a normal user and once as an
              attacker. Ask yourself what the attacker wants you to do and what
              they need you to ignore.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
