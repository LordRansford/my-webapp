"use client";

import { useMemo, useState } from "react";

const pairs = [
  {
    id: "monolith",
    term: "monolith",
    description: "A single deployable codebase that handles all features and responsibilities",
    explain: "Monoliths simplify deployment and coordination but can become hard to change as they grow.",
  },
  {
    id: "microservices",
    term: "microservices",
    description: "Many small services, each owning a clear capability and running independently",
    explain: "Microservices improve autonomy but increase operational and integration complexity.",
  },
  {
    id: "layered",
    term: "layered architecture",
    description: "A structure where user interface, business logic and data access are clearly separated",
    explain: "Layered designs separate concerns and keep dependencies flowing one way.",
  },
  {
    id: "events",
    term: "event driven architecture",
    description: "A system where components communicate by sending events instead of direct calls",
    explain: "Event-driven systems decouple producers and consumers but require careful observability.",
  },
  {
    id: "ddd",
    term: "domain driven design",
    description: "An approach where we shape the system around business domains and subdomains",
    explain: "DDD aligns architecture with business language and bounded contexts.",
  },
];

const terms = pairs.map((p) => p.term);

export default function ArchConceptMatchGame() {
  const [left, setLeft] = useState(() => shuffle(pairs));
  const [right, setRight] = useState(() => shuffle(terms).map((t, idx) => ({ id: `t-${idx}`, term: t })));
  const [selLeft, setSelLeft] = useState(null);
  const [selRight, setSelRight] = useState(null);
  const [matches, setMatches] = useState({});
  const [feedback, setFeedback] = useState("");

  const allMatched = useMemo(() => Object.keys(matches).length === pairs.length, [matches]);

  function shuffle(list) {
    const arr = [...list];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const reset = () => {
    setLeft(shuffle(pairs));
    setRight(shuffle(terms).map((t, idx) => ({ id: `t-${idx}`, term: t })));
    setSelLeft(null);
    setSelRight(null);
    setMatches({});
    setFeedback("");
  };

  const tryMatch = (leftId, term) => {
    const item = pairs.find((p) => p.id === leftId);
    if (!item) return;
    if (item.term === term) {
      setMatches((prev) => ({ ...prev, [leftId]: term }));
      setSelLeft(null);
      setSelRight(null);
      setFeedback(item.explain);
    } else {
      setFeedback("Not quite. Think about coupling, deployment, and team alignment.");
    }
  };

  const handleLeft = (id) => {
    setSelLeft(id);
    setFeedback("");
    if (selRight) tryMatch(id, selRight);
  };
  const handleRight = (term) => {
    setSelRight(term);
    setFeedback("");
    if (selLeft) tryMatch(selLeft, term);
  };

  const isMatched = (id) => matches[id];

  return (
    <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-slate-200">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <h4 className="text-base font-semibold text-slate-900">Plain descriptions</h4>
          {left.map((item) => (
            <button
              key={item.id}
              className={`w-full rounded-xl border px-3 py-3 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-sky-300 ${
                isMatched(item.id)
                  ? "border-emerald-200 bg-emerald-50 text-slate-900"
                  : selLeft === item.id
                  ? "border-sky-300 bg-sky-50"
                  : "border-slate-200 bg-white hover:border-sky-200"
              }`}
              onClick={() => !isMatched(item.id) && handleLeft(item.id)}
              disabled={!!isMatched(item.id)}
            >
              {item.description}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          <h4 className="text-base font-semibold text-slate-900">Terms</h4>
          {right.map((item) => (
            <button
              key={item.id}
              className={`w-full rounded-xl border px-3 py-3 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-sky-300 ${
                Object.values(matches).includes(item.term)
                  ? "border-emerald-200 bg-emerald-50 text-slate-900"
                  : selRight === item.term
                  ? "border-sky-300 bg-sky-50"
                  : "border-slate-200 bg-white hover:border-sky-200"
              }`}
              onClick={() => !Object.values(matches).includes(item.term) && handleRight(item.term)}
              disabled={Object.values(matches).includes(item.term)}
            >
              {item.term}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-800">{feedback || (allMatched ? "Great-every term is matched." : "Pick a description, then a term to match.")}</div>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition hover:border-sky-300 hover:text-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-300"
        >
          Reset game
        </button>
      </div>
    </div>
  );
}

