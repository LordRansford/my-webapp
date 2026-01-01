/**
 * Achievement Definitions
 */

import type { AchievementDefinition, AchievementContext } from "./types";

export const CROSS_GAME_ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'first-game',
    name: 'First Game',
    description: 'Complete your first game',
    category: 'progress',
    rarity: 'common',
    icon: '🎮',
    checkCondition: (ctx) => (ctx.gamesCompleted || 0) >= 1,
  },
  {
    id: 'streak-3',
    name: 'Getting Started',
    description: 'Maintain a 3-day streak',
    category: 'streak',
    rarity: 'common',
    icon: '🔥',
    checkCondition: (ctx) => (ctx.currentStreak || 0) >= 3,
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    category: 'streak',
    rarity: 'uncommon',
    icon: '💪',
    checkCondition: (ctx) => (ctx.currentStreak || 0) >= 7,
  },
  {
    id: 'streak-30',
    name: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    category: 'streak',
    rarity: 'rare',
    icon: '👑',
    checkCondition: (ctx) => (ctx.currentStreak || 0) >= 30,
  },
  {
    id: 'games-10',
    name: 'Dedicated Player',
    description: 'Complete 10 games',
    category: 'milestone',
    rarity: 'common',
    icon: '🎯',
    progressCondition: (ctx) => Math.min(1, (ctx.gamesCompleted || 0) / 10),
    checkCondition: (ctx) => (ctx.gamesCompleted || 0) >= 10,
  },
  {
    id: 'games-100',
    name: 'Centurion',
    description: 'Complete 100 games',
    category: 'milestone',
    rarity: 'epic',
    icon: '🏆',
    progressCondition: (ctx) => Math.min(1, (ctx.gamesCompleted || 0) / 100),
    checkCondition: (ctx) => (ctx.gamesCompleted || 0) >= 100,
  },
];

/**
 * Get all achievement definitions
 */
export function getAllAchievementDefinitions(): AchievementDefinition[] {
  return CROSS_GAME_ACHIEVEMENTS;
}

/**
 * Get achievement definition by ID
 */
export function getAchievementDefinition(id: string): AchievementDefinition | undefined {
  return CROSS_GAME_ACHIEVEMENTS.find(a => a.id === id);
}

/**
 * Get achievements by game ID (or cross-game if null)
 */
export function getAchievementsByGame(gameId: string | null): AchievementDefinition[] {
  return CROSS_GAME_ACHIEVEMENTS.filter(a => a.gameId === gameId || (!a.gameId && gameId === null));
}

/**
 * Get cross-game achievements
 */
export function getCrossGameAchievements(): AchievementDefinition[] {
  return CROSS_GAME_ACHIEVEMENTS.filter(a => !a.gameId);
}