/**
 * Daily Logic Gauntlet - Exports
 */

export { default } from './DailyLogicGauntlet';
export { default as DailyLogicGauntletEnhanced } from './DailyLogicGauntletEnhanced';

// Export types
export * from './types';

// Export generators
export * from './puzzleGenerator';

// Export progression
export * from './progression';

// Export streak tracker
export * from './streakTracker';

// Export analysis report
export * from './analysisReport';
export { AnalysisReportComponent } from './AnalysisReportComponent';

// Archive System
export {
  archivePuzzleSet,
  getArchivedSet,
  getAllArchivedSets,
  isDateArchived,
  reconstructPuzzleSet,
  regeneratePuzzleSetFromSeed,
  getArchiveStats,
  clearArchive,
  type ArchivedPuzzleSet,
  type ArchiveData,
  type ArchiveStats,
} from './archive';

// Tutorial System
export {
  TUTORIAL_STEPS,
  createDefaultTutorialState,
  loadTutorialState,
  saveTutorialState,
  shouldShowTutorial,
  completeTutorialStep,
  skipTutorial,
  resetTutorial,
  getCurrentTutorialStep,
  nextTutorialStep,
  previousTutorialStep,
  startTutorial,
  type TutorialStep,
  type TutorialStepData,
  type TutorialState,
} from './tutorial';

// Achievement System
export {
  ALL_ACHIEVEMENTS,
  createDefaultAchievementData,
  loadAchievements,
  saveAchievements,
  isAchievementUnlocked,
  unlockAchievement,
  updateAchievementProgress,
  getAchievementProgress,
  checkAndUnlockAchievements,
  getUnlockedAchievements,
  getAchievement,
  getAchievementsByCategory,
  getAchievementStats,
  clearAchievements,
  type AchievementId,
  type Achievement,
  type AchievementData,
  type AchievementCheckContext,
  type AchievementStats,
} from './achievements';
