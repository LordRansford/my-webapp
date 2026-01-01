# Getting Started with the Design System

## Welcome! 🎉

The visual quality covenant design system is now fully implemented and ready to use. This guide will help you get started quickly.

## 🚀 5-Minute Quick Start

### Step 1: Import Layout Components

```tsx
import { 
  BaseLayout, 
  PageContainer, 
  Section, 
  Card 
} from "@/components/layout";
```

### Step 2: Build Your Page

```tsx
export default function MyPage() {
  return (
    <BaseLayout>
      <PageContainer>
        <Section>
          <Card elevation={3}>
            <h1>Hello World</h1>
            <p>Your content here</p>
          </Card>
        </Section>
      </PageContainer>
    </BaseLayout>
  );
}
```

### Step 3: Add Images

```tsx
import { OptimizedImage } from "@/components/media";

<OptimizedImage
  src="/image.jpg"
  alt="Description"
  width={1200}
  height={800}
  aspectRatio="16/9"
  priority={true}
/>
```

That's it! Your page now has:
- ✅ Sharp text rendering
- ✅ Consistent spacing (4px grid)
- ✅ WCAG AA colors
- ✅ Optimized images
- ✅ GPU-accelerated animations
- ✅ Reduced motion support

## 📚 Learn More

### For Quick Reference
- **[Quick Reference](./design-system-quick-reference.md)** - Cheat sheet for common patterns

### For Best Practices
- **[Best Practices](./design-system-best-practices.md)** - How to use the system correctly

### For Examples
- **[Examples](./design-system-examples.md)** - Real-world code samples

### For Complete Reference
- **[API Reference](./design-system-api-reference.md)** - Complete component APIs
- **[Visual System](./visual-system.md)** - Full system documentation

## 🎯 Key Principles

1. **Always use design tokens** - Never hardcode colors, spacing, or typography
2. **4px spacing grid** - All spacing must be multiples of 4px
3. **Use OptimizedImage** - All raster images must use this component
4. **Type safety** - Use TypeScript types for tokens
5. **Accessibility first** - WCAG AA compliance required

## 🛠️ Developer Tools

### TypeScript Types
```tsx
import type { SpacingKey, ShadowElevation } from "@/types/design-system";
```

### Helper Functions
```tsx
import { getSpacing, getColor } from "@/utils";
```

### Validators
```tsx
import { DesignSystemValidator } from "@/utils";
```

## 📖 Next Steps

1. Read the [Quick Reference](./design-system-quick-reference.md)
2. Review [Best Practices](./design-system-best-practices.md)
3. Check out [Examples](./design-system-examples.md)
4. Explore the [API Reference](./design-system-api-reference.md)

## ❓ Need Help?

- Check the [Best Practices](./design-system-best-practices.md) guide
- Review [Examples](./design-system-examples.md) for patterns
- See [API Reference](./design-system-api-reference.md) for component APIs
- Use [Quick Reference](./design-system-quick-reference.md) as a cheat sheet

---

**Ready to build?** Start with the [Quick Reference](./design-system-quick-reference.md) and [Examples](./design-system-examples.md)!
