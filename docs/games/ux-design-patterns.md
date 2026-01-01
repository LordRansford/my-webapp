# UX Design Patterns - Gold Standard Exceeded

**Purpose**: Comprehensive UX patterns that create exceptional user experiences

---

## Core UX Principles

### 1. Progressive Disclosure

**Pattern**: Reveal complexity gradually, show only what's needed when needed.

**Implementation**:
```typescript
/**
 * Progressive disclosure component
 */
export function ProgressiveDisclosure({
  title,
  summary,
  details,
  level = 'basic'
}: ProgressiveDisclosureProps) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="progressive-disclosure">
      <div className="summary" onClick={() => setExpanded(!expanded)}>
        <h3>{title}</h3>
        <p>{summary}</p>
        <button aria-expanded={expanded}>
          {expanded ? 'Show Less' : 'Show More'}
        </button>
      </div>
      
      {expanded && (
        <div className="details" aria-live="polite">
          {details}
        </div>
      )}
    </div>
  );
}
```

**Use Cases**:
- Puzzle explanations (summary → full explanation)
- Analysis reports (key moments → detailed breakdown)
- Settings (basic → advanced)
- Tutorial steps (one concept at a time)

---

### 2. Immediate Feedback

**Pattern**: Provide instant, clear feedback for all actions.

**Implementation**:
```typescript
/**
 * Feedback system with multiple channels
 */
export function useFeedback() {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  
  function showFeedback(
    type: 'success' | 'error' | 'info' | 'warning',
    message: string,
    duration = 3000
  ) {
    setFeedback({ type, message, timestamp: Date.now() });
    
    // Visual feedback
    triggerVisualFeedback(type);
    
    // Haptic feedback (if supported)
    if ('vibrate' in navigator) {
      navigator.vibrate(type === 'success' ? 50 : 100);
    }
    
    // Audio feedback (if enabled)
    playSound(type);
    
    // Screen reader announcement
    announceToScreenReader(message);
    
    // Auto-dismiss
    setTimeout(() => setFeedback(null), duration);
  }
  
  return { feedback, showFeedback };
}
```

**Feedback Channels**:
- Visual: Color, icons, animations
- Haptic: Vibration patterns
- Audio: Sound effects (optional)
- Text: Clear messages
- Screen reader: ARIA announcements

---

### 3. Error Prevention

**Pattern**: Prevent errors before they happen.

**Implementation**:
```typescript
/**
 * Error prevention system
 */
export function useErrorPrevention() {
  function preventDestructiveAction(
    action: () => void,
    confirmation: ConfirmationConfig
  ) {
    return () => {
      if (confirmation.required) {
        showConfirmationDialog({
          title: confirmation.title,
          message: confirmation.message,
          onConfirm: action,
          onCancel: () => {},
        });
      } else {
        action();
      }
    };
  }
  
  function validateBeforeSubmit(data: FormData): ValidationResult {
    const errors: string[] = [];
    
    // Real-time validation
    if (!data.required && !data.value) {
      errors.push(`${data.label} is required`);
    }
    
    // Format validation
    if (data.type === 'email' && !isValidEmail(data.value)) {
      errors.push('Please enter a valid email address');
    }
    
    // Constraint validation
    if (data.constraints) {
      for (const constraint of data.constraints) {
        if (!constraint.validate(data.value)) {
          errors.push(constraint.message);
        }
      }
    }
    
    return {
      valid: errors.length === 0,
      errors,
    };
  }
  
  return { preventDestructiveAction, validateBeforeSubmit };
}
```

**Prevention Strategies**:
- Confirmation dialogs for destructive actions
- Real-time validation
- Constraint checking
- Undo/redo support
- Auto-save

---

### 4. Undo/Redo System

**Pattern**: Allow users to reverse actions.

**Implementation**:
```typescript
/**
 * Undo/redo manager
 */
export class UndoRedoManager {
  private history: Action[] = [];
  private currentIndex = -1;
  private maxHistory = 50;
  
  execute(action: Action): void {
    // Remove any actions after current index (if user undid then did something new)
    this.history = this.history.slice(0, this.currentIndex + 1);
    
    // Execute action
    action.execute();
    
    // Add to history
    this.history.push(action);
    this.currentIndex++;
    
    // Limit history size
    if (this.history.length > this.maxHistory) {
      this.history.shift();
      this.currentIndex--;
    }
  }
  
  undo(): void {
    if (this.canUndo()) {
      const action = this.history[this.currentIndex];
      action.undo();
      this.currentIndex--;
    }
  }
  
  redo(): void {
    if (this.canRedo()) {
      this.currentIndex++;
      const action = this.history[this.currentIndex];
      action.execute();
    }
  }
  
  canUndo(): boolean {
    return this.currentIndex >= 0;
  }
  
  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }
}
```

**Use Cases**:
- Answer selection (undo last choice)
- Hint usage (undo hint request)
- Settings changes
- Puzzle navigation

---

### 5. Skeleton Loading

**Pattern**: Show content structure while loading.

**Implementation**:
```typescript
/**
 * Skeleton loader component
 */
export function PuzzleSkeleton() {
  return (
    <div className="puzzle-skeleton" aria-busy="true" aria-label="Loading puzzle">
      <div className="skeleton-header">
        <div className="skeleton-line" style={{ width: '60%' }} />
        <div className="skeleton-line" style={{ width: '40%' }} />
      </div>
      
      <div className="skeleton-content">
        <div className="skeleton-line" />
        <div className="skeleton-line" />
        <div className="skeleton-line" style={{ width: '80%' }} />
      </div>
      
      <div className="skeleton-options">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="skeleton-option" />
        ))}
      </div>
    </div>
  );
}
```

**Benefits**:
- Perceived performance improvement
- Reduces layout shift
- Clear loading state
- Better UX than blank screen

---

### 6. Optimistic Updates

**Pattern**: Update UI immediately, rollback on error.

**Implementation**:
```typescript
/**
 * Optimistic update hook
 */
export function useOptimisticUpdate<T>(
  updateFn: (data: T) => Promise<T>,
  rollbackFn: (previous: T) => void
) {
  const [isUpdating, setIsUpdating] = useState(false);
  const previousValueRef = useRef<T | null>(null);
  
  async function update(data: T) {
    // Save previous value
    previousValueRef.current = data;
    
    // Optimistically update UI
    setIsUpdating(true);
    
    try {
      // Perform actual update
      const result = await updateFn(data);
      setIsUpdating(false);
      return result;
    } catch (error) {
      // Rollback on error
      if (previousValueRef.current) {
        rollbackFn(previousValueRef.current);
      }
      setIsUpdating(false);
      throw error;
    }
  }
  
  return { update, isUpdating };
}
```

**Use Cases**:
- Answer submission (show as selected immediately)
- Hint requests (show hint immediately)
- Settings changes
- Progress updates

---

### 7. Micro-Interactions

**Pattern**: Delightful, purposeful animations for user actions.

**Implementation**:
```typescript
/**
 * Micro-interaction system
 */
export function useMicroInteractions() {
  const reducedMotion = useReducedMotion();
  
  function celebrateSuccess() {
    if (reducedMotion) return;
    
    // Confetti animation
    triggerConfetti();
    
    // Success sound
    playSound('success');
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 30, 50]);
    }
  }
  
  function indicateError() {
    if (reducedMotion) return;
    
    // Shake animation
    triggerShake();
    
    // Error sound
    playSound('error');
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  }
  
  function highlightCorrect(answerIndex: number) {
    if (reducedMotion) return;
    
    // Pulse animation
    triggerPulse(answerIndex);
    
    // Checkmark animation
    triggerCheckmark(answerIndex);
  }
  
  return { celebrateSuccess, indicateError, highlightCorrect };
}
```

**Micro-Interactions**:
- Button press feedback
- Answer selection animation
- Success celebrations
- Error indications
- Progress animations
- Loading states

---

### 8. Contextual Help

**Pattern**: Provide help exactly when and where needed.

**Implementation**:
```typescript
/**
 * Contextual help system
 */
export function useContextualHelp() {
  const [helpVisible, setHelpVisible] = useState(false);
  const [helpContext, setHelpContext] = useState<string | null>(null);
  
  function showHelp(context: string) {
    setHelpContext(context);
    setHelpVisible(true);
  }
  
  function hideHelp() {
    setHelpVisible(false);
    setHelpContext(null);
  }
  
  // Auto-show help for first-time users
  useEffect(() => {
    const hasSeenHelp = localStorage.getItem(`help-seen-${helpContext}`);
    if (!hasSeenHelp && helpContext) {
      setTimeout(() => showHelp(helpContext), 2000);
      localStorage.setItem(`help-seen-${helpContext}`, 'true');
    }
  }, [helpContext]);
  
  return { helpVisible, helpContext, showHelp, hideHelp };
}
```

**Help Types**:
- Tooltips on hover/focus
- Inline explanations
- Contextual tips
- Progressive hints
- Tutorial overlays

---

### 9. Empty States

**Pattern**: Guide users when there's no content.

**Implementation**:
```typescript
/**
 * Empty state component
 */
export function EmptyState({
  icon,
  title,
  description,
  action
}: EmptyStateProps) {
  return (
    <div className="empty-state" role="status">
      <div className="empty-state-icon" aria-hidden="true">
        {icon}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action && (
        <button onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}
```

**Use Cases**:
- No puzzles completed yet
- No streaks started
- Archive empty
- No community puzzles

---

### 10. Onboarding Flow

**Pattern**: Guide new users through key features.

**Implementation**:
```typescript
/**
 * Onboarding system
 */
export function useOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  
  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Daily Logic Gauntlet',
      content: 'Learn logical reasoning through daily puzzles',
      target: '#welcome-section',
    },
    {
      id: 'daily-challenge',
      title: 'Daily Challenges',
      content: 'New puzzles every day, same for everyone',
      target: '#daily-challenge-button',
    },
    {
      id: 'hints',
      title: 'Using Hints',
      content: 'You have 3 hints per gauntlet. Use them wisely!',
      target: '#hint-button',
    },
    {
      id: 'analysis',
      title: 'Analysis Reports',
      content: 'Review your performance and learn from mistakes',
      target: '#analysis-button',
    },
  ];
  
  function nextStep() {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  }
  
  function completeOnboarding() {
    setCompleted(true);
    localStorage.setItem('onboarding-completed', 'true');
  }
  
  return {
    currentStep: steps[currentStep],
    nextStep,
    skip: completeOnboarding,
    completed,
  };
}
```

**Onboarding Features**:
- Optional but recommended
- Skippable at any time
- Progress saved
- Can be replayed
- Contextual to user actions

---

## Mobile-First Patterns

### 1. Touch Gestures

```typescript
/**
 * Touch gesture handler
 */
export function useTouchGestures() {
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  
  function handleSwipe(direction: 'left' | 'right') {
    setSwipeDirection(direction);
    
    if (direction === 'left') {
      // Next puzzle
      navigateNext();
    } else {
      // Previous puzzle
      navigatePrevious();
    }
    
    // Reset after animation
    setTimeout(() => setSwipeDirection(null), 300);
  }
  
  return { swipeDirection, handleSwipe };
}
```

### 2. Responsive Layouts

```typescript
/**
 * Responsive breakpoints
 */
export const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px',
};

/**
 * Responsive hook
 */
export function useResponsive() {
  const [width, setWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return {
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
  };
}
```

---

## Performance UX Patterns

### 1. Perceived Performance

- Skeleton loaders
- Optimistic updates
- Progressive image loading
- Lazy loading
- Prefetching

### 2. Smooth Animations

- 60fps target
- GPU-accelerated transforms
- Will-change hints
- Reduced motion support
- Frame budget management

### 3. Error Recovery

- Graceful degradation
- Offline support
- Retry mechanisms
- Error boundaries
- Fallback content

---

## Accessibility UX Patterns

### 1. Focus Management

- Visible focus indicators
- Logical tab order
- Skip links
- Focus traps for modals
- Focus restoration

### 2. Screen Reader Optimization

- Semantic HTML
- ARIA labels
- Live regions
- Status announcements
- Landmark regions

### 3. Keyboard Navigation

- Full keyboard support
- Keyboard shortcuts
- Escape to close
- Arrow key navigation
- Enter/Space for actions

---

This UX design pattern library ensures exceptional user experiences across all games while maintaining accessibility and performance.
