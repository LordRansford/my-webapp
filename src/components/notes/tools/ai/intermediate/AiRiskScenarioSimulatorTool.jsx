"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, ClipboardCopy, ShieldAlert } from "lucide-react";
import { CheckPill } from "@/components/ui/CheckPill";

const RISK_CATALOGUE = [
  {
    key: "bias",
    label: "Bias and unfair outcomes",
    hint: "Errors fall more heavily on some groups, often via proxy features or skewed data.",
  },
  {
    key: "drift",
    label: "Drift and silent degradation",
    hint: "Production behaviour changes so yesterday's model becomes wrong quietly.",
  },
  {
    key: "misuse",
    label: "Misuse and scope creep",
    hint: "A recommendation becomes a decision and nobody owns the harm.",
  },
  {
    key: "leakage",
    label: "Leakage and fake performance",
    hint: "The model learns a shortcut that will not exist at prediction time.",
  },
  {
    key: "security",
    label: "Security and abuse",
    hint: "Prompt injection, data exfiltration, account takeover, or malicious inputs.",
  },
  {
    key: "ops",
    label: "Operational failure",
    hint: "No rollback, no monitoring, no incident playbook, and no human authority.",
  },
];

const SCENARIOS = [
  {
    id: "hiring_ranker",
    title: "Hiring shortlisting tool",
    minutes: 6,
    level: "Core",
    setup:
      "A model ranks applicants for a busy hiring team. The business wants faster screening. The team wants fewer false positives.",
    prompt: "What could go wrong here, and what would you put in place before launch?",
    suggested: ["bias", "misuse", "drift", "ops"],
    goodMoves: [
      "Define what the model is allowed to do and what it cannot do.",
      "Use a separate fairness evaluation on relevant slices and document the trade offs.",
      "Design a review workflow where humans can override and capture reasons.",
      "Monitor model outputs and complaints, not just accuracy.",
    ],
  },
  {
    id: "fraud_flagger",
    title: "Fraud detection flagger",
    minutes: 6,
    level: "Core",
    setup:
      "A model flags suspicious transactions. False positives annoy customers. False negatives cost money. Attackers adapt quickly.",
    prompt: "Where do you expect drift, and what signals would you monitor in week one?",
    suggested: ["drift", "security", "ops", "leakage"],
    goodMoves: [
      "Set thresholds based on business cost, not on a single metric.",
      "Monitor base rates, alert volume, and manual review outcomes.",
      "Treat adversarial adaptation as normal and plan retraining cadence.",
      "Keep a safe fallback policy if the model behaves oddly.",
    ],
  },
  {
    id: "support_assistant",
    title: "Support assistant using internal docs",
    minutes: 7,
    level: "Stretch",
    setup:
      "A support assistant answers customer questions using internal documentation. It can draft replies and suggest actions to staff.",
    prompt: "What security and governance risks appear, even if the model is accurate on demos?",
    suggested: ["security", "misuse", "ops"],
    goodMoves: [
      "Limit tools and actions. Require approval for anything destructive.",
      "Log sources and show citations so staff can verify answers quickly.",
      "Red team prompt injection and data exfiltration attempts.",
      "Add a clear owner and an incident path for harmful outputs.",
    ],
  },
];

const uniq = (arr) => Array.from(new Set(arr));

export default function AiRiskScenarioSimulatorTool() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0]?.id ?? "");
  const [selected, setSelected] = useState(() => new Set());
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);

  const scenario = useMemo(() => SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0], [scenarioId]);

  const selectedKeys = useMemo(() => Array.from(selected), [selected]);

  const missing = useMemo(() => {
    const expected = uniq(scenario?.suggested || []);
    return expected.filter((k) => !selected.has(k));
  }, [scenario, selected]);

  const scoreTone = useMemo(() => {
    const count = selected.size;
    if (count >= 4) return "good";
    if (count >= 2) return "warn";
    return "bad";
  }, [selected]);

  const summary = useMemo(() => {
    const risks = selectedKeys
      .map((k) => RISK_CATALOGUE.find((r) => r.key === k)?.label)
      .filter(Boolean);
    const riskText = risks.length ? risks.join(", ") : "none selected";
    const missingText = missing.length ? missing.join(", ") : "none";
    return `Scenario: ${scenario?.title}\nRisks selected: ${riskText}\nMissing common risks: ${missingText}\nNotes: ${notes || "-"}`;
  }, [missing, notes, scenario, selectedKeys]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 ring-1 ring-amber-100">
          <ShieldAlert className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">AI risk scenario simulator</p>
          <p className="mt-1 text-xs text-slate-600">
            Pick a scenario. Select risks you would review before launch. Write one line about your boundary.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
          <label className="block text-xs font-semibold text-slate-600">
            Scenario
            <select
              value={scenarioId}
              onChange={(e) => {
                setScenarioId(e.target.value);
                setSelected(new Set());
                setNotes("");
                setCopied(false);
              }}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
            >
              {SCENARIOS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3">
            <p className="text-xs font-semibold text-slate-600">Setup</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-800">{scenario?.setup}</p>
            <p className="mt-3 text-xs font-semibold text-slate-600">Prompt</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-800">{scenario?.prompt}</p>
            <p className="mt-3 text-xs text-slate-600">
              Suggested time: <span className="font-semibold text-slate-900">{scenario?.minutes} min</span>
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold text-slate-600">Risk review checklist</p>
              <p className="mt-1 text-xs text-slate-600">Select what you would check before launch.</p>
            </div>
            <div
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                scoreTone === "good"
                  ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100"
                  : scoreTone === "warn"
                  ? "bg-amber-50 text-amber-800 ring-1 ring-amber-100"
                  : "bg-rose-50 text-rose-800 ring-1 ring-rose-100"
              }`}
            >
              {scoreTone === "good" ? (
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              ) : (
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              )}
              {selected.size} selected
            </div>
          </div>

          <div className="mt-3 grid gap-2">
            {RISK_CATALOGUE.map((risk) => (
              <CheckPill
                key={risk.key}
                checked={selected.has(risk.key)}
                onCheckedChange={(next) => {
                  const copy = new Set(selected);
                  if (next) copy.add(risk.key);
                  else copy.delete(risk.key);
                  setSelected(copy);
                }}
                tone={scenario?.suggested?.includes(risk.key) ? "amber" : "slate"}
                after={
                  scenario?.suggested?.includes(risk.key) ? (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[0.7rem] font-semibold text-amber-900">
                      Common
                    </span>
                  ) : null
                }
              >
                <span className="block min-w-0">
                  <span className="block text-xs font-semibold text-slate-900">{risk.label}</span>
                  <span className="mt-0.5 block text-xs text-slate-600">{risk.hint}</span>
                </span>
              </CheckPill>
            ))}
          </div>

          <label className="mt-4 block text-xs font-semibold text-slate-600">
            One sentence boundary
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-900"
              placeholder="Example: The model can suggest, but a human owns the decision and can override it."
            />
          </label>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
            <p className="text-xs font-semibold text-slate-600">What I would expect you to notice</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-800">
              {(scenario?.goodMoves || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {missing.length ? (
              <p className="mt-3 text-xs text-slate-700">
                You did not select: <span className="font-semibold">{missing.join(", ")}</span>
              </p>
            ) : (
              <p className="mt-3 text-xs text-slate-700">Good coverage. Now write what you would monitor in week one.</p>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring focus:ring-blue-200"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(summary);
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 1500);
                } catch {
                  setCopied(false);
                }
              }}
            >
              <ClipboardCopy className="h-4 w-4" aria-hidden="true" />
              {copied ? "Copied" : "Copy summary"}
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring focus:ring-blue-200"
              onClick={() => {
                setSelected(new Set());
                setNotes("");
                setCopied(false);
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
