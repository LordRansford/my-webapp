/**
 * Governance Simulator - Main Game Component
 */

"use client";

import React, { useState, useCallback, useEffect } from "react";
import GameShell from "@/lib/games/framework/GameShell";
import type { GameConfig, GameStatus } from "@/lib/games/framework/types";
import type { GameState, GovernanceStrategy } from "./types";
import { generateScenario } from "./scenarioGenerator";
import { initializeGameState, startGame, executeTurn, checkWinCondition } from "./gameState";
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
  id: "governance-simulator",
  title: "Governance Simulator",
  description: "Make governance decisions under uncertainty",
  category: "educational",
  modes: ["solo", "daily"],
  supportsMultiplayer: false,
  minPlayers: 1,
  maxPlayers: 1,
  estimatedMinutes: 20,
  tutorialAvailable: true,
};

const GAME_ID = "governance-simulator";

export default function GovernanceSimulator() {
  const [status, setStatus] = useState<GameStatus>("idle");
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [strategyChanges, setStrategyChanges] = useState<Partial<GovernanceStrategy>>({});
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
      const scenario = generateScenario(dailyChallenge.seed, 'data-sharing', 'intermediate');
      const state = initializeGameState(scenario, dailyChallenge.seed);
      setGameState(state);
      setStrategyChanges({});
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

  const handleStrategyChange = useCallback((key: keyof GovernanceStrategy, value: number) => {
    setStrategyChanges(prev => ({
      ...prev,
      [key]: Math.max(0, Math.min(100, value)),
    }));
  }, []);

  const handleConfirmTurn = useCallback(() => {
    if (!gameState || status !== "playing") return;
    
    const newState = executeTurn(gameState, Object.keys(strategyChanges).length > 0 ? strategyChanges : undefined);
    setGameState(newState);
    setStrategyChanges({});
    
    if (newState.status === 'finished') {
      setStatus("finished");
      handleGameComplete(newState);
    }
  }, [gameState, status, strategyChanges]);

  const handleGameComplete = useCallback((state: GameState) => {
    if (!state.outcome || !startTime) return;
    
    const timeUsed = Date.now() - startTime;
    const win = state.outcome === 'win';
    
    // Calculate score
    const trustScore = state.metrics.averageTrust;
    const outcomesScore = state.metrics.outcomes;
    const stabilityScore = state.metrics.stability;
    const score = win
      ? Math.round(trustScore * 0.4 + outcomesScore * 0.4 + stabilityScore * 0.2)
      : Math.round(trustScore * 0.3 + outcomesScore * 0.3);
    
    // Generate challenge code
    const codeData = generateTodayChallengeCode(GAME_ID, state.seed);
    storeChallengeCode(codeData);
    setChallengeCodeData(codeData);
    
    // Calculate base XP
    const baseXP = calculateBaseXP({
      win,
      score,
      efficiency: (trustScore + outcomesScore) / 2,
      time: timeUsed,
      difficulty: state.scenario.difficulty,
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
        efficiency: (trustScore + outcomesScore) / 2,
        time: timeUsed,
      },
      streak: streakData.currentStreak,
      tier: getProgress().currentTier,
    });
    const rewardResult = generateRewardResult(rewardContext);
    
    // Update progress
    const progress = getProgress();
    const updatedProgress = updateProgressAfterGame(progress, state, score);
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
      gamesCompleted: updatedProgress.stats.scenariosCompleted,
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
    setStrategyChanges({});
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
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Average Trust</h3>
        <div className={`text-lg font-bold ${
          gameState.metrics.averageTrust >= 70 ? 'text-green-600' :
          gameState.metrics.averageTrust >= 50 ? 'text-yellow-600' :
          'text-red-600'
        }`}>
          {Math.round(gameState.metrics.averageTrust)}%
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Average Risk</h3>
        <div className={`text-lg font-bold ${
          gameState.metrics.averageRisk < 50 ? 'text-green-600' :
          gameState.metrics.averageRisk < 70 ? 'text-yellow-600' :
          'text-red-600'
        }`}>
          {Math.round(gameState.metrics.averageRisk)}%
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Outcomes</h3>
        <div className="text-lg font-bold">
          {Math.round(gameState.metrics.outcomes)}%
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
            <h2 className="text-2xl font-bold text-slate-900">{gameState.scenario.name}</h2>
            <p className="text-slate-600">{gameState.scenario.description}</p>
            <div className="space-y-2">
              <div><strong>Stakeholders:</strong> {gameState.stakeholders.length}</div>
              <div><strong>Objectives:</strong> {gameState.objectives.length}</div>
              <div><strong>Turns:</strong> {gameState.totalTurns}</div>
            </div>
            <button
              onClick={handleStart}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Start Simulation
            </button>
          </div>
        ) : status === "playing" || status === "finished" ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Stakeholders Panel */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Stakeholders</h3>
              <div className="space-y-2">
                {gameState.stakeholders.map(stakeholder => (
                  <div key={stakeholder.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="font-semibold text-slate-900">{stakeholder.name}</div>
                      <div className="text-xs text-slate-600">{stakeholder.type}</div>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div>
                        <div className="text-slate-600">Trust</div>
                        <div className={`font-bold ${
                          stakeholder.trust >= 70 ? 'text-green-600' :
                          stakeholder.trust >= 50 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {Math.round(stakeholder.trust)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-600">Satisfaction</div>
                        <div className="font-bold">{Math.round(stakeholder.satisfaction)}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Governance Dashboard */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Governance Strategy</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-900">Controls: {gameState.governanceStrategy.controls}</label>
                  {status === "playing" && (
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={strategyChanges.controls ?? gameState.governanceStrategy.controls}
                      onChange={(e) => handleStrategyChange('controls', parseInt(e.target.value))}
                      className="w-full"
                    />
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-900">Transparency: {gameState.governanceStrategy.transparency}</label>
                  {status === "playing" && (
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={strategyChanges.transparency ?? gameState.governanceStrategy.transparency}
                      onChange={(e) => handleStrategyChange('transparency', parseInt(e.target.value))}
                      className="w-full"
                    />
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-900">Autonomy: {gameState.governanceStrategy.autonomy}</label>
                  {status === "playing" && (
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={strategyChanges.autonomy ?? gameState.governanceStrategy.autonomy}
                      onChange={(e) => handleStrategyChange('autonomy', parseInt(e.target.value))}
                      className="w-full"
                    />
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-900">Enforcement: {gameState.governanceStrategy.enforcement}</label>
                  {status === "playing" && (
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={strategyChanges.enforcement ?? gameState.governanceStrategy.enforcement}
                      onChange={(e) => handleStrategyChange('enforcement', parseInt(e.target.value))}
                      className="w-full"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Objectives Panel */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Objectives</h3>
              <div className="space-y-2">
                {gameState.objectives.map(obj => (
                  <div key={obj.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-900">{obj.name}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-slate-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            obj.met ? 'bg-green-600' : 'bg-blue-600'
                          }`}
                          style={{ width: `${Math.min(100, (obj.current / obj.target) * 100)}%` }}
                        />
                      </div>
                      <div className="text-sm font-medium w-16 text-right">
                        {Math.round(obj.current)} / {obj.target}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risks Panel */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Risks</h3>
              <div className="space-y-2">
                {gameState.risks.map(risk => (
                  <div key={risk.id} className="flex items-center justify-between">
                    <div className="text-sm font-medium text-slate-900">{risk.name}</div>
                    <div className={`text-sm font-medium ${
                      risk.level < 50 ? 'text-green-600' :
                      risk.level < 70 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {Math.round(risk.level)}% ({risk.trend})
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Panel */}
            {status === "playing" && (
              <button
                onClick={handleConfirmTurn}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Confirm Turn {gameState.currentTurn}
              </button>
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
                    Trust: {Math.round(gameState.metrics.averageTrust)}% | 
                    Outcomes: {Math.round(gameState.metrics.outcomes)}%
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
