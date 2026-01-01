# Design System Quick Reference

## Spacing Tokens

```css
/* Numeric scale (multiples of 4px) */
padding: var(--space-1);   /* 4px */
padding: var(--space-2);   /* 8px */
padding: var(--space-4);   /* 16px */
padding: var(--space-6);   /* 24px */
padding: var(--space-8);   /* 32px */

/* Semantic scale */
padding: var(--space-xs);  /* 4px */
padding: var(--space-sm);  /* 8px */
padding: var(--space-md);  /* 16px */
padding: var(--space-lg);  /* 24px */
padding: var(--space-xl);  /* 32px */

/* Component-specific */
padding: var(--space-card-padding);    /* 20px */
gap: var(--space-section-gap);        /* 32px */
gap: var(--space-form-gap);           /* 20px */
```

## Color Tokens

```css
/* Text colors */
color: var(--color-text-primary);     /* Main text */
color: var(--color-text-secondary);   /* Secondary text */
color: var(--color-text-muted);       /* Muted text */
color: var(--color-text-heading);     /* Headings */

/* Background colors */
background: var(--color-bg-primary);      /* Page background */
background: var(--color-bg-secondary);     /* Secondary background */
background: var(--color-surface);          /* Surface/card background */

/* Border colors */
border-color: var(--color-border-primary);   /* Standard borders */
border-color: var(--color-border-focus);     /* Focus states */

/* Accent colors */
color: var(--color-accent-primary);    /* Primary accent */
color: var(--color-accent-secondary);  /* Secondary accent */
```

## Typography Tokens

```css
/* Font sizes */
font-size: var(--font-size-xs);    /* 12px */
font-size: var(--font-size-sm);    /* 14px */
font-size: var(--font-size-base);  /* 16px */
font-size: var(--font-size-lg);    /* 18px */
font-size: var(--font-size-xl);    /* 20px */
font-size: var(--font-size-2xl);    /* 24px */
font-size: var(--font-size-3xl);    /* 30px */
font-size: var(--font-size-4xl);    /* 36px */

/* Line heights */
line-height: var(--line-height-tight);     /* 1.2 - Headings */
line-height: var(--line-height-normal);    /* 1.5 - Standard */
line-height: var(--line-height-relaxed);   /* 1.75 - Body text */

/* Letter spacing */
letter-spacing: var(--letter-spacing-tight);   /* -0.02em - Headings */
letter-spacing: var(--letter-spacing-normal);  /* -0.01em - Body */
```

## Shadow Tokens

```css
/* Shadow levels */
box-shadow: var(--shadow-xs);   /* Subtle */
box-shadow: var(--shadow-sm);   /* Light */
box-shadow: var(--shadow-md);   /* Standard */
box-shadow: var(--shadow-lg);   /* Prominent */
box-shadow: var(--shadow-xl);   /* Strong */

/* Elevation classes */
.elevation-1 { box-shadow: var(--shadow-xs); }
.elevation-2 { box-shadow: var(--shadow-sm); }
.elevation-3 { box-shadow: var(--shadow-md); }
.elevation-4 { box-shadow: var(--shadow-lg); }
.elevation-5 { box-shadow: var(--shadow-xl); }
```

## Border Radius

```css
border-radius: var(--radius-sm);    /* 8px */
border-radius: var(--radius-md);    /* 12px */
border-radius: var(--radius-lg);    /* 16px */
border-radius: var(--radius-xl);    /* 24px */
border-radius: var(--radius-full);  /* Pill shape */
```

## Motion Tokens

```css
/* Durations */
transition-duration: var(--duration-fast);    /* 150ms */
transition-duration: var(--duration-normal);  /* 250ms */
transition-duration: var(--duration-slow);    /* 400ms */

/* Easing */
transition-timing-function: var(--ease-out);     /* Standard */
transition-timing-function: var(--ease-smooth);  /* Smooth */

/* Pre-built transitions */
transition: var(--transition-fast);    /* 150ms ease-out */
transition: var(--transition-normal);  /* 250ms ease-in-out */
transition: var(--transition-slow);    /* 400ms ease-smooth */
```

## Component Usage

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
      <Stack gap="var(--space-6)">
        <Card elevation={3} radius="lg">
          Content
        </Card>
      </Stack>
    </Section>
  </PageContainer>
</BaseLayout>
```

### Image Component

```tsx
import { OptimizedImage } from "@/components/media/OptimizedImage";

<OptimizedImage
  src="/image.jpg"
  alt="Description"
  width={1200}
  height={800}
  aspectRatio="16/9"
  priority={true}
  quality={90}
/>
```

### Helper Functions

```tsx
import { 
  getSpacing, 
  getColor, 
  getShadow 
} from "@/utils/design-system-helpers";

const padding = getSpacing(4);
const color = getColor("text", "primary");
const shadow = getShadow(3);
```

## Common Patterns

### Card with Hover

```tsx
<Card elevation={3} hover={true}>
  Content
</Card>
```

### Responsive Grid

```tsx
<Grid 
  columns={{ mobile: 1, tablet: 2, desktop: 3 }}
  gap="var(--space-6)"
>
  {items.map(item => <Card key={item.id}>{item.content}</Card>)}
</Grid>
```

### Form Layout

```tsx
<Stack gap="var(--space-form-gap)">
  <label>Field</label>
  <input />
</Stack>
```

## TypeScript Types

```tsx
import type { 
  SpacingKey, 
  ShadowElevation, 
  RadiusKey 
} from "@/types/design-system";

const spacing: SpacingKey = "md";
const elevation: ShadowElevation = 3;
const radius: RadiusKey = "lg";
```

## Validation

```tsx
import { DesignSystemValidator } from "@/utils/design-system-helpers";

// Check if value uses design tokens
DesignSystemValidator.isTokenColor("var(--color-text-primary)"); // true
DesignSystemValidator.isTokenSpacing("var(--space-4)"); // true
```

## Resources

- [Complete Documentation](./visual-system.md)
- [Best Practices](./design-system-best-practices.md)
- [Examples](./design-system-examples.md)
- [Gold Standard Enhancements](./gold-standard-enhancements.md)
