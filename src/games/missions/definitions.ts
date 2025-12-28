import type { MissionDefinition, MissionId } from "./types";

export const MISSION_DEFINITIONS: MissionDefinition[] = [
  {
    id: 1,
    title: "First Steps",
    description: "Learn the basics. Survive the initial wave.",
    briefing: "Welcome, agent. This is your first mission. Charis has prepared a simple test. Survive for 60 seconds and prove you're ready for what comes next.",
    durationMs: 60_000,
    objectives: [
      { id: "survive", description: "Survive for 60 seconds", type: "survive", target: 60_000, completed: false },
      { id: "collect-5", description: "Collect 5 bonus items", type: "collect", target: 5, completed: false },
    ],
    sideQuests: [
      { id: "combo-3", description: "Achieve a 3x combo", reward: 50, completed: false },
    ],
    difficulty: 0.2,
  },
  {
    id: 2,
    title: "Rising Tension",
    description: "The pace quickens. Stay focused.",
    briefing: "Good work. Charis is impressed, but she's not done with you yet. The obstacles will come faster now. Can you handle the pressure?",
    durationMs: 60_000,
    objectives: [
      { id: "survive", description: "Survive for 60 seconds", type: "survive", target: 60_000, completed: false },
      { id: "combo-5", description: "Achieve a 5x combo", type: "combo", target: 5, completed: false },
    ],
    sideQuests: [
      { id: "collect-10", description: "Collect 10 bonus items", reward: 100, completed: false },
      { id: "no-hits", description: "Complete without taking damage (if shield available)", reward: 200, completed: false },
    ],
    difficulty: 0.3,
    unlockRequirement: 1,
  },
  {
    id: 3,
    title: "Pattern Recognition",
    description: "See the patterns. Predict the danger.",
    briefing: "Charis says: 'You're learning, but can you see what's coming?' Watch the patterns. They're not random. Survive and show me you understand.",
    durationMs: 75_000,
    objectives: [
      { id: "survive", description: "Survive for 75 seconds", type: "survive", target: 75_000, completed: false },
      { id: "collect-15", description: "Collect 15 bonus items", type: "collect", target: 15, completed: false },
    ],
    sideQuests: [
      { id: "perfect-10", description: "Perform 10 perfect dodges", type: "perfect", target: 10, completed: false, reward: 150 },
      { id: "combo-8", description: "Achieve an 8x combo", reward: 120, completed: false },
    ],
    difficulty: 0.4,
    unlockRequirement: 2,
  },
  {
    id: 4,
    title: "Speed Test",
    description: "Everything moves faster. Can you keep up?",
    briefing: "Charis laughs: 'Too slow! Everything moves faster now. Keep up or fail.' This is where many agents break. Don't be one of them.",
    durationMs: 90_000,
    objectives: [
      { id: "survive", description: "Survive for 90 seconds", type: "survive", target: 90_000, completed: false },
      { id: "combo-10", description: "Achieve a 10x combo", type: "combo", target: 10, completed: false },
    ],
    sideQuests: [
      { id: "collect-20", description: "Collect 20 bonus items", reward: 200, completed: false },
      { id: "speed-run", description: "Complete in under 85 seconds", type: "time", target: 85_000, completed: false, reward: 250 },
    ],
    difficulty: 0.5,
    unlockRequirement: 3,
  },
  {
    id: 5,
    title: "The Gauntlet",
    description: "Multiple threats. One path forward.",
    briefing: "Charis warns: 'This is where it gets real. Multiple obstacles. Tight windows. One mistake and you're done. Are you ready?'",
    durationMs: 90_000,
    objectives: [
      { id: "survive", description: "Survive for 90 seconds", type: "survive", target: 90_000, completed: false },
      { id: "perfect-15", description: "Perform 15 perfect dodges", type: "perfect", target: 15, completed: false },
    ],
    sideQuests: [
      { id: "combo-12", description: "Achieve a 12x combo", reward: 300, completed: false },
      { id: "collect-25", description: "Collect 25 bonus items", reward: 250, completed: false },
    ],
    difficulty: 0.6,
    unlockRequirement: 4,
  },
  {
    id: 6,
    title: "Midpoint Crisis",
    description: "Halfway there. The real challenge begins.",
    briefing: "Charis: 'You've made it halfway. Most don't. But I'm not done testing you. The next phase will push you to your limits.'",
    durationMs: 120_000,
    objectives: [
      { id: "survive", description: "Survive for 120 seconds", type: "survive", target: 120_000, completed: false },
      { id: "combo-15", description: "Achieve a 15x combo", type: "combo", target: 15, completed: false },
      { id: "collect-30", description: "Collect 30 bonus items", type: "collect", target: 30, completed: false },
    ],
    sideQuests: [
      { id: "perfect-20", description: "Perform 20 perfect dodges", type: "perfect", target: 20, completed: false, reward: 400 },
      { id: "no-powerups", description: "Complete without using power-ups", reward: 500, completed: false },
    ],
    difficulty: 0.65,
    unlockRequirement: 5,
  },
  {
    id: 7,
    title: "Adaptation",
    description: "The rules change. You must adapt.",
    briefing: "Charis: 'I'm changing the rules. Adapt or fail. The obstacles will come from unexpected angles. Trust your instincts.'",
    durationMs: 120_000,
    objectives: [
      { id: "survive", description: "Survive for 120 seconds", type: "survive", target: 120_000, completed: false },
      { id: "perfect-25", description: "Perform 25 perfect dodges", type: "perfect", target: 25, completed: false },
    ],
    sideQuests: [
      { id: "combo-18", description: "Achieve an 18x combo", reward: 450, completed: false },
      { id: "collect-35", description: "Collect 35 bonus items", reward: 350, completed: false },
    ],
    difficulty: 0.7,
    unlockRequirement: 6,
  },
  {
    id: 8,
    title: "Pressure Cooker",
    description: "Maximum intensity. Hold the line.",
    briefing: "Charis: 'This is where most agents break. Maximum pressure. No room for error. Can you hold the line?'",
    durationMs: 150_000,
    objectives: [
      { id: "survive", description: "Survive for 150 seconds", type: "survive", target: 150_000, completed: false },
      { id: "combo-20", description: "Achieve a 20x combo", type: "combo", target: 20, completed: false },
    ],
    sideQuests: [
      { id: "perfect-30", description: "Perform 30 perfect dodges", type: "perfect", target: 30, completed: false, reward: 600 },
      { id: "collect-40", description: "Collect 40 bonus items", reward: 400, completed: false },
    ],
    difficulty: 0.75,
    unlockRequirement: 7,
  },
  {
    id: 9,
    title: "The Test",
    description: "Charis's personal challenge for you.",
    briefing: "Charis: 'I've designed this one myself. This is my test. Pass it, and you'll have proven yourself worthy. Fail, and start over.'",
    durationMs: 180_000,
    objectives: [
      { id: "survive", description: "Survive for 180 seconds", type: "survive", target: 180_000, completed: false },
      { id: "combo-25", description: "Achieve a 25x combo", type: "combo", target: 25, completed: false },
      { id: "perfect-35", description: "Perform 35 perfect dodges", type: "perfect", target: 35, completed: false },
    ],
    sideQuests: [
      { id: "collect-50", description: "Collect 50 bonus items", reward: 500, completed: false },
      { id: "flawless", description: "Complete with zero mistakes (perfect run)", reward: 1000, completed: false },
    ],
    difficulty: 0.8,
    unlockRequirement: 8,
  },
  {
    id: 10,
    title: "Endurance",
    description: "Long haul. Mental fortitude required.",
    briefing: "Charis: 'Endurance. That's what this is about. Can you maintain focus for the long haul? Most can't. Show me you're different.'",
    durationMs: 240_000,
    objectives: [
      { id: "survive", description: "Survive for 240 seconds", type: "survive", target: 240_000, completed: false },
      { id: "combo-30", description: "Achieve a 30x combo", type: "combo", target: 30, completed: false },
    ],
    sideQuests: [
      { id: "perfect-40", description: "Perform 40 perfect dodges", type: "perfect", target: 40, completed: false, reward: 800 },
      { id: "collect-60", description: "Collect 60 bonus items", reward: 600, completed: false },
    ],
    difficulty: 0.85,
    unlockRequirement: 9,
  },
  {
    id: 11,
    title: "The Final Gauntlet",
    description: "Everything you've learned. One final test.",
    briefing: "Charis: 'Everything you've learned comes down to this. One final gauntlet. Pass this, and you're ready for the ultimate challenge.'",
    durationMs: 300_000,
    objectives: [
      { id: "survive", description: "Survive for 300 seconds", type: "survive", target: 300_000, completed: false },
      { id: "combo-35", description: "Achieve a 35x combo", type: "combo", target: 35, completed: false },
      { id: "perfect-50", description: "Perform 50 perfect dodges", type: "perfect", target: 50, completed: false },
    ],
    sideQuests: [
      { id: "collect-75", description: "Collect 75 bonus items", reward: 750, completed: false },
      { id: "master", description: "Complete all objectives and side quests", reward: 1500, completed: false },
    ],
    difficulty: 0.9,
    unlockRequirement: 10,
  },
  {
    id: 12,
    title: "Charis's Challenge",
    description: "The ultimate test. Dedicated to Charis Chung Amponsah.",
    briefing: "Charis: 'This is it. My ultimate challenge. Dedicated to me, designed by me, perfected for you. Survive this, and you've earned my respect. Good luck, agent. You'll need it.'",
    durationMs: 300_000,
    objectives: [
      { id: "survive", description: "Survive for 300 seconds", type: "survive", target: 300_000, completed: false },
      { id: "combo-40", description: "Achieve a 40x combo", type: "combo", target: 40, completed: false },
      { id: "perfect-60", description: "Perform 60 perfect dodges", type: "perfect", target: 60, completed: false },
      { id: "collect-100", description: "Collect 100 bonus items", type: "collect", target: 100, completed: false },
    ],
    sideQuests: [
      { id: "legend", description: "Complete with 3 stars and all side quests", reward: 2000, completed: false },
      { id: "dedication", description: "Complete in honor of Charis Chung Amponsah", reward: 5000, completed: false },
    ],
    difficulty: 0.95,
    unlockRequirement: 11,
  },
];

export function getMission(id: MissionId): MissionDefinition | null {
  return MISSION_DEFINITIONS.find((m) => m.id === id) ?? null;
}

export function getNextMission(currentId: MissionId): MissionDefinition | null {
  const nextId = (currentId + 1) as MissionId;
  return getMission(nextId);
}

