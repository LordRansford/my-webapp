/**
 * Hex
 * 
 * Classic connection game on hexagonal board
 * Connect your sides to win
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
  id: "hex",
  title: "Hex",
  description: "Classic connection game on hexagonal board. Connect your sides to win.",
  category: "board",
  modes: ["solo", "multiplayer"],
  supportsMultiplayer: true,
  minPlayers: 2,
  maxPlayers: 2,
  estimatedMinutes: 15,
  tutorialAvailable: true,
};

type CellState = "empty" | "player1" | "player2";
type BoardSize = 9 | 11 | 13;

interface HexCell {
  row: number;
  col: number;
  state: CellState;
}

export default function Hex() {
  const [status, setStatus] = useState<GameStatus>("idle");
  const [boardSize, setBoardSize] = useState<BoardSize>(9);
  const [board, setBoard] = useState<HexCell[][]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<"player1" | "player2">("player1");
  const [winner, setWinner] = useState<"player1" | "player2" | null>(null);
  const [analysis, setAnalysis] = useState<GameAnalysis | null>(null);

  const seed = useMemo(() => Math.floor(Math.random() * 1000000), []);
  const stateManager = useMemo(() => new StateManager({ status: "idle" }, seed), [seed]);
  const difficultyEngine = useMemo(
    () =>
      new DifficultyEngine({
        initial: 0.4,
        target: 0.8,
        rampTime: 900000, // 15 minutes
        adaptive: true,
      }),
    []
  );
  const explainabilityEngine = useMemo(() => new ExplainabilityEngine(), []);

  // Analytics
  useGameAnalytics(GAME_CONFIG.id, status, stateManager.getState());

  const initializeBoard = useCallback((size: BoardSize) => {
    const newBoard: HexCell[][] = [];
    for (let row = 0; row < size; row++) {
      newBoard[row] = [];
      for (let col = 0; col < size; col++) {
        newBoard[row][col] = { row, col, state: "empty" };
      }
    }
    return newBoard;
  }, []);

  const checkWin = useCallback(
    (board: HexCell[][], player: "player1" | "player2"): boolean => {
      const size = board.length;
      const visited = new Set<string>();

      const dfs = (row: number, col: number): boolean => {
        const key = `${row},${col}`;
        if (visited.has(key)) return false;
        visited.add(key);

        if (board[row][col].state !== player) return false;

        // Check if reached opposite side
        if (player === "player1" && col === size - 1) return true;
        if (player === "player2" && row === size - 1) return true;

        // Check neighbors (hexagonal)
        const neighbors = [
          [row - 1, col],
          [row - 1, col + 1],
          [row, col - 1],
          [row, col + 1],
          [row + 1, col - 1],
          [row + 1, col],
        ];

        for (const [nr, nc] of neighbors) {
          if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
            if (dfs(nr, nc)) return true;
          }
        }

        return false;
      };

      // Start from player's side
      if (player === "player1") {
        for (let row = 0; row < size; row++) {
          if (board[row][0].state === player && dfs(row, 0)) return true;
        }
      } else {
        for (let col = 0; col < size; col++) {
          if (board[0][col].state === player && dfs(0, col)) return true;
        }
      }

      return false;
    },
    []
  );

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (status !== "playing" || board[row][col].state !== "empty") return;

      const newBoard = board.map((r) => r.map((c) => ({ ...c })));
      newBoard[row][col].state = currentPlayer;

      setBoard(newBoard);
      stateManager.recordMove("place", { row, col, player: currentPlayer });

      // Check win
      if (checkWin(newBoard, currentPlayer)) {
        setWinner(currentPlayer);
        setStatus("finished");
        stateManager.updateState({ status: "finished", score: currentPlayer === "player1" ? 100 : 0 });
        const gameAnalysis = explainabilityEngine.analyzeGame(
          stateManager.getState(),
          { id: GAME_CONFIG.id, type: "board" }
        );
        setAnalysis(gameAnalysis);
      } else {
        setCurrentPlayer(currentPlayer === "player1" ? "player2" : "player1");
      }
    },
    [status, board, currentPlayer, stateManager, checkWin, explainabilityEngine]
  );

  const handleStart = useCallback(() => {
    const newBoard = initializeBoard(boardSize);
    setBoard(newBoard);
    setCurrentPlayer("player1");
    setWinner(null);
    setStatus("playing");
    stateManager.updateState({ status: "playing", timestamp: Date.now() });
    stateManager.recordMove("start", { boardSize });
  }, [boardSize, initializeBoard, stateManager]);

  const handleReset = useCallback(() => {
    setStatus("idle");
    setBoard([]);
    setCurrentPlayer("player1");
    setWinner(null);
    setAnalysis(null);
    stateManager.updateState({ status: "idle", moves: [], score: 0 });
    difficultyEngine.reset();
  }, [stateManager, difficultyEngine]);

  return (
    <GameShell
      config={GAME_CONFIG}
      status={status}
      onStart={status === "idle" ? handleStart : undefined}
      onReset={handleReset}
      rightPanel={
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Current Player</h3>
            <div className="text-lg font-bold text-slate-900">
              {currentPlayer === "player1" ? "Player 1 (Red)" : "Player 2 (Blue)"}
            </div>
          </div>
          {winner && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Winner</h3>
              <div className="text-lg font-bold text-green-600">
                {winner === "player1" ? "Player 1 Wins!" : "Player 2 Wins!"}
              </div>
            </div>
          )}
        </div>
      }
    >
      {status === "idle" && (
        <div className="text-center py-12">
          <p className="text-slate-600 mb-4">Select board size and start playing</p>
          <div className="flex gap-4 justify-center">
            {([9, 11, 13] as BoardSize[]).map((size) => (
              <button
                key={size}
                onClick={() => setBoardSize(size)}
                className={`px-4 py-2 rounded-lg ${
                  boardSize === size ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"
                }`}
                type="button"
              >
                {size}x{size}
              </button>
            ))}
          </div>
        </div>
      )}

      {status === "playing" && board.length > 0 && (
        <div className="flex justify-center" role="application" aria-label="Hex game board">
          <div
            className="inline-grid gap-0"
            style={{
              gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
              transform: "rotate(-30deg)",
            }}
            role="grid"
            aria-label={`Hex board, ${boardSize} by ${boardSize} cells`}
          >
            {board.map((row, rowIdx) =>
              row.map((cell, colIdx) => (
                <button
                  key={`${rowIdx}-${colIdx}`}
                  onClick={() => handleCellClick(rowIdx, colIdx)}
                  disabled={cell.state !== "empty"}
                  className={`aspect-square w-12 h-12 border border-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    cell.state === "player1"
                      ? "bg-red-500 hover:bg-red-600"
                      : cell.state === "player2"
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-white hover:bg-slate-100"
                  } ${cell.state !== "empty" ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                  type="button"
                  aria-label={`Cell row ${rowIdx + 1}, column ${colIdx + 1}, ${cell.state === "empty" ? "empty" : cell.state === "player1" ? "occupied by player 1" : "occupied by player 2"}`}
                  aria-pressed={cell.state !== "empty"}
                />
              ))
            )}
          </div>
        </div>
      )}

      {status === "finished" && analysis && (
        <div className="mt-6 space-y-4">
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
            <p className="text-sm text-blue-900">{analysis.summary}</p>
          </div>
        </div>
      )}
    </GameShell>
  );
}
