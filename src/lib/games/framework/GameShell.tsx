/**
 * GameShell - Unified game UI shell
 * 
 * Provides consistent layout across all games:
 * - Header: game name, mode selector, status, help
 * - Main: play area (canvas or board)
 * - Right panel: rules, tips, stats, moves/history
 * - Footer: accessibility toggles and controls
 */

"use client";

import React, { useState, useRef, useEffect } from "react";
import { HelpCircle, Settings, Pause, Play, RotateCcw, Home, Keyboard, MousePointer2 } from "lucide-react";
import type { GameConfig, GameStatus } from "./types";

export interface GameShellProps {
  config: GameConfig;
  status: GameStatus;
  onStart?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onReset?: () => void;
  onQuit?: () => void;
  children: React.ReactNode; // Main game area
  rightPanel?: React.ReactNode; // Rules, tips, stats
  showHelp?: boolean;
  onToggleHelp?: () => void;
}

export default function GameShell({
  config,
  status,
  onStart,
  onPause,
  onResume,
  onReset,
  onQuit,
  children,
  rightPanel,
  showHelp = false,
  onToggleHelp,
}: GameShellProps) {
  const [isPaused, setIsPaused] = useState(false);

  const handlePause = () => {
    setIsPaused(true);
    onPause?.();
  };

  const handleResume = () => {
    setIsPaused(false);
    onResume?.();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="min-w-0 flex-1">
                <h1 className="text-xl font-semibold text-slate-900 truncate">{config.title}</h1>
                <p className="text-sm text-slate-600 hidden sm:block">{config.description}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${
                    status === "playing"
                      ? "bg-green-100 text-green-800"
                      : status === "paused"
                      ? "bg-amber-100 text-amber-800"
                      : status === "finished"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-slate-100 text-slate-800"
                  }`}
                  role="status"
                  aria-live="polite"
                  aria-label={`Game status: ${
                    status === "playing" && !isPaused
                      ? "Playing"
                      : status === "paused" || isPaused
                      ? "Paused"
                      : status === "finished"
                      ? "Finished"
                      : "Ready"
                  }`}
                >
                  {status === "playing" && !isPaused ? "Playing" : status === "paused" || isPaused ? "Paused" : status === "finished" ? "Finished" : "Ready"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {onToggleHelp && (
                <button
                  onClick={onToggleHelp}
                  className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  aria-label="Toggle help"
                  type="button"
                >
                  <HelpCircle className="h-5 w-5" aria-hidden="true" />
                </button>
              )}
              {status === "idle" && onStart && (
                <button
                  onClick={onStart}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
                  type="button"
                  aria-label="Start game"
                >
                  <Play className="h-4 w-4" aria-hidden="true" />
                  Start
                </button>
              )}
              {status === "playing" && !isPaused && onPause && (
                <button
                  onClick={handlePause}
                  className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
                  type="button"
                  aria-label="Pause game"
                >
                  <Pause className="h-4 w-4" aria-hidden="true" />
                  Pause
                </button>
              )}
              {(status === "paused" || isPaused) && onResume && (
                <button
                  onClick={handleResume}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
                  type="button"
                  aria-label="Resume game"
                >
                  <Play className="h-4 w-4" aria-hidden="true" />
                  Resume
                </button>
              )}
              {onReset && (
                <button
                  onClick={onReset}
                  className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
                  type="button"
                  aria-label="Reset game"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Reset
                </button>
              )}
              {onQuit && (
                <button
                  onClick={onQuit}
                  className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
                  type="button"
                  aria-label="Quit game and return to games hub"
                >
                  <Home className="h-4 w-4" aria-hidden="true" />
                  Quit
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Game Area */}
          <main className="lg:col-span-3" role="main" aria-label="Game area">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" id="game-main-area">
              {children}
            </div>
          </main>

          {/* Right Panel */}
          {rightPanel && (
            <aside className="lg:col-span-1" role="complementary" aria-label="Game information and statistics">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" id="game-sidebar">
                {rightPanel}
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* Footer - Accessibility Controls */}
      <footer className="border-t border-slate-200 bg-white" role="contentinfo">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 text-xs text-slate-600">
            <div className="flex items-start gap-2 flex-wrap">
              <Keyboard className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
              <span className="flex flex-wrap gap-x-1.5 gap-y-1">
                <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-xs">Arrow keys</kbd> to move,{" "}
                <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-xs">Space</kbd> to action,{" "}
                <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-xs">P</kbd> to pause,{" "}
                <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-xs">Q</kbd> to quit
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MousePointer2 className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span>Touch: Swipe to move, Tap to action</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
