/**
 * Memory Challenge Generator
 */

import { SeededRNG } from "@/lib/games/framework/SeededRNG";
import type { MemoryChallenge, MemoryItem } from "./types";

export function generateChallenge(params: {
  seed: number;
  difficulty: MemoryChallenge['difficulty'];
}): MemoryChallenge {
  const rng = new SeededRNG(params.seed);
  const itemCount = getItemCountForDifficulty(params.difficulty);
  const technique = getTechniqueForDifficulty(params.difficulty, rng);
  
  const items: MemoryItem[] = [];
  const words = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew'];
  const facts = ['Paris is the capital of France', 'Water boils at 100°C', 'The speed of light is 299,792,458 m/s'];
  const numbers = ['314', '2718', '1618', '1414'];
  
  for (let i = 0; i < itemCount; i++) {
    const type = getItemTypeForDifficulty(params.difficulty, rng);
    let content = '';
    
    switch (type) {
      case 'word':
        content = words[Math.floor(rng.next() * words.length)];
        break;
      case 'fact':
        content = facts[Math.floor(rng.next() * facts.length)];
        break;
      case 'number':
        content = numbers[Math.floor(rng.next() * numbers.length)];
        break;
      default:
        content = `Item ${i + 1}`;
    }
    
    items.push({
      id: `item-${i}`,
      content,
      type,
      strength: 0,
      lastReviewed: 0,
      nextReview: Date.now(),
      reviewCount: 0,
    });
  }
  
  return {
    id: `memory-${params.seed}`,
    seed: params.seed,
    name: `Memory Challenge ${params.seed}`,
    description: `Memorize ${itemCount} items using the ${technique} technique.`,
    items,
    technique,
    difficulty: params.difficulty,
    tier: getTierForDifficulty(params.difficulty),
  };
}

function getItemCountForDifficulty(difficulty: MemoryChallenge['difficulty']): number {
  switch (difficulty) {
    case 'novice':
      return 3;
    case 'learner':
      return 5;
    case 'memorizer':
      return 7;
    case 'memory-master':
      return 10;
    case 'palace-master':
      return 15;
    default:
      return 5;
  }
}

function getTechniqueForDifficulty(
  difficulty: MemoryChallenge['difficulty'],
  rng: SeededRNG
): MemoryChallenge['technique'] {
  const techniques: MemoryChallenge['technique'][] = ['loci', 'chunking', 'association', 'visualization'];
  return techniques[Math.floor(rng.next() * techniques.length)];
}

function getItemTypeForDifficulty(
  difficulty: MemoryChallenge['difficulty'],
  rng: SeededRNG
): MemoryItem['type'] {
  const types: MemoryItem['type'][] = ['word', 'fact', 'number', 'pattern'];
  return types[Math.floor(rng.next() * types.length)];
}

function getTierForDifficulty(difficulty: MemoryChallenge['difficulty']): number {
  switch (difficulty) {
    case 'novice':
      return 0;
    case 'learner':
      return 100;
    case 'memorizer':
      return 300;
    case 'memory-master':
      return 600;
    case 'palace-master':
      return 1000;
    default:
      return 0;
  }
}