/**
 * Constraint Optimizer - Main Game Component
 */

"use client";

import React, { useState, useCallback, useEffect } from "react";
import GameShell from "@/lib/games/framework/GameShell";
import type { GameConfig, GameStatus } from "@/lib/games/framework/types";
import type { OptimizationChallenge } from "./types";
import { generateChallenge } from "./challengeGenerator";
import { validateSolution, countConstraintViolations } from "./constraintEngine";
import { calculateEfficiency, createSolution } from "./efficiencyCalculator";
import { loadProgress, saveProgress, saveSolution } from "./persistence";
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
  getScoreComparison,
} from "@/lib/games/shared/scoreComparison";
import {
  ChallengeCodeShare,
  ScoreComparisonDisplay,
  AchievementDisplay,
  LeaderboardView,
} from "@/lib/games/shared/components";
import type { ChallengeCode } from "@/lib/games/shared/challengeCodes/types";

const GAME_CONFIG: GameConfig = {
  id: "constraint-optimizer",
  title: "Constraint Optimizer",
  description: "Optimize resource allocation under constraints",
  category: "puzzle",
  modes: ["solo", "daily"],
  supportsMultiplayer: false,
  minPlayers: 1,
  maxPlayers: 1,
  estimatedMinutes: 10,
  tutorialAvailable: true,
};

const GAME_ID = "constraint-optimizer";

export default function ConstraintOptimizer() {
  const [status, setStatus] = useState<GameStatus>("idle");
  const [challenge, setChallenge] = useState<OptimizationChallenge | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [finalEfficiency, setFinalEfficiency] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (status === "idle" && !challenge) {
      initializeChallenge();
    }
  }, [status, challenge]);

  const initializeChallenge = useCallback(() => {
    try {
      const dailyChallenge = getOrGenerateTodayChallenge(GAME_ID);
      const generated = generateChallenge({
        seed: dailyChallenge.seed,
        difficulty: "optimizer",
      });
      setChallenge(generated);
      setSelectedItems(new Set());
      setFinalEfficiency(null);
    } catch (error) {
      console.error("Error initializing challenge:", error);
    }
  }, []);

  const handleToggleItem = useCallback((item: string) => {
    if (status !== "playing" || !challenge) return;
    
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (next.has(item)) {
        next.delete(item);
      } else {
        if (next.size < challenge.maxItems) {
          next.add(item);
        }
      }
      return next;
    });
  }, [status, challenge]);

  const handleSubmit = useCallback(() => {
    if (!challenge || !startTime) return;

    const selected = Array.from(selectedItems);
    const solution = createSolution(selected, challenge);
    setFinalEfficiency(solution.efficiency);
    setStatus("finished");

    const challengeCode = generateTodayChallengeCode(GAME_ID, challenge.seed);
    storeChallengeCode(challengeCode);

    const timeUsed = Date.now() - startTime;
    submitScore(challengeCode.code, {
      score: solution.efficiency,
      time: timeUsed,
      scoreValue: solution.efficiency,
      timestamp: Date.now(),
    });

    completeTodayChallenge(GAME_ID, {
      score: solution.efficiency,
      time: timeUsed,
      scoreValue: solution.efficiency,
    });

    updateStreakForGame(GAME_ID, true);

    const streakData = getStreakDataForGame(GAME_ID);
    checkAndUnlockAchievements({
      gameId: GAME_ID,
      currentStreak: streakData.currentStreak,
      gamesCompleted: 1,
    });

    saveSolution(challenge.id, solution);
    const progress = loadProgress();
    progress.challengesCompleted += 1;
    saveProgress(progress);
  }, [challenge, selectedItems, startTime]);

  const handleStart = useCallback(() => {
    if (!challenge) {
      initializeChallenge();
      return;
    }
    setStatus("playing");
    setSelectedItems(new Set());
    setFinalEfficiency(null);
    setStartTime(Date.now());
  }, [challenge, initializeChallenge]);

  const handleReset = useCallback(() => {
    setStatus("idle");
    setSelectedItems(new Set());
    setFinalEfficiency(null);
    setStartTime(null);
    setChallenge(null);
  }, []);

  const validation = challenge && selectedItems.size > 0
    ? validateSolution(Array.from(selectedItems), challenge)
    : null;

  const rightPanel = challenge ? (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Constraints</h3>
        <div className="space-y-2">
          {challenge.constraints.map(constraint => (
            <div key={constraint.id} className="text-sm text-slate-600">
              {constraint.description}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Selection</h3>
        <div className="text-lg font-bold">
          {selectedItems.size} / {challenge.maxItems} items
        </div>
      </div>
      {validation && (
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Status</h3>
          <div className={`text-sm font-medium ${
            validation.valid ? "text-green-600" : "text-red-600"
          }`}>
            {validation.valid ? "✓ Valid" : `✗ ${validation.violations.length} violations`}
          </div>
        </div>
      )}
      {finalEfficiency !== null && (
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Efficiency</h3>
          <div className="text-2xl font-bold text-green-600">
            {finalEfficiency.toFixed(1)}%
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
        {!challenge ? (
          <div className="text-center text-slate-600">Loading challenge...</div>
        ) : status === "idle" ? (
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">{challenge.name}</h2>
            <p className="text-slate-600">{challenge.description}</p>
            <button
              onClick={handleStart}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Start Challenge
            </button>
          </div>
        ) : status === "playing" || status === "finished" ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Available Items */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Select Items</h3>
              <div className="flex flex-wrap gap-2">
                {challenge.availableItems.map(item => {
                  const isSelected = selectedItems.has(item);
                  return (
                    <button
                      key={item}
                      onClick={() => handleToggleItem(item)}
                      disabled={status === "finished"}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        isSelected
                          ? "border-blue-600 bg-blue-100 text-blue-900"
                          : "border-slate-300 bg-white hover:border-blue-400"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Violations */}
            {validation && !validation.valid && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-900 mb-2">Constraint Violations:</h4>
                <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                  {validation.violations.map((violation, i) => (
                    <li key={i}>{violation}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Submit Button */}
            {status === "playing" && (
              <button
                onClick={handleSubmit}
                disabled={selectedItems.size === 0}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                Submit Solution
              </button>
            )}

            {/* Results */}
            {status === "finished" && finalEfficiency !== null && challengeCodeData && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    Efficiency: {finalEfficiency.toFixed(1)}%
                  </div>
                </div>

                {/* Challenge Code Share */}
                <ChallengeCodeShare code={challengeCodeData} score={finalEfficiency} />

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
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  New Challenge
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </GameShell>
  );
}