# Code Review Checklist

Use this checklist for all code reviews to ensure consistency and prevent regressions.

## Pre-Review

- [ ] Code compiles (`npm run build`)
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] PR description explains changes

## Credit System (MANDATORY)

### Server-Side (API Routes)

- [ ] Uses `enforceCreditGate` before operation
- [ ] Returns `creditGateErrorResponse` on failure
- [ ] Deducts actual credits (not estimates) after success
- [ ] Uses `deductCredits` utility
- [ ] Handles insufficient credits gracefully
- [ ] Includes `toolId` in credit deduction
- [ ] Includes `estimatedCredits` for tracking

### Client-Side (Components)

- [ ] Shows credit estimate with "ESTIMATE" badge
- [ ] Includes disclaimer: "may be higher or lower"
- [ ] Uses `CreditConsent` component
- [ ] Requires explicit user acceptance
- [ ] Disables action until accepted
- [ ] Shows current credit balance
- [ ] Handles insufficient credits UI
- [ ] Fetches balance from `/api/credits/status`

### Estimate Disclaimers

- [ ] "ESTIMATE" badge visible
- [ ] Disclaimer text present
- [ ] Current balance displayed
- [ ] Safety buffer (1.25x) mentioned or applied

## Business Logic

### Credit System

- [ ] Credit expiry checked (if applicable)
- [ ] Free tier respected
- [ ] Safety buffer applied (1.25x)
- [ ] Actual cost tracked separately from estimate

### Data Consistency

- [ ] Uses correct localStorage keys
- [ ] Course slugs match standard format
- [ ] Resource mapping correct
- [ ] Progress tracking uses correct structure

### Authentication

- [ ] Checks `getServerSession(authOptions)` for API routes
- [ ] Returns 401 for unauthenticated users
- [ ] Client components check session state

## Code Quality

### TypeScript

- [ ] All functions have types
- [ ] No `any` types (unless necessary with comment)
- [ ] Interfaces defined for object shapes
- [ ] Types exported if used elsewhere
- [ ] Proper null/undefined handling

### React Patterns

- [ ] Uses `"use client"` for client components
- [ ] `useMemo` for expensive computations
- [ ] `useEffect` dependencies correct
- [ ] Custom hooks extracted for reuse
- [ ] No unnecessary re-renders

### Error Handling

- [ ] Try-catch blocks where needed
- [ ] Error messages are clear
- [ ] User-friendly error UI
- [ ] Logs errors appropriately
- [ ] Handles edge cases

### Code Organization

- [ ] Files in correct directories
- [ ] Imports organized
- [ ] No circular dependencies
- [ ] Reusable code extracted
- [ ] Comments for complex logic

## Accessibility

### ARIA & Semantics

- [ ] ARIA labels on interactive elements
- [ ] Semantic HTML (`<article>`, `<section>`, etc.)
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] `aria-live` for dynamic content
- [ ] `aria-hidden` for decorative elements

### Keyboard Navigation

- [ ] All features work with keyboard only
- [ ] Tab order is logical
- [ ] Focus indicators visible
- [ ] Escape key closes modals
- [ ] Enter/Space activate buttons

### Visual Accessibility

- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] No color-only information
- [ ] Focus indicators visible
- [ ] Text readable at all sizes
- [ ] Respects `prefers-reduced-motion`

## Performance

- [ ] No unnecessary API calls
- [ ] Efficient data structures
- [ ] Code splitting where appropriate
- [ ] Images optimized
- [ ] No memory leaks
- [ ] Debouncing/throttling where needed

## Security

- [ ] Input validation
- [ ] Output sanitization
- [ ] Rate limiting (if applicable)
- [ ] Authentication checks
- [ ] Authorization checks
- [ ] No sensitive data in logs
- [ ] CSRF protection (if applicable)

## Testing

- [ ] Manual testing completed
- [ ] Edge cases tested
- [ ] Error scenarios tested
- [ ] Credit flow tested
- [ ] Accessibility tested
- [ ] Mobile responsive
- [ ] Cross-browser tested

## Documentation

- [ ] Code comments for complex logic
- [ ] README updated (if needed)
- [ ] API docs updated (if needed)
- [ ] This checklist completed

## Specific Feature Checks

### New API Routes

- [ ] Authentication required
- [ ] Credit gate enforced
- [ ] Rate limiting applied
- [ ] Input validation
- [ ] Error handling
- [ ] Proper HTTP status codes

### New Components

- [ ] Accessible
- [ ] Responsive
- [ ] Error states handled
- [ ] Loading states handled
- [ ] TypeScript types
- [ ] Reusable where possible

### New Features

- [ ] Follows existing patterns
- [ ] Credit system integrated (if applicable)
- [ ] Accessibility requirements met
- [ ] Performance considered
- [ ] Security considered

## Regression Prevention

- [ ] No breaking changes to existing APIs
- [ ] Existing features still work
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Build succeeds
- [ ] Existing tests pass (if applicable)

## Approval Criteria

Code should be approved if:

1. ✅ All mandatory checks pass
2. ✅ Credit system properly integrated (if applicable)
3. ✅ Accessibility requirements met
4. ✅ Code quality standards met
5. ✅ Testing completed
6. ✅ No regressions introduced

## Common Issues to Watch For

- ❌ Missing credit gates on new API routes
- ❌ Missing "ESTIMATE" disclaimers
- ❌ Not requiring user acceptance
- ❌ Missing ARIA labels
- ❌ Poor keyboard navigation
- ❌ TypeScript `any` types
- ❌ Missing error handling
- ❌ Breaking existing functionality

---

**Use this checklist for every code review to maintain consistency and prevent regressions.**

