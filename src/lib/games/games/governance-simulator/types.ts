/**
 * Governance Simulator - Type Definitions
 */

export type Difficulty = 'foundations' | 'intermediate' | 'advanced' | 'expert';
export type ScenarioType = 'data-sharing' | 'ai-governance' | 'cyber-controls' | 'interoperability';
export type GovernanceStrategy = {
  controls: number; // 0-100, strictness of controls
  transparency: number; // 0-100, level of transparency
  autonomy: number; // 0-100, level of local autonomy (0 = centralized, 100 = local)
  enforcement: number; // 0-100, enforcement strength
};

/**
 * Stakeholder definition
 */
export interface Stakeholder {
  id: string;
  name: string;
  type: 'data-team' | 'security-team' | 'compliance-team' | 'business-team' | 'executive';
  trust: number; // 0-100
  satisfaction: number; // 0-100
  compliance: number; // 0-100
  preferences: {
    controls: number; // Preferred control level (0-100)
    transparency: number; // Preferred transparency (0-100)
    autonomy: number; // Preferred autonomy (0-100)
  };
}

/**
 * Risk definition
 */
export interface Risk {
  id: string;
  name: string;
  type: 'privacy' | 'security' | 'compliance' | 'innovation' | 'cost';
  level: number; // 0-100, current risk level
  trend: 'increasing' | 'stable' | 'decreasing';
}

/**
 * Event definition
 */
export interface Event {
  id: string;
  type: 'incident' | 'scrutiny' | 'budget-shock' | 'stakeholder-feedback';
  name: string;
  description: string;
  round: number;
  severity: number; // 0-1
  affectedStakeholders: string[]; // Stakeholder IDs
  effect: {
    trustChange?: number; // Change in stakeholder trust
    riskChange?: number; // Change in risk levels
    complianceChange?: number; // Change in compliance
  };
}

/**
 * Objective definition
 */
export interface Objective {
  id: string;
  name: string;
  description: string;
  type: 'trust' | 'compliance' | 'innovation' | 'cost';
  target: number; // Target value
  current: number; // Current value
  met: boolean;
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
  totalTurns: number;
  stakeholders: Stakeholder[];
  objectives: Objective[];
  initialRisks: Risk[];
  events: Event[]; // Seeded events
}

/**
 * Game state
 */
export interface GameState {
  scenario: Scenario;
  currentTurn: number;
  totalTurns: number;
  governanceStrategy: GovernanceStrategy;
  stakeholders: Stakeholder[];
  risks: Risk[];
  objectives: Objective[];
  events: Event[];
  decisionHistory: Array<{
    turn: number;
    strategyChange: Partial<GovernanceStrategy>;
    reasoning: string;
  }>;
  metrics: Metrics;
  seed: number;
  status: 'idle' | 'playing' | 'finished';
  outcome?: 'win' | 'loss';
}

/**
 * Metrics
 */
export interface Metrics {
  averageTrust: number; // 0-100
  averageSatisfaction: number; // 0-100
  averageCompliance: number; // 0-100
  averageRisk: number; // 0-100
  stability: number; // 0-100, how stable metrics are (low volatility)
  outcomes: number; // 0-100, objective achievement
}
