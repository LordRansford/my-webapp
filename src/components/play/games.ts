import type { DifficultyTag } from "@/components/play/GameShell";

export type PlayCategory = "quick" | "skill" | "logic" | "relax" | "challenge" | "deep-focus";

export type PlayGameCard = {
  id: string;
  title: string;
  purpose: string;
  href: string;
  estTime: string;
  difficulty: DifficultyTag;
  category: PlayCategory;
};

export const PLAY_GAMES: PlayGameCard[] = [
  {
    id: "memory-match",
    title: "Memory match",
    purpose: "A calm card matching game for focus and pattern recall.",
    href: "/play/memory-match",
    estTime: "2–3 minutes",
    difficulty: "Casual",
    category: "relax",
  },
  {
    id: "reaction-time",
    title: "Reaction time test",
    purpose: "Click when the colour changes to measure alertness and focus.",
    href: "/play/reaction-time",
    estTime: "1–2 minutes",
    difficulty: "Foundations",
    category: "quick",
  },
  {
    id: "stroop",
    title: "Stroop style challenge",
    purpose: "Pick the ink colour, not the word, to practice cognitive control.",
    href: "/play/stroop",
    estTime: "2–3 minutes",
    difficulty: "Foundations",
    category: "quick",
  },
  {
    id: "visual-search",
    title: "Visual search",
    purpose: "Find a target among distractors to practice scanning and focus.",
    href: "/play/visual-search",
    estTime: "2–4 minutes",
    difficulty: "Foundations",
    category: "quick",
  },
  {
    id: "pattern-recall",
    title: "Pattern recall",
    purpose: "Remember a short symbol sequence and repeat it back.",
    href: "/play/pattern-recall",
    estTime: "2–4 minutes",
    difficulty: "Foundations",
    category: "skill",
  },
  {
    id: "number-estimation",
    title: "Number estimation",
    purpose: "Make quick estimates and see your error margin immediately.",
    href: "/play/number-estimation",
    estTime: "2–3 minutes",
    difficulty: "Foundations",
    category: "skill",
  },
  {
    id: "sequence-builder",
    title: "Sequence builder",
    purpose: "Arrange steps in the right order using everyday scenarios.",
    href: "/play/sequence-builder",
    estTime: "3–5 minutes",
    difficulty: "Foundations",
    category: "skill",
  },
  {
    id: "logic-grid-mini",
    title: "Logic grid mini",
    purpose: "Use a few constraints to deduce a tiny grid solution.",
    href: "/play/logic-grid-mini",
    estTime: "3–5 minutes",
    difficulty: "Foundations",
    category: "logic",
  },
  {
    id: "tower-of-logic",
    title: "Tower of logic",
    purpose: "Move pieces with strict rules to reach the goal with few moves.",
    href: "/play/tower-of-logic",
    estTime: "4–8 minutes",
    difficulty: "Intermediate",
    category: "challenge",
  },
  {
    id: "time-pressure-math",
    title: "Time pressure math",
    purpose: "Solve mental arithmetic with gentle time windows and a growing streak.",
    href: "/play/time-pressure-math",
    estTime: "3–6 minutes",
    difficulty: "Intermediate",
    category: "challenge",
  },
  {
    id: "code-reading-lite",
    title: "Code reading lite",
    purpose: "Read small pseudocode and predict outputs.",
    href: "/play/code-reading-lite",
    estTime: "4–7 minutes",
    difficulty: "Intermediate",
    category: "deep-focus",
  },
  {
    id: "decision-tree-sim",
    title: "Decision tree simulator",
    purpose: "Make sequential trade-off choices and reflect on outcomes.",
    href: "/play/decision-tree-simulator",
    estTime: "4–8 minutes",
    difficulty: "Intermediate",
    category: "deep-focus",
  },
  {
    id: "memory-interference",
    title: "Memory interference test",
    purpose: "Hold items in memory while distractions appear.",
    href: "/play/memory-interference",
    estTime: "4–7 minutes",
    difficulty: "Intermediate",
    category: "deep-focus",
  },
  {
    id: "risk-vs-reward",
    title: "Risk vs reward",
    purpose: "Decide when to stop and bank points under uncertainty.",
    href: "/play/risk-vs-reward",
    estTime: "3–6 minutes",
    difficulty: "Intermediate",
    category: "challenge",
  },
  {
    id: "insight-puzzle",
    title: "Insight puzzle",
    purpose: "Discover a hidden rule from examples and apply it.",
    href: "/play/insight-puzzle",
    estTime: "5–10 minutes",
    difficulty: "Advanced",
    category: "deep-focus",
  },
];

export const PLAY_CATEGORIES: { id: PlayCategory; title: string; description: string }[] = [
  { id: "quick", title: "Quick Play", description: "Short games you can finish quickly." },
  { id: "skill", title: "Skill Builders", description: "Practice a specific mental skill with clear feedback." },
  { id: "logic", title: "Logic and Strategy", description: "Slow down and think a few steps ahead." },
  { id: "relax", title: "Relax and Reset", description: "Light games for a short mental reset." },
  { id: "challenge", title: "Challenge", description: "Deeper games that reward planning and steady improvement." },
  { id: "deep-focus", title: "Deep Focus", description: "Longer engagement games built around careful thinking." },
];


