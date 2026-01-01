/**
 * Challenge Code Manager
 * 
 * Manages storage and retrieval of challenge codes
 */

import type { ChallengeCode, ChallengeCodeStorage } from "./types";

const STORAGE_KEY_PREFIX = 'ransford-challenge-codes';

/**
 * Get storage key for a challenge code
 */
function getStorageKey(code: string): string {
  return `${STORAGE_KEY_PREFIX}-${code}`;
}

/**
 * Store challenge code data (internal)
 */
function storeChallengeCodeData(codeData: ChallengeCodeStorage): void {
  try {
    const key = getStorageKey(codeData.code);
    localStorage.setItem(key, JSON.stringify(codeData));
  } catch (error) {
    console.error('Error storing challenge code:', error);
  }
}

/**
 * Store challenge code (public API - simple version)
 */
export function storeChallengeCode(code: ChallengeCode): void {
  const storage: ChallengeCodeStorage = {
    code: code.code,
    gameId: code.gameId,
    date: code.date,
    seed: code.seed,
  };
  
  storeChallengeCodeData(storage);
}

/**
 * Store challenge code with full data
 */
export function storeChallengeCodeWithData(codeData: ChallengeCodeStorage): void {
  storeChallengeCodeData(codeData);
}

/**
 * Get challenge code data
 */
export function getChallengeCode(code: string): ChallengeCodeStorage | null {
  try {
    const key = getStorageKey(code);
    const stored = localStorage.getItem(key);
    
    if (!stored) {
      return null;
    }
    
    return JSON.parse(stored) as ChallengeCodeStorage;
  } catch (error) {
    console.error('Error retrieving challenge code:', error);
    return null;
  }
}

/**
 * Get all stored challenge codes
 */
export function getAllChallengeCodes(): ChallengeCodeStorage[] {
  const codes: ChallengeCodeStorage[] = [];
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_KEY_PREFIX)) {
        const stored = localStorage.getItem(key);
        if (stored) {
          try {
            codes.push(JSON.parse(stored) as ChallengeCodeStorage);
          } catch (e) {
            // Skip invalid entries
          }
        }
      }
    }
  } catch (error) {
    console.error('Error retrieving all challenge codes:', error);
  }
  
  return codes;
}