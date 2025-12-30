/**
 * Explainability Engine - Deterministic post-game analysis
 * 
 * Provides:
 * - Top 3 turning points
 * - Key mistakes with suggestions
 * - Key good decisions
 * - Summary without using paid AI
 * 
 * All analysis is deterministic using heuristics
 */

import type { GameAnalysis, GameState, GameMove } from "./types";

export class ExplainabilityEngine {
  /**
   * Analyze game and generate deterministic insights
   */
  analyzeGame(state: GameState, gameConfig: { id: string; type: string }): GameAnalysis {
    const turningPoints = this.identifyTurningPoints(state);
    const mistakes = this.identifyMistakes(state, gameConfig);
    const goodDecisions = this.identifyGoodDecisions(state, gameConfig);
    const summary = this.generateSummary(turningPoints, mistakes, goodDecisions);

    return {
      turningPoints: turningPoints.slice(0, 3),
      keyMistakes: mistakes.slice(0, 3),
      keyDecisions: goodDecisions.slice(0, 3),
      summary,
    };
  }

  /**
   * Identify turning points (significant score/state changes)
   */
  private identifyTurningPoints(state: GameState): Array<{
    timestamp: number;
    description: string;
    impact: "positive" | "negative" | "neutral";
  }> {
    const points: Array<{
      timestamp: number;
      description: string;
      impact: "positive" | "negative" | "neutral";
    }> = [];

    // Analyze move patterns for significant changes
    let previousScore = 0;
    for (let i = 0; i < state.moves.length; i++) {
      const move = state.moves[i];
      
      // Detect score changes (if score is tracked)
      if (state.score !== undefined) {
        // This is simplified - actual implementation would track score per move
        const scoreChange = Math.abs((state.score || 0) - previousScore);
        if (scoreChange > 10) {
          points.push({
            timestamp: move.timestamp,
            description: `Significant score change at ${this.formatTime(move.timestamp)}`,
            impact: (state.score || 0) > previousScore ? "positive" : "negative",
          });
          previousScore = state.score || 0;
        }
      }

      // Detect error patterns
      if (move.type === "error" || move.type === "collision") {
        points.push({
          timestamp: move.timestamp,
          description: `Error occurred at ${this.formatTime(move.timestamp)}`,
          impact: "negative",
        });
      }
    }

    return points.sort((a, b) => Math.abs(b.timestamp - a.timestamp));
  }

  /**
   * Identify mistakes using heuristics
   */
  private identifyMistakes(
    state: GameState,
    gameConfig: { id: string; type: string }
  ): Array<{
    timestamp: number;
    description: string;
    suggestion: string;
  }> {
    const mistakes: Array<{
      timestamp: number;
      description: string;
      suggestion: string;
    }> = [];

    // Look for error moves
    const errorMoves = state.moves.filter((m) => m.type === "error" || m.type === "collision");
    for (const move of errorMoves) {
      mistakes.push({
        timestamp: move.timestamp,
        description: `Mistake at ${this.formatTime(move.timestamp)}`,
        suggestion: this.getSuggestionForMistake(move, gameConfig),
      });
    }

    // Look for rapid successive errors (indicates pattern)
    for (let i = 1; i < state.moves.length; i++) {
      const prev = state.moves[i - 1];
      const curr = state.moves[i];
      if (
        (prev.type === "error" || prev.type === "collision") &&
        (curr.type === "error" || curr.type === "collision") &&
        curr.timestamp - prev.timestamp < 2000
      ) {
        mistakes.push({
          timestamp: curr.timestamp,
          description: `Repeated mistakes within 2 seconds`,
          suggestion: "Take a moment to assess the situation before acting",
        });
      }
    }

    return mistakes;
  }

  /**
   * Identify good decisions
   */
  private identifyGoodDecisions(
    state: GameState,
    gameConfig: { id: string; type: string }
  ): Array<{
    timestamp: number;
    description: string;
    impact: string;
  }> {
    const decisions: Array<{
      timestamp: number;
      description: string;
      impact: string;
    }> = [];

    // Look for successful move sequences
    let successStreak = 0;
    for (let i = 0; i < state.moves.length; i++) {
      const move = state.moves[i];
      if (move.type !== "error" && move.type !== "collision") {
        successStreak++;
        if (successStreak >= 5) {
          decisions.push({
            timestamp: move.timestamp,
            description: `Successful sequence of ${successStreak} moves`,
            impact: "Maintained consistent performance",
          });
          successStreak = 0;
        }
      } else {
        successStreak = 0;
      }
    }

    // High score achievements
    if (state.score && state.score > 100) {
      decisions.push({
        timestamp: state.moves[state.moves.length - 1]?.timestamp || 0,
        description: "Achieved high score",
        impact: "Demonstrated strong performance",
      });
    }

    return decisions;
  }

  /**
   * Generate summary text
   */
  private generateSummary(
    turningPoints: Array<{ description: string; impact: string }>,
    mistakes: Array<{ description: string }>,
    goodDecisions: Array<{ description: string }>
  ): string {
    const parts: string[] = [];

    if (goodDecisions.length > 0) {
      parts.push(`You made ${goodDecisions.length} strong decisions during this game.`);
    }

    if (mistakes.length > 0) {
      parts.push(`There were ${mistakes.length} areas where you could improve.`);
    }

    if (turningPoints.length > 0) {
      const positive = turningPoints.filter((p) => p.impact === "positive").length;
      if (positive > 0) {
        parts.push(`${positive} key moments worked in your favor.`);
      }
    }

    return parts.join(" ") || "Review your moves to identify patterns and improve.";
  }

  /**
   * Get suggestion for specific mistake type
   */
  private getSuggestionForMistake(
    move: GameMove,
    gameConfig: { id: string; type: string }
  ): string {
    if (move.type === "collision") {
      return "Watch for obstacles and plan your path ahead";
    }
    if (move.type === "error") {
      return "Double-check your inputs before confirming";
    }
    return "Review the game rules and try a different approach";
  }

  /**
   * Format timestamp as readable time
   */
  private formatTime(timestamp: number): string {
    const seconds = Math.floor(timestamp / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return minutes > 0 ? `${minutes}m ${secs}s` : `${secs}s`;
  }
}
