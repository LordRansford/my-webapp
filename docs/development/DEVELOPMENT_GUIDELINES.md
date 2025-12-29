# Development Guidelines

This document ensures consistency, prevents regressions, and maintains business logic across all future development work.

## Table of Contents

1. [Credit System Enforcement](#credit-system-enforcement)
2. [Business Logic Consistency](#business-logic-consistency)
3. [Code Patterns & Standards](#code-patterns--standards)
4. [Accessibility Requirements](#accessibility-requirements)
5. [Testing Requirements](#testing-requirements)
6. [Code Review Checklist](#code-review-checklist)
7. [Pre-Commit Checklist](#pre-commit-checklist)

---

## Credit System Enforcement

### Mandatory Requirements

**ALL server-side operations MUST:**

1. ✅ Use `enforceCreditGate` before execution
2. ✅ Show credit estimates with "ESTIMATE" disclaimer
3. ✅ Require explicit user acceptance via `CreditConsent`
4. ✅ Apply 25% safety buffer (1.25x estimate)
5. ✅ Deduct actual credits (not estimates) after operation
6. ✅ Handle insufficient credits gracefully

### Quick Reference

```typescript
// ✅ CORRECT: API Route Pattern
import { enforceCreditGate, creditGateErrorResponse } from "@/lib/credits/enforceCreditGate";
import { deductCredits } from "@/lib/credits/deductCredits";

export async function POST(req: Request) {
  const ESTIMATED_CREDITS = 5; // Define estimate
  
  const gateResult = await enforceCreditGate(ESTIMATED_CREDITS);
  if (!gateResult.ok) {
    return creditGateErrorResponse(gateResult);
  }
  
  // Perform operation
  const result = await performOperation();
  
  // Deduct actual credits
  await deductCredits({
    userId: gateResult.userId,
    credits: actualCreditsUsed,
    toolId: "my-tool",
    estimatedCredits: ESTIMATED_CREDITS,
  });
  
  return NextResponse.json(result);
}
```

```tsx
// ✅ CORRECT: Client Component Pattern
import CreditConsent, { useCreditConsent } from "@/components/credits/CreditConsent";

function MyComponent() {
  const [balance, setBalance] = useState<number | null>(null);
  const ESTIMATED_CREDITS = 5;
  const { canProceed } = useCreditConsent(ESTIMATED_CREDITS, balance);
  
  return (
    <>
      <CreditConsent
        estimatedCredits={ESTIMATED_CREDITS}
        currentBalance={balance}
        onAccept={() => {}}
      />
      <button disabled={!canProceed}>Execute</button>
    </>
  );
}
```

### ❌ Common Mistakes to Avoid

- ❌ Forgetting to add credit gate to new API routes
- ❌ Using estimates without "ESTIMATE" disclaimer
- ❌ Not requiring user acceptance
- ❌ Deducting estimated credits instead of actual
- ❌ Missing safety buffer check
- ❌ Not handling insufficient credits

**See:** `docs/development/credit-enforcement.md` for detailed patterns.

---

## Business Logic Consistency

### Core Principles

1. **Credit Expiry**: Credits expire after 12 months. Always check expiry.
2. **Free Tier**: First 1000ms/day is free. Respect free tier limits.
3. **Safety Buffer**: Always check `estimatedCredits * 1.25` for sufficient balance.
4. **User Consent**: Explicit acceptance required for all paid operations.
5. **Estimate Disclaimers**: All estimates must state "may be higher or lower".

### Data Consistency

- **CPD Tracking**: Uses `localStorage` key `ransfordsnotes-cpd`
- **Favorites**: Uses `localStorage` key `ransfordsnotes-course-favorites`
- **Credit Balance**: Fetched from `/api/credits/status`
- **User Session**: Always check `getServerSession(authOptions)` for API routes

### Course Structure

- Course slugs: `cybersecurity`, `ai`, `software-architecture`, `data`, `digitalisation`
- Level structure: `foundations`, `intermediate`, `advanced`, `summary`
- Resource mapping: Tools, templates, studios map to course slugs

---

## Code Patterns & Standards

### File Organization

```
src/
├── app/              # Next.js App Router pages
├── pages/            # Next.js Pages Router pages
├── components/       # React components
│   ├── credits/     # Credit-related components
│   ├── courses/     # Course-related components
│   └── ...
├── lib/              # Utility functions
│   ├── credits/      # Credit system utilities
│   ├── courses/     # Course utilities
│   └── ...
└── docs/             # Documentation
```

### Naming Conventions

- **Components**: PascalCase (`CreditConsent.tsx`)
- **Utilities**: camelCase (`enforceCreditGate.ts`)
- **Types**: PascalCase (`CreditGateResult`)
- **Constants**: UPPER_SNAKE_CASE (`ESTIMATED_CREDITS`)

### TypeScript Standards

- ✅ Always type function parameters and return types
- ✅ Use interfaces for object shapes
- ✅ Prefer `type` for unions and intersections
- ✅ Export types used across modules
- ✅ Use `as const` for literal types

### React Patterns

- ✅ Use `"use client"` for client components
- ✅ Use `useMemo` for expensive computations
- ✅ Use `useEffect` for side effects
- ✅ Extract custom hooks for reusable logic
- ✅ Use semantic HTML (`<article>`, `<section>`, etc.)

---

## Accessibility Requirements

### Mandatory Checks

1. ✅ **ARIA Labels**: All interactive elements have `aria-label`
2. ✅ **Keyboard Navigation**: All features work with keyboard only
3. ✅ **Screen Readers**: Semantic HTML and proper heading hierarchy
4. ✅ **Color Contrast**: WCAG AA minimum (4.5:1 for text)
5. ✅ **Focus Indicators**: Visible focus states on all interactive elements
6. ✅ **Reduced Motion**: Respect `prefers-reduced-motion`

### Quick Checklist

```tsx
// ✅ CORRECT: Accessible Component
<button
  type="button"
  onClick={handleClick}
  aria-label="Download certificate PDF"
  className="focus:outline-none focus:ring-2 focus:ring-slate-400"
>
  Download PDF
</button>

// ✅ CORRECT: Semantic HTML
<article aria-labelledby="course-title">
  <h2 id="course-title">Course Name</h2>
  <p>Description</p>
</article>
```

---

## Testing Requirements

### Before Committing

- ✅ Code compiles without errors (`npm run build`)
- ✅ No TypeScript errors
- ✅ No linting errors
- ✅ Manual testing of new features
- ✅ Credit flow tested (insufficient credits, sufficient credits)
- ✅ Accessibility tested (keyboard navigation, screen reader)

### Testing Checklist

- [ ] New API routes handle authentication
- [ ] Credit gates work correctly
- [ ] Error messages are clear
- [ ] UI components are accessible
- [ ] Mobile responsive
- [ ] Works in different browsers
- [ ] No console errors

---

## Code Review Checklist

### Credit System

- [ ] All server-side operations use `enforceCreditGate`
- [ ] Credit estimates show "ESTIMATE" disclaimer
- [ ] User acceptance required before execution
- [ ] Safety buffer (1.25x) applied
- [ ] Actual credits deducted (not estimates)
- [ ] Insufficient credits handled gracefully

### Business Logic

- [ ] Credit expiry checked
- [ ] Free tier respected
- [ ] Data consistency maintained
- [ ] Course structure followed
- [ ] Resource mapping correct

### Code Quality

- [ ] TypeScript types defined
- [ ] No `any` types (unless necessary)
- [ ] Error handling implemented
- [ ] Code follows existing patterns
- [ ] Comments added for complex logic

### Accessibility

- [ ] ARIA labels present
- [ ] Keyboard navigation works
- [ ] Semantic HTML used
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible

### Performance

- [ ] `useMemo` for expensive computations
- [ ] `useEffect` dependencies correct
- [ ] No unnecessary re-renders
- [ ] Images optimized
- [ ] Code split appropriately

---

## Pre-Commit Checklist

Before committing code, verify:

1. ✅ `npm run build` succeeds
2. ✅ No TypeScript errors
3. ✅ No linting errors
4. ✅ Manual testing completed
5. ✅ Credit flow tested
6. ✅ Accessibility verified
7. ✅ Documentation updated (if needed)
8. ✅ Code review checklist completed

---

## Enforcement Mechanisms

### Automated Checks

1. **TypeScript**: Compile-time type checking
2. **ESLint**: Code quality and patterns
3. **Build**: Must compile successfully
4. **Pre-commit hooks**: (Optional) Run checks before commit

### Manual Checks

1. **Code Review**: Use checklist above
2. **Testing**: Manual testing of features
3. **Documentation**: Update docs when patterns change

### Future Enhancements

Consider adding:
- Pre-commit hooks (Husky)
- Automated tests (Jest/Vitest)
- E2E tests (Playwright)
- CI/CD checks (GitHub Actions)

---

## Quick Reference

### Credit System Files

- `src/lib/credits/enforceCreditGate.ts` - Server-side credit gate
- `src/lib/credits/deductCredits.ts` - Credit deduction
- `src/components/credits/CreditConsent.tsx` - Client-side consent UI
- `docs/development/credit-enforcement.md` - Detailed patterns

### Course System Files

- `src/lib/courses/resourceCounts.ts` - Resource counting
- `src/components/courses/CoursesList.client.tsx` - Course listing
- `src/components/course/CourseProgress.tsx` - Progress tracking

### Common Utilities

- `src/lib/auth/options.ts` - Authentication config
- `src/lib/db/prisma.ts` - Database client
- `src/lib/security/rateLimit.ts` - Rate limiting

---

## Questions?

If unsure about:
- **Credit requirements**: See `docs/development/credit-enforcement.md`
- **Code patterns**: Check existing similar code
- **Accessibility**: Test with keyboard and screen reader
- **Business logic**: Review this document and related docs

When in doubt, ask for review before implementing.

---

**Last Updated**: 2024-12-19
**Maintained By**: Development Team

