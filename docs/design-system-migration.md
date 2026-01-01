# Design System Migration Guide

## Overview

This guide helps you migrate existing components to use the design system.

## Migration Checklist

### 1. Replace Hardcoded Colors

**Before:**
```tsx
<div style={{ color: "#0f172a", backgroundColor: "#ffffff" }}>
  Content
</div>
```

**After:**
```tsx
<div style={{ 
  color: "var(--color-text-primary)", 
  backgroundColor: "var(--color-surface)" 
}}>
  Content
</div>
```

### 2. Replace Hardcoded Spacing

**Before:**
```tsx
<div style={{ padding: "20px", margin: "15px" }}>
  Content
</div>
```

**After:**
```tsx
<div style={{ 
  padding: "var(--space-5)",  // 20px
  margin: "var(--space-4)"    // 16px (closest to 15px, but must be multiple of 4px)
}}>
  Content
</div>
```

### 3. Replace <img> with OptimizedImage

**Before:**
```tsx
<img src="/image.jpg" alt="Description" />
```

**After:**
```tsx
import { OptimizedImage } from "@/components/media/OptimizedImage";

<OptimizedImage
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  aspectRatio="4/3"
/>
```

### 4. Use Layout Components

**Before:**
```tsx
<div style={{ 
  maxWidth: "1200px", 
  margin: "0 auto", 
  padding: "2rem 1.5rem" 
}}>
  <div style={{ margin: "2rem 0" }}>
    <div style={{ 
      background: "white", 
      padding: "1rem", 
      borderRadius: "12px" 
    }}>
      Content
    </div>
  </div>
</div>
```

**After:**
```tsx
import { 
  PageContainer, 
  Section, 
  Card 
} from "@/components/layout/BaseLayout";

<PageContainer>
  <Section>
    <Card>
      Content
    </Card>
  </Section>
</PageContainer>
```

### 5. Use Typography Tokens

**Before:**
```tsx
<h1 style={{ fontSize: "2.5rem", lineHeight: 1.2 }}>
  Heading
</h1>
<p style={{ fontSize: "1rem", lineHeight: 1.75 }}>
  Body text
</p>
```

**After:**
```tsx
<h1 style={{ 
  fontSize: "var(--font-size-4xl)", 
  lineHeight: "var(--line-height-tight)" 
}}>
  Heading
</h1>
<p style={{ 
  fontSize: "var(--font-size-base)", 
  lineHeight: "var(--line-height-relaxed)" 
}}>
  Body text
</p>
```

### 6. Use Shadow Tokens

**Before:**
```tsx
<div style={{ 
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" 
}}>
  Content
</div>
```

**After:**
```tsx
<Card elevation={3}>
  Content
</Card>
```

Or:
```tsx
<div style={{ boxShadow: "var(--shadow-md)" }}>
  Content
</div>
```

## Step-by-Step Migration

### Step 1: Audit Your Component

1. Find all hardcoded colors (hex, rgb, rgba)
2. Find all hardcoded spacing (px, rem values)
3. Find all `<img>` tags
4. Find all arbitrary font sizes
5. Find all hardcoded shadows

### Step 2: Replace Colors

Use the color token system:
- Text: `var(--color-text-primary)`, `var(--color-text-secondary)`, etc.
- Background: `var(--color-bg-primary)`, `var(--color-surface)`, etc.
- Borders: `var(--color-border-primary)`, etc.

### Step 3: Replace Spacing

Ensure all spacing is a multiple of 4px:
- Use `var(--space-1)` through `var(--space-24)`
- Use semantic tokens: `var(--space-xs)`, `var(--space-sm)`, etc.
- Use component tokens: `var(--space-card-padding)`, etc.

### Step 4: Replace Images

Convert all `<img>` tags to `OptimizedImage`:
- Add width and height
- Add aspectRatio
- Set priority for above-the-fold images
- Add descriptive alt text

### Step 5: Use Layout Components

Replace custom layout divs with design system components:
- `PageContainer` for page wrappers
- `Section` for sections
- `Card` for cards
- `Stack` for vertical layouts
- `Inline` for horizontal layouts
- `Grid` for grids

### Step 6: Use Typography Tokens

Replace arbitrary font sizes with typography tokens:
- Font sizes: `var(--font-size-xs)` through `var(--font-size-6xl)`
- Line heights: `var(--line-height-tight)`, `var(--line-height-relaxed)`, etc.
- Letter spacing: `var(--letter-spacing-tight)`, `var(--letter-spacing-normal)`, etc.

## Common Migration Patterns

### Pattern 1: Card Component

**Before:**
```tsx
<div className="card" style={{
  background: "white",
  padding: "1.25rem",
  borderRadius: "16px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
}}>
  {content}
</div>
```

**After:**
```tsx
<Card elevation={3} padding="var(--space-5)" radius="lg">
  {content}
</Card>
```

### Pattern 2: Form Layout

**Before:**
```tsx
<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
  <label>Field</label>
  <input />
</div>
```

**After:**
```tsx
<Stack gap="var(--space-form-gap)">
  <label>Field</label>
  <input />
</Stack>
```

### Pattern 3: Responsive Grid

**Before:**
```tsx
<div className="grid" style={{
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "1.5rem"
}}>
  {items}
</div>
```

**After:**
```tsx
<Grid 
  columns={{ mobile: 1, tablet: 2, desktop: 3 }}
  gap="var(--space-6)"
>
  {items}
</Grid>
```

## Validation

After migration, validate your changes:

```tsx
import { DesignSystemValidator } from "@/utils/design-system-validators";

// In development, validate styles
if (process.env.NODE_ENV === "development") {
  const result = DesignSystemValidator.validateStyles(styles);
  if (!result.valid) {
    console.warn("Violations:", result.violations);
  }
}
```

## Testing After Migration

1. **Visual Testing**
   - Check text renders sharply
   - Verify spacing is consistent
   - Check colors in light/dark mode
   - Test on different screen sizes

2. **Accessibility Testing**
   - Verify color contrast
   - Test keyboard navigation
   - Check focus states
   - Test with screen reader

3. **Performance Testing**
   - Check image loading
   - Verify CLS (layout shift)
   - Test LCP (largest contentful paint)
   - Check animation performance

## Tools

### ESLint
Run ESLint to catch violations:
```bash
npm run lint
```

### TypeScript
TypeScript will catch invalid token usage:
```tsx
import type { SpacingKey } from "@/types/design-system";

const spacing: SpacingKey = "md"; // Type-safe
```

### Helper Functions
Use helper functions for programmatic access:
```tsx
import { getSpacing, getColor } from "@/utils/design-system-helpers";

const padding = getSpacing(4);
const color = getColor("text", "primary");
```

## Resources

- [Best Practices](./design-system-best-practices.md)
- [Examples](./design-system-examples.md)
- [Quick Reference](./design-system-quick-reference.md)
- [Testing Guide](./design-system-testing.md)
