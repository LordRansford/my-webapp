# Tutorial System Documentation

## Overview

The Tutorial System provides an interactive, step-by-step guide that helps new players learn the game mechanics. It uses a structured approach with highlights, interactive elements, and progressive disclosure to ensure players understand all features before starting their first game.

## Features

### Core Functionality
- **Step-by-Step Guidance**: 9 tutorial steps covering all game mechanics
- **Interactive Learning**: Players interact with elements to proceed
- **Highlight System**: Highlights relevant UI elements
- **Progress Tracking**: Tracks completed steps
- **Skip Option**: Allows experienced players to skip
- **Persistence**: Remembers tutorial completion state

### Tutorial Steps

1. **Welcome** - Introduction to the game
2. **Objective** - Goal explanation
3. **Puzzle Types** - Different puzzle categories
4. **Answering** - How to select answers
5. **Hints** - Using the hint system
6. **Progress** - Understanding progress tracking
7. **Analysis** - Post-game analysis report
8. **Streaks** - Daily streak mechanics
9. **Complete** - Ready to play confirmation

## Architecture

### Data Structures

#### `TutorialStep`
```typescript
type TutorialStep = 
  | 'welcome'
  | 'objective'
  | 'puzzle-types'
  | 'answering'
  | 'hints'
  | 'progress'
  | 'analysis'
  | 'streaks'
  | 'complete';
```

#### `TutorialStepData`
```typescript
interface TutorialStepData {
  id: TutorialStep;
  title: string;
  content: string;
  highlights?: string[]; // Element IDs or selectors to highlight
  interactive?: boolean; // Whether user needs to interact to proceed
  actions?: string[]; // Actions user needs to perform
}
```

#### `TutorialState`
```typescript
interface TutorialState {
  isActive: boolean;
  currentStep: number;
  completedSteps: Set<TutorialStep>;
  skipped: boolean;
}
```

## API Reference

### Core Functions

#### `shouldShowTutorial()`
Checks if tutorial should be shown (first-time player).

```typescript
shouldShowTutorial(): boolean
```

**Returns**: True if tutorial should be shown

**Example**:
```typescript
useEffect(() => {
  if (shouldShowTutorial()) {
    startTutorial();
  }
}, []);
```

#### `startTutorial()`
Starts the tutorial.

```typescript
startTutorial(): TutorialState
```

**Returns**: Updated tutorial state

**Example**:
```typescript
const handleStartTutorial = () => {
  const state = startTutorial();
  setTutorialState(state);
};
```

#### `nextTutorialStep()`
Moves to the next tutorial step.

```typescript
nextTutorialStep(state: TutorialState): TutorialState
```

**Parameters**:
- `state`: Current tutorial state

**Returns**: Updated tutorial state

**Example**:
```typescript
const handleNext = () => {
  setTutorialState(prev => nextTutorialStep(prev));
};
```

#### `previousTutorialStep()`
Moves to the previous tutorial step.

```typescript
previousTutorialStep(state: TutorialState): TutorialState
```

**Parameters**:
- `state`: Current tutorial state

**Returns**: Updated tutorial state

#### `getCurrentTutorialStep()`
Gets the current tutorial step data.

```typescript
getCurrentTutorialStep(state: TutorialState): TutorialStepData | null
```

**Parameters**:
- `state`: Current tutorial state

**Returns**: Current step data or null

#### `completeTutorialStep()`
Marks a tutorial step as completed.

```typescript
completeTutorialStep(step: TutorialStep): void
```

**Parameters**:
- `step`: Step ID to mark as completed

#### `skipTutorial()`
Skips the tutorial entirely.

```typescript
skipTutorial(): void
```

**Example**:
```typescript
const handleSkip = () => {
  skipTutorial();
  setTutorialState(prev => ({ ...prev, isActive: false }));
};
```

### State Management Functions

#### `loadTutorialState()`
Loads tutorial state from localStorage.

```typescript
loadTutorialState(): TutorialState
```

**Returns**: Tutorial state

#### `saveTutorialState()`
Saves tutorial state to localStorage.

```typescript
saveTutorialState(state: TutorialState): void
```

**Parameters**:
- `state`: Tutorial state to save

#### `resetTutorial()`
Resets tutorial state (for testing).

```typescript
resetTutorial(): void
```

## Usage Examples

### Basic Tutorial Integration

```typescript
import { 
  loadTutorialState, 
  startTutorial, 
  nextTutorialStep,
  getCurrentTutorialStep,
  skipTutorial 
} from './tutorial';

function GameComponent() {
  const [tutorialState, setTutorialState] = useState(loadTutorialState());
  const [showTutorial, setShowTutorial] = useState(tutorialState.isActive);
  
  const currentStep = getCurrentTutorialStep(tutorialState);
  
  const handleNext = () => {
    setTutorialState(prev => nextTutorialStep(prev));
  };
  
  const handleSkip = () => {
    skipTutorial();
    setShowTutorial(false);
  };
  
  return (
    <>
      {showTutorial && currentStep && (
        <TutorialOverlay
          step={currentStep}
          onNext={handleNext}
          onSkip={handleSkip}
        />
      )}
      {/* Game content */}
    </>
  );
}
```

### Interactive Tutorial Step

```typescript
function TutorialOverlay({ step, onNext, onSkip }) {
  // Highlight elements
  useEffect(() => {
    if (step.highlights) {
      step.highlights.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
          element.classList.add('tutorial-highlight');
        }
      });
      
      return () => {
        step.highlights?.forEach(selector => {
          const element = document.querySelector(selector);
          if (element) {
            element.classList.remove('tutorial-highlight');
          }
        });
      };
    }
  }, [step]);
  
  return (
    <div className="tutorial-overlay">
      <div className="tutorial-content">
        <h2>{step.title}</h2>
        <p>{step.content}</p>
        
        {step.interactive && step.actions && (
          <div className="tutorial-actions">
            {step.actions.map((action, i) => (
              <p key={i}>• {action}</p>
            ))}
          </div>
        )}
        
        <div className="tutorial-controls">
          <button onClick={onSkip}>Skip</button>
          <button onClick={onNext}>
            {step.interactive ? 'I understand' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Auto-start Tutorial for New Players

```typescript
import { shouldShowTutorial, startTutorial } from './tutorial';

function GameComponent() {
  const [tutorialState, setTutorialState] = useState(loadTutorialState());
  
  useEffect(() => {
    if (shouldShowTutorial() && status === 'idle') {
      const state = startTutorial();
      setTutorialState(state);
    }
  }, [status]);
  
  // ... rest of component
}
```

## Tutorial Step Details

### Step 1: Welcome
- **Purpose**: Introduces the game
- **Interactive**: No
- **Highlights**: None

### Step 2: Objective
- **Purpose**: Explains the goal
- **Interactive**: No
- **Highlights**: None

### Step 3: Puzzle Types
- **Purpose**: Explains different puzzle types
- **Interactive**: No
- **Highlights**: `['puzzle-type-badge']`

### Step 4: Answering
- **Purpose**: Shows how to answer puzzles
- **Interactive**: Yes
- **Actions**: `['Select an answer option to continue']`
- **Highlights**: `['answer-options']`

### Step 5: Hints
- **Purpose**: Explains hint system
- **Interactive**: Yes
- **Actions**: `['Try using a hint']`
- **Highlights**: `['hint-button']`

### Step 6: Progress
- **Purpose**: Explains progress tracking
- **Interactive**: No
- **Highlights**: `['progress-panel']`

### Step 7: Analysis
- **Purpose**: Explains analysis report
- **Interactive**: No
- **Highlights**: `['analysis-report']`

### Step 8: Streaks
- **Purpose**: Explains streak system
- **Interactive**: No
- **Highlights**: `['streak-display']`

### Step 9: Complete
- **Purpose**: Confirms readiness
- **Interactive**: No

## Styling Guidelines

### Tutorial Overlay
- Full-screen overlay with semi-transparent background
- Centered modal content
- Clear typography
- Accessible color contrast

### Highlighted Elements
- Add border or glow effect
- Ensure visibility against background
- Don't obstruct interaction

### Tutorial Content
- Clear headings
- Bullet points for lists
- Sufficient padding
- Readable font sizes

## Integration Points

### With Game Component
- Show tutorial before first game
- Highlight relevant elements
- Track interaction for interactive steps
- Auto-advance when interaction completed

### With UI Elements
- Add IDs to key elements for highlighting
- Ensure elements are accessible
- Support keyboard navigation

## Best Practices

1. **First-Time Detection**: Show tutorial automatically for new players
2. **Non-Intrusive**: Allow skipping at any time
3. **Progressive**: Don't overwhelm with all information at once
4. **Interactive**: Let players try features during tutorial
5. **Accessible**: Ensure tutorial works with screen readers
6. **Persistent**: Remember completion state
7. **Replayable**: Allow replaying tutorial from settings

## Future Enhancements

- Video tutorials for complex concepts
- Contextual help system
- In-game tooltips
- Tutorial for advanced features
- Localized tutorials
- Accessibility mode tutorials
