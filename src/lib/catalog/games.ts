import type { GameCatalogItem } from "./types";

/**
 * Standalone games registry: intentionally limited to 20 entries.
 * This is used for the dedicated standalone games hub requested by the user.
 *
 * Constraint: these games must NOT depend on course-linked pages.
 * We therefore mix the main /games routes with the self-contained /play routes.
 */
export const STANDALONE_GAMES_20: GameCatalogItem[] = [
  // /games (framework games)
  {
    id: "daily-logic-gauntlet",
    kind: "game",
    title: "Daily Logic Gauntlet",
    description: "Multi-puzzle challenge with daily seeded problems.",
    href: "/games/daily-logic-gauntlet",
    minutes: 15,
    difficulty: "Intermediate",
    source: "games",
    badges: [{ label: "Games", tone: "slate" }, { label: "15 min", tone: "indigo" }],
  },
  {
    id: "grid-racer",
    kind: "game",
    title: "Grid Racer Time Trial",
    description: "Time trial racing with obstacles and loadouts.",
    href: "/games/grid-racer",
    minutes: 10,
    difficulty: "Foundations",
    source: "games",
    badges: [{ label: "Games", tone: "slate" }, { label: "10 min", tone: "indigo" }],
  },
  {
    id: "draft-duel",
    kind: "game",
    title: "Draft Duel",
    description: "Draft a deck and play a strategic card battler.",
    href: "/games/draft-duel",
    minutes: 20,
    difficulty: "Advanced",
    source: "games",
    badges: [{ label: "Games", tone: "slate" }, { label: "20 min", tone: "indigo" }],
  },
  {
    id: "hex",
    kind: "game",
    title: "Hex",
    description: "Classic connection game on a hex board.",
    href: "/games/hex",
    minutes: 15,
    difficulty: "Intermediate",
    source: "games",
    badges: [{ label: "Games", tone: "slate" }, { label: "15 min", tone: "indigo" }],
  },
  {
    id: "systems-mastery",
    kind: "game",
    title: "Systems Mastery",
    description: "Flagship systems-thinking game with scenarios.",
    href: "/games/systems-mastery",
    minutes: 30,
    difficulty: "Advanced",
    source: "games",
    badges: [{ label: "Games", tone: "slate" }, { label: "30 min", tone: "indigo" }],
  },
  {
    id: "signal-hunt",
    kind: "game",
    title: "Signal Hunt",
    description: "Triage signals under time pressure; manage false positives.",
    href: "/games/signal-hunt",
    minutes: 15,
    difficulty: "Intermediate",
    source: "games",
    badges: [{ label: "Games", tone: "slate" }, { label: "15 min", tone: "indigo" }],
  },
  {
    id: "proof-sprint",
    kind: "game",
    title: "Proof Sprint",
    description: "Build correct proof steps under constraints.",
    href: "/games/proof-sprint",
    minutes: 10,
    difficulty: "Intermediate",
    source: "games",
    badges: [{ label: "Games", tone: "slate" }, { label: "10 min", tone: "indigo" }],
  },
  {
    id: "packet-route",
    kind: "game",
    title: "Packet Route",
    description: "Design routing policies balancing latency and resilience.",
    href: "/games/packet-route",
    minutes: 15,
    difficulty: "Intermediate",
    source: "games",
    badges: [{ label: "Games", tone: "slate" }, { label: "15 min", tone: "indigo" }],
  },
  {
    id: "governance-simulator",
    kind: "game",
    title: "Governance Simulator",
    description: "Make governance trade-offs under uncertainty.",
    href: "/games/governance-simulator",
    minutes: 20,
    difficulty: "Advanced",
    source: "games",
    badges: [{ label: "Games", tone: "slate" }, { label: "20 min", tone: "indigo" }],
  },
  {
    id: "allocation-architect",
    kind: "game",
    title: "Allocation Architect",
    description: "Allocate resources under constraints and risk events.",
    href: "/games/allocation-architect",
    minutes: 12,
    difficulty: "Intermediate",
    source: "games",
    badges: [{ label: "Games", tone: "slate" }, { label: "12 min", tone: "indigo" }],
  },
  {
    id: "missions",
    kind: "game",
    title: "Charis's Challenge",
    description: "Mission-based levels with character selection and power-ups.",
    href: "/games/missions",
    minutes: 60,
    difficulty: "Intermediate",
    source: "games",
    badges: [{ label: "Games", tone: "slate" }, { label: "60 min", tone: "indigo" }],
  },

  // /play (self-contained, lightweight practice games)
  { id: "memory-match", kind: "game", title: "Memory match", description: "A calm matching game for pattern recall.", href: "/play/memory-match", minutes: 3, difficulty: "Casual", source: "play", badges: [{ label: "Play", tone: "slate" }, { label: "3 min", tone: "indigo" }] },
  { id: "reaction-time", kind: "game", title: "Reaction time", description: "Measure attention: click when the colour changes.", href: "/play/reaction-time", minutes: 2, difficulty: "Foundations", source: "play", badges: [{ label: "Play", tone: "slate" }, { label: "2 min", tone: "indigo" }] },
  { id: "stroop", kind: "game", title: "Stroop challenge", description: "Pick ink colour, not the word.", href: "/play/stroop", minutes: 3, difficulty: "Foundations", source: "play", badges: [{ label: "Play", tone: "slate" }, { label: "3 min", tone: "indigo" }] },
  { id: "visual-search", kind: "game", title: "Visual search", description: "Find targets among distractors.", href: "/play/visual-search", minutes: 4, difficulty: "Foundations", source: "play", badges: [{ label: "Play", tone: "slate" }, { label: "4 min", tone: "indigo" }] },
  { id: "pattern-recall", kind: "game", title: "Pattern recall", description: "Memorise a short sequence and repeat it.", href: "/play/pattern-recall", minutes: 4, difficulty: "Foundations", source: "play", badges: [{ label: "Play", tone: "slate" }, { label: "4 min", tone: "indigo" }] },
  { id: "number-estimation", kind: "game", title: "Number estimation", description: "Make quick estimates and see error instantly.", href: "/play/number-estimation", minutes: 3, difficulty: "Foundations", source: "play", badges: [{ label: "Play", tone: "slate" }, { label: "3 min", tone: "indigo" }] },
  { id: "sequence-builder", kind: "game", title: "Sequence builder", description: "Order steps correctly using everyday scenarios.", href: "/play/sequence-builder", minutes: 5, difficulty: "Foundations", source: "play", badges: [{ label: "Play", tone: "slate" }, { label: "5 min", tone: "indigo" }] },
  { id: "logic-grid-mini", kind: "game", title: "Logic grid mini", description: "Solve a small logic grid with constraints.", href: "/play/logic-grid-mini", minutes: 5, difficulty: "Foundations", source: "play", badges: [{ label: "Play", tone: "slate" }, { label: "5 min", tone: "indigo" }] },
  { id: "tower-of-logic", kind: "game", title: "Tower of logic", description: "Move pieces under strict rules to reach the goal.", href: "/play/tower-of-logic", minutes: 8, difficulty: "Intermediate", source: "play", badges: [{ label: "Play", tone: "slate" }, { label: "8 min", tone: "indigo" }] },
];

export function getStandaloneGamesRegistry(): GameCatalogItem[] {
  return STANDALONE_GAMES_20;
}

