# Games Framework

A unified framework for building premium, accessible games in the Ransford's Notes platform.

## Features

- **Consistent UI Shell**: All games use the same `GameShell` component for unified experience
- **Deterministic State Management**: Seeded RNG and replay logging for fair play
- **Adaptive Difficulty**: Difficulty engine that adjusts based on player performance
- **Post-Game Analysis**: Explainability engine provides insights without AI
- **Accessibility First**: WCAG 2.2 AA compliant with keyboard and touch support
- **Error Handling**: Comprehensive error boundaries and graceful degradation
- **Performance Optimized**: Lazy loading, memoization, and efficient rendering

## Architecture

### Core Components

1. **GameShell** (`GameShell.tsx`)
   - Unified UI wrapper for all games
   - Header with game info and controls
   - Main play area
   - Right panel for stats/rules
   - Footer with accessibility info

2. **StateManager** (`StateManager.ts`)
   - Pure data structures (no React state)
   - Deterministic RNG with seed
   - Replay logging for anti-cheat
   - State serialization/deserialization

3. **DifficultyEngine** (`DifficultyEngine.ts`)
   - Time-based difficulty curves
   - Adaptive ramping based on performance
   - Never drops below minimum threshold

4. **ExplainabilityEngine** (`ExplainabilityEngine.ts`)
   - Deterministic post-game analysis
   - Identifies turning points, mistakes, and good decisions
   - No paid AI required

5. **InputLayer** (`InputLayer.ts`)
   - Unified keyboard and touch input
   - Event normalization
   - Proper cleanup and memory management

6. **RenderingLayer** (`RenderingLayer.ts`)
   - Canvas rendering with `requestAnimationFrame`
   - React-based board rendering
   - High DPI support

### Game Structure

Each game should:

1. Use `GameShell` as the wrapper
2. Implement game-specific logic in the main component
3. Use `StateManager` for state and RNG
4. Use `DifficultyEngine` for adaptive difficulty
5. Use `ExplainabilityEngine` for post-game analysis
6. Handle errors gracefully
7. Be fully accessible (keyboard + screen reader)

## Example Game

```tsx
import GameShell from "@/lib/games/framework/GameShell";
import { StateManager } from "@/lib/games/framework/StateManager";
import { DifficultyEngine } from "@/lib/games/framework/DifficultyEngine";
import { ExplainabilityEngine } from "@/lib/games/framework/ExplainabilityEngine";
import type { GameConfig, GameStatus } from "@/lib/games/framework/types";

const GAME_CONFIG: GameConfig = {
  id: "my-game",
  title: "My Game",
  description: "A great game",
  category: "puzzle",
  modes: ["solo"],
  supportsMultiplayer: false,
  minPlayers: 1,
  maxPlayers: 1,
  estimatedMinutes: 10,
  tutorialAvailable: true,
};

export default function MyGame() {
  const [status, setStatus] = useState<GameStatus>("idle");
  const seed = useMemo(() => Math.floor(Math.random() * 1000000), []);
  const stateManager = useMemo(() => new StateManager({ status: "idle" }, seed), [seed]);
  const difficultyEngine = useMemo(() => new DifficultyEngine({...}), []);
  const explainabilityEngine = useMemo(() => new ExplainabilityEngine(), []);

  // Game logic here...

  return (
    <GameShell
      config={GAME_CONFIG}
      status={status}
      onStart={handleStart}
      onReset={handleReset}
      rightPanel={<StatsPanel />}
    >
      {/* Game content */}
    </GameShell>
  );
}
```

## Accessibility

All games must:

- Support keyboard navigation (Arrow keys, Space, Enter, Escape)
- Support touch gestures (swipe, tap)
- Have proper ARIA labels and roles
- Use semantic HTML
- Provide screen reader announcements
- Support reduced motion preferences
- Have high contrast defaults

## Performance

- Games are lazy-loaded via dynamic imports
- Canvas rendering uses `requestAnimationFrame` for smooth 60fps
- React components use `useMemo` and `useCallback` appropriately
- State updates are batched and optimized

## Error Handling

- All games are wrapped in `GameErrorBoundary`
- Errors are logged (development) or reported (production)
- Users get clear error messages with recovery options
- Games gracefully degrade on errors

## Testing

Games should be tested for:

- Keyboard navigation
- Touch controls
- Screen reader compatibility
- Error scenarios
- Performance (60fps for canvas games)
- Deterministic replay (same seed + moves = same outcome)

## Best Practices

1. **Always use the framework components** - don't reinvent the wheel
2. **Keep game logic pure** - use StateManager for all state
3. **Make games accessible** - test with keyboard and screen reader
4. **Handle errors gracefully** - use error boundaries
5. **Optimize performance** - use memoization and lazy loading
6. **Provide feedback** - use ARIA live regions for status updates
7. **Test thoroughly** - especially on mobile devices

## License

Part of Ransford's Notes platform. See main project license.
