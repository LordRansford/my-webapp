/**
 * Adaptive Difficulty Engine
 * 
 * Predicts optimal difficulty for each puzzle based on player capability model.
 * Adjusts difficulty in real-time based on performance to maintain optimal challenge.
 * 
 * Based on technical architecture specification for gold-standard implementation.
 */

import type { PlayerCapabilityModel, PuzzlePerformance } from './PlayerModel';
import { predictOptimalDifficulty, updatePlayerModel } from './PlayerModel';

/**
 * Performance history entry
 */
interface PerformanceHistory {
  timestamp: number;
  performance: PuzzlePerformance;
  difficulty: number;
}

/**
 * Adaptive difficulty engine with predictive modeling
 */
export class AdaptiveDifficultyEngine {
  private playerModel: PlayerCapabilityModel;
  private history: PerformanceHistory[];
  private readonly maxHistorySize = 50;
  
  constructor(initialModel: PlayerCapabilityModel) {
    this.playerModel = initialModel;
    this.history = [];
  }
  
  /**
   * Calculate next puzzle difficulty
   */
  calculateNextDifficulty(
    puzzleType: string,
    currentPosition: number,
    totalPuzzles: number
  ): number {
    // Base difficulty from player model prediction
    const predictedDifficulty = predictOptimalDifficulty(this.playerModel, puzzleType);
    
    // Adjust for position in gauntlet (progressive difficulty)
    const positionFactor = currentPosition / totalPuzzles;
    const progressionDifficulty = 0.3 + (positionFactor * 0.5);
    
    // Blend predicted and progression (70% prediction, 30% progression)
    const blendedDifficulty = (
      predictedDifficulty * 0.7 + 
      progressionDifficulty * 0.3
    );
    
    // Adjust for recent performance
    if (this.history.length > 0) {
      const recentPerformance = this.getRecentPerformance(5);
      const performanceAdjustment = this.calculatePerformanceAdjustment(recentPerformance);
      return Math.max(0.1, Math.min(0.95, blendedDifficulty + performanceAdjustment));
    }
    
    return blendedDifficulty;
  }
  
  /**
   * Update engine after puzzle completion
   */
  update(performance: PuzzlePerformance): void {
    // Update player model
    this.playerModel = updatePlayerModel(this.playerModel, performance);
    
    // Add to history
    this.history.push({
      timestamp: Date.now(),
      performance,
      difficulty: performance.difficulty,
    });
    
    // Keep only last N entries
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }
  }
  
  /**
   * Get recent performance metrics
   */
  private getRecentPerformance(count: number): PuzzlePerformance[] {
    return this.history
      .slice(-count)
      .map(h => h.performance);
  }
  
  /**
   * Calculate adjustment based on recent performance
   */
  private calculatePerformanceAdjustment(
    recentPerformance: PuzzlePerformance[]
  ): number {
    if (recentPerformance.length === 0) return 0;
    
    const accuracy = recentPerformance.filter(p => p.correct).length / recentPerformance.length;
    const avgTime = recentPerformance.reduce((sum, p) => sum + p.timeSpent, 0) / recentPerformance.length;
    
    // If accuracy too high (>90%) and fast, increase difficulty
    if (accuracy > 0.9 && avgTime < 30000) {
      return 0.1;
    }
    
    // If accuracy too low (<60%) or very slow, decrease difficulty
    if (accuracy < 0.6 || avgTime > 120000) {
      return -0.1;
    }
    
    // If accuracy good (70-90%) but slow, slightly increase (more time pressure)
    if (accuracy >= 0.7 && accuracy <= 0.9 && avgTime > 60000) {
      return 0.05;
    }
    
    // Otherwise, maintain current level
    return 0;
  }
  
  /**
   * Get current player model
   */
  getModel(): PlayerCapabilityModel {
    return { ...this.playerModel };
  }
  
  /**
   * Reset engine (for new session)
   */
  reset(): void {
    this.history = [];
    // Keep player model (it persists across sessions)
  }
  
  /**
   * Get performance statistics
   */
  getStats(): {
    totalPuzzles: number;
    accuracy: number;
    averageTime: number;
    averageDifficulty: number;
  } {
    if (this.history.length === 0) {
      return {
        totalPuzzles: 0,
        accuracy: 0,
        averageTime: 0,
        averageDifficulty: 0,
      };
    }
    
    const correct = this.history.filter(h => h.performance.correct).length;
    const totalTime = this.history.reduce((sum, h) => sum + h.performance.timeSpent, 0);
    const totalDifficulty = this.history.reduce((sum, h) => sum + h.difficulty, 0);
    
    return {
      totalPuzzles: this.history.length,
      accuracy: correct / this.history.length,
      averageTime: totalTime / this.history.length,
      averageDifficulty: totalDifficulty / this.history.length,
    };
  }
}
