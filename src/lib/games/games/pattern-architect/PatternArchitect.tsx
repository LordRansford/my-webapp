/**
 * Pattern Architect - Main Game Component
 */

"use client";

import React, { useState, useCallback, useEffect } from "react";
import GameShell from "@/lib/games/framework/GameShell";
import type { GameConfig, GameStatus } from "@/lib/games/framework/types";
import type { PatternChallenge, Pattern, PatternElementType } from "./types";
import { generateChallenge } from "./patternGenerator";
import { validatePattern } from "./patternValidator";
import { calculateBeautyScore } from "./beautyCalculator";
import { loadProgress, saveProgress, savePattern } from "./persistence";
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
  id: "pattern-architect",
  title: "Pattern Architect",
  description: "Create beautiful symmetric patterns",
  category: "puzzle",
  modes: ["solo", "daily"],
  supportsMultiplayer: false,
  minPlayers: 1,
  maxPlayers: 1,
  estimatedMinutes: 10,
  tutorialAvailable: true,
};

const GAME_ID = "pattern-architect";

export default function PatternArchitect() {
  const [status, setStatus] = useState<GameStatus>("idle");
  const [challenge, setChallenge] = useState<PatternChallenge | null>(null);
  const [pattern, setPattern] = useState<Pattern | null>(null);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [challengeCodeData, setChallengeCodeData] = useState<ChallengeCode | null>(null);
  const [scoreComparison, setScoreComparison] = useState<any>(null);
  const [playerScoreData, setPlayerScoreData] = useState<any>(null);
  const [achievementIds, setAchievementIds] = useState<string[]>([]);

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
        difficulty: "designer",
      });
      setChallenge(generated);
      
      // Initialize empty pattern grid
      const grid: PatternElementType[][] = [];
      for (let i = 0; i < generated.gridSize; i++) {
        grid[i] = [];
        for (let j = 0; j < generated.gridSize; j++) {
          grid[i][j] = 'dot';
        }
      }
      
      setPattern({
        grid,
        elements: [],
      });
      setFinalScore(null);
    } catch (error) {
      console.error("Error initializing challenge:", error);
    }
  }, []);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (status !== "playing" || !pattern || !challenge) return;
    
    setPattern(prev => {
      if (!prev) return prev;
      
      const newGrid = prev.grid.map(r => [...r]);
      const newElements = [...prev.elements];
      
      // Toggle cell
      const currentType = newGrid[row][col];
      if (currentType === 'dot') {
        newGrid[row][col] = 'shape';
        newElements.push({ row, col, type: 'shape' });
      } else {
        newGrid[row][col] = 'dot';
        const index = newElements.findIndex(e => e.row === row && e.col === col);
        if (index >= 0) {
          newElements.splice(index, 1);
        }
      }
      
      return {
        grid: newGrid,
        elements: newElements,
      };
    });
  }, [status, pattern, challenge]);

  const handleSubmit = useCallback(() => {
    if (!challenge || !pattern || !startTime) return;

    const beautyScore = calculateBeautyScore(pattern, challenge);
    setFinalScore(beautyScore.total);
    setStatus("finished");

    const codeData = generateTodayChallengeCode(GAME_ID, challenge.seed);
    storeChallengeCode(codeData);
    setChallengeCodeData(codeData);

    const timeUsed = Date.now() - startTime;
    const scoreData = {
      score: beautyScore.total,
      time: timeUsed,
      scoreValue: beautyScore.total,
      timestamp: Date.now(),
    };
    
    setPlayerScoreData(scoreData);
    submitScore(codeData.code, scoreData);
    const comparison = getScoreComparison(codeData.code, scoreData);
    setScoreComparison(comparison);

    completeTodayChallenge(GAME_ID, {
      score: beautyScore.total,
      time: timeUsed,
      scoreValue: beautyScore.total,
    });

    updateStreakForGame(GAME_ID, true);

    const streakData = getStreakDataForGame(GAME_ID);
    const achievementResult = checkAndUnlockAchievements({
      gameId: GAME_ID,
      currentStreak: streakData.currentStreak,
      gamesCompleted: 1,
    });
    setAchievementIds(achievementResult.newlyUnlocked);

    savePattern(challenge.id, pattern);
    const progress = loadProgress();
    progress.challengesCompleted += 1;
    saveProgress(progress);
  }, [challenge, pattern, startTime]);

  const handleStart = useCallback(() => {
    if (!challenge) {
      initializeChallenge();
      return;
    }
    setStatus("playing");
    setFinalScore(null);
    setStartTime(Date.now());
  }, [challenge, initializeChallenge]);

  const handleReset = useCallback(() => {
    setStatus("idle");
    setFinalScore(null);
    setStartTime(null);
    setChallenge(null);
    setPattern(null);
    setChallengeCodeData(null);
    setScoreComparison(null);
    setAchievementIds([]);
    setPlayerScoreData(null);
  }, []);

  const validation = pattern && challenge
    ? validatePattern(pattern, challenge)
    : null;

  const rightPanel = challenge ? (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Rules</h3>
        <div className="space-y-2">
          {challenge.rules.map(rule => (
            <div key={rule.id} className="text-sm text-slate-600">
              {rule.description}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Required Symmetry</h3>
        <div className="text-sm text-slate-600">
          {challenge.requiredSymmetry.join(", ")}
        </div>
      </div>
      {pattern && (
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Elements</h3>
          <div className="text-lg font-bold">
            {pattern.elements.length} placed
          </div>
        </div>
      )}
      {validation && (
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Status</h3>
          <div className={`text-sm font-medium ${
            validation.valid ? "text-green-600" : "text-red-600"
          }`}>
            {validation.valid ? "✓ Valid" : `✗ ${validation.violations.length} issues`}
          </div>
        </div>
      )}
      {finalScore !== null && (
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Beauty Score</h3>
          <div className="text-2xl font-bold text-green-600">
            {finalScore.toFixed(1)}
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
        {!challenge || !pattern ? (
          <div className="text-center text-slate-600">Loading challenge...</div>
        ) : status === "idle" ? (
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">{challenge.name}</h2>
            <p className="text-slate-600">{challenge.description}</p>
            <button
              onClick={handleStart}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Start Challenge
            </button>
          </div>
        ) : status === "playing" || status === "finished" ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Pattern Grid */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Pattern Grid</h3>
              <div className="inline-grid gap-1 p-4 bg-slate-100 rounded-lg">
                {pattern.grid.map((row, rowIdx) => (
                  <div key={rowIdx} className="flex gap-1">
                    {row.map((cell, colIdx) => (
                      <button
                        key={`${rowIdx}-${colIdx}`}
                        onClick={() => handleCellClick(rowIdx, colIdx)}
                        disabled={status === "finished"}
                        className={`w-10 h-10 rounded border-2 transition-colors ${
                          cell === 'shape'
                            ? "bg-purple-600 border-purple-700"
                            : "bg-white border-slate-300 hover:border-purple-400"
                        }`}
                        aria-label={`Cell ${rowIdx},${colIdx}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            {status === "playing" && (
              <button
                onClick={handleSubmit}
                className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Submit Pattern
              </button>
            )}

            {/* Results */}
            {status === "finished" && finalScore !== null && (
              <div className="text-center space-y-4">
                <div className="text-3xl font-bold text-purple-600">
                  Beauty Score: {finalScore.toFixed(1)}
                </div>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
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