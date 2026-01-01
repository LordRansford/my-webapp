# Assessment Seeds

This directory contains assessment questions for the Software Architecture course.

## Files

- `software-architecture-assessments.json` - Complete question bank (150 questions)
- `seed-assessments.js` - Seed script to import questions into database

## Usage

```bash
cd /home/runner/work/my-webapp/my-webapp
node prisma/seeds/seed-assessments.js
```

## Structure

Each assessment includes:
- courseId: "software-architecture"
- levelId: "foundations" | "intermediate" | "advanced"
- passThreshold: 80
- timeLimit: minutes
- questions: Array of 50 questions per tier

Each question includes:
- type: MCQ | MultiResponse | Scenario | Practical
- bloomLevel: 1-6
- difficultyTarget: 0.25-0.85
- question: string
- options: string[]
- correctAnswer: string | string[]
- explanation: string
- tags: string (comma-separated)

## Question Distribution

### Foundation (50 questions)
- 10 Bloom Level 1 (Remember)
- 10 Bloom Level 2 (Understand)
- 15 Bloom Level 3 (Apply)
- 10 Bloom Level 4 (Analyze)
- 5 Bloom Level 5 (Evaluate)

### Intermediate (50 questions)
- 5 Bloom Level 2 (Understand)
- 15 Bloom Level 3 (Apply)
- 20 Bloom Level 4 (Analyze)
- 10 Bloom Level 5 (Evaluate)

### Advanced (50 questions)
- 5 Bloom Level 3 (Apply)
- 15 Bloom Level 4 (Analyze)
- 20 Bloom Level 5 (Evaluate)
- 10 Bloom Level 6 (Create)

Total: 150 questions
