/**
 * Player Capability Model
 * 
 * Multi-dimensional player skill profiling for adaptive difficulty and personalized learning.
 * Tracks skills, behaviors, and learning patterns without external APIs - all client-side.
 * 
 * Based on technical architecture specification for gold-standard implementation.
 */

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
 * Puzzle performance data
 */
export interface PuzzlePerformance {
  puzzleType: string;
  correct: boolean;
  difficulty: number;
  timeSpent: number;             // milliseconds
  hesitationTime?: number;       // Time before first action
  hintsUsed: number;
  attempts: number;
  timestamp: number;
}

/**
 * Create default player model
 */
export function createDefaultPlayerModel(): PlayerCapabilityModel {
  return {
    logicSkill: 0.5,
    patternSkill: 0.5,
    deductionSkill: 0.5,
    constraintSkill: 0.5,
    speedSkill: 0.5,
    confidence: 0.5,
    riskTolerance: 0.5,
    persistence: 0.5,
    weaknessAreas: [],
    strengthAreas: [],
    improvementVelocity: 0,
    plateauDetected: false,
    learningStyle: 'mixed',
    lastUpdated: Date.now(),
    dataPoints: 0,
  };
}

/**
 * Calculate average skill level
 */
export function calculateAverageSkill(model: PlayerCapabilityModel): number {
  return (
    model.logicSkill +
    model.patternSkill +
    model.deductionSkill +
    model.constraintSkill +
    model.speedSkill
  ) / 5;
}

/**
 * Update player model based on performance
 */
export function updatePlayerModel(
  model: PlayerCapabilityModel,
  performance: PuzzlePerformance
): PlayerCapabilityModel {
  const alpha = 0.1; // Learning rate (exponential moving average)
  const dataPoints = model.dataPoints + 1;
  
  // Map puzzle type to skill dimension
  const skillMap: Record<string, keyof PlayerCapabilityModel> = {
    'logic': 'logicSkill',
    'pattern': 'patternSkill',
    'deduction': 'deductionSkill',
    'constraint': 'constraintSkill',
  };
  
  // Update skill dimensions based on puzzle type
  const skillKey = skillMap[performance.puzzleType];
  if (skillKey) {
    const currentSkill = model[skillKey] as number;
    const performanceScore = performance.correct ? 1 : 0;
    // Also factor in time (faster = better, normalized)
    const timeBonus = performance.correct 
      ? Math.max(0, 1 - (performance.timeSpent / 60000)) // 1 minute = baseline
      : 0;
    const adjustedScore = performanceScore * (0.7 + timeBonus * 0.3);
    const newSkill = currentSkill * (1 - alpha) + adjustedScore * alpha;
    (model[skillKey] as number) = Math.max(0, Math.min(1, newSkill));
  }
  
  // Update speed skill (based on time spent)
  const speedScore = performance.correct 
    ? Math.max(0, 1 - (performance.timeSpent / 60000))
    : 0;
  model.speedSkill = model.speedSkill * (1 - alpha) + speedScore * alpha;
  
  // Update confidence based on hesitation
  if (performance.hesitationTime !== undefined) {
    // Lower hesitation = higher confidence (normalized to 10 seconds)
    const hesitationScore = Math.max(0, 1 - (performance.hesitationTime / 10000));
    model.confidence = model.confidence * (1 - alpha) + hesitationScore * alpha;
  }
  
  // Update risk tolerance based on hint usage
  // More hints = lower risk tolerance (they prefer safety)
  const riskScore = 1 - (performance.hintsUsed / 3); // 3 hints max
  model.riskTolerance = model.riskTolerance * (1 - alpha) + riskScore * alpha;
  
  // Update persistence based on attempts
  // More attempts = higher persistence (they don't give up)
  const persistenceScore = Math.min(1, performance.attempts / 3);
  model.persistence = model.persistence * (1 - alpha) + persistenceScore * alpha;
  
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
    // Remove from strengths if performance drops
    if (model.strengthAreas.includes(performance.puzzleType) && performance.attempts > 2) {
      model.strengthAreas = model.strengthAreas.filter(a => a !== performance.puzzleType);
    }
  }
  
  // Update improvement velocity
  const previousAvgSkill = calculateAverageSkill(model);
  // Temporarily calculate new average
  const tempModel = { ...model };
  if (skillKey) {
    (tempModel[skillKey] as number) = model[skillKey] as number;
  }
  const newAvgSkill = calculateAverageSkill(tempModel);
  model.improvementVelocity = (newAvgSkill - previousAvgSkill) / dataPoints;
  
  // Detect plateau (no significant improvement over many data points)
  model.plateauDetected = Math.abs(model.improvementVelocity) < 0.001 && dataPoints > 20;
  
  // Infer learning style based on performance patterns
  // This is simplified - in reality would analyze more data
  if (performance.correct && performance.timeSpent < 30000) {
    // Fast success might indicate visual/interactive preference
    if (model.learningStyle === 'mixed') {
      model.learningStyle = performance.puzzleType === 'pattern' ? 'visual' : 'interactive';
    }
  }
  
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
  // Map puzzle type to skill dimension
  const skillMap: Record<string, keyof PlayerCapabilityModel> = {
    'logic': 'logicSkill',
    'pattern': 'patternSkill',
    'deduction': 'deductionSkill',
    'constraint': 'constraintSkill',
  };
  
  // Base difficulty on skill level for this puzzle type
  const skillKey = skillMap[puzzleType];
  const skill = skillKey ? (model[skillKey] as number) : calculateAverageSkill(model);
  
  // Adjust for confidence
  const confidenceAdjustment = (model.confidence - 0.5) * 0.2;
  
  // Adjust for weakness areas
  const weaknessPenalty = model.weaknessAreas.includes(puzzleType) ? -0.1 : 0;
  
  // Target: slightly above current skill (optimal challenge zone)
  // Zone of Proximal Development: skill + 0.15
  const targetDifficulty = skill + 0.15 + confidenceAdjustment + weaknessPenalty;
  
  // Clamp to valid range [0.1, 0.95]
  return Math.max(0.1, Math.min(0.95, targetDifficulty));
}

/**
 * Calculate skill match for puzzle type
 */
export function calculateSkillMatch(
  model: PlayerCapabilityModel,
  puzzleType: string
): number {
  const skillMap: Record<string, keyof PlayerCapabilityModel> = {
    'logic': 'logicSkill',
    'pattern': 'patternSkill',
    'deduction': 'deductionSkill',
    'constraint': 'constraintSkill',
  };
  
  const skillKey = skillMap[puzzleType];
  return skillKey ? (model[skillKey] as number) : calculateAverageSkill(model);
}
