# Style Guide - Course Premium Enhancement

**Version**: 1.0  
**Last Updated**: 2024  
**Status**: Active

This guide defines the visual and typographic standards for all course pages across AI, Cybersecurity, Data, Digitalisation, and Software Architecture courses.

---

## Typography Hierarchy

### Four-Tier System

#### 1. Primary Headers (h1) - Page Titles

**Usage**: One per page, in hero section  
**Component**: `CourseHeroSection` (title prop)

**Specifications**:
- **Font**: Display font family, 2rem (32px), weight 700
- **Line Height**: 1.2
- **Spacing**: 0.5rem top, 2rem bottom
- **Colour**: `text-slate-900` (light) / `text-slate-100` (dark)

**Accessibility**:
- Proper heading structure (h1)
- ARIA labels where needed
- High contrast (WCAG AA)

**Example**:
```jsx
<CourseHeroSection
  title="AI Foundations"
  description="..."
/>
```

---

#### 2. Section Headers (h2) - Main Content Sections

**Usage**: Main content sections throughout the page  
**Component**: `SectionHeader`

**Specifications**:
- **Font**: 1.75rem (28px), weight 600-700 (variant-dependent)
- **Line Height**: 1.3
- **Spacing**: 1.5rem top, 1rem bottom
- **Border**: 2px solid bottom border (variant-dependent colour)

**Variants**:

| Variant | Weight | Border Colour | Use Case | Emoji |
|---------|--------|---------------|----------|-------|
| `guide` | 600 | `border-indigo-200` | Instructional sections | 📚 🎯 💡 |
| `practice` | 700 | `border-amber-200` | Practice/activity sections | 🛠️ 🎮 ✏️ |
| `content` | 600 | `border-slate-200` | Main content sections | Course-specific |

**Example**:
```jsx
<SectionHeader variant="guide" emoji="📚" id="how-to-use">
  How to use this track
</SectionHeader>

<SectionHeader variant="practice" emoji="🛠️" id="quick-practice">
  Quick practice
</SectionHeader>

<SectionHeader variant="content" emoji="🧠" id="ai-foundations">
  AI Foundations
</SectionHeader>
```

**Accessibility**:
- Proper heading level (h2)
- Emoji with `aria-label` via `EmojiIcon`
- Skip-link support via `id` prop

---

#### 3. Subsection Headers (h3) - Subsections

**Usage**: Subsections within main sections  
**Component**: `SubsectionHeader`

**Specifications**:
- **Font**: 1.25rem (20px), weight 600
- **Line Height**: 1.4
- **Spacing**: 1.25rem top, 0.75rem bottom
- **Visual**: Subtle accent colour, no border, optional emoji

**Example**:
```jsx
<SubsectionHeader emoji="🛡️">
  Level 1 - Cybersecurity Foundations
</SubsectionHeader>
```

**Accessibility**:
- Proper heading structure (h3)
- Emoji with `aria-label` when used

---

#### 4. Body Text - Content

**Usage**: All paragraph content  
**Component**: `BodyText`

**Specifications**:
- **Font**: 1rem (16px), line-height 1.7
- **Colour**: `text-slate-700` (light) / `text-slate-300` (dark)
- **Spacing**: 1rem bottom margin
- **Letter Spacing**: 0.01em
- **Text Shadow**: Subtle in dark mode for depth

**Premium Features**:
- Refined letter spacing (0.01em)
- Subtle text shadow in dark mode
- Optimal reading width (max 75ch)

**Example**:
```jsx
<BodyText>
  The track stays in simple sentences while building serious skills.
  Use the levels below as a checklist or jump straight to the labs.
</BodyText>
```

**Accessibility**:
- Minimum 16px (WCAG AA)
- High contrast (WCAG AA)
- Readable line height

---

## Colour Palette

### Primary Colours

| Colour | Light Mode | Dark Mode | Usage |
|--------|------------|-----------|-------|
| Text Primary | `slate-900` | `slate-100` | Headers, important text |
| Text Body | `slate-700` | `slate-300` | Body paragraphs |
| Text Muted | `slate-600` | `slate-400` | Secondary text |
| Border | `slate-200` | `slate-700` | Default borders |

### Variant Colours

| Variant | Border (Light) | Border (Dark) | Usage |
|---------|----------------|---------------|-------|
| Guide | `indigo-200` | `indigo-700` | Instructional sections |
| Practice | `amber-200` | `amber-700` | Practice sections |
| Content | `slate-200` | `slate-700` | Content sections |

### Interactive States

| State | Colour | Usage |
|-------|--------|-------|
| Hover | `hover:bg-slate-50` | Interactive elements |
| Focus | `focus:ring-2 focus:ring-blue-200` | Keyboard navigation |
| Active | `bg-blue-600 text-white` | Selected/active states |

---

## Spacing System

### Consistent Spacing Scale

| Size | Value | Usage |
|------|-------|-------|
| xs | 0.25rem (4px) | Tight spacing |
| sm | 0.5rem (8px) | Small gaps |
| md | 1rem (16px) | Standard spacing |
| lg | 1.5rem (24px) | Section spacing |
| xl | 2rem (32px) | Large sections |

### Component Spacing

- **Section Headers**: 1.5rem top, 1rem bottom
- **Subsection Headers**: 1.25rem top, 0.75rem bottom
- **Body Text**: 1rem bottom
- **Tool Cards**: 1rem gap between cards

---

## Component Usage Patterns

### Course Hero Section

**When to use**: Overview pages only  
**Component**: `CourseHeroSection`

```jsx
<CourseHeroSection
  eyebrow="AI track"
  title="Notes, labs and CPD"
  description="..."
  highlights={[...]}
  primaryAction={{ label: "...", href: "..." }}
  secondaryActions={[...]}
  icon={<SafeIcon name="brain" />}
  gradient="indigo"
/>
```

### Section Headers

**When to use**: Every major content section  
**Component**: `SectionHeader`

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
```

### Body Text

**When to use**: All paragraph content (replace plain `<p>` tags)  
**Component**: `BodyText`

```jsx
<BodyText>
  The track stays in simple sentences while building serious skills.
</BodyText>
```

### Tool Cards

**When to use**: Interactive tools and practice activities  
**Component**: `ToolCard`

```jsx
<ToolCard 
  title="Plan a tiny AI habit" 
  description="Pick one daily habit to practise from this track."
  courseId="ai"
  levelId="overview"
  sectionId="habit-planner"
>
  <AIHabitPlannerTool />
</ToolCard>
```

---

## Dark Mode Support

All components support dark mode through Tailwind's `dark:` prefix.

**Key Patterns**:
- Text: `text-slate-900 dark:text-slate-100`
- Borders: `border-slate-200 dark:border-slate-700`
- Backgrounds: `bg-white dark:bg-slate-900`
- Text shadows: `dark:[text-shadow:0_1px_2px_rgba(0,0,0,0.1)]`

**Testing**: Verify all components in both light and dark modes.

---

## Responsive Design

### Breakpoints

| Breakpoint | Size | Usage |
|------------|------|-------|
| sm | 640px | Small tablets |
| md | 768px | Tablets |
| lg | 1024px | Desktops |
| xl | 1280px | Large desktops |

### Responsive Patterns

- **Grids**: `grid gap-4 md:grid-cols-2 lg:grid-cols-3`
- **Text**: Base size on mobile, scales up on larger screens
- **Spacing**: Tighter on mobile, more generous on desktop

---

## Accessibility Requirements

### WCAG AA Compliance

1. **Colour Contrast**: Minimum 4.5:1 for body text, 3:1 for large text
2. **Font Size**: Minimum 16px for body text
3. **Focus Indicators**: Visible focus rings on all interactive elements
4. **Keyboard Navigation**: All interactive elements keyboard accessible
5. **Screen Readers**: Proper ARIA labels, semantic HTML

### Implementation Checklist

- [ ] All headings use proper hierarchy (h1 > h2 > h3)
- [ ] All emojis have `aria-label` attributes
- [ ] All interactive elements have focus states
- [ ] All images have alt text
- [ ] Colour is not the only indicator of state
- [ ] Keyboard navigation works end-to-end

---

## Animation Guidelines

### Framer Motion Usage

**When to use**: 
- Page transitions
- Component entrance animations
- Interactive feedback

**Reduced Motion Support**:
```jsx
import { useReducedMotion } from "framer-motion";
import { reducedMotionProps, motionPresets } from "@/lib/motion.js";

const reduce = useReducedMotion();

<m.div {...reducedMotionProps(reduce, motionPresets.fadeIn)}>
  {/* content */}
</m.div>
```

**Animation Presets**:
- `fadeIn`: Simple opacity transition
- `slideUp`: Slide up with fade
- `scaleIn`: Scale with fade

---

## Consistency Rules

### Do's ✅

- Use `SectionHeader` for all h2 sections
- Use `BodyText` for all paragraph content
- Use `SubsectionHeader` for h3 subsections
- Include emojis in section headers (with aria-labels)
- Use consistent spacing scale
- Test in both light and dark modes
- Ensure keyboard navigation works

### Don'ts ❌

- Don't use raw `<h2>`, `<h3>`, or `<p>` tags in MDX
- Don't skip heading levels (h1 → h3)
- Don't use emojis without `aria-label`
- Don't use inline styles
- Don't create custom spacing values
- Don't ignore dark mode
- Don't skip accessibility features

---

## Migration Checklist

When updating existing pages:

- [ ] Replace all `##` with `<SectionHeader>`
- [ ] Replace all `###` with `<SubsectionHeader>`
- [ ] Wrap all paragraphs in `<BodyText>`
- [ ] Add appropriate emojis to headers
- [ ] Verify heading hierarchy
- [ ] Test keyboard navigation
- [ ] Test dark mode
- [ ] Verify accessibility

---

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [British English Style Guide](./british-english-guide.md)
- [Emoji Usage Guidelines](./emoji-usage-guide.md)

---

**Last Updated**: 2024  
**Maintained By**: Development Team

