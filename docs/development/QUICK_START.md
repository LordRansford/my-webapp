# Quick Start Guide for Developers

This guide helps you get started quickly while ensuring you follow all required patterns.

## Before You Start

1. Read [Development Guidelines](DEVELOPMENT_GUIDELINES.md)
2. Review [Code Review Checklist](CODE_REVIEW_CHECKLIST.md)
3. Understand [Credit Enforcement Patterns](credit-enforcement.md)

## Common Tasks

### Adding a New API Route That Requires Credits

1. **Create the route file**: `src/app/api/my-feature/route.ts`

2. **Add credit enforcement**:
```typescript
import { enforceCreditGate, creditGateErrorResponse } from "@/lib/credits/enforceCreditGate";
import { deductCredits } from "@/lib/credits/deductCredits";

export async function POST(req: Request) {
  const ESTIMATED_CREDITS = 5; // Your estimate
  
  const gateResult = await enforceCreditGate(ESTIMATED_CREDITS);
  if (!gateResult.ok) {
    return creditGateErrorResponse(gateResult);
  }
  
  // Your operation here
  const result = await performOperation();
  
  // Deduct actual credits
  await deductCredits({
    userId: gateResult.userId,
    credits: actualCreditsUsed,
    toolId: "my-feature",
    estimatedCredits: ESTIMATED_CREDITS,
  });
  
  return NextResponse.json(result);
}
```

3. **Test**: Run `npm run enforce:credit-patterns` to verify

### Adding a Client Component That Triggers Credit Operations

1. **Create the component**: `src/components/my-feature/MyComponent.tsx`

2. **Add credit consent**:
```tsx
"use client";

import { useState, useEffect } from "react";
import CreditConsent, { useCreditConsent } from "@/components/credits/CreditConsent";

export default function MyComponent() {
  const [balance, setBalance] = useState<number | null>(null);
  const ESTIMATED_CREDITS = 5;
  const { canProceed } = useCreditConsent(ESTIMATED_CREDITS, balance);
  
  useEffect(() => {
    fetch("/api/credits/status")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setBalance(d?.balance ?? 0))
      .catch(() => setBalance(0));
  }, []);
  
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

3. **Test**: Verify credit flow works correctly

### Adding a New Course Feature

1. **Follow course structure**: Use existing course components as reference
2. **Add resource counts**: Update `src/lib/courses/resourceCounts.ts` if needed
3. **Maintain consistency**: Follow existing patterns in `CoursesList.client.tsx`

## Pre-Commit Checklist

Before committing, ensure:

- [ ] `npm run build` succeeds
- [ ] `npm run enforce:credit-patterns` passes (warnings OK, errors must be fixed)
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Manual testing completed
- [ ] Credit flow tested (if applicable)
- [ ] Accessibility tested

## Getting Help

- **Credit System**: See [credit-enforcement.md](credit-enforcement.md)
- **Code Patterns**: See [ENFORCEMENT_PATTERNS.md](ENFORCEMENT_PATTERNS.md)
- **Review Process**: See [CODE_REVIEW_CHECKLIST.md](CODE_REVIEW_CHECKLIST.md)
- **General Guidelines**: See [DEVELOPMENT_GUIDELINES.md](DEVELOPMENT_GUIDELINES.md)

## Common Mistakes to Avoid

❌ **Don't**: Forget credit gates on new API routes
❌ **Don't**: Skip user acceptance for credit operations
❌ **Don't**: Use estimates without "ESTIMATE" disclaimer
❌ **Don't**: Forget ARIA labels on interactive elements
❌ **Don't**: Skip keyboard navigation testing

✅ **Do**: Always use `enforceCreditGate` for server-side operations
✅ **Do**: Always show `CreditConsent` for client-side operations
✅ **Do**: Always include "ESTIMATE" disclaimers
✅ **Do**: Always test accessibility
✅ **Do**: Always follow existing patterns

---

**Remember**: When in doubt, check existing code for patterns and ask for review!

