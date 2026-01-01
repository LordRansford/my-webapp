/**
 * Challenge Code Loader
 * 
 * Loads challenge data from a challenge code
 */

import { getChallengeCode } from "./challengeCodeManager";
import { getGameSlug } from "./challengeCodeGenerator";
import type { ChallengeCode } from "./types";

/**
 * Load challenge code data with seed
 */
export function loadChallengeFromCode(codeString: string): {
  code: ChallengeCode;
  seed: number;
  gameSlug: string;
} | null {
  const stored = getChallengeCode(codeString);
  
  if (!stored) {
    // Try to parse and derive seed (fallback for codes not yet stored)
    const { parseChallengeCode } = require("./challengeCodeParser");
    const parsed = parseChallengeCode(codeString);
    
    if (!parsed.success || !parsed.code) {
      return null;
    }
    
    // Use the seed from parsed code (which derives it from hash)
    // For daily challenges, we can also try to get from daily challenge system
    const gameSlug = getGameSlug(parsed.code.gameId);
    const { getDailyChallenge } = require("../dailyChallenges/dailyChallengeStorage");
    const dailyChallenge = getDailyChallenge(gameSlug, parsed.code.date);
    
    if (dailyChallenge) {
      return {
        code: parsed.code,
        seed: dailyChallenge.seed,
        gameSlug,
      };
    }
    
    // Fallback: use hash-derived seed (less ideal but works)
    return {
      code: parsed.code,
      seed: parsed.code.seed,
      gameSlug,
    };
  }
  
  const gameSlug = getGameSlug(stored.gameId);
  
  return {
    code: {
      code: stored.code,
      gameId: stored.gameId,
      date: stored.date,
      seed: stored.seed,
      hash: stored.code.split('-')[2] || '',
    },
    seed: stored.seed,
    gameSlug,
  };
}