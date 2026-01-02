/**
 * Tutorial System
 * 
 * Interactive tutorial that guides new players through the game mechanics.
 * Uses a step-by-step approach with highlights and interactive elements.
 */

export type TutorialStep = 
  | 'welcome'
  | 'objective'
  | 'puzzle-types'
  | 'answering'
  | 'hints'
  | 'progress'
  | 'analysis'
  | 'streaks'
  | 'complete';

export interface TutorialStepData {
  id: TutorialStep;
  title: string;
  content: string;
  highlights?: string[]; // Element IDs or selectors to highlight
  interactive?: boolean; // Whether user needs to interact to proceed
  actions?: string[]; // Actions user needs to perform
}

export const TUTORIAL_STEPS: TutorialStepData[] = [
  {
    id: 'welcome',
    title: 'Welcome to Daily Logic Gauntlet!',
    content: 'Test your logic and pattern recognition skills with daily challenges. Each day brings a new set of 10 puzzles with the same seed for all players.',
  },
  {
    id: 'objective',
    title: 'Your Goal',
    content: 'Answer all 10 puzzles correctly to maximize your score. You can take your time - accuracy matters more than speed. Each puzzle tests different logical reasoning skills.',
  },
  {
    id: 'puzzle-types',
    title: 'Puzzle Types',
    content: 'You\'ll encounter different puzzle types:\n\n• Logic Puzzles: Deductive reasoning and logical inference\n• Pattern Puzzles: Sequences, patterns, and number relationships\n• Deduction Puzzles: Information gathering and elimination\n• Constraint Puzzles: Rules and constraints that must be satisfied',
    highlights: ['puzzle-type-badge'],
  },
  {
    id: 'answering',
    title: 'How to Answer',
    content: 'Click or tap an answer option, or use keyboard keys 1-4. After selecting, you\'ll see if you\'re correct and get an explanation. The next puzzle will appear automatically.',
    highlights: ['answer-options'],
    interactive: true,
    actions: ['Select an answer option to continue'],
  },
  {
    id: 'hints',
    title: 'Using Hints',
    content: 'You have 3 hints per puzzle. Press H or click the hint button to get help. Hints reduce your XP but can help you learn. Use them wisely!',
    highlights: ['hint-button'],
    interactive: true,
    actions: ['Try using a hint'],
  },
  {
    id: 'progress',
    title: 'Tracking Progress',
    content: 'Watch your progress in the sidebar. You\'ll see:\n\n• Current puzzle number\n• Your score\n• XP and mastery tier\n• Daily streak\n\nProgress is saved automatically!',
    highlights: ['progress-panel'],
  },
  {
    id: 'analysis',
    title: 'Post-Game Analysis',
    content: 'After completing all 10 puzzles, you\'ll see a detailed analysis report showing:\n\n• Performance by puzzle type\n• Performance by difficulty\n• Insights about your strengths\n• Recommendations for improvement',
    highlights: ['analysis-report'],
  },
  {
    id: 'streaks',
    title: 'Daily Streaks',
    content: 'Play every day to build your streak! Longer streaks give XP bonuses. You can use free passes if you miss a day (1 per month).',
    highlights: ['streak-display'],
  },
  {
    id: 'complete',
    title: 'Ready to Play!',
    content: 'You\'re all set! Click "Start" to begin today\'s challenge. Good luck, and remember - practice makes perfect!',
    interactive: false,
  },
];

export interface TutorialState {
  isActive: boolean;
  currentStep: number;
  completedSteps: Set<TutorialStep>;
  skipped: boolean;
}

/**
 * Create default tutorial state
 */
export function createDefaultTutorialState(): TutorialState {
  return {
    isActive: false,
    currentStep: 0,
    completedSteps: new Set(),
    skipped: false,
  };
}

/**
 * Load tutorial state from localStorage
 */
export function loadTutorialState(): TutorialState {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return createDefaultTutorialState();
  }
  
  try {
    const stored = localStorage.getItem('daily-logic-gauntlet-tutorial');
    if (!stored) {
      return createDefaultTutorialState();
    }
    
    const data = JSON.parse(stored);
    return {
      ...data,
      completedSteps: new Set(data.completedSteps || []),
    };
  } catch (error) {
    console.error('Failed to load tutorial state:', error);
    return createDefaultTutorialState();
  }
}

/**
 * Save tutorial state to localStorage
 */
export function saveTutorialState(state: TutorialState): void {
  try {
    const data = {
      ...state,
      completedSteps: Array.from(state.completedSteps),
    };
    localStorage.setItem('daily-logic-gauntlet-tutorial', JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save tutorial state:', error);
  }
}

/**
 * Check if tutorial should be shown (first-time player)
 */
export function shouldShowTutorial(): boolean {
  const state = loadTutorialState();
  return !state.skipped && state.completedSteps.size === 0;
}

/**
 * Mark tutorial step as completed
 */
export function completeTutorialStep(step: TutorialStep): void {
  const state = loadTutorialState();
  state.completedSteps.add(step);
  saveTutorialState(state);
}

/**
 * Skip tutorial
 */
export function skipTutorial(): void {
  const state = loadTutorialState();
  state.skipped = true;
  state.isActive = false;
  saveTutorialState(state);
}

/**
 * Reset tutorial (for testing)
 */
export function resetTutorial(): void {
  localStorage.removeItem('daily-logic-gauntlet-tutorial');
}

/**
 * Get current tutorial step
 */
export function getCurrentTutorialStep(state: TutorialState): TutorialStepData | null {
  if (state.currentStep < 0 || state.currentStep >= TUTORIAL_STEPS.length) {
    return null;
  }
  return TUTORIAL_STEPS[state.currentStep];
}

/**
 * Move to next tutorial step
 */
export function nextTutorialStep(state: TutorialState): TutorialState {
  const newState = { ...state };
  if (newState.currentStep < TUTORIAL_STEPS.length - 1) {
    newState.currentStep++;
  } else {
    // Tutorial complete
    newState.isActive = false;
    TUTORIAL_STEPS.forEach(step => newState.completedSteps.add(step.id));
  }
  saveTutorialState(newState);
  return newState;
}

/**
 * Move to previous tutorial step
 */
export function previousTutorialStep(state: TutorialState): TutorialState {
  const newState = { ...state };
  if (newState.currentStep > 0) {
    newState.currentStep--;
  }
  saveTutorialState(newState);
  return newState;
}

/**
 * Start tutorial
 */
export function startTutorial(): TutorialState {
  const state = loadTutorialState();
  state.isActive = true;
  state.currentStep = 0;
  saveTutorialState(state);
  return state;
}
