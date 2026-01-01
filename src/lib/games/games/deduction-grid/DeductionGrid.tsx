/**
 * Deduction Grid - Main Game Component
 */

"use client";

import React, { useState, useCallback, useEffect } from "react";
import GameShell from "@/lib/games/framework/GameShell";
import type { GameConfig, GameStatus } from "@/lib/games/framework/types";
import type { DeductionPuzzle, CellValue, DeductionResult } from "./types";
import { generatePuzzle } from "./puzzleGenerator";
import {
  getOrGenerateTodayChallenge,
  completeTodayChallenge,
} from "@/lib/games/shared/dailyChallenges";
import {
  generateTodayChallengeCode,
  storeChallengeCode,
} from "@/lib/games/shared/challengeCodes";
import {
  updateStreakForGame,
  getStreakDataForGame,
} from "@/lib/games/shared/streakTracking";
import {
  checkAndUnlockAchievements,
} from "@/lib/games/shared/achievements";
import {
  submitScore,
} from "@/lib/games/shared/scoreComparison";
import {
  ChallengeCodeShare,
  ScoreComparisonDisplay,
  AchievementDisplay,
  LeaderboardView,
} from "@/lib/games/shared/components";
import type { ChallengeCode } from "@/lib/games/shared/challengeCodes/types";

const GAME_CONFIG: GameConfig = {
  id: "deduction-grid",
  title: "Deduction Grid",
  description: "Solve logic grid puzzles using deduction",
  category: "logic",
  modes: ["solo", "daily"],
  supportsMultiplayer: false,
  minPlayers: 1,
  maxPlayers: 1,
  estimatedMinutes: 10,
  tutorialAvailable: true,
};

const GAME_ID = "deduction-grid";

export default function DeductionGrid() {
  const [status, setStatus] = useState<GameStatus>("idle");
  const [puzzle, setPuzzle] = useState<DeductionPuzzle | null>(null);
  const [grid, setGrid] = useState<CellValue[][]>([]);
  const [result, setResult] = useState<DeductionResult | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (status === "idle" && !puzzle) {
      initializePuzzle();
    }
  }, [status, puzzle]);

  const initializePuzzle = useCallback(() => {
    try {
      const dailyChallenge = getOrGenerateTodayChallenge(GAME_ID);
      const generated = generatePuzzle({
        seed: dailyChallenge.seed,
        difficulty: "deductive",
      });
      setPuzzle(generated);
      
      // Initialize empty grid
      const emptyGrid: CellValue[][] = [];
      for (let row = 0; row < generated.gridSize.rows; row++) {
        emptyGrid[row] = [];
        for (let col = 0; col < generated.gridSize.cols; col++) {
          emptyGrid[row][col] = 'unknown';
        }
      }
      setGrid(emptyGrid);
      setResult(null);
    } catch (error) {
      console.error("Error initializing puzzle:", error);
    }
  }, []);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (status !== "playing" || !puzzle) return;
    
    setGrid(prev => {
      const newGrid = prev.map(r => [...r]);
      const currentValue = newGrid[row][col];
      
      // Cycle: unknown -> yes -> no -> unknown
      if (currentValue === 'unknown') {
        newGrid[row][col] = 'yes';
      } else if (currentValue === 'yes') {
        newGrid[row][col] = 'no';
      } else {
        newGrid[row][col] = 'unknown';
      }
      
      return newGrid;
    });
  }, [status, puzzle]);

  const calculateResult = useCallback((): DeductionResult | null => {
    if (!puzzle) return null;
    
    let correct = 0;
    let total = 0;
    
    for (let row = 0; row < puzzle.gridSize.rows; row++) {
      for (let col = 0; col < puzzle.gridSize.cols; col++) {
        if (grid[row][col] !== 'unknown') {
          total++;
          if (grid[row][col] === puzzle.solution[row][col]) {
            correct++;
          }
        }
      }
    }
    
    const accuracy = total > 0 ? (correct / total) * 100 : 0;
    const allCellsFilled = grid.every(row => row.every(cell => cell !== 'unknown'));
    const isCorrect = allCellsFilled && correct === total;
    
    return {
      correct: isCorrect,
      accuracy,
      cellsCorrect: correct,
      totalCells: total,
    };
  }, [puzzle, grid]);

  const handleSubmit = useCallback(() => {
    if (!puzzle || !startTime) return;

    const calcResult = calculateResult();
    if (!calcResult) return;
    
    setResult(calcResult);
    setStatus("finished");

    const codeData = generateTodayChallengeCode(GAME_ID, puzzle.seed);
    storeChallengeCode(codeData);
    setChallengeCodeData(codeData);

    const timeUsed = Date.now() - startTime;
    const score = calcResult.accuracy;
    const scoreData = {
      score,
      time: timeUsed,
      scoreValue: score,
      timestamp: Date.now(),
    };
    
    setPlayerScoreData(scoreData);
    const comparison = submitScore(codeData.code, scoreData);
    setScoreComparison(comparison);

    completeTodayChallenge(GAME_ID, {
      score,
      time: timeUsed,
      scoreValue: score,
    });

    updateStreakForGame(GAME_ID, true);

    const streakData = getStreakDataForGame(GAME_ID);
    const achievementResult = checkAndUnlockAchievements({
      gameId: GAME_ID,
      currentStreak: streakData.currentStreak,
      gamesCompleted: 1,
    });
    setAchievementIds(achievementResult.newlyUnlocked);
  }, [puzzle, startTime, calculateResult]);

  const handleStart = useCallback(() => {
    if (!puzzle) {
      initializePuzzle();
      return;
    }
    setStatus("playing");
    setResult(null);
    setStartTime(Date.now());
  }, [puzzle, initializePuzzle]);

  const handleReset = useCallback(() => {
    setStatus("idle");
    setResult(null);
    setStartTime(null);
    setPuzzle(null);
    setGrid([]);
  }, []);

  const rightPanel = puzzle ? (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Clues</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {puzzle.clues.map(clue => (
            <div key={clue.id} className="text-sm text-slate-600">
              {clue.description}
            </div>
          ))}
        </div>
      </div>
      {result && (
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Result</h3>
          <div className={`text-sm font-medium ${
            result.correct ? "text-green-600" : "text-amber-600"
          }`}>
            {result.correct ? "✓ Correct!" : `${result.accuracy.toFixed(1)}% accuracy`}
          </div>
        </div>
      )}
    </div>
  ) : null;

  return (
    <GameShell
      config={GAME_CONFIG}
      status={status}
      onStart={handleStart}
      onReset={handleReset}
      rightPanel={rightPanel}
    >
      <div className="p-4">
        {!puzzle || grid.length === 0 ? (
          <div className="text-center text-slate-600">Loading puzzle...</div>
        ) : status === "idle" ? (
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">{puzzle.name}</h2>
            <p className="text-slate-600">{puzzle.description}</p>
            <button
              onClick={handleStart}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Start Puzzle
            </button>
          </div>
        ) : status === "playing" || status === "finished" ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Deduction Grid */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Logic Grid</h3>
              <div className="inline-block border-2 border-slate-300 rounded-lg overflow-hidden">
                <table className="border-collapse">
                  <thead>
                    <tr>
                      <th className="w-12 h-12 border border-slate-300 bg-slate-100"></th>
                      {puzzle.colLabels.map((label, idx) => (
                        <th key={idx} className="w-16 h-12 border border-slate-300 bg-slate-100 font-semibold">
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {grid.map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        <td className="w-12 h-16 border border-slate-300 bg-slate-100 font-semibold text-center">
                          {puzzle.rowLabels[rowIdx]}
                        </td>
                        {row.map((cell, colIdx) => (
                          <td key={colIdx}>
                            <button
                              onClick={() => handleCellClick(rowIdx, colIdx)}
                              disabled={status === "finished"}
                              className={`w-16 h-16 border border-slate-300 transition-colors ${
                                cell === 'yes'
                                  ? "bg-green-200 hover:bg-green-300"
                                  : cell === 'no'
                                  ? "bg-red-200 hover:bg-red-300"
                                  : "bg-white hover:bg-slate-50"
                              }`}
                            >
                              {cell === 'yes' ? '✓' : cell === 'no' ? '✗' : '?'}
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Submit Button */}
            {status === "playing" && (
              <button
                onClick={handleSubmit}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Submit Solution
              </button>
            )}

            {/* Results */}
            {status === "finished" && result && challengeCodeData && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${
                    result.correct ? "text-green-600" : "text-amber-600"
                  }`}>
                    {result.correct ? "Correct!" : `${result.accuracy.toFixed(1)}% Accuracy`}
                  </div>
                </div>

                {/* Challenge Code Share */}
                <ChallengeCodeShare code={challengeCodeData} score={result.accuracy} />

                {/* Score Comparison */}
                {scoreComparison && (
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <ScoreComparisonDisplay comparison={scoreComparison} />
                  </div>
                )}

                {/* Leaderboard */}
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <LeaderboardView 
                    challengeCode={challengeCodeData.code}
                    playerScore={playerScoreData || undefined}
                  />
                </div>

                {/* Achievements */}
                {achievementIds.length > 0 && (
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <AchievementDisplay achievementIds={achievementIds} compact />
                  </div>
                )}

                <button
                  onClick={handleReset}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  New Puzzle
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </GameShell>
  );
}