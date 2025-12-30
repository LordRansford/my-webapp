/**
 * Difficulty Engine - Adaptive difficulty system
 * 
 * Provides:
 * - Standard difficulty curves (hard at ~10s, very hard by 30-45s, near-impossible 60-90s for arcade)
 * - Adaptive ramping based on player performance
 * - Never drops to "easy" once player shows competence
 */

import type { DifficultyCurve, GameState } from "./types";

export class DifficultyEngine {
  private curve: DifficultyCurve;
  private startTime: number;
  private performanceHistory: number[]; // Recent performance scores (0-1)

  constructor(curve: DifficultyCurve) {
    this.curve = curve;
    this.startTime = Date.now();
    this.performanceHistory = [];
  }

  /**
   * Calculate current difficulty based on time and performance
   */
  getCurrentDifficulty(): number {
    const elapsed = Date.now() - this.startTime;
    const timeBased = this.calculateTimeBasedDifficulty(elapsed);
    
    if (!this.curve.adaptive) {
      return timeBased;
    }

    // Adaptive: adjust based on performance
    const performanceAdjustment = this.calculatePerformanceAdjustment();
    return Math.min(1, Math.max(0, timeBased + performanceAdjustment));
  }

  /**
   * Time-based difficulty curve
   * - Hard at ~10s
   * - Very hard by 30-45s
   * - Near-impossible 60-90s
   */
  private calculateTimeBasedDifficulty(elapsed: number): number {
    const seconds = elapsed / 1000;
    
    // Linear ramp from initial to target over rampTime
    if (seconds < this.curve.rampTime / 1000) {
      const progress = seconds / (this.curve.rampTime / 1000);
      return this.curve.initial + (this.curve.target - this.curve.initial) * progress;
    }

    // After rampTime, continue increasing but slower
    const postRampSeconds = seconds - (this.curve.rampTime / 1000);
    const additionalDifficulty = Math.min(0.2, postRampSeconds / 60); // Max +0.2 over 60s
    
    return Math.min(1, this.curve.target + additionalDifficulty);
  }

  /**
   * Calculate performance-based adjustment
   * Positive = harder (player doing well)
   * Negative = easier (player struggling)
   * But never goes below a minimum threshold
   */
  private calculatePerformanceAdjustment(): number {
    if (this.performanceHistory.length === 0) return 0;

    const avgPerformance = this.performanceHistory.reduce((a, b) => a + b, 0) / this.performanceHistory.length;
    
    // If player is performing well (high score), increase difficulty
    // If struggling (low score), decrease difficulty slightly
    const adjustment = (avgPerformance - 0.5) * 0.2; // Max ±0.1 adjustment
    
    // Never make it easier than initial difficulty
    const currentTimeBased = this.calculateTimeBasedDifficulty(Date.now() - this.startTime);
    const minDifficulty = Math.max(this.curve.initial, currentTimeBased - 0.1);
    
    return adjustment;
  }

  /**
   * Record performance for adaptive adjustment
   */
  recordPerformance(score: number): void {
    this.performanceHistory.push(score);
    // Keep only last 10 scores
    if (this.performanceHistory.length > 10) {
      this.performanceHistory.shift();
    }
  }

  /**
   * Reset difficulty (for new game)
   */
  reset(): void {
    this.startTime = Date.now();
    this.performanceHistory = [];
  }

  /**
   * Get difficulty level label
   */
  getDifficultyLabel(difficulty: number): string {
    if (difficulty < 0.3) return "Foundations";
    if (difficulty < 0.5) return "Intermediate";
    if (difficulty < 0.7) return "Advanced";
    if (difficulty < 0.9) return "Expert";
    return "Master";
  }
}
