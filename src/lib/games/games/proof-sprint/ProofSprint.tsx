/**
 * Proof Sprint - Main Game Component
 */

"use client";

import React, { useState, useCallback, useEffect } from "react";
import GameShell from "@/lib/games/framework/GameShell";
import type { GameConfig, GameStatus } from "@/lib/games/framework/types";
import type { GameState, Move, Statement } from "./types";
import { generatePuzzle } from "./puzzleGenerator";
import { initializeGameState, startGame, executeMove, checkWinCondition } from "./gameState";
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
import { getMoveDefinitions } from "./moveDefinitions";

const GAME_CONFIG: GameConfig = {
  id: "proof-sprint",
  title: "Proof Sprint",
  description: "Build correct mathematical proofs under step constraints",
  category: "logic",
  modes: ["solo", "daily"],
  supportsMultiplayer: false,
  minPlayers: 1,
  maxPlayers: 1,
  estimatedMinutes: 10,
  tutorialAvailable: true,
};

const GAME_ID = "proof-sprint";

export default function ProofSprint() {
  const [status, setStatus] = useState<GameStatus>("idle");
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);
  const [selectedStatements, setSelectedStatements] = useState<string[]>([]);
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
      const puzzle = generatePuzzle({
        seed: dailyChallenge.seed,
        topicTrack: 'algebra',
        difficulty: 'student',
      });
      const state = initializeGameState(puzzle, dailyChallenge.seed);
      setGameState(state);
      setSelectedMove(null);
      setSelectedStatements([]);
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

  const handleMoveSelect = useCallback((move: Move) => {
    if (status !== "playing" || !gameState) return;
    setSelectedMove(move);
    setSelectedStatements([]);
  }, [status, gameState]);

  const handleStatementSelect = useCallback((statementId: string) => {
    if (status !== "playing" || !gameState || !selectedMove) return;
    
    setSelectedStatements(prev => {
      if (prev.includes(statementId)) {
        return prev.filter(id => id !== statementId);
      }
      return [...prev, statementId];
    });
  }, [status, gameState, selectedMove]);

  const handleExecuteMove = useCallback(() => {
    if (!gameState || !selectedMove || selectedStatements.length === 0 || status !== "playing") return;
    
    const newState = executeMove(gameState, selectedMove, selectedStatements);
    setGameState(newState);
    setSelectedMove(null);
    setSelectedStatements([]);
    
    if (newState.status === 'finished') {
      setStatus("finished");
      handleGameComplete(newState);
    }
  }, [gameState, selectedMove, selectedStatements, status]);

  const handleGameComplete = useCallback((state: GameState) => {
    if (!state.outcome || !startTime) return;
    
    const timeUsed = Date.now() - startTime;
    const win = state.outcome === 'win';
    const elegance = state.elegance || 0;
    
    // Calculate score
    const stepEfficiency = 1 - (state.stepCount / state.puzzle.maxSteps);
    const score = win
      ? Math.round((stepEfficiency * 50 + elegance * 5) * (1 - state.penalty))
      : Math.round(stepEfficiency * 30);
    
    // Generate challenge code
    const codeData = generateTodayChallengeCode(GAME_ID, state.seed);
    storeChallengeCode(codeData);
    setChallengeCodeData(codeData);
    
    // Calculate base XP
    const baseXP = calculateBaseXP({
      win,
      score,
      efficiency: stepEfficiency * 100,
      time: timeUsed,
      difficulty: state.puzzle.difficulty,
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
        steps: state.stepCount,
        elegance,
        time: timeUsed,
      },
      streak: streakData.currentStreak,
      tier: getProgress().currentTier,
    });
    const rewardResult = generateRewardResult(rewardContext);
    
    // Update progress
    const progress = getProgress();
    const updatedProgress = updateProgressAfterGame(progress, state, score, elegance);
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
      gamesCompleted: updatedProgress.stats.puzzlesSolved,
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
    setSelectedMove(null);
    setSelectedStatements([]);
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
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Steps</h3>
        <div className="text-lg font-bold">
          {gameState.stepCount} / {gameState.puzzle.maxSteps}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Penalty</h3>
        <div className="text-lg font-bold text-red-600">
          {gameState.penalty.toFixed(2)}
        </div>
      </div>
      {gameState.hintTokens > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Hints</h3>
          <div className="text-lg font-bold">
            {gameState.hintTokens}
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
          <div className="text-center text-slate-600">Loading puzzle...</div>
        ) : status === "idle" ? (
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">{gameState.puzzle.name}</h2>
            <p className="text-slate-600">{gameState.puzzle.description}</p>
            <div className="space-y-2">
              <div><strong>Target:</strong> {gameState.puzzle.targetStatement.expression}</div>
              <div><strong>Max Steps:</strong> {gameState.puzzle.maxSteps}</div>
              <div><strong>Hints:</strong> {gameState.puzzle.hintTokens}</div>
            </div>
            <button
              onClick={handleStart}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Start Proof
            </button>
          </div>
        ) : status === "playing" || status === "finished" ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Target Statement */}
            <div className="rounded-xl border-2 border-blue-300 bg-blue-50 p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Target</h3>
              <div className="text-lg font-mono font-bold text-blue-900">
                {gameState.puzzle.targetStatement.expression}
              </div>
            </div>

            {/* Current Statements */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Current Statements</h3>
              <div className="space-y-2">
                {gameState.currentStatements.map((statement, idx) => (
                  <div
                    key={statement.id}
                    className={`p-2 border rounded ${
                      selectedStatements.includes(statement.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-mono text-sm">
                        {statement.stepNumber && `Step ${statement.stepNumber}: `}
                        {statement.expression}
                      </div>
                      {status === "playing" && selectedMove && (
                        <button
                          onClick={() => handleStatementSelect(statement.id)}
                          className="px-2 py-1 text-xs bg-blue-100 rounded hover:bg-blue-200"
                        >
                          {selectedStatements.includes(statement.id) ? 'Selected' : 'Select'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Moves */}
            {status === "playing" && (
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Available Moves</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {gameState.puzzle.availableMoves.map(move => {
                    const canApply = move.applicable(gameState.currentStatements);
                    return (
                      <button
                        key={move.id}
                        onClick={() => handleMoveSelect(move)}
                        disabled={!canApply}
                        className={`p-3 border-2 rounded-lg text-left ${
                          selectedMove?.id === move.id
                            ? 'border-blue-500 bg-blue-50'
                            : canApply
                            ? 'border-slate-300 hover:border-blue-300'
                            : 'border-slate-200 bg-slate-50 opacity-50'
                        }`}
                      >
                        <div className="font-semibold text-slate-900">{move.name}</div>
                        <div className="text-xs text-slate-600">{move.description}</div>
                        {move.penalty > 0 && (
                          <div className="text-xs text-red-600">Penalty: {move.penalty}</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Execute Button */}
            {status === "playing" && selectedMove && selectedStatements.length > 0 && (
              <button
                onClick={handleExecuteMove}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Execute {selectedMove.name}
              </button>
            )}

            {/* Results */}
            {status === "finished" && challengeCodeData && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${
                    gameState.outcome === 'win' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {gameState.outcome === 'win' ? 'Proof Complete!' : 'Failed'}
                  </div>
                  {gameState.elegance !== undefined && (
                    <div className="text-sm text-slate-600">
                      Elegance: {gameState.elegance.toFixed(1)}/10 | Steps: {gameState.stepCount}
                    </div>
                  )}
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
