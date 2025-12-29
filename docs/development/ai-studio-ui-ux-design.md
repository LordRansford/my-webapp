# AI Studio UI/UX Design - Comprehensive Design System

## Overview

This document defines the complete UI/UX design system for the AI Studio, focusing on accessibility, intuitiveness, and visual excellence. Every component has been designed with user experience as the top priority.

---

## Table of Contents

1. [Design Principles](#design-principles)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Components](#components)
6. [Page Layouts](#page-layouts)
7. [User Flows](#user-flows)
8. [Accessibility](#accessibility)
9. [Responsive Design](#responsive-design)
10. [Animations & Transitions](#animations--transitions)
11. [Design Tokens](#design-tokens)

---

## Design Principles

### 1. Clarity First
- **Clear hierarchy**: Visual hierarchy guides users naturally
- **Progressive disclosure**: Show complexity gradually
- **Contextual help**: Help appears when needed, not intrusive

### 2. Accessibility for All
- **WCAG AA compliance**: Minimum standard, aiming for AAA
- **Keyboard navigation**: Full functionality without mouse
- **Screen reader support**: Comprehensive ARIA labels
- **Color contrast**: 4.5:1 minimum, 7:1 for important text

### 3. Delightful Interactions
- **Micro-interactions**: Subtle feedback for every action
- **Smooth animations**: 60fps, respect reduced motion
- **Loading states**: Skeleton screens, progress indicators
- **Error handling**: Helpful, actionable error messages

### 4. Consistency
- **Design system**: Unified component library
- **Patterns**: Reusable interaction patterns
- **Terminology**: Consistent language throughout
- **Visual language**: Cohesive visual identity

---

## Color System

### Primary Palette

```typescript
const colors = {
  // Primary Brand Colors
  primary: {
    50: '#f0f9ff',   // Lightest
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',  // Base
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',  // Darkest
  },
  
  // Secondary (Purple for AI/ML)
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',  // Base
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },
  
  // Success (Green)
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',  // Base
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  // Warning (Amber)
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',  // Base
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  // Error (Red)
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',  // Base
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  // Neutral Grays
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',  // Base
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
};
```

### Semantic Colors

```typescript
const semanticColors = {
  // Text
  text: {
    primary: 'gray.900',
    secondary: 'gray.600',
    tertiary: 'gray.400',
    inverse: 'white',
    disabled: 'gray.400',
  },
  
  // Backgrounds
  background: {
    primary: 'white',
    secondary: 'gray.50',
    tertiary: 'gray.100',
    inverse: 'gray.900',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Borders
  border: {
    default: 'gray.200',
    hover: 'gray.300',
    focus: 'primary.500',
    error: 'error.500',
  },
  
  // Interactive States
  interactive: {
    default: 'primary.500',
    hover: 'primary.600',
    active: 'primary.700',
    disabled: 'gray.300',
    focus: 'primary.500',
  },
};
```

### Dark Mode

```typescript
const darkMode = {
  text: {
    primary: 'gray.50',
    secondary: 'gray.400',
    tertiary: 'gray.500',
  },
  background: {
    primary: 'gray.900',
    secondary: 'gray.800',
    tertiary: 'gray.700',
  },
  border: {
    default: 'gray.700',
    hover: 'gray.600',
  },
};
```

---

## Typography

### Font Families

```typescript
const fonts = {
  sans: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'sans-serif',
  ],
  mono: [
    'JetBrains Mono',
    'Fira Code',
    'Consolas',
    'monospace',
  ],
};
```

### Type Scale

```typescript
const typography = {
  // Display (Hero sections)
  display: {
    '2xl': {
      fontSize: '4.5rem',      // 72px
      lineHeight: 1.1,
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    xl: {
      fontSize: '3.75rem',      // 60px
      lineHeight: 1.1,
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    lg: {
      fontSize: '3rem',        // 48px
      lineHeight: 1.2,
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
  },
  
  // Headings
  heading: {
    '1': {
      fontSize: '2.25rem',      // 36px
      lineHeight: 1.3,
      fontWeight: 700,
    },
    '2': {
      fontSize: '1.875rem',     // 30px
      lineHeight: 1.3,
      fontWeight: 600,
    },
    '3': {
      fontSize: '1.5rem',       // 24px
      lineHeight: 1.4,
      fontWeight: 600,
    },
    '4': {
      fontSize: '1.25rem',      // 20px
      lineHeight: 1.4,
      fontWeight: 600,
    },
  },
  
  // Body Text
  body: {
    lg: {
      fontSize: '1.125rem',     // 18px
      lineHeight: 1.6,
      fontWeight: 400,
    },
    md: {
      fontSize: '1rem',         // 16px
      lineHeight: 1.6,
      fontWeight: 400,
    },
    sm: {
      fontSize: '0.875rem',     // 14px
      lineHeight: 1.5,
      fontWeight: 400,
    },
    xs: {
      fontSize: '0.75rem',      // 12px
      lineHeight: 1.5,
      fontWeight: 400,
    },
  },
  
  // Labels
  label: {
    lg: {
      fontSize: '0.875rem',
      lineHeight: 1.4,
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
    md: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
    sm: {
      fontSize: '0.625rem',
      lineHeight: 1.4,
      fontWeight: 600,
      letterSpacing: '0.02em',
      textTransform: 'uppercase',
    },
  },
};
```

---

## Spacing & Layout

### Spacing Scale

```typescript
const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
};
```

### Layout System

```typescript
const layout = {
  // Container Widths
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Grid System
  grid: {
    columns: 12,
    gap: {
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
    },
  },
  
  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};
```

---

## Components

### Button

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

// Visual Design
const buttonStyles = {
  primary: {
    background: 'primary.500',
    color: 'white',
    hover: 'primary.600',
    active: 'primary.700',
    focus: 'ring-2 ring-primary-500 ring-offset-2',
  },
  sizes: {
    sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
    md: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
    lg: { padding: '1rem 2rem', fontSize: '1.125rem' },
  },
};
```

### Card

```typescript
interface CardProps {
  variant: 'default' | 'elevated' | 'outlined' | 'interactive';
  padding: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

// Visual Design
const cardStyles = {
  default: {
    background: 'white',
    border: '1px solid gray.200',
    borderRadius: '0.75rem',
    shadow: 'sm',
  },
  elevated: {
    background: 'white',
    shadow: 'lg',
    borderRadius: '0.75rem',
  },
  interactive: {
    cursor: 'pointer',
    transition: 'all 0.2s',
    hover: {
      shadow: 'md',
      transform: 'translateY(-2px)',
    },
  },
};
```

### Input

```typescript
interface InputProps {
  type: 'text' | 'email' | 'password' | 'number' | 'file';
  size: 'sm' | 'md' | 'lg';
  error?: boolean;
  helperText?: string;
  label?: string;
  placeholder?: string;
  icon?: ReactNode;
}

// Visual Design
const inputStyles = {
  default: {
    border: '1px solid gray.300',
    borderRadius: '0.5rem',
    padding: '0.75rem 1rem',
    focus: {
      border: '2px solid primary.500',
      outline: 'none',
      ring: '2px ring-primary-500 ring-offset-2',
    },
    error: {
      border: '2px solid error.500',
      focus: {
        ring: '2px ring-error-500 ring-offset-2',
      },
    },
  },
};
```

### DataTable

```typescript
interface DataTableProps {
  data: any[];
  columns: Column[];
  pagination?: boolean;
  sorting?: boolean;
  filtering?: boolean;
  selection?: boolean;
}

// Visual Design
const tableStyles = {
  header: {
    background: 'gray.50',
    borderBottom: '1px solid gray.200',
    fontWeight: 600,
    padding: '0.75rem 1rem',
  },
  row: {
    borderBottom: '1px solid gray.100',
    hover: {
      background: 'gray.50',
    },
    selected: {
      background: 'primary.50',
    },
  },
  cell: {
    padding: '0.75rem 1rem',
  },
};
```

### Model Builder Canvas

```typescript
interface ModelBuilderProps {
  model: Model;
  onUpdate: (model: Model) => void;
  readOnly?: boolean;
}

// Visual Design
const canvasStyles = {
  background: 'gray.50',
  grid: {
    pattern: 'dots',
    spacing: 20,
    color: 'gray.300',
  },
  node: {
    background: 'white',
    border: '2px solid primary.500',
    borderRadius: '0.5rem',
    padding: '1rem',
    shadow: 'md',
    minWidth: '200px',
    hover: {
      shadow: 'lg',
      transform: 'scale(1.02)',
    },
  },
  connection: {
    stroke: 'primary.500',
    strokeWidth: 2,
    animated: true,
  },
};
```

### Training Monitor

```typescript
interface TrainingMonitorProps {
  job: TrainingJob;
  metrics: Metrics;
  onCancel?: () => void;
}

// Visual Design
const monitorStyles = {
  container: {
    background: 'white',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    shadow: 'md',
  },
  progressBar: {
    height: '0.5rem',
    background: 'gray.200',
    borderRadius: '0.25rem',
    fill: {
      background: 'linear-gradient(90deg, primary.500, primary.600)',
      transition: 'width 0.3s ease',
    },
  },
  metrics: {
    grid: 'grid-cols-4 gap-4',
    card: {
      background: 'gray.50',
      padding: '1rem',
      borderRadius: '0.5rem',
    },
  },
  chart: {
    height: '300px',
    colors: ['primary.500', 'secondary.500'],
  },
};
```

---

## Page Layouts

### Dashboard Layout

```typescript
const dashboardLayout = {
  header: {
    height: '4rem',
    background: 'white',
    borderBottom: '1px solid gray.200',
    sticky: true,
    zIndex: 100,
  },
  sidebar: {
    width: '16rem',
    background: 'white',
    borderRight: '1px solid gray.200',
    collapsed: {
      width: '4rem',
    },
  },
  main: {
    padding: '2rem',
    maxWidth: '1536px',
    margin: '0 auto',
  },
  footer: {
    height: '4rem',
    background: 'gray.50',
    borderTop: '1px solid gray.200',
  },
};
```

### Model Training Page

```typescript
const trainingPageLayout = {
  layout: 'three-column',
  left: {
    width: '20rem',
    sections: ['data-selection', 'model-config', 'hyperparameters'],
  },
  center: {
    width: 'flex-1',
    sections: ['training-monitor', 'metrics-charts', 'logs'],
  },
  right: {
    width: '20rem',
    sections: ['evaluation-results', 'export-options'],
  },
};
```

### Agent Orchestrator Page

```typescript
const agentPageLayout = {
  layout: 'split-view',
  top: {
    height: '4rem',
    sections: ['toolbar', 'agent-selector'],
  },
  bottom: {
    layout: 'two-column',
    left: {
      width: '60%',
      sections: ['workflow-canvas'],
    },
    right: {
      width: '40%',
      sections: ['agent-config', 'execution-log'],
    },
  },
};
```

---

## User Flows

### Flow 1: First-Time User Onboarding

```
1. Welcome Screen
   └─> "Get Started" button
   
2. Account Creation
   └─> Email/Password form
   └─> Terms acceptance
   
3. Onboarding Tour
   └─> Interactive tutorial
   └─> Feature highlights
   
4. First Project
   └─> Guided dataset upload
   └─> Simple model training
   └─> Success celebration
```

### Flow 2: Model Training

```
1. Dataset Selection
   └─> Browse/Upload dataset
   └─> Preview & validate
   
2. Model Configuration
   └─> Select architecture
   └─> Configure layers
   └─> Set hyperparameters
   
3. Training
   └─> Start training
   └─> Monitor progress
   └─> View metrics
   
4. Evaluation
   └─> Review results
   └─> Compare metrics
   └─> Export model
```

### Flow 3: Agent Creation

```
1. Agent Template Selection
   └─> Browse templates
   └─> Select type
   
2. Configuration
   └─> Set model
   └─> Add tools
   └─> Configure memory
   
3. Workflow Design
   └─> Drag-drop canvas
   └─> Connect agents
   └─> Set conditions
   
4. Testing
   └─> Run test execution
   └─> Review output
   └─> Iterate
```

---

## Accessibility

### Keyboard Navigation

```typescript
const keyboardShortcuts = {
  // Global
  '?': 'Show keyboard shortcuts',
  'Esc': 'Close modal/dialog',
  'Tab': 'Navigate forward',
  'Shift+Tab': 'Navigate backward',
  
  // Navigation
  'g d': 'Go to dashboard',
  'g m': 'Go to models',
  'g a': 'Go to agents',
  'g t': 'Go to training',
  
  // Actions
  'Ctrl/Cmd + k': 'Command palette',
  'Ctrl/Cmd + s': 'Save',
  'Ctrl/Cmd + Enter': 'Submit form',
};
```

### ARIA Labels

```typescript
// Example: Training Button
<button
  aria-label="Start training model"
  aria-describedby="training-help-text"
  aria-busy={isTraining}
>
  Start Training
</button>

// Example: Progress Bar
<div
  role="progressbar"
  aria-valuenow={progress}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label="Training progress"
>
  {progress}%
</div>
```

### Focus Management

```typescript
const focusStyles = {
  default: {
    outline: '2px solid primary.500',
    outlineOffset: '2px',
    borderRadius: '0.25rem',
  },
  visible: {
    // Always show focus for keyboard users
    '&:focus-visible': {
      outline: '2px solid primary.500',
      outlineOffset: '2px',
    },
  },
};
```

---

## Responsive Design

### Breakpoint Strategy

```typescript
const responsive = {
  mobile: {
    max: '640px',
    layout: 'single-column',
    navigation: 'bottom-bar',
    components: 'stacked',
  },
  tablet: {
    min: '641px',
    max: '1024px',
    layout: 'two-column',
    navigation: 'sidebar-collapsible',
  },
  desktop: {
    min: '1025px',
    layout: 'multi-column',
    navigation: 'sidebar-permanent',
  },
};
```

### Mobile Optimizations

```typescript
const mobileOptimizations = {
  touch: {
    targetSize: '44px minimum',
    spacing: '8px between targets',
  },
  gestures: {
    swipe: 'Navigate between tabs',
    pullToRefresh: 'Refresh data',
  },
  performance: {
    lazyLoad: 'Images and heavy components',
    codeSplitting: 'Route-based',
  },
};
```

---

## Animations & Transitions

### Animation Principles

```typescript
const animations = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  respectMotion: {
    // Respect prefers-reduced-motion
    '@media (prefers-reduced-motion: reduce)': {
      animation: 'none',
      transition: 'none',
    },
  },
};
```

### Common Animations

```typescript
const commonAnimations = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration: '300ms',
  },
  slideUp: {
    from: { transform: 'translateY(1rem)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
    duration: '300ms',
  },
  scale: {
    from: { transform: 'scale(0.95)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
    duration: '200ms',
  },
};
```

---

## Design Tokens

### Complete Token System

```typescript
export const designTokens = {
  colors: { ...colors, ...semanticColors },
  typography,
  spacing,
  layout,
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
};
```

---

## Component Library Structure

```
components/
├── ui/                    # Base UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   └── ...
├── forms/                 # Form components
│   ├── FormField.tsx
│   ├── Select.tsx
│   ├── Checkbox.tsx
│   └── ...
├── data/                  # Data display components
│   ├── DataTable.tsx
│   ├── Chart.tsx
│   ├── MetricCard.tsx
│   └── ...
├── ml/                    # ML-specific components
│   ├── ModelBuilder.tsx
│   ├── TrainingMonitor.tsx
│   ├── MetricsChart.tsx
│   └── ...
├── agents/                # Agent components
│   ├── AgentCanvas.tsx
│   ├── AgentNode.tsx
│   ├── WorkflowBuilder.tsx
│   └── ...
└── layout/                # Layout components
    ├── Header.tsx
    ├── Sidebar.tsx
    ├── DashboardLayout.tsx
    └── ...
```

---

*This design system ensures consistency, accessibility, and delightful user experiences across the entire AI Studio platform.*

