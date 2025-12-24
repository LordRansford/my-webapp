# Component Inventory (Figma-Ready Contracts)
Single source of truth. New UI must use these or be added here + reviewed by contract tests.

## Shell
- AppShell
- HeaderNav (active states, breadcrumb slot)
- FooterNav (consistent links)
- PageContainer (max width, padding, background tokens)
- Navigation
- Breadcrumbs (mandatory on every page)

## Navigation / Tabs
- SectionTabs (studio sections)
- SideNavCourse (ONLY `/courses/**`)
- SideNavStudio (ONLY `/studios/**` if needed)

## Cards
- FeatureCard
- ToolCard
- CourseCard
- GameCard

## Feedback & Help
- MentorChatWidget
- FeedbackChatWidget
- InlineHint (word visible + tooltip, never tooltip-only)
- GlossaryTerm (word visible + hover card)

## Data Display
- CleanTable (no misaligned checkboxes)
- StatusPill
- MetricTile

## Forms
- TextInput
- FileInput
- Select
- Toggle
- CheckboxRightLabel (label left, checkbox right)

## Templates
- StudioLandingTemplate
- StudioToolTemplate
- StudioResultsTemplate
- CourseOverviewTemplate
- CourseLessonTemplate
- CourseAssessmentTemplate

## System States
- Loading
- Empty
- ErrorPanel (taxonomy codes)
- SuccessPanel

## Rules (apply to all)
- Icons may supplement, never replace text.
- No fixed heights; responsive, auto-fit.
- No inline colours; use tokens.
- Accessible focus states; keyboard navigable.

