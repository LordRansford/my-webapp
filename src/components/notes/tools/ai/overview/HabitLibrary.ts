/**
 * AI Course Habit Library
 * Pre-defined habits aligned with the AI course content and learning objectives.
 */

export interface Habit {
  id: string;
  label: string;
  description: string;
  category: "foundations" | "intermediate" | "advanced" | "general";
  difficulty: "easy" | "medium" | "hard";
  estimatedMinutes: number;
}

export const AI_HABITS: Habit[] = [
  // Foundations habits
  {
    id: "eval-plan-before-prompt",
    label: "Write a short eval plan before you prompt",
    description: "Before using an AI tool, write down what you want to measure and how you'll know if the output is good.",
    category: "foundations",
    difficulty: "easy",
    estimatedMinutes: 5,
  },
  {
    id: "check-for-leakage",
    label: "Check for data leakage in small datasets",
    description: "When working with small datasets, ask: 'Is any test information in the training data?'",
    category: "foundations",
    difficulty: "medium",
    estimatedMinutes: 10,
  },
  {
    id: "question-model-assumptions",
    label: "Question what the model is really using as evidence",
    description: "When you see a model output, ask: 'What patterns in the data led to this answer?'",
    category: "foundations",
    difficulty: "easy",
    estimatedMinutes: 3,
  },
  {
    id: "test-threshold-tradeoffs",
    label: "Test threshold trade-offs with real examples",
    description: "Try adjusting classification thresholds and see how precision and recall change.",
    category: "foundations",
    difficulty: "medium",
    estimatedMinutes: 15,
  },

  // Intermediate habits
  {
    id: "review-prompt-examples",
    label: "Review prompt examples for consistency",
    description: "Before deploying a prompt, check that your few-shot examples match the format you want.",
    category: "intermediate",
    difficulty: "easy",
    estimatedMinutes: 5,
  },
  {
    id: "validate-embeddings",
    label: "Validate embedding quality with similarity checks",
    description: "Test that similar concepts have similar embeddings, and different concepts are far apart.",
    category: "intermediate",
    difficulty: "medium",
    estimatedMinutes: 10,
  },
  {
    id: "monitor-model-drift",
    label: "Check for model drift signals weekly",
    description: "Review metrics and outputs weekly to spot when real-world data starts diverging from training.",
    category: "intermediate",
    difficulty: "medium",
    estimatedMinutes: 15,
  },
  {
    id: "test-retrieval-quality",
    label: "Test retrieval quality before trusting RAG",
    description: "When using retrieval-augmented generation, verify that retrieved chunks are actually relevant.",
    category: "intermediate",
    difficulty: "medium",
    estimatedMinutes: 10,
  },

  // Advanced habits
  {
    id: "audit-agent-tool-use",
    label: "Audit agent tool use for safety",
    description: "Review what tools your AI agent is calling and whether those calls are appropriate.",
    category: "advanced",
    difficulty: "hard",
    estimatedMinutes: 20,
  },
  {
    id: "check-context-window-limits",
    label: "Check context window limits before long tasks",
    description: "Before processing long documents, verify that important information won't fall outside the context window.",
    category: "advanced",
    difficulty: "medium",
    estimatedMinutes: 5,
  },
  {
    id: "review-governance-checklist",
    label: "Review governance checklist for new AI features",
    description: "Before deploying a new AI feature, go through your governance checklist: bias, safety, explainability, monitoring.",
    category: "advanced",
    difficulty: "hard",
    estimatedMinutes: 30,
  },
  {
    id: "test-hallucination-detection",
    label: "Test hallucination detection on sample outputs",
    description: "Regularly test whether your system can detect when the model is confidently wrong.",
    category: "advanced",
    difficulty: "hard",
    estimatedMinutes: 20,
  },

  // General habits
  {
    id: "document-model-decisions",
    label: "Document one model decision this week",
    description: "Write down why you chose a particular model, threshold, or prompt pattern.",
    category: "general",
    difficulty: "easy",
    estimatedMinutes: 10,
  },
  {
    id: "share-failure-story",
    label: "Share one AI failure story with your team",
    description: "Discuss a time when an AI system failed and what you learned from it.",
    category: "general",
    difficulty: "easy",
    estimatedMinutes: 15,
  },
  {
    id: "practice-explaining-ai",
    label: "Practice explaining an AI concept to a non-technical person",
    description: "Take one AI concept and explain it in plain language without jargon.",
    category: "general",
    difficulty: "medium",
    estimatedMinutes: 10,
  },
];

/**
 * Get habits by category
 */
export function getHabitsByCategory(category: Habit["category"]): Habit[] {
  return AI_HABITS.filter((habit) => habit.category === category);
}

/**
 * Get habit by ID
 */
export function getHabitById(id: string): Habit | undefined {
  return AI_HABITS.find((habit) => habit.id === id);
}

/**
 * Get habits by difficulty
 */
export function getHabitsByDifficulty(difficulty: Habit["difficulty"]): Habit[] {
  return AI_HABITS.filter((habit) => habit.difficulty === difficulty);
}

