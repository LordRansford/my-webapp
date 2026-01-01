/**
 * Packet Route - Main Game Component
 */

"use client";

import React, { useState, useCallback, useEffect } from "react";
import GameShell from "@/lib/games/framework/GameShell";
import type { GameConfig, GameStatus } from "@/lib/games/framework/types";
import type { GameState, RoutingPolicyConfig } from "./types";
import { generateTopology } from "./topologyGenerator";
import { initializeGameState, startGame, executeTick, updateRoutingPolicy, checkWinCondition } from "./gameState";
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
  id: "packet-route",
  title: "Packet Route",
  description: "Design routing policies for network topologies",
  category: "strategy",
  modes: ["solo", "daily"],
  supportsMultiplayer: false,
  minPlayers: 1,
  maxPlayers: 1,
  estimatedMinutes: 15,
  tutorialAvailable: true,
};

const GAME_ID = "packet-route";

export default function PacketRoute() {
  const [status, setStatus] = useState<GameStatus>("idle");
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [challengeCodeData, setChallengeCodeData] = useState<ChallengeCode | null>(null);
  const [scoreComparison, setScoreComparison] = useState<any>(null);
  const [achievementIds, setAchievementIds] = useState<string[]>([]);
  const [playerScoreData, setPlayerScoreData] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [autoAdvance, setAutoAdvance] = useState(false);

  useEffect(() => {
    if (status === "idle" && !gameState) {
      initializeChallenge();
    }
  }, [status, gameState]);

  useEffect(() => {
    if (autoAdvance && status === "playing" && gameState) {
      const interval = setInterval(() => {
        const newState = executeTick(gameState);
        setGameState(newState);
        if (newState.status === 'finished') {
          setAutoAdvance(false);
          setStatus("finished");
          handleGameComplete(newState);
        }
      }, 2000); // 2 seconds per tick
      return () => clearInterval(interval);
    }
  }, [autoAdvance, status, gameState]);

  const initializeChallenge = useCallback(() => {
    try {
      const dailyChallenge = getOrGenerateTodayChallenge(GAME_ID);
      const topology = generateTopology(dailyChallenge.seed, 'mesh', 'intermediate');
      const slaTargets = {
        maxLatency: 50,
        minThroughput: 500,
        maxLoss: 0.01,
      };
      const state = initializeGameState(topology, slaTargets, dailyChallenge.seed);
      setGameState(state);
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

  const handlePolicyChange = useCallback((policy: RoutingPolicyConfig) => {
    if (!gameState || status !== "playing") return;
    const updated = updateRoutingPolicy(gameState, policy);
    setGameState(updated);
  }, [gameState, status]);

  const handleAdvanceTick = useCallback(() => {
    if (!gameState || status !== "playing") return;
    const newState = executeTick(gameState);
    setGameState(newState);
    if (newState.status === 'finished') {
      setStatus("finished");
      handleGameComplete(newState);
    }
  }, [gameState, status]);

  const handleGameComplete = useCallback((state: GameState) => {
    if (!state.outcome || !startTime) return;
    
    const timeUsed = Date.now() - startTime;
    const win = state.outcome === 'win';
    
    // Calculate score
    const slaScore = state.metrics.availability * 100;
    const latencyScore = Math.max(0, 100 - (state.metrics.averageLatency / state.slaTargets.maxLatency) * 100);
    const throughputScore = Math.min(100, (state.metrics.throughput / state.slaTargets.minThroughput) * 100);
    const score = win
      ? Math.round(slaScore * 0.5 + latencyScore * 0.25 + throughputScore * 0.25)
      : Math.round(slaScore * 0.3);
    
    // Generate challenge code
    const codeData = generateTodayChallengeCode(GAME_ID, state.seed);
    storeChallengeCode(codeData);
    setChallengeCodeData(codeData);
    
    // Calculate base XP
    const baseXP = calculateBaseXP({
      win,
      score,
      efficiency: state.metrics.availability * 100,
      time: timeUsed,
      difficulty: state.topology.difficulty,
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
        efficiency: state.metrics.availability * 100,
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
      gamesCompleted: updatedProgress.stats.topologiesCompleted,
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
    setChallengeCodeData(null);
    setScoreComparison(null);
    setAchievementIds([]);
    setPlayerScoreData(null);
    setAnalysis(null);
    setStartTime(null);
    setAutoAdvance(false);
  }, []);

  const rightPanel = gameState ? (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Tick</h3>
        <div className="text-lg font-bold">
          {gameState.currentTick} / {gameState.totalTicks}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-2">SLA Status</h3>
        <div className="text-sm space-y-1">
          <div>Latency: {gameState.metrics.averageLatency.toFixed(1)}ms / {gameState.slaTargets.maxLatency}ms</div>
          <div>Throughput: {gameState.metrics.throughput.toFixed(0)} / {gameState.slaTargets.minThroughput}</div>
          <div>Loss: {(gameState.metrics.packetLoss * 100).toFixed(2)}%</div>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Availability</h3>
        <div className={`text-lg font-bold ${
          gameState.metrics.availability >= 0.95 ? 'text-green-600' :
          gameState.metrics.availability >= 0.8 ? 'text-yellow-600' :
          'text-red-600'
        }`}>
          {(gameState.metrics.availability * 100).toFixed(1)}%
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
          <div className="text-center text-slate-600">Loading topology...</div>
        ) : status === "idle" ? (
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">{gameState.topology.name}</h2>
            <p className="text-slate-600">Design routing policies to meet SLA targets</p>
            <div className="space-y-2">
              <div><strong>Nodes:</strong> {gameState.topology.nodes.length}</div>
              <div><strong>Ticks:</strong> {gameState.totalTicks}</div>
              <div><strong>SLA Targets:</strong> Latency &lt;{gameState.slaTargets.maxLatency}ms, Throughput &gt;{gameState.slaTargets.minThroughput}</div>
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
            {/* Network Visualization (Simplified) */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Network Topology</h3>
              <div className="grid grid-cols-5 gap-2">
                {gameState.topology.nodes.map(node => (
                  <div
                    key={node.id}
                    className="p-2 border rounded text-center text-xs"
                  >
                    {node.name}
                  </div>
                ))}
              </div>
              <div className="mt-2 text-xs text-slate-600">
                Links: {gameState.topology.links.filter(l => !l.failed).length} active, {gameState.failures.length} failed
              </div>
            </div>

            {/* Metrics Panel */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Performance Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-slate-600">Latency</div>
                  <div className={`text-lg font-bold ${
                    gameState.metrics.averageLatency <= gameState.slaTargets.maxLatency ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {gameState.metrics.averageLatency.toFixed(1)}ms
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Throughput</div>
                  <div className={`text-lg font-bold ${
                    gameState.metrics.throughput >= gameState.slaTargets.minThroughput ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {gameState.metrics.throughput.toFixed(0)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Packet Loss</div>
                  <div className={`text-lg font-bold ${
                    gameState.metrics.packetLoss <= gameState.slaTargets.maxLoss ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {(gameState.metrics.packetLoss * 100).toFixed(2)}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Congestion</div>
                  <div className={`text-lg font-bold ${
                    gameState.metrics.congestionLevel < 0.7 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {(gameState.metrics.congestionLevel * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Routing Policy */}
            {status === "playing" && (
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Routing Policy</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePolicyChange({ type: 'shortest-path', parameters: {} })}
                    className={`px-3 py-2 rounded ${
                      gameState.routingPolicy.type === 'shortest-path' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    Shortest Path
                  </button>
                  <button
                    onClick={() => handlePolicyChange({ type: 'load-balanced', parameters: {} })}
                    className={`px-3 py-2 rounded ${
                      gameState.routingPolicy.type === 'load-balanced' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    Load Balanced
                  </button>
                  <button
                    onClick={() => handlePolicyChange({ type: 'resilient', parameters: {} })}
                    className={`px-3 py-2 rounded ${
                      gameState.routingPolicy.type === 'resilient' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    Resilient
                  </button>
                </div>
              </div>
            )}

            {/* Action Panel */}
            {status === "playing" && (
              <div className="flex gap-2">
                <button
                  onClick={handleAdvanceTick}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Advance Tick
                </button>
                <button
                  onClick={() => setAutoAdvance(!autoAdvance)}
                  className={`px-4 py-2 rounded-lg ${
                    autoAdvance 
                      ? 'bg-red-600 text-white' 
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {autoAdvance ? 'Stop Auto' : 'Auto Advance'}
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
                    Availability: {(gameState.metrics.availability * 100).toFixed(1)}%
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
