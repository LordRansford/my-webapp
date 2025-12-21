"use client";

import { useEffect, useMemo, useState } from "react";
import NotesLayout from "@/components/notes/Layout";

type Card = { id: number; label: string; matched: boolean };

const PAIRS = ["A", "B", "C", "D", "E", "F", "G", "H"];

function shuffledDeck(): Card[] {
  const deck = [...PAIRS, ...PAIRS].map((label, idx) => ({ id: idx + 1, label, matched: false }));
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export default function PlayPage() {
  const [cards, setCards] = useState<Card[]>(() => shuffledDeck());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (flipped.length === 2) {
      const [firstId, secondId] = flipped;
      const first = cards.find((c) => c.id === firstId);
      const second = cards.find((c) => c.id === secondId);
      if (!first || !second) return;
      if (first.label === second.label) {
        setCards((prev) => prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, matched: true } : c)));
        setFlipped([]);
      } else {
        setLocked(true);
        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, 650);
      }
    }
  }, [flipped, cards]);

  const completed = useMemo(() => cards.every((c) => c.matched), [cards]);

  const handleFlip = (id: number) => {
    if (locked) return;
    if (flipped.includes(id)) return;
    setFlipped((prev) => (prev.length === 2 ? [id] : [...prev, id]));
  };

  const reset = () => {
    setCards(shuffledDeck());
    setFlipped([]);
    setLocked(false);
  };

  return (
    <NotesLayout
      meta={{
        title: "Play",
        description: "A light memory match to give your brain a short break.",
        level: "Summary",
        slug: "/play",
        section: "ai",
      }}
      activeLevelId="summary"
    >
      <div className="space-y-6">
        <header className="space-y-2">
          <p className="eyebrow">Play</p>
          <h1 className="text-3xl font-semibold text-slate-900">Memory match</h1>
          <p className="text-slate-700">
            This is here to give your brain a break. You are still allowed to think though. Flip two cards to find pairs.
            No timers, no scores, just a quick reset.
          </p>
        </header>

        <section className="space-y-4 rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-slate-800">
              {completed ? "All pairs found. Nice work." : "Find all matching pairs. Large tap targets for mobile."}
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="button" onClick={reset}>
                Reset
              </button>
              <button type="button" className="button primary" onClick={reset}>
                New shuffle
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <div
              className="grid gap-3"
              style={{
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                width: "100%",
                maxWidth: 420,
              }}
              aria-label="Memory matching game"
            >
              {cards.map((card) => {
                const isFlipped = flipped.includes(card.id) || card.matched;
                return (
                  <button
                    key={card.id}
                    className={`memory-card ${isFlipped ? "memory-card--flipped" : ""} ${
                      card.matched ? "memory-card--matched" : ""
                    }`}
                    onClick={() => handleFlip(card.id)}
                    disabled={card.matched || locked}
                    aria-label={card.matched ? `Matched card ${card.label}` : `Card face down`}
                  >
                    <span className="memory-card__face">{isFlipped ? card.label : "?"}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .memory-card {
          height: 86px;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          background: linear-gradient(135deg, #f8fafc, #e2e8f0);
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: 700;
          color: #0f172a;
          transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
        }
        .memory-card:hover:not(:disabled) {
          background: #e0f2fe;
          transform: translateY(-1px);
        }
        .memory-card:focus-visible {
          outline: 2px solid #0ea5e9;
          outline-offset: -2px;
        }
        .memory-card--flipped {
          background: #fff;
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
        }
        .memory-card--matched {
          background: #dcfce7;
          color: #0f172a;
          box-shadow: inset 0 0 0 2px #22c55e;
        }
        .memory-card__face {
          display: inline-block;
          min-width: 12px;
        }
        @media (max-width: 640px) {
          .memory-card {
            height: 72px;
            font-size: 20px;
          }
        }
      `}</style>
    </NotesLayout>
  );
}


