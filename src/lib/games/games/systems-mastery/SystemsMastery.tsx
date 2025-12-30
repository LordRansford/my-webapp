/**
 * Systems Mastery Game
 * 
 * Flagship game for understanding complex systems
 * Educational game that teaches systems thinking
 */

"use client";

import React, { useState, useCallback, useMemo } from "react";
import GameShell from "@/lib/games/framework/GameShell";
import { StateManager } from "@/lib/games/framework/StateManager";
import { DifficultyEngine } from "@/lib/games/framework/DifficultyEngine";
import { ExplainabilityEngine } from "@/lib/games/framework/ExplainabilityEngine";
import { useGameAnalytics } from "@/lib/games/framework/useGameAnalytics";
import type { GameConfig, GameStatus, GameAnalysis } from "@/lib/games/framework/types";

const GAME_CONFIG: GameConfig = {
  id: "systems-mastery",
  title: "Systems Mastery Game",
  description: "Flagship game for understanding complex systems. Learn systems thinking through interactive scenarios.",
  category: "educational",
  modes: ["solo", "campaign"],
  supportsMultiplayer: false,
  minPlayers: 1,
  maxPlayers: 1,
  estimatedMinutes: 30,
  tutorialAvailable: true,
};

interface SystemComponent {
  id: string;
  name: string;
  type: "input" | "process" | "output" | "feedback";
  connections: string[];
  state: "healthy" | "degraded" | "failed";
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  components: SystemComponent[];
  challenge: string;
  solution: string[];
}

const SCENARIOS: Scenario[] = [
  {
    id: "1",
    title: "Simple Pipeline",
    description: "A basic input-process-output system",
    components: [
      { id: "input", name: "Data Input", type: "input", connections: ["process"], state: "healthy" },
      { id: "process", name: "Processor", type: "process", connections: ["output"], state: "healthy" },
      { id: "output", name: "Data Output", type: "output", connections: [], state: "healthy" },
    ],
    challenge: "Identify what happens if the processor fails",
    solution: ["process"],
  },
  {
    id: "2",
    title: "Feedback Loop",
    description: "A system with feedback control",
    components: [
      { id: "input", name: "Input", type: "input", connections: ["process"], state: "healthy" },
      { id: "process", name: "Processor", type: "process", connections: ["output", "feedback"], state: "healthy" },
      { id: "output", name: "Output", type: "output", connections: [], state: "healthy" },
      { id: "feedback", name: "Feedback", type: "feedback", connections: ["process"], state: "healthy" },
    ],
    challenge: "What happens if feedback is delayed?",
    solution: ["feedback"],
  },
];

export default function SystemsMastery() {
  const [status, setStatus] = useState<GameStatus>("idle");
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [analysis, setAnalysis] = useState<GameAnalysis | null>(null);

  const seed = useMemo(() => Math.floor(Math.random() * 1000000), []);
  const stateManager = useMemo(() => new StateManager({ status: "idle" }, seed), [seed]);
  const difficultyEngine = useMemo(
    () =>
      new DifficultyEngine({
        initial: 0.3,
        target: 0.9,
        rampTime: 1800000, // 30 minutes
        adaptive: true,
      }),
    []
  );
  const explainabilityEngine = useMemo(() => new ExplainabilityEngine(), []);

  // Analytics
  useGameAnalytics(GAME_CONFIG.id, status, stateManager.getState());

  const currentScenarioData = SCENARIOS[currentScenario];

  const handleComponentClick = useCallback(
    (componentId: string) => {
      if (status !== "playing") return;

      setSelectedComponents((prev) => {
        if (prev.includes(componentId)) {
          return prev.filter((id) => id !== componentId);
        }
        return [...prev, componentId];
      });

      stateManager.recordMove("select-component", { componentId });
    },
    [status, stateManager]
  );

  const handleSubmit = useCallback(() => {
    if (status !== "playing") return;

    const isCorrect =
      selectedComponents.length === currentScenarioData.solution.length &&
      currentScenarioData.solution.every((id) => selectedComponents.includes(id));

    stateManager.recordMove("submit", {
      scenarioId: currentScenarioData.id,
      selected: selectedComponents,
      correct: isCorrect,
    });

    if (isCorrect) {
      setScore(score + 10);
      difficultyEngine.recordPerformance(1);

      // Move to next scenario
      if (currentScenario < SCENARIOS.length - 1) {
        setTimeout(() => {
          setCurrentScenario(currentScenario + 1);
          setSelectedComponents([]);
        }, 2000);
      } else {
        // Game finished
        setStatus("finished");
        stateManager.updateState({ status: "finished", score });
        const gameAnalysis = explainabilityEngine.analyzeGame(
          stateManager.getState(),
          { id: GAME_CONFIG.id, type: "educational" }
        );
        setAnalysis(gameAnalysis);
      }
    } else {
      difficultyEngine.recordPerformance(0);
      // Show feedback and allow retry
    }
  }, [
    status,
    selectedComponents,
    currentScenarioData,
    currentScenario,
    score,
    stateManager,
    difficultyEngine,
    explainabilityEngine,
  ]);

  const handleStart = useCallback(() => {
    setStatus("playing");
    setCurrentScenario(0);
    setSelectedComponents([]);
    setScore(0);
    stateManager.updateState({ status: "playing", timestamp: Date.now() });
    stateManager.recordMove("start", {});
    difficultyEngine.reset();
  }, [stateManager, difficultyEngine]);

  const handleReset = useCallback(() => {
    setStatus("idle");
    setCurrentScenario(0);
    setSelectedComponents([]);
    setScore(0);
    setAnalysis(null);
    stateManager.updateState({ status: "idle", moves: [], score: 0 });
    difficultyEngine.reset();
  }, [stateManager, difficultyEngine]);

  const difficulty = difficultyEngine.getCurrentDifficulty();

  return (
    <GameShell
      config={GAME_CONFIG}
      status={status}
      onStart={status === "idle" ? handleStart : undefined}
      onReset={handleReset}
      rightPanel={
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Progress</h3>
            <div className="text-2xl font-bold text-slate-900">
              Scenario {currentScenario + 1} / {SCENARIOS.length}
            </div>
            <div className="mt-2 text-sm text-slate-600">Score: {score}</div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Difficulty</h3>
            <div className="text-sm text-slate-700">
              {difficultyEngine.getDifficultyLabel(difficulty)}
            </div>
          </div>
        </div>
      }
    >
      {status === "idle" && (
        <div className="text-center py-12">
          <p className="text-slate-600 mb-4">Ready to master systems thinking?</p>
          <p className="text-sm text-slate-500">
            Learn how complex systems work through interactive scenarios
          </p>
        </div>
      )}

      {status === "playing" && currentScenarioData && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">
              {currentScenarioData.title}
            </h2>
            <p className="text-slate-600 mb-4">{currentScenarioData.description}</p>
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
              <p className="text-sm font-semibold text-blue-900 mb-1">Challenge:</p>
              <p className="text-sm text-blue-800">{currentScenarioData.challenge}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">System Components</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3" role="group" aria-label="System components">
              {currentScenarioData.components.map((component) => {
                const isSelected = selectedComponents.includes(component.id);
                return (
                  <button
                    key={component.id}
                    onClick={() => handleComponentClick(component.id)}
                    className={`rounded-lg border-2 p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                      isSelected
                        ? "bg-blue-100 border-blue-500"
                        : "bg-white border-slate-200 hover:bg-slate-50"
                    }`}
                    type="button"
                    aria-label={`${component.name}, type ${component.type}${isSelected ? ", selected" : ""}`}
                    aria-pressed={isSelected}
                  >
                    <div className="font-semibold text-slate-900">{component.name}</div>
                    <div className="text-xs text-slate-600 mt-1">Type: {component.type}</div>
                    {isSelected && (
                      <div className="text-xs text-blue-700 mt-1 font-medium" aria-hidden="true">
                        Selected
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={selectedComponents.length === 0}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              type="button"
              aria-label={`Submit answer${selectedComponents.length === 0 ? ". Select at least one component first" : ` with ${selectedComponents.length} component${selectedComponents.length === 1 ? "" : "s"} selected`}`}
              aria-disabled={selectedComponents.length === 0}
            >
              Submit Answer
            </button>
          </div>
        </div>
      )}

      {status === "finished" && analysis && (
        <div className="mt-6 space-y-4">
          <div className="text-center py-4">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Course Complete!</h2>
            <p className="text-lg text-slate-600">Final Score: {score}</p>
          </div>
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
            <p className="text-sm text-blue-900">{analysis.summary}</p>
          </div>
        </div>
      )}
    </GameShell>
  );
}
