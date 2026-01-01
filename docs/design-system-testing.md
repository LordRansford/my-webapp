# Design System Testing Guide

## Overview

This guide covers testing strategies for the design system to ensure consistency and catch regressions.

## Validation Utilities

### Runtime Validation

```tsx
import { DesignSystemValidator } from "@/utils/design-system-validators";

// Validate spacing
DesignSystemValidator.spacing("var(--space-4)"); // true
DesignSystemValidator.spacing("15px"); // false (not multiple of 4px)

// Validate colors
DesignSystemValidator.color("var(--color-text-primary)"); // true
DesignSystemValidator.color("#0f172a"); // false (hardcoded)

// Validate complete style object
const result = DesignSystemValidator.validateStyles({
  padding: "var(--space-4)",
  color: "#0f172a", // Violation!
});

if (!result.valid) {
  console.warn("Violations:", result.violations);
}
```

### Development Hook

```tsx
import { useDesignSystemValidation } from "@/utils/design-system-validators";

function MyComponent() {
  const validate = useDesignSystemValidation("MyComponent");
  
  const styles = {
    padding: "var(--space-4)",
    color: "var(--color-text-primary)",
  };
  
  validate(styles); // Warns in development if violations found
  
  return <div style={styles}>Content</div>;
}
```

## Visual Regression Testing

### Manual Testing Checklist

- [ ] Text renders sharply on standard displays
- [ ] Text renders sharply on Retina/high-DPI displays
- [ ] All spacing is consistent (4px grid)
- [ ] Colors meet WCAG AA contrast ratios
- [ ] Dark mode works correctly
- [ ] Reduced motion is respected
- [ ] Images load with proper aspect ratios
- [ ] Images handle errors gracefully

### Automated Testing

```tsx
// Example: Test spacing tokens
import { tokens } from "@/theme/tokens";

describe("Design System Tokens", () => {
  it("all spacing values are multiples of 4px", () => {
    Object.values(tokens.spacing).forEach((value) => {
      if (typeof value === "string" && value.includes("rem")) {
        const num = parseFloat(value);
        expect(num % 0.25).toBe(0);
      }
    });
  });
  
  it("all elevation values are valid", () => {
    [1, 2, 3, 4, 5].forEach((elevation) => {
      expect(tokens.shadow).toHaveProperty(
        elevation === 1 ? "xs" :
        elevation === 2 ? "sm" :
        elevation === 3 ? "md" :
        elevation === 4 ? "lg" : "xl"
      );
    });
  });
});
```

## Component Testing

### Testing Layout Components

```tsx
import { render } from "@testing-library/react";
import { Card, Stack, Grid } from "@/components/layout/BaseLayout";

describe("Card Component", () => {
  it("applies design system tokens", () => {
    const { container } = render(<Card elevation={3}>Content</Card>);
    const card = container.firstChild;
    
    expect(card).toHaveStyle({
      background: expect.stringContaining("var(--color-surface)"),
      borderRadius: expect.stringContaining("var(--radius-"),
    });
  });
  
  it("applies correct elevation", () => {
    const { container } = render(<Card elevation={5}>Content</Card>);
    expect(container.firstChild).toHaveClass("elevation-5");
  });
});
```

### Testing Image Component

```tsx
import { render, waitFor } from "@testing-library/react";
import { OptimizedImage } from "@/components/media/OptimizedImage";

describe("OptimizedImage Component", () => {
  it("handles image load errors gracefully", async () => {
    const { container } = render(
      <OptimizedImage
        src="/invalid.jpg"
        alt="Test"
        width={100}
        height={100}
      />
    );
    
    // Wait for error state
    await waitFor(() => {
      expect(container.textContent).toContain("Image unavailable");
    });
  });
  
  it("applies aspect ratio", () => {
    const { container } = render(
      <OptimizedImage
        src="/test.jpg"
        alt="Test"
        width={100}
        height={100}
        aspectRatio="16/9"
      />
    );
    
    expect(container.firstChild).toHaveStyle({
      aspectRatio: "16/9",
    });
  });
});
```

## Accessibility Testing

### Color Contrast

```tsx
// Test color contrast ratios
import { getContrastRatio } from "@/utils/color-utils"; // If you create this

describe("Color Contrast", () => {
  it("text-primary has sufficient contrast on bg-primary", () => {
    const contrast = getContrastRatio(
      tokens.color.text.primary,
      tokens.color.bg.primary
    );
    expect(contrast).toBeGreaterThanOrEqual(4.5); // WCAG AA
  });
});
```

### Keyboard Navigation

- Test all interactive elements are keyboard accessible
- Test focus states are visible
- Test tab order is logical

## Performance Testing

### Image Loading

```tsx
// Test image optimization
describe("Image Performance", () => {
  it("uses priority loading for LCP images", () => {
    const { container } = render(
      <OptimizedImage
        src="/hero.jpg"
        alt="Hero"
        width={1920}
        height={1080}
        priority={true}
      />
    );
    
    const img = container.querySelector("img");
    expect(img).toHaveAttribute("fetchpriority", "high");
  });
});
```

## ESLint Testing

The ESLint rules automatically catch violations:

```bash
# Run ESLint to check for design system violations
npm run lint

# Common violations caught:
# - Hardcoded hex colors
# - Magic numbers (non-token spacing)
# - Missing CSS variable usage
```

## Continuous Integration

Add to your CI pipeline:

```yaml
# .github/workflows/design-system-check.yml
- name: Check Design System Compliance
  run: |
    npm run lint
    npm run test:design-system
```

## Best Practices

1. **Always test in development** - Use validation utilities during development
2. **Test on multiple displays** - Verify sharp rendering on different DPI displays
3. **Test accessibility** - Verify color contrast and keyboard navigation
4. **Test performance** - Ensure images load efficiently
5. **Automate where possible** - Use ESLint and unit tests

## Resources

- [Design System Validators](../src/utils/design-system-validators.ts)
- [Helper Functions](../src/utils/design-system-helpers.ts)
- [Best Practices](./design-system-best-practices.md)
