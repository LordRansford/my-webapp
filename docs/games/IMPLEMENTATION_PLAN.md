# Games Platform Implementation Plan

## Repo Inventory

### Existing Games Infrastructure
- **Canvas-based games**: `src/games/` - Action games (pulse-runner, skyline-drift, vault-circuit)
- **Game components**: `src/components/play/GameShell.tsx` - Basic game shell
- **Games registry**: `src/lib/games-registry.ts` - Basic metadata registry
- **Games pages**: `src/app/games/` - Games hub and individual game pages
- **Practice games**: `src/components/games/` - Interactive practice games

### Routes
- `/games` - Main games hub
- `/games/[slug]` - Individual game pages
- `/practice` - Practice games
- `/play` - Play hub
- `/thinking-gym` - Thinking gym

### Styling
- Uses Tailwind CSS
- Consistent with site theme (slate colors, rounded corners)
- Mobile-first approach

## Minimal File Set to Touch

### Phase 1: Foundation
1. `src/lib/games/framework/GameShell.tsx` - Unified game shell UI
2. `src/lib/games/framework/InputLayer.ts` - Keyboard and touch input handling
3. `src/lib/games/framework/RenderingLayer.ts` - Canvas and React rendering abstraction
4. `src/lib/games/framework/StateManager.ts` - Pure state management with replay logging
5. `src/lib/games/framework/DifficultyEngine.ts` - Adaptive difficulty system
6. `src/lib/games/framework/ExplainabilityEngine.ts` - Post-game analysis
7. `src/lib/games/framework/types.ts` - Core type definitions
8. `src/app/games/hub/page.tsx` - New unified games hub
9. `src/app/games/hub/GamesHub.client.tsx` - Client component for hub

### Phase 2: Anchor Games (5 games)
1. `src/lib/games/games/daily-logic-gauntlet/` - Daily Logic Gauntlet
2. `src/lib/games/games/grid-racer/` - Grid Racer Time Trial
3. `src/lib/games/games/draft-duel/` - Draft Duel Card Battler
4. `src/lib/games/games/hex/` - Hex game
5. `src/lib/games/games/systems-mastery/` - Systems Mastery Game

## Implementation Strategy

### Step 1: Create Framework Core
- Build GameShell with consistent layout
- Implement input abstraction (keyboard + touch)
- Create rendering abstraction (canvas + React)
- Build state manager with deterministic RNG and replay logging

### Step 2: Build Difficulty & Explainability
- Implement difficulty curve engine
- Build explainability engine (deterministic heuristics)

### Step 3: Create Games Hub
- Build new unified hub page
- Add filters (solo vs multiplayer, category, difficulty)
- Add preview cards

### Step 4: Implement Anchor Games
- Use framework to build 5 representative games
- Ensure all use shared components

## Safety & Compliance

- ✅ No free-text chat (structured signals only)
- ✅ Pseudonymous by default
- ✅ All user content sanitized
- ✅ Browser-only single-player (no server compute)
- ✅ Async-first multiplayer
- ✅ No paid APIs
- ✅ WCAG 2.2 AA compliant
- ✅ Mobile-first design
