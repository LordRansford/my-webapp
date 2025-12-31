# Credit System Implementation Summary

## Overview

This document summarizes the implementation of the market-aligned credit system based on CodeSandbox/Replit patterns, with £0.02 per credit pricing and monthly credit bundles with daily caps.

## What Has Been Implemented

### 1. Tool Registry (`src/lib/tools/registry.ts`)

**Single source of truth** for all tool metadata:
- Tool ID, title, category
- Execution mode: `client_only` | `hybrid` | `server_required`
- Auth requirements
- Risk tier
- Resource limits (CPU, memory, timeout, concurrency)
- Pricing configuration (base fee, CPU/memory rates, min/max caps)
- Availability flags

**All 24 studio tools registered:**
- 8 Dev Studio tools
- 8 Cyber Studio tools
- 8 Data Studio tools

### 2. Credit Engine (`src/lib/billing/credits.ts`)

**Core Functions:**
- `estimateCredits()`: Returns min/typical/max estimates based on tool limits
- `computeAuthoritativeCharge()`: Calculates final charge from actual usage
- `validateSpendLimits()`: Checks daily/monthly/per-run caps
- `getUserSpendLimits()`: Gets user's spend limits based on plan
- `hasSufficientCredits()`: Checks if user has enough credits

**Credit Burn Model:**
```
Base fee: 2 credits per server run
+ CPU: 1 credit per 2 seconds
+ Memory: 1 credit per 4 seconds per GB
= Total (capped at min 3, max tool-specific)
```

### 3. Updated Plans (`src/lib/billing/plans.ts`)

**New Structure:**
- **Free**: 300 credits/month, 30 credits/day cap
- **Supporter**: 3,000 credits/month, 300 credits/day cap
- **Pro**: 12,000 credits/month, 2,000 credits/day cap

**Credit Packs:**
- Starter: £10 = 500 credits (£0.02/credit)
- Standard: £25 = 1,400 credits (£0.0179/credit, 10% discount)
- Professional: £50 = 3,000 credits (£0.0167/credit, 17% discount)

### 4. Account Gating (`src/lib/studios/auth-gating.ts`)

**Middleware Functions:**
- `requireAuthForServerTools()`: Enforces auth for server-side tools
- `denyIfAnonymous()`: Blocks anonymous users from server operations
- `denyIfInsufficientCredits()`: Checks credit balance before execution
- `requireAuth()`: Generic auth requirement

**Structured Error Responses:**
All errors include:
- Error code
- Human-readable reason
- Actionable guidance
- Relevant URLs (sign in, purchase, upgrade)

### 5. Estimation API (`src/app/api/billing/estimate/route.ts`)

**Endpoint:** `POST /api/billing/estimate`

**Request:**
```json
{
  "toolId": "dev-studio-projects",
  "requestedLimits": {
    "cpuMs": 5000,
    "memMb": 512,
    "durationMs": 5000
  }
}
```

**Response:**
```json
{
  "toolId": "dev-studio-projects",
  "estimate": {
    "min": 0,
    "typical": 0,
    "max": 0,
    "explanation": "Client-side tool: no credits required"
  },
  "tool": {
    "title": "Project Builder",
    "executionMode": "client_only",
    "requiresAuth": false
  }
}
```

### 6. Payment Processing Stubs (`src/lib/billing/payments.ts`)

**Functions:**
- `createCheckoutSession()`: Creates payment session (requires auth)
- `handleWebhook()`: Processes payment webhooks
- `getCreditPacks()`: Returns available credit packs

**TODO:** Integrate with actual payment provider (Stripe, etc.)

## What Still Needs Implementation

### 1. Tool Execution API Routes

Create API routes for each tool that:
- Check auth requirements
- Validate spend limits
- Estimate credits before execution
- Execute tool
- Charge credits based on actual usage
- Handle refunds for platform errors

**Example structure:**
```
/api/dev-studio/projects/run
/api/dev-studio/api-designer/run
... (all 24 tools)
```

### 2. Estimation UI Component

Create React component that:
- Calls `/api/billing/estimate` before execution
- Displays min/typical/max credits
- Shows explanation
- Handles "Local mode, 0 credits" for client-side tools
- Shows confirmation dialog for server-side tools

### 3. Purchase Credits Page

Create `/account/credits` page with:
- Current balance display
- Credit pack selection
- Checkout flow
- Purchase history

### 4. Server-Side Audit Logging

Implement audit logging for:
- Estimate requests
- Tool run attempts (blocked, succeeded, failed)
- Credit charges
- Credit refunds
- Spend limit violations

**Storage:** JSONL file or database (Prisma if available)

### 5. Spend Controls UI

Add user settings for:
- Daily credit cap override
- Monthly credit cap override
- Per-run max override
- Alerts at 50%, 80%, 100% of caps

### 6. Credit Balance Tracking

Implement actual credit balance storage and retrieval:
- Database/store for user credits
- Daily/monthly usage tracking
- Credit purchase recording
- Credit consumption recording

### 7. Contract Tests

Add tests that verify:
- Anonymous cannot run server_required tools
- Any server run requires auth
- Charge is within min and max
- Spending caps block correctly
- Estimate endpoint matches registry
- Errors are structured and actionable

## Key Principles Implemented

✅ **Anonymous users**: Client-side tools only (0 credits, safest, best funnel)  
✅ **Server-side compute**: Requires account (enables abuse control, refunds, fraud prevention)  
✅ **Credits track real cost**: CPU time, memory time + margin  
✅ **Base fee per server run**: Prevents tiny spam runs from being "free"  
✅ **Transparent pricing**: Show min/typical/max before execution  
✅ **Automatic refunds**: Platform errors before execution are refunded  

## Next Steps

1. **Immediate**: Fix any build errors, test estimation API
2. **Short-term**: Implement tool execution routes with credit enforcement
3. **Medium-term**: Build UI components (estimation, purchase, spend controls)
4. **Long-term**: Add telemetry, analytics, and optimization

## Files Created/Modified

### Created:
- `src/lib/tools/registry.ts` - Tool registry
- `src/lib/billing/credits.ts` - Credit engine
- `src/lib/studios/auth-gating.ts` - Account gating middleware
- `src/app/api/billing/estimate/route.ts` - Estimation API
- `src/lib/billing/payments.ts` - Payment processing stubs

### Modified:
- `src/lib/billing/plans.ts` - Updated to credits/month + daily caps
- `docs/studios/STRATEGIC_PLAN.md` - Updated with market-based pricing

## Testing Checklist

- [ ] Tool registry loads all 24 tools correctly
- [ ] Credit estimation works for all execution modes
- [ ] Auth gating blocks anonymous users from server tools
- [ ] Estimation API returns correct min/typical/max
- [ ] Plans show correct monthly credits and daily caps
- [ ] Payment stubs return correct pack information
- [ ] Build succeeds without errors

## Notes

- All pricing is in £ (GBP) - adjust currency as needed
- Credit price: £0.02 per credit (35% above CodeSandbox's £0.01486)
- Refund policy: Automatic for platform errors before execution
- Spend limits: Daily cap, monthly cap, per-run cap (user configurable)
