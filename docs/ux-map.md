# RansfordsNotes UX Map (Canonical)

## Global
- Header: always visible, active section highlight, search, account.
- Breadcrumbs: always visible, derived from the route registry.
- Footer: always visible.

## Sections & Ownership
- Home `/`
- Courses `/courses/**`
  - CourseSideNav + progress **only here**.
- Studios `/studios/**`
  - Never shows course progress.
  - Uses Studio templates only.
- Labs `/labs/**`
  - Never shows course progress.
- Games `/games/**`
  - Offline-capable; no course UI.
- Admin `/admin/**`
  - Protected; observability + feedback review.

## Forbidden
- Course UI outside `/courses/**`.
- Any page without header/footer/breadcrumbs.
- Tooltip-only words (word must always show).
- Checkbox-left labels (unless exception approved).
- Icons replacing visible text.

## Templates (must match route ownership)
- Marketing / General: `MarketingPageTemplate` or `StaticInfoTemplate`.
- Courses: `CourseOverviewTemplate`, `CourseLessonTemplate`, `CourseAssessmentTemplate`.
- Studios: `StudioLandingTemplate`, `StudioToolTemplate`, `StudioResultsTemplate`.
- Games: `GameHubTemplate`, `GameLoadingTemplate`, `GameCanvasTemplate`.

## Navigation Rules
- Breadcrumbs show “where I am” with parent links.
- Header + Footer present on every page (App Router + Pages Router).

## UX Quality Guardrails
- No progress bar outside courses.
- No sidebar outside courses.
- No black text on dark backgrounds; enforce contrast.
- Toolbars must not overlap content.
- Back navigation must exist for studios/labs.
- Every page must explain: what this is, why it matters, how to use it, limits, what can go wrong, how to fix errors.

## Offline & PWA
- Cache only static learning content and `/games/**`.
- Never cache `/api/**`, auth, or payments.
- Show offline banner and “what works offline” page.

