# Credit Enforcement Pattern

This document describes how to ensure credit enforcement across the website for all operations requiring server-side computation or external API calls.

## Policy

**All operations that require server-side computation or external API calls MUST:**
1. Show credit estimates with clear "ESTIMATE" disclaimers
2. Require explicit user acceptance before execution
3. Validate user has sufficient credits (with safety buffer)
4. Block execution if insufficient credits

## Key Principles

### Estimate Disclaimers
All credit estimates must clearly indicate:
- "ESTIMATE" label prominently displayed
- "Actual cost may be higher or lower than estimated"
- Current credit balance shown
- Explicit user acceptance required
- Block execution if insufficient credits

### Safety Buffer
Always check for `estimatedCredits * 1.25` (25% buffer) to account for actual cost variance. This protects users from surprise overspend due to runtime variations.

### User Acceptance Flow
1. User initiates operation requiring credits
2. System shows estimate with disclaimer
3. System shows current credit balance
4. User must explicitly accept (checkbox/button)
5. System validates sufficient credits (with safety buffer)
6. Operation proceeds only if accepted and sufficient credits

## Components

### CreditConsent Component

Use `src/components/credits/CreditConsent.tsx` for consistent credit consent UI:

```tsx
import CreditConsent from "@/components/credits/CreditConsent";

function MyComponent() {
  const [balance, setBalance] = useState<number | null>(null);
  const estimatedCredits = 10; // Your estimate

  return (
    <CreditConsent
      estimatedCredits={estimatedCredits}
      currentBalance={balance}
      onAccept={() => {
        // User accepted, proceed with operation
        executeOperation();
      }}
      onDecline={() => {
        // User declined, cancel operation
        cancelOperation();
      }}
    />
  );
}
```

### enforceCreditGate Utility

Use `src/lib/credits/enforceCreditGate.ts` for server-side credit validation:

```typescript
import { enforceCreditGate, creditGateErrorResponse } from "@/lib/credits/enforceCreditGate";

export async function POST(req: Request) {
  const estimatedCredits = 10; // Your estimate

  // Enforce credit gate
  const gateResult = await enforceCreditGate(estimatedCredits);
  
  if (!gateResult.ok) {
    return creditGateErrorResponse(gateResult);
  }

  // Proceed with operation
  // ... your code here ...
}
```

## UI Component Updates

### CreditEstimate Component
- Shows "ESTIMATE" badge
- Includes disclaimer: "This is an estimate. Actual cost may be higher or lower."

### ComputeEstimatePanel Component
- Shows "ESTIMATE" badge
- Includes disclaimer about cost variability

### CreditMeter Component
- Shows "ESTIMATE" badge for paid operations
- Includes disclaimer in estimate display

### ComputeMeter Component
- Shows "ESTIMATE" badge
- Includes disclaimer in estimate display

## API Route Pattern

For API routes that perform server-side computation:

```typescript
export async function POST(req: Request) {
  // 1. Get authenticated user
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // 2. Calculate or fetch estimated credits
  const estimatedCredits = calculateEstimate(req);

  // 3. Enforce credit gate
  const gateResult = await enforceCreditGate(estimatedCredits);
  if (!gateResult.ok) {
    return creditGateErrorResponse(gateResult);
  }

  // 4. Perform operation
  const result = await performOperation();

  // 5. Deduct actual credits (not estimated)
  await deductCredits({
    userId: gateResult.userId,
    credits: actualCreditsUsed,
  });

  return NextResponse.json({ result });
}
```

## Client-Side Pattern

For client-side components that trigger credit operations:

```tsx
function MyComponent() {
  const [estimatedCredits, setEstimatedCredits] = useState(0);
  const [balance, setBalance] = useState<number | null>(null);
  const { accepted, canProceed } = useCreditConsent(estimatedCredits, balance);

  const handleExecute = async () => {
    if (!canProceed) {
      alert("Please accept the credit estimate and ensure sufficient credits.");
      return;
    }

    // Execute operation
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
        estimatedCredits={estimatedCredits}
        currentBalance={balance}
        onAccept={() => setAccepted(true)}
      />
      <button onClick={handleExecute} disabled={!canProceed}>
        Execute
      </button>
    </div>
  );
}
```

## Operations That Require Credits

The following operations MUST use credit enforcement:

- **LLM/AI Operations**: Mentor queries, AI-generated content
- **PDF Generation**: Certificate PDFs, architecture diagram exports
- **External API Calls**: DNS lookups, WHOIS queries, IP reputation checks, TLS inspection
- **Compute Operations**: Server-side tool execution
- **Template Downloads**: Template exports (if server-side processing)
- **Workspace Exports**: Project exports with server-side processing
- **Any future server-side computation**

## Operations That DON'T Require Credits

The following operations are free (browser-only):

- **Local Tool Execution**: Tools that run entirely in the browser
- **Static Content**: Reading content, viewing pages
- **Authentication**: Sign in, sign up
- **Account Management**: Viewing account, updating preferences
- **Free Tier Operations**: Operations that stay within free tier limits

## Testing Checklist

When implementing credit enforcement, verify:

- [ ] Estimate shows clear "ESTIMATE" disclaimer
- [ ] Disclaimer states "may be higher or lower"
- [ ] Current credit balance is displayed
- [ ] User acceptance is required before execution
- [ ] Operation is blocked if insufficient credits
- [ ] Error messages are clear and helpful
- [ ] Works correctly for authenticated users
- [ ] Works correctly for anonymous users (should require sign-in)
- [ ] Free tier operations remain free
- [ ] Safety buffer is applied (1.25x estimate)
- [ ] Actual credits deducted match actual usage, not estimate

## Examples

### Example 1: Certificate PDF Generation

```typescript
// API Route: /api/certificates/[certificateId]/pdf
export async function GET(req: Request, { params }: { params: { certificateId: string } }) {
  const estimatedCredits = 5; // Fixed cost for PDF generation
  
  const gateResult = await enforceCreditGate(estimatedCredits);
  if (!gateResult.ok) {
    return creditGateErrorResponse(gateResult);
  }

  // Generate PDF
  const pdf = await generatePDF(params.certificateId);

  // Deduct actual credits (might be different from estimate)
  await deductCredits({
    userId: gateResult.userId,
    credits: actualCreditsUsed,
  });

  return new NextResponse(pdf, { headers: { "Content-Type": "application/pdf" } });
}
```

### Example 2: External API Tool

```typescript
// API Route: /api/tools/dns-lookup
export async function POST(req: Request) {
  const body = await req.json();
  const estimatedCredits = estimateDNSCost(body.target);

  const gateResult = await enforceCreditGate(estimatedCredits);
  if (!gateResult.ok) {
    return creditGateErrorResponse(gateResult);
  }

  // Call external DNS API
  const result = await lookupDNS(body.target);

  // Deduct actual credits
  await deductCredits({
    userId: gateResult.userId,
    credits: calculateActualCost(result),
  });

  return NextResponse.json(result);
}
```

## Future Additions

When adding new features that require server-side computation:

1. Calculate or define credit cost
2. Add credit estimate to UI
3. Use CreditConsent component
4. Use enforceCreditGate in API route
5. Deduct actual credits after operation
6. Update this documentation if pattern changes

## Questions?

If you're unsure whether an operation requires credits:
- **Does it run on the server?** → Yes, requires credits
- **Does it call external APIs?** → Yes, requires credits
- **Does it use significant compute resources?** → Yes, requires credits
- **Does it run entirely in the browser?** → No credits required

When in doubt, err on the side of requiring credits and clearly communicating costs to users.

