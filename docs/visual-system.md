# Visual System Documentation

## Overview

The RansfordsNotes visual system is designed to ensure "infinitely sharp, vivid, clean, and high-resolution" rendering across all pages, devices, and future features. This is a system-level architecture, not page-specific styling.

## Core Principles

1. **Global, not local**: All improvements via shared components, global CSS, and design tokens
2. **Vector-first**: Prefer text, SVG, CSS shapes over raster images
3. **High-DPI correctness**: Everything renders correctly on standard, Retina, and mobile displays
4. **Performance-safe**: No visual improvement degrades load time or Core Web Vitals

## Design Tokens

### Spacing System

**Base Unit**: 4px (0.25rem)

All spacing must be multiples of 4px. Use CSS custom properties:

```css
/* ✅ Correct */
padding: var(--space-4);  /* 16px */
margin: var(--space-6);   /* 24px */
gap: var(--space-2);      /* 8px */

/* ❌ Incorrect */
padding: 0.85rem;  /* Not a multiple of 4px */
margin: 1.25rem;  /* Not a multiple of 4px */
```

**Available Spacing Tokens**:
- `--space-1` through `--space-24` (numeric scale)
- `--space-xs`, `--space-sm`, `--space-md`, `--space-lg`, `--space-xl`, `--space-2xl`, `--space-3xl`, `--space-4xl` (semantic)

### Typography System

**Font Families**:
- `--font-display`: Space_Grotesk (headings)
- `--font-body`: Manrope (body text)
- `--font-mono`: JetBrains_Mono (code)
- `--font-inter`: Inter (utility)

**Font Sizes**:
- `--font-size-xs` (0.75rem) through `--font-size-6xl` (3.75rem)
- Use semantic sizes: `var(--font-size-base)`, `var(--font-size-lg)`, etc.

**Line Heights**:
- `--line-height-tight` (1.2) - Headings
- `--line-height-relaxed` (1.75) - Body text
- `--line-height-normal` (1.5) - Standard

**Letter Spacing**:
- `--letter-spacing-tight` (-0.02em) - Headings
- `--letter-spacing-normal` (-0.01em) - Body text
- `--letter-spacing-wide` (0.01em) - Small text

### Color System

**Semantic Color Tokens**:
- `--color-text-primary`, `--color-text-secondary`, `--color-text-muted`
- `--color-bg-primary`, `--color-bg-secondary`, `--color-surface`
- `--color-border-primary`, `--color-border-secondary`
- `--color-accent-primary`, `--color-accent-secondary`

**WCAG AA Compliance**: All text colors meet minimum contrast ratios:
- Normal text: 4.5:1
- Large text: 3:1

### Shadow System

**Elevation Levels**:
- `--shadow-xs` through `--shadow-2xl`
- Use `elevation-1` through `elevation-5` classes for depth hierarchy

**Border System**:
- `--border-width-sm` (1px), `--border-width-md` (2px), `--border-width-lg` (3px)
- `--radius-sm` through `--radius-full` for border-radius

### Motion System

**Durations**:
- `--duration-fast` (150ms)
- `--duration-normal` (250ms)
- `--duration-slow` (400ms)

**Easing**:
- `--ease-out` (standard)
- `--ease-smooth` (smooth animations)

**GPU-Optimized**: All animations use `transform` and `opacity` only.

## Component Usage

### BaseLayout

Use `BaseLayout` as the foundation for all pages:

```tsx
import { BaseLayout, PageContainer, Section } from "@/components/layout/BaseLayout";

export default function MyPage() {
  return (
    <BaseLayout>
      <PageContainer>
        <Section>
          {/* Your content */}
        </Section>
      </PageContainer>
    </BaseLayout>
  );
}
```

### OptimizedImage

Always use `OptimizedImage` for raster images:

```tsx
import { OptimizedImage } from "@/components/media/OptimizedImage";

<OptimizedImage
  src="/image.jpg"
  alt="Description"
  width={1200}
  height={800}
  quality={90}
  priority={false} // true for LCP images
  sizes="(max-width: 640px) 100vw, 80vw"
/>
```

### Icons

Use `lucide-react` icons (vector SVG, always sharp):

```tsx
import { CheckCircle, AlertTriangle } from "lucide-react";

<CheckCircle size={20} className="text-accent" />
```

## Best Practices

### ✅ Do

- Use design system tokens for all spacing, colors, typography
- Use `OptimizedImage` for all raster images
- Use vector icons (lucide-react) for all icons
- Apply typography scale consistently
- Use spacing tokens (multiples of 4px)
- Ensure GPU-optimized animations
- Respect `prefers-reduced-motion`

### ❌ Don't

- Use arbitrary spacing values (0.85rem, 1.25rem, etc.)
- Hardcode colors (#ff9500, rgb(51, 65, 85), etc.)
- Use arbitrary font sizes
- Animate layout properties (width, height, margin, padding)
- Use `<img>` tags (use `OptimizedImage`)
- Ignore reduced-motion preferences

## Enforcement

### TypeScript Tokens

Import tokens from `@/theme/tokens`:

```tsx
import { tokens } from "@/theme/tokens";

const spacing = tokens.spacing.md; // "var(--space-md)"
const color = tokens.color.text.primary; // "var(--color-text-primary)"
```

### CSS Custom Properties

All design tokens are available as CSS custom properties. Use them in CSS:

```css
.my-component {
  padding: var(--space-4);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  box-shadow: var(--shadow-md);
}
```

## Future Maintenance

1. **New Components**: Must use design system tokens
2. **Deviations**: Require explicit justification
3. **Regular Audits**: Check for hardcoded values
4. **Documentation**: Keep this file updated

## Migration Guide

When updating existing components:

1. Replace fractional spacing with tokens: `0.85rem` → `var(--space-3)`
2. Replace hardcoded colors with tokens: `#ff9500` → `var(--color-accent-amber)`
3. Replace arbitrary font sizes with scale: `0.95rem` → `var(--font-size-sm)`
4. Replace `<img>` with `OptimizedImage`
5. Ensure animations use `transform` and `opacity` only

## Questions?

Refer to:
- `src/styles/design-system.css` - Central import
- `src/styles/typography.css` - Typography system
- `src/styles/spacing.css` - Spacing grid
- `src/styles/colors.css` - Color system
- `src/styles/shadows.css` - Shadow system
- `src/styles/motion.css` - Motion system
- `src/theme/tokens.ts` - TypeScript tokens
