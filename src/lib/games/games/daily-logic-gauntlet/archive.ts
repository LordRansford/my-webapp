/**
 * Archive System
 * 
 * Stores and retrieves completed daily puzzle sets for replay and review.
 * Uses localStorage with versioning and migration support.
 */

import type { Puzzle, DailyPuzzleSet } from './types';
import { getDailySeed, getDailySeedVariant } from '../../framework/SeededRNG';
import { generateDailyPuzzleSet } from './puzzleGenerator';

const ARCHIVE_STORAGE_KEY = 'daily-logic-gauntlet-archive';
const ARCHIVE_VERSION = 1;

export interface ArchivedPuzzleSet {
  date: string; // YYYY-MM-DD
  seed: number;
  puzzles: Puzzle[];
  completedAt: number; // Timestamp
  score: number;
  totalPuzzles: number;
  accuracy: number;
  timeSpent: number; // Milliseconds
  playerXP: number; // XP at time of completion
}

export interface ArchiveData {
  version: number;
  archivedSets: ArchivedPuzzleSet[];
  lastArchivedDate: string;
}

/**
 * Get today's date string (YYYY-MM-DD UTC)
 */
function getTodayDateString(): string {
  const today = new Date();
  const year = today.getUTCFullYear();
  const month = String(today.getUTCMonth() + 1).padStart(2, '0');
  const day = String(today.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Load archive data from localStorage
 */
export function loadArchive(): ArchiveData {
  try {
    const stored = localStorage.getItem(ARCHIVE_STORAGE_KEY);
    if (!stored) {
      return {
        version: ARCHIVE_VERSION,
        archivedSets: [],
        lastArchivedDate: '',
      };
    }
    
    const data = JSON.parse(stored) as ArchiveData;
    
    // Migrate if needed
    if (data.version !== ARCHIVE_VERSION) {
      return migrateArchive(data);
    }
    
    return data;
  } catch (error) {
    console.error('Failed to load archive:', error);
    return {
      version: ARCHIVE_VERSION,
      archivedSets: [],
      lastArchivedDate: '',
    };
  }
}

/**
 * Save archive data to localStorage
 */
export function saveArchive(data: ArchiveData): void {
  try {
    localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save archive:', error);
  }
}

/**
 * Migrate archive data to current version
 */
function migrateArchive(data: ArchiveData): ArchiveData {
  // Future: Add migration logic as archive structure evolves
  return {
    ...data,
    version: ARCHIVE_VERSION,
  };
}

/**
 * Archive a completed daily puzzle set
 */
export function archivePuzzleSet(
  puzzles: Puzzle[],
  score: number,
  timeSpent: number,
  playerXP: number
): void {
  const today = getTodayDateString();
  const seed = getDailySeed();
  
  const archive = loadArchive();
  
  // Check if today's set is already archived
  const existingIndex = archive.archivedSets.findIndex(set => set.date === today);
  if (existingIndex !== -1) {
    // Update existing archive entry (player may have improved score)
    archive.archivedSets[existingIndex] = {
      date: today,
      seed,
      puzzles: puzzles.map(p => ({ ...p })), // Deep copy
      completedAt: Date.now(),
      score,
      totalPuzzles: puzzles.length,
      accuracy: score / puzzles.length,
      timeSpent,
      playerXP,
    };
  } else {
    // Add new archive entry
    archive.archivedSets.push({
      date: today,
      seed,
      puzzles: puzzles.map(p => ({ ...p })), // Deep copy
      completedAt: Date.now(),
      score,
      totalPuzzles: puzzles.length,
      accuracy: score / puzzles.length,
      timeSpent,
      playerXP,
    });
  }
  
  // Sort by date descending (newest first)
  archive.archivedSets.sort((a, b) => b.date.localeCompare(a.date));
  
  // Keep only last 365 days (1 year)
  if (archive.archivedSets.length > 365) {
    archive.archivedSets = archive.archivedSets.slice(0, 365);
  }
  
  archive.lastArchivedDate = today;
  saveArchive(archive);
}

/**
 * Get archived puzzle set for a specific date
 */
export function getArchivedSet(date: string): ArchivedPuzzleSet | null {
  const archive = loadArchive();
  return archive.archivedSets.find(set => set.date === date) || null;
}

/**
 * Get all archived sets (sorted by date, newest first)
 */
export function getAllArchivedSets(): ArchivedPuzzleSet[] {
  const archive = loadArchive();
  return [...archive.archivedSets];
}

/**
 * Check if a date is archived
 */
export function isDateArchived(date: string): boolean {
  const archive = loadArchive();
  return archive.archivedSets.some(set => set.date === date);
}

/**
 * Reconstruct puzzle set from archive (for replay)
 */
export function reconstructPuzzleSet(archivedSet: ArchivedPuzzleSet): Puzzle[] {
  // Return the stored puzzles directly
  return archivedSet.puzzles.map(p => ({ ...p }));
}

/**
 * Regenerate puzzle set from seed (for comparison/verification)
 */
export function regeneratePuzzleSetFromSeed(seed: number, playerTier: string = 'novice'): Puzzle[] {
  return generateDailyPuzzleSet(seed, playerTier as any, 10);
}

/**
 * Get archive statistics
 */
export interface ArchiveStats {
  totalArchived: number;
  totalPerfectScores: number;
  averageScore: number;
  averageAccuracy: number;
  bestScore: number;
  longestStreak: number;
  firstArchivedDate: string | null;
  lastArchivedDate: string | null;
}

export function getArchiveStats(): ArchiveStats {
  const archive = loadArchive();
  const sets = archive.archivedSets;
  
  if (sets.length === 0) {
    return {
      totalArchived: 0,
      totalPerfectScores: 0,
      averageScore: 0,
      averageAccuracy: 0,
      bestScore: 0,
      longestStreak: 0,
      firstArchivedDate: null,
      lastArchivedDate: null,
    };
  }
  
  const perfectScores = sets.filter(s => s.score === s.totalPuzzles).length;
  const totalScore = sets.reduce((sum, s) => sum + s.score, 0);
  const totalAccuracy = sets.reduce((sum, s) => sum + s.accuracy, 0);
  const bestScore = Math.max(...sets.map(s => s.score));
  
  // Calculate longest streak
  let longestStreak = 0;
  let currentStreak = 0;
  const sortedDates = sets.map(s => s.date).sort().reverse();
  
  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      currentStreak = 1;
    } else {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreak++;
      } else {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      }
    }
  }
  longestStreak = Math.max(longestStreak, currentStreak);
  
  return {
    totalArchived: sets.length,
    totalPerfectScores: perfectScores,
    averageScore: totalScore / sets.length,
    averageAccuracy: totalAccuracy / sets.length,
    bestScore,
    longestStreak,
    firstArchivedDate: sortedDates[sortedDates.length - 1] || null,
    lastArchivedDate: sortedDates[0] || null,
  };
}

/**
 * Clear archive (for testing/reset)
 */
export function clearArchive(): void {
  localStorage.removeItem(ARCHIVE_STORAGE_KEY);
}
