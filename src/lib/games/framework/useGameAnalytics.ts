/**
 * Game Analytics Hook
 * 
 * Tracks game performance metrics and user engagement
 * Privacy-preserving, no personal data collection
 */

import { useEffect, useRef } from "react";
import type { GameStatus, GameState } from "./types";

interface GameAnalytics {
  gameId: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  moves: number;
  score?: number;
  status: GameStatus;
}

export function useGameAnalytics(
  gameId: string,
  status: GameStatus,
  gameState: GameState
) {
  const startTimeRef = useRef<number>(Date.now());
  const analyticsRef = useRef<GameAnalytics>({
    gameId,
    startTime: Date.now(),
    moves: 0,
    status,
  });

  useEffect(() => {
    if (status === "playing" && analyticsRef.current.startTime === 0) {
      analyticsRef.current.startTime = Date.now();
    }

    if (status === "finished" || status === "error") {
      analyticsRef.current.endTime = Date.now();
      analyticsRef.current.duration = analyticsRef.current.endTime - analyticsRef.current.startTime;
      analyticsRef.current.status = status;
      analyticsRef.current.moves = gameState.moves.length;
      analyticsRef.current.score = gameState.score;

      // Log analytics (in production, this could send to analytics service)
      if (process.env.NODE_ENV === "development") {
        console.log("Game Analytics:", analyticsRef.current);
      }

      // In production, you might want to send to analytics:
      // trackGameCompletion(analyticsRef.current);
    }
  }, [status, gameId, gameState]);

  return analyticsRef.current;
}
