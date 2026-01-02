/**
 * Daily Logic Gauntlet - Enhanced Version
 * 
 * Gold-standard implementation with:
 * - Player capability modeling
 * - Adaptive difficulty
 * - Persistence with versioning
 * - Progression and mastery system
 * - Streak tracking
 * - Daily seed integration
 */

"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import GameShell from "@/lib/games/framework/GameShell";
import {
  getDailySeed,
  StateManager,
  PersistenceManager,
  createDefaultPlayerModel,
  AdaptiveDifficultyEngine,
  type PlayerCapabilityModel,
  type PlayerProfile,
} from "@/lib/games/framework";
import { useGameAnalytics } from "@/lib/games/framework/useGameAnalytics";
import type { GameConfig, GameStatus } from "@/lib/games/framework/types";
import type { Puzzle, PuzzlePerformance, DifficultyTier } from './types';
import { generateDailyPuzzleSet } from './puzzleGenerator';
import {
  calculateSessionXP,
  getTierFromXP,
  getTierProgress,
  getNextTier,
  type MasteryTier,
} from './progression';
import {
  updateStreak,
  getTodayDateString,
  createDefaultStreak,
  type StreakData,
} from './streakTracker';
import { generateAnalysisReport, type AnalysisReport } from './analysisReport';
import { AnalysisReportComponent } from './AnalysisReportComponent';
import { archivePuzzleSet, getArchiveStats, type ArchiveStats } from './archive';
import {
  loadTutorialState,
  createDefaultTutorialState,
  startTutorial,
  nextTutorialStep,
  previousTutorialStep,
  getCurrentTutorialStep,
  skipTutorial,
  shouldShowTutorial,
  TUTORIAL_STEPS,
  type TutorialState,
  type TutorialStepData,
} from './tutorial';
import {
  checkAndUnlockAchievements,
  getUnlockedAchievements,
  getAchievementStats,
  ALL_ACHIEVEMENTS,
  type Achievement,
  type AchievementStats,
} from './achievements';

const GAME_CONFIG: GameConfig = {
  id: "daily-logic-gauntlet",
  title: "Daily Logic Gauntlet",
  description: "Multi-puzzle challenge with daily seeded challenges. Same seed for all users on the same day.",
  category: "puzzle",
  modes: ["solo", "daily"],
  supportsMultiplayer: false,
  minPlayers: 1,
  maxPlayers: 1,
  estimatedMinutes: 15,
  tutorialAvailable: true,
};

export default function DailyLogicGauntletEnhanced() {
  // Game state
  const [status, setStatus] = useState<GameStatus>("idle");
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hintsUsed, setHintsUsed] = useState<number[]>([]); // Per puzzle
  const [performances, setPerformances] = useState<PuzzlePerformance[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [puzzleStartTime, setPuzzleStartTime] = useState<number | null>(null);
  
  // Player data
  const [playerXP, setPlayerXP] = useState<number>(0);
  const [playerModel, setPlayerModel] = useState<PlayerCapabilityModel>(createDefaultPlayerModel());
  const [streakData, setStreakData] = useState<StreakData>(createDefaultStreak());
  const [analysisReport, setAnalysisReport] = useState<AnalysisReport | null>(null);
  
  // Tutorial state - only load on client side
  const [tutorialState, setTutorialState] = useState<TutorialState>(() => {
    if (typeof window === 'undefined') {
      return createDefaultTutorialState();
    }
    return loadTutorialState();
  });
  const [showTutorial, setShowTutorial] = useState(false);
  const currentTutorialStep = useMemo(() => getCurrentTutorialStep(tutorialState), [tutorialState]);
  
  // Achievement notifications
  const [newlyUnlockedAchievements, setNewlyUnlockedAchievements] = useState<Achievement[]>([]);
  
  // Daily seed
  const dailySeed = useMemo(() => getDailySeed(), []);
  const today = useMemo(() => getTodayDateString(), []);
  
  // Framework systems
  const stateManager = useMemo(() => new StateManager({ status: "idle" }, dailySeed), [dailySeed]);
  const persistenceManager = useMemo(() => new PersistenceManager(GAME_CONFIG.id), []);
  const adaptiveDifficulty = useMemo(
    () => new AdaptiveDifficultyEngine(playerModel),
    [playerModel]
  );
  
  // Load player data on mount
  useEffect(() => {
    async function loadPlayerData() {
      const profile = await persistenceManager.loadPlayerProfile();
      if (profile) {
        const gameXP = profile.mastery[GAME_CONFIG.id]?.xp || 0;
        setPlayerXP(gameXP);
        // Load player model from profile if available
        if (profile.mastery[GAME_CONFIG.id]?.playerModel) {
          setPlayerModel(profile.mastery[GAME_CONFIG.id].playerModel as PlayerCapabilityModel);
        }
      }
      
      // Load streak data (simplified - in production would be in profile)
      const savedStreak = localStorage.getItem('daily-logic-gauntlet-streak');
      if (savedStreak) {
        try {
          setStreakData(JSON.parse(savedStreak));
        } catch (e) {
          // Invalid data, use default
        }
      }
    }
    
    loadPlayerData();
  }, [persistenceManager]);
  
  // Save streak data
  useEffect(() => {
    localStorage.setItem('daily-logic-gauntlet-streak', JSON.stringify(streakData));
  }, [streakData]);
  
  // Check if tutorial should be shown on mount
  useEffect(() => {
    if (shouldShowTutorial() && status === 'idle') {
      const state = startTutorial();
      setTutorialState(state);
      setShowTutorial(true);
    }
  }, [status]);
  
  // Generate puzzles for daily challenge
  const generatePuzzles = useCallback(() => {
    const tier = getTierFromXP(playerXP);
    const generated = generateDailyPuzzleSet(dailySeed, tier, 10);
    setPuzzles(generated);
    return generated;
  }, [dailySeed, playerXP]);
  
  // Start game
  const handleStart = useCallback(() => {
    const newPuzzles = generatePuzzles();
    setStatus("playing");
    setCurrentPuzzleIndex(0);
    setSelectedAnswer(null);
    setHintsUsed(new Array(newPuzzles.length).fill(0));
    setPerformances([]);
    setSessionStartTime(Date.now());
    setPuzzleStartTime(Date.now());
    stateManager.updateState({ status: "playing", timestamp: Date.now() });
    stateManager.recordMove("start", { seed: dailySeed, date: today });
  }, [generatePuzzles, dailySeed, today, stateManager]);
  
  // Finish game
  const handleFinish = useCallback(async () => {
    setStatus("finished");
    
    // Calculate XP
    const sessionXP = calculateSessionXP(
      performances.length > 0 ? performances : [],
      hintsUsed,
      streakData.currentStreak
    );
    const newXP = playerXP + sessionXP;
    setPlayerXP(newXP);
    
    // Generate analysis report
    if (puzzles.length > 0 && performances.length > 0) {
      const report = generateAnalysisReport(
        puzzles,
        performances,
        hintsUsed,
        sessionXP,
        playerXP
      );
      setAnalysisReport(report);
    }
    
    // Update streak
    const updatedStreak = updateStreak(streakData, true);
    setStreakData(updatedStreak);
    
    // Archive the completed puzzle set
    if (puzzles.length > 0 && performances.length > 0) {
      const totalTimeSpent = performances.reduce((sum, p) => sum + p.timeSpent, 0);
      const archiveScore = performances.filter(p => p.correct).length;
      archivePuzzleSet(puzzles, archiveScore, totalTimeSpent, newXP);
    }
    
    // Check and unlock achievements
    const archiveStats = getArchiveStats();
    let profile: PlayerProfile | null = null;
    try {
      profile = await persistenceManager.loadPlayerProfile();
    } catch (error) {
      // Will create new profile below
    }
    
    if (!profile) {
      profile = persistenceManager.createDefaultProfile();
    }
    
    const mastery = profile.mastery[GAME_CONFIG.id];
    const achievementContext = {
      totalXP: newXP,
      currentTier: getTierFromXP(newXP),
      currentStreak: updatedStreak.currentStreak,
      gamesCompleted: (mastery?.stats?.gamesPlayed || 0) + 1,
      perfectScores: performances.every(p => p.correct) ? 1 : 0,
      archivedSets: archiveStats.totalArchived + (puzzles.length > 0 ? 1 : 0),
      fastestCompletion: performances.reduce((sum, p) => sum + p.timeSpent, 0),
      hintFreeCompletions: hintsUsed.length === 0 || hintsUsed.every(h => h === 0) ? 1 : 0,
    };
    
    const newlyUnlockedIds = checkAndUnlockAchievements(achievementContext);
    if (newlyUnlockedIds && newlyUnlockedIds.length > 0) {
      const unlocked = newlyUnlockedIds.map(id => {
        const ach = ALL_ACHIEVEMENTS.find(a => a.id === id);
        return ach!;
      }).filter(Boolean);
      setNewlyUnlockedAchievements(unlocked);
    }
    
    // Save progress
    try {
      const currentStats = mastery?.stats || {
        gamesPlayed: 0,
        wins: 0,
        bestScore: 0,
        averageScore: 0,
      };
      
      profile.mastery[GAME_CONFIG.id] = {
        tier: getTierFromXP(newXP),
        xp: newXP,
        unlocks: mastery?.unlocks || [],
        stats: {
          gamesPlayed: currentStats.gamesPlayed + 1,
          wins: currentStats.wins + (performances.length > 0 && performances.every(p => p.correct) ? 1 : 0),
          bestScore: Math.max(currentStats.bestScore, performances.filter(p => p.correct).length),
          averageScore: currentStats.gamesPlayed > 0
            ? (currentStats.averageScore * (currentStats.gamesPlayed - 1) + performances.filter(p => p.correct).length) / currentStats.gamesPlayed
            : performances.filter(p => p.correct).length,
        },
        playerModel: playerModel,
      };
      profile.lastPlayed[GAME_CONFIG.id] = Date.now();
      await persistenceManager.savePlayerProfile(profile);
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
    
    stateManager.updateState({ status: "finished" });
  }, [performances, hintsUsed, streakData, playerXP, puzzles, persistenceManager, stateManager, playerModel]);
  
  // Handle answer selection
  const handleAnswer = useCallback(
    (answerIndex: number) => {
      if (status !== "playing" || selectedAnswer !== null) return;
      
      const puzzle = puzzles[currentPuzzleIndex];
      if (!puzzle) return;
      
      const timeSpent = puzzleStartTime ? Date.now() - puzzleStartTime : 0;
      const isCorrect = answerIndex === puzzle.correctAnswer;
      const currentHints = hintsUsed[currentPuzzleIndex] || 0;
      
      // Record performance
      const performance: PuzzlePerformance = {
        puzzleId: puzzle.id,
        correct: isCorrect,
        timeSpent,
        attempts: 1, // Simplified - would track retries
        hintsUsed: currentHints,
        timestamp: Date.now(),
      };
      
      // Update adaptive difficulty
      adaptiveDifficulty.update({
        ...performance,
        puzzleType: puzzle.type,
        difficulty: puzzle.difficulty,
      });
      
      // Update player model
      const newModel = adaptiveDifficulty.getModel();
      setPlayerModel(newModel);
      
      // Record move
      stateManager.recordMove("answer", {
        puzzleId: puzzle.id,
        answerIndex,
        isCorrect,
        timeSpent,
      });
      
      setSelectedAnswer(answerIndex);
      setPerformances(prev => [...prev, performance]);
      
      // Move to next puzzle after delay
      setTimeout(() => {
        if (currentPuzzleIndex < puzzles.length - 1) {
          setCurrentPuzzleIndex(currentPuzzleIndex + 1);
          setSelectedAnswer(null);
          setPuzzleStartTime(Date.now());
        } else {
          // Game finished
          handleFinish();
        }
      }, 2000);
    },
    [
      status,
      currentPuzzleIndex,
      puzzles,
      selectedAnswer,
      hintsUsed,
      puzzleStartTime,
      adaptiveDifficulty,
      stateManager,
      handleFinish,
    ]
  );
  
  // Handle hint request
  const handleHint = useCallback(() => {
    if (status !== "playing" || selectedAnswer !== null) return;
    
    const currentHints = hintsUsed[currentPuzzleIndex] || 0;
    if (currentHints >= 3) return; // Max 3 hints per puzzle
    
    setHintsUsed(prev => {
      const newHints = [...prev];
      newHints[currentPuzzleIndex] = currentHints + 1;
      return newHints;
    });
    
    stateManager.recordMove("hint", { puzzleId: puzzles[currentPuzzleIndex]?.id });
  }, [status, currentPuzzleIndex, hintsUsed, puzzles, selectedAnswer, stateManager]);
  
  // Reset game
  const handleReset = useCallback(() => {
    setStatus("idle");
    setCurrentPuzzleIndex(0);
    setSelectedAnswer(null);
    setPuzzles([]);
    setHintsUsed([]);
    setPerformances([]);
    setSessionStartTime(null);
    setPuzzleStartTime(null);
    setAnalysisReport(null);
    setNewlyUnlockedAchievements([]);
    stateManager.updateState({ status: "idle", moves: [], score: 0 });
    adaptiveDifficulty.reset();
  }, [stateManager, adaptiveDifficulty]);
  
  // Tutorial handlers
  const handleTutorialNext = useCallback(() => {
    setTutorialState(prev => nextTutorialStep(prev));
  }, []);
  
  const handleTutorialPrevious = useCallback(() => {
    setTutorialState(prev => previousTutorialStep(prev));
  }, []);
  
  const handleTutorialSkip = useCallback(() => {
    skipTutorial();
    setShowTutorial(false);
    setTutorialState(prev => ({ ...prev, isActive: false }));
  }, []);
  
  const handleStartTutorial = useCallback(() => {
    const state = startTutorial();
    setTutorialState(state);
    setShowTutorial(true);
  }, []);
  
  // Current puzzle
  const currentPuzzle = puzzles[currentPuzzleIndex];
  const currentTier = getTierFromXP(playerXP);
  const tierProgress = getTierProgress(playerXP);
  const nextTier = getNextTier(playerXP);
  
  // Score calculation
  const score = performances.filter(p => p.correct).length;
  const totalXP = playerXP;
  const hintsRemaining = 3 - (hintsUsed[currentPuzzleIndex] || 0);
  
  // Analytics
  useGameAnalytics(GAME_CONFIG.id, status, stateManager.getState());
  
  // Keyboard navigation
  useEffect(() => {
    if (status !== "playing") return;
    
    const handleKeyPress = (e: KeyboardEvent) => {
      if (selectedAnswer !== null) return;
      
      const key = e.key;
      // Number keys 1-4 for answer selection
      if (key >= "1" && key <= "4") {
        const index = parseInt(key) - 1;
        if (currentPuzzle && index < currentPuzzle.options.length) {
          e.preventDefault();
          handleAnswer(index);
        }
      }
      // H for hint
      if (key === "h" || key === "H") {
        e.preventDefault();
        handleHint();
      }
    };
    
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [status, selectedAnswer, currentPuzzle, handleAnswer, handleHint]);
  
  return (
    <>
      {/* Achievement Notification */}
      {newlyUnlockedAchievements.length > 0 && (
        <div className="fixed top-4 right-4 z-50 max-w-sm space-y-2">
          {newlyUnlockedAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className="rounded-lg border-2 border-amber-400 bg-amber-50 p-4 shadow-lg"
              role="alert"
              aria-live="polite"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl flex-shrink-0" aria-hidden="true">
                  {achievement.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-amber-900 text-sm">
                    Achievement Unlocked!
                  </div>
                  <div className="font-bold text-amber-950 text-base">
                    {achievement.name}
                  </div>
                  <div className="text-sm text-amber-800 mt-1">
                    {achievement.description}
                  </div>
                  <div className="mt-1 text-xs text-amber-700 capitalize">
                    {achievement.rarity}
                  </div>
                </div>
                <button
                  onClick={() => setNewlyUnlockedAchievements(prev => prev.filter(a => a.id !== achievement.id))}
                  className="text-amber-600 hover:text-amber-800 flex-shrink-0"
                  aria-label="Dismiss notification"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Tutorial Overlay */}
      {showTutorial && currentTutorialStep && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tutorial-title"
        >
          <div className="mx-4 max-w-2xl w-full rounded-lg bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 id="tutorial-title" className="text-2xl font-bold text-slate-900 mb-4">
              {currentTutorialStep.title}
            </h2>
            <div className="text-slate-700 whitespace-pre-line mb-6">
              {currentTutorialStep.content}
            </div>
            
            {currentTutorialStep.interactive && currentTutorialStep.actions && (
              <div className="mb-6 rounded-lg bg-sky-50 border border-sky-200 p-4">
                <div className="text-sm font-semibold text-sky-900 mb-2">
                  Try this:
                </div>
                <ul className="space-y-1">
                  {currentTutorialStep.actions.map((action, i) => (
                    <li key={i} className="text-sm text-sky-800">
                      • {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="text-sm text-slate-500">
                Step {tutorialState.currentStep + 1} of {TUTORIAL_STEPS.length}
              </div>
              <div className="flex gap-2">
                {tutorialState.currentStep > 0 && (
                  <button
                    onClick={handleTutorialPrevious}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                  >
                    Previous
                  </button>
                )}
                <button
                  onClick={handleTutorialSkip}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  Skip
                </button>
                <button
                  onClick={handleTutorialNext}
                  className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  {tutorialState.currentStep < TUTORIAL_STEPS.length - 1
                    ? 'Next'
                    : 'Start Playing'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <GameShell
        config={GAME_CONFIG}
        status={status}
        onStart={status === "idle" ? handleStart : undefined}
        onReset={handleReset}
      rightPanel={
        <div className="space-y-4">
          {/* Progress */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Progress</h3>
            <div className="text-2xl font-bold text-slate-900">
              {status === "playing" ? currentPuzzleIndex + 1 : 0} / {puzzles.length || 10}
            </div>
            {status === "playing" && (
              <div className="mt-2 text-sm text-slate-600">
                Score: {score} / {currentPuzzleIndex + 1}
              </div>
            )}
          </div>
          
          {/* Tier Progress */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Mastery</h3>
            <div className="text-sm text-slate-700 mb-1">
              {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}
            </div>
            {nextTier && (
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-sky-600 h-2 rounded-full transition-all"
                  style={{ width: `${tierProgress * 100}%` }}
                  role="progressbar"
                  aria-valuenow={tierProgress * 100}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            )}
            <div className="text-xs text-slate-500 mt-1">
              {totalXP} XP
            </div>
          </div>
          
          {/* Streak */}
          {streakData.currentStreak > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Streak</h3>
              <div className="text-lg font-bold text-slate-900">
                {streakData.currentStreak} days
              </div>
            </div>
          )}
          
          {/* Hints */}
          {status === "playing" && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Hints</h3>
              <div className="text-sm text-slate-700">
                {hintsRemaining} remaining
              </div>
              <button
                onClick={handleHint}
                disabled={hintsRemaining === 0 || selectedAnswer !== null}
                className="mt-2 px-4 py-2 text-sm bg-slate-100 text-slate-700 rounded hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[44px] min-w-[44px]"
                aria-label={`Use hint. ${hintsRemaining} hints remaining.`}
              >
                Use Hint (H)
              </button>
            </div>
          )}
        </div>
      }
    >
      {status === "idle" && (
        <div className="text-center py-8 sm:py-12" role="region" aria-label="Game introduction">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-4">Daily Logic Gauntlet</h2>
          <p className="text-slate-600 mb-4 text-sm sm:text-base">Ready to start today&apos;s challenge?</p>
          <p className="text-xs sm:text-sm text-slate-500 mb-2 break-all">
            Today&apos;s seed: <span className="font-mono">{dailySeed}</span>
          </p>
          <p className="text-xs text-slate-400 mt-4 px-2">
            Use number keys (1-4) or tap to select answers. Press H for hint.
          </p>
        </div>
      )}
      
      {status === "playing" && currentPuzzle && (
        <div className="space-y-6">
          {/* Puzzle */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-1 text-xs font-medium bg-sky-100 text-sky-700 rounded">
                {currentPuzzle.type}
              </span>
              <span className="text-sm text-slate-500">
                Puzzle {currentPuzzleIndex + 1} of {puzzles.length}
              </span>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-4 break-words">
              {currentPuzzle.question}
            </h2>
          </div>
          
          {/* Answer Options */}
          <div
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
            role="radiogroup"
            aria-label="Answer options"
          >
            {currentPuzzle.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentPuzzle.correctAnswer;
              const showResult = selectedAnswer !== null;
              
              let bgColor = "bg-white border-slate-200 hover:bg-slate-50";
              if (showResult) {
                if (isCorrect) {
                  bgColor = "bg-emerald-100 border-emerald-300";
                } else if (isSelected && !isCorrect) {
                  bgColor = "bg-rose-100 border-rose-300";
                }
              }
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                  className={`rounded-lg border-2 p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${bgColor} ${
                    selectedAnswer !== null ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                  }`}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`Option ${index + 1}: ${option}${showResult ? (isCorrect ? ". Correct answer" : isSelected ? ". Incorrect answer" : "") : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-700" aria-hidden="true">
                      {index + 1}.
                    </span>
                    <span className="text-slate-900 flex-1">{option}</span>
                    {showResult && isCorrect && (
                      <span className="text-emerald-700 font-semibold" aria-label="Correct">
                        ✓
                      </span>
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <span className="text-rose-700 font-semibold" aria-label="Incorrect">
                        ✗
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Explanation */}
          {selectedAnswer !== null && (
            <div className="rounded-lg bg-sky-50 border border-sky-200 p-4" role="region" aria-live="polite">
              <p className="text-sm font-medium text-sky-900 mb-2">Explanation</p>
              <p className="text-sm text-sky-800">{currentPuzzle.explanation}</p>
            </div>
          )}
        </div>
      )}
      
      {status === "finished" && (
        <div className="space-y-6">
          <div className="text-center py-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Challenge Complete!</h2>
            <p className="text-xl text-slate-600 mb-4">
              Score: {score} / {puzzles.length}
            </p>
            {performances.length > 0 && (
              <p className="text-sm text-slate-500">
                XP Gained: {calculateSessionXP(performances, hintsUsed, streakData.currentStreak)}
              </p>
            )}
          </div>
          
          {/* Analysis Report */}
          {analysisReport && (
            <AnalysisReportComponent report={analysisReport} />
          )}
        </div>
      )}
      </GameShell>
    </>
  );
}
