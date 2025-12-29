# Tool Development Patterns

**Version**: 1.0  
**Last Updated**: 2024  
**Status**: Active

This guide documents patterns for developing interactive tools for course pages. These patterns ensure consistency, accessibility, and maintainability across all tools.

---

## Overview

Interactive tools enhance learning by providing hands-on practice. This guide covers:

1. **Habit Planners**: Progress tracking tools (e.g., AI Habit Planner, Security Habit Planner)
2. **Interactive Checklists**: Toggle-based checklists with persistence
3. **Scenario Simulators**: Interactive parameter adjustment tools
4. **Canvas/Diagram Tools**: Drawing and annotation tools

---

## Pattern 1: Habit Planners

### Structure

```
src/components/notes/tools/{course}/{level}/
├── {ToolName}Library.ts      # Data definitions
├── use{ToolName}Planner.ts   # State management hook
└── {ToolName}Tool.tsx        # UI component
```

### Example: AI Habit Planner

**Files**:
- `HabitLibrary.ts` - Habit definitions
- `useHabitPlanner.ts` - State management with localStorage
- `AIHabitPlannerTool.tsx` - Interactive component

### Key Features

1. **Library File** (`*Library.ts`):
   - Defines data structures (habits, items, etc.)
   - Provides helper functions (filtering, searching)
   - TypeScript types for type safety

2. **Hook File** (`use*Planner.ts`):
   - Manages state with `useState` and `useEffect`
   - localStorage persistence
   - Calculates derived state (streaks, progress)
   - Provides action functions (select, mark, update, delete)

3. **Component File** (`*Tool.tsx`):
   - Client-side only (`"use client"`)
   - Uses Framer Motion for animations
   - Implements accessibility (keyboard nav, ARIA labels)
   - Supports reduced motion

### Implementation Checklist

- [ ] Create library file with data definitions
- [ ] Create hook file with state management
- [ ] Create component file with UI
- [ ] Add localStorage persistence
- [ ] Add export/share functionality
- [ ] Implement keyboard navigation
- [ ] Add ARIA labels
- [ ] Support reduced motion
- [ ] Test dark mode
- [ ] Test accessibility

### Code Template

**Library** (`*Library.ts`):
```typescript
export interface Item {
  id: string;
  label: string;
  description: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
}

export const ITEMS: Item[] = [
  // ... items
];

export function getItemsByCategory(category: string): Item[] {
  return ITEMS.filter((item) => item.category === category);
}
```

**Hook** (`use*Planner.ts`):
```typescript
export interface PlannerState {
  selectedItem: Item | null;
  entries: Entry[];
  currentStreak: number;
  longestStreak: number;
}

const STORAGE_KEY = "tool-name-planner";

export function usePlanner() {
  const [state, setState] = useState<PlannerState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  // ... action functions

  return {
    state,
    selectItem,
    startItem,
    markCompleted,
    // ... other functions
  };
}
```

**Component** (`*Tool.tsx`):
```typescript
"use client";

import { useState, useMemo } from "react";
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { usePlanner } from "./usePlanner";
import { motionPresets, reducedMotionProps } from "@/lib/motion.js";

export default function Tool() {
  const { state, selectItem, markCompleted } = usePlanner();
  const reduce = useReducedMotion();

  return (
    <LazyMotion features={domAnimation}>
      <div className="space-y-4">
        {/* UI */}
      </div>
    </LazyMotion>
  );
}
```

---

## Pattern 2: Interactive Checklists

### Structure

Similar to Habit Planners but simpler:
- Single state object (checked items)
- Toggle functionality
- Progress calculation
- localStorage persistence

### Key Features

- Toggle items on/off
- Calculate completion percentage
- Persist state
- Export checklist state

### Example Pattern

```typescript
"use client";

import { useState, useEffect } from "react";

const CHECKLIST_ITEMS = [
  { id: "item1", label: "Item 1" },
  { id: "item2", label: "Item 2" },
];

export default function ChecklistTool() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stored = localStorage.getItem("checklist-state");
    if (stored) {
      setChecked(new Set(JSON.parse(stored)));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("checklist-state", JSON.stringify([...checked]));
  }, [checked]);

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const progress = (checked.size / CHECKLIST_ITEMS.length) * 100;

  return (
    <div className="space-y-2">
      {CHECKLIST_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => toggle(item.id)}
          aria-pressed={checked.has(item.id)}
          className="..."
        >
          {item.label}
        </button>
      ))}
      <div>Progress: {progress}%</div>
    </div>
  );
}
```

---

## Pattern 3: Scenario Simulators

### Structure

- Scenario data definitions
- Interactive controls (sliders, toggles, inputs)
- Real-time visual feedback
- Parameter adjustment

### Key Features

- Adjustable parameters
- Real-time updates
- Visual feedback (charts, diagrams)
- Export results

### Example Pattern

```typescript
"use client";

import { useState, useMemo } from "react";

export default function ScenarioSimulator() {
  const [params, setParams] = useState({
    value1: 50,
    value2: 30,
    toggle: false,
  });

  const result = useMemo(() => {
    // Calculate result based on params
    return calculateResult(params);
  }, [params]);

  return (
    <div className="space-y-4">
      <div>
        <label>Value 1</label>
        <input
          type="range"
          min="0"
          max="100"
          value={params.value1}
          onChange={(e) =>
            setParams((prev) => ({ ...prev, value1: Number(e.target.value) }))
          }
        />
      </div>
      {/* Visual feedback */}
      <div>{result}</div>
    </div>
  );
}
```

---

## Pattern 4: Canvas/Diagram Tools

### Structure

- Canvas component
- Drawing tools
- Export functionality
- Undo/redo support

### Key Features

- Drag-and-drop
- Annotations
- Export as image/JSON
- Undo/redo

### Example Pattern

```typescript
"use client";

import { useRef, useState } from "react";

export default function CanvasTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [history, setHistory] = useState<string[]>([]);

  const exportImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataURL = canvas.toDataURL();
    // Download or copy
  };

  return (
    <div>
      <canvas ref={canvasRef} />
      <button onClick={exportImage}>Export</button>
    </div>
  );
}
```

---

## Common Requirements

### Accessibility

**Required for all tools**:

1. **Keyboard Navigation**:
   - All interactive elements keyboard accessible
   - Tab order logical
   - Enter/Space activate buttons

2. **ARIA Labels**:
   - All buttons have `aria-label` or `aria-pressed`
   - Form inputs have labels
   - Status updates use `aria-live`

3. **Focus Indicators**:
   - Visible focus rings: `focus:ring-2 focus:ring-blue-200`
   - Focus order logical

4. **Screen Reader Support**:
   - Semantic HTML
   - Descriptive labels
   - Status announcements

### Performance

**Required for all tools**:

1. **Lazy Loading**:
   ```jsx
   const Tool = dynamic(() => import("./Tool"), { ssr: false });
   ```

2. **Code Splitting**: Tools loaded only when needed

3. **Memoization**: Use `useMemo` for expensive calculations

4. **Reduced Motion**: Support `prefers-reduced-motion`

### State Management

**Patterns**:

1. **localStorage Persistence**:
   - Save state on changes
   - Load state on mount
   - Handle errors gracefully

2. **State Structure**:
   - Keep state flat when possible
   - Use TypeScript interfaces
   - Version state if needed

3. **Derived State**:
   - Calculate in `useMemo`
   - Don't store calculated values

### Error Handling

**Required**:

1. **Error Boundaries**: Wrap tools in error boundaries
2. **Graceful Degradation**: Show fallback if tool fails
3. **User Feedback**: Clear error messages

### Testing

**Checklist**:

- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] Dark mode works
- [ ] Responsive on mobile
- [ ] localStorage persists correctly
- [ ] Export/share works
- [ ] Reduced motion supported
- [ ] No console errors

---

## File Organization

### Directory Structure

```
src/components/notes/tools/
├── {course}/
│   ├── {level}/
│   │   ├── {ToolName}Library.ts
│   │   ├── use{ToolName}Planner.ts
│   │   └── {ToolName}Tool.tsx
│   └── overview/
│       └── {ToolName}Tool.tsx
```

### Naming Conventions

- **Library files**: `*Library.ts`
- **Hook files**: `use*Planner.ts` or `use*Tool.ts`
- **Component files**: `*Tool.tsx`
- **Types**: PascalCase interfaces

---

## Integration

### In MDX Files

```mdx
<ToolCard 
  title="Tool Name" 
  description="Tool description"
  courseId="ai"
  levelId="overview"
  sectionId="tool-section"
>
  <ToolNameTool />
</ToolCard>
```

### In Page Components

```jsx
import dynamic from "next/dynamic";

const ToolNameTool = dynamic(
  () => import("@/components/notes/tools/ai/overview/ToolNameTool"),
  { ssr: false }
);

const mdxComponents = useMemo(
  () => ({
    // ... other components
    ToolNameTool,
  }),
  []
);
```

---

## Examples

### Completed Tools

1. **AI Habit Planner** (`src/components/notes/tools/ai/overview/`)
   - Full implementation
   - Habit selection, tracking, streaks
   - Export/share functionality

2. **Security Habit Planner** (`src/components/notes/tools/cybersecurity/overview/`)
   - Similar to AI Habit Planner
   - Includes guardrail feature
   - Course-specific habits

### Reference Implementation

See `AIHabitPlannerTool.tsx` for a complete reference implementation following all patterns.

---

## Migration Guide

### Converting Static Tools

1. **Identify Tool Type**: Habit planner, checklist, simulator, canvas
2. **Create Library File**: Define data structures
3. **Create Hook File**: State management
4. **Create Component File**: UI implementation
5. **Add Accessibility**: Keyboard nav, ARIA labels
6. **Add Persistence**: localStorage if needed
7. **Test**: Accessibility, dark mode, responsive

---

## Resources

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Hooks Documentation](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Style Guide](../style/style-guide.md)
- [Accessibility Guide](../cpd/accessibility.md)

---

**Last Updated**: 2024  
**Maintained By**: Development Team

