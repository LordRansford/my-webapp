/**
 * Daily Logic Gauntlet
 * 
 * Multi-puzzle challenge with daily seeded challenges
 * Same seed for all users on the same day
 */

"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import GameShell from "@/lib/games/framework/GameShell";
import { StateManager } from "@/lib/games/framework/StateManager";
import { DifficultyEngine } from "@/lib/games/framework/DifficultyEngine";
import { ExplainabilityEngine } from "@/lib/games/framework/ExplainabilityEngine";
import { InputLayer } from "@/lib/games/framework/InputLayer";
import { useGameAnalytics } from "@/lib/games/framework/useGameAnalytics";
import type { GameConfig, GameStatus, GameAnalysis } from "@/lib/games/framework/types";

const GAME_CONFIG: GameConfig = {
  id: "daily-logic-gauntlet",
  title: "Daily Logic Gauntlet",
  description: "Multi-puzzle challenge with daily seeded challenges. Same seed for all users on the same day.",
  category: "puzzle",
  modes: ["solo", "daily"],
  supportsMultiplayer: false,
  minPlayers: 1,
  maxPlayers: 1,
  estimatedMinutes: 15,
  tutorialAvailable: true,
};

interface Puzzle {
  id: number;
  type: "logic" | "pattern" | "deduction";
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export default function DailyLogicGauntlet() {
  const [status, setStatus] = useState<GameStatus>("idle");
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [score, setScore] = useState(0);
  const [analysis, setAnalysis] = useState<GameAnalysis | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // Generate daily seed (same for all users on same day)
  const dailySeed = useMemo(() => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    // Simple hash of date string
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
      hash = ((hash << 5) - hash + dateStr.charCodeAt(i)) | 0;
    }
    return Math.abs(hash);
  }, []);

  const stateManager = useMemo(() => new StateManager({ status: "idle" }, dailySeed), [dailySeed]);
  const difficultyEngine = useMemo(
    () =>
      new DifficultyEngine({
        initial: 0.3,
        target: 0.8,
        rampTime: 600000, // 10 minutes
        adaptive: true,
      }),
    []
  );
  const explainabilityEngine = useMemo(() => new ExplainabilityEngine(), []);
  const inputLayer = useMemo(() => new InputLayer(), []);

  // Analytics
  useGameAnalytics(GAME_CONFIG.id, status, stateManager.getState());

  // Generate puzzles based on seed
  const puzzles = useMemo(() => {
    const rng = () => stateManager.random();
    const generated: Puzzle[] = [];

    for (let i = 0; i < 10; i++) {
      const type = rng() < 0.33 ? "logic" : rng() < 0.66 ? "pattern" : "deduction";
      const puzzle: Puzzle = {
        id: i,
        type,
        question: `Puzzle ${i + 1}: ${type} challenge`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: Math.floor(rng() * 4),
        explanation: `This puzzle tests your ${type} reasoning skills.`,
      };
      generated.push(puzzle);
    }

    return generated;
  }, [stateManager]);

  const handleStart = useCallback(() => {
    setStatus("playing");
    stateManager.updateState({ status: "playing", timestamp: Date.now() });
    stateManager.recordMove("start", {});
  }, [stateManager]);

  const handleAnswer = useCallback(
    (answerIndex: number) => {
      if (status !== "playing") return;

      const puzzle = puzzles[currentPuzzle];
      const isCorrect = answerIndex === puzzle.correctAnswer;

      stateManager.recordMove("answer", { puzzleId: currentPuzzle, answerIndex, isCorrect });

      if (isCorrect) {
        setScore(score + 1);
        difficultyEngine.recordPerformance(1);
      } else {
        difficultyEngine.recordPerformance(0);
      }

      setSelectedAnswer(answerIndex);

      // Move to next puzzle after delay
      setTimeout(() => {
        if (currentPuzzle < puzzles.length - 1) {
          setCurrentPuzzle(currentPuzzle + 1);
          setSelectedAnswer(null);
        } else {
          // Game finished
          setStatus("finished");
          stateManager.updateState({ status: "finished", score });
          const gameAnalysis = explainabilityEngine.analyzeGame(
            stateManager.getState(),
            { id: GAME_CONFIG.id, type: "puzzle" }
          );
          setAnalysis(gameAnalysis);
        }
      }, 1500);
    },
    [status, currentPuzzle, puzzles, stateManager, difficultyEngine, explainabilityEngine]
  );

  const handleReset = useCallback(() => {
    setStatus("idle");
    setCurrentPuzzle(0);
    setScore(0);
    setSelectedAnswer(null);
    setAnalysis(null);
    stateManager.updateState({ status: "idle", moves: [], score: 0 });
    difficultyEngine.reset();
  }, [stateManager, difficultyEngine]);

  const currentPuzzleData = puzzles[currentPuzzle];
  const difficulty = difficultyEngine.getCurrentDifficulty();

  // Keyboard navigation for answer selection (1-4 keys)
  useEffect(() => {
    if (status !== "playing") return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (selectedAnswer !== null) return;

      const key = e.key;
      if (key >= "1" && key <= "4") {
        const index = parseInt(key) - 1;
        if (currentPuzzleData && index < currentPuzzleData.options.length) {
          e.preventDefault();
          handleAnswer(index);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [status, selectedAnswer, currentPuzzleData, handleAnswer]);

  return (
    <GameShell
      config={GAME_CONFIG}
      status={status}
      onStart={status === "idle" ? handleStart : undefined}
      onReset={handleReset}
      rightPanel={
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Progress</h3>
            <div className="text-2xl font-bold text-slate-900">
              {currentPuzzle + 1} / {puzzles.length}
            </div>
            <div className="mt-2 text-sm text-slate-600">Score: {score}</div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Difficulty</h3>
            <div className="text-sm text-slate-700">
              {difficultyEngine.getDifficultyLabel(difficulty)}
            </div>
          </div>
          {analysis && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Analysis</h3>
              <p className="text-xs text-slate-600">{analysis.summary}</p>
            </div>
          )}
        </div>
      }
    >
      {status === "idle" && (
        <div className="text-center py-12" role="region" aria-label="Game introduction">
          <p className="text-slate-600 mb-4">Ready to start the daily challenge?</p>
          <p className="text-sm text-slate-500">
            Today&apos;s seed: <span className="font-mono">{dailySeed}</span> (same for all players)
          </p>
          <p className="text-xs text-slate-400 mt-4">
            Use your mouse or keyboard to select answers. Press Enter to confirm your selection.
          </p>
        </div>
      )}

      {status === "playing" && currentPuzzleData && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">
              {currentPuzzleData.question}
            </h2>
            <p className="text-sm text-slate-600">Type: {currentPuzzleData.type}</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" role="group" aria-label="Answer options">
            {currentPuzzleData.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentPuzzleData.correctAnswer;
              const showResult = selectedAnswer !== null;

              let bgColor = "bg-white border-slate-200 hover:bg-slate-50";
              if (showResult) {
                if (isCorrect) {
                  bgColor = "bg-green-100 border-green-300";
                } else if (isSelected && !isCorrect) {
                  bgColor = "bg-rose-100 border-rose-300";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                  className={`rounded-lg border-2 p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${bgColor} ${
                    selectedAnswer !== null ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                  }`}
                  type="button"
                  aria-label={`Option ${String.fromCharCode(65 + index)}: ${option}${showResult ? (isCorrect ? ". Correct answer" : isSelected ? ". Incorrect answer" : "") : ""}`}
                  aria-pressed={isSelected}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700" aria-hidden="true">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <span className="text-slate-900">{option}</span>
                    {showResult && isCorrect && (
                      <span className="ml-auto text-green-700 font-semibold" aria-label="Correct">
                        <span aria-hidden="true">✓</span> Correct
                      </span>
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <span className="ml-auto text-rose-700 font-semibold" aria-label="Incorrect">
                        <span aria-hidden="true">✗</span> Wrong
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {selectedAnswer !== null && (
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
              <p className="text-sm text-blue-900">
                <strong>Explanation:</strong> {currentPuzzleData.explanation}
              </p>
            </div>
          )}
        </div>
      )}

      {status === "finished" && analysis && (
        <div className="space-y-6">
          <div className="text-center py-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Game Complete!</h2>
            <p className="text-xl text-slate-600">Final Score: {score} / {puzzles.length}</p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Summary</h3>
              <p className="text-slate-700">{analysis.summary}</p>
            </div>

            {analysis.keyDecisions.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Key Decisions</h3>
                <ul className="space-y-2">
                  {analysis.keyDecisions.map((decision, idx) => (
                    <li key={idx} className="text-sm text-slate-700">
                      • {decision.description}: {decision.impact}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.keyMistakes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Areas to Improve</h3>
                <ul className="space-y-2">
                  {analysis.keyMistakes.map((mistake, idx) => (
                    <li key={idx} className="text-sm text-slate-700">
                      • {mistake.description}: {mistake.suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </GameShell>
  );
}
