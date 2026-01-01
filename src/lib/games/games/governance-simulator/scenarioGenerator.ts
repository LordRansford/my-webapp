/**
 * Governance Simulator - Scenario Generator
 */

import { SeededRNG } from '@/lib/games/framework/SeededRNG';
import type { Scenario, Stakeholder, Objective, Risk, Event, ScenarioType, Difficulty } from './types';

export function generateScenario(
  seed: number,
  scenarioType: ScenarioType,
  difficulty: Difficulty
): Scenario {
  const rng = new SeededRNG(seed);
  const config = getDifficultyConfig(difficulty);
  
  const stakeholders = generateStakeholders(config.stakeholderCount, rng);
  const objectives = generateObjectives(config.objectiveCount, stakeholders, rng);
  const initialRisks = generateRisks(config.riskCount, rng);
  const events = generateEvents(config.totalTurns, config, rng);
  
  return {
    id: `scenario-${seed}`,
    name: getScenarioName(scenarioType),
    description: getScenarioDescription(scenarioType, difficulty),
    type: scenarioType,
    difficulty,
    totalTurns: config.totalTurns,
    stakeholders,
    objectives,
    initialRisks,
    events,
  };
}

interface DifficultyConfig {
  stakeholderCount: number;
  objectiveCount: number;
  riskCount: number;
  totalTurns: number;
  eventFrequency: number;
}

function getDifficultyConfig(difficulty: Difficulty): DifficultyConfig {
  switch (difficulty) {
    case 'foundations':
      return {
        stakeholderCount: 2,
        objectiveCount: 2,
        riskCount: 2,
        totalTurns: 8,
        eventFrequency: 0.2,
      };
    case 'intermediate':
      return {
        stakeholderCount: 3,
        objectiveCount: 3,
        riskCount: 3,
        totalTurns: 10,
        eventFrequency: 0.3,
      };
    case 'advanced':
      return {
        stakeholderCount: 4,
        objectiveCount: 4,
        riskCount: 4,
        totalTurns: 12,
        eventFrequency: 0.4,
      };
    case 'expert':
      return {
        stakeholderCount: 5,
        objectiveCount: 5,
        riskCount: 5,
        totalTurns: 12,
        eventFrequency: 0.5,
      };
  }
}

function generateStakeholders(count: number, rng: SeededRNG): Stakeholder[] {
  const types: Stakeholder['type'][] = [
    'data-team',
    'security-team',
    'compliance-team',
    'business-team',
    'executive',
  ];
  
  const stakeholders: Stakeholder[] = [];
  for (let i = 0; i < count; i++) {
    const type = types[i % types.length];
    stakeholders.push({
      id: `stakeholder-${i}`,
      name: `${type} ${i + 1}`,
      type,
      trust: 70 + rng.random() * 20, // 70-90
      satisfaction: 70 + rng.random() * 20,
      compliance: 80 + rng.random() * 15,
      preferences: {
        controls: type === 'security-team' ? 80 : type === 'data-team' ? 40 : 60,
        transparency: type === 'executive' ? 90 : 60,
        autonomy: type === 'data-team' ? 80 : 50,
      },
    });
  }
  
  return stakeholders;
}

function generateObjectives(
  count: number,
  stakeholders: Stakeholder[],
  rng: SeededRNG
): Objective[] {
  const types: Objective['type'][] = ['trust', 'compliance', 'innovation', 'cost'];
  const objectives: Objective[] = [];
  
  for (let i = 0; i < count; i++) {
    const type = types[i % types.length];
    objectives.push({
      id: `objective-${i}`,
      name: `${type} Objective`,
      description: `Maintain ${type} above threshold`,
      type,
      target: 75,
      current: 70 + rng.random() * 10,
      met: false,
    });
  }
  
  return objectives;
}

function generateRisks(count: number, rng: SeededRNG): Risk[] {
  const types: Risk['type'][] = ['privacy', 'security', 'compliance', 'innovation', 'cost'];
  const risks: Risk[] = [];
  
  for (let i = 0; i < count; i++) {
    const type = types[i % types.length];
    risks.push({
      id: `risk-${i}`,
      name: `${type} Risk`,
      type,
      level: 30 + rng.random() * 30, // 30-60
      trend: rng.random() < 0.33 ? 'increasing' : rng.random() < 0.66 ? 'stable' : 'decreasing',
    });
  }
  
  return risks;
}

function generateEvents(
  totalTurns: number,
  config: DifficultyConfig,
  rng: SeededRNG
): Event[] {
  const events: Event[] = [];
  
  for (let turn = 2; turn <= totalTurns; turn++) {
    if (rng.random() < config.eventFrequency) {
      const eventTypes: Event['type'][] = ['incident', 'scrutiny', 'budget-shock', 'stakeholder-feedback'];
      const type = rng.sample(eventTypes, 1)[0];
      
      events.push({
        id: `event-${turn}`,
        type,
        name: `${type} Event`,
        description: `${type} occurred in round ${turn}`,
        round: turn,
        severity: 0.3 + rng.random() * 0.4, // 0.3-0.7
        affectedStakeholders: [],
        effect: {
          trustChange: (rng.random() - 0.5) * 20, // -10 to +10
          riskChange: rng.random() * 15, // 0 to +15
        },
      });
    }
  }
  
  return events;
}

function getScenarioName(type: ScenarioType): string {
  const names = {
    'data-sharing': 'Data Sharing Governance',
    'ai-governance': 'AI Governance Challenge',
    'cyber-controls': 'Cybersecurity Controls',
    'interoperability': 'Interoperability Governance',
  };
  return names[type];
}

function getScenarioDescription(type: ScenarioType, difficulty: Difficulty): string {
  return `Manage governance for ${type} scenario at ${difficulty} difficulty.`;
}
