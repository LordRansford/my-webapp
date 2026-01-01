/**
 * Allocation Architect - Main Game Component
 */

"use client";

import React, { useState, useCallback, useEffect } from "react";
import GameShell from "@/lib/games/framework/GameShell";
import type { GameConfig, GameStatus } from "@/lib/games/framework/types";
import type { GameState, Allocation, Scenario } from "./types";
import { generateScenario } from "./scenarioGenerator";
import { initializeGameState, startGame, executeRound, checkWinCondition } from "./gameState";
import { validateAllocation, calculateProjectedState } from "./allocationEngine";
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
import { calculateMetrics } from "./efficiencyCalculator";
import { calculateBaseXP, createRewardContext, generateRewardResult } from "@/lib/games/shared/variableRewards";

const GAME_CONFIG: GameConfig = {
  id: "allocation-architect",
  title: "Allocation Architect",
  description: "Build optimal resource allocation plans under constraints",
  category: "strategy",
  modes: ["solo", "daily"],
  supportsMultiplayer: false,
  minPlayers: 1,
  maxPlayers: 1,
  estimatedMinutes: 12,
  tutorialAvailable: true,
};

const GAME_ID = "allocation-architect";

export default function AllocationArchitect() {
  const [status, setStatus] = useState<GameStatus>("idle");
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentAllocation, setCurrentAllocation] = useState<Record<string, number>>({});
  const [previewState, setPreviewState] = useState<any>(null);
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
      const scenario = generateScenario(
        dailyChallenge.seed,
        'budget-optimization',
        'intermediate',
        8
      );
      const state = initializeGameState(scenario, dailyChallenge.seed);
      setGameState(state);
      setCurrentAllocation({});
      setPreviewState(null);
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

  const handleAllocationChange = useCallback((projectId: string, resources: number) => {
    if (status !== "playing" || !gameState) return;
    
    setCurrentAllocation(prev => ({
      ...prev,
      [projectId]: Math.max(0, resources),
    }));
    
    // Calculate preview
    const allocation: Allocation[] = Object.entries({
      ...currentAllocation,
      [projectId]: resources,
    })
      .filter(([_, value]) => value > 0)
      .map(([id, value]) => ({ projectId: id, resources: value }));
    
    const preview = calculateProjectedState(gameState, allocation);
    setPreviewState(preview);
  }, [status, gameState, currentAllocation]);

  const handleConfirmRound = useCallback(() => {
    if (!gameState || status !== "playing") return;
    
    // Convert current allocation to Allocation[]
    const allocation: Allocation[] = Object.entries(currentAllocation)
      .filter(([_, value]) => value > 0)
      .map(([id, value]) => ({ projectId: id, resources: value }));
    
    // Validate
    const validation = validateAllocation(gameState, allocation);
    if (!validation.valid) {
      alert(validation.errors.join('\n'));
      return;
    }
    
    // Execute round
    const newState = executeRound(gameState, allocation);
    setGameState(newState);
    setCurrentAllocation({});
    setPreviewState(null);
    
    // Check if finished
    if (newState.status === 'finished') {
      setStatus("finished");
      handleGameComplete(newState);
    }
  }, [gameState, status, currentAllocation]);

  const handleGameComplete = useCallback((state: GameState) => {
    if (!state.outcome || !startTime) return;
    
    const timeUsed = Date.now() - startTime;
    const metrics = calculateMetrics(state);
    const win = state.outcome === 'win';
    
    // Generate challenge code
    const codeData = generateTodayChallengeCode(GAME_ID, state.seed);
    storeChallengeCode(codeData);
    setChallengeCodeData(codeData);
    
    // Calculate score
    const score = win 
      ? Math.round(metrics.objectiveProgress * 0.4 + metrics.resourceEfficiency * 0.4 + metrics.constraintCompliance * 0.2)
      : Math.round(metrics.objectiveProgress * 0.3 + metrics.resourceEfficiency * 0.3);
    
    // Calculate base XP
    const baseXP = calculateBaseXP({
      win,
      score,
      efficiency: metrics.resourceEfficiency,
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
        efficiency: metrics.resourceEfficiency,
        time: timeUsed,
      },
      streak: streakData.currentStreak,
      tier: getProgress().currentTier,
    });
    const rewardResult = generateRewardResult(rewardContext);
    
    // Update progress
    const progress = getProgress();
    const updatedProgress = updateProgressAfterGame(
      progress,
      state,
      score,
      metrics.resourceEfficiency
    );
    updatedProgress.xp = rewardResult.totalXP; // Use reward XP
    saveProgress(updatedProgress);
    
    // Submit score
    const scoreData = {
      score,
      time: timeUsed,
      scoreValue: score,
      efficiency: metrics.resourceEfficiency,
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
    setCurrentAllocation({});
    setPreviewState(null);
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
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Round</h3>
        <div className="text-lg font-bold">
          {gameState.currentRound} / {gameState.totalRounds}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Budget</h3>
        <div className="text-lg font-bold">
          {gameState.resourceBudget}
        </div>
      </div>
      {gameState.metrics && (
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Efficiency</h3>
          <div className="text-lg font-bold text-green-600">
            {Math.round(gameState.metrics.resourceEfficiency)}%
          </div>
        </div>
      )}
      {gameState.constraints.some(c => c.violated) && (
        <div>
          <h3 className="text-sm font-semibold text-red-600 mb-2">⚠️ Constraints</h3>
          <div className="text-sm text-red-600">
            {gameState.constraints.filter(c => c.violated).length} violated
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
        {!gameState ? (
          <div className="text-center text-slate-600">Loading scenario...</div>
        ) : status === "idle" ? (
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">{gameState.scenario.name}</h2>
            <p className="text-slate-600">{gameState.scenario.description}</p>
            <div className="space-y-2">
              <div><strong>Projects:</strong> {gameState.projects.length}</div>
              <div><strong>Objectives:</strong> {gameState.objectives.length}</div>
              <div><strong>Constraints:</strong> {gameState.constraints.length}</div>
              <div><strong>Rounds:</strong> {gameState.totalRounds}</div>
            </div>
            <button
              onClick={handleStart}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Start Planning
            </button>
          </div>
        ) : status === "playing" || status === "finished" ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Objectives Panel */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Objectives</h3>
              <div className="space-y-2">
                {gameState.objectives.map(obj => (
                  <div key={obj.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-900">{obj.name}</div>
                      <div className="text-xs text-slate-600">{obj.description}</div>
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

            {/* Projects Panel */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Projects</h3>
              <div className="space-y-3">
                {gameState.projects.map(project => {
                  const allocated = currentAllocation[project.id] || 0;
                  const canAllocate = project.dependencies.every(depId => {
                    const dep = gameState.projects.find(p => p.id === depId);
                    return !dep || dep.currentProgress >= 100;
                  });
                  
                  return (
                    <div
                      key={project.id}
                      className={`p-3 border-2 rounded-lg ${
                        project.currentProgress >= 100
                          ? 'border-green-500 bg-green-50'
                          : canAllocate
                          ? 'border-slate-300 bg-white'
                          : 'border-slate-200 bg-slate-50 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-semibold text-slate-900">{project.name}</div>
                          <div className="text-xs text-slate-600">{project.description}</div>
                        </div>
                        <div className="text-sm font-medium">
                          {Math.round(project.currentProgress)}%
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${project.currentProgress}%` }}
                        />
                      </div>
                      {status === "playing" && canAllocate && (
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max={gameState.resourceBudget}
                            value={allocated}
                            onChange={(e) => handleAllocationChange(project.id, parseInt(e.target.value))}
                            className="flex-1"
                            disabled={status === "finished"}
                          />
                          <div className="w-16 text-sm font-medium text-right">
                            {allocated}
                          </div>
                        </div>
                      )}
                      {!canAllocate && project.dependencies.length > 0 && (
                        <div className="text-xs text-slate-500">
                          Depends on: {project.dependencies.join(', ')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Constraints Panel */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Constraints</h3>
              <div className="space-y-2">
                {gameState.constraints.map(constraint => (
                  <div key={constraint.id} className="flex items-center justify-between">
                    <div className="text-sm font-medium text-slate-900">{constraint.name}</div>
                    <div className={`text-sm font-medium ${
                      constraint.violated ? 'text-red-600' : 
                      constraint.current > constraint.limit * constraint.warningThreshold ? 'text-yellow-600' : 
                      'text-green-600'
                    }`}>
                      {Math.round(constraint.current)} / {constraint.limit}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Panel */}
            {status === "playing" && (
              <div className="flex gap-2">
                <button
                  onClick={handleConfirmRound}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Confirm Round {gameState.currentRound}
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
                  {gameState.metrics && (
                    <div className="text-sm text-slate-600">
                      Efficiency: {Math.round(gameState.metrics.resourceEfficiency)}% | 
                      Objectives: {Math.round(gameState.metrics.objectiveProgress)}%
                    </div>
                  )}
                </div>

                {/* Enhanced Results Screen Components */}
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
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Post-Run Analysis</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Summary</h4>
                        <p className="text-sm text-slate-600">{analysis.summary}</p>
                      </div>
                      {analysis.keyDecisions && analysis.keyDecisions.length > 0 && (
                        <div>
                          <h4 className="font-medium text-slate-900 mb-2">Key Decisions</h4>
                          <ul className="text-sm text-slate-600 space-y-2">
                            {analysis.keyDecisions.slice(0, 3).map((decision: any, i: number) => (
                              <li key={i} className="border-l-2 border-blue-300 pl-2">
                                <div className="font-medium">Round {decision.round}: {decision.description}</div>
                                <div className="text-xs text-slate-500">{decision.reasoning}</div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {analysis.mistakes && analysis.mistakes.length > 0 && (
                        <div>
                          <h4 className="font-medium text-slate-900 mb-2">Mistakes & Inefficiencies</h4>
                          <ul className="text-sm text-slate-600 space-y-2">
                            {analysis.mistakes.slice(0, 3).map((mistake: any, i: number) => (
                              <li key={i} className="border-l-2 border-red-300 pl-2">
                                <div className="font-medium">Round {mistake.round}: {mistake.description}</div>
                                <div className="text-xs text-slate-500">Cost: {mistake.cost}</div>
                                <div className="text-xs text-blue-600">Recommendation: {mistake.recommendation}</div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {analysis.recommendations && analysis.recommendations.length > 0 && (
                        <div>
                          <h4 className="font-medium text-slate-900 mb-2">Recommended Strategy Adjustment</h4>
                          <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                            {analysis.recommendations.map((rec: any, i: number) => (
                              <li key={i}>
                                <span className="font-medium">{rec.type}:</span> {rec.description}
                                <div className="text-xs text-slate-500 ml-4">{rec.rationale}</div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    New Challenge
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </GameShell>
  );
}
