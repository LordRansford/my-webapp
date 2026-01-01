/**
 * Signal Hunt - Main Game Component
 */

"use client";

import React, { useState, useCallback, useEffect } from "react";
import GameShell from "@/lib/games/framework/GameShell";
import type { GameConfig, GameStatus } from "@/lib/games/framework/types";
import type { GameState, Action, Signal } from "./types";
import { generateScenario } from "./scenarioGenerator";
import { initializeGameState, startGame, executeTurn, checkWinCondition, checkLossCondition } from "./gameState";
import { getProgress, saveProgress, updateProgressAfterGame } from "./persistence";
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
import { analyzeRun } from "./explainabilityAnalyzer";
import { calculateBaseXP, createRewardContext, generateRewardResult } from "@/lib/games/shared/variableRewards";

const GAME_CONFIG: GameConfig = {
  id: "signal-hunt",
  title: "Signal Hunt",
  description: "Triage security signals under time pressure",
  category: "strategy",
  modes: ["solo", "daily"],
  supportsMultiplayer: false,
  minPlayers: 1,
  maxPlayers: 1,
  estimatedMinutes: 15,
  tutorialAvailable: true,
};

const GAME_ID = "signal-hunt";

export default function SignalHunt() {
  const [status, setStatus] = useState<GameStatus>("idle");
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedActions, setSelectedActions] = useState<Action[]>([]);
  const [challengeCodeData, setChallengeCodeData] = useState<ChallengeCode | null>(null);
  const [scoreComparison, setScoreComparison] = useState<any>(null);
  const [achievementIds, setAchievementIds] = useState<string[]>([]);
  const [playerScoreData, setPlayerScoreData] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (status === "idle" && !gameState) {
      initializeChallenge();
    }
  }, [status, gameState]);

  const initializeChallenge = useCallback(() => {
    try {
      const dailyChallenge = getOrGenerateTodayChallenge(GAME_ID);
      const scenario = generateScenario(dailyChallenge.seed, 'intermediate');
      const state = initializeGameState(scenario, dailyChallenge.seed);
      setGameState(state);
      setSelectedActions([]);
      setChallengeCodeData(null);
      setScoreComparison(null);
      setAchievementIds([]);
      setPlayerScoreData(null);
      setAnalysis(null);
    } catch (error) {
      console.error("Error initializing challenge:", error);
    }
  }, []);

  const handleStart = useCallback(() => {
    if (!gameState) {
      initializeChallenge();
      return;
    }
    const started = startGame(gameState);
    setGameState(started);
    setStatus("playing");
    setStartTime(Date.now());
  }, [gameState, initializeChallenge]);

  const handleActionSelect = useCallback((signalId: string, actionType: Action['type']) => {
    if (status !== "playing" || !gameState) return;
    
    setSelectedActions(prev => {
      const filtered = prev.filter(a => a.signalId !== signalId);
      return [...filtered, {
        signalId,
        type: actionType,
        timestamp: gameState.currentTurn,
      }];
    });
  }, [status, gameState]);

  const handleConfirmTurn = useCallback(() => {
    if (!gameState || status !== "playing" || selectedActions.length === 0) return;
    
    const newState = executeTurn(gameState, selectedActions);
    setGameState(newState);
    setSelectedActions([]);
    
    if (newState.status === 'finished') {
      setStatus("finished");
      handleGameComplete(newState);
    }
  }, [gameState, status, selectedActions]);

  const handleGameComplete = useCallback((state: GameState) => {
    if (!state.outcome || !startTime) return;
    
    const timeUsed = Date.now() - startTime;
    const win = state.outcome === 'win';
    
    // Calculate accuracy
    const investigatedSignals = state.investigationHistory.length;
    const falsePositives = state.signalQueue.filter(s => s.isFalsePositive && 
      state.investigationHistory.some(a => a.signalId === s.id)).length;
    const accuracy = investigatedSignals > 0 
      ? 1 - (falsePositives / investigatedSignals)
      : 1;
    
    // Calculate score (lower risk = higher score)
    const score = win 
      ? Math.round((100 - state.riskScore) * 0.6 + accuracy * 100 * 0.4)
      : Math.round((100 - state.riskScore) * 0.4);
    
    // Generate challenge code
    const codeData = generateTodayChallengeCode(GAME_ID, state.seed);
    storeChallengeCode(codeData);
    setChallengeCodeData(codeData);
    
    // Calculate base XP
    const baseXP = calculateBaseXP({
      win,
      score,
      efficiency: accuracy * 100,
      time: timeUsed,
      difficulty: state.posture === 'aggressive' ? 'advanced' : 'intermediate',
      tier: getProgress().currentTier,
    });
    
    // Generate variable rewards
    const streakData = getStreakDataForGame(GAME_ID);
    const rewardContext = createRewardContext({
      gameId: GAME_ID,
      seed: state.seed,
      baseXP,
      performance: {
        score,
        efficiency: accuracy * 100,
        time: timeUsed,
      },
      streak: streakData.currentStreak,
      tier: getProgress().currentTier,
    });
    const rewardResult = generateRewardResult(rewardContext);
    
    // Update progress
    const progress = getProgress();
    const updatedProgress = updateProgressAfterGame(progress, state, score, accuracy);
    updatedProgress.xp = rewardResult.totalXP;
    saveProgress(updatedProgress);
    
    // Submit score
    const scoreData = {
      score,
      time: timeUsed,
      scoreValue: score,
      timestamp: Date.now(),
    };
    setPlayerScoreData(scoreData);
    const comparison = submitScore(codeData.code, scoreData);
    setScoreComparison(comparison);
    
    // Complete daily challenge
    completeTodayChallenge(GAME_ID, {
      score,
      time: timeUsed,
      scoreValue: score,
    });
    
    // Update streak
    updateStreakForGame(GAME_ID, true);
    
    // Check achievements
    const achievementResult = checkAndUnlockAchievements({
      gameId: GAME_ID,
      currentStreak: streakData.currentStreak + 1,
      gamesCompleted: updatedProgress.stats.gamesPlayed,
      score,
      time: timeUsed,
    });
    setAchievementIds(achievementResult.newlyUnlocked);
    
    // Generate analysis
    const gameAnalysis = analyzeRun(state);
    setAnalysis(gameAnalysis);
  }, [startTime]);

  const handleReset = useCallback(() => {
    setStatus("idle");
    setGameState(null);
    setSelectedActions([]);
    setChallengeCodeData(null);
    setScoreComparison(null);
    setAchievementIds([]);
    setPlayerScoreData(null);
    setAnalysis(null);
    setStartTime(null);
  }, []);

  const rightPanel = gameState ? (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Turn</h3>
        <div className="text-lg font-bold">
          {gameState.currentTurn} / {gameState.totalTurns}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Risk Score</h3>
        <div className={`text-lg font-bold ${
          gameState.riskScore < 30 ? 'text-green-600' :
          gameState.riskScore < 70 ? 'text-yellow-600' :
          'text-red-600'
        }`}>
          {Math.round(gameState.riskScore)}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Budget</h3>
        <div className="text-sm">
          Actions: {gameState.budget.actions}<br />
          Budget: {gameState.budget.budget}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Threats</h3>
        <div className="text-sm">
          Active: {Array.from(gameState.threats.values()).filter(t => t.state !== 'resolved').length}
        </div>
      </div>
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
        {!gameState ? (
          <div className="text-center text-slate-600">Loading scenario...</div>
        ) : status === "idle" ? (
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Signal Hunt</h2>
            <p className="text-slate-600">Triage security signals under time pressure</p>
            <button
              onClick={handleStart}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Start Challenge
            </button>
          </div>
        ) : status === "playing" || status === "finished" ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Signal Queue */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                Signal Queue (Turn {gameState.currentTurn})
              </h3>
              <div className="space-y-2">
                {gameState.signalQueue.slice(0, 6).map(signal => {
                  const action = selectedActions.find(a => a.signalId === signal.id);
                  const threat = gameState.threats.get(signal.id);
                  
                  return (
                    <div
                      key={signal.id}
                      className={`p-3 border-2 rounded-lg ${
                        signal.severity === 'critical' ? 'border-red-500 bg-red-50' :
                        signal.severity === 'high' ? 'border-orange-500 bg-orange-50' :
                        signal.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                        'border-blue-500 bg-blue-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-semibold text-slate-900">{signal.name}</div>
                          <div className="text-xs text-slate-600">{signal.description}</div>
                        </div>
                        <div className="text-sm font-medium">
                          Threat: {Math.round(signal.threatProbability * 100)}%
                        </div>
                      </div>
                      {status === "playing" && (
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => handleActionSelect(signal.id, 'investigate')}
                            className={`px-3 py-1 text-sm rounded ${
                              action?.type === 'investigate' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            Investigate
                          </button>
                          <button
                            onClick={() => handleActionSelect(signal.id, 'contain')}
                            className={`px-3 py-1 text-sm rounded ${
                              action?.type === 'contain' 
                                ? 'bg-green-600 text-white' 
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            Contain
                          </button>
                          <button
                            onClick={() => handleActionSelect(signal.id, 'patch')}
                            className={`px-3 py-1 text-sm rounded ${
                              action?.type === 'patch' 
                                ? 'bg-purple-600 text-white' 
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            Patch
                          </button>
                          <button
                            onClick={() => handleActionSelect(signal.id, 'monitor')}
                            className={`px-3 py-1 text-sm rounded ${
                              action?.type === 'monitor' 
                                ? 'bg-yellow-600 text-white' 
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            Monitor
                          </button>
                          <button
                            onClick={() => handleActionSelect(signal.id, 'ignore')}
                            className={`px-3 py-1 text-sm rounded ${
                              action?.type === 'ignore' 
                                ? 'bg-gray-600 text-white' 
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            Ignore
                          </button>
                        </div>
                      )}
                      {threat && (
                        <div className="mt-2 text-xs text-red-600">
                          Threat Level: {Math.round(threat.escalationLevel)}% ({threat.state})
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Panel */}
            {status === "playing" && (
              <div className="flex gap-2">
                <button
                  onClick={handleConfirmTurn}
                  disabled={selectedActions.length === 0}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Turn {gameState.currentTurn} ({selectedActions.length} actions)
                </button>
              </div>
            )}

            {/* Results */}
            {status === "finished" && challengeCodeData && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${
                    gameState.outcome === 'win' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {gameState.outcome === 'win' ? 'Success!' : 'Failed'}
                  </div>
                  <div className="text-sm text-slate-600">
                    Risk Score: {Math.round(gameState.riskScore)} | 
                    Turns: {gameState.currentTurn}
                  </div>
                </div>

                <ChallengeCodeShare code={challengeCodeData} score={playerScoreData?.score || 0} />

                {scoreComparison && (
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <ScoreComparisonDisplay comparison={scoreComparison} />
                  </div>
                )}

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <LeaderboardView
                    challengeCode={challengeCodeData.code}
                    playerScore={playerScoreData || undefined}
                  />
                </div>

                {achievementIds.length > 0 && (
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <AchievementDisplay achievementIds={achievementIds} compact />
                  </div>
                )}

                {analysis && (
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Analysis</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-slate-900 mb-1">Summary</h4>
                        <p className="text-sm text-slate-600">{analysis.summary}</p>
                      </div>
                      {analysis.recommendations.length > 0 && (
                        <div>
                          <h4 className="font-medium text-slate-900 mb-1">Recommendations</h4>
                          <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                            {analysis.recommendations.map((rec: any, i: number) => (
                              <li key={i}>{rec.description}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
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
