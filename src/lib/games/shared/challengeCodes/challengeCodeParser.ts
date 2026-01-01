/**
 * Challenge Code Parser
 * 
 * Parses challenge codes in format: GAME-YYYY-MM-DD-XXXX
 */

import { hashString } from "@/lib/games/framework/SeededRNG";
import type { ChallengeCode, ParseResult } from "./types";

const CODE_PATTERN = /^([A-Z]{4})-(\d{4}-\d{2}-\d{2})-([A-Z0-9]{4})$/;

/**
 * Parse challenge code string
 */
export function parseChallengeCode(code: string): ParseResult {
  const match = code.match(CODE_PATTERN);
  
  if (!match) {
    return {
      success: false,
      error: `Invalid code format. Expected: GAME-YYYY-MM-DD-XXXX, got: ${code}`,
    };
  }

  const [, gameId, date, hash] = match;

  // Validate game ID
  const validGameIds: string[] = ['DLG', 'COPT', 'PATT', 'DEDU', 'FLOW', 'MEMO'];
  if (!validGameIds.includes(gameId)) {
    return {
      success: false,
      error: `Unknown game ID: ${gameId}`,
    };
  }

  // Validate date format
  const dateMatch = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!dateMatch) {
    return {
      success: false,
      error: `Invalid date format: ${date}`,
    };
  }

  // Extract seed from hash (simplified - in real implementation, seed would be stored separately)
  // For now, we'll use a hash of the code to derive a seed
  const seed = hashString(code);

  return {
    success: true,
    code: {
      code,
      gameId: gameId as ChallengeCode['gameId'],
      date,
      seed,
      hash,
    },
  };
}

/**
 * Validate challenge code
 */
export function validateChallengeCode(code: string): boolean {
  const result = parseChallengeCode(code);
  return result.success;
}