# Enforcement Patterns

This document defines TypeScript types and utilities to enforce consistent patterns across the codebase.

## Credit System Types

### CreditGateResult

```typescript
// src/lib/credits/enforceCreditGate.ts
export type CreditGateResult =
  | {
      ok: true;
      userId: string;
      balance: number;
      remainingAfter: number;
    }
  | {
      ok: false;
      status: number;
      message: string;
      requiredCredits?: number;
      currentBalance?: number;
    };
```

### CreditConsentProps

```typescript
// src/components/credits/CreditConsent.tsx
interface CreditConsentProps {
  estimatedCredits: number;
  currentBalance: number | null;
  safetyBuffer?: number;
  onAccept?: () => void;
  onDecline?: () => void;
  disabled?: boolean;
}
```

## Type Guards

### Credit Gate Result Type Guard

```typescript
// Utility to check if credit gate passed
export function isCreditGateOk(
  result: CreditGateResult
): result is Extract<CreditGateResult, { ok: true }> {
  return result.ok === true;
}
```

## Enforced Patterns

### API Route Pattern

All API routes that require credits MUST follow this pattern:

```typescript
import { enforceCreditGate, creditGateErrorResponse } from "@/lib/credits/enforceCreditGate";
import { deductCredits } from "@/lib/credits/deductCredits";

export async function POST(req: Request) {
  // 1. Authentication
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // 2. Define estimate
  const ESTIMATED_CREDITS = 5; // Your estimate

  // 3. Enforce credit gate
  const gateResult = await enforceCreditGate(ESTIMATED_CREDITS);
  if (!gateResult.ok) {
    return creditGateErrorResponse(gateResult);
  }

  // 4. Perform operation
  const result = await performOperation();

  // 5. Deduct actual credits
  await deductCredits({
    userId: gateResult.userId,
    credits: actualCreditsUsed,
    toolId: "my-tool",
    runId: runId,
    estimatedCredits: ESTIMATED_CREDITS,
    durationMs: durationMs,
    outputBytes: outputBytes,
  });

  return NextResponse.json(result);
}
```

### Client Component Pattern

All client components that trigger credit operations MUST follow this pattern:

```typescript
"use client";

import { useState, useEffect } from "react";
import CreditConsent, { useCreditConsent } from "@/components/credits/CreditConsent";

export default function MyComponent() {
  const [balance, setBalance] = useState<number | null>(null);
  const ESTIMATED_CREDITS = 5;

  useEffect(() => {
    fetch("/api/credits/status")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        setBalance(typeof d?.balance === "number" ? d.balance : 0);
      })
      .catch(() => setBalance(0));
  }, []);

  const { canProceed } = useCreditConsent(ESTIMATED_CREDITS, balance);

  const handleExecute = async () => {
    if (!canProceed) {
      alert("Please accept the credit estimate and ensure sufficient credits.");
      return;
    }

    const response = await fetch("/api/my-operation", {
      method: "POST",
      body: JSON.stringify({ /* ... */ }),
    });

    if (!response.ok) {
      const error = await response.json();
      alert(error.message);
      return;
    }

    // Success
  };

  return (
    <div>
      <CreditConsent
        estimatedCredits={ESTIMATED_CREDITS}
        currentBalance={balance}
        onAccept={() => {}}
      />
      <button onClick={handleExecute} disabled={!canProceed}>
        Execute
      </button>
    </div>
  );
}
```

## Constants

### Credit Estimates

Define estimates as constants at the top of files:

```typescript
// At top of file
const ESTIMATED_CREDITS = 5; // PDF generation
const ESTIMATED_CREDITS = 1; // DNS lookup
const ESTIMATED_CREDITS = 2; // Template download
```

### Safety Buffer

Always use the default safety buffer (1.25x):

```typescript
// Default is 1.25, don't override unless necessary
const gateResult = await enforceCreditGate(estimatedCredits);
```

## Validation Utilities

### Validate Credit Estimate

```typescript
export function validateCreditEstimate(estimate: number): boolean {
  return typeof estimate === "number" && estimate >= 0 && isFinite(estimate);
}
```

### Validate Credit Balance

```typescript
export function validateCreditBalance(balance: number | null): balance is number {
  return typeof balance === "number" && balance >= 0 && isFinite(balance);
}
```

## Error Messages

### Standardized Error Messages

```typescript
export const CREDIT_ERROR_MESSAGES = {
  UNAUTHORIZED: "Authentication required. Please sign in to use this feature.",
  INSUFFICIENT_CREDITS: (required: number, current: number) =>
    `Insufficient credits. This operation requires approximately ${required} credits, but you only have ${current} credits available.`,
  EXPIRED_CREDITS: "Your credits have expired. Please purchase more credits to continue.",
  ESTIMATE_REQUIRED: "Please accept the credit estimate and ensure sufficient credits.",
} as const;
```

## Testing Patterns

### Mock Credit Gate

```typescript
// For testing
export async function mockCreditGate(
  ok: boolean,
  userId?: string,
  balance?: number
): Promise<CreditGateResult> {
  if (ok && userId && balance !== undefined) {
    return {
      ok: true,
      userId,
      balance,
      remainingAfter: balance - 1,
    };
  }
  return {
    ok: false,
    status: 402,
    message: "Insufficient credits",
    requiredCredits: 5,
    currentBalance: balance || 0,
  };
}
```

## Future Enhancements

Consider adding:

1. **TypeScript ESLint Rules**: Enforce credit gate usage
2. **Pre-commit Hooks**: Check for credit gates in API routes
3. **Automated Tests**: Verify credit flow
4. **Code Generation**: Templates for new API routes

---

**These patterns ensure consistency and prevent regressions in the credit system.**

