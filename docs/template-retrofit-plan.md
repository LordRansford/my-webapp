# Template Retrofit Plan (Courses, Studios, Labs)

This plan aligns existing pages to the new template inventory without inventing new UX.

## Course pages → Course*Template
- Scope: `src/pages/ai`, `src/pages/data`, `src/pages/digitalisation`, `src/pages/software-architecture`, `src/pages/cybersecurity`, and `src/pages/courses`.
- Approach:
  - Wrap overview pages with `CourseOverviewTemplate` and pass breadcrumbs, course progress, sidebar, and footer nav.
  - Wrap lesson pages with `CourseLessonTemplate` and reuse existing `NotesLayout` content inside the template body.
  - Wrap quizzes/CPD pages with `CourseAssessmentTemplate`.
  - Generate breadcrumbs per course: Home › Course › Section.
  - Keep ProgressBar/sidebars strictly inside these templates.
- Guardrails:
  - No labs or studios linked inside lessons.
  - No Course UI outside these directories.

## Studios/Labs → Studio*Template
- Scope: `src/app/studios`, `src/pages/*-studios`, `src/app/tools`, `src/pages/tools.js`, tool detail pages.
- Approach:
  - Apply `StudioLandingTemplate` to landing/overview pages.
  - Apply `StudioToolTemplate` to individual tool pages; include mandatory backHref and breadcrumbs.
  - Apply `StudioResultsTemplate` to result/summary pages.
  - Ensure no course progress/sidebars render inside studios/labs.
- Guardrails:
  - Back button always present.
  - Clear entry/exit paths (breadcrumbs + backHref).

## Games
- Already mapped: hub → `GameHubTemplate`, canvas → `GameCanvasTemplate`. Add `GameLoadingTemplate` when a loading route exists.

## Static/Marketing
- All static info and marketing pages must use `MarketingPageTemplate` or `StaticInfoTemplate` (enforced via tests).

## CI follow-ups
- Extend `test:contracts` to assert Course*Template presence in course directories and Studio*Template presence in studio/tool routes once migrations land.
- Keep non-course UI guard to prevent progress/sidebars from leaking.
