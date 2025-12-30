/**
 * Grid Racer Time Trial
 * 
 * Time trial racing with customizable loadouts
 * Arcade-style game with difficulty ramping
 */

"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import GameShell from "@/lib/games/framework/GameShell";
import { StateManager } from "@/lib/games/framework/StateManager";
import { DifficultyEngine } from "@/lib/games/framework/DifficultyEngine";
import { ExplainabilityEngine } from "@/lib/games/framework/ExplainabilityEngine";
import { InputLayer } from "@/lib/games/framework/InputLayer";
import { useCanvasRenderer } from "@/lib/games/framework/RenderingLayer";
import { useGameAnalytics } from "@/lib/games/framework/useGameAnalytics";
import { useReducedMotion } from "@/lib/games/framework/useReducedMotion";
import type { GameConfig, GameStatus, GameAnalysis } from "@/lib/games/framework/types";

const GAME_CONFIG: GameConfig = {
  id: "grid-racer",
  title: "Grid Racer Time Trial",
  description: "Time trial racing with customizable loadouts. Navigate through obstacles and beat your best time.",
  category: "arcade",
  modes: ["solo"],
  supportsMultiplayer: false,
  minPlayers: 1,
  maxPlayers: 1,
  estimatedMinutes: 10,
  tutorialAvailable: true,
};

interface Player {
  x: number;
  y: number;
  speed: number;
  direction: "left" | "right" | "up" | "down" | "none";
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: "static" | "moving";
}

export default function GridRacer() {
  const [status, setStatus] = useState<GameStatus>("idle");
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [analysis, setAnalysis] = useState<GameAnalysis | null>(null);
  const [player, setPlayer] = useState<Player>({ x: 400, y: 500, speed: 3, direction: "none" });
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);

  const seed = useMemo(() => Math.floor(Math.random() * 1000000), []);
  const stateManager = useMemo(() => new StateManager({ status: "idle" }, seed), [seed]);
  const difficultyEngine = useMemo(
    () =>
      new DifficultyEngine({
        initial: 0.2,
        target: 0.9,
        rampTime: 60000, // 1 minute
        adaptive: true,
      }),
    []
  );
  const explainabilityEngine = useMemo(() => new ExplainabilityEngine(), []);
  const inputLayer = useMemo(() => new InputLayer(), []);
  const prefersReducedMotion = useReducedMotion();

  // Analytics
  useGameAnalytics(GAME_CONFIG.id, status, stateManager.getState());

  // Generate obstacles based on difficulty
  const generateObstacles = useCallback(
    (difficulty: number) => {
      const count = Math.floor(5 + difficulty * 10);
      const newObstacles: Obstacle[] = [];
      const rng = () => stateManager.random();

      for (let i = 0; i < count; i++) {
        newObstacles.push({
          x: rng() * 700 + 50,
          y: -rng() * 2000, // Start above screen
          width: 40 + rng() * 60,
          height: 40 + rng() * 60,
          type: rng() > 0.7 ? "moving" : "static",
        });
      }

      return newObstacles;
    },
    [stateManager]
  );

  const canvasRef = useCanvasRenderer({
    width: 800,
    height: 600,
    onRender: useCallback(
      (ctx, deltaTime) => {
        if (status !== "playing") return;

        // Clear with background
        ctx.fillStyle = "#f8fafc";
        ctx.fillRect(0, 0, 800, 600);

        // Draw grid
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 1;
        for (let x = 0; x < 800; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, 600);
          ctx.stroke();
        }
        for (let y = 0; y < 600; y += 40) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(800, y);
          ctx.stroke();
        }

        // Draw player
        ctx.fillStyle = "#3b82f6";
        ctx.beginPath();
        ctx.arc(player.x, player.y, 15, 0, Math.PI * 2);
        ctx.fill();

        // Draw obstacles
        obstacles.forEach((obs) => {
          ctx.fillStyle = obs.type === "moving" ? "#ef4444" : "#64748b";
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        });

        // Update obstacles
        const difficulty = difficultyEngine.getCurrentDifficulty();
        setObstacles((prev) => {
          const updated = prev
            .map((obs) => ({
              ...obs,
              y: obs.y + (2 + difficulty * 5),
              x: obs.type === "moving" ? obs.x + Math.sin(obs.y * 0.01) * 2 : obs.x,
            }))
            .filter((obs) => obs.y < 650);

          // Add new obstacles
          if (updated.length < 10) {
            const newObs = generateObstacles(difficulty);
            return [...updated, ...newObs];
          }

          return updated;
        });

        // Check collisions
        obstacles.forEach((obs) => {
          if (
            player.x + 15 > obs.x &&
            player.x - 15 < obs.x + obs.width &&
            player.y + 15 > obs.y &&
            player.y - 15 < obs.y + obs.height
          ) {
            stateManager.recordMove("collision", { obstacleId: obs.x });
            difficultyEngine.recordPerformance(0);
            setScore((s) => Math.max(0, s - 10));
          }
        });

        // Update score based on time survived
        setScore((s) => s + 1);
      },
      [status, player, obstacles, stateManager, difficultyEngine, generateObstacles, prefersReducedMotion]
    ),
    enabled: status === "playing",
  });

  // Input handling
  useEffect(() => {
    if (status !== "playing") {
      inputLayer.setEnabled(false);
      return;
    }

    inputLayer.setEnabled(true);
    const cleanupListeners = inputLayer.setupAllListeners();

    const unsubscribeMoveLeft = inputLayer.on("move-left", () => {
      setPlayer((p) => ({ ...p, x: Math.max(15, p.x - p.speed), direction: "left" }));
      stateManager.recordMove("move", { direction: "left" });
    });

    const unsubscribeMoveRight = inputLayer.on("move-right", () => {
      setPlayer((p) => ({ ...p, x: Math.min(785, p.x + p.speed), direction: "right" }));
      stateManager.recordMove("move", { direction: "right" });
    });

    const unsubscribeMoveUp = inputLayer.on("move-up", () => {
      setPlayer((p) => ({ ...p, y: Math.max(15, p.y - p.speed), direction: "up" }));
      stateManager.recordMove("move", { direction: "up" });
    });

    const unsubscribeMoveDown = inputLayer.on("move-down", () => {
      setPlayer((p) => ({ ...p, y: Math.min(585, p.y + p.speed), direction: "down" }));
      stateManager.recordMove("move", { direction: "down" });
    });

    const unsubscribePause = inputLayer.on("pause", () => {
      setStatus("paused");
    });

    return () => {
      cleanupListeners();
      unsubscribeMoveLeft();
      unsubscribeMoveRight();
      unsubscribeMoveUp();
      unsubscribeMoveDown();
      unsubscribePause();
      inputLayer.setEnabled(false);
    };
  }, [status, inputLayer, stateManager]);

  // Timer
  useEffect(() => {
    if (status !== "playing") return;

    const interval = setInterval(() => {
      setTime((t) => t + 0.1);
    }, 100);

    return () => clearInterval(interval);
  }, [status]);

  const handleStart = useCallback(() => {
    setStatus("playing");
    setScore(0);
    setTime(0);
    setPlayer({ x: 400, y: 500, speed: 3, direction: "none" });
    setObstacles(generateObstacles(0.2));
    stateManager.updateState({ status: "playing", timestamp: Date.now() });
    stateManager.recordMove("start", {});
    difficultyEngine.reset();
  }, [stateManager, difficultyEngine, generateObstacles]);

  const handleReset = useCallback(() => {
    setStatus("idle");
    setScore(0);
    setTime(0);
    setPlayer({ x: 400, y: 500, speed: 3, direction: "none" });
    setObstacles([]);
    setAnalysis(null);
    stateManager.updateState({ status: "idle", moves: [], score: 0 });
    difficultyEngine.reset();
  }, [stateManager, difficultyEngine]);

  const handleQuit = useCallback(() => {
    if (status === "playing" || status === "paused") {
      setStatus("finished");
      stateManager.updateState({ status: "finished", score });
      const gameAnalysis = explainabilityEngine.analyzeGame(
        stateManager.getState(),
        { id: GAME_CONFIG.id, type: "arcade" }
      );
      setAnalysis(gameAnalysis);
    }
  }, [status, stateManager, score, explainabilityEngine]);

  const difficulty = difficultyEngine.getCurrentDifficulty();

  return (
    <GameShell
      config={GAME_CONFIG}
      status={status}
      onStart={status === "idle" ? handleStart : undefined}
      onReset={handleReset}
      onQuit={handleQuit}
      rightPanel={
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Stats</h3>
            <div className="text-2xl font-bold text-slate-900">{Math.floor(score)}</div>
            <div className="text-sm text-slate-600">Score</div>
            <div className="mt-2 text-lg font-semibold text-slate-900">
              {time.toFixed(1)}s
            </div>
            <div className="text-sm text-slate-600">Time</div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Difficulty</h3>
            <div className="text-sm text-slate-700">
              {difficultyEngine.getDifficultyLabel(difficulty)}
            </div>
          </div>
          {analysis && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Analysis</h3>
              <p className="text-xs text-slate-600">{analysis.summary}</p>
            </div>
          )}
        </div>
      }
    >
      <div className="flex items-center justify-center" role="application" aria-label="Grid Racer game canvas">
        <canvas
          ref={canvasRef}
          className="rounded-lg border-2 border-slate-300 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          style={{ maxWidth: "100%", height: "auto" }}
          aria-label="Grid Racer game canvas. Use arrow keys to navigate and avoid obstacles."
          tabIndex={0}
        />
      </div>

      {status === "idle" && (
        <div className="text-center py-8">
          <p className="text-slate-600 mb-4">Use arrow keys or swipe to navigate</p>
          <p className="text-sm text-slate-500">Avoid obstacles and survive as long as possible</p>
        </div>
      )}

      {status === "finished" && analysis && (
        <div className="mt-6 space-y-4">
          <div className="text-center py-4">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Game Over</h2>
            <p className="text-lg text-slate-600">Final Score: {Math.floor(score)}</p>
            <p className="text-sm text-slate-500">Time: {time.toFixed(1)}s</p>
          </div>
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
            <p className="text-sm text-blue-900">{analysis.summary}</p>
          </div>
        </div>
      )}
    </GameShell>
  );
}
