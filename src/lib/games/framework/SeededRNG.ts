/**
 * Seeded Random Number Generator
 * 
 * Uses Linear Congruential Generator (LCG) for deterministic randomness.
 * Same seed always produces same sequence - essential for daily puzzles and replays.
 * 
 * Based on technical architecture specification for gold-standard implementation.
 */

export class SeededRNG {
  private state: number;
  
  constructor(seed: number) {
    // Ensure seed is positive integer
    this.state = Math.abs(Math.floor(seed)) || 1;
  }
  
  /**
   * Generate next random number [0, 1)
   */
  next(): number {
    // LCG: (a * state + c) mod m
    // Using constants from Numerical Recipes
    this.state = (this.state * 1664525 + 1013904223) % 2**32;
    return this.state / 2**32;
  }
  
  /**
   * Generate random integer in range [min, max] (inclusive)
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
  
  /**
   * Generate random float in range [min, max)
   */
  nextFloat(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
  
  /**
   * Shuffle array deterministically (Fisher-Yates)
   */
  shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  
  /**
   * Weighted random selection
   * @param items Array of items to choose from
   * @param weights Array of weights (must match items length)
   * @returns Selected item
   */
  weightedChoice<T>(items: T[], weights: number[]): T {
    if (items.length !== weights.length) {
      throw new Error('Items and weights arrays must have same length');
    }
    
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    if (totalWeight === 0) {
      throw new Error('Total weight must be greater than 0');
    }
    
    let random = this.next() * totalWeight;
    
    for (let i = 0; i < items.length; i++) {
      random -= weights[i];
      if (random <= 0) return items[i];
    }
    
    // Fallback (should never reach here, but TypeScript requires it)
    return items[items.length - 1];
  }
  
  /**
   * Choose random item from array
   */
  choice<T>(array: T[]): T {
    if (array.length === 0) {
      throw new Error('Cannot choose from empty array');
    }
    return array[this.nextInt(0, array.length - 1)];
  }
  
  /**
   * Sample n items from array without replacement
   */
  sample<T>(array: T[], n: number): T[] {
    if (n > array.length) {
      throw new Error('Sample size cannot be larger than array length');
    }
    
    const indices = new Set<number>();
    const result: T[] = [];
    
    while (indices.size < n) {
      const index = this.nextInt(0, array.length - 1);
      if (!indices.has(index)) {
        indices.add(index);
        result.push(array[index]);
      }
    }
    
    return result;
  }
  
  /**
   * Get current state (for save/restore)
   */
  getState(): number {
    return this.state;
  }
  
  /**
   * Restore state (for replay)
   */
  setState(state: number): void {
    this.state = Math.abs(Math.floor(state)) || 1;
  }
  
  /**
   * Create a new RNG instance with same seed (for testing/debugging)
   */
  clone(): SeededRNG {
    const cloned = new SeededRNG(this.state);
    return cloned;
  }
}

/**
 * Generate daily seed from date string (YYYY-MM-DD UTC)
 */
export function getDailySeed(): number {
  const today = new Date();
  const year = today.getUTCFullYear();
  const month = String(today.getUTCMonth() + 1).padStart(2, '0');
  const day = String(today.getUTCDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  
  // Simple hash function (FNV-1a inspired)
  let hash = 2166136261; // FNV offset basis
  for (let i = 0; i < dateStr.length; i++) {
    hash ^= dateStr.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  
  return Math.abs(hash >>> 0); // Convert to unsigned 32-bit integer
}

/**
 * Generate variant seed for different difficulty tiers
 * Same base seed with different variants produces different but deterministic sequences
 */
export function getDailySeedVariant(baseSeed: number, variant: string): number {
  let hash = 2166136261;
  for (let i = 0; i < variant.length; i++) {
    hash ^= variant.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return (baseSeed ^ hash) >>> 0; // XOR for variant
}

/**
 * Hash string to number (simple implementation)
 */
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}
