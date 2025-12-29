# Course Premium Enhancement Strategy
## Holistic Approach for All 5 Courses - Gold Standard Implementation

**Status**: Planning Phase - Ready for Implementation  
**Version**: 2.0 - Enhanced with Best Practices  
**Scope**: All course pages (overview, beginner/foundations, intermediate, advanced, summary) across AI, Cybersecurity, Data, Digitalisation, and Software Architecture  
**Goal**: Achieve premium feel beyond gold standard while maintaining content integrity, British English, accessibility (WCAG AA), and scalability for future courses

**Quality Principle**: Stop implementation if approaching regression state. Report remaining work for review.

---

## Strategic Alignment

### Core Principles
1. **Premium Feel**: Exceed gold standard through refined typography, purposeful interactions, and visual polish
2. **Content Integrity**: Never change content meaning - only enhance presentation
3. **British English**: 100% compliance - no American spellings, no em-dashes, no generated-feel language
4. **Accessibility First**: WCAG AA minimum, keyboard navigation, screen reader support, high contrast
5. **Consistency**: Unified experience across all courses, scalable for future additions
6. **Performance**: Lazy loading, reduced motion support, optimal bundle sizes

### Alignment with Existing Standards
- **Development Guidelines**: Follows `docs/development/DEVELOPMENT_GUIDELINES.md`
- **Accessibility**: Meets `content/internal/template-standard.mdx` requirements (16px+ body, 18px+ headings, WCAG AA)
- **CPD Quality**: Aligns with course design principles (clear outcomes, progressive complexity, practical application)
- **Code Quality**: TypeScript standards, ESLint compliance, component patterns

---

## Part 1: Baseline State Analysis

### Current Typography Patterns

**Overview Pages:**
- **AI**: MDX with custom hero div, inconsistent h2 usage, no component standardisation
- **Cybersecurity**: MDX with custom hero div, mixed h2/h3, some raw markdown headers
- **Data**: Uses `CourseHeroSection`, `SectionHeader` - most consistent
- **Digitalisation**: Uses `CourseHeroSection`, `SectionHeader` - most consistent  
- **Software Architecture**: Uses `CourseHeroSection`, `SectionHeader` - most consistent

**Level Pages (Beginner/Intermediate/Advanced/Summary):**
- All 20 level pages use MDX with direct markdown headers (`##`, `###`)
- No consistent component usage for headers
- Typography varies significantly by course
- Body text uses default prose styling without premium refinement

**Critical Issues:**
1. **Inconsistent Header Styling**: Three different approaches across courses
2. **No Visual Hierarchy**: Headers, subheaders, and body text lack clear distinction
3. **Static Tool Cards**: Multiple instances of static content in `ToolCard` components
4. **No Emoji System**: Missing purposeful visual anchors
5. **British English Gaps**: Needs systematic verification
6. **Accessibility Gaps**: Header components may lack proper ARIA labels

### Component Inventory

**Existing Components (Good):**
- `CourseHeroSection` - Used in 3/5 overview pages
- `SectionHeader` - Exists but underutilised
- `SubsectionHeader` - Exists but lacks features
- `ToolCard` - Used everywhere but often with static content

**Missing Components:**
- `EmojiIcon` - For consistent emoji rendering with accessibility
- Enhanced typography components with variants
- MDX header component integration

### Content Quality Audit

**British English Issues Found:**
- Need systematic scan for: organize, color, center, analyze, optimize, behavior, defense, license
- Em-dash usage (—) needs removal
- "Generated feel" language patterns need identification

**Static Tools Inventory Needed:**
- AI overview: "Plan a tiny AI habit" (static list)
- Other courses: TBD (requires full audit)

---

## Part 2: Target State Vision

### Typography Hierarchy System

**Four-Tier Premium Typography:**

1. **Primary Headers (h1) - Page Titles**
   - **Font**: Display font family, 2rem (32px), weight 700
   - **Line Height**: 1.2
   - **Spacing**: 0.5rem top, 2rem bottom
   - **Usage**: One per page, in hero section
   - **Accessibility**: Proper heading structure, ARIA labels

2. **Section Headers (h2) - Main Content Sections**
   - **Component**: Enhanced `SectionHeader` with variants
   - **Font**: 1.75rem (28px), weight 600-700 (variant-dependent)
   - **Line Height**: 1.3
   - **Visual**: 
     - Border-bottom: 2px solid, colour varies by variant
     - Optional emoji prefix (with aria-label)
     - Subtle gradient or accent colour
   - **Variants**:
     - `guide` - Instructional sections (e.g., "How to use this track")
       - Weight: 600, colour: indigo/slate, emoji: 📚
     - `practice` - Practice/activity sections (e.g., "Quick practice")
       - Weight: 700, colour: amber/emerald, emoji: 🛠️
     - `content` - Main content sections (default)
       - Weight: 600, colour: slate, emoji: course-specific
   - **Spacing**: 1.5rem top, 1rem bottom
   - **Accessibility**: Proper heading level, skip-link support

3. **Subsection Headers (h3) - Subsections**
   - **Component**: Enhanced `SubsectionHeader`
   - **Font**: 1.25rem (20px), weight 600
   - **Line Height**: 1.4
   - **Visual**: 
     - Subtle accent colour (lighter than section headers)
     - Optional emoji prefix (sparingly used)
     - No border, subtle background on hover
   - **Spacing**: 1.25rem top, 0.75rem bottom
   - **Accessibility**: Proper heading structure

4. **Body Text - Content**
   - **Font**: 1rem (16px), line-height 1.7
   - **Colour**: High contrast (WCAG AA)
   - **Spacing**: Consistent paragraph spacing (1rem)
   - **Premium Features**:
     - Refined letter spacing (0.01em)
     - Subtle text shadow in dark mode for depth
     - Optimal reading width (max 75ch)
   - **Accessibility**: Minimum 16px, high contrast, readable

### Interactive Tool Enhancement Strategy

**Transformation Framework:**

1. **Audit & Categorise**
   - Scan all MDX files for `<ToolCard>` with static content
   - Categorise: habit planners, checklists, forms, explorers, calculators
   - Prioritise by visibility and learning impact

2. **Design Patterns**
   - **Habit Planners**: Progress tracking, localStorage, visualisations, streaks
   - **Checklists**: Interactive toggles, persistence, export, progress indicators
   - **Forms**: Validation, real-time feedback, auto-save, clear error states
   - **Explorers**: Filtering, sorting, search, dynamic results
   - **Calculators**: Input validation, step-by-step guidance, result explanations

3. **Technical Requirements**
   - Framer Motion for smooth animations
   - localStorage for persistence
   - Error boundaries for resilience
   - Accessibility: keyboard navigation, ARIA labels, screen reader support
   - Performance: lazy loading, code splitting
   - Reduced motion support

### Emoji Integration System

**Purposeful Usage Matrix:**

| Context | Emoji | Purpose | Frequency |
|---------|-------|---------|-----------|
| Section: Guide | 📚 🎯 💡 | Visual anchor for instructional content | Always |
| Section: Practice | 🛠️ 🎮 ✏️ | Indicates hands-on activity | Always |
| Section: Content | Course-specific | Brand consistency | Always |
| Subsection: Warning | ⚠️ | Important notice | When needed |
| Subsection: Checkpoint | ✅ | Learning milestone | When needed |
| Subsection: Exploration | 🔍 | Discovery/analysis | When needed |
| Tool: AI | 🧠 | AI-related tools | Tool-specific |
| Tool: Security | 🛡️ | Security-related tools | Tool-specific |
| Tool: Data | 📊 | Data-related tools | Tool-specific |
| Tool: Architecture | 🏗️ | Architecture-related tools | Tool-specific |
| Tool: Digitalisation | 🌐 | Digitalisation-related tools | Tool-specific |

**Accessibility Requirements:**
- All emojis must have `aria-label` attributes
- Screen reader text: "Section: [description]" not just emoji
- Fallback: Text-only version available
- Size: Consistent, not too large (1.2em max)

**Emoji Palette (Course-Specific):**
- 🧠 AI/Intelligence
- 🛡️ Security/Protection  
- 📊 Data/Analytics
- 🌐 Digitalisation/Network
- 🏗️ Architecture/Structure
- 📚 Learning/Education (universal)
- 🎯 Goals/Targets (universal)
- 🛠️ Tools/Practice (universal)
- ⚠️ Warnings/Important (universal)
- ✅ Checkpoints/Success (universal)
- 💡 Insights/Tips (universal)
- 🔍 Exploration/Discovery (universal)

### British English Standards

**Automated Verification Rules:**
```javascript
const BRITISH_ENGLISH_RULES = {
  spelling: {
    'organize': 'organise',
    'color': 'colour',
    'center': 'centre',
    'analyze': 'analyse',
    'optimize': 'optimise',
    'behavior': 'behaviour',
    'defense': 'defence',
    'license': 'licence', // verb only
    'recognize': 'recognise',
    'realize': 'realise',
  },
  punctuation: {
    removeEmDash: true, // — → , or .
    removeEnDash: false, // - is OK in ranges
  },
  style: {
    noGeneratedFeel: true, // Flag patterns like "In this article we will..."
    preferActiveVoice: true,
    shortSentences: true,
  }
};
```

**Manual Review Checklist:**
- [ ] All -ize → -ise conversions verified
- [ ] All -or → -our conversions verified
- [ ] All -er → -re conversions verified (center → centre)
- [ ] Em-dashes (—) removed and replaced appropriately
- [ ] No "generated feel" language patterns
- [ ] Punctuation style consistent (British conventions)
- [ ] Quotation marks: single for quotes, double for quotes within quotes

---

## Part 3: Work Packages for Implementation

### Work Package 1: Foundation Components (WP1)
**Priority**: Critical - Blocks all other work  
**Estimated Time**: 2-3 days  
**Quality Checkpoint**: After completion, before proceeding

#### WP1.1: Enhanced Typography Components
**Files to Create/Modify:**
- `src/components/course/SectionHeader.tsx` (enhance)
- `src/components/course/SubsectionHeader.tsx` (enhance)
- `src/components/course/BodyText.tsx` (create)
- `src/styles/globals.css` (add typography scale)

**Deliverables:**
- [ ] `SectionHeader` with variants (guide, practice, content)
- [ ] `SubsectionHeader` with emoji support
- [ ] `BodyText` component for consistent body styling
- [ ] CSS typography scale variables
- [ ] Dark mode support for all typography
- [ ] Accessibility: ARIA labels, proper heading structure
- [ ] TypeScript types exported
- [ ] Component documentation (JSDoc)

**Acceptance Criteria:**
- All components pass TypeScript strict mode
- All components have accessibility attributes
- Dark mode tested and working
- Components match design specifications
- Documentation complete

#### WP1.2: Emoji Component System
**Files to Create:**
- `src/components/course/EmojiIcon.tsx` (create)
- `src/lib/course/emojiMap.ts` (create)
- `src/lib/course/emojiUtils.ts` (create)

**Deliverables:**
- [ ] `EmojiIcon` component with accessibility
- [ ] Course-specific emoji mapping
- [ ] Utility functions for emoji selection
- [ ] TypeScript types
- [ ] Documentation

**Acceptance Criteria:**
- All emojis have aria-labels
- Screen reader friendly
- Type-safe emoji selection
- Consistent sizing

#### WP1.3: British English Verification System
**Files to Create:**
- `scripts/verify-british-english.mjs` (create)
- `docs/style/british-english-guide.md` (create)

**Deliverables:**
- [ ] Automated script to check for American spellings
- [ ] Script to detect em-dashes
- [ ] Script to flag "generated feel" patterns
- [ ] British English style guide
- [ ] Integration with build process (optional)

**Acceptance Criteria:**
- Script runs without errors
- Detects all known American spellings
- Style guide comprehensive
- Can be run manually or in CI

**Quality Checkpoint**: Review WP1 deliverables before proceeding to WP2.

---

### Work Package 2: Overview Pages Standardisation (WP2)
**Priority**: High - Visible to all users  
**Estimated Time**: 3-4 days  
**Dependencies**: WP1 complete  
**Quality Checkpoint**: After each course overview

#### WP2.1: AI Overview Page Enhancement
**Files to Modify:**
- `content/notes/ai/overview.mdx`
- `src/pages/ai/index.js`

**Tasks:**
1. Convert custom hero div to `CourseHeroSection`
2. Replace all `##` with `SectionHeader` components
3. Add emojis to section headers (purposeful selection)
4. Transform "Plan a tiny AI habit" to interactive tool (see WP4.1)
5. Verify British English
6. Test accessibility
7. Test dark mode

**Deliverables:**
- [ ] Hero section uses `CourseHeroSection`
- [ ] All section headers use `SectionHeader` with appropriate variants
- [ ] Emojis added to headers (with aria-labels)
- [ ] Interactive habit planner tool implemented
- [ ] British English verified (script + manual)
- [ ] Accessibility tested (keyboard, screen reader)
- [ ] Dark mode tested
- [ ] Visual consistency verified

**Acceptance Criteria:**
- Page matches premium design vision
- All typography consistent
- Interactive tool functional
- No accessibility issues
- British English compliant

#### WP2.2: Cybersecurity Overview Page Enhancement
**Files to Modify:**
- `content/notes/cybersecurity/overview.mdx`
- `src/pages/cybersecurity/index.js`

**Tasks:**
1. Standardise header usage (convert to components)
2. Add emojis where appropriate
3. Verify British English
4. Check for static tools and enhance if found
5. Test accessibility and dark mode

**Deliverables:**
- [ ] Headers standardised
- [ ] Emojis integrated
- [ ] British English verified
- [ ] Static tools identified and enhanced
- [ ] Accessibility tested
- [ ] Dark mode tested

**Acceptance Criteria:**
- Consistent with AI overview (same components)
- Premium feel achieved
- No regressions

#### WP2.3: Data Overview Page Enhancement
**Files to Modify:**
- `src/pages/data/index.js`

**Tasks:**
1. Add emojis to existing `SectionHeader` components
2. Verify British English
3. Check for static tools
4. Ensure consistency with other overview pages

**Deliverables:**
- [ ] Emojis added to headers
- [ ] British English verified
- [ ] Static tools enhanced if found
- [ ] Consistency verified

#### WP2.4: Digitalisation Overview Page Enhancement
**Files to Modify:**
- `src/pages/digitalisation/index.js`

**Tasks:**
1. Add emojis to existing `SectionHeader` components
2. Verify British English
3. Check for static tools
4. Ensure consistency

**Deliverables:**
- [ ] Emojis added
- [ ] British English verified
- [ ] Static tools enhanced
- [ ] Consistency verified

#### WP2.5: Software Architecture Overview Page Enhancement
**Files to Modify:**
- `src/pages/software-architecture/index.js`

**Tasks:**
1. Add emojis to existing `SectionHeader` components
2. Verify British English
3. Check for static tools
4. Ensure consistency

**Deliverables:**
- [ ] Emojis added
- [ ] British English verified
- [ ] Static tools enhanced
- [ ] Consistency verified

**Quality Checkpoint**: Review all 5 overview pages together for consistency before proceeding.

---

### Work Package 3: Level Pages Enhancement (WP3)
**Priority**: High - Core learning content  
**Estimated Time**: 8-10 days (1.5-2 days per course)  
**Dependencies**: WP1, WP2 complete  
**Quality Checkpoint**: After each course (5 pages)

**Approach**: Complete one course fully (all 4 level pages) before moving to next course. This ensures consistency within each course.

#### WP3.1: AI Level Pages (Beginner, Intermediate, Advanced, Summary)
**Files to Modify:**
- `content/notes/ai/beginner.mdx`
- `content/notes/ai/intermediate.mdx`
- `content/notes/ai/advanced.mdx`
- `content/notes/ai/summary.mdx`
- `src/pages/ai/beginner.js`
- `src/pages/ai/intermediate.js`
- `src/pages/ai/advanced.js`
- `src/pages/ai/summary.js`

**Tasks (per page):**
1. Replace `##` with `SectionHeader` component
2. Replace `###` with `SubsectionHeader` component
3. Add emojis to headers (purposeful, not excessive)
4. Verify British English
5. Identify and enhance static tools
6. Test accessibility
7. Test dark mode

**Deliverables (per page):**
- [ ] All h2 use `SectionHeader`
- [ ] All h3 use `SubsectionHeader`
- [ ] Emojis added appropriately
- [ ] British English verified
- [ ] Static tools enhanced
- [ ] Accessibility tested
- [ ] Dark mode tested
- [ ] Visual consistency verified

**Acceptance Criteria:**
- All 4 pages consistent with each other
- Typography hierarchy clear
- Premium feel achieved
- No content changes (presentation only)
- Accessibility compliant

#### WP3.2: Cybersecurity Level Pages
**Files to Modify:**
- `content/notes/cybersecurity/beginner.mdx` (or `ch1.mdx`)
- `content/notes/cybersecurity/intermediate.mdx`
- `content/notes/cybersecurity/advanced.mdx`
- `content/notes/cybersecurity/summary.mdx` (if exists)
- Corresponding page files

**Tasks**: Same as WP3.1

**Deliverables**: Same as WP3.1

#### WP3.3: Data Level Pages
**Files to Modify:**
- Data level pages (TBD - need to identify exact files)
- Corresponding page files

**Tasks**: Same as WP3.1

**Deliverables**: Same as WP3.1

#### WP3.4: Digitalisation Level Pages
**Files to Modify:**
- `content/notes/digitalisation/beginner.mdx`
- `content/notes/digitalisation/intermediate.mdx`
- `content/notes/digitalisation/advanced.mdx`
- `content/notes/digitalisation/summary.mdx`
- Corresponding page files

**Tasks**: Same as WP3.1

**Deliverables**: Same as WP3.1

#### WP3.5: Software Architecture Level Pages
**Files to Modify:**
- `content/notes/software-architecture/beginner.mdx`
- `content/notes/software-architecture/intermediate.mdx`
- `content/notes/software-architecture/advanced.mdx`
- `content/notes/software-architecture/summary.mdx`
- Corresponding page files

**Tasks**: Same as WP3.1

**Deliverables**: Same as WP3.1

**Quality Checkpoint**: After each course (4 pages), review for consistency before proceeding to next course.

---

### Work Package 4: Interactive Tool Development (WP4)
**Priority**: Medium-High - Enhances engagement  
**Estimated Time**: 5-7 days  
**Dependencies**: WP1 complete (can run parallel with WP2/WP3)  
**Quality Checkpoint**: After each tool

#### WP4.1: AI Habit Planner Tool
**Files to Create:**
- `src/components/notes/tools/ai/overview/AIHabitPlannerTool.tsx`
- `src/components/notes/tools/ai/overview/HabitLibrary.ts`
- `src/components/notes/tools/ai/overview/useHabitPlanner.ts`

**Features:**
- Habit selection from pre-defined library
- Custom habit creation
- Week-based planning
- Progress tracking with visualisations
- Streak counter
- localStorage persistence
- Export/share capabilities
- Accessibility: keyboard navigation, screen reader support

**Deliverables:**
- [ ] Full interactive tool implemented
- [ ] Habit library with course-specific habits
- [ ] Progress tracking functional
- [ ] localStorage persistence working
- [ ] Animations smooth (Framer Motion)
- [ ] Accessibility tested
- [ ] Dark mode tested
- [ ] Documentation

**Acceptance Criteria:**
- Tool is engaging and functional
- All features work as specified
- Accessibility compliant
- Performance acceptable
- Code quality high

#### WP4.2: Static Tools Audit & Enhancement
**Tasks:**
1. Audit all MDX files for static `ToolCard` instances
2. Categorise by type and priority
3. Develop interactive alternatives for high-priority tools
4. Document tool patterns for future development

**Deliverables:**
- [ ] Complete inventory of static tools
- [ ] Priority list
- [ ] Interactive tool implementations (as prioritised)
- [ ] Tool development pattern documentation

**Acceptance Criteria:**
- All high-priority static tools enhanced
- Tool patterns documented
- Code reusable

---

### Work Package 5: Polish & Quality Assurance (WP5)
**Priority**: High - Ensures quality  
**Estimated Time**: 2-3 days  
**Dependencies**: WP1, WP2, WP3, WP4 complete

#### WP5.1: Accessibility Audit
**Tasks:**
1. Keyboard navigation testing (all pages)
2. Screen reader testing (sample pages)
3. Colour contrast verification (WCAG AA)
4. Focus indicator checks
5. ARIA label verification

**Deliverables:**
- [ ] Accessibility audit report
- [ ] Fixes applied
- [ ] Re-testing completed

#### WP5.2: Visual Consistency Check
**Tasks:**
1. Spacing consistency verification
2. Colour palette alignment
3. Typography scale verification
4. Dark mode testing (all pages)
5. Responsive design testing

**Deliverables:**
- [ ] Consistency report
- [ ] Fixes applied
- [ ] Visual polish complete

#### WP5.3: Performance Optimisation
**Tasks:**
1. Component lazy loading verification
2. Animation performance testing
3. Bundle size analysis
4. Lighthouse audit

**Deliverables:**
- [ ] Performance report
- [ ] Optimisations applied
- [ ] Performance targets met

#### WP5.4: Documentation
**Tasks:**
1. Update component documentation
2. Create style guide
3. Document emoji usage guidelines
4. British English style guide
5. Tool development patterns

**Deliverables:**
- [ ] Component documentation updated
- [ ] Style guide created
- [ ] Emoji guidelines documented
- [ ] British English guide complete
- [ ] Tool patterns documented

**Acceptance Criteria:**
- All documentation complete
- Style guide comprehensive
- Future developers can follow patterns

---

## Part 4: Quality Assurance & Regression Prevention

### Quality Checkpoints

**After Each Work Package:**
1. Visual review (premium feel achieved?)
2. Accessibility check (keyboard, screen reader)
3. Dark mode test
4. British English verification
5. No content changes (presentation only)
6. Performance acceptable
7. No regressions

**Before Proceeding to Next Package:**
- All acceptance criteria met
- Code reviewed
- Documentation updated
- Quality maintained

### Regression Prevention

**Automated Checks:**
- TypeScript strict mode
- ESLint compliance
- British English script
- Accessibility linting (if available)
- Build process validation

**Manual Checks:**
- Visual consistency
- Content integrity
- Accessibility (keyboard, screen reader)
- Dark mode
- Performance

### Stopping Criteria

**Stop Implementation If:**
1. Quality starting to degrade
2. Approaching cognitive overload
3. Making repeated mistakes
4. Missing acceptance criteria
5. Performance regressing
6. Accessibility issues introduced

**When Stopping:**
- Report exactly what's completed
- Report what remains
- Document any blockers
- Provide status update
- Wait for review before continuing

---

## Part 5: Implementation Timeline

### Recommended Sequence

**Week 1: Foundation**
- WP1.1: Typography Components (Day 1-2)
- WP1.2: Emoji System (Day 2-3)
- WP1.3: British English Verification (Day 3)
- **Quality Checkpoint**: Review WP1

**Week 2: Overview Pages**
- WP2.1: AI Overview (Day 1)
- WP2.2: Cybersecurity Overview (Day 1-2)
- WP2.3: Data Overview (Day 2)
- WP2.4: Digitalisation Overview (Day 2-3)
- WP2.5: Software Architecture Overview (Day 3)
- **Quality Checkpoint**: Review all overview pages

**Week 3-4: Level Pages (Course by Course)**
- WP3.1: AI Levels (Days 1-2)
- **Quality Checkpoint**: Review AI course
- WP3.2: Cybersecurity Levels (Days 3-4)
- **Quality Checkpoint**: Review Cybersecurity course
- WP3.3: Data Levels (Days 5-6)
- **Quality Checkpoint**: Review Data course
- WP3.4: Digitalisation Levels (Days 7-8)
- **Quality Checkpoint**: Review Digitalisation course
- WP3.5: Software Architecture Levels (Days 9-10)
- **Quality Checkpoint**: Review Software Architecture course

**Week 5: Interactive Tools & Polish**
- WP4.1: AI Habit Planner (Days 1-2)
- WP4.2: Static Tools Audit & Enhancement (Days 2-4)
- WP5: Polish & QA (Days 4-5)

**Total Estimated Time**: 20-25 days (4-5 weeks)

---

## Part 6: Success Metrics

### Visual Quality
- [ ] Consistent typography across all 25 pages
- [ ] Clear hierarchy (h1 > h2 > h3 > body) visually distinct
- [ ] Premium feel achieved (refined, polished, professional)
- [ ] Emojis enhance without cluttering
- [ ] Dark mode consistent and polished

### Content Quality
- [ ] 100% British English verified (automated + manual)
- [ ] No em-dashes in content
- [ ] No "generated feel" language
- [ ] Content unchanged (only presentation enhanced)
- [ ] Punctuation style consistent

### Interactivity
- [ ] All high-priority static tools transformed
- [ ] Interactive tools are engaging and functional
- [ ] Tools persist state appropriately
- [ ] Tools are accessible (keyboard, screen reader)
- [ ] Tools perform well (smooth animations)

### Consistency
- [ ] All 5 overview pages use same components
- [ ] All 20 level pages use same typography
- [ ] Spacing and colours consistent
- [ ] Component usage patterns consistent
- [ ] Dark mode works correctly everywhere

### Accessibility
- [ ] WCAG AA compliance verified
- [ ] Keyboard navigation works everywhere
- [ ] Screen reader tested and working
- [ ] Colour contrast meets standards
- [ ] Focus indicators visible
- [ ] ARIA labels present and accurate

### Scalability
- [ ] New courses can use same patterns
- [ ] Components are well-documented
- [ ] Style guide is comprehensive
- [ ] Patterns are reusable
- [ ] British English verification automated

### Performance
- [ ] Bundle size acceptable
- [ ] Lazy loading working
- [ ] Animations smooth (60fps)
- [ ] Lighthouse score maintained/improved
- [ ] No performance regressions

---

## Part 7: Risk Mitigation

### Content Integrity
**Risk**: Accidental content changes  
**Mitigation**: 
- Separate content from presentation (components don't modify content)
- Review all changes before deployment
- Use version control to track content changes
- Automated checks for content modifications

### Performance
**Risk**: Too many animations or heavy components  
**Mitigation**:
- Lazy load interactive tools
- Use `prefers-reduced-motion`
- Performance testing at each checkpoint
- Bundle size monitoring

### Accessibility
**Risk**: Emojis or animations break accessibility  
**Mitigation**:
- Always provide aria-labels for emojis
- Test with screen readers at each checkpoint
- Ensure keyboard navigation works
- Verify focus indicators

### Consistency
**Risk**: Inconsistent application across pages  
**Mitigation**:
- Systematic approach (one course at a time)
- Component-based solution (enforces consistency)
- Regular review checkpoints
- Style guide documentation

### Quality Degradation
**Risk**: Approaching regression state  
**Mitigation**:
- Quality checkpoints after each work package
- Stop if quality degrading
- Report status clearly
- Review before continuing

---

## Part 8: Documentation Requirements

### Component Documentation
- JSDoc comments for all components
- Props documentation
- Usage examples
- Accessibility notes
- Dark mode support notes

### Style Guide
- Typography scale
- Colour palette
- Spacing system
- Component usage patterns
- Emoji usage guidelines
- British English conventions

### Developer Guide
- How to add new courses
- How to use typography components
- How to add interactive tools
- British English verification process
- Quality checklist

---

## Part 9: Next Steps

1. **Review and Approve Enhanced Strategy**
   - Review this enhanced document
   - Confirm approach and priorities
   - Adjust if needed

2. **Begin WP1: Foundation Components**
   - Start with typography components
   - Create emoji system
   - Set up British English verification

3. **Iterative Implementation with Quality Checkpoints**
   - Complete one work package at a time
   - Quality checkpoint after each
   - Stop if quality degrading
   - Review before proceeding

---

## Appendix: File Inventory

### Overview Pages (5)
- `content/notes/ai/overview.mdx`
- `content/notes/cybersecurity/overview.mdx`
- `src/pages/data/index.js`
- `src/pages/digitalisation/index.js`
- `src/pages/software-architecture/index.js`

### Level Pages (20)
- AI: beginner, intermediate, advanced, summary (4)
- Cybersecurity: beginner, intermediate, advanced, summary (4)
- Data: foundations, intermediate, advanced, summary (4)
- Digitalisation: beginner, intermediate, advanced, summary (4)
- Software Architecture: beginner, intermediate, advanced, summary (4)

### Components to Enhance
- `src/components/course/SectionHeader.tsx`
- `src/components/course/SubsectionHeader.tsx`
- `src/components/notes/ToolCard.jsx`

### Components to Create
- `src/components/course/EmojiIcon.tsx`
- `src/components/course/BodyText.tsx`
- `src/components/notes/tools/ai/overview/AIHabitPlannerTool.tsx`
- (Other interactive tools as identified)

### Scripts to Create
- `scripts/verify-british-english.mjs`

### Documentation to Create
- `docs/style/british-english-guide.md`
- `docs/style/typography-guide.md`
- `docs/style/emoji-usage-guide.md`
- `docs/development/tool-patterns.md`

### Styles to Update
- `src/styles/globals.css` (typography scale, emoji styling)

---

**End of Enhanced Strategy Document**

**Version**: 2.0  
**Last Updated**: [Current Date]  
**Status**: Ready for Implementation
