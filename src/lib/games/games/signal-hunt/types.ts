/**
 * Signal Hunt - Type Definitions
 */

export type Difficulty = 'foundations' | 'intermediate' | 'advanced' | 'expert';
export type DefencePosture = 'aggressive' | 'balanced' | 'defensive';
export type SignalSeverity = 'critical' | 'high' | 'medium' | 'low';
export type ActionType = 'investigate' | 'contain' | 'patch' | 'monitor' | 'ignore';
export type ThreatState = 'new' | 'investigating' | 'escalating' | 'contained' | 'resolved' | 'critical';

/**
 * Signal definition
 */
export interface Signal {
  id: string;
  name: string;
  description: string;
  severity: SignalSeverity;
  threatProbability: number; // 0-1, probability this is a real threat
  evidence: Evidence[];
  source: string;
  timestamp: number; // Round when signal appeared
  isFalsePositive: boolean; // True if this is a false positive (only known after investigation)
}

/**
 * Evidence definition
 */
export interface Evidence {
  id: string;
  type: 'network' | 'file' | 'process' | 'user' | 'system';
  description: string;
  confidence: number; // 0-1, how confident this evidence is
  revealed: boolean; // Whether this evidence has been revealed through investigation
}

/**
 * Threat definition
 */
export interface Threat {
  signalId: string;
  state: ThreatState;
  escalationLevel: number; // 0-100, how escalated the threat is
  escalationRate: number; // How fast it escalates per turn
  containmentType?: string; // Type of containment needed
  rootCause?: string; // Root cause (revealed through investigation)
}

/**
 * Tooling card definition
 */
export interface ToolingCard {
  id: string;
  name: string;
  description: string;
  type: 'investigation' | 'containment' | 'patch' | 'monitoring';
  effect: string; // Description of effect
  cost: number; // Action cost
  cooldown?: number; // Turns before can use again
}

/**
 * Action definition
 */
export interface Action {
  signalId: string;
  type: ActionType;
  toolingId?: string; // If using tooling
  timestamp: number; // Round when action taken
}

/**
 * Game state
 */
export interface GameState {
  currentTurn: number;
  totalTurns: number;
  currentPhase: 1 | 2 | 3 | 4;
  riskScore: number; // 0-100
  budget: {
    actions: number; // Action tokens available
    budget: number; // Budget tokens available
  };
  signalQueue: Signal[];
  threats: Map<string, Threat>;
  investigationHistory: Action[];
  toolingActive: ToolingCard[];
  posture: DefencePosture;
  seed: number;
  status: 'idle' | 'playing' | 'finished';
  outcome?: 'win' | 'loss';
}

/**
 * Scenario definition
 */
export interface Scenario {
  id: string;
  name: string;
  description: string;
  adversaryType: string;
  environmentNoise: number; // 0-1, false positive rate
  difficulty: Difficulty;
  totalTurns: number;
  initialBudget: {
    actions: number;
    budget: number;
  };
}
