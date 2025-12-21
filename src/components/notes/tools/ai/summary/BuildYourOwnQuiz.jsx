"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";

const STORAGE_KEY = "ai_summary_custom_quiz";
const makeId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export default function BuildYourOwnQuiz() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [cards, setCards] = useState([]);
  const [showAnswers, setShowAnswers] = useState({});
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setCards(JSON.parse(saved));
      } catch (error) {
        setLoadError("Saved quiz data could not be loaded. You can add new cards and they will save normally.");
        setCards([]);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }, [cards]);

  const addCard = () => {
    if (!question.trim() || !answer.trim()) return;
    setCards((prev) => [...prev, { id: makeId(), question: question.trim(), answer: answer.trim() }]);
    setQuestion("");
    setAnswer("");
  };

  const removeCard = (id) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  };

  const toggleAnswer = (id) => {
    setShowAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      {loadError ? (
        <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-800" role="alert" aria-live="polite">
          {loadError}
        </div>
      ) : null}
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
          <Save className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Build your own AI quiz</p>
          <p className="text-xs text-slate-600">Write quick questions for a friend or future you and keep them locally.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
          <span className="text-xs font-semibold text-slate-800">Question</span>
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            rows={3}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
          />
        </label>
        <label className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
          <span className="text-xs font-semibold text-slate-800">Answer</span>
          <textarea
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            rows={3}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
          />
        </label>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={addCard}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Add card
        </button>
        <p className="text-sm text-slate-600">Cards stay in your browser only.</p>
      </div>

      <div className="mt-4 space-y-2">
        {cards.length === 0 ? (
          <p className="text-xs text-slate-600">No cards yet. Add a couple of quick checks.</p>
        ) : (
          cards.map((card) => (
            <div
              key={card.id}
              className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900">{card.question}</p>
                  {showAnswers[card.id] ? (
                    <p className="mt-1 text-slate-700">{card.answer}</p>
                  ) : (
                    <p className="mt-1 text-sm text-slate-500">Answer hidden</p>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => toggleAnswer(card.id)}
                    className="rounded-full border border-slate-200 bg-white px-2 py-1 text-sm font-semibold text-slate-700 hover:border-slate-300"
                  >
                    {showAnswers[card.id] ? "Hide" : "Reveal"}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeCard(card.id)}
                    className="rounded-full border border-slate-200 bg-white px-2 py-1 text-sm text-slate-600 hover:border-slate-300"
                    aria-label="Delete card"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
