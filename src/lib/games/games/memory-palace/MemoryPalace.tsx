/**
 * Memory Palace - Main Game Component
 */

"use client";

import React, { useState, useCallback, useEffect } from "react";
import GameShell from "@/lib/games/framework/GameShell";
import type { GameConfig, GameStatus } from "@/lib/games/framework/types";
import type { MemoryChallenge, ReviewResult } from "./types";
import { generateChallenge } from "./challengeGenerator";
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
  id: "memory-palace",
  title: "Memory Palace",
  description: "Train your memory with proven techniques",
  category: "educational",
  modes: ["solo", "daily"],
  supportsMultiplayer: false,
  minPlayers: 1,
  maxPlayers: 1,
  estimatedMinutes: 10,
  tutorialAvailable: true,
};

const GAME_ID = "memory-palace";

export default function MemoryPalace() {
  const [status, setStatus] = useState<GameStatus>("idle");
  const [challenge, setChallenge] = useState<MemoryChallenge | null>(null);
  const [memorizationPhase, setMemorizationPhase] = useState(true);
  const [recalledItems, setRecalledItems] = useState<Set<string>>(new Set());
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [studyTime, setStudyTime] = useState<number>(0);
  const [challengeCodeData, setChallengeCodeData] = useState<ChallengeCode | null>(null);
  const [scoreComparison, setScoreComparison] = useState<any>(null);
  const [achievementIds, setAchievementIds] = useState<string[]>([]);
  const [playerScoreData, setPlayerScoreData] = useState<any>(null);

  useEffect(() => {
    if (status === "idle" && !challenge) {
      initializeChallenge();
    }
  }, [status, challenge]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (status === "playing" && memorizationPhase && startTime) {
      interval = setInterval(() => {
        setStudyTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status, memorizationPhase, startTime]);

  const initializeChallenge = useCallback(() => {
    try {
      const dailyChallenge = getOrGenerateTodayChallenge(GAME_ID);
      const generated = generateChallenge({
        seed: dailyChallenge.seed,
        difficulty: "learner",
      });
      setChallenge(generated);
      setMemorizationPhase(true);
      setRecalledItems(new Set());
      setFinalScore(null);
      setStudyTime(0);
    } catch (error) {
      console.error("Error initializing challenge:", error);
    }
  }, []);

  const handleStartRecall = useCallback(() => {
    setMemorizationPhase(false);
  }, []);

  const handleItemRecall = useCallback((itemId: string) => {
    if (status !== "playing" || memorizationPhase) return;
    
    setRecalledItems(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, [status, memorizationPhase]);

  const calculateScore = useCallback((): number => {
    if (!challenge) return 0;
    
    let correct = 0;
    for (const item of challenge.items) {
      if (recalledItems.has(item.id)) {
        correct++;
      }
    }
    
    const accuracy = (correct / challenge.items.length) * 100;
    return accuracy;
  }, [challenge, recalledItems]);

  const handleSubmit = useCallback(() => {
    if (!challenge || !startTime) return;

    const score = calculateScore();
    setFinalScore(score);
    setStatus("finished");

    const codeData = generateTodayChallengeCode(GAME_ID, challenge.seed);
    storeChallengeCode(codeData);
    setChallengeCodeData(codeData);

    const timeUsed = Date.now() - startTime;
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
  }, [challenge, startTime, calculateScore]);

  const handleStart = useCallback(() => {
    if (!challenge) {
      initializeChallenge();
      return;
    }
    setStatus("playing");
    setMemorizationPhase(true);
    setRecalledItems(new Set());
    setFinalScore(null);
    setStartTime(Date.now());
    setStudyTime(0);
  }, [challenge, initializeChallenge]);

  const handleReset = useCallback(() => {
    setStatus("idle");
    setMemorizationPhase(true);
    setRecalledItems(new Set());
    setFinalScore(null);
    setStartTime(null);
    setStudyTime(0);
    setChallenge(null);
    setChallengeCodeData(null);
    setScoreComparison(null);
    setAchievementIds([]);
    setPlayerScoreData(null);
  }, []);

  const rightPanel = challenge ? (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Technique</h3>
        <div className="text-sm text-slate-600 capitalize">
          {challenge.technique}
        </div>
      </div>
      {memorizationPhase && (
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Study Time</h3>
          <div className="text-lg font-bold">
            {Math.floor(studyTime / 60)}:{(studyTime % 60).toString().padStart(2, '0')}
          </div>
        </div>
      )}
      {!memorizationPhase && (
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Recalled</h3>
          <div className="text-lg font-bold">
            {recalledItems.size} / {challenge.items.length}
          </div>
        </div>
      )}
      {finalScore !== null && (
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Score</h3>
          <div className="text-2xl font-bold text-green-600">
            {finalScore.toFixed(1)}%
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
              className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
            >
              Start Challenge
            </button>
          </div>
        ) : status === "playing" || status === "finished" ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {memorizationPhase ? (
              <>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    Memorize these items ({challenge.technique})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {challenge.items.map(item => (
                      <div
                        key={item.id}
                        className="p-4 border-2 border-slate-300 rounded-lg bg-white"
                      >
                        <div className="text-sm text-slate-500 mb-1">{item.type}</div>
                        <div className="text-lg font-semibold text-slate-900">
                          {item.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleStartRecall}
                  className="w-full px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                >
                  I&apos;m Ready to Recall
                </button>
              </>
            ) : (
              <>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    Select the items you remember
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {challenge.items.map(item => {
                      const isRecalled = recalledItems.has(item.id);
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleItemRecall(item.id)}
                          disabled={status === "finished"}
                          className={`p-4 border-2 rounded-lg text-left transition-colors ${
                            isRecalled
                              ? "border-amber-600 bg-amber-100"
                              : "border-slate-300 bg-white hover:border-amber-400"
                          }`}
                        >
                          <div className="text-sm text-slate-500 mb-1">{item.type}</div>
                          <div className="text-lg font-semibold text-slate-900">
                            {item.content}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <button
                  onClick={handleSubmit}
                  className="w-full px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                >
                  Submit Recall
                </button>
              </>
            )}

            {/* Results */}
            {status === "finished" && finalScore !== null && challengeCodeData && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-2">
                    Score: {finalScore.toFixed(1)}%
                  </div>
                </div>

                {/* Challenge Code Share */}
                <ChallengeCodeShare code={challengeCodeData} score={finalScore} />

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
                  className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
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