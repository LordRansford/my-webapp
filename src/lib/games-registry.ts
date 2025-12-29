/**
 * Central registry for game metadata and categorization
 * This provides a single source of truth for all games across the platform
 */

export type GameType = "action" | "practice" | "cognitive" | "course-specific";

export type GameCategory = "cybersecurity" | "digitalisation" | "cross-topic" | "ai" | "data" | "software-architecture" | "general";

export interface GameMetadata {
  id: string;
  title: string;
  type: GameType;
  category?: GameCategory;
  course?: string; // if course-specific
  href: string;
  description: string;
  minutes: number;
  level?: string;
  difficulty?: "easy" | "medium" | "hard" | "foundations" | "intermediate" | "advanced";
}

/**
 * Action games - Canvas-based PWA games
 */
export const ACTION_GAMES: GameMetadata[] = [
  {
    id: "pulse-runner",
    title: "Pulse Runner",
    type: "action",
    href: "/games/pulse-runner",
    description: "A fast-paced runner game with offline support.",
    minutes: 5,
    difficulty: "easy",
  },
  {
    id: "skyline-drift",
    title: "Skyline Drift",
    type: "action",
    href: "/games/skyline-drift",
    description: "Navigate through cityscapes with smooth controls.",
    minutes: 5,
    difficulty: "medium",
  },
  {
    id: "vault-circuit",
    title: "Vault Circuit",
    type: "action",
    href: "/games/vault-circuit",
    description: "Challenge yourself with precision platforming.",
    minutes: 5,
    difficulty: "hard",
  },
  {
    id: "missions",
    title: "Charis's Challenge",
    type: "action",
    href: "/games/missions",
    description: "12 mission-based levels with character selection and power-ups.",
    minutes: 60,
    difficulty: "medium",
  },
];

/**
 * Practice games - Interactive drills organized by category
 */
export const PRACTICE_GAMES: GameMetadata[] = [
  // Cybersecurity
  {
    id: "trust-boundaries",
    title: "Trust boundaries",
    type: "practice",
    category: "cybersecurity",
    href: "/practice#cybersecurity",
    description: "Decide where trust should end and why. Most breaches begin with a boundary assumed but never defined.",
    minutes: 6,
    level: "Core",
  },
  {
    id: "risk-trade-offs",
    title: "Risk trade offs",
    type: "practice",
    category: "cybersecurity",
    href: "/practice#cybersecurity",
    description: "Choose controls under constraints. You cannot fix everything. Learn to prioritise.",
    minutes: 6,
    level: "Core",
  },
  {
    id: "signals-and-noise",
    title: "Signals and noise",
    type: "practice",
    category: "cybersecurity",
    href: "/practice#cybersecurity",
    description: "Separate weak signals from background noise. Detection is a thinking problem, not a tooling problem.",
    minutes: 6,
    level: "Core",
  },
  // Digitalisation
  {
    id: "vision-and-value",
    title: "Vision and value",
    type: "practice",
    category: "digitalisation",
    href: "/practice#digitalisation",
    description: "Connect a simple digital vision to outcomes and evidence of success.",
    minutes: 5,
    level: "Foundations",
  },
  {
    id: "maturity-and-readiness",
    title: "Maturity and readiness",
    type: "practice",
    category: "digitalisation",
    href: "/practice#digitalisation",
    description: "Place an organisation on a maturity scale and see what breaks when you jump too far.",
    minutes: 5,
    level: "Foundations",
  },
  {
    id: "trade-offs-and-constraints",
    title: "Trade offs and constraints",
    type: "practice",
    category: "digitalisation",
    href: "/practice#digitalisation",
    description: "Balance ambition, risk, cost, and capacity for a small set of initiatives.",
    minutes: 6,
    level: "Intermediate",
  },
  {
    id: "ecosystems-and-trust",
    title: "Ecosystems and trust",
    type: "practice",
    category: "digitalisation",
    href: "/practice#digitalisation",
    description: "Make decisions in a shared ecosystem and watch trust and resilience move.",
    minutes: 6,
    level: "Intermediate",
  },
  {
    id: "roadmap-sprint",
    title: "Roadmap sprint",
    type: "practice",
    category: "digitalisation",
    href: "/practice#digitalisation",
    description: "Plan a three year roadmap quickly and see where you over or under invest.",
    minutes: 7,
    level: "Advanced",
  },
  // Cross Topic
  {
    id: "confident-hallucination",
    title: "The Confident Hallucination",
    type: "practice",
    category: "cross-topic",
    href: "/practice#cross-topic",
    description: "Decide whether to trust or verify a fluent but wrong answer.",
    minutes: 6,
    level: "Core",
  },
  {
    id: "automated-defender",
    title: "The Automated Defender",
    type: "practice",
    category: "cross-topic",
    href: "/practice#cross-topic",
    description: "Automation overreacts or underreacts; you choose the policy and see the impact.",
    minutes: 7,
    level: "Stretch",
  },
];

/**
 * Get games by type
 */
export function getGamesByType(type: GameType): GameMetadata[] {
  if (type === "action") return ACTION_GAMES;
  if (type === "practice") return PRACTICE_GAMES;
  return [];
}

/**
 * Get practice games by category
 */
export function getPracticeGamesByCategory(category: GameCategory): GameMetadata[] {
  return PRACTICE_GAMES.filter((game) => game.category === category);
}

/**
 * Get all games for a specific course
 */
export function getGamesByCourse(course: string): GameMetadata[] {
  return PRACTICE_GAMES.filter((game) => game.course === course || game.category === course);
}

