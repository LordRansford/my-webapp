# Credit System Implementation Status

## ✅ Completed (Phase 1)

### Core Infrastructure
1. **Tool Registry** (`src/lib/tools/registry.ts`)
   - All 24 studio tools registered with complete metadata
   - Execution modes, pricing, limits, auth requirements
   - Helper functions for tool lookups

2. **Credit Engine** (`src/lib/billing/credits.ts`)
   - Credit estimation (min/typical/max)
   - Authoritative charging based on actual usage
   - Spend limit validation (daily/monthly/per-run)
   - Credit burn model: Base (2) + CPU (1 per 2s) + Memory (1 per 4s per GB)

3. **Updated Plans** (`src/lib/billing/plans.ts`)
   - Free: 300 credits/month, 30/day cap
   - Supporter: 3,000 credits/month, 300/day cap
   - Pro: 12,000 credits/month, 2,000/day cap
   - Credit packs: £10/500, £25/1,400, £50/3,000

4. **Account Gating** (`src/lib/studios/auth-gating.ts`)
   - `requireAuthForServerTools()` - Enforces auth for server-side tools
   - `denyIfAnonymous()` - Blocks anonymous from server operations
   - `denyIfInsufficientCredits()` - Credit balance checks
   - Structured error responses with actionable guidance

5. **Credit Balance Store** (`src/lib/billing/creditStore.ts`)
   - Integrates with existing Prisma store when available
   - Falls back to file-based storage
   - Functions: `getCreditBalance()`, `consumeCredits()`, `refundCredits()`
   - Daily/monthly usage tracking

6. **Estimation API** (`src/app/api/billing/estimate/route.ts`)
   - `POST /api/billing/estimate`
   - Returns min/typical/max with explanations
   - Rate limited and secured

7. **Credit Balance API** (`src/app/api/credits/balance/route.ts`)
   - `GET /api/credits/balance`
   - Returns balance, usage stats, plan info, alerts

8. **Tool Execution Routes** (Examples)
   - `POST /api/dev-studio/projects/run` - Full credit enforcement example
   - `POST /api/dev-studio/api-designer/run` - Hybrid tool example

9. **Estimation UI Component** (`src/components/studios/CreditEstimate.tsx`)
   - React component for displaying credit estimates
   - Handles client-side (0 credits) vs server-side
   - Shows min/typical/max with explanations

10. **Payment Processing Stubs** (`src/lib/billing/payments.ts`)
    - Checkout session creation
    - Webhook handling structure
    - Credit pack management

### Documentation
- ✅ Strategic Plan updated with market-based pricing
- ✅ Implementation summary document
- ✅ This status document

## 🚧 In Progress / Next Steps

### High Priority
1. **Remaining Tool Execution Routes** (22 more tools)
   - Create `/api/{studio}/{tool}/run` routes for all tools
   - Follow the pattern established in `projects/run` and `api-designer/run`

2. **Purchase Credits Page** (`/account/credits`)
   - Display current balance
   - Show credit packs
   - Checkout flow
   - Purchase history

3. **Add CreditEstimate to Tool Pages**
   - Integrate `CreditEstimate` component into all 24 tool pages
   - Show estimates before execution
   - Handle client-side vs server-side display

### Medium Priority
4. **Server-Side Audit Logging**
   - Log all tool executions
   - Log credit charges/refunds
   - Log spend limit violations
   - Store in Prisma or file-based JSONL

5. **Spend Controls UI**
   - User settings for daily/monthly caps
   - Per-run max override
   - Alerts at 50%, 80%, 100%

6. **Credit Balance Display**
   - Add balance widget to header/navigation
   - Show usage progress bars
   - Alert when approaching limits

### Lower Priority
7. **Contract Tests**
   - Anonymous cannot run server tools
   - Auth required for server operations
   - Charge within min/max bounds
   - Spend caps block correctly
   - Estimate matches registry

8. **Monthly Credit Allocation**
   - Auto-allocate monthly credits on plan start/renewal
   - Handle plan upgrades/downgrades
   - Credit expiration logic

## Architecture Decisions

### Credit Store Integration
- **Primary**: Prisma (existing `src/lib/credits/store.ts`)
- **Fallback**: File-based JSON (`data/credits.json`)
- **Rationale**: Works with or without database, graceful degradation

### Tool Execution Pattern
1. Rate limit
2. Validate tool exists
3. Check auth requirements
4. Estimate credits
5. Check balance & spend limits
6. Execute tool
7. Charge credits based on actual usage
8. Return result with credit info

### Error Handling
- All errors return structured JSON with:
  - `error`: Human-readable message
  - `code`: Machine-readable code
  - `reason`: Why it failed
  - `action`: What user can do
  - Relevant URLs (sign in, purchase, upgrade)

## Testing Checklist

- [x] Build succeeds without errors
- [x] Tool registry loads all tools
- [x] Credit estimation works
- [x] Auth gating blocks anonymous users
- [ ] Tool execution routes work end-to-end
- [ ] Credit balance API returns correct data
- [ ] Estimation UI displays correctly
- [ ] Purchase flow works (when implemented)

## Known Limitations

1. **Credit Balance**: Currently uses Prisma or file-based fallback. May need migration path.
2. **Monthly Allocation**: Not yet auto-allocated on plan start/renewal.
3. **Credit Expiration**: Not yet implemented (Prisma store has expiry logic).
4. **Refund Logic**: Basic implementation, may need enhancement for edge cases.
5. **Tool Execution**: Only 2 example routes created, 22 more needed.

## Next Session Priorities

1. Create remaining tool execution routes (can be templated)
2. Build Purchase Credits page
3. Integrate CreditEstimate component into tool pages
4. Add credit balance display to navigation

---

**Last Updated**: 2024  
**Build Status**: ✅ Passing  
**Ready for**: Next phase implementation
