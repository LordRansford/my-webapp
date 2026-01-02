/**
 * Flow Planner - Main Game Component
 */

"use client";

import React, { useState, useCallback, useEffect } from "react";
import GameShell from "@/lib/games/framework/GameShell";
import type { GameConfig, GameStatus } from "@/lib/games/framework/types";
import type { FlowChallenge, FlowEdge } from "./types";
import { generateChallenge } from "./networkGenerator";
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
  id: "flow-planner",
  title: "Flow Planner",
  description: "Optimize flow through networks",
  category: "strategy",
  modes: ["solo", "daily"],
  supportsMultiplayer: false,
  minPlayers: 1,
  maxPlayers: 1,
  estimatedMinutes: 10,
  tutorialAvailable: true,
};

const GAME_ID = "flow-planner";

export default function FlowPlanner() {
  const [status, setStatus] = useState<GameStatus>("idle");
  const [challenge, setChallenge] = useState<FlowChallenge | null>(null);
  const [edgeFlows, setEdgeFlows] = useState<Record<string, number>>({});
  const [totalFlow, setTotalFlow] = useState<number>(0);
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

  useEffect(() => {
    if (challenge && status === "playing") {
      calculateFlow();
    }
  }, [edgeFlows, challenge, status]);

  const initializeChallenge = useCallback(() => {
    try {
      const dailyChallenge = getOrGenerateTodayChallenge(GAME_ID);
      const generated = generateChallenge({
        seed: dailyChallenge.seed,
        difficulty: "planner",
      });
      setChallenge(generated);
      
      // Initialize edge flows
      const flows: Record<string, number> = {};
      for (const edge of generated.network.edges) {
        flows[edge.id] = 0;
      }
      setEdgeFlows(flows);
      setTotalFlow(0);
      setFinalScore(null);
    } catch (error) {
      console.error("Error initializing challenge:", error);
    }
  }, []);

  const calculateFlow = useCallback(() => {
    if (!challenge) return;
    
    // Simple flow calculation: sum flows from source
    let flow = 0;
    for (const edge of challenge.network.edges) {
      if (edge.from === challenge.network.source) {
        flow += edgeFlows[edge.id] || 0;
      }
    }
    
    setTotalFlow(flow);
  }, [challenge, edgeFlows]);

  const handleEdgeFlowChange = useCallback((edgeId: string, newFlow: number) => {
    if (status !== "playing" || !challenge) return;
    
    const edge = challenge.network.edges.find(e => e.id === edgeId);
    if (!edge) return;
    
    // Clamp flow to edge capacity
    const clampedFlow = Math.max(0, Math.min(edge.capacity, newFlow));
    
    setEdgeFlows(prev => ({
      ...prev,
      [edgeId]: clampedFlow,
    }));
  }, [status, challenge]);

  const calculateEfficiency = useCallback((): number => {
    if (!challenge) return 0;
    
    // Efficiency based on how close to target flow
    const diff = Math.abs(totalFlow - challenge.network.targetFlow);
    const maxDiff = challenge.network.targetFlow;
    const efficiency = Math.max(0, 100 - (diff / maxDiff) * 100);
    
    return efficiency;
  }, [challenge, totalFlow]);

  const handleSubmit = useCallback(() => {
    if (!challenge || !startTime) return;

    const efficiency = calculateEfficiency();
    setFinalScore(efficiency);
    setStatus("finished");

    const codeData = generateTodayChallengeCode(GAME_ID, challenge.seed);
    storeChallengeCode(codeData);
    setChallengeCodeData(codeData);

    const timeUsed = Date.now() - startTime;
    const scoreData = {
      score: efficiency,
      time: timeUsed,
      scoreValue: efficiency,
      timestamp: Date.now(),
    };
    
    setPlayerScoreData(scoreData);
    submitScore(codeData.code, scoreData);
    const comparison = getScoreComparison(codeData.code, scoreData);
    setScoreComparison(comparison);

    completeTodayChallenge(GAME_ID, {
      score: efficiency,
      time: timeUsed,
      scoreValue: efficiency,
    });

    updateStreakForGame(GAME_ID, true);

    const streakData = getStreakDataForGame(GAME_ID);
    const achievementResult = checkAndUnlockAchievements({
      gameId: GAME_ID,
      currentStreak: streakData.currentStreak,
      gamesCompleted: 1,
    });
    setAchievementIds(achievementResult.newlyUnlocked);
  }, [challenge, startTime, calculateEfficiency]);

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
      setChallengeCodeData(null);
      setScoreComparison(null);
      setPlayerScoreData(null);
      setAchievementIds([]);
    setEdgeFlows({});
    setTotalFlow(0);
  }, []);

  const rightPanel = challenge ? (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Target Flow</h3>
        <div className="text-2xl font-bold text-blue-600">
          {challenge.network.targetFlow}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Current Flow</h3>
        <div className={`text-2xl font-bold ${
          Math.abs(totalFlow - challenge.network.targetFlow) < 1
            ? "text-green-600"
            : "text-slate-600"
        }`}>
          {totalFlow.toFixed(1)}
        </div>
      </div>
      {finalScore !== null && (
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Efficiency</h3>
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
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Start Challenge
            </button>
          </div>
        ) : status === "playing" || status === "finished" ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Flow Network */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Network</h3>
              <div className="space-y-4">
                {challenge.network.edges.map(edge => {
                  const flow = edgeFlows[edge.id] || 0;
                  const fromNode = challenge.network.nodes.find(n => n.id === edge.from);
                  const toNode = challenge.network.nodes.find(n => n.id === edge.to);
                  
                  return (
                    <div key={edge.id} className="flex items-center gap-4 p-4 border border-slate-300 rounded-lg">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-900">
                          {fromNode?.label} → {toNode?.label}
                        </div>
                        <div className="text-xs text-slate-600">
                          Capacity: {edge.capacity}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max={edge.capacity}
                          value={flow}
                          onChange={(e) => handleEdgeFlowChange(edge.id, Number(e.target.value))}
                          disabled={status === "finished"}
                          className="w-32"
                        />
                        <span className="w-12 text-right font-medium">
                          {flow.toFixed(0)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            {status === "playing" && (
              <button
                onClick={handleSubmit}
                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Submit Solution
              </button>
            )}

            {/* Results */}
            {status === "finished" && finalScore !== null && challengeCodeData && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">
                    Efficiency: {finalScore.toFixed(1)}%
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
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
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