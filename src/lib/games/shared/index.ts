/**
 * Shared Games Infrastructure
 */

export * from './challengeCodes';
export * from './dailyChallenges';
// Re-export streakTracking but exclude duplicates
export * from './streakTracking/types';
export * from './streakTracking/streakStorage';
// Only export from streakManager (high-level API) to avoid duplicates
export { getStreakDataForGame, updateStreakForGame } from './streakTracking/streakManager';
// Export dateUtils functions with explicit names to avoid conflicts
export { getCurrentMonthString, getDaysDifference } from './streakTracking/dateUtils';
export * from './achievements';
export * from './scoreComparison';
export * from './variableRewards';