"use client";

import React, { useMemo, useState } from "react";
import { Search, ThumbsUp, Shield, Workflow } from "lucide-react";
import SwitchRow from "@/components/ui/SwitchRow";
import TryItLiveButton from "@/components/ai-studio/TryItLiveButton";
import ReadyToBuildCTA from "@/components/ai-studio/ReadyToBuildCTA";

type UseCase = "Search" | "Recommendation" | "Moderation" | "Automation";

export default function PracticalUseCasesLab() {
  const [useCase, setUseCase] = useState<UseCase>("Search");
  const [risk, setRisk] = useState(2);
  const [oversight, setOversight] = useState(true);

  const details = useMemo(() => {
    if (useCase === "Search")
      return {
        icon: Search,
        what: "Use AI to help users find relevant information, with grounding in known sources.",
        risks: ["Hallucinations if answers are not grounded.", "Privacy leakage if prompts include sensitive info.", "Silent failure when the query is ambiguous."],
        controls: ["Citations to source content", "Fallback to keyword search", "Logs of queries and failure cases"],
      };
    if (useCase === "Recommendation")
      return {
        icon: ThumbsUp,
        what: "Use AI to rank or recommend items (content, products, actions) based on signals and preferences.",
        risks: ["Feedback loops and filter bubbles.", "Bias amplification from historical data.", "Hard-to-debug regressions after model updates."],
        controls: ["Diversity constraints", "User controls and explanations", "A/B tests and monitoring for drift"],
      };
    if (useCase === "Moderation")
      return {
        icon: Shield,
        what: "Use AI to detect harmful or unsafe content, with human review where needed.",
        risks: ["False positives harm users and trust.", "False negatives cause safety risk.", "Group-dependent error rates and context ambiguity."],
        controls: ["Human review queues", "Appeals process", "Group-level evaluation and audit sampling"],
      };
    return {
      icon: Workflow,
      what: "Use AI to automate steps in a workflow, ideally with guardrails and human approval for high impact actions.",
      risks: ["Automation of wrong decisions at scale.", "Hidden dependence on unstable prompts.", "Poor recovery when the system fails."],
      controls: ["Approval gates", "Rate limits and rollbacks", "Clear runbooks and incident playbooks"],
    };
  }, [useCase]);

  const stance = useMemo(() => {
    const r = ["Low", "Some", "Medium", "High", "Very high"][risk];
    if (risk >= 4 && !oversight) return `Risk is ${r} with no oversight. Do not automate. Use decision support only.`;
    if (risk >= 3) return `Risk is ${r}. Require monitoring, escalation, and a recovery plan.`;
    return `Risk is ${r}. A lightweight AI assist can be appropriate if privacy and evaluation are handled.`;
  }, [risk, oversight]);

  return (
    <section className="space-y-6" aria-label="Practical use cases lab">
      <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
        <h2 className="text-2xl font-semibold text-slate-900">Practical use cases</h2>
        <p className="text-sm text-slate-700">
          These are common real-world AI patterns. The question is not “can we do it”. The question is “can we govern it safely”.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
            <p className="text-sm font-semibold text-slate-900">Choose a use case</p>
            <div className="flex flex-wrap gap-2">
              {(["Search", "Recommendation", "Moderation", "Automation"] as UseCase[]).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUseCase(u)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                    useCase === u ? "border-indigo-300 bg-indigo-50 text-indigo-900" : "border-slate-200 bg-white text-slate-800"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2">
                <details.icon className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                <p className="text-sm font-semibold text-slate-900">{useCase}</p>
              </div>
              <p className="mt-2 text-sm text-slate-700">{details.what}</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-sm font-semibold text-slate-900">Risks</p>
                  <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
                    {details.risks.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-sm font-semibold text-slate-900">Controls</p>
                  <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
                    {details.controls.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-700">
                <span>Impact if wrong</span>
                <span>{["Low", "Some", "Medium", "High", "Very high"][risk]}</span>
              </div>
              <input type="range" min={0} max={4} step={1} value={risk} onChange={(e) => setRisk(Number(e.target.value))} className="w-full" />
              <SwitchRow label="Human oversight exists for higher impact actions" checked={oversight} tone="emerald" onCheckedChange={setOversight} />
              <p className="text-sm text-slate-700">{stance}</p>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">Enterprise adoption cues</p>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              <li>Decide ownership and escalation paths before launch.</li>
              <li>Choose evaluation metrics aligned to harms and value.</li>
              <li>Plan for drift: monitoring, rollback, and change control.</li>
              <li>Keep data minimised and well governed.</li>
            </ul>
          </div>
        </aside>
      </div>

      <div className="mt-6">
        <TryItLiveButton href="/ai-studio" feature="Use Cases" />
      </div>

      <ReadyToBuildCTA section="practical use cases" />
    </section>
  );
}



