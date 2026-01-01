# Design System Best Practices

## Overview

This document provides best practices and guidelines for using the design system to ensure consistent, high-quality visual output across the application.

## Core Principles

### 1. Always Use Design Tokens

**✅ DO:**
```tsx
<div style={{ padding: "var(--space-4)", color: "var(--color-text-primary)" }}>
  Content
</div>
```

**❌ DON'T:**
```tsx
<div style={{ padding: "15px", color: "#0f172a" }}>
  Content
</div>
```

### 2. Use TypeScript Helpers

**✅ DO:**
```tsx
import { getSpacing, getColor } from "@/utils/design-system-helpers";

<div style={{ 
  padding: getSpacing(4),
  color: getColor("text", "primary")
}}>
```

### 3. Use Design System Components

**✅ DO:**
```tsx
import { Card, Stack, Section } from "@/components/layout/BaseLayout";

<Section>
  <Stack gap="var(--space-6)">
    <Card elevation={3}>
      Content
    </Card>
  </Stack>
</Section>
```

**❌ DON'T:**
```tsx
<div style={{ margin: "2rem 0", padding: "1rem" }}>
  <div style={{ background: "white", padding: "1rem" }}>
    Content
  </div>
</div>
```

## Image Best Practices

### Always Use OptimizedImage

**✅ DO:**
```tsx
import { OptimizedImage } from "@/components/media/OptimizedImage";

<OptimizedImage
  src="/hero.jpg"
  alt="Descriptive alt text"
  width={1200}
  height={800}
  aspectRatio="16/9"
  priority={true} // For above-the-fold images
  quality={90}
/>
```

**Key Benefits:**
- Automatic high-DPI handling
- Responsive image generation
- Layout shift prevention
- Error handling and fallbacks
- Loading states

### Image Requirements

1. **Always provide aspect ratio** to prevent CLS
2. **Use priority={true}** for LCP images
3. **Provide descriptive alt text** for accessibility
4. **Use appropriate quality** (90 for photos, 85 for graphics)

## Typography Best Practices

### Use Typography Scale

**✅ DO:**
```tsx
<h1 style={{ fontSize: "var(--font-size-4xl)" }}>Heading</h1>
<p style={{ fontSize: "var(--font-size-base)", lineHeight: "var(--line-height-relaxed)" }}>
  Body text
</p>
```

### Font Families

- **Headings**: `var(--font-display)` (Space Grotesk)
- **Body**: `var(--font-body)` (Manrope)
- **Code**: `var(--font-mono)` (JetBrains Mono)

## Spacing Best Practices

### Use 4px Grid

All spacing must be multiples of 4px (0.25rem):

**✅ Valid:**
- `var(--space-1)` = 4px
- `var(--space-4)` = 16px
- `var(--space-6)` = 24px

**❌ Invalid:**
- `15px` (not a multiple of 4px)
- `0.85rem` (not a multiple of 0.25rem)

### Semantic Spacing

Use semantic tokens for common patterns:

```tsx
// Card padding
padding: "var(--space-card-padding)"

// Section gaps
gap: "var(--space-section-gap)"

// Form field spacing
gap: "var(--space-form-gap)"
```

## Color Best Practices

### Use Semantic Colors

**✅ DO:**
```tsx
<div style={{ 
  color: "var(--color-text-primary)",
  backgroundColor: "var(--color-bg-primary)",
  borderColor: "var(--color-border-primary)"
}}>
```

**❌ DON'T:**
```tsx
<div style={{ 
  color: "#0f172a",
  backgroundColor: "#ffffff",
  borderColor: "#dfe3ec"
}}>
```

### Color Categories

- **Text**: `--color-text-primary`, `--color-text-secondary`, `--color-text-muted`
- **Background**: `--color-bg-primary`, `--color-bg-secondary`, `--color-surface`
- **Borders**: `--color-border-primary`, `--color-border-secondary`
- **Accents**: `--color-accent-primary`, `--color-accent-secondary`

## Shadow and Depth

### Use Elevation System

```tsx
<Card elevation={3}>  // Medium elevation
<Card elevation={5}>  // High elevation (modals)
```

### Shadow Tokens

- `var(--shadow-xs)` - Subtle depth
- `var(--shadow-sm)` - Light elevation
- `var(--shadow-md)` - Standard cards
- `var(--shadow-lg)` - Prominent elements
- `var(--shadow-xl)` - Modals and overlays

## Motion Best Practices

### GPU-Optimized Animations

**✅ DO:**
```tsx
<div style={{
  transform: "translateY(0)",
  transition: "var(--transition-transform)"
}}>
```

**❌ DON'T:**
```tsx
<div style={{
  width: "100px",
  transition: "width 250ms"  // Avoid animating layout properties
}}>
```

### Respect Reduced Motion

All animations automatically respect `prefers-reduced-motion`. Use design system motion tokens:

- `var(--duration-fast)` = 150ms
- `var(--duration-normal)` = 250ms
- `var(--duration-slow)` = 400ms

## Component Patterns

### Layout Components

```tsx
import { 
  BaseLayout, 
  PageContainer, 
  Section, 
  Card, 
  Stack, 
  Inline, 
  Grid 
} from "@/components/layout/BaseLayout";

<BaseLayout>
  <PageContainer>
    <Section>
      <Grid columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap="var(--space-6)">
        <Card elevation={3}>
          <Stack gap="var(--space-4)">
            <h2>Title</h2>
            <p>Content</p>
          </Stack>
        </Card>
      </Grid>
    </Section>
  </PageContainer>
</BaseLayout>
```

## Performance Considerations

### Image Optimization

1. **Always use OptimizedImage** for raster images
2. **Set priority={true}** for LCP images
3. **Provide aspectRatio** to prevent layout shift
4. **Use appropriate quality** (90 for photos)

### CSS Performance

1. **Use CSS custom properties** (already optimized)
2. **Avoid inline styles** when possible (use classes)
3. **Leverage GPU-accelerated properties** (transform, opacity)

## Accessibility

### Color Contrast

All design system colors meet WCAG AA standards:
- Normal text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio

### Focus States

All interactive elements have visible focus states using:
```css
:focus-visible {
  outline: var(--border-width-md) solid var(--color-border-focus);
  outline-offset: var(--space-1);
}
```

### Reduced Motion

All animations respect `prefers-reduced-motion` automatically.

## TypeScript Support

### Type-Safe Tokens

```tsx
import type { SpacingKey, ShadowElevation } from "@/types/design-system";
import { tokens } from "@/theme/tokens";

const spacing: SpacingKey = "md";  // Type-safe
const elevation: ShadowElevation = 3;  // Type-safe
```

### Helper Functions

```tsx
import { 
  getSpacing, 
  getColor, 
  getShadow, 
  responsiveSpacing 
} from "@/utils/design-system-helpers";

const padding = getSpacing(4);
const textColor = getColor("text", "primary");
const shadow = getShadow(3);
const responsive = responsiveSpacing("sm", "lg");
```

## Migration Guide

### Converting Existing Components

1. **Replace hardcoded colors** with `var(--color-*)`
2. **Replace hardcoded spacing** with `var(--space-*)`
3. **Replace `<img>` tags** with `<OptimizedImage>`
4. **Use layout components** instead of custom divs
5. **Use typography tokens** instead of arbitrary font sizes

### Example Migration

**Before:**
```tsx
<div style={{ padding: "20px", color: "#0f172a" }}>
  <img src="/image.jpg" alt="Image" />
</div>
```

**After:**
```tsx
<Card padding="var(--space-5)">
  <OptimizedImage
    src="/image.jpg"
    alt="Image"
    width={800}
    height={600}
    aspectRatio="4/3"
  />
</Card>
```

## Common Pitfalls

### ❌ Don't Mix Units

```tsx
// Bad
padding: "var(--space-4) 15px"  // Mixed rem and px
```

### ❌ Don't Use Arbitrary Values

```tsx
// Bad
margin: "13px"  // Not a multiple of 4px
```

### ❌ Don't Skip Aspect Ratios

```tsx
// Bad
<OptimizedImage src="/img.jpg" width={800} height={600} />
// Missing aspectRatio prop
```

### ✅ Always Provide Alt Text

```tsx
// Bad
<OptimizedImage src="/img.jpg" alt="" />

// Good
<OptimizedImage src="/img.jpg" alt="Descriptive text about the image" />
```

## Resources

- [Design System Documentation](./visual-system.md)
- [TypeScript Types](../src/types/design-system.ts)
- [Helper Utilities](../src/utils/design-system-helpers.ts)
- [Component Library](../src/components/layout/BaseLayout.tsx)
