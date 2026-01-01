# Learning Science Integration - Evidence-Based Design

**Purpose**: Integrate proven learning science principles to maximize educational effectiveness

---

## Core Learning Principles

### 1. Spaced Repetition

**Theory**: Information is better retained when reviewed at increasing intervals.

**Implementation**:
```typescript
/**
 * Spaced repetition scheduler
 */
export interface SpacedRepetitionItem {
  puzzleType: string;
  skill: string;
  lastReviewed: number;
  interval: number;        // Days until next review
  easeFactor: number;      // Difficulty multiplier (2.5 default)
  repetitions: number;      // Number of successful reviews
}

export class SpacedRepetitionScheduler {
  /**
   * Calculate next review date using SM-2 algorithm
   */
  scheduleNextReview(
    item: SpacedRepetitionItem,
    performance: 'again' | 'hard' | 'good' | 'easy'
  ): SpacedRepetitionItem {
    let newInterval: number;
    let newEaseFactor = item.easeFactor;
    let newRepetitions = item.repetitions;
    
    if (performance === 'again') {
      // Reset if failed
      newInterval = 1;
      newRepetitions = 0;
      newEaseFactor = Math.max(1.3, item.easeFactor - 0.2);
    } else if (performance === 'hard') {
      newInterval = item.interval * 1.2;
      newEaseFactor = Math.max(1.3, item.easeFactor - 0.15);
      newRepetitions += 1;
    } else if (performance === 'good') {
      newInterval = item.interval * item.easeFactor;
      newRepetitions += 1;
    } else { // easy
      newInterval = item.interval * item.easeFactor * 1.3;
      newEaseFactor = item.easeFactor + 0.15;
      newRepetitions += 1;
    }
    
    return {
      ...item,
      lastReviewed: Date.now(),
      interval: Math.max(1, Math.floor(newInterval)),
      easeFactor: newEaseFactor,
      repetitions: newRepetitions,
    };
  }
  
  /**
   * Get puzzles due for review
   */
  getDueReviews(items: SpacedRepetitionItem[]): SpacedRepetitionItem[] {
    const now = Date.now();
    return items.filter(item => {
      const daysSinceReview = (now - item.lastReviewed) / (1000 * 60 * 60 * 24);
      return daysSinceReview >= item.interval;
    });
  }
}
```

**Integration**:
- Automatically schedule review puzzles based on performance
- Prioritize weak areas in daily challenges
- Long-term retention tracking

---

### 2. Cognitive Load Theory

**Theory**: Learning is optimized when cognitive load is managed (intrinsic, extraneous, germane).

**Implementation**:

#### Intrinsic Load Management
- **Progressive Complexity**: Start simple, add complexity gradually
- **Chunking**: Break complex puzzles into manageable parts
- **Scaffolding**: Provide support that fades as skill increases

```typescript
/**
 * Cognitive load calculator
 */
export function calculateCognitiveLoad(puzzle: Puzzle, playerSkill: number): number {
  let load = 0;
  
  // Intrinsic load (inherent difficulty)
  load += puzzle.constraints.length * 0.2;
  load += puzzle.problemSpaceSize * 0.1;
  load += puzzle.patternComplexity * 0.3;
  
  // Extraneous load (presentation issues)
  if (puzzle.question.length > 200) load += 0.2; // Too wordy
  if (puzzle.options.length > 6) load += 0.1;    // Too many options
  
  // Germane load (productive thinking)
  const skillMatch = calculateSkillMatch(puzzle, playerSkill);
  load -= skillMatch * 0.3; // Reduce load if skill matches
  
  return Math.max(0, Math.min(1, load));
}

/**
 * Optimize puzzle presentation to reduce extraneous load
 */
export function optimizePresentation(puzzle: Puzzle): Puzzle {
  // Break long questions into paragraphs
  if (puzzle.question.length > 200) {
    puzzle.question = chunkText(puzzle.question, 150);
  }
  
  // Group related options
  if (puzzle.options.length > 6) {
    puzzle.options = groupOptions(puzzle.options);
  }
  
  // Add visual hierarchy
  puzzle.visualStructure = createVisualHierarchy(puzzle);
  
  return puzzle;
}
```

#### Extraneous Load Reduction
- **Clear Instructions**: Simple, unambiguous language
- **Visual Clarity**: High contrast, clear hierarchy
- **Minimal Distractions**: Focus on essential information
- **Consistent Patterns**: Predictable UI patterns

#### Germane Load Enhancement
- **Skill-Appropriate Challenges**: Match puzzle difficulty to player skill
- **Metacognitive Prompts**: "What strategy are you using?"
- **Reflection Opportunities**: Post-puzzle analysis
- **Pattern Recognition**: Help players see underlying patterns

---

### 3. Deliberate Practice

**Theory**: Improvement comes from focused practice on specific skills with immediate feedback.

**Implementation**:
```typescript
/**
 * Deliberate practice session generator
 */
export class DeliberatePracticeGenerator {
  /**
   * Generate practice session targeting specific skill gap
   */
  generatePracticeSession(
    skillGap: string,
    playerModel: PlayerCapabilityModel,
    duration: number // minutes
  ): PracticeSession {
    const puzzles: Puzzle[] = [];
    const targetSkill = skillGap;
    
    // Start slightly below current skill (zone of proximal development)
    const targetDifficulty = Math.max(0.1, 
      (playerModel[`${targetSkill}Skill` as keyof PlayerCapabilityModel] as number) - 0.1
    );
    
    // Generate focused practice puzzles
    for (let i = 0; i < Math.floor(duration / 3); i++) {
      const puzzle = generatePuzzle(targetSkill, targetDifficulty);
      puzzles.push(puzzle);
      
      // Gradually increase difficulty
      targetDifficulty += 0.05;
    }
    
    return {
      puzzles,
      focus: skillGap,
      estimatedDuration: duration,
      learningObjectives: getLearningObjectives(targetSkill),
    };
  }
  
  /**
   * Provide immediate, specific feedback
   */
  generateFeedback(performance: PuzzlePerformance): Feedback {
    return {
      correctness: performance.correct,
      explanation: performance.correct 
        ? explainCorrectReasoning(performance)
        : explainMistake(performance),
      suggestion: suggestImprovement(performance),
      nextStep: recommendNextPractice(performance),
    };
  }
}
```

**Features**:
- Targeted practice on identified weaknesses
- Immediate, specific feedback
- Gradual difficulty increase
- Clear learning objectives

---

### 4. Metacognition Development

**Theory**: Teaching players to think about their thinking improves learning.

**Implementation**:
```typescript
/**
 * Metacognitive prompts system
 */
export class MetacognitionPrompter {
  /**
   * Generate metacognitive prompts based on context
   */
  generatePrompt(context: 'before' | 'during' | 'after', puzzle: Puzzle): string {
    if (context === 'before') {
      return [
        "What strategy will you use to solve this?",
        "What patterns do you notice?",
        "What constraints are most important?",
      ][Math.floor(Math.random() * 3)];
    }
    
    if (context === 'during') {
      return [
        "Is your current approach working?",
        "What alternative strategies could you try?",
        "Are you considering all constraints?",
      ][Math.floor(Math.random() * 3)];
    }
    
    // after
    return [
      "What strategy did you use?",
      "What made this puzzle easy or hard?",
      "What would you do differently next time?",
    ][Math.floor(Math.random() * 3)];
  }
  
  /**
   * Track metacognitive awareness
   */
  assessMetacognition(
    predictedDifficulty: number,
    actualDifficulty: number,
    strategyUsed: string,
    strategyOptimal: string
  ): MetacognitionScore {
    const predictionAccuracy = 1 - Math.abs(predictedDifficulty - actualDifficulty);
    const strategyMatch = strategyUsed === strategyOptimal ? 1 : 0.5;
    
    return {
      predictionAccuracy,
      strategyMatch,
      overall: (predictionAccuracy + strategyMatch) / 2,
    };
  }
}
```

**Features**:
- Pre-puzzle strategy prompts
- Mid-puzzle reflection prompts
- Post-puzzle analysis prompts
- Metacognitive awareness tracking

---

### 5. Transfer of Learning

**Theory**: Skills learned in one context should transfer to similar contexts.

**Implementation**:
```typescript
/**
 * Transfer of learning tracker
 */
export class TransferTracker {
  /**
   * Identify transferable skills
   */
  identifyTransferableSkills(gameSkills: Record<string, number>): TransferableSkill[] {
    const transfers: TransferableSkill[] = [];
    
    // Logic skills transfer across puzzle types
    if (gameSkills.logic > 0.7) {
      transfers.push({
        skill: 'logical-reasoning',
        source: 'logic-puzzles',
        target: ['deduction-puzzles', 'constraint-puzzles'],
        confidence: gameSkills.logic,
      });
    }
    
    // Pattern recognition transfers to visual puzzles
    if (gameSkills.pattern > 0.7) {
      transfers.push({
        skill: 'pattern-recognition',
        source: 'pattern-puzzles',
        target: ['visual-puzzles', 'sequence-puzzles'],
        confidence: gameSkills.pattern,
      });
    }
    
    return transfers;
  }
  
  /**
   * Measure transfer effectiveness
   */
  measureTransfer(
    sourceSkill: string,
    targetContext: string,
    performance: number
  ): TransferEffectiveness {
    const baseline = getBaselinePerformance(targetContext);
    const improvement = performance - baseline;
    
    return {
      sourceSkill,
      targetContext,
      improvement,
      transferStrength: Math.min(1, improvement / 0.3), // Normalize
    };
  }
}
```

**Features**:
- Track skill transfer across puzzle types
- Measure transfer effectiveness
- Recommend puzzles that build on existing skills
- Cross-game skill transfer tracking

---

### 6. Growth Mindset Reinforcement

**Theory**: Believing abilities can improve leads to better learning outcomes.

**Implementation**:
```typescript
/**
 * Growth mindset messaging system
 */
export class GrowthMindsetMessenger {
  /**
   * Generate growth mindset messages
   */
  getMessage(context: MessageContext): string {
    if (context.type === 'mistake') {
      return [
        "Mistakes are opportunities to learn. What did this teach you?",
        "Every expert was once a beginner. Keep practicing!",
        "This is challenging, which means you're growing.",
      ][Math.floor(Math.random() * 3)];
    }
    
    if (context.type === 'improvement') {
      return [
        "You're getting better! Your practice is paying off.",
        "Look how far you've come. Keep it up!",
        "Your skills are improving. Well done!",
      ][Math.floor(Math.random() * 3)];
    }
    
    if (context.type === 'plateau') {
      return [
        "Plateaus are normal. Try a different approach.",
        "Sometimes progress feels slow, but you're still learning.",
        "Challenge yourself with something new to break through.",
      ][Math.floor(Math.random() * 3)];
    }
    
    return "Keep learning and growing!";
  }
  
  /**
   * Avoid fixed mindset language
   */
  sanitizeFeedback(feedback: string): string {
    // Replace fixed mindset phrases
    const replacements: Record<string, string> = {
      "You're not good at this": "This is challenging right now",
      "You're bad at logic": "Logic puzzles are difficult for you",
      "You'll never get this": "This takes practice to master",
      "You're not smart enough": "This requires more practice",
    };
    
    let sanitized = feedback;
    for (const [fixed, growth] of Object.entries(replacements)) {
      sanitized = sanitized.replace(new RegExp(fixed, 'gi'), growth);
    }
    
    return sanitized;
  }
}
```

**Features**:
- Growth mindset messaging
- Avoid fixed mindset language
- Emphasize effort and process
- Celebrate improvement, not just success

---

### 7. Spaced Learning

**Theory**: Distributed practice is more effective than massed practice.

**Implementation**:
```typescript
/**
 * Spaced learning scheduler
 */
export class SpacedLearningScheduler {
  /**
   * Schedule learning sessions with optimal spacing
   */
  scheduleLearningSessions(
    skill: string,
    totalSessions: number,
    totalDays: number
  ): SessionSchedule {
    // Optimal spacing: 1 day, 3 days, 7 days, 14 days, 30 days
    const spacing = [1, 3, 7, 14, 30];
    const sessions: ScheduledSession[] = [];
    
    let currentDay = 0;
    for (let i = 0; i < totalSessions && currentDay < totalDays; i++) {
      const interval = spacing[Math.min(i, spacing.length - 1)];
      currentDay += interval;
      
      sessions.push({
        day: currentDay,
        skill,
        difficulty: calculateDifficultyForSession(i, totalSessions),
        review: i > 0, // Review sessions after first
      });
    }
    
    return { sessions, totalDays: currentDay };
  }
}
```

**Features**:
- Optimal spacing between practice sessions
- Review sessions at increasing intervals
- Long-term retention focus

---

### 8. Retrieval Practice

**Theory**: Actively recalling information strengthens memory more than re-reading.

**Implementation**:
```typescript
/**
 * Retrieval practice generator
 */
export class RetrievalPracticeGenerator {
  /**
   * Generate retrieval practice (recall, not recognition)
   */
  generateRetrievalPractice(learnedContent: LearnedContent): RetrievalPractice {
    // Instead of multiple choice, ask player to generate solution
    return {
      type: 'generation',
      prompt: "Recall the strategy you used to solve similar puzzles",
      expectedElements: learnedContent.keyConcepts,
      feedback: (response: string) => {
        return checkConceptPresence(response, learnedContent.keyConcepts);
      },
    };
  }
}
```

**Features**:
- Active recall exercises
- Generation practice (not just recognition)
- Concept mapping
- Self-explanation prompts

---

## Learning Analytics

### Skill Development Tracking

```typescript
/**
 * Track skill development over time
 */
export interface SkillDevelopment {
  skill: string;
  measurements: Array<{
    timestamp: number;
    level: number;
    context: string;
  }>;
  trend: 'improving' | 'stable' | 'declining' | 'plateau';
  velocity: number; // Rate of change
  predictedMastery: number; // Days to mastery
}

export function trackSkillDevelopment(
  skill: string,
  measurements: SkillMeasurement[]
): SkillDevelopment {
  const trend = calculateTrend(measurements);
  const velocity = calculateVelocity(measurements);
  const predictedMastery = predictMasteryDate(measurements, velocity);
  
  return {
    skill,
    measurements,
    trend,
    velocity,
    predictedMastery,
  };
}
```

### Learning Effectiveness Metrics

- **Retention Rate**: How well skills persist over time
- **Transfer Rate**: How well skills transfer to new contexts
- **Improvement Velocity**: Rate of skill improvement
- **Efficiency**: Time to mastery
- **Engagement**: Time spent in productive practice

---

## Evidence-Based Design Decisions

### 1. Immediate Feedback
- **Evidence**: Immediate feedback improves learning (Hattie, 2009)
- **Implementation**: Instant feedback on answers with explanations

### 2. Worked Examples
- **Evidence**: Worked examples reduce cognitive load (Sweller, 2006)
- **Implementation**: Show step-by-step solutions for difficult puzzles

### 3. Interleaving
- **Evidence**: Interleaving improves transfer (Rohrer, 2012)
- **Implementation**: Mix puzzle types rather than blocking by type

### 4. Elaborative Interrogation
- **Evidence**: Asking "why" improves learning (Pressley, 1987)
- **Implementation**: "Why is this the correct answer?" prompts

### 5. Self-Explanation
- **Evidence**: Explaining to oneself improves understanding (Chi, 1989)
- **Implementation**: "Explain your reasoning" prompts

---

## Integration with Game Systems

### Daily Challenges
- Incorporate spaced repetition for weak areas
- Use interleaving to mix puzzle types
- Include retrieval practice elements

### Practice Mode
- Deliberate practice sessions targeting specific skills
- Spaced learning schedules
- Metacognitive prompts

### Analysis Reports
- Learning effectiveness metrics
- Skill development trends
- Transfer of learning evidence
- Growth mindset reinforcement

---

This learning science integration ensures the game maximizes educational effectiveness while maintaining engagement and fun.
