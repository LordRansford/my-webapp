# Component Documentation

**Version**: 1.0  
**Last Updated**: 2024  
**Status**: Active

This document provides comprehensive documentation for all typography and course-related components used across course pages.

---

## Typography Components

### SectionHeader

**Location**: `src/components/course/SectionHeader.tsx`  
**Type**: Client Component (`"use client"`)

Premium section header component for course pages. Provides consistent h2 styling with variants for different section types.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | Required | Header text content |
| `variant` | `"guide" \| "practice" \| "content"` | `"content"` | Visual variant |
| `emoji` | `string` | Optional | Emoji to display (with aria-label) |
| `subtitle` | `string` | Optional | Subtitle text below header |
| `id` | `string` | Optional | HTML id for anchor links |
| `className` | `string` | `""` | Additional CSS classes |

#### Variants

- **`guide`**: Instructional sections (e.g., "How to use this track")
  - Font weight: 600
  - Border: `border-indigo-200` (light) / `border-indigo-700` (dark)
  - Recommended emoji: 📚 🎯 💡

- **`practice`**: Practice/activity sections (e.g., "Quick practice")
  - Font weight: 700
  - Border: `border-amber-200` (light) / `border-amber-700` (dark)
  - Recommended emoji: 🛠️ 🎮 ✏️

- **`content`**: Main content sections (default)
  - Font weight: 600
  - Border: `border-slate-200` (light) / `border-slate-700` (dark)
  - Recommended emoji: Course-specific

#### Usage

```jsx
// Instructional section
<SectionHeader variant="guide" emoji="📚" id="how-to-use">
  How to use this track
</SectionHeader>

// Practice section
<SectionHeader variant="practice" emoji="🛠️" id="quick-practice">
  Quick practice
</SectionHeader>

// Content section
<SectionHeader variant="content" emoji="🧠" id="ai-foundations">
  AI Foundations
</SectionHeader>

// With subtitle
<SectionHeader variant="content" emoji="🧠" subtitle="Learn the basics">
  AI Foundations
</SectionHeader>
```

#### Styling

- **Font Size**: 1.75rem (28px)
- **Line Height**: 1.3
- **Border**: 2px solid bottom border
- **Spacing**: 1.5rem top, 1rem bottom (via className)
- **Dark Mode**: Fully supported

#### Accessibility

- Renders as `<h2>` element
- Emoji automatically wrapped in `EmojiIcon` with `aria-label`
- Supports skip links via `id` prop
- High contrast colours (WCAG AA)

---

### SubsectionHeader

**Location**: `src/components/course/SubsectionHeader.tsx`  
**Type**: Client Component (`"use client"`)

Subsection header component for h3-level content. Used sparingly within main sections.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | Required | Header text content |
| `emoji` | `string` | Optional | Emoji to display (with aria-label) |
| `className` | `string` | `""` | Additional CSS classes |

#### Usage

```jsx
<SubsectionHeader emoji="🛡️">
  Level 1 - Cybersecurity Foundations
</SubsectionHeader>
```

#### Styling

- **Font Size**: 1.25rem (20px)
- **Font Weight**: 600
- **Line Height**: 1.4
- **Spacing**: 1.25rem top, 0.75rem bottom
- **Visual**: Subtle accent colour, no border

#### Accessibility

- Renders as `<h3>` element
- Emoji automatically wrapped in `EmojiIcon` with `aria-label`
- High contrast colours (WCAG AA)

---

### BodyText

**Location**: `src/components/course/BodyText.tsx`  
**Type**: Client Component (`"use client"`)

Premium body text component for course pages. Provides consistent paragraph styling with optimal readability.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | Required | Paragraph content |
| `className` | `string` | `""` | Additional CSS classes |

#### Usage

```jsx
<BodyText>
  The track stays in simple sentences while building serious skills.
  Use the levels below as a checklist or jump straight to the labs.
</BodyText>
```

#### Styling

- **Font Size**: 1rem (16px) - WCAG AA compliant
- **Line Height**: 1.7 - Optimal for reading
- **Colour**: `text-slate-700` (light) / `text-slate-300` (dark)
- **Letter Spacing**: 0.01em - Refined typography
- **Text Shadow**: Subtle in dark mode for depth
- **Spacing**: 1rem bottom margin

#### Accessibility

- Minimum 16px font size (WCAG AA)
- High contrast (WCAG AA)
- Readable line height

---

### EmojiIcon

**Location**: `src/components/course/EmojiIcon.tsx`  
**Type**: Client Component (`"use client"`)

Accessible emoji wrapper component. Ensures all emojis have proper ARIA labels for screen readers.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `emoji` | `string` | Required | Emoji character(s) |
| `label` | `string` | Required | ARIA label for screen readers |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size variant |

#### Usage

```jsx
<EmojiIcon
  emoji="🧠"
  label="Section: AI Foundations"
  size="md"
/>
```

#### Sizes

- **`sm`**: 0.875em (14px)
- **`md`**: 1em (16px) - default
- **`lg`**: 1.2em (19px) - maximum recommended

#### Accessibility

- Always includes `aria-label` attribute
- Screen reader reads label, not emoji
- Size limited to 1.2em maximum

---

## Course Components

### CourseHeroSection

**Location**: `src/components/course/CourseHeroSection.tsx`  
**Type**: Client Component (`"use client"`)

Hero section component for course overview pages. Displays course title, description, highlights, and action buttons.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `eyebrow` | `string` | Required | Small text above title |
| `title` | `string` | Required | Main course title |
| `description` | `string` | Required | Course description |
| `highlights` | `Array<{chip: string, text: string}>` | Optional | Feature highlights |
| `primaryAction` | `{label: string, href: string}` | Optional | Primary CTA button |
| `secondaryActions` | `Array<{label: string, href: string}>` | Optional | Secondary action links |
| `icon` | `ReactNode` | Optional | Icon component |
| `gradient` | `string` | Optional | Gradient variant |

#### Usage

```jsx
<CourseHeroSection
  eyebrow="AI track"
  title="Notes, labs and CPD"
  description="We start with the basics..."
  highlights={[
    { chip: "Foundations", text: "Data, vectors and honest accuracy." },
    { chip: "Intermediate", text: "Evaluation, leakage and simple pipelines." },
  ]}
  primaryAction={{
    label: "Start with Foundations",
    href: "/ai/beginner",
  }}
  secondaryActions={[
    { label: "Track CPD", href: "/my-cpd" },
    { label: "Open dashboards", href: "/dashboards/ai" },
  ]}
  icon={<SafeIcon name="brain" size={20} />}
  gradient="indigo"
/>
```

---

## Integration in MDX

### Example MDX File

```mdx
---
title: "AI course overview"
description: "How the AI track flows..."
---

<CourseHeroSection
  eyebrow="AI track"
  title="Notes, labs and CPD"
  description="..."
/>

<SectionHeader variant="guide" emoji="📚" id="how-to-use">
  How to use this track
</SectionHeader>

<BodyText>
  Move through the four levels in order, or dip into a section you need for work right now.
</BodyText>

<SectionHeader variant="practice" emoji="🛠️" id="quick-practice">
  Quick practice
</SectionHeader>

<ToolCard title="Plan a tiny AI habit" description="...">
  <AIHabitPlannerTool />
</ToolCard>
```

### Page Component Setup

```jsx
import dynamic from "next/dynamic";
import SectionHeader from "@/components/course/SectionHeader";
import SubsectionHeader from "@/components/course/SubsectionHeader";
import BodyText from "@/components/course/BodyText";

const AIHabitPlannerTool = dynamic(
  () => import("@/components/notes/tools/ai/overview/AIHabitPlannerTool"),
  { ssr: false }
);

export default function Page({ source, headings }) {
  const mdxComponents = useMemo(
    () => ({
      SectionHeader,
      SubsectionHeader,
      BodyText,
      AIHabitPlannerTool,
      // ... other components
    }),
    []
  );

  return (
    <NotesLayout headings={headings}>
      <MDXRenderer source={source} components={mdxComponents} />
    </NotesLayout>
  );
}
```

---

## Migration Checklist

When updating existing pages to use these components:

- [ ] Replace all `##` with `<SectionHeader>`
- [ ] Replace all `###` with `<SubsectionHeader>`
- [ ] Wrap all paragraphs in `<BodyText>`
- [ ] Add appropriate emojis to headers
- [ ] Add `id` props for skip links
- [ ] Import components in page file
- [ ] Add to `mdxComponents` object
- [ ] Test keyboard navigation
- [ ] Test dark mode
- [ ] Verify accessibility

---

## TypeScript Types

### SectionHeaderVariant

```typescript
export type SectionHeaderVariant = "guide" | "practice" | "content";
```

### Component Props

All components use TypeScript interfaces for type safety. See component source files for full type definitions.

---

## Resources

- [Style Guide](../style/style-guide.md)
- [Emoji Usage Guidelines](../style/emoji-usage-guide.md)
- [Tool Development Patterns](./tool-development-patterns.md)
- [British English Guide](../style/british-english-guide.md)

---

**Last Updated**: 2024  
**Maintained By**: Development Team

