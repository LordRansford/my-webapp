/**
 * Challenge Code Helper Utilities
 */

import type { ChallengeCode } from "../challengeCodes/types";

/**
 * Parse challenge code string into parts
 */
export function parseChallengeCodeString(code: string): {
  gameId: string;
  date: string;
  hash: string;
} | null {
  const match = code.match(/^([A-Z]{4})-(\d{4}-\d{2}-\d{2})-([A-Z0-9]{4})$/);
  if (!match) return null;
  
  return {
    gameId: match[1],
    date: match[2],
    hash: match[3],
  };
}

/**
 * Create ChallengeCode from code string and seed
 */
export function createChallengeCodeFromString(
  code: string,
  seed: number
): ChallengeCode | null {
  const parts = parseChallengeCodeString(code);
  if (!parts) return null;
  
  const gameIdMap: Record<string, any> = {
    'DLG': 'DLG',
    'COPT': 'COPT',
    'PATT': 'PATT',
    'DEDU': 'DEDU',
    'FLOW': 'FLOW',
    'MEMO': 'MEMO',
  };
  
  const gameId = gameIdMap[parts.gameId];
  if (!gameId) return null;
  
  return {
    code,
    gameId: gameId as ChallengeCode['gameId'],
    date: parts.date,
    seed,
    hash: parts.hash,
  };
}