/**
 * Puzzle Templates - Curated puzzle templates for Daily Logic Gauntlet
 * 
 * Phase 1: Use curated templates. Phase 2: Add procedural generation.
 */

import type { Puzzle, PuzzleType } from './types';
import { SeededRNG } from '../../framework/SeededRNG';

/**
 * Logic puzzle template
 */
export interface LogicPuzzleTemplate {
  id: string;
  type: 'logic';
  baseDifficulty: number;
  entities: string[];
  constraints: Array<{
    description: string;
    apply: (entities: string[], rng: SeededRNG) => string[];
  }>;
  questionTemplate: string;
  explanationTemplate: string;
}

/**
 * Pattern puzzle template
 */
export interface PatternPuzzleTemplate {
  id: string;
  type: 'pattern';
  baseDifficulty: number;
  sequence: Array<{
    generate: (index: number, rng: SeededRNG) => number | string;
    pattern: string;
  }>;
  questionTemplate: string;
  explanationTemplate: string;
}

/**
 * Curated logic puzzle templates
 */
export const LOGIC_PUZZLE_TEMPLATES: LogicPuzzleTemplate[] = [
  {
    id: 'logic-ordering-simple',
    type: 'logic',
    baseDifficulty: 0.2,
    entities: ['First', 'Second', 'Third'],
    constraints: [
      {
        description: 'First comes before Second, Second comes before Third',
        apply: (entities) => {
          // Fixed order: First, Second, Third
          return ['First', 'Second', 'Third'];
        },
      },
    ],
    questionTemplate: 'Three items (First, Second, Third) must be arranged. First comes before Second, and Second comes before Third. What is the correct order?',
    explanationTemplate: 'The order must be First → Second → Third to satisfy all constraints.',
  },
  {
    id: 'logic-if-then',
    type: 'logic',
    baseDifficulty: 0.3,
    entities: ['If A then B'],
    constraints: [
      {
        description: 'If A then B is true',
        apply: (entities) => entities,
      },
    ],
    questionTemplate: 'Given the statement "If it rains, then the ground is wet", which statement is always true?',
    explanationTemplate: 'If the condition "it rains" occurs, then "the ground is wet" must follow. This is the logical implication.',
  },
  {
    id: 'logic-exclusion',
    type: 'logic',
    baseDifficulty: 0.35,
    entities: ['A', 'B', 'C'],
    constraints: [
      {
        description: 'Not A',
        apply: (entities) => {
          return entities.filter(e => e !== 'A');
        },
      },
    ],
    questionTemplate: 'If you have A, B, and C, but not A, what do you have?',
    explanationTemplate: 'Excluding A leaves B and C.',
  },
  {
    id: 'logic-transitive',
    type: 'logic',
    baseDifficulty: 0.4,
    entities: ['A', 'B', 'C'],
    constraints: [
      {
        description: 'A > B and B > C implies A > C',
        apply: (entities) => entities,
      },
    ],
    questionTemplate: 'If A is taller than B, and B is taller than C, what can we conclude about A and C?',
    explanationTemplate: 'By transitivity, A must be taller than C.',
  },
  {
    id: 'logic-chain',
    type: 'logic',
    baseDifficulty: 0.5,
    entities: ['A', 'B', 'C', 'D'],
    constraints: [
      {
        description: 'A → B → C → D',
        apply: (entities) => ['A', 'B', 'C', 'D'],
      },
    ],
    questionTemplate: 'Given: A leads to B, B leads to C, C leads to D. What follows?',
    explanationTemplate: 'By chaining the conditions, we can conclude A leads to D.',
  },
  {
    id: 'logic-negation',
    type: 'logic',
    baseDifficulty: 0.35,
    entities: ['True', 'False'],
    constraints: [
      {
        description: 'Not False',
        apply: () => ['True'],
      },
    ],
    questionTemplate: 'If "not false" is true, what is the value?',
    explanationTemplate: 'The negation of false is true.',
  },
  {
    id: 'logic-conjunction',
    type: 'logic',
    baseDifficulty: 0.4,
    entities: ['A and B'],
    constraints: [
      {
        description: 'Both A and B must be true',
        apply: (entities) => entities,
      },
    ],
    questionTemplate: 'If "A and B" is true, what can we conclude?',
    explanationTemplate: 'For "A and B" to be true, both A and B must be true.',
  },
  {
    id: 'logic-disjunction',
    type: 'logic',
    baseDifficulty: 0.3,
    entities: ['A or B'],
    constraints: [
      {
        description: 'At least one of A or B is true',
        apply: (entities) => entities,
      },
    ],
    questionTemplate: 'If "A or B" is true, what can we conclude?',
    explanationTemplate: 'For "A or B" to be true, at least one of A or B must be true.',
  },
  {
    id: 'logic-equivalence',
    type: 'logic',
    baseDifficulty: 0.45,
    entities: ['A', 'B'],
    constraints: [
      {
        description: 'A if and only if B',
        apply: (entities) => entities,
      },
    ],
    questionTemplate: 'If "A if and only if B" is true, and A is true, what can we conclude about B?',
    explanationTemplate: 'If A is true and "A if and only if B" is true, then B must also be true.',
  },
];

/**
 * Curated pattern puzzle templates
 */
export const PATTERN_PUZZLE_TEMPLATES: PatternPuzzleTemplate[] = [
  {
    id: 'pattern-arithmetic',
    type: 'pattern',
    baseDifficulty: 0.2,
    sequence: [
      { generate: () => 2, pattern: 'start' },
      { generate: (i, rng) => {
        const start = rng ? rng.nextInt(1, 10) : 2;
        const diff = rng ? rng.nextInt(1, 5) : 2;
        return start + i * diff;
      }, pattern: 'arithmetic progression' },
    ],
    questionTemplate: 'What comes next in the sequence: ?',
    explanationTemplate: 'Each number increases by a constant amount, so the next number continues the pattern.',
  },
  {
    id: 'pattern-geometric',
    type: 'pattern',
    baseDifficulty: 0.3,
    sequence: [
      { generate: () => 2, pattern: 'start' },
      { generate: (i, rng) => {
        const start = rng ? rng.nextInt(1, 5) : 2;
        const ratio = rng ? (rng.next() < 0.5 ? 2 : 3) : 2;
        return start * (ratio ** i);
      }, pattern: 'geometric progression' },
    ],
    questionTemplate: 'What comes next in the sequence: ?',
    explanationTemplate: 'Each number is multiplied by a constant factor, so the next number continues the geometric pattern.',
  },
  {
    id: 'pattern-fibonacci',
    type: 'pattern',
    baseDifficulty: 0.35,
    sequence: [
      { generate: () => 1, pattern: 'fibonacci start' },
      { generate: (i) => {
        // Fibonacci: 1, 1, 2, 3, 5, 8, 13, ...
        const fib = [1, 1, 2, 3, 5, 8, 13, 21, 34];
        return fib[i] || fib[fib.length - 1];
      }, pattern: 'fibonacci' },
    ],
    questionTemplate: 'What comes next in the sequence: ?',
    explanationTemplate: 'Each number is the sum of the two previous numbers (Fibonacci sequence).',
  },
  {
    id: 'pattern-squares',
    type: 'pattern',
    baseDifficulty: 0.4,
    sequence: [
      { generate: () => 1, pattern: 'start' },
      { generate: (i) => (i + 1) ** 2, pattern: 'squares' },
    ],
    questionTemplate: 'What comes next in the sequence: ?',
    explanationTemplate: 'Each number is a perfect square: 1², 2², 3², 4², so the next is 5² = 25.',
  },
  {
    id: 'pattern-even',
    type: 'pattern',
    baseDifficulty: 0.25,
    sequence: [
      { generate: () => 2, pattern: 'start' },
      { generate: (i, rng) => {
        const start = rng ? rng.nextInt(2, 10) * 2 : 2;
        return start + i * 2;
      }, pattern: 'even numbers' },
    ],
    questionTemplate: 'What comes next in the sequence: ?',
    explanationTemplate: 'The sequence consists of even numbers, each increasing by 2.',
  },
  {
    id: 'pattern-triangular',
    type: 'pattern',
    baseDifficulty: 0.4,
    sequence: [
      { generate: () => 1, pattern: 'start' },
      { generate: (i) => {
        // Triangular numbers: 1, 3, 6, 10, 15, 21, ...
        return ((i + 1) * (i + 2)) / 2;
      }, pattern: 'triangular numbers' },
    ],
    questionTemplate: 'What comes next in the sequence: ?',
    explanationTemplate: 'These are triangular numbers: each number is the sum of all previous natural numbers plus the current position.',
  },
  {
    id: 'pattern-prime-gap',
    type: 'pattern',
    baseDifficulty: 0.45,
    sequence: [
      { generate: () => 2, pattern: 'start' },
      { generate: (i) => {
        const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
        return primes[i] || primes[primes.length - 1];
      }, pattern: 'prime numbers' },
    ],
    questionTemplate: 'What comes next in the sequence: ?',
    explanationTemplate: 'The sequence consists of prime numbers in ascending order.',
  },
  {
    id: 'pattern-cubes',
    type: 'pattern',
    baseDifficulty: 0.35,
    sequence: [
      { generate: () => 1, pattern: 'start' },
      { generate: (i) => (i + 1) ** 3, pattern: 'cubes' },
    ],
    questionTemplate: 'What comes next in the sequence: ?',
    explanationTemplate: 'Each number is a perfect cube: 1³, 2³, 3³, 4³, so the next is 5³ = 125.',
  },
  {
    id: 'pattern-alternating-sign',
    type: 'pattern',
    baseDifficulty: 0.3,
    sequence: [
      { generate: () => 1, pattern: 'start' },
      { generate: (i, rng) => {
        const base = rng ? rng.nextInt(2, 8) : 3;
        return (i % 2 === 0 ? 1 : -1) * base * (i + 1);
      }, pattern: 'alternating signs' },
    ],
    questionTemplate: 'What comes next in the sequence: ?',
    explanationTemplate: 'The sequence alternates between positive and negative values, with increasing magnitude.',
  },
];

/**
 * Generate puzzle from template
 */
export function generatePuzzleFromTemplate(
  template: LogicPuzzleTemplate | PatternPuzzleTemplate,
  difficulty: number,
  rng: SeededRNG
): Puzzle {
  if (template.type === 'logic') {
    return generateLogicPuzzle(template as LogicPuzzleTemplate, difficulty, rng);
  } else {
    return generatePatternPuzzle(template as PatternPuzzleTemplate, difficulty, rng);
  }
}

/**
 * Generate logic puzzle from template
 */
function generateLogicPuzzle(
  template: LogicPuzzleTemplate,
  difficulty: number,
  rng: SeededRNG
): Puzzle {
  // Apply constraints to generate valid solution
  let arrangement = [...template.entities];
  for (const constraint of template.constraints) {
    arrangement = constraint.apply(arrangement, rng);
  }
  
  // Generate question
  const question = template.questionTemplate;
  
  // Generate answer options
  const options: string[] = [];
  
  // Correct answer
  const correctAnswer = arrangement.join('-');
  options.push(correctAnswer);
  
  // Generate wrong answers (shuffled versions)
  for (let i = 0; i < 3; i++) {
    const wrongArrangement = rng.shuffle([...template.entities]);
    const wrongAnswer = wrongArrangement.join('-');
    if (wrongAnswer !== correctAnswer && !options.includes(wrongAnswer)) {
      options.push(wrongAnswer);
    }
  }
  
  // Shuffle options
  const shuffledOptions = rng.shuffle(options);
  const correctIndex = shuffledOptions.indexOf(correctAnswer);
  
  // Generate explanation
  const explanation = template.explanationTemplate;
  
  return {
    id: `${template.id}-${rng.nextInt(1000, 9999)}`,
    type: 'logic',
    difficulty,
    question,
    options: shuffledOptions,
    correctAnswer: correctIndex,
    explanation,
    metadata: {
      constraints: template.constraints.length,
      problemSpaceSize: template.entities.length,
    },
  };
}

/**
 * Generate pattern puzzle from template
 */
function generatePatternPuzzle(
  template: PatternPuzzleTemplate,
  difficulty: number,
  rng: SeededRNG
): Puzzle {
  // Generate sequence using the generator function
  const sequence: (number | string)[] = [];
  const generator = template.sequence[1] || template.sequence[0];
  
  for (let i = 0; i < 4; i++) {
    const item = generator.generate(i, rng);
    sequence.push(item);
  }
  
  // Generate next item (correct answer)
  const nextItem = generator.generate(4, rng);
  
  // Generate question - replace ? with sequence or use template directly
  const question = template.questionTemplate.includes('?')
    ? template.questionTemplate.replace('?', sequence.join(', ') + ', ?')
    : template.questionTemplate;
  
  // Generate answer options
  const options: string[] = [];
  const nextItemStr = String(nextItem);
  options.push(nextItemStr);
  
  // Generate wrong answers (variations)
  const nextNum = typeof nextItem === 'number' ? nextItem : parseInt(nextItemStr) || 0;
  const wrongAnswers = [
    nextNum + 1,
    nextNum - 1,
    typeof nextItem === 'number' ? nextNum * 2 : nextNum + 5,
    typeof nextItem === 'number' ? Math.floor(nextNum / 2) : nextNum - 2,
  ].map(String);
  
  // Add unique wrong answers
  for (const wrong of wrongAnswers) {
    if (!options.includes(wrong) && wrong !== nextItemStr) {
      options.push(wrong);
      if (options.length >= 4) break;
    }
  }
  
  // Ensure we have 4 options
  while (options.length < 4) {
    const extra = String((typeof nextItem === 'number' ? nextItem : parseInt(nextItemStr) || 0) + options.length);
    if (!options.includes(extra)) {
      options.push(extra);
    } else {
      break;
    }
  }
  
  // Shuffle options
  const shuffledOptions = rng.shuffle(options);
  const correctIndex = shuffledOptions.indexOf(nextItemStr);
  
  // Generate explanation
  const explanation = template.explanationTemplate;
  
  return {
    id: `${template.id}-${rng.nextInt(1000, 9999)}`,
    type: 'pattern',
    difficulty,
    question,
    options: shuffledOptions,
    correctAnswer: correctIndex,
    explanation,
    metadata: {
      patternComplexity: template.sequence.length,
    },
  };
}

/**
 * Get template by difficulty
 */
export function getTemplatesByDifficulty(
  type: PuzzleType,
  difficulty: number
): Array<LogicPuzzleTemplate | PatternPuzzleTemplate> {
  if (type === 'logic') {
    return LOGIC_PUZZLE_TEMPLATES.filter(
      t => Math.abs(t.baseDifficulty - difficulty) < 0.2
    );
  } else if (type === 'pattern') {
    return PATTERN_PUZZLE_TEMPLATES.filter(
      t => Math.abs(t.baseDifficulty - difficulty) < 0.2
    );
  }
  return [];
}
