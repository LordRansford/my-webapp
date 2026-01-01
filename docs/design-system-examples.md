# Design System Examples

## Complete Page Example

```tsx
import { 
  BaseLayout, 
  PageContainer, 
  Section, 
  Card, 
  Stack, 
  Grid 
} from "@/components/layout/BaseLayout";
import { OptimizedImage } from "@/components/media/OptimizedImage";
import { getSpacing, getColor } from "@/utils/design-system-helpers";

export default function ExamplePage() {
  return (
    <BaseLayout>
      <PageContainer>
        <Section>
          <Stack gap="var(--space-8)">
            <h1 style={{ 
              fontSize: "var(--font-size-4xl)",
              color: "var(--color-text-heading)"
            }}>
              Page Title
            </h1>
            
            <Grid columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap="var(--space-6)">
              <Card elevation={3}>
                <Stack gap="var(--space-4)">
                  <OptimizedImage
                    src="/image1.jpg"
                    alt="Description"
                    width={400}
                    height={300}
                    aspectRatio="4/3"
                    priority={false}
                  />
                  <h2 style={{ fontSize: "var(--font-size-xl)" }}>
                    Card Title
                  </h2>
                  <p style={{ 
                    fontSize: "var(--font-size-base)",
                    lineHeight: "var(--line-height-relaxed)",
                    color: "var(--color-text-secondary)"
                  }}>
                    Card content with proper typography and spacing.
                  </p>
                </Stack>
              </Card>
            </Grid>
          </Stack>
        </Section>
      </PageContainer>
    </BaseLayout>
  );
}
```

## Form Example

```tsx
import { Stack, Card } from "@/components/layout/BaseLayout";

export function ExampleForm() {
  return (
    <Card padding="var(--space-6)">
      <Stack gap="var(--space-form-gap)">
        <label style={{
          fontSize: "var(--font-size-sm)",
          fontWeight: "var(--font-weight-semibold)",
          color: "var(--color-text-primary)"
        }}>
          Email Address
        </label>
        <input
          type="email"
          style={{
            padding: "var(--space-3) var(--space-4)",
            border: "var(--border-width-sm) solid var(--color-border-primary)",
            borderRadius: "var(--radius-md)",
            fontSize: "var(--font-size-base)",
            color: "var(--color-text-primary)",
            backgroundColor: "var(--color-surface)"
          }}
        />
      </Stack>
    </Card>
  );
}
```

## Hero Section Example

```tsx
import { OptimizedImage } from "@/components/media/OptimizedImage";
import { Stack, Inline } from "@/components/layout/BaseLayout";

export function HeroSection() {
  return (
    <section style={{
      padding: "var(--space-16) var(--space-6)",
      background: "var(--color-bg-primary)"
    }}>
      <Stack gap="var(--space-8)">
        <h1 style={{
          fontSize: "clamp(var(--font-size-4xl), 5vw, var(--font-size-6xl))",
          lineHeight: "var(--line-height-tight)",
          color: "var(--color-text-heading)"
        }}>
          Welcome to Our Platform
        </h1>
        
        <OptimizedImage
          src="/hero.jpg"
          alt="Hero image"
          width={1920}
          height={1080}
          aspectRatio="16/9"
          priority={true}
          quality={90}
          sizes="100vw"
        />
        
        <Inline gap="var(--space-4)" wrap>
          <button style={{
            padding: "var(--space-3) var(--space-6)",
            backgroundColor: "var(--color-accent-primary)",
            color: "var(--color-text-inverse)",
            borderRadius: "var(--radius-full)",
            fontSize: "var(--font-size-base)",
            fontWeight: "var(--font-weight-semibold)",
            border: "none",
            cursor: "pointer",
            transition: "var(--transition-transform)"
          }}>
            Get Started
          </button>
        </Inline>
      </Stack>
    </section>
  );
}
```

## Navigation Example

```tsx
import { Inline } from "@/components/layout/BaseLayout";

export function Navigation() {
  return (
    <nav style={{
      padding: "var(--space-4) var(--space-6)",
      borderBottom: "var(--border-width-sm) solid var(--color-border-primary)",
      backgroundColor: "var(--color-surface)"
    }}>
      <Inline gap="var(--space-nav-gap)" align="center">
        <a href="/" style={{
          fontSize: "var(--font-size-base)",
          fontWeight: "var(--font-weight-semibold)",
          color: "var(--color-text-primary)",
          textDecoration: "none"
        }}>
          Home
        </a>
        <a href="/about" style={{
          fontSize: "var(--font-size-base)",
          fontWeight: "var(--font-weight-semibold)",
          color: "var(--color-text-primary)",
          textDecoration: "none"
        }}>
          About
        </a>
      </Inline>
    </nav>
  );
}
```

## Responsive Grid Example

```tsx
import { Grid, Card } from "@/components/layout/BaseLayout";

export function ResponsiveGrid() {
  return (
    <Grid 
      columns={{ mobile: 1, tablet: 2, desktop: 4 }}
      gap="var(--space-6)"
    >
      <Card>Item 1</Card>
      <Card>Item 2</Card>
      <Card>Item 3</Card>
      <Card>Item 4</Card>
    </Grid>
  );
}
```

## Using Helper Functions

```tsx
import { 
  getSpacing, 
  getColor, 
  getShadow, 
  responsiveSpacing 
} from "@/utils/design-system-helpers";

export function HelperExample() {
  return (
    <div style={{
      padding: getSpacing(4),
      color: getColor("text", "primary"),
      boxShadow: getShadow(3),
      marginTop: responsiveSpacing("sm", "lg")
    }}>
      Content using helper functions
    </div>
  );
}
```

## Type-Safe Usage

```tsx
import type { SpacingKey, ShadowElevation } from "@/types/design-system";
import { tokens } from "@/theme/tokens";

export function TypeSafeExample() {
  const spacing: SpacingKey = "md";  // Type-safe
  const elevation: ShadowElevation = 3;  // Type-safe
  
  return (
    <div style={{
      padding: tokens.spacing[spacing],
      boxShadow: tokens.shadow.md
    }}>
      Type-safe design system usage
    </div>
  );
}
```
