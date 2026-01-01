/**
 * Games Framework - Core Exports
 * 
 * Central export point for all framework components
 */

// Core types
export * from './types';

// RNG System
export { SeededRNG, getDailySeed, getDailySeedVariant, hashString } from './SeededRNG';

// State Management
export { StateManager } from './StateManager';

// Player Modeling
export {
  type PlayerCapabilityModel,
  type PuzzlePerformance,
  createDefaultPlayerModel,
  updatePlayerModel,
  calculateAverageSkill,
  predictOptimalDifficulty,
  calculateSkillMatch,
} from './PlayerModel';

// Adaptive Difficulty
export { AdaptiveDifficultyEngine } from './AdaptiveDifficultyEngine';

// Persistence
export {
  PersistenceManager,
  type GameSave,
  type PlayerProfile,
} from './PersistenceManager';

// Existing framework components
export { DifficultyEngine } from './DifficultyEngine';
export { ExplainabilityEngine } from './ExplainabilityEngine';
export { InputLayer } from './InputLayer';
export { useGameAnalytics } from './useGameAnalytics';
export { usePerformanceMonitor } from './usePerformanceMonitor';
export { useReducedMotion } from './useReducedMotion';

// React components
export { default as GameShell } from './GameShell';
export { GameErrorBoundary } from './GameErrorBoundary';
