/**
 * Challenge Code Generator
 * 
 * Generates challenge codes in format: GAME-YYYY-MM-DD-XXXX
 */

import { hashString } from "@/lib/games/framework/SeededRNG";
import type { ChallengeCode, GameId } from "./types";

const GAME_ID_MAP: Record<string, GameId> = {
  'daily-logic-gauntlet': 'DLG',
  'constraint-optimizer': 'COPT',
  'pattern-architect': 'PATT',
  'deduction-grid': 'DEDU',
  'flow-planner': 'FLOW',
  'memory-palace': 'MEMO',
};

const REVERSE_GAME_ID_MAP: Record<GameId, string> = {
  'DLG': 'daily-logic-gauntlet',
  'COPT': 'constraint-optimizer',
  'PATT': 'pattern-architect',
  'DEDU': 'deduction-grid',
  'FLOW': 'flow-planner',
  'MEMO': 'memory-palace',
  'ALOC': 'allocation-architect',
};

/**
 * Generate 4-character hash from seed
 */
function generateHash(seed: number): string {
  const hash = hashString(`challenge-${seed}`);
  // Convert to base36 and take first 4 chars, uppercase
  return hash.toString(36).slice(0, 4).toUpperCase().padStart(4, '0');
}

/**
 * Generate today's date string (YYYY-MM-DD)
 */
function getTodayDateString(): string {
  const today = new Date();
  const year = today.getUTCFullYear();
  const month = String(today.getUTCMonth() + 1).padStart(2, '0');
  const day = String(today.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Generate challenge code for a game and date
 */
export function generateChallengeCode(
  gameSlug: string,
  date: string,
  seed: number
): ChallengeCode {
  const gameId = GAME_ID_MAP[gameSlug];
  if (!gameId) {
    throw new Error(`Unknown game: ${gameSlug}`);
  }

  const hash = generateHash(seed);
  const code = `${gameId}-${date}-${hash}`;

  return {
    code,
    gameId,
    date,
    seed,
    hash,
  };
}

/**
 * Generate today's challenge code for a game
 */
export function generateTodayChallengeCode(gameSlug: string, seed: number): ChallengeCode {
  const date = getTodayDateString();
  return generateChallengeCode(gameSlug, date, seed);
}

/**
 * Get game slug from GameId
 */
export function getGameSlug(gameId: GameId): string {
  return REVERSE_GAME_ID_MAP[gameId];
}

/**
 * Get GameId from game slug
 */
export function getGameId(gameSlug: string): GameId | null {
  return GAME_ID_MAP[gameSlug] || null;
}