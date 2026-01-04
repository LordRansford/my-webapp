# Course page master template

## Purpose
This document is the source of truth for how course overview pages and course lesson pages should look and behave.
The goal is a consistent experience across courses with excellent accessibility, clean navigation, and clear outcomes.

## Non negotiables
1. Every page must load fast on mobile and feel stable while it loads.
2. Navigation must be obvious on the first screen.
3. Progress must be visible and understandable.
4. The page must be usable by keyboard only.
5. The page must work with screen readers and predictable focus order.
6. The page must not leak internal debug content to users.
7. The page must support read aloud for the main content.

## Page types
1. Overview page
2. Lesson page

## Overview page template
### Structure
1. Hero
2. Jump links
3. Progress and CPD summary cards
4. Core path cards
5. What you will build section
6. How to use section
7. Quick practice section

### Hero
The hero must include
1. Course name and short promise
2. A short description that explains who the course is for and what it changes
3. Primary action that starts the first level
4. Secondary actions that open CPD, evidence, dashboards, studios, and labs

### Jump links
Jump links must
1. Jump to the most important sections
2. Stay short and readable
3. Work on keyboard and on touch

### Progress and CPD summary cards
The overview page must show
1. Course progress across levels
2. CPD hours total and a short privacy note

### Core path cards
Core path cards must show
1. Level name and purpose
2. Estimated time
3. Progress percent for that level
4. One clear action to open the level

### What you will build
This section must show three things
1. The capstone artefact for each stage
2. Where it lives in the course
3. Why it matters in real work

### How to use
This section must be a short numbered list that explains
1. The recommended order
2. How to use labs
3. How to log CPD
4. How to revisit for deeper learning

### Quick practice
Quick practice must include
1. One small tool or drill
2. One short quiz block

## Lesson page template
### Structure
1. Action bar
2. Content
3. Page navigation

### Action bar
The action bar must include
1. Back to overview
2. Track CPD
3. Export CPD evidence
4. Dashboards link when relevant
5. Labs link when relevant
6. Studios link when relevant

### Content structure
Every module section must include
1. A module heading and progress toggle
2. Outcomes written as measurable verbs
3. Practice through a tool or an exercise
4. Verification which explains how we confirm the control works
5. Reflection prompt that produces evidence

### Accessibility
The lesson page must support
1. Read aloud controls for the page and for the active section
2. Search within the page and highlight matches
3. Clear focus states for all interactive controls

## Animation and motion rules
1. Motion must never block content or navigation.
2. Motion must be subtle and fast.
3. Hover motion must not cause layout jumps.
4. Prefer CSS transitions and transforms.
5. Avoid heavy runtime animation frameworks unless types and performance are proven.

## Implementation notes
1. Overview template is implemented in `src/components/course/CourseOverviewTemplate.tsx`.
2. Lesson template is implemented in `src/components/course/CourseLessonTemplate.tsx`.
3. Lesson action bar is implemented in `src/components/course/CourseLessonActionBar.tsx`.

