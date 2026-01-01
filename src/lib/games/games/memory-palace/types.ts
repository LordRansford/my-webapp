/**
 * Memory Palace Types
 */

export interface MemoryItem {
  id: string;
  content: string;
  type: 'word' | 'fact' | 'number' | 'pattern';
  strength: number;
  lastReviewed: number;
  nextReview: number;
  reviewCount: number;
}

export interface MemoryChallenge {
  id: string;
  seed: number;
  name: string;
  description: string;
  items: MemoryItem[];
  technique: 'loci' | 'chunking' | 'association' | 'visualization';
  difficulty: 'novice' | 'learner' | 'memorizer' | 'memory-master' | 'palace-master';
  tier: number;
}

export interface ReviewResult {
  correct: number;
  total: number;
  score: number;
}

export interface PlayerProgress {
  xp: number;
  tier: 'novice' | 'learner' | 'memorizer' | 'memory-master' | 'palace-master';
  challengesCompleted: number;
  personalBests: Record<string, number>;
  achievements: string[];
}