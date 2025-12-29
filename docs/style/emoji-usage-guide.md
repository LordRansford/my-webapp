# Emoji Usage Guidelines

**Version**: 1.0  
**Last Updated**: 2024  
**Status**: Active

This guide defines how emojis should be used across course pages to enhance visual hierarchy and provide context while maintaining accessibility.

---

## Core Principles

1. **Purposeful, Not Decorative**: Emojis should add meaning, not just decoration
2. **Consistent**: Use the same emoji for the same context across courses
3. **Accessible**: All emojis must have proper `aria-label` attributes
4. **Sparse**: Use emojis in headers, not in body text
5. **Course-Specific**: Each course has its own emoji palette

---

## Usage Contexts

### Section Headers (h2)

**When**: Always use emojis in `SectionHeader` components  
**How**: Via the `emoji` prop, which automatically adds `aria-label`

**Variants**:

| Variant | Recommended Emojis | Example |
|---------|-------------------|---------|
| `guide` | 📚 🎯 💡 | "How to use this track" |
| `practice` | 🛠️ 🎮 ✏️ | "Quick practice" |
| `content` | Course-specific | "AI Foundations" |

**Example**:
```jsx
<SectionHeader variant="guide" emoji="📚" id="how-to-use">
  How to use this track
</SectionHeader>
```

---

### Subsection Headers (h3)

**When**: Sparingly, only when it adds clear value  
**How**: Via `SubsectionHeader` component with `emoji` prop

**Common Use Cases**:
- ⚠️ Warnings or important notices
- ✅ Checkpoints or milestones
- 🔍 Exploration or discovery sections

**Example**:
```jsx
<SubsectionHeader emoji="🛡️">
  Level 1 - Cybersecurity Foundations
</SubsectionHeader>
```

---

### Tool Cards

**When**: Tool-specific emojis to indicate tool type  
**How**: Not in ToolCard title, but can be in tool component itself

**Tool-Specific Emojis**:
- 🧠 AI-related tools
- 🛡️ Security-related tools
- 📊 Data-related tools
- 🏗️ Architecture-related tools
- 🌐 Digitalisation-related tools

---

## Course-Specific Emoji Palette

### AI Course 🧠

| Context | Emoji | Usage |
|---------|-------|-------|
| Main content | 🧠 | AI/Intelligence concepts |
| Learning | 📚 | Educational content |
| Practice | 🛠️ | Hands-on activities |
| Data | 📊 | Data-related sections |
| Models | 🤖 | Model-related content |

**Example**:
```jsx
<SectionHeader variant="content" emoji="🧠" id="ai-foundations">
  AI Foundations
</SectionHeader>
```

---

### Cybersecurity Course 🛡️

| Context | Emoji | Usage |
|---------|-------|-------|
| Main content | 🛡️ | Security concepts |
| Threats | ⚠️ | Threat-related sections |
| Practice | 🛠️ | Security drills |
| Protection | 🔒 | Defence mechanisms |
| Analysis | 🔍 | Security analysis |

**Example**:
```jsx
<SectionHeader variant="content" emoji="🛡️" id="threat-modelling">
  Threat Modelling
</SectionHeader>
```

---

### Data Course 📊

| Context | Emoji | Usage |
|---------|-------|-------|
| Main content | 📊 | Data concepts |
| Quality | ✅ | Data quality sections |
| Analysis | 🔍 | Data analysis |
| Governance | 📋 | Governance sections |
| Connections | 🔗 | Data connections |

**Example**:
```jsx
<SectionHeader variant="content" emoji="📊" id="data-quality">
  Data Quality
</SectionHeader>
```

---

### Digitalisation Course 🌐

| Context | Emoji | Usage |
|---------|-------|-------|
| Main content | 🌐 | Digitalisation concepts |
| Strategy | 🎯 | Strategic sections |
| Transformation | 🔄 | Transformation content |
| Platforms | 🏗️ | Platform sections |
| Networks | 🌐 | Network-related content |

**Example**:
```jsx
<SectionHeader variant="content" emoji="🌐" id="digital-strategy">
  Digital Strategy
</SectionHeader>
```

---

### Software Architecture Course 🏗️

| Context | Emoji | Usage |
|---------|-------|-------|
| Main content | 🏗️ | Architecture concepts |
| Design | ✏️ | Design sections |
| Systems | ⚙️ | System architecture |
| Patterns | 🔄 | Design patterns |
| Quality | ⭐ | Quality attributes |

**Example**:
```jsx
<SectionHeader variant="content" emoji="🏗️" id="system-design">
  System Design
</SectionHeader>
```

---

## Universal Emojis

These emojis can be used across all courses:

| Emoji | Meaning | Usage |
|-------|---------|-------|
| 📚 | Learning/Education | Instructional sections |
| 🎯 | Goals/Targets | Goal-oriented sections |
| 🛠️ | Tools/Practice | Practice sections |
| ⚠️ | Warnings/Important | Important notices |
| ✅ | Checkpoints/Success | Milestones, checkpoints |
| 💡 | Insights/Tips | Tips and insights |
| 🔍 | Exploration/Discovery | Discovery sections |

---

## Accessibility Requirements

### ARIA Labels

**Always Required**: All emojis must have descriptive `aria-label` attributes.

**Implementation**: The `EmojiIcon` component handles this automatically:

```jsx
<EmojiIcon
  emoji="🧠"
  label="Section: AI Foundations"
  size="md"
/>
```

**Screen Reader Text**: Should read as "Section: [description]" not just the emoji.

**Example**:
- ✅ Good: `aria-label="Section: AI Foundations"`
- ❌ Bad: `aria-label="🧠"`

---

### Size Guidelines

**Maximum Size**: 1.2em relative to text  
**Default Size**: Matches text size (1em)

**Sizes Available**:
- `sm`: 0.875em (14px)
- `md`: 1em (16px) - default
- `lg`: 1.2em (19px) - maximum

**Example**:
```jsx
<EmojiIcon emoji="🧠" label="..." size="md" />
```

---

### Fallback Considerations

**Text-Only Version**: Consider providing text-only alternatives for users who prefer no emojis.

**Implementation**: Emojis are decorative and don't affect functionality, so text-only mode is already supported through screen readers.

---

## Do's and Don'ts

### Do's ✅

- Use emojis in section headers to provide visual anchors
- Use course-specific emojis for consistency
- Always include `aria-label` attributes
- Use emojis sparingly in subsections
- Match emoji to content meaning
- Test with screen readers

### Don'ts ❌

- Don't use emojis in body text
- Don't use emojis without `aria-label`
- Don't use emojis as the only indicator of meaning
- Don't mix emoji styles (stick to one set)
- Don't overuse emojis (one per section header is enough)
- Don't use emojis that don't match the content

---

## Implementation Examples

### Section Header with Emoji

```jsx
<SectionHeader variant="content" emoji="🧠" id="ai-foundations">
  AI Foundations
</SectionHeader>
```

**Renders as**: 🧠 AI Foundations (with proper aria-label)

---

### Subsection Header with Emoji

```jsx
<SubsectionHeader emoji="🛡️">
  Level 1 - Cybersecurity Foundations
</SubsectionHeader>
```

**Renders as**: 🛡️ Level 1 - Cybersecurity Foundations (with proper aria-label)

---

### Tool Card (No Emoji in Title)

```jsx
<ToolCard title="Plan a tiny AI habit" description="...">
  <AIHabitPlannerTool />
</ToolCard>
```

**Note**: Tool titles don't include emojis. Emojis can be used within the tool component itself if needed.

---

## Migration Checklist

When adding emojis to existing content:

- [ ] Identify appropriate emoji from course palette
- [ ] Add emoji to `SectionHeader` or `SubsectionHeader` via `emoji` prop
- [ ] Verify `aria-label` is automatically added (via `EmojiIcon`)
- [ ] Test with screen reader
- [ ] Verify emoji size is appropriate
- [ ] Check consistency with other sections

---

## Resources

- [Emoji Unicode Reference](https://unicode.org/emoji/charts/)
- [WCAG 2.1 - Non-text Content](https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html)
- [Style Guide](./style-guide.md)
- [Component Documentation](../development/COMPONENT_DOCUMENTATION.md)

---

**Last Updated**: 2024  
**Maintained By**: Development Team

