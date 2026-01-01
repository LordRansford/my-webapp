# Design System API Reference

## Component Exports

### Layout Components

```tsx
// From BaseLayout
import {
  BaseLayout,
  PageContainer,
  Section,
  Card,
  Stack,
  Inline,
  Grid,
} from "@/components/layout/BaseLayout";

// Or from central export
import {
  BaseLayout,
  PageContainer,
  Section,
  Card,
  Stack,
  Inline,
  Grid,
  ResponsiveGrid,
} from "@/components/layout";
```

### Media Components

```tsx
// Individual imports
import { OptimizedImage } from "@/components/media/OptimizedImage";
import { ImageWrapper } from "@/components/media/ImageWrapper";
import { ImagePlaceholder } from "@/components/media/ImagePlaceholder";

// Or from central export
import {
  OptimizedImage,
  OptimizedImageFill,
  ImageWrapper,
  ImagePlaceholder,
} from "@/components/media";
```

## Utility Exports

### Helper Functions

```tsx
import {
  getSpacing,
  getColor,
  getTypography,
  getShadow,
  getTransition,
  responsiveSpacing,
  spacingScale,
  isValidSpacing,
  getContainerSize,
  cssVar,
  DesignSystemValidator,
} from "@/utils/design-system-helpers";

// Or from central export
import {
  getSpacing,
  getColor,
  DesignSystemValidator,
} from "@/utils";
```

### Validators

```tsx
import {
  validateSpacing,
  validateColor,
  validateElevation,
  validateRadius,
  validateSpacingKey,
  DesignSystemValidator,
  useDesignSystemValidation,
} from "@/utils/design-system-validators";

// Or from central export
import {
  DesignSystemValidator,
  useDesignSystemValidation,
} from "@/utils";
```

## Type Exports

```tsx
import type {
  SpacingKey,
  ColorCategory,
  TypographyProperty,
  ShadowElevation,
  RadiusKey,
  MotionDuration,
  MotionEasing,
  DesignSystemProps,
  ResponsiveDesignValue,
  DesignSystemTheme,
  TokenReference,
} from "@/types/design-system";
```

## Token Exports

```tsx
import { tokens } from "@/theme/tokens";

// Access tokens
const spacing = tokens.spacing.md;
const color = tokens.color.text.primary;
const shadow = tokens.shadow.md;
```

## Component APIs

### BaseLayout

```tsx
interface BaseLayoutProps {
  children: ReactNode;
  className?: string;
}

<BaseLayout className="custom-class">
  {children}
</BaseLayout>
```

### PageContainer

```tsx
interface PageContainerProps {
  children: ReactNode;
  maxWidth?: string;
  className?: string;
}

<PageContainer maxWidth="1400px">
  {children}
</PageContainer>
```

### Section

```tsx
interface SectionProps {
  children: ReactNode;
  className?: string;
  gap?: string;
}

<Section gap="var(--space-6)">
  {children}
</Section>
```

### Card

```tsx
interface CardProps {
  children: ReactNode;
  className?: string;
  elevation?: ShadowElevation; // 1-5
  radius?: RadiusKey;
  padding?: string;
  hover?: boolean;
}

<Card elevation={3} radius="lg" padding="var(--space-6)" hover={true}>
  {children}
</Card>
```

### Stack

```tsx
interface StackProps {
  children: ReactNode;
  gap?: string;
  className?: string;
  align?: "start" | "center" | "end" | "stretch";
}

<Stack gap="var(--space-4)" align="center">
  {children}
</Stack>
```

### Inline

```tsx
interface InlineProps {
  children: ReactNode;
  gap?: string;
  className?: string;
  align?: "start" | "center" | "end" | "baseline";
  wrap?: boolean;
}

<Inline gap="var(--space-4)" align="center" wrap={true}>
  {children}
</Inline>
```

### Grid

```tsx
interface GridProps {
  children: ReactNode;
  columns?: number | { mobile?: number; tablet?: number; desktop?: number };
  gap?: string;
  className?: string;
  minColumnWidth?: string;
}

<Grid 
  columns={{ mobile: 1, tablet: 2, desktop: 3 }}
  gap="var(--space-6)"
  minColumnWidth="280px"
>
  {children}
</Grid>
```

### OptimizedImage

```tsx
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number; // 1-100, default: 90
  priority?: boolean;
  sizes?: string;
  aspectRatio?: string;
  blurDataURL?: string;
  fallbackSrc?: string;
  showLoadingSkeleton?: boolean;
  onError?: () => void;
  onLoad?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

<OptimizedImage
  src="/image.jpg"
  alt="Description"
  width={1200}
  height={800}
  aspectRatio="16/9"
  priority={true}
  quality={90}
  blurDataURL="/blur.jpg"
  fallbackSrc="/fallback.jpg"
  showLoadingSkeleton={true}
/>
```

### ImageWrapper

```tsx
interface ImageWrapperProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  caption?: ReactNode;
  blurDataURL?: string;
}

<ImageWrapper
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  aspectRatio="4/3"
  caption="Image caption"
/>
```

### ImagePlaceholder

```tsx
interface ImagePlaceholderProps {
  aspectRatio?: string;
  width?: number;
  height?: number;
  blurDataURL?: string;
  shimmer?: boolean;
  className?: string;
  children?: ReactNode;
}

<ImagePlaceholder
  aspectRatio="16/9"
  shimmer={true}
  blurDataURL="/blur.jpg"
>
  Loading...
</ImagePlaceholder>
```

## Helper Function APIs

### getSpacing

```tsx
getSpacing(key: SpacingKey): string

// Example
const padding = getSpacing(4); // "0.25rem"
const gap = getSpacing("md"); // "var(--space-md)"
```

### getColor

```tsx
getColor(category: ColorCategory, key: string): string

// Example
const textColor = getColor("text", "primary"); // "var(--color-text-primary)"
const bgColor = getColor("bg", "secondary"); // "var(--color-bg-secondary)"
```

### getShadow

```tsx
getShadow(elevation: ShadowElevation): string

// Example
const shadow = getShadow(3); // "var(--shadow-md)"
```

### getTransition

```tsx
getTransition(type: "fast" | "normal" | "slow"): string

// Example
const transition = getTransition("fast"); // "var(--transition-fast)"
```

### responsiveSpacing

```tsx
responsiveSpacing(mobile: SpacingKey, desktop: SpacingKey): string

// Example
const spacing = responsiveSpacing("sm", "lg");
// Returns: "clamp(var(--space-sm), 2vw, var(--space-lg))"
```

### DesignSystemValidator

```tsx
// Validate spacing
DesignSystemValidator.spacing("var(--space-4)"); // true
DesignSystemValidator.spacing("15px"); // false

// Validate color
DesignSystemValidator.color("var(--color-text-primary)"); // true
DesignSystemValidator.color("#0f172a"); // false (warns in dev)

// Validate styles object
const result = DesignSystemValidator.validateStyles({
  padding: "var(--space-4)",
  color: "#0f172a", // Violation!
});

if (!result.valid) {
  console.warn(result.violations);
}
```

### useDesignSystemValidation

```tsx
const validate = useDesignSystemValidation("MyComponent");

// In component
const styles = { padding: "var(--space-4)" };
validate(styles); // Warns in development if violations found
```

## CSS Custom Properties

All design tokens are available as CSS custom properties:

```css
/* Spacing */
--space-1 through --space-64
--space-xs, --space-sm, --space-md, etc.

/* Colors */
--color-text-primary
--color-bg-primary
--color-surface
--color-border-primary
--color-accent-primary

/* Typography */
--font-size-xs through --font-size-6xl
--line-height-tight, --line-height-relaxed, etc.
--letter-spacing-tight, --letter-spacing-normal, etc.

/* Shadows */
--shadow-xs through --shadow-2xl

/* Motion */
--duration-fast, --duration-normal, --duration-slow
--ease-out, --ease-smooth, etc.
--transition-fast, --transition-normal, --transition-slow

/* Borders */
--border-width-sm, --border-width-md, --border-width-lg
--radius-sm through --radius-full
```

## Import Patterns

### Recommended: Central Exports

```tsx
// Layout components
import { Card, Stack, Grid } from "@/components/layout";

// Media components
import { OptimizedImage, ImageWrapper } from "@/components/media";

// Utilities
import { getSpacing, getColor, DesignSystemValidator } from "@/utils";

// Types
import type { SpacingKey, ShadowElevation } from "@/types/design-system";
```

### Alternative: Direct Imports

```tsx
// Direct component imports
import { Card } from "@/components/layout/BaseLayout";
import { OptimizedImage } from "@/components/media/OptimizedImage";

// Direct utility imports
import { getSpacing } from "@/utils/design-system-helpers";
import { DesignSystemValidator } from "@/utils/design-system-validators";
```

## Resources

- [Complete Documentation](./visual-system.md)
- [Best Practices](./design-system-best-practices.md)
- [Examples](./design-system-examples.md)
- [Quick Reference](./design-system-quick-reference.md)
