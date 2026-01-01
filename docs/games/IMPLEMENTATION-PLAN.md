# 5 Games Implementation Plan

## Status: In Progress

### Completed
- ✅ Variable Rewards System infrastructure
- ✅ Allocation Architect (exists, needs enhancement)
- ✅ Signal Hunt types defined

### In Progress
- 🔄 Signal Hunt (Game 6) - Core implementation
- ⏳ Proof Sprint (Game 7)
- ⏳ Packet Route (Game 9)
- ⏳ Governance Simulator (Game 10)

## Implementation Strategy

Each game requires:
1. Types (`types.ts`)
2. Challenge/Scenario Generator (`*Generator.ts`)
3. Game State Engine (`gameState.ts`)
4. Action/Resolution Engine (`*Engine.ts`)
5. Persistence (`persistence.ts`)
6. Explainability Analyzer (`explainabilityAnalyzer.ts`)
7. Main Component (`*.tsx`)
8. Index export (`index.ts`)

## Priority Order
1. Signal Hunt (Game 6) - Cybersecurity domain
2. Proof Sprint (Game 7) - Educational value
3. Packet Route (Game 9) - Technical domain
4. Governance Simulator (Game 10) - Advanced domain
5. Allocation Architect enhancement - Already exists
