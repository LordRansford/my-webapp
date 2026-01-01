# Design System Index

Complete guide to the visual quality covenant design system implementation.

## 📚 Documentation

### Core Documentation
- **[Visual System Documentation](./visual-system.md)** - Complete design system reference
- **[Visual System Summary](./visual-system-summary.md)** - Implementation overview
- **[Gold Standard Enhancements](./gold-standard-enhancements.md)** - Advanced features

### Usage Guides
- **[Best Practices](./design-system-best-practices.md)** - How to use the design system correctly
- **[Examples](./design-system-examples.md)** - Real-world code examples
- **[Quick Reference](./design-system-quick-reference.md)** - Cheat sheet for common patterns

## 🎨 Design System Files

### CSS Modules
- `src/styles/typography.css` - Typography scale and font rendering
- `src/styles/spacing.css` - 4px-based spacing grid
- `src/styles/colors.css` - Color system with WCAG compliance
- `src/styles/shadows.css` - Shadow and depth system
- `src/styles/motion.css` - GPU-optimized animations
- `src/styles/grid-utilities.css` - Responsive grid patterns
- `src/styles/design-system.css` - Central import file

### TypeScript
- `src/theme/tokens.ts` - Design tokens (TypeScript)
- `src/types/design-system.ts` - Type definitions
- `src/utils/design-system-helpers.ts` - Helper functions

### Components
- `src/components/layout/BaseLayout.tsx` - Layout components
- `src/components/media/OptimizedImage.tsx` - High-DPI image component
- `src/components/media/ImageWrapper.tsx` - Image fallback component

## 🚀 Quick Start

### 1. Import Design System

The design system is automatically imported via `globals.css`:

```css
@import "./design-system.css";
```

### 2. Use Layout Components

```tsx
import { 
  BaseLayout, 
  PageContainer, 
  Section, 
  Card 
} from "@/components/layout/BaseLayout";

export default function Page() {
  return (
    <BaseLayout>
      <PageContainer>
        <Section>
          <Card elevation={3}>
            Content
          </Card>
        </Section>
      </PageContainer>
    </BaseLayout>
  );
}
```

### 3. Use Design Tokens

```tsx
<div style={{
  padding: "var(--space-4)",
  color: "var(--color-text-primary)",
  fontSize: "var(--font-size-base)"
}}>
  Content
</div>
```

### 4. Use Helper Functions

```tsx
import { getSpacing, getColor } from "@/utils/design-system-helpers";

const padding = getSpacing(4);
const color = getColor("text", "primary");
```

## 📋 Key Principles

1. **Always use design tokens** - Never hardcode colors, spacing, or typography
2. **4px spacing grid** - All spacing must be multiples of 4px
3. **Use OptimizedImage** - All raster images must use the OptimizedImage component
4. **Type safety** - Use TypeScript types for design tokens
5. **Accessibility first** - All colors meet WCAG AA standards
6. **Performance** - GPU-optimized animations, responsive images

## 🎯 Success Criteria

✅ All text renders sharply on standard and Retina displays  
✅ All spacing values are multiples of 4px (enforced via tokens)  
✅ All images use Next.js Image with proper high-DPI handling  
✅ All colors use design tokens (no hardcoded hex/rgb values)  
✅ All shadows and borders use design system tokens  
✅ All animations are GPU-optimized and respect reduced-motion  
✅ New pages automatically inherit visual quality by default  
✅ Visual regressions are difficult to introduce (enforced via tokens)  

## 🔧 Tools & Utilities

### ESLint Rules
- Warns against hardcoded hex colors
- Warns against magic numbers (non-token spacing)
- Encourages CSS variable usage

### TypeScript Types
- `SpacingKey` - Type-safe spacing values
- `ShadowElevation` - Type-safe elevation levels (1-5)
- `RadiusKey` - Type-safe border radius values
- `ColorCategory` - Type-safe color categories

### Helper Functions
- `getSpacing()` - Get spacing value
- `getColor()` - Get color value
- `getShadow()` - Get shadow by elevation
- `getTransition()` - Get motion transition
- `responsiveSpacing()` - Viewport-aware spacing
- `DesignSystemValidator` - Token validation

## 📖 Learning Path

1. **Start Here**: [Quick Reference](./design-system-quick-reference.md)
2. **Learn Patterns**: [Best Practices](./design-system-best-practices.md)
3. **See Examples**: [Examples](./design-system-examples.md)
4. **Deep Dive**: [Visual System Documentation](./visual-system.md)
5. **Advanced**: [Gold Standard Enhancements](./gold-standard-enhancements.md)

## 🆘 Common Questions

### How do I add custom spacing?
Use the spacing scale. If you need a value not in the scale, ensure it's a multiple of 4px (0.25rem).

### Can I use Tailwind classes?
Yes, but prefer design tokens for consistency. Tailwind classes are fine for utility purposes.

### How do I create a responsive grid?
Use the `Grid` component with responsive column configuration:
```tsx
<Grid columns={{ mobile: 1, tablet: 2, desktop: 3 }} />
```

### What if an image fails to load?
The `OptimizedImage` component handles errors gracefully with fallback support.

### How do I validate design token usage?
Use `DesignSystemValidator` helper functions or ESLint will warn you.

## 🔗 Related Resources

- [Next.js Image Optimization](https://nextjs.org/docs/app/api-reference/components/image)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)

## 📝 Maintenance

- All new components must use design system tokens
- Deviations require explicit justification
- Regular audits to ensure consistency
- Design system documentation kept up-to-date

---

**Last Updated**: Implementation complete with gold-standard enhancements  
**Status**: ✅ Production Ready
