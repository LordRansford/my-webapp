/**
 * Allocation Architect - Type Definitions
 */

export type Difficulty = 'foundations' | 'intermediate' | 'advanced' | 'expert';
export type ScenarioType = 'budget-optimization' | 'time-management' | 'capacity-planning' | 'multi-objective';
export type ConstraintType = 'budget' | 'time' | 'capacity' | 'resource' | 'dependency';
export type EventType = 'budget-shock' | 'requirement-change' | 'resource-availability' | 'external-pressure';

/**
 * Project definition
 */
export interface Project {
  id: string;
  name: string;
  description: string;
  requiredResources: number; // Total resources needed to complete
  currentProgress: number; // 0-100, current completion percentage
  progressPerResource: number; // Progress gained per resource allocated
  diminishingReturns: number; // 0-1, how much progress per resource decreases as project progresses
  dependencies: string[]; // Project IDs that must be completed first
  unlocks: string[]; // Project IDs unlocked when this completes
  priority: number; // 1-10, importance for objectives
  riskLevel: number; // 0-1, chance of failure if event occurs
  health: number; // 0-100, buffer against failures (if >0, survives one failure)
}

/**
 * Objective definition
 */
export interface Objective {
  id: string;
  name: string;
  description: string;
  type: 'complete-projects' | 'maintain-efficiency' | 'meet-constraints' | 'minimize-risk';
  target: number; // Target value (projects count, efficiency %, etc.)
  current: number; // Current value
  weight: number; // 1-10, importance weight
  met: boolean; // Whether objective is currently met
}

/**
 * Constraint definition
 */
export interface Constraint {
  id: string;
  type: ConstraintType;
  name: string;
  description: string;
  limit: number; // Maximum allowed value
  current: number; // Current value
  warningThreshold: number; // 0-1, percentage of limit that triggers warning
  violated: boolean; // Whether constraint is currently violated
}

/**
 * Allocation definition
 */
export interface Allocation {
  projectId: string;
  resources: number; // Resources allocated to this project
}

/**
 * Event definition
 */
export interface Event {
  id: string;
  type: EventType;
  name: string;
  description: string;
  round: number; // Round when event occurs
  severity: number; // 0-1, impact severity
  affectedProjects: string[]; // Project IDs affected
  effect: {
    resourceChange?: number; // Change in available resources
    requirementChange?: number; // Change in project requirements
    progressLoss?: number; // Progress lost on affected projects
  };
}

/**
 * Scenario definition
 */
export interface Scenario {
  id: string;
  name: string;
  description: string;
  type: ScenarioType;
  difficulty: Difficulty;
  totalRounds: number; // Planning horizon (6, 8, or 10)
  initialBudget: number; // Starting resource budget
  budgetPerRound: number; // Resources available per round
  projects: Project[];
  objectives: Objective[];
  constraints: Constraint[];
  events: Event[]; // Seeded events that will occur
}

/**
 * Game state
 */
export interface GameState {
  scenario: Scenario;
  currentRound: number;
  totalRounds: number;
  resourceBudget: number; // Current available resources
  totalBudgetUsed: number; // Total resources used so far
  projects: Project[]; // Current project states
  objectives: Objective[]; // Current objective states
  constraints: Constraint[]; // Current constraint states
  events: Event[]; // Upcoming events
  allocationHistory: Allocation[]; // History of allocations
  roundHistory: RoundResult[]; // History of round results
  metrics: Metrics;
  seed: number;
  status: 'idle' | 'playing' | 'finished';
  outcome?: 'win' | 'loss';
}

/**
 * Round result
 */
export interface RoundResult {
  round: number;
  allocation: Allocation[];
  projectProgress: Record<string, number>; // projectId -> progress change
  objectiveProgress: Record<string, number>; // objectiveId -> progress change
  constraintStatus: Record<string, boolean>; // constraintId -> violated
  events: Event[]; // Events that occurred this round
  metrics: Metrics;
}

/**
 * Metrics
 */
export interface Metrics {
  resourceEfficiency: number; // 0-100, percentage of resources effectively used
  objectiveProgress: number; // 0-100, average progress toward objectives
  constraintCompliance: number; // 0-100, percentage of constraints met
  riskLevel: number; // 0-100, current risk level
  waste: number; // Resources wasted (allocated but not effectively used)
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Projected state (for preview)
 */
export interface ProjectedState {
  projects: Project[];
  objectives: Objective[];
  constraints: Constraint[];
  metrics: Metrics;
  warnings: string[];
}

/**
 * Analysis result (for explainability)
 */
export interface Analysis {
  keyDecisions: KeyDecision[];
  mistakes: Mistake[];
  recommendations: Recommendation[];
  summary: string;
}

export interface KeyDecision {
  round: number;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  reasoning: string;
}

export interface Mistake {
  round: number;
  description: string;
  cost: string;
  recommendation: string;
}

export interface Recommendation {
  type: 'strategy' | 'allocation' | 'risk-management';
  description: string;
  rationale: string;
}
