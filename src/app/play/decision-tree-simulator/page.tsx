"use client";

import { useEffect, useMemo, useState } from "react";
import NotesLayout from "@/components/notes/Layout";
import GameShell from "@/components/play/GameShell";
import GameFooter from "@/components/play/GameFooter";

type NodeId = "start" | "scope" | "risk" | "delivery" | "outcome";
type Choice = { id: string; label: string; next: NodeId; impact: { trust: number; speed: number; cost: number } };
type Node = { id: NodeId; title: string; prompt: string; choices: Choice[] };

const LS_KEY = "rn_play_decision_tree_best_v1";

function safeReadJson<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function safeWriteJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

const NODES: Record<NodeId, Node> = {
  start: {
    id: "start",
    title: "Project framing",
    prompt: "You are asked to improve a service. Choose your starting posture.",
    choices: [
      { id: "start-outcomes", label: "Start with outcomes and decision owners", next: "scope", impact: { trust: 2, speed: 0, cost: 0 } },
      { id: "start-tools", label: "Start by picking tools and vendors", next: "scope", impact: { trust: -1, speed: 1, cost: -1 } },
      { id: "start-quickfix", label: "Start with a quick fix to show progress", next: "scope", impact: { trust: 0, speed: 2, cost: 0 } },
    ],
  },
  scope: {
    id: "scope",
    title: "Scope",
    prompt: "How do you handle scope and requirements",
    choices: [
      { id: "scope-small", label: "Deliver a small, governed slice in 4 to 6 weeks", next: "risk", impact: { trust: 1, speed: 1, cost: 1 } },
      { id: "scope-big", label: "Plan a big platform first, then migrate later", next: "risk", impact: { trust: -1, speed: -1, cost: -2 } },
      { id: "scope-mixed", label: "Mix quick wins with a clear target state", next: "risk", impact: { trust: 1, speed: 0, cost: 0 } },
    ],
  },
  risk: {
    id: "risk",
    title: "Risk and controls",
    prompt: "What is your approach to risk and controls",
    choices: [
      { id: "risk-baseline", label: "Set baseline controls and review access early", next: "delivery", impact: { trust: 2, speed: 0, cost: 0 } },
      { id: "risk-later", label: "Move fast now, add controls later", next: "delivery", impact: { trust: -2, speed: 2, cost: 0 } },
      { id: "risk-heavy", label: "Over-control everything from day one", next: "delivery", impact: { trust: 1, speed: -2, cost: -1 } },
    ],
  },
  delivery: {
    id: "delivery",
    title: "Delivery approach",
    prompt: "How do you run delivery",
    choices: [
      { id: "delivery-observable", label: "Ship iteratively with monitoring and feedback loops", next: "outcome", impact: { trust: 2, speed: 1, cost: 0 } },
      { id: "delivery-bigbang", label: "Hold changes until a big launch", next: "outcome", impact: { trust: -1, speed: -1, cost: -1 } },
      { id: "delivery-outsourced", label: "Outsource delivery and focus on oversight", next: "outcome", impact: { trust: 0, speed: 0, cost: -1 } },
    ],
  },
  outcome: {
    id: "outcome",
    title: "Outcome",
    prompt: "Your choices lead to a final posture. Review the score and replay.",
    choices: [],
  },
};

function clamp(n: number) {
  return Math.max(0, Math.min(10, n));
}

export default function DecisionTreeSimulatorPage() {
  const [started, setStarted] = useState(false);
  const [nodeId, setNodeId] = useState<NodeId>("start");
  const [history, setHistory] = useState<{ node: NodeId; choice: string }[]>([]);
  const [score, setScore] = useState({ trust: 5, speed: 5, cost: 5 });
  const [best, setBest] = useState<any>(null);

  useEffect(() => {
    setBest(safeReadJson(LS_KEY));
  }, []);

  const reset = () => {
    setStarted(false);
    setNodeId("start");
    setHistory([]);
    setScore({ trust: 5, speed: 5, cost: 5 });
  };

  const start = () => {
    reset();
    setStarted(true);
  };

  const node = NODES[nodeId];
  const done = started && nodeId === "outcome";

  const choose = (c: Choice) => {
    if (!started) return;
    if (done) return;
    setHistory((h) => [...h, { node: nodeId, choice: c.label }]);
    setScore((s) => ({
      trust: clamp(s.trust + c.impact.trust),
      speed: clamp(s.speed + c.impact.speed),
      cost: clamp(s.cost + c.impact.cost),
    }));
    setNodeId(c.next);
  };

  const outcomeScore = useMemo(() => {
    const total = score.trust + score.speed + score.cost;
    return total;
  }, [score]);

  useEffect(() => {
    if (!done) return;
    const entry = { bestOutcome: outcomeScore, at: new Date().toLocaleString() };
    const current = safeReadJson<any>(LS_KEY);
    if (!current || typeof current.bestOutcome !== "number" || outcomeScore > current.bestOutcome) {
      safeWriteJson(LS_KEY, entry);
      setBest(entry);
    }
  }, [done, outcomeScore]);

  const status = useMemo(() => {
    if (!started) return "Press Start. Make a few choices and see how trade-offs add up.";
    if (done) return "Complete. Replay to explore different trade-offs.";
    return "Choose an option. There are no perfect answers, only trade-offs.";
  }, [started, done]);

  return (
    <NotesLayout
      meta={{
        title: "Decision tree simulator",
        description: "Make sequential trade-off choices and reflect on outcomes.",
        level: "Summary",
        slug: "/play/decision-tree-simulator",
        section: "ai",
      }}
      activeLevelId="summary"
    >
      <GameShell
        title="Decision tree simulator"
        description="A small systems thinking simulator. Make sequential choices and see how trust, speed, and cost trade off."
        howToPlay={{
          objective: "Reach a strong outcome score by balancing trade-offs.",
          how: ["Press Start.", "Read the prompt.", "Choose the option that matches your posture.", "Review the outcome and replay to explore."],
          improves: ["Systems thinking", "Trade-off reasoning", "Making decisions explicit and reviewable"],
        }}
        onStart={start}
        onReset={reset}
        startLabel="Start"
        resetLabel="Reset"
        score={{
          scoreLabel: "Outcome score",
          score: done ? outcomeScore : null,
          timeMs: null,
          accuracy: null,
          personalBest: best ? { score: best.bestOutcome, at: best.at } : null,
        }}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-800">{status}</p>

          <div className="grid gap-3 md:grid-cols-3">
            {[
              { k: "trust", label: "Trust" },
              { k: "speed", label: "Speed" },
              { k: "cost", label: "Cost posture" },
            ].map((x) => (
              <div key={x.k} className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold text-slate-700">{x.label}</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{(score as any)[x.k]}/10</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
            <p className="text-sm font-semibold text-slate-900">{node.title}</p>
            <p className="text-sm text-slate-700">{node.prompt}</p>

            {!done ? (
              <div className="grid gap-2 sm:grid-cols-3">
                {node.choices.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => choose(c)}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-900 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            ) : null}

            {done ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-sm font-semibold text-slate-900">Your path</p>
                <ol className="mt-2 list-decimal pl-5 text-sm text-slate-700 space-y-1">
                  {history.map((h, i) => (
                    <li key={`${h.node}-${i}`}>{h.choice}</li>
                  ))}
                </ol>
                <p className="mt-2 text-xs text-slate-600">Best outcome score is stored locally in your browser.</p>
              </div>
            ) : null}
          </div>
        </div>
      </GameShell>
      <GameFooter onReplay={start} />
    </NotesLayout>
  );
}


