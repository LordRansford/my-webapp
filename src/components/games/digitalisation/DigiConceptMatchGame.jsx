"use client";

import { useMemo, useState } from "react";

const descriptions = [
  {
    id: "desc1",
    text: "Using data, software and automation to change how an organisation works and serves people",
    term: "digitalisation",
    explain: "Digitalisation is about changing how value is created, not just adding tools.",
  },
  {
    id: "desc2",
    text: "The reusable data, platforms and services that other projects and products build on",
    term: "digital spine or shared digital capability",
    explain: "A shared spine lets teams reuse common services and move faster together.",
  },
  {
    id: "desc3",
    text: "A planned sequence of steps that moves a sector or company from current state to a digital future",
    term: "digital roadmap",
    explain: "A roadmap makes trade offs explicit and shows how capability will grow over time.",
  },
  {
    id: "desc4",
    text: "Agreed rules for how systems talk to each other and share information in a safe way",
    term: "interoperability standard or interface contract",
    explain: "Interface contracts reduce coupling and keep data sharing predictable and safe.",
  },
  {
    id: "desc5",
    text: "The way people, process, data and technology fit together so that change can be made safely",
    term: "digital operating model",
    explain: "An operating model decides who owns what, how decisions are made, and how change flows.",
  },
];

const terms = [
  "digitalisation",
  "digital spine or shared digital capability",
  "digital roadmap",
  "interoperability standard or interface contract",
  "digital operating model",
];

export default function DigiConceptMatchGame() {
  const [leftCards, setLeftCards] = useState(() => shuffle(descriptions));
  const [rightCards, setRightCards] = useState(() => shuffle(terms).map((t, idx) => ({ id: `term-${idx}`, term: t })));
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matches, setMatches] = useState({});
  const [feedback, setFeedback] = useState("");

  const allMatched = useMemo(() => Object.keys(matches).length === descriptions.length, [matches]);

  function shuffle(list) {
    const arr = [...list];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const reset = () => {
    setLeftCards(shuffle(descriptions));
    setRightCards(shuffle(terms).map((t, idx) => ({ id: `term-${idx}`, term: t })));
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatches({});
    setFeedback("");
  };

  const tryMatch = (leftId, rightTerm) => {
    const left = descriptions.find((d) => d.id === leftId);
    if (!left) return;
    if (left.term === rightTerm) {
      setMatches((prev) => ({ ...prev, [leftId]: rightTerm }));
      setSelectedLeft(null);
      setSelectedRight(null);
      setFeedback(left.explain);
    } else {
      setFeedback("Not quite. Try another pairing that feels closer.");
    }
  };

  const handleLeft = (id) => {
    setSelectedLeft(id);
    setFeedback("");
    if (selectedRight) {
      tryMatch(id, selectedRight);
    }
  };

  const handleRight = (term) => {
    setSelectedRight(term);
    setFeedback("");
    if (selectedLeft) {
      tryMatch(selectedLeft, term);
    }
  };

  const isMatched = (leftId) => matches[leftId];

  return (
    <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-slate-200">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <h4 className="text-base font-semibold text-slate-900">Plain descriptions</h4>
          {leftCards.map((card) => (
            <button
              key={card.id}
              className={`w-full rounded-xl border px-3 py-3 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-sky-300 ${
                isMatched(card.id)
                  ? "border-emerald-200 bg-emerald-50 text-slate-900"
                  : selectedLeft === card.id
                  ? "border-sky-300 bg-sky-50"
                  : "border-slate-200 bg-white hover:border-sky-200"
              }`}
              onClick={() => !isMatched(card.id) && handleLeft(card.id)}
              disabled={!!isMatched(card.id)}
            >
              {card.text}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          <h4 className="text-base font-semibold text-slate-900">Terms</h4>
          {rightCards.map((card) => (
            <button
              key={card.id}
              className={`w-full rounded-xl border px-3 py-3 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-sky-300 ${
                Object.values(matches).includes(card.term)
                  ? "border-emerald-200 bg-emerald-50 text-slate-900"
                  : selectedRight === card.term
                  ? "border-sky-300 bg-sky-50"
                  : "border-slate-200 bg-white hover:border-sky-200"
              }`}
              onClick={() => !Object.values(matches).includes(card.term) && handleRight(card.term)}
              disabled={Object.values(matches).includes(card.term)}
            >
              {card.term}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-800">{feedback || (allMatched ? "Nice work. All terms matched." : "Select a description, then a term to form a pair.")}</div>
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
