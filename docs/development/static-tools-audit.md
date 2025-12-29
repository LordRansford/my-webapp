# Static Tools Audit & Enhancement Report

**Date**: 2024  
**Status**: In Progress  
**Purpose**: Identify static ToolCard instances and prioritise interactive enhancements

---

## Summary

After auditing all MDX files across course content, most ToolCards already have interactive components. However, a few instances were identified with static content (lists, plain text) that could benefit from interactive enhancements.

---

## Audit Results

### Category 1: Already Interactive ✅

**Status**: No action needed

Most ToolCards already use interactive components:
- AI course: `AIExamplesExplorerTool`, `DataNoiseTool`, `FeatureLeakageTool`, etc.
- Cybersecurity: `RiskDial`, `ThreatModelCanvasTool`, `ControlSelectionTool`, etc.
- Software Architecture: `ArchitectureCanvas`, `BoundaryMapper`, `TradeoffExplorer`, etc.
- Digitalisation: `ChangeImpactSimulator`, `DataValueChain`, `DigitalMaturityGauge`, etc.
- Data: `EthicsScenarioTool`, `SharedDataInterpretationTool`, etc.

### Category 2: Static Content (Needs Enhancement) ⚠️

#### 2.1 Cybersecurity Overview - Security Habit Drill ✅ COMPLETED

**File**: `content/notes/cybersecurity/overview.mdx`  
**Lines**: 171-176  
**Previous State**: Static list with instructions

**Enhancement**: ✅ Created `SecurityHabitPlannerTool` 
- ✅ Habit selection from cybersecurity-specific library (17 habits)
- ✅ Week-based tracking with calendar view
- ✅ Guardrail documentation (security-specific feature)
- ✅ Progress tracking with streaks
- ✅ localStorage persistence
- ✅ Export/share capabilities
- ✅ Full accessibility support

**Files Created**:
- `src/components/notes/tools/cybersecurity/overview/SecurityHabitLibrary.ts`
- `src/components/notes/tools/cybersecurity/overview/useSecurityHabitPlanner.ts`
- `src/components/notes/tools/cybersecurity/overview/SecurityHabitPlannerTool.tsx`

**Status**: ✅ Integrated and functional

#### 2.2 Capstone - BookTrack Safety Drill

**File**: `content/notes/capstone/booktrack.mdx`  
**Lines**: 180-195  
**Current State**: Static instructions

```mdx
<ToolCard title="BookTrack safety drill" description="Pick one decision. Stress test it. Write the evidence you would want in an incident report.">
  <p>Choose a decision from the BookTrack system. Stress test it against edge cases, failures, and misuse. Document what evidence you would want in an incident report.</p>
</ToolCard>
```

**Priority**: Medium (capstone-specific, lower visibility)  
**Enhancement**: Create `SafetyDrillTool`
- Decision selection
- Stress test checklist
- Evidence documentation template
- Export capability

### Category 3: Component References (Need Verification) ❓

Some ToolCards reference components that may not exist or may need verification:

- `PlatformMap` (software-architecture/advanced.mdx)
- `ResilienceSimulator` (software-architecture/advanced.mdx)
- `GovernanceDesigner` (software-architecture/advanced.mdx)

**Action**: Verify these components exist and are functional.

---

## Prioritisation Matrix

| Tool | Priority | Impact | Effort | Status |
|------|----------|--------|--------|--------|
| Security Habit Drill | High | High | Medium | ✅ Completed |
| BookTrack Safety Drill | Medium | Medium | Medium | Pending |
| Component Verification | Low | Low | Low | Pending |

---

## Recommended Implementation Order

### Phase 1: High Priority
1. **Security Habit Planner Tool** (Cybersecurity Overview)
   - Similar pattern to AI Habit Planner
   - Reuse existing patterns and components
   - Estimated effort: 4-6 hours

### Phase 2: Medium Priority
2. **Safety Drill Tool** (Capstone)
   - More specific use case
   - Lower visibility
   - Estimated effort: 3-4 hours

### Phase 3: Verification
3. **Component Verification**
   - Check all referenced components exist
   - Test functionality
   - Estimated effort: 1-2 hours

---

## Tool Development Patterns

Based on the AI Habit Planner implementation, the following patterns should be followed:

### Pattern 1: Habit Planners
- **Structure**: Library → Hook → Component
- **Features**: Selection, tracking, streaks, notes, export
- **Reusability**: High (can be adapted for different courses)

### Pattern 2: Interactive Checklists
- **Structure**: Checklist data → State management → Interactive UI
- **Features**: Toggle items, progress tracking, persistence
- **Reusability**: High

### Pattern 3: Scenario Simulators
- **Structure**: Scenario data → Interactive controls → Visual feedback
- **Features**: Adjustable parameters, real-time updates, visualisations
- **Reusability**: Medium (scenario-specific)

### Pattern 4: Canvas/Diagram Tools
- **Structure**: Canvas component → Drawing tools → Export
- **Features**: Drag-and-drop, annotations, export
- **Reusability**: Medium

---

## Next Steps

1. ✅ Complete audit (this document)
2. ✅ Implement Security Habit Planner Tool
3. ⏳ Verify component references
4. ⏳ Implement Safety Drill Tool (if prioritised)
5. ⏳ Document tool development patterns

---

## Notes

- Most course content already uses interactive tools effectively
- The static tools identified are primarily in overview pages and capstone content
- Reusing patterns from AI Habit Planner will accelerate development
- Consider creating a shared habit planner component that can be configured per course

