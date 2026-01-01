/**
 * Analysis Report Generator
 * 
 * Generates detailed post-game analysis reports with performance metrics,
 * learning insights, and recommendations.
 */

import type { Puzzle, PuzzlePerformance } from './types';
import { calculateSessionXP } from './progression';

/**
 * Analysis report data structure
 */
export interface AnalysisReport {
  summary: {
    totalPuzzles: number;
    correct: number;
    accuracy: number;
    totalTime: number;
    averageTime: number;
    xpGained: number;
    hintsUsed: number;
  };
  
  performance: {
    byType: Record<string, {
      count: number;
      correct: number;
      accuracy: number;
      averageTime: number;
    }>;
    byDifficulty: Array<{
      difficulty: string;
      count: number;
      accuracy: number;
    }>;
    speed: {
      fastest: number;
      slowest: number;
      average: number;
    };
  };
  
  insights: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  
  progression: {
    skillImprovements: Record<string, number>;
    nextMilestone: string;
    estimatedGamesToNextTier: number;
  };
}

/**
 * Generate analysis report from session data
 */
export function generateAnalysisReport(
  puzzles: Puzzle[],
  performances: PuzzlePerformance[],
  hintsUsed: number[],
  totalXP: number,
  currentXP: number
): AnalysisReport {
  const correct = performances.filter(p => p.correct).length;
  const totalTime = performances.reduce((sum, p) => sum + p.timeSpent, 0);
  const totalHints = hintsUsed.reduce((sum, h) => sum + h, 0);
  const accuracy = puzzles.length > 0 ? correct / puzzles.length : 0;
  const averageTime = performances.length > 0 ? totalTime / performances.length : 0;
  
  // Performance by type
  const byType: Record<string, { count: number; correct: number; accuracy: number; averageTime: number }> = {};
  puzzles.forEach((puzzle, index) => {
    const perf = performances[index];
    if (!perf) return;
    
    if (!byType[puzzle.type]) {
      byType[puzzle.type] = { count: 0, correct: 0, accuracy: 0, averageTime: 0 };
    }
    
    byType[puzzle.type].count++;
    if (perf.correct) byType[puzzle.type].correct++;
    byType[puzzle.type].averageTime += perf.timeSpent;
  });
  
  // Calculate averages for types
  Object.keys(byType).forEach(type => {
    const stats = byType[type];
    stats.accuracy = stats.count > 0 ? stats.correct / stats.count : 0;
    stats.averageTime = stats.count > 0 ? stats.averageTime / stats.count : 0;
  });
  
  // Performance by difficulty (buckets)
  const difficultyBuckets: Record<string, { count: number; correct: number }> = {
    'Easy (0.0-0.3)': { count: 0, correct: 0 },
    'Medium (0.3-0.5)': { count: 0, correct: 0 },
    'Hard (0.5-0.7)': { count: 0, correct: 0 },
    'Expert (0.7+)': { count: 0, correct: 0 },
  };
  
  puzzles.forEach((puzzle, index) => {
    const perf = performances[index];
    if (!perf) return;
    
    let bucket: string;
    if (puzzle.difficulty < 0.3) bucket = 'Easy (0.0-0.3)';
    else if (puzzle.difficulty < 0.5) bucket = 'Medium (0.3-0.5)';
    else if (puzzle.difficulty < 0.7) bucket = 'Hard (0.5-0.7)';
    else bucket = 'Expert (0.7+)';
    
    difficultyBuckets[bucket].count++;
    if (perf.correct) difficultyBuckets[bucket].correct++;
  });
  
  const byDifficulty = Object.entries(difficultyBuckets)
    .filter(([_, stats]) => stats.count > 0)
    .map(([difficulty, stats]) => ({
      difficulty,
      count: stats.count,
      accuracy: stats.count > 0 ? stats.correct / stats.count : 0,
    }));
  
  // Speed analysis
  const times = performances.map(p => p.timeSpent).filter(t => t > 0);
  const speed = {
    fastest: times.length > 0 ? Math.min(...times) : 0,
    slowest: times.length > 0 ? Math.max(...times) : 0,
    average: averageTime,
  };
  
  // Generate insights
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];
  
  // Type-based insights
  Object.entries(byType).forEach(([type, stats]) => {
    if (stats.accuracy >= 0.8) {
      strengths.push(`Excellent performance on ${type} puzzles (${Math.round(stats.accuracy * 100)}% accuracy)`);
    } else if (stats.accuracy < 0.5) {
      weaknesses.push(`Struggling with ${type} puzzles (${Math.round(stats.accuracy * 100)}% accuracy)`);
      recommendations.push(`Practice more ${type} puzzles to improve your skills`);
    }
  });
  
  // Difficulty-based insights
  byDifficulty.forEach(({ difficulty, accuracy }) => {
    if (accuracy >= 0.8) {
      strengths.push(`Strong performance on ${difficulty} puzzles`);
    } else if (accuracy < 0.5 && difficulty.includes('Easy')) {
      weaknesses.push(`Found ${difficulty} puzzles challenging`);
      recommendations.push('Consider reviewing fundamental concepts');
    }
  });
  
  // Speed insights
  if (speed.average < 30000) {
    strengths.push('Fast problem-solving speed');
  } else if (speed.average > 90000) {
    weaknesses.push('Slow problem-solving (consider using hints)');
    recommendations.push('Try to work more efficiently or use hints when stuck');
  }
  
  // Accuracy insights
  if (accuracy >= 0.9) {
    strengths.push('High accuracy overall');
  } else if (accuracy < 0.6) {
    weaknesses.push('Low accuracy - many mistakes');
    recommendations.push('Take more time to think through each puzzle carefully');
  }
  
  // Hint usage insights
  if (totalHints === 0 && accuracy >= 0.8) {
    strengths.push('Completed without hints');
  } else if (totalHints > puzzles.length * 0.5) {
    weaknesses.push('Relied heavily on hints');
    recommendations.push('Try to solve puzzles independently before using hints');
  }
  
  // Default recommendations if none generated
  if (recommendations.length === 0) {
    if (accuracy >= 0.8) {
      recommendations.push('Great performance! Try increasing difficulty for more challenge');
    } else {
      recommendations.push('Continue practicing to improve your skills');
    }
  }
  
  // Progression insights
  const skillImprovements: Record<string, number> = {};
  Object.entries(byType).forEach(([type, stats]) => {
    skillImprovements[type] = stats.accuracy;
  });
  
  // Estimate games to next tier (simplified: assume ~100 XP per game on average)
  const xpPerGame = totalXP > 0 ? totalXP : 50;
  const xpNeeded = Math.max(0, 100 - (currentXP % 100)); // Simplified tier calculation
  const estimatedGamesToNextTier = Math.ceil(xpNeeded / xpPerGame);
  
  const nextMilestone = estimatedGamesToNextTier <= 1 
    ? 'You\'re very close to your next tier!'
    : `About ${estimatedGamesToNextTier} more games until next tier`;
  
  return {
    summary: {
      totalPuzzles: puzzles.length,
      correct,
      accuracy,
      totalTime,
      averageTime,
      xpGained: totalXP,
      hintsUsed: totalHints,
    },
    performance: {
      byType,
      byDifficulty,
      speed,
    },
    insights: {
      strengths,
      weaknesses,
      recommendations,
    },
    progression: {
      skillImprovements,
      nextMilestone,
      estimatedGamesToNextTier,
    },
  };
}
