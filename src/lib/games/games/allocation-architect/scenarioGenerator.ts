/**
 * Allocation Architect - Scenario Generator
 * 
 * Generates deterministic scenarios based on seed.
 */

import { SeededRNG } from '@/lib/games/framework/SeededRNG';
import type { Scenario, Project, Objective, Constraint, Event, Difficulty, ScenarioType, EventType } from './types';

/**
 * Generate a scenario based on seed and parameters
 */
export function generateScenario(
  seed: number,
  scenarioType: ScenarioType,
  difficulty: Difficulty,
  totalRounds: number = 8
): Scenario {
  const rng = new SeededRNG(seed);
  const config = getDifficultyConfig(difficulty, totalRounds);
  
  const projects = generateProjects(config.projectCount, config, rng);
  const objectives = generateObjectives(config.objectiveCount, projects, config, rng);
  const constraints = generateConstraints(config.constraintCount, config, rng);
  const events = generateEvents(totalRounds, config, rng);
  
  return {
    id: `scenario-${seed}`,
    name: getScenarioName(scenarioType, difficulty),
    description: getScenarioDescription(scenarioType, difficulty),
    type: scenarioType,
    difficulty,
    totalRounds,
    initialBudget: config.initialBudget,
    budgetPerRound: config.budgetPerRound,
    projects,
    objectives,
    constraints,
    events,
  };
}

/**
 * Difficulty configuration
 */
interface DifficultyConfig {
  projectCount: number;
  objectiveCount: number;
  constraintCount: number;
  initialBudget: number;
  budgetPerRound: number;
  eventFrequency: number; // 0-1, probability of event per round
  constraintTightness: number; // 0-1, how tight constraints are
  diminishingReturns: number; // 0-1, how strong diminishing returns are
}

function getDifficultyConfig(difficulty: Difficulty, totalRounds: number): DifficultyConfig {
  const base = {
    foundations: {
      projectCount: 4,
      objectiveCount: 1,
      constraintCount: 1,
      initialBudget: 100,
      budgetPerRound: 50,
      eventFrequency: 0.1,
      constraintTightness: 0.7,
      diminishingReturns: 0.2,
    },
    intermediate: {
      projectCount: 6,
      objectiveCount: 2,
      constraintCount: 2,
      initialBudget: 80,
      budgetPerRound: 40,
      eventFrequency: 0.2,
      constraintTightness: 0.8,
      diminishingReturns: 0.4,
    },
    advanced: {
      projectCount: 8,
      objectiveCount: 3,
      constraintCount: 3,
      initialBudget: 70,
      budgetPerRound: 35,
      eventFrequency: 0.3,
      constraintTightness: 0.9,
      diminishingReturns: 0.6,
    },
    expert: {
      projectCount: 10,
      objectiveCount: 4,
      constraintCount: 4,
      initialBudget: 60,
      budgetPerRound: 30,
      eventFrequency: 0.4,
      constraintTightness: 0.95,
      diminishingReturns: 0.8,
    },
  };
  
  return base[difficulty];
}

/**
 * Generate projects
 */
function generateProjects(count: number, config: DifficultyConfig, rng: SeededRNG): Project[] {
  const projects: Project[] = [];
  const projectNames = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa'];
  
  for (let i = 0; i < count; i++) {
    const requiredResources = rng.nextInt(30, 80);
    const progressPerResource = rng.nextFloat(0.5, 2.0);
    const diminishingReturns = config.diminishingReturns * rng.nextFloat(0.8, 1.2);
    const priority = rng.nextInt(1, 10);
    const riskLevel = rng.nextFloat(0.1, 0.5);
    
    // Some projects have dependencies
    const dependencies: string[] = [];
    if (i > 0 && rng.next() < 0.3) {
      dependencies.push(projects[rng.nextInt(0, i - 1)].id);
    }
    
    // Some projects unlock others
    const unlocks: string[] = [];
    if (i < count - 1 && rng.next() < 0.3) {
      unlocks.push(`project-${i + 1}`);
    }
    
    projects.push({
      id: `project-${i}`,
      name: projectNames[i] || `Project ${i + 1}`,
      description: `Project ${i + 1} requires ${requiredResources} resources to complete`,
      requiredResources,
      currentProgress: 0,
      progressPerResource,
      diminishingReturns,
      dependencies,
      unlocks,
      priority,
      riskLevel,
      health: 0,
    });
  }
  
  return projects;
}

/**
 * Generate objectives
 */
function generateObjectives(
  count: number,
  projects: Project[],
  config: DifficultyConfig,
  rng: SeededRNG
): Objective[] {
  const objectives: Objective[] = [];
  const objectiveTypes: Array<'complete-projects' | 'maintain-efficiency' | 'meet-constraints' | 'minimize-risk'> = [
    'complete-projects',
    'maintain-efficiency',
    'meet-constraints',
    'minimize-risk',
  ];
  
  for (let i = 0; i < count; i++) {
    const type = objectiveTypes[i % objectiveTypes.length];
    let target = 0;
    let name = '';
    let description = '';
    
    switch (type) {
      case 'complete-projects':
        target = Math.ceil(projects.length * (0.5 + rng.next() * 0.3)); // 50-80% of projects
        name = 'Complete Projects';
        description = `Complete at least ${target} projects`;
        break;
      case 'maintain-efficiency':
        target = Math.round(70 + rng.next() * 20); // 70-90%
        name = 'Maintain Efficiency';
        description = `Maintain resource efficiency above ${target}%`;
        break;
      case 'meet-constraints':
        target = 100; // All constraints
        name = 'Meet All Constraints';
        description = 'Meet all constraints throughout the planning horizon';
        break;
      case 'minimize-risk':
        target = Math.round(20 + rng.next() * 30); // 20-50%
        name = 'Minimize Risk';
        description = `Keep risk level below ${target}%`;
        break;
    }
    
    objectives.push({
      id: `objective-${i}`,
      name,
      description,
      type,
      target,
      current: 0,
      weight: rng.nextInt(1, 10),
      met: false,
    });
  }
  
  return objectives;
}

/**
 * Generate constraints
 */
function generateConstraints(count: number, config: DifficultyConfig, rng: SeededRNG): Constraint[] {
  const constraints: Constraint[] = [];
  const constraintTypes: Constraint['type'][] = ['budget', 'time', 'capacity', 'resource'];
  
  for (let i = 0; i < count; i++) {
    const type = constraintTypes[i % constraintTypes.length];
    const baseLimit = config.initialBudget + (config.budgetPerRound * 8); // Total budget over 8 rounds
    const tightness = config.constraintTightness;
    const limit = Math.round(baseLimit * tightness * rng.nextFloat(0.9, 1.1));
    
    constraints.push({
      id: `constraint-${i}`,
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Constraint`,
      description: `Total ${type} usage must not exceed ${limit}`,
      limit,
      current: 0,
      warningThreshold: 0.8,
      violated: false,
    });
  }
  
  return constraints;
}

/**
 * Generate events
 */
function generateEvents(totalRounds: number, config: DifficultyConfig, rng: SeededRNG): Event[] {
  const events: Event[] = [];
  
  for (let round = 2; round <= totalRounds; round++) {
    if (rng.next() < config.eventFrequency) {
      const eventTypes: EventType[] = ['budget-shock', 'requirement-change', 'resource-availability', 'external-pressure'];
      const type = rng.choice(eventTypes);
      
      events.push({
        id: `event-${round}`,
        type,
        name: getEventName(type),
        description: getEventDescription(type),
        round,
        severity: rng.nextFloat(0.3, 0.8),
        affectedProjects: [], // Will be set based on project count
        effect: getEventEffect(type, config, rng),
      });
    }
  }
  
  return events;
}

function getEventName(type: EventType): string {
  const names = {
    'budget-shock': 'Budget Reduction',
    'requirement-change': 'Requirement Change',
    'resource-availability': 'Resource Availability',
    'external-pressure': 'External Pressure',
  };
  return names[type];
}

function getEventDescription(type: EventType): string {
  const descriptions = {
    'budget-shock': 'Unexpected budget reduction affects available resources',
    'requirement-change': 'Project requirements have changed',
    'resource-availability': 'Resource availability has changed',
    'external-pressure': 'External pressure affects project priorities',
  };
  return descriptions[type];
}

function getEventEffect(type: EventType, config: DifficultyConfig, rng: SeededRNG): Event['effect'] {
  switch (type) {
    case 'budget-shock':
      return {
        resourceChange: -Math.round(config.budgetPerRound * rng.nextFloat(0.2, 0.5)),
      };
    case 'requirement-change':
      return {
        requirementChange: rng.nextFloat(0.1, 0.3),
      };
    case 'resource-availability':
      return {
        resourceChange: Math.round(config.budgetPerRound * rng.nextFloat(-0.3, 0.3)),
      };
    case 'external-pressure':
      return {
        progressLoss: rng.nextFloat(5, 15),
      };
    default:
      return {};
  }
}

function getScenarioName(type: ScenarioType, difficulty: Difficulty): string {
  const typeNames = {
    'budget-optimization': 'Budget Optimization',
    'time-management': 'Time Management',
    'capacity-planning': 'Capacity Planning',
    'multi-objective': 'Multi-Objective Planning',
  };
  return `${typeNames[type]} - ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`;
}

function getScenarioDescription(type: ScenarioType, difficulty: Difficulty): string {
  return `A ${difficulty} scenario focusing on ${type.replace('-', ' ')}. Allocate resources strategically to meet objectives while managing constraints.`;
}
