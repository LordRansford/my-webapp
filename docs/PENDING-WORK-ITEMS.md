# Pending Work Items Queue

## Games Platform

### UI Components (Pending)
- [ ] **Archive browser UI component** - For viewing completed game runs
- [ ] **Archive replay functionality** - Ability to replay past games
- [ ] **Achievement list/grid component** - Display all achievements
- [ ] **Achievement statistics display** - Show achievement progress
- [ ] **Tutorial UI components** - Interactive tutorial system UI
- [ ] **Element highlighting implementation** - For tutorials
- [ ] **Interactive step handling** - Tutorial step progression

### Daily Logic Gauntlet
- [ ] **Load player model from profile** - When profile system available (`DailyLogicGauntletEnhanced.tsx:123`)
- [ ] **Calculate averageScore properly** - Currently stubbed (`DailyLogicGauntletEnhanced.tsx:332`)

## AI Studio

### Database Integration (Blocked)
- [ ] **Uncomment AI Studio schema** - When merged with main Prisma schema (4 locations in `src/lib/ai-studio/db.ts`)
  - Line 425: Uncomment when AI Studio schema is merged
  - Line 463: Uncomment when AI Studio schema is merged
  - Line 510: Uncomment when AI Studio schema is merged
  - Line 544: Uncomment when AI Studio schema is merged

### API Routes (Missing)
- [ ] **Get actual total from DB** - Multiple routes returning stubbed totals:
  - `src/app/api/ai-studio/agents/route.ts:48` - Agents total
  - `src/app/api/ai-studio/datasets/route.ts:45` - Datasets total
  - `src/app/api/ai-studio/models/route.ts:43` - Models total
  - `src/app/api/ai-studio/jobs/route.ts:34` - Jobs total

### CRUD Operations (Missing)
- [ ] **Update model in database** - `src/app/api/ai-studio/models/[id]/route.ts:124`
- [ ] **Soft delete model in database** - `src/app/api/ai-studio/models/[id]/route.ts:205`
- [ ] **Update dataset in database** - `src/app/api/ai-studio/datasets/[id]/route.ts:124`
- [ ] **Soft delete dataset in database** - `src/app/api/ai-studio/datasets/[id]/route.ts:205`
- [ ] **Create model in database** - `src/app/api/ai-studio/models/route.ts:72`

### Features (Missing)
- [ ] **Trigger validation job asynchronously** - `src/app/api/ai-studio/datasets/upload/route.ts:105`
- [ ] **Send errors to tracking service** - `src/components/ai-studio/AIStudioErrorBoundary.tsx:40` (Sentry, etc.)

## Account & Billing

- [ ] **Retrieve alert thresholds from database** - `src/app/api/account/settings/credits/route.ts:50`
- [ ] **Integrate with external object storage** - `src/app/api/admin/support/[id]/attachments/[attachmentId]/route.ts:34` (Vercel Blob, S3, etc.)

## Certificates

- [ ] **Replace with authoritative completion tracking** - `src/app/api/certificates/request/route.ts:18` - Wire to course metadata/config

## Tools

- [ ] **Implement actual compute execution** - `src/app/api/tools/run/route.ts:88` - Real compute execution when backend is ready

## AutoCode Generator

- [ ] **Implement function logic** - Multiple TODO placeholders in `src/components/studios/automation/AutoCodeGenerator.tsx`:
  - Function logic (lines 37, 51, 66)
  - Route logic (line 81)
  - Component props and implementation (lines 101, 105, 109)

## Dashboards (Needs Polish)

From `docs/dashboards.md`:
- [ ] **risk-matrix-builder** - Implemented but UX/teaching depth needs improvement

## CPD (Continuing Professional Development)

- [ ] **Certificate issuance** - Pending "Ready" status (multiple course evidence checklists)
  - Cybersecurity course
  - Data course
  - AI course
  - Software Architecture course
  - Digitalisation course

## Documentation Status

- [ ] **Games implementation** - According to `docs/games/IMPLEMENTATION-STATUS-REPORT.md`, games are design-only, not implemented (but this may be outdated based on recent work)

---

## Priority Suggestions

### High Priority
1. AI Studio database schema merge (blocks multiple features)
2. Games UI components (Archive, Achievements, Tutorials)
3. Certificate completion tracking

### Medium Priority
4. AI Studio CRUD operations
5. Tools compute execution
6. Account settings database integration

### Low Priority
7. AutoCode Generator implementation placeholders
8. Dashboard polish items
9. Error tracking service integration

---

**Last Updated**: Based on codebase scan and documentation review
**Note**: Some items may be outdated or already completed - verify before starting work
