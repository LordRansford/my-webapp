/**
 * State Manager - Pure state management with deterministic RNG and replay logging
 * 
 * This provides:
 * - Pure data structures (no React state)
 * - Deterministic RNG with seed
 * - Replay logging for anti-cheat and learning
 * - State serialization/deserialization
 */

import type { GameState, GameMove, ReplayLog } from "./types";

export class StateManager {
  private state: GameState;
  private replayLog: ReplayLog;
  private rng: () => number;

  constructor(initialState: Partial<GameState>, seed: number) {
    // Initialize deterministic RNG
    this.rng = this.createSeededRNG(seed);
    
    this.state = {
      status: "idle",
      seed,
      timestamp: Date.now(),
      difficulty: 0,
      moves: [],
      metadata: {},
      ...initialState,
    };

    this.replayLog = {
      gameId: "",
      seed,
      moves: [],
      initialState: this.state,
      finalState: null,
    };
  }

  /**
   * Create a seeded random number generator (Linear Congruential Generator)
   */
  private createSeededRNG(seed: number): () => number {
    let value = seed;
    return () => {
      value = (value * 1664525 + 1013904223) % 2 ** 32;
      return value / 2 ** 32;
    };
  }

  /**
   * Get current state (immutable copy)
   */
  getState(): Readonly<GameState> {
    return { ...this.state };
  }

  /**
   * Get random number (deterministic)
   */
  random(): number {
    return this.rng();
  }

  /**
   * Record a move
   */
  recordMove(type: string, data: unknown): void {
    const move: GameMove = {
      timestamp: Date.now() - this.state.timestamp,
      type,
      data,
    };
    this.state.moves.push(move);
    this.replayLog.moves.push(move);
  }

  /**
   * Update state (immutable update)
   */
  updateState(updates: Partial<GameState>): void {
    this.state = {
      ...this.state,
      ...updates,
      moves: [...this.state.moves], // Keep moves array reference
    };
  }

  /**
   * Get replay log
   */
  getReplayLog(): Readonly<ReplayLog> {
    return {
      ...this.replayLog,
      finalState: this.state,
    };
  }

  /**
   * Serialize state for storage
   */
  serialize(): string {
    return JSON.stringify({
      state: this.state,
      replayLog: this.replayLog,
    });
  }

  /**
   * Deserialize state from storage
   */
  static deserialize(data: string): { state: GameState; replayLog: ReplayLog } {
    return JSON.parse(data);
  }

  /**
   * Verify replay determinism
   * Given same seed and moves, should produce same final state
   */
  static verifyReplay(replayLog: ReplayLog, expectedFinalState: unknown): boolean {
    // This would be implemented by replaying the moves with the same seed
    // For now, return true as placeholder
    return true;
  }
}
