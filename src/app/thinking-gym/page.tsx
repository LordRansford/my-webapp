"use client";

import { useEffect, useMemo, useState } from "react";
import NotesLayout from "@/components/notes/Layout";

type Coord = { row: number; col: number };
type Puzzle = { start: Coord; target: Coord };

const BOARD_SIZE = 5;

function insideBoard(row: number, col: number) {
  return row >= 0 && col >= 0 && row < BOARD_SIZE && col < BOARD_SIZE;
}

function knightMoves(from: Coord) {
  const deltas = [
    [2, 1],
    [2, -1],
    [-2, 1],
    [-2, -1],
    [1, 2],
    [1, -2],
    [-1, 2],
    [-1, -2],
  ];
  return deltas
    .map(([dr, dc]) => ({ row: from.row + dr, col: from.col + dc }))
    .filter((c) => insideBoard(c.row, c.col));
}

function generatePuzzle(): Puzzle {
  while (true) {
    const start = { row: Math.floor(Math.random() * BOARD_SIZE), col: Math.floor(Math.random() * BOARD_SIZE) };
    const firstHops = knightMoves(start);
    const secondHops = firstHops.flatMap((c) => knightMoves(c));
    const uniqueTargets: Coord[] = [];
    secondHops.forEach((c) => {
      if (!uniqueTargets.find((t) => t.row === c.row && t.col === c.col) && (c.row !== start.row || c.col !== start.col)) {
        uniqueTargets.push(c);
      }
    });
    if (uniqueTargets.length === 0) continue;
    const target = uniqueTargets[Math.floor(Math.random() * uniqueTargets.length)];
    return { start, target };
  }
}

function coordLabel(c: Coord) {
  const file = String.fromCharCode(65 + c.col);
  const rank = BOARD_SIZE - c.row;
  return `${file}${rank}`;
}

export default function ThinkingGymPage() {
  const [puzzle, setPuzzle] = useState<Puzzle>(() => generatePuzzle());
  const [selected, setSelected] = useState<Coord | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "incorrect">("idle");

  useEffect(() => {
    setSelected(null);
    setStatus("idle");
  }, [puzzle]);

  const handleSelect = (coord: Coord) => {
    const isCorrect = coord.row === puzzle.target.row && coord.col === puzzle.target.col;
    setSelected(coord);
    setStatus(isCorrect ? "correct" : "incorrect");
  };

  const feedback = useMemo(() => {
    if (status === "correct") return "Nice thinking. That square works in two knight moves.";
    if (status === "incorrect") return "Almost. Try another route.";
    return "Find the square a knight can reach in exactly two moves from the start.";
  }, [status]);

  return (
    <NotesLayout
      meta={{
        title: "Thinking Gym",
        description: "Warm up your brain before learning.",
        level: "Summary",
        slug: "/thinking-gym",
        section: "ai",
      }}
      activeLevelId="summary"
    >
      <div className="space-y-6">
        <header className="space-y-2">
          <p className="eyebrow">Thinking Gym</p>
          <h1 className="text-3xl font-semibold text-slate-900">Thinking Gym</h1>
          <p className="text-slate-700">Warm up your brain before learning.</p>
          <p className="text-slate-700">
            A tiny logic puzzle with a single knight on a small board. No scoring, no timers, just a quick thinking warm up.
          </p>
        </header>

        <section className="space-y-3 rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-800">Mini chess logic puzzle</p>
              <p className="text-sm text-slate-700">{feedback}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="button"
                onClick={() => {
                  setSelected(null);
                  setStatus("idle");
                }}
              >
                Reset puzzle
              </button>
              <button
                type="button"
                className="button primary"
                onClick={() => setPuzzle(generatePuzzle())}
              >
                New puzzle
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="text-sm text-slate-700">
              Start: <strong>{coordLabel(puzzle.start)}</strong> · Knight moves in exactly two steps.
            </div>
            <div className="board" role="grid" aria-label="Mini chess board">
              {Array.from({ length: BOARD_SIZE }).map((_, rowIdx) => (
                <div className="board-row" role="row" key={rowIdx}>
                  {Array.from({ length: BOARD_SIZE }).map((__, colIdx) => {
                    const coord = { row: rowIdx, col: colIdx };
                    const isStart = puzzle.start.row === rowIdx && puzzle.start.col === colIdx;
                    const isSelected = selected && selected.row === rowIdx && selected.col === colIdx;
                    const isCorrectSquare = status === "correct" && isSelected;
                    const isWrongSquare = status === "incorrect" && isSelected;
                    const label = `Square ${coordLabel(coord)}${isStart ? " start position" : ""}`;
                    return (
                      <button
                        key={`${rowIdx}-${colIdx}`}
                        role="gridcell"
                        aria-label={label}
                        className={`board-cell ${isStart ? "board-cell--start" : ""} ${
                          isCorrectSquare ? "board-cell--correct" : ""
                        } ${isWrongSquare ? "board-cell--incorrect" : ""}`}
                        onClick={() => handleSelect(coord)}
                      >
                        {isStart ? "N" : ""}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-600">Use arrow keys and Enter/Space to select squares. Focus outline is visible.</p>
          </div>
        </section>
      </div>

      <style jsx>{`
        .board {
          display: inline-flex;
          flex-direction: column;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
        }
        .board-row {
          display: grid;
          grid-template-columns: repeat(${BOARD_SIZE}, 1fr);
        }
        .board-cell {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #0f172a;
          background: linear-gradient(135deg, #f8fafc, #e2e8f0);
          border: 1px solid #e2e8f0;
          transition: transform 0.12s ease, background 0.15s ease, box-shadow 0.15s ease;
        }
        .board-cell:hover {
          background: #e0f2fe;
        }
        .board-cell:focus-visible {
          outline: 2px solid #0ea5e9;
          outline-offset: -2px;
        }
        .board-cell--start {
          background: #e0f2fe;
          color: #0f172a;
        }
        .board-cell--correct {
          background: #dcfce7;
          box-shadow: inset 0 0 0 2px #22c55e;
          transform: scale(1.02);
        }
        .board-cell--incorrect {
          background: #fee2e2;
          box-shadow: inset 0 0 0 2px #ef4444;
          transform: scale(0.98);
        }
        @media (max-width: 600px) {
          .board-cell {
            width: 48px;
            height: 48px;
          }
        }
      `}</style>
    </NotesLayout>
  );
}


