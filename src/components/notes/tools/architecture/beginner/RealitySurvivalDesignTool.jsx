"use client";

import { useMemo, useState } from "react";

const SCENARIOS = [
  {
    id: "checkout",
    name: "Checkout service for an online shop",
    description:
      "Orders are placed, payments are taken, and users receive confirmation. Peak traffic happens during promotions.",
    prompts: [
      {
        id: "security",
        label: "Security focus",
        options: [
          {
            value: "trust-boundaries",
            title: "Make trust boundaries explicit",
            consequence:
              "Attack surface shrinks when boundaries are clear. Auth and validation become consistent and auditable.",
          },
          {
            value: "implicit",
            title: "Assume internal services are trusted",
            consequence:
              "Small mistakes become big incidents. One compromised service can move laterally through the system.",
          },
        ],
      },
      {
        id: "data",
        label: "Data ownership focus",
        options: [
          {
            value: "owned",
            title: "One owner per dataset",
            consequence:
              "Governance and debugging get easier. You reduce duplicated sources of truth and accidental inconsistencies.",
          },
          {
            value: "shared",
            title: "Many services write to the same tables",
            consequence:
              "You gain speed briefly but lose control. Changes ripple and failures become harder to diagnose.",
          },
        ],
      },
      {
        id: "ai",
        label: "AI usage focus",
        options: [
          {
            value: "guarded",
            title: "AI is optional with a fallback path",
            consequence:
              "You can roll back safely. Monitoring and versioning become part of the release process.",
          },
          {
            value: "required",
            title: "AI is required for the core flow",
            consequence:
              "You inherit new failure modes. Latency, drift, and outages now block the business workflow.",
          },
        ],
      },
    ],
  },
  {
    id: "support",
    name: "Customer support triage",
    description:
      "Tickets arrive from email and chat. The system routes to teams and suggests replies. Sensitive customer data is present.",
    prompts: [
      {
        id: "security",
        label: "Security focus",
        options: [
          {
            value: "least-privilege",
            title: "Least privilege everywhere",
            consequence:
              "Incidents are contained. Data access is intentional and reviewable instead of accidental.",
          },
          {
            value: "broad-access",
            title: "Broad internal access for speed",
            consequence:
              "You trade speed for risk. One mistake can expose data and create compliance issues.",
          },
        ],
      },
      {
        id: "data",
        label: "Data focus",
        options: [
          {
            value: "minimise",
            title: "Minimise what the system stores",
            consequence:
              "Breach impact drops and governance is simpler. You keep only what is needed for the workflow.",
          },
          {
            value: "collect-more",
            title: "Collect everything for future analysis",
            consequence:
              "Storage and governance costs rise. You increase risk without guaranteed benefit.",
          },
        ],
      },
      {
        id: "ai",
        label: "AI focus",
        options: [
          {
            value: "human-review",
            title: "Humans approve AI suggestions",
            consequence:
              "Errors are caught earlier. Accountability remains with the team, not the model output.",
          },
          {
            value: "auto-send",
            title: "Auto send suggested replies",
            consequence:
              "You can scale fast but you can also scale mistakes. Monitoring and shutdown become mandatory.",
          },
        ],
      },
    ],
  },
] ;

export default function RealitySurvivalDesignTool() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const [choiceMap, setChoiceMap] = useState(() => ({ security: "", data: "", ai: "" }));

  const scenario = useMemo(() => SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0], [scenarioId]);

  const prompts = useMemo(() => scenario.prompts, [scenario]);

  const resolved = useMemo(() => {
    const out = [];
    for (const p of prompts) {
      const selected = choiceMap[p.id];
      const found = p.options.find((o) => o.value === selected);
      out.push({ id: p.id, label: p.label, selected: found });
    }
    return out;
  }, [prompts, choiceMap]);

  const setChoice = (id, value) => {
    setChoiceMap((m) => ({ ...m, [id]: value }));
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-700">
        Pick a scenario, make a few architecture choices, then read the consequences. This is practice in balancing
        software, security, data, and AI concerns without pretending there is one perfect answer.
      </p>

      <label className="block space-y-1">
        <span className="text-sm font-semibold text-slate-800">Scenario</span>
        <select
          className="w-full rounded-xl border border-slate-200 bg-white p-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          value={scenarioId}
          onChange={(e) => {
            const next = e.target.value;
            setScenarioId(next);
            setChoiceMap({ security: "", data: "", ai: "" });
          }}
        >
          {SCENARIOS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </label>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">{scenario.name}</p>
        <p className="mt-2 text-sm text-slate-700">{scenario.description}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {prompts.map((p) => (
          <div key={p.id} className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">{p.label}</p>
            <div className="mt-3 space-y-2">
              {p.options.map((o) => {
                const active = choiceMap[p.id] === o.value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => setChoice(p.id, o.value)}
                    className={`w-full rounded-xl border px-3 py-2 text-left text-sm shadow-sm ${
                      active
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-800 hover:border-slate-300"
                    }`}
                  >
                    <span className="font-semibold">{o.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Consequences</p>
        <div className="mt-3 grid gap-2">
          {resolved.map((r) => (
            <div key={r.id} className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">{r.label}</p>
              {r.selected ? (
                <>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{r.selected.title}</p>
                  <p className="mt-1 text-sm text-slate-700">{r.selected.consequence}</p>
                </>
              ) : (
                <p className="mt-1 text-sm text-slate-700">Pick an option to see the trade off.</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


