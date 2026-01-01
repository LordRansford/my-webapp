# Daily Logic Gauntlet - Technical Architecture

**Version:** 2.0 (Gold Standard Exceeded)  
**Purpose:** Technical specification for implementing gold-standard-exceeding features

---

## Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────┐
│                    Game Client (Browser)                │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Game UI    │  │  State Mgmt  │  │  Analytics   │ │
│  │  Components  │  │   (Zustand)  │  │   Engine     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Puzzle     │  │  Player      │  │  Reasoning    │ │
│  │  Generator   │  │   Model      │  │  Visualizer   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Difficulty  │  │  Community   │  │  Persistence  │ │
│  │  Engine      │  │   Manager    │  │  (localStorage│ │
│  └──────────────┘  └──────────────┘  │   + IndexedDB)│ │
│                                      └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                          │ (Optional, Async)
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Server (Next.js API Routes)                │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Leaderboard │  │  Community   │  │  Analytics   │ │
│  │   Service    │  │   Puzzles    │  │  Aggregator  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## Core Systems

### 1. Deterministic RNG System

**Implementation**:
```typescript
/**
 * Seeded Random Number Generator
 * Uses Linear Congruential Generator (LCG) for deterministic randomness
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
   * Generate random integer in range [min, max]
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
   * Shuffle array deterministically
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
   */
  weightedChoice<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = this.next() * totalWeight;
    
    for (let i = 0; i < items.length; i++) {
      random -= weights[i];
      if (random <= 0) return items[i];
    }
    return items[items.length - 1];
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
    this.state = state;
  }
}

/**
 * Daily seed generation
 */
export function getDailySeed(): number {
  const today = new Date();
  const year = today.getUTCFullYear();
  const month = String(today.getUTCMonth() + 1).padStart(2, '0');
  const day = String(today.getUTCDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash);
}

/**
 * Variant seed for different difficulty tiers
 */
export function getDailySeedVariant(baseSeed: number, variant: string): number {
  let hash = 0;
  for (let i = 0; i < variant.length; i++) {
    const char = variant.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return (baseSeed ^ hash) >>> 0; // XOR for variant
}
```

---

### 2. Player Modeling System

**Implementation**:
```typescript
/**
 * Multi-dimensional player capability model
 */
export interface PlayerCapabilityModel {
  // Skill dimensions (0-1, normalized)
  logicSkill: number;
  patternSkill: number;
  deductionSkill: number;
  constraintSkill: number;
  speedSkill: number;
  
  // Behavioral metrics
  confidence: number;           // Based on hesitation patterns
  riskTolerance: number;        // Based on hint usage
  persistence: number;          // Based on retry behavior
  
  // Weakness identification
  weaknessAreas: string[];      // Puzzle types where performance is low
  strengthAreas: string[];       // Puzzle types where performance is high
  
  // Learning patterns
  improvementVelocity: number;   // Rate of skill improvement
  plateauDetected: boolean;      // Stagnation detection
  learningStyle: 'visual' | 'textual' | 'interactive' | 'mixed';
  
  // Temporal data
  lastUpdated: number;
  dataPoints: number;            // Number of puzzles used to build model
}

/**
 * Update player model based on performance
 */
export function updatePlayerModel(
  model: PlayerCapabilityModel,
  performance: PuzzlePerformance
): PlayerCapabilityModel {
  const alpha = 0.1; // Learning rate
  const dataPoints = model.dataPoints + 1;
  
  // Update skill dimensions based on puzzle type
  const skillKey = `${performance.puzzleType}Skill` as keyof PlayerCapabilityModel;
  if (skillKey in model) {
    const currentSkill = model[skillKey as keyof PlayerCapabilityModel] as number;
    const performanceScore = performance.correct ? 1 : 0;
    const newSkill = currentSkill * (1 - alpha) + performanceScore * alpha;
    (model[skillKey as keyof PlayerCapabilityModel] as number) = newSkill;
  }
  
  // Update confidence based on hesitation
  const hesitationScore = 1 - (performance.hesitationTime / 10000); // Normalize to 0-1
  model.confidence = model.confidence * (1 - alpha) + hesitationScore * alpha;
  
  // Update weakness/strength areas
  if (performance.correct) {
    if (!model.strengthAreas.includes(performance.puzzleType)) {
      model.strengthAreas.push(performance.puzzleType);
    }
    model.weaknessAreas = model.weaknessAreas.filter(a => a !== performance.puzzleType);
  } else {
    if (!model.weaknessAreas.includes(performance.puzzleType)) {
      model.weaknessAreas.push(performance.puzzleType);
    }
  }
  
  // Update improvement velocity
  const previousAvgSkill = calculateAverageSkill(model);
  model.improvementVelocity = (calculateAverageSkill(model) - previousAvgSkill) / dataPoints;
  
  // Detect plateau
  model.plateauDetected = Math.abs(model.improvementVelocity) < 0.001 && dataPoints > 20;
  
  model.lastUpdated = Date.now();
  model.dataPoints = dataPoints;
  
  return model;
}

/**
 * Predict optimal difficulty for player
 */
export function predictOptimalDifficulty(
  model: PlayerCapabilityModel,
  puzzleType: string
): number {
  // Base difficulty on skill level for this puzzle type
  const skillKey = `${puzzleType}Skill` as keyof PlayerCapabilityModel;
  const skill = (model[skillKey as keyof PlayerCapabilityModel] as number) || 0.5;
  
  // Adjust for confidence
  const confidenceAdjustment = (model.confidence - 0.5) * 0.2;
  
  // Adjust for weakness areas
  const weaknessPenalty = model.weaknessAreas.includes(puzzleType) ? -0.1 : 0;
  
  // Target: slightly above current skill (optimal challenge)
  const targetDifficulty = skill + 0.15 + confidenceAdjustment + weaknessPenalty;
  
  // Clamp to valid range
  return Math.max(0.1, Math.min(0.95, targetDifficulty));
}
```

---

### 3. Adaptive Difficulty Engine

**Implementation**:
```typescript
/**
 * Adaptive difficulty engine with predictive modeling
 */
export class AdaptiveDifficultyEngine {
  private playerModel: PlayerCapabilityModel;
  private history: PerformanceHistory[];
  
  constructor(initialModel: PlayerCapabilityModel) {
    this.playerModel = initialModel;
    this.history = [];
  }
  
  /**
   * Calculate next puzzle difficulty
   */
  calculateNextDifficulty(
    puzzleType: string,
    currentPosition: number,
    totalPuzzles: number
  ): number {
    // Base difficulty from player model
    const predictedDifficulty = predictOptimalDifficulty(this.playerModel, puzzleType);
    
    // Adjust for position in gauntlet (progressive difficulty)
    const positionFactor = currentPosition / totalPuzzles;
    const progressionDifficulty = 0.3 + (positionFactor * 0.5);
    
    // Blend predicted and progression
    const blendedDifficulty = (
      predictedDifficulty * 0.7 + 
      progressionDifficulty * 0.3
    );
    
    // Adjust for recent performance
    if (this.history.length > 0) {
      const recentPerformance = this.getRecentPerformance(5);
      const performanceAdjustment = this.calculatePerformanceAdjustment(recentPerformance);
      return Math.max(0.1, Math.min(0.95, blendedDifficulty + performanceAdjustment));
    }
    
    return blendedDifficulty;
  }
  
  /**
   * Update engine after puzzle completion
   */
  update(performance: PuzzlePerformance): void {
    this.playerModel = updatePlayerModel(this.playerModel, performance);
    this.history.push({
      timestamp: Date.now(),
      performance,
      difficulty: performance.difficulty,
    });
    
    // Keep only last 50 entries
    if (this.history.length > 50) {
      this.history.shift();
    }
  }
  
  /**
   * Get recent performance metrics
   */
  private getRecentPerformance(count: number): PuzzlePerformance[] {
    return this.history
      .slice(-count)
      .map(h => h.performance);
  }
  
  /**
   * Calculate adjustment based on recent performance
   */
  private calculatePerformanceAdjustment(
    recentPerformance: PuzzlePerformance[]
  ): number {
    if (recentPerformance.length === 0) return 0;
    
    const accuracy = recentPerformance.filter(p => p.correct).length / recentPerformance.length;
    
    // If accuracy too high (>90%), increase difficulty
    if (accuracy > 0.9) return 0.1;
    
    // If accuracy too low (<60%), decrease difficulty
    if (accuracy < 0.6) return -0.1;
    
    // Otherwise, maintain current level
    return 0;
  }
  
  getModel(): PlayerCapabilityModel {
    return { ...this.playerModel };
  }
}
```

---

### 4. Reasoning Visualization Engine

**Implementation**:
```typescript
/**
 * Reasoning step in logical chain
 */
export interface ReasoningStep {
  stepNumber: number;
  timestamp: number;
  premise: string;
  inference: string;
  conclusion: string;
  confidence: number;        // 0-1, player's confidence
  correctness: boolean;
  alternatives: string[];    // Alternative conclusions considered
  visualElements: {
    type: 'constraint' | 'deduction' | 'elimination' | 'pattern';
    data: unknown;
  }[];
}

/**
 * Reasoning tree structure
 */
export interface ReasoningTree {
  root: ReasoningStep;
  branches: ReasoningTree[];
  depth: number;
  isComplete: boolean;
}

/**
 * Reasoning visualization engine
 */
export class ReasoningVisualizer {
  private steps: ReasoningStep[] = [];
  private tree: ReasoningTree | null = null;
  
  /**
   * Record a reasoning step
   */
  recordStep(step: Omit<ReasoningStep, 'stepNumber' | 'timestamp'>): void {
    const fullStep: ReasoningStep = {
      ...step,
      stepNumber: this.steps.length + 1,
      timestamp: Date.now(),
    };
    
    this.steps.push(fullStep);
    this.rebuildTree();
  }
  
  /**
   * Rebuild reasoning tree from steps
   */
  private rebuildTree(): void {
    if (this.steps.length === 0) {
      this.tree = null;
      return;
    }
    
    // Build tree structure
    this.tree = {
      root: this.steps[0],
      branches: this.buildBranches(0, 1),
      depth: this.calculateDepth(),
      isComplete: this.steps.every(s => s.correctness !== undefined),
    };
  }
  
  /**
   * Build branches for a step
   */
  private buildBranches(stepIndex: number, depth: number): ReasoningTree[] {
    const step = this.steps[stepIndex];
    const branches: ReasoningTree[] = [];
    
    // Create branch for each alternative
    for (const alternative of step.alternatives) {
      // Find steps that follow this alternative
      const followingSteps = this.steps.slice(stepIndex + 1)
        .filter(s => s.premise.includes(alternative));
      
      if (followingSteps.length > 0) {
        branches.push({
          root: followingSteps[0],
          branches: this.buildBranches(
            this.steps.indexOf(followingSteps[0]),
            depth + 1
          ),
          depth: depth + 1,
          isComplete: followingSteps.every(s => s.correctness !== undefined),
        });
      }
    }
    
    return branches;
  }
  
  /**
   * Calculate tree depth
   */
  private calculateDepth(): number {
    return Math.max(...this.steps.map((_, i) => this.getStepDepth(i)));
  }
  
  private getStepDepth(stepIndex: number): number {
    if (stepIndex === 0) return 1;
    // Find parent step (simplified - in reality, track parent relationships)
    return 1 + this.getStepDepth(stepIndex - 1);
  }
  
  /**
   * Generate visualization data
   */
  generateVisualization(): ReasoningVisualization {
    return {
      steps: this.steps,
      tree: this.tree,
      alternatives: this.generateAlternativePaths(),
      highlights: {
        correct: this.steps
          .map((s, i) => s.correctness ? i : -1)
          .filter(i => i >= 0),
        incorrect: this.steps
          .map((s, i) => s.correctness === false ? i : -1)
          .filter(i => i >= 0),
        uncertain: this.steps
          .map((s, i) => s.confidence < 0.5 ? i : -1)
          .filter(i => i >= 0),
      },
    };
  }
  
  /**
   * Generate alternative paths (what-if scenarios)
   */
  private generateAlternativePaths(): AlternativePath[] {
    const paths: AlternativePath[] = [];
    
    // For each step with alternatives, create a path showing what would happen
    for (let i = 0; i < this.steps.length; i++) {
      const step = this.steps[i];
      if (step.alternatives.length > 0) {
        for (const alternative of step.alternatives) {
          paths.push({
            stepIndex: i,
            alternative,
            hypotheticalSteps: this.simulateAlternativePath(i, alternative),
            outcome: this.predictOutcome(alternative),
          });
        }
      }
    }
    
    return paths;
  }
  
  private simulateAlternativePath(
    startIndex: number,
    alternative: string
  ): ReasoningStep[] {
    // Simplified simulation - in reality, would use puzzle solver
    return [];
  }
  
  private predictOutcome(alternative: string): 'success' | 'failure' | 'unknown' {
    // Simplified prediction
    return 'unknown';
  }
}
```

---

### 5. Persistence System with Versioning

**Implementation**:
```typescript
/**
 * Persistence manager with versioning and migration
 */
export class GamePersistenceManager {
  private readonly STORAGE_KEY = 'daily-logic-gauntlet';
  private readonly CURRENT_VERSION = '2.0.0';
  
  /**
   * Save game state
   */
  async saveGameState(state: GameState): Promise<void> {
    const saveData: GameSave = {
      version: this.CURRENT_VERSION,
      gameId: 'daily-logic-gauntlet',
      timestamp: Date.now(),
      state: {
        ...state,
        version: this.CURRENT_VERSION,
      },
    };
    
    try {
      // Save to localStorage (quick access)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(saveData));
      
      // Also save to IndexedDB for larger data
      await this.saveToIndexedDB(saveData);
    } catch (error) {
      console.error('Failed to save game state:', error);
      throw error;
    }
  }
  
  /**
   * Load game state with automatic migration
   */
  async loadGameState(): Promise<GameState | null> {
    try {
      // Try localStorage first
      const localStorageData = localStorage.getItem(this.STORAGE_KEY);
      if (localStorageData) {
        const saveData: GameSave = JSON.parse(localStorageData);
        return await this.migrateAndLoad(saveData);
      }
      
      // Fallback to IndexedDB
      const indexedDBData = await this.loadFromIndexedDB();
      if (indexedDBData) {
        return await this.migrateAndLoad(indexedDBData);
      }
      
      return null;
    } catch (error) {
      console.error('Failed to load game state:', error);
      return null;
    }
  }
  
  /**
   * Migrate save data to current version
   */
  private async migrateAndLoad(saveData: GameSave): Promise<GameState> {
    if (saveData.version === this.CURRENT_VERSION) {
      return saveData.state;
    }
    
    // Create backup before migration
    await this.createBackup(saveData);
    
    // Apply migrations
    let migratedData = saveData;
    
    if (this.needsMigration(migratedData.version, '1.0.0', '2.0.0')) {
      migratedData = await this.migrateV1ToV2(migratedData);
    }
    
    // Save migrated data
    await this.saveGameState(migratedData.state);
    
    return migratedData.state;
  }
  
  /**
   * Migrate from version 1.0.0 to 2.0.0
   */
  private async migrateV1ToV2(saveData: GameSave): Promise<GameSave> {
    const v1State = saveData.state as any;
    
    // Add new fields with defaults
    const v2State: GameState = {
      ...v1State,
      playerModel: v1State.playerModel || createDefaultPlayerModel(),
      reasoningHistory: v1State.reasoningHistory || [],
      communityPuzzles: v1State.communityPuzzles || [],
      version: '2.0.0',
    };
    
    return {
      ...saveData,
      version: '2.0.0',
      state: v2State,
    };
  }
  
  /**
   * Create backup before migration
   */
  private async createBackup(saveData: GameSave): Promise<void> {
    const backupKey = `${this.STORAGE_KEY}-backup-${Date.now()}`;
    localStorage.setItem(backupKey, JSON.stringify(saveData));
    
    // Keep only last 5 backups
    const backupKeys = Object.keys(localStorage)
      .filter(key => key.startsWith(`${this.STORAGE_KEY}-backup-`))
      .sort()
      .slice(0, -5);
    
    backupKeys.forEach(key => localStorage.removeItem(key));
  }
  
  /**
   * Check if migration is needed
   */
  private needsMigration(
    currentVersion: string,
    fromVersion: string,
    toVersion: string
  ): boolean {
    return this.compareVersions(currentVersion, fromVersion) >= 0 &&
           this.compareVersions(currentVersion, toVersion) < 0;
  }
  
  /**
   * Compare version strings
   */
  private compareVersions(v1: string, v2: string): number {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const part1 = parts1[i] || 0;
      const part2 = parts2[i] || 0;
      
      if (part1 < part2) return -1;
      if (part1 > part2) return 1;
    }
    
    return 0;
  }
  
  /**
   * IndexedDB operations
   */
  private async saveToIndexedDB(data: GameSave): Promise<void> {
    // Implementation for IndexedDB storage
    // Used for larger data like replay logs, community puzzles
  }
  
  private async loadFromIndexedDB(): Promise<GameSave | null> {
    // Implementation for IndexedDB loading
    return null;
  }
}
```

---

### 6. Community Puzzle System

**Implementation**:
```typescript
/**
 * Community puzzle with validation
 */
export interface CommunityPuzzle {
  id: string;
  creatorId: string;          // Pseudonym, not real ID
  puzzle: Puzzle;
  validation: {
    status: 'pending' | 'approved' | 'rejected';
    validatorIds: string[];   // Community validators
    qualityScore: number;     // 0-1, based on solve rate, feedback
    solveRate: number;        // Percentage of solvers who completed
    averageTime: number;       // Average solve time
  };
  metadata: {
    createdAt: number;
    playCount: number;
    rating: number;            // Average rating (1-5)
    tags: string[];
  };
}

/**
 * Puzzle validation system
 */
export class PuzzleValidator {
  /**
   * Validate puzzle quality
   */
  async validatePuzzle(puzzle: Puzzle): Promise<ValidationResult> {
    const issues: string[] = [];
    
    // Check solution uniqueness
    if (!this.hasUniqueSolution(puzzle)) {
      issues.push('Puzzle does not have a unique solution');
    }
    
    // Check difficulty estimation
    const estimatedDifficulty = this.estimateDifficulty(puzzle);
    if (estimatedDifficulty < 0.1 || estimatedDifficulty > 0.95) {
      issues.push('Puzzle difficulty out of acceptable range');
    }
    
    // Check clarity
    if (!this.isClear(puzzle)) {
      issues.push('Puzzle statement is unclear or ambiguous');
    }
    
    // Check answer options
    if (!this.hasValidOptions(puzzle)) {
      issues.push('Answer options are invalid or too similar');
    }
    
    return {
      valid: issues.length === 0,
      issues,
      qualityScore: this.calculateQualityScore(puzzle, issues),
    };
  }
  
  /**
   * Check if puzzle has unique solution
   */
  private hasUniqueSolution(puzzle: Puzzle): boolean {
    // Use constraint solver to verify uniqueness
    // Simplified - in reality, would use proper CSP solver
    return true; // Placeholder
  }
  
  /**
   * Estimate puzzle difficulty
   */
  private estimateDifficulty(puzzle: Puzzle): number {
    // Factor in: number of constraints, problem space size, pattern complexity
    let difficulty = 0.3; // Base
    
    difficulty += puzzle.constraints.length * 0.1;
    difficulty += Math.log10(puzzle.problemSpaceSize) * 0.1;
    difficulty += puzzle.patternComplexity * 0.2;
    
    return Math.min(0.95, difficulty);
  }
  
  /**
   * Check if puzzle is clear
   */
  private isClear(puzzle: Puzzle): boolean {
    // Check for ambiguous language, unclear constraints
    // Simplified - in reality, would use NLP or manual review
    return puzzle.question.length > 20 && puzzle.question.length < 500;
  }
  
  /**
   * Check if answer options are valid
   */
  private hasValidOptions(puzzle: Puzzle): boolean {
    // Check for: sufficient options, distinct options, correct answer present
    return puzzle.options.length >= 4 &&
           puzzle.options.length === new Set(puzzle.options).size &&
           puzzle.options.includes(puzzle.correctAnswer);
  }
  
  /**
   * Calculate quality score
   */
  private calculateQualityScore(
    puzzle: Puzzle,
    issues: string[]
  ): number {
    let score = 1.0;
    
    // Deduct for each issue
    score -= issues.length * 0.2;
    
    // Bonus for good structure
    if (puzzle.explanation && puzzle.explanation.length > 50) {
      score += 0.1;
    }
    
    return Math.max(0, Math.min(1, score));
  }
}
```

---

## Performance Optimization

### 1. Lazy Loading Strategy

```typescript
/**
 * Lazy load puzzle data
 */
export async function loadPuzzle(puzzleId: string): Promise<Puzzle> {
  // Check cache first
  const cached = puzzleCache.get(puzzleId);
  if (cached) return cached;
  
  // Load from storage
  const puzzle = await loadPuzzleFromStorage(puzzleId);
  
  // Cache for future use
  puzzleCache.set(puzzleId, puzzle);
  
  return puzzle;
}

/**
 * Preload next puzzle in background
 */
export function preloadNextPuzzle(currentIndex: number, total: number): void {
  if (currentIndex < total - 1) {
    const nextPuzzleId = getPuzzleId(currentIndex + 1);
    loadPuzzle(nextPuzzleId).catch(() => {
      // Silently fail - preload is optional
    });
  }
}
```

### 2. Rendering Optimization

```typescript
/**
 * Virtualized puzzle list for archive
 */
export function useVirtualizedPuzzleList(puzzles: Puzzle[]) {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });
  
  // Only render visible puzzles
  const visiblePuzzles = useMemo(() => {
    return puzzles.slice(visibleRange.start, visibleRange.end);
  }, [puzzles, visibleRange]);
  
  return { visiblePuzzles, setVisibleRange };
}
```

### 3. State Management Optimization

```typescript
/**
 * Optimized state updates with batching
 */
export function useOptimizedStateUpdates() {
  const batchUpdates = useRef<StateUpdate[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  function queueUpdate(update: StateUpdate): void {
    batchUpdates.current.push(update);
    
    // Debounce updates
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      applyBatchUpdates(batchUpdates.current);
      batchUpdates.current = [];
    }, 16); // ~60fps
  }
  
  return { queueUpdate };
}
```

---

## Security and Privacy

### 1. Input Sanitization

```typescript
/**
 * Sanitize user-generated content
 */
export function sanitizePuzzleContent(content: string): string {
  // Remove HTML tags
  let sanitized = content.replace(/<[^>]*>/g, '');
  
  // Remove script tags and event handlers
  sanitized = sanitized.replace(/on\w+="[^"]*"/gi, '');
  
  // Limit length
  sanitized = sanitized.substring(0, 1000);
  
  // Remove dangerous characters
  sanitized = sanitized.replace(/[<>\"']/g, '');
  
  return sanitized.trim();
}
```

### 2. Privacy-Preserving Analytics

```typescript
/**
 * Aggregate analytics without individual tracking
 */
export function aggregateAnalytics(events: AnalyticsEvent[]): AggregatedStats {
  // Remove all identifying information
  const anonymized = events.map(e => ({
    ...e,
    userId: hashUserId(e.userId), // One-way hash
    timestamp: roundToHour(e.timestamp), // Round to hour
  }));
  
  // Aggregate
  return {
    totalEvents: anonymized.length,
    eventTypes: countBy(anonymized, 'type'),
    averagePerformance: calculateAverage(anonymized, 'performance'),
    // No individual data retained
  };
}
```

---

## Testing Strategy

### 1. Unit Tests

```typescript
describe('SeededRNG', () => {
  it('should generate same sequence for same seed', () => {
    const rng1 = new SeededRNG(12345);
    const rng2 = new SeededRNG(12345);
    
    expect(rng1.next()).toBe(rng2.next());
    expect(rng1.nextInt(1, 10)).toBe(rng2.nextInt(1, 10));
  });
  
  it('should generate different sequences for different seeds', () => {
    const rng1 = new SeededRNG(12345);
    const rng2 = new SeededRNG(12346);
    
    expect(rng1.next()).not.toBe(rng2.next());
  });
});
```

### 2. Integration Tests

```typescript
describe('AdaptiveDifficultyEngine', () => {
  it('should adjust difficulty based on performance', () => {
    const engine = new AdaptiveDifficultyEngine(createDefaultModel());
    
    // Simulate poor performance
    engine.update({ correct: false, difficulty: 0.5, puzzleType: 'logic' });
    engine.update({ correct: false, difficulty: 0.5, puzzleType: 'logic' });
    
    const nextDifficulty = engine.calculateNextDifficulty('logic', 3, 10);
    expect(nextDifficulty).toBeLessThan(0.5);
  });
});
```

### 3. Performance Tests

```typescript
describe('Performance', () => {
  it('should generate puzzle in <100ms', () => {
    const start = performance.now();
    generatePuzzle('logic', 0.5, new SeededRNG(12345));
    const duration = performance.now() - start;
    
    expect(duration).toBeLessThan(100);
  });
});
```

---

This technical architecture provides the foundation for implementing all gold-standard-exceeding features while maintaining performance, security, and privacy.
