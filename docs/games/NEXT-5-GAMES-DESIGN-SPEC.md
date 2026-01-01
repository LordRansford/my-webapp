# Next 5 Games - Complete Design Specifications

**Status:** Planning Phase - No Code Yet  
**Date:** 2024  
**Platform:** Ransford's Notes Games Platform  
**Architecture:** Browser-only, localStorage, seeded RNG, challenge codes

---

## Portfolio Overview

### Existing Games (Games 1-5)
1. **Daily Logic Gauntlet** - Multi-puzzle challenge (puzzle, intermediate)
2. **Grid Racer** - Time trial racing (arcade, foundations)
3. **Draft Duel** - Strategic card battler (card, advanced)
4. **Hex** - Classic connection game (board, intermediate)
5. **Systems Mastery** - Complex systems thinking (educational, advanced)

### New Games (Games 6-10)
6. **Signal Hunt** - Cyber defence triage (strategy, intermediate/advanced)
7. **Proof Sprint** - Maths and logic proofs (logic, intermediate/advanced)
8. **Allocation Architect** - Resource optimisation (strategy, intermediate)
9. **Packet Route** - Network routing strategy (strategy, intermediate/advanced)
10. **Governance Simulator** - Policy trade-offs (educational, advanced)

### Differentiation Strategy

**Signal Hunt** differs from existing games by:
- Focus on **prioritisation under time pressure** (unique among current games)
- **Evolving threat state** requiring adaptive strategies
- **False positive management** as core mechanic (unique)
- Cybersecurity domain (complements Systems Mastery's general systems thinking)

**Proof Sprint** differs by:
- **Pure logical reasoning** (different from puzzle pattern matching)
- **Step-by-step derivation** requiring algebraic manipulation
- **Elegance scoring** incentivizing efficient proofs
- Mathematics domain (complements logic games)

**Allocation Architect** differs by:
- **Multi-round planning horizon** (not single-optimization like Constraint Optimizer)
- **Dynamic events** that test plan resilience
- **Marginal utility** and diminishing returns as core mechanics
- Strategic planning domain (broader than constraint satisfaction)

**Packet Route** differs by:
- **Graph/network thinking** (unique topology-based gameplay)
- **Congestion as primary challenge** (not just routing)
- **Failures force adaptation** (resilience planning)
- Network domain (technical but accessible)

**Governance Simulator** differs by:
- **Stakeholder dynamics** (multi-actor systems)
- **Long-horizon trade-offs** (policy consequences over time)
- **Trust as a resource** (unique mechanic)
- Governance domain (complements Systems Mastery's technical focus)

### Overlap Prevention

- **Signal Hunt vs Systems Mastery**: Signal Hunt is tactical triage; Systems Mastery is strategic systems thinking
- **Allocation Architect vs Constraint Optimizer**: Allocation is multi-round planning; Constraint Optimizer is single optimization
- **Packet Route vs Flow Planner**: Packet Route is network topology + failures; Flow Planner is flow optimization without topology changes
- **Proof Sprint vs Deduction Grid**: Proof Sprint is mathematical derivation; Deduction Grid is logical inference from clues

### Recommended Build Order

1. **Allocation Architect** (should be built first as next reference game)
   - Moderate complexity (M)
   - Clear learning objectives
   - Leverages existing constraint/optimization patterns
   - Broad appeal
   - Good test of shared infrastructure
   - **Engagement Features:** Multi-round planning creates natural engagement loops, resource allocation creates meaningful choices, efficiency bonuses create variable rewards

2. **Signal Hunt** (second - cybersecurity domain)
   - Medium complexity (M)
   - Strong domain alignment
   - Unique mechanics
   - Good for platform expansion

3. **Proof Sprint** (third - educational value)
   - Medium-High complexity (M-L)
   - Niche but high-value audience
   - Unique mechanics
   - Educational alignment

4. **Packet Route** (fourth - technical domain)
   - Medium complexity (M)
   - Graph algorithms showcase
   - Technical audience
   - Visual appeal

5. **Governance Simulator** (fifth - advanced domain)
   - High complexity (L)
   - Most complex mechanics
   - Advanced audience
   - Builds on lessons from others

---

# GAME 6: SIGNAL HUNT (Cyber Defence Triage)

## SECTION 1 — Game Identity

**One Sentence Pitch:**  
You are the incident lead triaging security signals under time pressure, balancing investigation depth against response speed while managing false positives and escalating threats.

**Skill It Trains:**
- Security signal prioritisation
- Risk assessment under uncertainty
- False positive management
- Incident response sequencing
- Resource allocation in security operations

**What Mastery Looks Like:**
- Consistently identifies critical threats within 2 turns
- Maintains <15% false positive investigation rate
- Balances investigation and containment actions optimally
- Adapts strategy to adversary behavior patterns
- Achieves >90% containment success rate on true positives

**Target Audience:**
- **Primary:** Intermediate (security practitioners, SOC analysts)
- **Secondary:** Advanced (experienced security leads)
- **Tertiary:** Foundations (learners exploring cybersecurity concepts)

**Why It Fits Ransford's Notes:**
- Aligns with cybersecurity course content
- Teaches practical security operations skills
- No dark patterns - pure skill-based challenge
- Browser-only enables offline learning
- Challenge codes enable safe practice sharing
- Post-run explainability teaches security decision-making

---

## SECTION 2 — Core Loop as State Machine

**State Machine Flow:**

```
[START] → Menu
    ↓
Menu → Mode Select (Learn / Practice / Daily)
    ↓
Mode Select → Pre-Run Planning
    ↓
Pre-Run Planning:
  - Select Defence Posture (Aggressive / Balanced / Defensive)
  - Select Tooling Loadout (3 cards from unlocked set)
  - Review Scenario Brief (adversary type, environment noise level)
    ↓
[INITIALIZE] → Turn Loop Begins
    ↓
Turn Loop (8-12 turns depending on difficulty):
  ├─ [NEW TURN START]
  │   ├─ Generate Signal Queue (3-6 signals based on phase)
  │   ├─ Update Threat States (escalate unresolved threats)
  │   ├─ Update Resource Budget (actions, budget tokens)
  │   └─ Display Queue + State
  │
  ├─ [PLAYER DECISION PHASE]
  │   ├─ Select Signal(s) to process (0-2 per turn based on tooling)
  │   ├─ Choose Action Type per signal:
  │   │   ├─ Investigate (spends 1 action, reveals evidence)
  │   │   ├─ Contain (spends 1 action + budget, stops escalation)
  │   │   ├─ Patch (spends 1 action + 2 budget, reduces root cause)
  │   │   ├─ Monitor (free, marks for later, no escalation)
  │   │   └─ Ignore (free, signal leaves queue)
  │   └─ Confirm Actions
  │
  ├─ [RESOLUTION PHASE]
  │   ├─ Execute Actions (deterministic based on seed)
  │   ├─ Update Signal Evidence (investigations reveal truth)
  │   ├─ Update Threat Escalation (uncontained threats worsen)
  │   ├─ Apply Tooling Effects (special abilities activate)
  │   ├─ Calculate Risk Score (current threat level)
  │   └─ Generate Feedback (success/failure indicators)
  │
  ├─ [PHASE CHECK]
  │   ├─ Check Win Condition: Risk < Threshold AND No Critical Threats
  │   ├─ Check Loss Condition: Risk > Critical Threshold OR Budget Exhausted
  │   └─ Check Phase Transition: Turn count triggers new phase
  │
  └─ [END TURN] → Loop continues or transitions
      ↓
[END STATE] → Win or Lose
    ↓
Win/Lose → Post-Run Report
    ↓
Post-Run Report → Meta Progression Update
    ↓
Meta Progression Update:
  - Award XP
  - Update Mastery Tiers
  - Unlock New Tooling (if tier reached)
  - Update Personal Best
  - Update Streak
  - Store Challenge Code
    ↓
[RETURN TO MENU]
```

**Key State Variables:**
- `currentTurn: number` (1-12)
- `currentPhase: 1 | 2 | 3 | 4`
- `riskScore: number` (0-100)
- `budget: number` (action tokens, budget tokens)
- `signalQueue: Signal[]` (active signals)
- `threatStates: Map<signalId, ThreatState>` (escalation tracking)
- `investigationHistory: Action[]` (for explainability)
- `toolingActive: ToolingCard[]` (selected loadout)

---

## SECTION 3 — Strategic Decision Points

**Decision 1: Investigate vs Contain Immediately**

**Trade-off:**
- **Investigate First:** Reveals true threat level and root cause, enables optimal response, but allows threat escalation during investigation
- **Contain Immediately:** Prevents escalation but may waste resources on false positives or apply wrong containment type

**State Impact:**
- Investigation adds evidence to signal, changes threat probability, consumes action but not budget
- Immediate containment stops escalation but may be inefficient if signal is false positive or requires different containment type
- Choice affects risk score calculation and resource efficiency

**Example Scenario:**
- Signal: "Unusual network traffic from external IP"
- Investigation reveals: 80% true positive, ransomware precursor
- Containment without investigation: Would have used network block (correct) but wasted time on 20% false positive chance
- Optimal: Investigate if budget allows, then contain with specific countermeasure

**Decision 2: Root Cause Fix vs Workaround**

**Trade-off:**
- **Patch (Root Cause):** Expensive (2 budget + 1 action) but permanently reduces threat category
- **Contain (Workaround):** Cheap (1 budget + 1 action) but threat may resurface with different signal

**State Impact:**
- Patching reduces future signal generation for this threat type, improves long-term risk
- Containing stops current threat but doesn't prevent similar threats, maintains risk baseline
- Multi-turn implications: Patches compound (fewer future signals), contains don't

**Decision 3: Visibility Investment vs Response Power**

**Trade-off:**
- **Tooling Choice - Deep Investigation:** Spends tooling slot for better evidence quality, reduces false positives
- **Tooling Choice - Rapid Containment:** Spends tooling slot for faster/more efficient containment actions

**State Impact:**
- Deep Investigation tooling: Investigation actions reveal 100% accurate threat level, eliminates false positive waste
- Rapid Containment tooling: Contain actions cost 0 budget (vs 1), enables aggressive containment strategy
- Affects overall strategy: High-visibility enables precision, high-response enables speed

**Example Scenario:**
- Aggressive Posture + Deep Investigation: Can afford to investigate most signals, eliminate false positives, contain only true threats efficiently
- Balanced Posture + Rapid Containment: Must triage quickly, contain first and ask questions later, tolerate some false positives

---

## SECTION 4 — Progression Model (Browser Only)

**localStorage Schema:**

```typescript
interface SignalHuntProgress {
  version: 1;
  
  // Mastery Progression
  xp: number;                    // Total XP earned
  currentTier: 'novice' | 'analyst' | 'expert' | 'master' | 'legend';
  tierProgress: number;          // 0-1 progress to next tier
  
  // Unlocks
  unlockedTooling: string[];     // Array of tooling card IDs
  unlockedPostures: string[];    // Posture variants (start with 3, unlock 2 more)
  unlockedScenarios: string[];   // Scenario packs (adversary types, environments)
  
  // Personal Bests
  personalBests: {
    [scenarioId: string]: {
      bestScore: number;         // Highest score (lower risk = higher score)
      bestTurns: number;         // Fastest completion
      bestAccuracy: number;      // Best false positive rate
    };
  };
  
  // Streaks
  currentStreak: number;         // Consecutive daily completions
  longestStreak: number;
  lastPlayedDate: string;        // YYYY-MM-DD
  
  // Challenge History
  completedChallenges: {
    challengeCode: string;
    completedDate: string;
    score: number;
    outcome: 'win' | 'loss';
  }[];
  
  // Statistics
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    totalSignalsProcessed: number;
    totalFalsePositives: number;
    averageResponseTime: number; // Turns to contain threats
  };
}
```

**What Persists:**
- All progression data (XP, tiers, unlocks)
- Personal bests (enables improvement tracking)
- Streaks (motivation for daily play)
- Challenge codes completed (prevents re-completion, enables comparison)
- Statistics (learning analytics)

**What Does NOT Persist:**
- Personal information (no names, emails, identifiers)
- Exact signal contents (only metadata)
- Replay logs (can be regenerated from seed)
- Cross-device sync (browser-only, no server)

**Progression Gates:**

- **Tier 1 (Novice → Analyst):** 100 XP, unlocks 2 tooling cards
- **Tier 2 (Analyst → Expert):** 300 XP, unlocks "Balanced" posture variant, 1 scenario pack
- **Tier 3 (Expert → Master):** 600 XP, unlocks "Defensive" posture variant, 2 tooling cards
- **Tier 4 (Master → Legend):** 1000 XP, unlocks "Adaptive" posture (hardest), all scenarios, all tooling

**XP Award Formula:**
```
baseXP = 50 (win) or 10 (loss)
riskBonus = (100 - finalRiskScore) * 0.5
efficiencyBonus = (budgetRemaining / budgetStart) * 20
accuracyBonus = (1 - falsePositiveRate) * 30
tierMultiplier = 1.0 (novice) to 2.0 (master)

totalXP = (baseXP + riskBonus + efficiencyBonus + accuracyBonus) * tierMultiplier
```

---

## SECTION 5 — Difficulty Model with Structural Phases

**Phase 1: Clean Signals (Turns 1-3)**
- **Signal Count:** 3-4 per turn
- **False Positive Rate:** 20%
- **Evidence Quality:** High (clear indicators)
- **Threat Escalation:** Slow (2 turns to critical)
- **Resource Budget:** Generous (5 actions, 8 budget tokens)
- **Adversary Behavior:** Static, predictable

**Structural Changes:**
- Signals have clear severity indicators
- Investigation reveals full truth
- Threats escalate linearly
- Tooling effects are straightforward

**Phase 2: Noisy Environment (Turns 4-6)**
- **Signal Count:** 5-6 per turn
- **False Positive Rate:** 40%
- **Evidence Quality:** Medium (ambiguous indicators)
- **Threat Escalation:** Moderate (1.5 turns to critical)
- **Resource Budget:** Moderate (4 actions, 6 budget tokens)
- **Adversary Behavior:** Slightly adaptive (changes tactics if contained once)

**Structural Changes:**
- Signals have overlapping indicators (harder to distinguish)
- Investigation reveals probability ranges (80-90% threat, not 100%)
- Threats can have multiple escalation paths
- False positives look similar to real threats

**Phase 3: Simultaneous Incidents (Turns 7-9)**
- **Signal Count:** 6-8 per turn
- **False Positive Rate:** 35%
- **Evidence Quality:** Low (incomplete evidence)
- **Threat Escalation:** Fast (1 turn to critical for some types)
- **Resource Budget:** Tight (3 actions, 5 budget tokens)
- **Adversary Behavior:** Adaptive (responds to your strategy)

**Structural Changes:**
- Multiple threat types active simultaneously
- Threat dependencies (containing one reveals another)
- Signal correlations (one signal affects others)
- Tooling cooldowns (some tooling can't be used every turn)
- Critical threats can't be ignored (auto-escalate if not addressed)

**Phase 4: Adversarial Environment (Turns 10-12)**
- **Signal Count:** 8-10 per turn
- **False Positive Rate:** 50%
- **Evidence Quality:** Very Low (decoy signals)
- **Threat Escalation:** Very Fast (0.5 turns to critical)
- **Resource Budget:** Critical (2 actions, 3 budget tokens)
- **Adversary Behavior:** Highly adaptive (learns your patterns, creates decoys)

**Structural Changes:**
- Adversary generates decoy signals (look like threats but harmless)
- Threats can "hide" (appear as low-severity then escalate rapidly)
- Signal correlation is complex (investigating one reveals/cloaks others)
- Budget penalties for wrong decisions (false positives cost extra)
- Multi-stage threats (require sequential containment actions)

**Difficulty Tiers:**

**Foundations Tier:**
- Only Phases 1-2 (6 turns)
- Lower false positive rate
- More generous resources
- Simpler adversary behavior

**Intermediate Tier:**
- Phases 1-3 (9 turns)
- Standard false positive rates
- Standard resources
- Adaptive adversary

**Advanced Tier:**
- All Phases 1-4 (12 turns)
- Higher false positive rates
- Tighter resources
- Highly adaptive adversary
- Additional mechanics (threat dependencies, tooling cooldowns)

**Expert Tier:**
- All Phases 1-4 (12 turns)
- Maximum false positive rate (50%+)
- Minimum resources
- Adversarial adversary (actively counters your strategy)
- All mechanics enabled

---

## SECTION 6 — Replay Hooks and Safe Competition

**Hook 1: Daily Seeded Challenge**
- **Format:** `SIGH-YYYY-MM-DD-XXXX` challenge code
- **Mechanics:** Same seed for all players on same date (UTC)
- **Content:** Same adversary type, same signal sequence, same events
- **Competition:** Personal best tracking (best score, fastest completion, best accuracy)
- **Storage:** Challenge code stored in localStorage with completion status
- **Sharing:** Players can share codes to compare strategies (same challenge, different approaches)

**Hook 2: Weekly Scenario Rotation**
- **Format:** Weekly scenario packs (7-day cycles)
- **Mechanics:** Each week features a different adversary type + environment combination
- **Content:** 5 scenarios per week, increasing difficulty
- **Competition:** Weekly leaderboard (localStorage only, anonymous scores)
- **Unlock:** Completing weekly scenarios unlocks special tooling cards
- **Storage:** Weekly completion status per scenario

**Hook 3: Personal Best Ladder**
- **Format:** Per-scenario personal bests
- **Mechanics:** Track best score, fastest completion, best accuracy per scenario ID
- **Competition:** Self-improvement (compare your runs over time)
- **Display:** Progress dashboard showing improvement trends
- **Storage:** Personal bests in progression data

**Hook 4: Mastery Rank**
- **Format:** Tier-based ranking system
- **Mechanics:** Unlock new content at each tier
- **Competition:** Tier completion percentage (self-progress)
- **Display:** Mastery dashboard showing tier progress and unlocks
- **Storage:** Tier and XP in progression data

**Hook 5: Challenge Code Sharing**
- **Format:** Share specific scenario + posture + seed combinations
- **Mechanics:** Players can generate codes for any completed scenario
- **Competition:** Compare scores on same challenge (via score comparison system)
- **Sharing:** Challenge codes include scenario ID, posture choice, and seed
- **Storage:** Challenge codes stored in shared challenge code system

**Safe Competition Mechanisms:**
- **No Real-Time Multiplayer:** All competition is async via challenge codes
- **Anonymous Scores:** Only scores stored, no player identification
- **Local Leaderboards:** Daily/weekly leaderboards are device-local (no cross-device comparison)
- **Shareable Codes:** Players can share codes to compare, but comparison is opt-in (enter code to compare)

---

## SECTION 7 — Post Run Explainability

**Post-Run Report Structure:**

**Section 1: Outcome Summary**
- Win/Loss result
- Final risk score
- Turns completed
- Resource efficiency (budget used vs available)

**Section 2: Key Decision Points (Top 3)**

*Example:*
1. **Turn 4 - Signal #3 (Unusual Network Traffic)**
   - **Your Choice:** Investigated first, then contained (correct approach)
   - **Impact:** Prevented false positive containment, saved 1 budget token
   - **Why It Mattered:** Signal was true positive (ransomware), investigation revealed specific containment type needed

2. **Turn 6 - Signal #2 (Suspicious File Activity)**
   - **Your Choice:** Contained immediately without investigation
   - **Impact:** Wasted 1 budget token on false positive
   - **Why It Mattered:** Signal was false positive (legitimate backup process), investigation would have revealed this

3. **Turn 8 - Critical Threat Escalation**
   - **Your Choice:** Used Patch (root cause fix) instead of Contain
   - **Impact:** Spent 2 budget tokens but prevented future similar threats
   - **Why It Mattered:** Reduced future signal generation by 30%, improved long-term risk

**Section 3: Mistakes and Inefficiencies (Top 3)**

*Example:*
1. **False Positive Rate: 35%**
   - **What Happened:** Investigated 7 signals that were false positives
   - **Cost:** 7 actions wasted, delayed containment of real threats
   - **Recommendation:** Use Deep Investigation tooling or investigate signals with >70% threat probability only

2. **Late Containment: Turn 9 Threat**
   - **What Happened:** Threat escalated to critical before containment
   - **Cost:** Required 2 containment actions instead of 1, increased risk score by 15
   - **Recommendation:** Prioritize high-severity signals earlier, use Rapid Containment tooling for fast response

3. **Inefficient Resource Use**
   - **What Happened:** Ended with 3 unused budget tokens
   - **Cost:** Could have used for additional patches or tooling effects
   - **Recommendation:** Plan resource spending more aggressively in later turns

**Section 4: Recommended Strategy Adjustment**

*Example:*
- **Current Strategy:** Balanced Posture + Deep Investigation
- **Performance:** Good accuracy (65% true positive rate) but slow response (average 2.5 turns to contain)
- **Recommended Adjustment:** Try Aggressive Posture + Rapid Containment
- **Rationale:** Your investigation skills are good, but you're spending too much time investigating. Rapid Containment would let you contain threats faster while maintaining reasonable accuracy through experience.

**Deterministic Calculation:**
- All analysis based on game state history (stored in replay log)
- Decision impact calculated from state differences
- Recommendations based on performance patterns (rule-based, not AI)
- Mistakes identified by comparing optimal vs actual actions (optimal calculated from game rules)

---

## SECTION 8 — UI and UX Specification

**Main Screen Layout:**

```
┌─────────────────────────────────────────────────────────┐
│ [Header: Turn X/12 | Risk: 45/100 | Budget: 3/5 | Actions: 2/3] │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Signal Queue (Primary Area)                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ Signal 1 │  │ Signal 2 │  │ Signal 3 │              │
│  │ [Severity│  │ [Severity│  │ [Severity│              │
│  │  Bar]    │  │  Bar]    │  │  Bar]    │              │
│  │ [Evidence│  │ [Evidence│  │ [Evidence│              │
│  │  Icons]  │  │  Icons]  │  │  Icons]  │              │
│  │ [Actions]│  │ [Actions]│  │ [Actions]│              │
│  └──────────┘  └──────────┘  └──────────┘              │
│                                                           │
├─────────────────────────────────────────────────────────┤
│ Threat State Panel (Bottom)                              │
│ [Active Threats: 2] [Escalating: 1] [Contained: 3]      │
│ [Threat Timeline Visual]                                 │
├─────────────────────────────────────────────────────────┤
│ Action Panel (Bottom Right)                              │
│ [Investigate] [Contain] [Patch] [Monitor] [Ignore]      │
│ [Tooling Effects: 2 available]                          │
└─────────────────────────────────────────────────────────┘
```

**Mobile Control Scheme:**

- **Signal Selection:** Tap signal card to select (highlighted border)
- **Action Selection:** Tap action button (Investigate, Contain, etc.)
- **Confirmation:** Swipe up on action panel to confirm turn
- **Tooling:** Long-press signal to see tooling options
- **Threat Details:** Tap threat in threat panel to see details
- **All targets:** Minimum 44x44px (WCAG compliant)

**Visual Design Cues:**

- **Risk Score:** Progress bar, color-coded (green <30, yellow 30-70, red >70)
- **Severity Indicators:** Color + icon (Critical=red triangle, High=orange circle, Medium=yellow square, Low=blue diamond)
- **Evidence Quality:** Confidence meter (0-100%) with color gradient
- **False Positive Indicators:** Subtle pattern overlay on signal cards (only visible in post-run)
- **Threat Escalation:** Animated threat state changes (smooth transitions)
- **Action Feedback:** Immediate visual feedback (success=green flash, failure=red flash)
- **High Contrast:** All text meets WCAG AA contrast ratios
- **Color Independence:** All information conveyed through icons + text, not color alone

**Risk Communication:**

- **Risk Score:** Always visible in header, updates in real-time
- **Risk Thresholds:** Clear visual indicators (green zone, yellow zone, red zone)
- **Critical Warnings:** Modal alerts for critical risk levels
- **Threat Escalation:** Visual timeline showing threat progression

**Progress Communication:**

- **Turn Counter:** Clear turn X/12 display
- **Resource Budget:** Visual tokens (circles) that deplete
- **Phase Indicators:** Phase badge in header (Phase 1, 2, 3, 4)
- **Progress Bar:** Turn progress bar under header

**Consequence Communication:**

- **Action Results:** Immediate feedback (signal state changes, threat updates)
- **Budget Changes:** Animated budget token changes
- **Risk Changes:** Animated risk score changes with explanation tooltip
- **Threat Escalation:** Visual threat state changes with warning

**Minimum Viable Animations:**

- **Signal Appear:** Fade-in (200ms)
- **Action Execution:** Brief flash (100ms)
- **Threat Escalation:** Smooth color transition (300ms)
- **Risk Score Change:** Number count-up animation (500ms)
- **Turn Transition:** Brief fade (200ms)
- **All animations:** Respect `prefers-reduced-motion` (disable if set)

**Performance Targets:**

- **Initial Load:** <1s
- **Turn Transition:** <300ms
- **Action Execution:** <200ms
- **Frame Rate:** 60fps during interactions
- **Memory:** <50MB for game state

---

## SECTION 9 — Capability Flags for Hub

```typescript
{
  id: "signal-hunt",
  title: "Signal Hunt",
  description: "Triage security signals under time pressure. Balance investigation depth against response speed while managing false positives.",
  category: "strategy",
  modes: ["solo", "daily"],
  supportsDaily: true,
  supportsPractice: true,
  supportsLearn: true,          // Tutorial mode with guided scenarios
  supportsAsyncCompetition: true, // Via challenge codes and daily seeds
  hasProgression: true,
  estimatedSessionMins: 15,
  primarySkills: [
    "cybersecurity",
    "prioritization",
    "risk-assessment",
    "incident-response",
    "decision-making"
  ],
  difficulty: "intermediate", // Ranges from foundations to expert
  supportsMultiplayer: false,
  minPlayers: 1,
  maxPlayers: 1,
  tutorialAvailable: true
}
```

**Flag Explanations:**

- **supportsDaily:** Yes - Daily seeded challenges with same scenario for all players
- **supportsPractice:** Yes - Free-play mode with custom difficulty
- **supportsLearn:** Yes - Tutorial mode with guided scenarios and explanations
- **supportsAsyncCompetition:** Yes - Challenge codes enable score comparison
- **hasProgression:** Yes - XP, tiers, unlocks, personal bests, streaks
- **estimatedSessionMins:** 15 (one full game, 6-12 turns depending on difficulty)
- **primarySkills:** Cybersecurity-focused skills aligned with platform content

---

## SECTION 10 — Implementation Shape

**Module Structure:**

```
src/lib/games/games/signal-hunt/
├── types.ts                          # Type definitions
├── gameState.ts                      # Pure state management
├── signalGenerator.ts                # Seeded signal generation
├── threatEngine.ts                   # Threat escalation logic
├── actionResolver.ts                 # Action execution (pure functions)
├── riskCalculator.ts                 # Risk score calculation
├── explainabilityAnalyzer.ts         # Post-run analysis (deterministic)
├── scenarioDefinitions.ts            # Scenario packs (adversaries, environments)
├── toolingDefinitions.ts             # Tooling cards
├── postureDefinitions.ts             # Defence postures
├── persistence.ts                    # localStorage schema + versioning
├── SignalHunt.tsx                    # Main React component
└── index.ts                          # Exports
```

**Engine (Pure State Updates):**

- **gameState.ts:** Pure functions for state transitions
  - `initializeGame(seed, scenario, posture, tooling): GameState`
  - `executeTurn(state, actions): GameState`
  - `checkWinCondition(state): boolean`
  - `checkLossCondition(state): boolean`
  - `transitionPhase(state): GameState`

- **actionResolver.ts:** Pure functions for action execution
  - `resolveInvestigate(state, signalId): { newState, evidence }`
  - `resolveContain(state, signalId, containmentType): { newState, cost }`
  - `resolvePatch(state, signalId): { newState, cost }`
  - `resolveMonitor(state, signalId): GameState`
  - `resolveIgnore(state, signalId): GameState`

- **threatEngine.ts:** Pure functions for threat management
  - `escalateThreats(state): GameState`
  - `calculateThreatRisk(state): number`
  - `checkThreatDependencies(state): ThreatDependency[]`

**RNG (Seeded):**

- **signalGenerator.ts:** Deterministic signal generation
  - `generateSignalQueue(seed, turn, phase, scenario): Signal[]`
  - `generateSignalEvidence(seed, signalId, investigationLevel): Evidence`
  - `generateFalsePositives(seed, turn, phase): Signal[]` (for decoys)

- Uses `SeededRNG` from framework
- All randomness is deterministic from seed

**Storage (Versioned Schema):**

- **persistence.ts:** localStorage management
  - Schema versioning (v1 initial)
  - Migration functions for future versions
  - Type-safe storage helpers
  - Challenge code integration

**Renderer (UI):**

- **SignalHunt.tsx:** Main React component
  - Uses `GameShell` from framework
  - Integrates challenge code sharing components
  - Integrates score comparison components
  - Integrates achievement display
  - Mobile-responsive layout
  - Keyboard navigation support

**Tests (Determinism, Scoring, Phases):**

- **gameState.test.ts:** State transition tests
  - Deterministic state from same seed
  - Win/loss conditions
  - Phase transitions

- **actionResolver.test.ts:** Action resolution tests
  - Action costs correct
  - State updates correctly
  - Tooling effects apply

- **riskCalculator.test.ts:** Risk calculation tests
  - Risk scores within bounds (0-100)
  - Risk increases with threats
  - Risk decreases with containment

- **explainabilityAnalyzer.test.ts:** Analysis tests
  - Analysis is deterministic
  - Recommendations are logical
  - Mistakes identified correctly

**Relative Complexity: M (Medium)**

**Key Risks:**

1. **Complexity Risk:** Signal generation and threat escalation logic can become too complex
   - **Mitigation:** Start simple, iterate. Use clear state machine.

2. **Balance Risk:** False positive rates and resource budgets must be carefully balanced
   - **Mitigation:** Extensive playtesting, configurable difficulty parameters

3. **Explainability Risk:** Post-run analysis might not be insightful
   - **Mitigation:** Rule-based analysis with clear decision trees, extensive testing

4. **Performance Risk:** Many signals and threats could slow down
   - **Mitigation:** Efficient state updates, limit signal count per turn, lazy rendering

5. **Mobile UX Risk:** Complex interactions might be hard on mobile
   - **Mitigation:** Mobile-first design, large touch targets, gesture support, extensive mobile testing

---

# GAME 7: PROOF SPRINT (Maths and Logic)

## SECTION 1 — Game Identity

**One Sentence Pitch:**  
Build correct mathematical proofs and logical derivations under step constraints, optimizing for elegance and efficiency while mastering proof techniques across multiple mathematical domains.

**Skill It Trains:**
- Logical reasoning and deduction
- Algebraic manipulation
- Proof structure and rigor
- Mathematical problem-solving
- Pattern recognition in proofs
- Efficiency optimization

**What Mastery Looks Like:**
- Consistently produces minimal-step proofs
- Recognizes proof patterns across domains
- Combines multiple techniques elegantly
- Maintains >95% correctness rate
- Achieves elegance scores >8/10 on advanced problems

**Target Audience:**
- **Primary:** Intermediate (students, professionals using math)
- **Secondary:** Advanced (math enthusiasts, researchers)
- **Tertiary:** Foundations (learners building math confidence)

**Why It Fits Ransford's Notes:**
- Complements logic and reasoning courses
- Teaches mathematical thinking, not rote calculation
- Browser-only enables offline practice
- Challenge codes enable safe proof sharing
- Post-run explainability teaches proof techniques
- No dark patterns - pure skill development

---

## SECTION 2 — Core Loop as State Machine

**State Machine Flow:**

```
[START] → Menu
    ↓
Menu → Mode Select (Learn / Practice / Daily / Weekly Ladder)
    ↓
Mode Select → Topic Track Selection (if Practice/Learn)
    ↓
Topic Track Selection:
  - Algebra
  - Number Theory
  - Probability
  - Calculus Basics
  - Logic
    ↓
[INITIALIZE] → Puzzle Setup
    ↓
Puzzle Setup:
  - Display Target Statement
  - Display Allowed Moves (toolbox)
  - Display Constraints (max steps, hint tokens)
  - Display Starting State (axioms, given statements)
    ↓
[PUZZLE LOOP] → Proof Construction
    ├─ [STEP PLANNING]
    │   ├─ View Current State (derived statements)
    │   ├─ View Available Moves (filtered by applicability)
    │   ├─ Preview Move Result (what statement would be created)
    │   └─ Select Move + Parameters
    │
    ├─ [MOVE EXECUTION]
    │   ├─ Validate Move (check prerequisites)
    │   ├─ Apply Move (update state)
    │   ├─ Update Step Counter
    │   ├─ Update Penalty (if applicable)
    │   └─ Check for Target Statement
    │
    ├─ [VALIDATION]
    │   ├─ Check Proof Correctness (all steps valid)
    │   ├─ Check Step Limit (if exceeded, fail)
    │   └─ Check Target Reached (if yes, win)
    │
    └─ [END STEP] → Loop continues or transitions
        ↓
[END STATE] → Win or Fail
    ↓
Win/Fail → Post-Run Analysis
    ↓
Post-Run Analysis:
  - Proof Correctness Check
  - Step Count Analysis
  - Elegance Scoring
  - Mistake Identification (if failed)
    ↓
Post-Run Analysis → Meta Progression Update
    ↓
Meta Progression Update:
  - Award XP
  - Update Mastery Tiers
  - Unlock New Move Types (if tier reached)
  - Update Personal Best
  - Update Streak
  - Store Challenge Code
    ↓
[RETURN TO MENU]
```

**Key State Variables:**
- `currentState: Statement[]` (derived statements)
- `targetStatement: Statement` (goal to prove)
- `stepCount: number` (current steps used)
- `maxSteps: number` (step limit)
- `penalty: number` (cumulative penalty for powerful moves)
- `availableMoves: Move[]` (filtered by current state)
- `proofHistory: ProofStep[]` (for explainability)
- `hintTokens: number` (remaining hints)
- `topicTrack: string` (algebra, number-theory, etc.)

---

## SECTION 3 — Strategic Decision Points

**Decision 1: Powerful Move vs Simple Steps**

**Trade-off:**
- **Powerful Move (e.g., "Apply Theorem X"):** Completes multiple steps at once but increases penalty, which reduces final score
- **Simple Steps (e.g., "Apply Axiom Y"):** Takes more steps but no penalty, potentially better elegance score

**State Impact:**
- Powerful moves reduce step count but increase penalty multiplier
- Simple steps increase step count but maintain zero penalty
- Final score = (100 - stepCount) * (1 - penalty) * eleganceBonus
- Choice affects both efficiency and elegance

**Example Scenario:**
- Target: Prove `(a+b)^2 = a^2 + 2ab + b^2`
- Powerful Move: "Expand Binomial" (1 step, penalty 0.1)
- Simple Steps: "Distribute", "Combine Like Terms", "Simplify" (3 steps, no penalty)
- Optimal: Depends on step limit and elegance preferences

**Decision 2: Shortest Proof vs Safest Proof**

**Trade-off:**
- **Optimize for Steps:** Use riskier moves that might fail, restart if wrong
- **Optimize for Safety:** Use only guaranteed-correct moves, slower but reliable

**State Impact:**
- Risky moves can lead to dead ends (require undo/restart)
- Safe moves are guaranteed correct but might not be optimal
- Time pressure (in daily/weekly modes) favors safe moves
- Step limit favors risky optimization

**Decision 3: Use Hint Token vs Save for Later**

**Trade-off:**
- **Use Hint Now:** Reveals next optimal step, saves time/restarts, but limited tokens
- **Save for Later:** Might need hint for harder step, but wastes time on current step

**State Impact:**
- Hints reveal optimal next move (doesn't solve, just suggests)
- Limited hint tokens (1-3 per puzzle depending on difficulty)
- Using hint early might waste it if puzzle is easier than expected
- Saving hint might lead to dead end requiring restart

**Example Scenario:**
- Stuck on step 3 of 8-step proof
- Hint available (2 tokens remaining)
- Choice: Use hint now (reveals step 3) vs try alternative approaches
- Risk: Alternative might work (save hint) vs alternative leads to dead end (waste time)

---

## SECTION 4 — Progression Model (Browser Only)

**localStorage Schema:**

```typescript
interface ProofSprintProgress {
  version: 1;
  
  // Mastery Progression
  xp: number;
  currentTier: 'beginner' | 'student' | 'scholar' | 'theorist' | 'master';
  tierProgress: number;
  
  // Unlocks
  unlockedMoves: string[];           // Move types (theorems, techniques)
  unlockedTracks: string[];          // Topic tracks (start with 2, unlock 3 more)
  unlockedPuzzlePacks: string[];     // Puzzle collections
  
  // Personal Bests
  personalBests: {
    [puzzleId: string]: {
      bestSteps: number;             // Minimal steps achieved
      bestScore: number;             // Best score (steps + elegance)
      bestElegance: number;          // Best elegance score (0-10)
      completionCount: number;       // Times completed
    };
  };
  
  // Streaks
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: string;
  
  // Challenge History
  completedChallenges: {
    challengeCode: string;
    completedDate: string;
    steps: number;
    score: number;
    elegance: number;
  }[];
  
  // Statistics
  stats: {
    puzzlesSolved: number;
    totalSteps: number;
    averageElegance: number;
    hintsUsed: number;
    restarts: number;
    topicTrackStats: {
      [track: string]: {
        puzzlesSolved: number;
        averageSteps: number;
        averageElegance: number;
      };
    };
  };
}
```

**Progression Gates:**

- **Tier 1 (Beginner → Student):** 100 XP, unlocks 3 move types, 1 topic track
- **Tier 2 (Student → Scholar):** 300 XP, unlocks 5 move types, 1 topic track, puzzle packs
- **Tier 3 (Scholar → Theorist):** 600 XP, unlocks 8 move types, 1 topic track, advanced puzzles
- **Tier 4 (Theorist → Master):** 1000 XP, unlocks all move types, all tracks, expert puzzles

**XP Award Formula:**
```
baseXP = 50 (solve) or 10 (attempt)
stepBonus = (maxSteps - actualSteps) * 2
eleganceBonus = eleganceScore * 5
penaltyPenalty = penalty * 20 (reduces XP)
hintPenalty = hintsUsed * 5 (reduces XP)
trackMultiplier = 1.0 (easy tracks) to 2.0 (hard tracks)

totalXP = (baseXP + stepBonus + eleganceBonus - penaltyPenalty - hintPenalty) * trackMultiplier
```

---

## SECTION 5 — Difficulty Model with Structural Phases

**Phase 1: Guided Proofs (Beginner)**
- **Step Limit:** Generous (15-20 steps)
- **Move Set:** Small (5-8 basic moves)
- **Complexity:** Linear proofs (A → B → C → Target)
- **Hints:** 3 tokens
- **Penalty System:** None (all moves have same cost)

**Structural Changes:**
- Proofs follow single path
- Moves have clear prerequisites
- Target statements are simple
- No decoy moves (all moves are useful)

**Phase 2: Expanded Toolset (Intermediate)**
- **Step Limit:** Moderate (10-15 steps)
- **Move Set:** Medium (12-15 moves including some powerful ones)
- **Complexity:** Branching proofs (multiple paths to target)
- **Hints:** 2 tokens
- **Penalty System:** Introduced (powerful moves have penalty)

**Structural Changes:**
- Multiple proof paths possible
- Some moves are more efficient but have penalty
- Decoy moves appear (look useful but lead to dead ends)
- Proofs require combining techniques

**Phase 3: Multi-Lemma Proofs (Advanced)**
- **Step Limit:** Tight (8-12 steps)
- **Move Set:** Large (20+ moves)
- **Complexity:** Requires proving lemmas first, then main theorem
- **Hints:** 1 token
- **Penalty System:** Active (penalty affects final score significantly)

**Structural Changes:**
- Proofs require intermediate lemmas
- Lemma proofs unlock main proof steps
- Dead ends are more common
- Elegance scoring becomes important (affects final score)

**Phase 4: Optimization Constraints (Expert)**
- **Step Limit:** Very Tight (6-10 steps)
- **Move Set:** Full (all moves)
- **Complexity:** Hidden invariants, non-obvious connections
- **Hints:** 0-1 token
- **Penalty System:** Critical (high penalty can fail puzzle even if correct)

**Structural Changes:**
- Proofs have hidden structure (invariants not stated)
- Optimization is required (step limit is near-optimal)
- Penalty system can cause failure even with correct proof
- Elegance is mandatory (low elegance = fail)

**Difficulty Tiers by Topic:**

**Algebra Track:**
- Beginner: Linear equations, basic factoring
- Intermediate: Quadratic equations, polynomial manipulation
- Advanced: System of equations, complex factorization
- Expert: Abstract algebra concepts, group theory basics

**Number Theory Track:**
- Beginner: Divisibility, prime numbers
- Intermediate: Modular arithmetic, GCD/LCM
- Advanced: Chinese Remainder Theorem, Fermat's Little Theorem
- Expert: Number theory proofs, Diophantine equations

**Probability Track:**
- Beginner: Basic probability, independence
- Intermediate: Conditional probability, Bayes' theorem
- Advanced: Random variables, expectations
- Expert: Advanced probability theory, stochastic processes

**Calculus Track:**
- Beginner: Limits, basic derivatives
- Intermediate: Chain rule, product rule, integrals
- Advanced: Multivariable calculus, series
- Expert: Advanced calculus proofs, analysis

**Logic Track:**
- Beginner: Boolean logic, truth tables
- Intermediate: Predicate logic, quantifiers
- Advanced: Proof techniques (contradiction, induction)
- Expert: Formal logic, modal logic

---

## SECTION 6 — Replay Hooks and Safe Competition

**Hook 1: Daily Proof Puzzle**
- **Format:** `PROF-YYYY-MM-DD-XXXX` challenge code
- **Mechanics:** Same puzzle seed for all players on same date (UTC)
- **Content:** One puzzle from rotating topic tracks, difficulty scales with player tier
- **Competition:** Personal best tracking (best steps, best score, best elegance)
- **Storage:** Challenge code stored with completion status
- **Sharing:** Players can share codes to compare proof approaches

**Hook 2: Weekly Ladder (5-Puzzle Set)**
- **Format:** Weekly puzzle sets (7-day cycles)
- **Mechanics:** 5 puzzles in sequence, cumulative score, increasing difficulty
- **Content:** Puzzles from different topic tracks, requires diverse skills
- **Competition:** Weekly leaderboard (localStorage only, anonymous scores)
- **Unlock:** Completing weekly ladder unlocks special move types
- **Storage:** Weekly completion status and scores

**Hook 3: Personal Best Ladder**
- **Format:** Per-puzzle personal bests
- **Mechanics:** Track best steps, best score, best elegance per puzzle ID
- **Competition:** Self-improvement (compare your proofs over time)
- **Display:** Progress dashboard showing improvement trends
- **Storage:** Personal bests in progression data

**Hook 4: Topic Track Mastery**
- **Format:** Per-track completion and mastery
- **Mechanics:** Complete puzzles in each track to unlock track-specific content
- **Competition:** Track completion percentage (self-progress)
- **Display:** Mastery dashboard showing track progress
- **Storage:** Track stats in progression data

**Hook 5: Elegance Leaderboard**
- **Format:** Elegance scores for solved puzzles
- **Mechanics:** Compare elegance scores (0-10 scale) for same puzzles
- **Competition:** Self-comparison (improve your elegance over time)
- **Display:** Elegance trends in progress dashboard
- **Storage:** Elegance scores in personal bests

**Safe Competition Mechanisms:**
- **No Real-Time Multiplayer:** All competition is async via challenge codes
- **Anonymous Scores:** Only scores stored, no player identification
- **Local Leaderboards:** Weekly leaderboards are device-local
- **Shareable Codes:** Players can share codes to compare proof approaches

---

## SECTION 7 — Post Run Explainability

**Post-Run Report Structure:**

**Section 1: Outcome Summary**
- Solved/Unsolved result
- Steps used vs step limit
- Final score breakdown
- Elegance score (0-10)

**Section 2: Proof Analysis**

*If Solved:*
- **Proof Correctness:** All steps validated
- **Step Efficiency:** Steps used vs optimal steps
- **Elegance Assessment:** Why elegance score (technique choice, step combination)
- **Optimal Path:** Shown optimal proof path (if different from player's)

*If Unsolved:*
- **Failure Point:** First step where proof became invalid or dead end reached
- **Why It Failed:** Explanation of why that step didn't work
- **Alternative Approaches:** Suggested alternative steps at failure point

**Section 3: Key Decision Points (Top 3)**

*Example (Solved):*
1. **Step 3 - Applied "Distribute" Move**
   - **Your Choice:** Used distribution to expand expression
   - **Impact:** Correct approach, enabled step 4
   - **Why It Mattered:** This was the optimal first step, set up rest of proof

2. **Step 5 - Applied "Factor" Move (Powerful)**
   - **Your Choice:** Used factorization (penalty 0.1) instead of multiple simple steps
   - **Impact:** Saved 2 steps but incurred penalty
   - **Why It Mattered:** Trade-off between step count and penalty, acceptable choice

3. **Step 7 - Used Hint Token**
   - **Your Choice:** Used hint when stuck
   - **Impact:** Revealed optimal next step, prevented dead end
   - **Why It Mattered:** Hint usage was justified (prevented restart)

**Section 4: Mistakes and Inefficiencies (Top 3)**

*Example:*
1. **Inefficient Step Sequence: Steps 2-4**
   - **What Happened:** Used 3 steps where 2 would suffice
   - **Impact:** Reduced step efficiency, lower final score
   - **Recommendation:** Combine steps 2-3 into single "Simplify" move

2. **Penalty Accumulation: 0.15 Total**
   - **What Happened:** Used 3 powerful moves, accumulated penalty
   - **Impact:** Reduced final score by 15%
   - **Recommendation:** Use powerful moves only when they save 2+ steps

3. **Dead End Attempt: Step 6 (Undone)**
   - **What Happened:** Attempted move that led to dead end, had to undo
   - **Impact:** Wasted time, no step penalty but inefficiency
   - **Recommendation:** Check move prerequisites more carefully, use hint if uncertain

**Section 5: Recommended Strategy Adjustment**

*Example:*
- **Current Approach:** Prefer simple steps, avoid penalties
- **Performance:** Good correctness (100%) but low efficiency (used 12/10 steps)
- **Recommended Adjustment:** Use powerful moves more strategically
- **Rationale:** Your proof technique is solid, but you're being too conservative. Powerful moves are worth the penalty when they save 2+ steps.

**Deterministic Calculation:**
- All analysis based on proof history (stored in state)
- Optimal proof calculated using graph search (all possible move sequences)
- Elegance scored using rule-based criteria (technique variety, step combination quality)
- Recommendations based on performance patterns (rule-based)

---

## SECTION 8 — UI and UX Specification

**Main Screen Layout:**

```
┌─────────────────────────────────────────────────────────┐
│ [Header: Steps: 5/10 | Score: 85 | Elegance: 8.5 | Hints: 1] │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Target Statement (Top)                                   │
│  ┌─────────────────────────────────────────────────┐     │
│  │ Prove: (a+b)^2 = a^2 + 2ab + b^2                │     │
│  └─────────────────────────────────────────────────┘     │
│                                                           │
│  Current State (Middle - Scrollable)                      │
│  ┌─────────────────────────────────────────────────┐     │
│  │ Step 1: Given: a, b are real numbers            │     │
│  │ Step 2: (a+b)^2 = (a+b)(a+b)  [Expand]          │     │
│  │ Step 3: = a(a+b) + b(a+b)      [Distribute]     │     │
│  │ Step 4: = a^2 + ab + ab + b^2  [Expand]         │     │
│  │ Step 5: = a^2 + 2ab + b^2      [Simplify] ✓     │     │
│  └─────────────────────────────────────────────────┘     │
│                                                           │
│  Available Moves (Bottom - Scrollable)                    │
│  [Distribute] [Factor] [Simplify] [Substitute] [Hint]    │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

**Mobile Control Scheme:**

- **Move Selection:** Tap move button to select
- **Statement Selection:** Tap statement in current state to use as input
- **Move Execution:** Tap "Apply" button to execute move
- **Undo:** Swipe left on step to undo
- **Hint:** Long-press move button to see hint for that move
- **All targets:** Minimum 44x44px

**Visual Design Cues:**

- **Target Statement:** Highlighted box, always visible
- **Current Steps:** Numbered list, color-coded by move type
- **Completed Steps:** Green checkmark
- **Available Moves:** Button grid, grayed out if prerequisites not met
- **Step Limit:** Progress bar, color-coded (green >50% remaining, yellow 25-50%, red <25%)
- **Elegance Score:** Star rating (0-10 stars)
- **Penalty Indicator:** Warning icon when penalty would be applied
- **High Contrast:** All text meets WCAG AA
- **Color Independence:** Icons + text for all information

**Progress Communication:**

- **Step Counter:** Clear X/Y display in header
- **Score Display:** Always visible in header
- **Elegance Display:** Star rating in header
- **Hint Tokens:** Token icons in header

**Consequence Communication:**

- **Move Execution:** Immediate visual feedback (step appears, state updates)
- **Invalid Move:** Error message with explanation
- **Step Limit Exceeded:** Warning when approaching limit
- **Target Reached:** Celebration animation
- **Dead End:** Warning message, suggest undo

**Minimum Viable Animations:**

- **Step Addition:** Slide-in animation (200ms)
- **Move Execution:** Brief flash (100ms)
- **Target Reached:** Celebration animation (500ms)
- **Invalid Move:** Shake animation (200ms)
- **All animations:** Respect `prefers-reduced-motion`

**Performance Targets:**

- **Initial Load:** <1s
- **Move Execution:** <200ms
- **Undo:** <200ms
- **Frame Rate:** 60fps
- **Memory:** <30MB

---

## SECTION 9 — Capability Flags for Hub

```typescript
{
  id: "proof-sprint",
  title: "Proof Sprint",
  description: "Build correct mathematical proofs under step constraints. Optimize for elegance and efficiency.",
  category: "logic",
  modes: ["solo", "daily"],
  supportsDaily: true,
  supportsPractice: true,
  supportsLearn: true,          // Tutorial mode with guided proofs
  supportsAsyncCompetition: true, // Via challenge codes
  hasProgression: true,
  estimatedSessionMins: 10,
  primarySkills: [
    "mathematics",
    "logical-reasoning",
    "proof-techniques",
    "problem-solving",
    "algebra"
  ],
  difficulty: "intermediate",
  supportsMultiplayer: false,
  minPlayers: 1,
  maxPlayers: 1,
  tutorialAvailable: true
}
```

---

## SECTION 10 — Implementation Shape

**Module Structure:**

```
src/lib/games/games/proof-sprint/
├── types.ts                      # Type definitions
├── gameState.ts                  # Pure state management
├── puzzleGenerator.ts            # Seeded puzzle generation
├── moveEngine.ts                 # Move validation and execution
├── proofValidator.ts             # Proof correctness checking
├── eleganceScorer.ts             # Elegance score calculation
├── optimalSolver.ts              # Optimal proof finder (for analysis)
├── explainabilityAnalyzer.ts     # Post-run analysis
├── moveDefinitions.ts            # Move types and rules
├── puzzleDefinitions.ts          # Puzzle collections
├── topicTracks.ts                # Topic track definitions
├── persistence.ts                # localStorage schema
├── ProofSprint.tsx               # Main React component
└── index.ts                      # Exports
```

**Engine (Pure State Updates):**

- **gameState.ts:** Pure functions
  - `initializePuzzle(seed, puzzleId, difficulty): GameState`
  - `executeMove(state, move, parameters): GameState`
  - `checkTargetReached(state): boolean`
  - `checkStepLimitExceeded(state): boolean`

- **moveEngine.ts:** Pure functions
  - `validateMove(state, move, parameters): ValidationResult`
  - `applyMove(state, move, parameters): GameState`
  - `getAvailableMoves(state): Move[]`

- **proofValidator.ts:** Pure functions
  - `validateProof(state): ValidationResult`
  - `validateStep(step, previousState): boolean`

**RNG (Seeded):**

- **puzzleGenerator.ts:** Deterministic puzzle generation
  - `generatePuzzle(seed, topicTrack, difficulty): Puzzle`
  - Uses `SeededRNG` from framework

**Storage (Versioned Schema):**

- **persistence.ts:** localStorage management
  - Schema versioning
  - Migration functions
  - Challenge code integration

**Renderer (UI):**

- **ProofSprint.tsx:** Main React component
  - Uses `GameShell`
  - Integrates sharing components
  - Mobile-responsive
  - Keyboard navigation

**Tests:**

- **gameState.test.ts:** State transitions
- **moveEngine.test.ts:** Move validation and execution
- **proofValidator.test.ts:** Proof correctness
- **eleganceScorer.test.ts:** Elegance scoring

**Relative Complexity: M-L (Medium-Large)**

**Key Risks:**

1. **Complexity Risk:** Proof validation and move generation can be complex
   - **Mitigation:** Start with simple move types, expand gradually

2. **Balance Risk:** Step limits and penalties must be balanced
   - **Mitigation:** Extensive playtesting, configurable parameters

3. **Elegance Risk:** Elegance scoring might be subjective
   - **Mitigation:** Rule-based criteria, clear guidelines

4. **Performance Risk:** Optimal solver (for analysis) might be slow
   - **Mitigation:** Limit search depth, cache results, make optional

5. **Mobile UX Risk:** Proof editing might be hard on mobile
   - **Mitigation:** Large touch targets, gesture support, mobile-first design

---

# GAME 8: ALLOCATION ARCHITECT (Resource Optimisation)

## SECTION 1 — Game Identity

**One Sentence Pitch:**  
Build optimal resource allocation plans across competing projects under constraints, balancing multiple objectives while managing risk events and diminishing returns over a planning horizon.

**Skill It Trains:**
- Resource optimization
- Constraint satisfaction
- Multi-objective decision making
- Prioritization under uncertainty
- Marginal utility thinking
- Risk management

**What Mastery Looks Like:**
- Consistently meets all objectives within constraints
- Achieves >90% resource utilization efficiency
- Balances short-term and long-term objectives optimally
- Adapts plans effectively to risk events
- Achieves top-tier scores (90+) on advanced scenarios

**Target Audience:**
- **Primary:** Intermediate (project managers, planners, analysts)
- **Secondary:** Advanced (experienced strategists)
- **Tertiary:** Foundations (learners exploring optimization)

**Why It Fits Ransford's Notes:**
- Teaches practical planning and optimization skills
- Complements Systems Mastery with tactical planning focus
- Browser-only enables offline practice
- Challenge codes enable plan comparison
- Post-run explainability teaches optimization techniques
- No dark patterns - pure skill development

---

## SECTION 2 — Core Loop as State Machine

**State Machine Flow:**

```
[START] → Menu
    ↓
Menu → Mode Select (Learn / Practice / Daily)
    ↓
Mode Select → Scenario Selection (if Practice)
    ↓
Scenario Selection → Pre-Run Planning
    ↓
Pre-Run Planning:
  - Review Scenario Brief (objectives, constraints, resources)
  - Select Planning Horizon (6, 8, 10 rounds)
  - Review Initial State (starting resources, project states)
    ↓
[INITIALIZE] → Round Loop Begins
    ↓
Round Loop (6-10 rounds depending on horizon):
  ├─ [ROUND START]
  │   ├─ Display Current State (resources, project progress, constraints)
  │   ├─ Generate Random Events (if applicable, seeded)
  │   ├─ Update Project States (progress, requirements)
  │   └─ Calculate Current Metrics (objective progress, constraint status)
  │
  ├─ [ALLOCATION PHASE]
  │   ├─ View Projects (list with requirements, progress, returns)
  │   ├─ Allocate Resources (distribute budget/time across projects)
  │   ├─ Preview Outcomes (projected progress, constraint violations)
  │   ├─ Adjust Allocation (refine distribution)
  │   └─ Confirm Allocation
  │
  ├─ [RESOLUTION PHASE]
  │   ├─ Apply Allocation (deterministic based on seed)
  │   ├─ Update Project Progress (with diminishing returns)
  │   ├─ Check Constraint Violations
  │   ├─ Calculate Objective Progress
  │   ├─ Apply Random Events (if any, seeded)
  │   └─ Generate Feedback (success indicators, warnings)
  │
  ├─ [PHASE CHECK]
  │   ├─ Check Win Condition: All Objectives Met AND No Constraint Violations
  │   ├─ Check Loss Condition: Constraint Violation OR Objectives Unmet at End
  │   └─ Check Round Limit: Continue or End
  │
  └─ [END ROUND] → Loop continues or transitions
      ↓
[END STATE] → Win or Lose
    ↓
Win/Lose → Post-Run Report
    ↓
Post-Run Report → Meta Progression Update
    ↓
Meta Progression Update:
  - Award XP
  - Update Mastery Tiers
  - Unlock New Scenarios (if tier reached)
  - Update Personal Best
  - Update Streak
  - Store Challenge Code (includes plan summary)
    ↓
[RETURN TO MENU]
```

**Key State Variables:**
- `currentRound: number` (1-10)
- `totalRounds: number` (planning horizon)
- `resourceBudget: number` (available resources per round)
- `projects: Project[]` (all projects with progress, requirements)
- `objectives: Objective[]` (win conditions)
- `constraints: Constraint[]` (hard limits)
- `allocationHistory: Allocation[]` (for explainability)
- `randomEvents: Event[]` (seeded events)
- `metrics: Metrics` (objective progress, constraint status)

---

## SECTION 3 — Strategic Decision Points

**Decision 1: Concentrate Investment vs Diversify**

**Trade-off:**
- **Concentrate:** Put all resources into 1-2 projects for maximum progress, higher risk if project fails or events affect it
- **Diversify:** Spread resources across many projects, lower risk but slower progress, diminishing returns reduce efficiency

**State Impact:**
- Concentration: Projects complete faster, but vulnerability to single-point failures
- Diversification: Slower progress, but resilience to events
- Random events favor diversification (affect single projects)
- Objectives favor concentration (need projects completed quickly)

**Example Scenario:**
- 3 projects need completion, 5 rounds remaining
- Concentrate: Complete 2 projects fast, risk 3rd fails
- Diversify: All projects progress slowly, might not complete any
- Optimal: Concentrate on critical path, diversify risk mitigation

**Decision 2: Short-Term Metrics vs Long-Term Resilience**

**Trade-off:**
- **Short-Term Focus:** Optimize for immediate objective progress, faster wins, but may create technical debt or resource exhaustion
- **Long-Term Focus:** Invest in infrastructure/robustness, slower progress but better resilience to events

**State Impact:**
- Short-term: Higher immediate objective scores, but constraints may tighten later
- Long-term: Lower immediate scores, but better constraint compliance and event resilience
- Objectives often reward short-term (per-round scoring)
- Constraints and events reward long-term (multi-round impact)

**Decision 3: Robustness Investment vs Performance Optimization**

**Trade-off:**
- **Robustness:** Allocate resources to buffer projects against failures, reduces risk but slower progress
- **Performance:** Allocate resources directly to progress, faster completion but vulnerable to events

**State Impact:**
- Robustness: Projects have "health" buffer, survive events but progress slower
- Performance: Projects progress faster but fail completely if events occur
- Events favor robustness (failures don't destroy projects)
- Objectives favor performance (need completion speed)

**Example Scenario:**
- Project needs 100 resources to complete
- Robustness option: Allocate 120 resources (20 buffer), survives 1 failure event
- Performance option: Allocate 100 resources exactly, fails if event occurs
- Risk assessment: Probability of event vs cost of buffer

---

## SECTION 4 — Progression Model (Browser Only)

**localStorage Schema:**

```typescript
interface AllocationArchitectProgress {
  version: 1;
  
  // Mastery Progression
  xp: number;
  currentTier: 'planner' | 'strategist' | 'architect' | 'master' | 'legend';
  tierProgress: number;
  
  // Unlocks
  unlockedScenarios: string[];        // Scenario packs
  unlockedHorizons: number[];         // Planning horizon options (start with 6, unlock 8, 10)
  unlockedConstraints: string[];      // Constraint types (budget, time, capacity, etc.)
  
  // Personal Bests
  personalBests: {
    [scenarioId: string]: {
      bestScore: number;              // Highest score (objective achievement + efficiency)
      bestEfficiency: number;         // Best resource utilization (0-100%)
      bestCompletionRounds: number;   // Fastest completion (rounds used)
    };
  };
  
  // Streaks
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: string;
  
  // Challenge History
  completedChallenges: {
    challengeCode: string;
    completedDate: string;
    score: number;
    efficiency: number;
    planHash: string;                 // Compact representation of allocation strategy
  }[];
  
  // Statistics
  stats: {
    scenariosCompleted: number;
    averageEfficiency: number;
    averageScore: number;
    constraintViolations: number;
    eventResilience: number;          // Percentage of events survived
    scenarioTypeStats: {
      [scenarioType: string]: {
        completed: number;
        averageScore: number;
        averageEfficiency: number;
      };
    };
  };
}
```

**Progression Gates:**

- **Tier 1 (Planner → Strategist):** 100 XP, unlocks 3 scenarios, 8-round horizon
- **Tier 2 (Strategist → Architect):** 300 XP, unlocks 5 scenarios, 10-round horizon, new constraint types
- **Tier 3 (Architect → Master):** 600 XP, unlocks 8 scenarios, all constraint types, advanced scenarios
- **Tier 4 (Master → Legend):** 1000 XP, unlocks all scenarios, expert difficulty, all features

**XP Award Formula:**
```
baseXP = 50 (win) or 10 (loss)
objectiveBonus = (objectivesMet / totalObjectives) * 40
efficiencyBonus = (resourceEfficiency) * 30
constraintPenalty = (constraintViolations) * 10 (reduces XP)
roundBonus = (totalRounds - roundsUsed) * 2
scenarioMultiplier = 1.0 (easy) to 2.0 (expert)

totalXP = (baseXP + objectiveBonus + efficiencyBonus - constraintPenalty + roundBonus) * scenarioMultiplier
```

---

## SECTION 5 — Difficulty Model with Structural Phases

**Phase 1: Single Objective (Rounds 1-3)**
- **Objective Count:** 1 primary objective
- **Constraint Count:** 1-2 simple constraints
- **Project Count:** 3-4 projects
- **Resource Budget:** Generous (120% of minimum needed)
- **Random Events:** None or rare (10% chance per round)
- **Diminishing Returns:** Mild (linear progress)

**Structural Changes:**
- Simple objective (complete X projects)
- Single constraint type (budget or time)
- Linear resource-to-progress mapping
- No interdependencies between projects

**Phase 2: Dual Objectives (Rounds 4-6)**
- **Objective Count:** 2 objectives with potential tension
- **Constraint Count:** 2-3 constraints
- **Project Count:** 5-6 projects
- **Resource Budget:** Moderate (100% of minimum needed)
- **Random Events:** Occasional (20% chance per round)
- **Diminishing Returns:** Moderate (quadratic decay)

**Structural Changes:**
- Two objectives may conflict (complete projects vs optimize efficiency)
- Multiple constraint types (budget + time + capacity)
- Diminishing returns (more resources needed per unit progress)
- Project dependencies (some projects unlock others)

**Phase 3: Multi-Objective Risk (Rounds 7-9)**
- **Objective Count:** 3+ objectives
- **Constraint Count:** 3-4 constraints with interactions
- **Project Count:** 7-8 projects
- **Resource Budget:** Tight (90% of minimum needed)
- **Random Events:** Frequent (30% chance per round)
- **Diminishing Returns:** Strong (exponential decay)

**Structural Changes:**
- Multiple objectives with complex interactions
- Constraint interactions (violating one affects others)
- Strong diminishing returns (efficiency drops significantly)
- Event cascades (events trigger other events)
- Project interdependencies (completing one affects others)

**Phase 4: Near-Infeasible (Round 10+)**
- **Objective Count:** 4+ objectives
- **Constraint Count:** 4-5 tight constraints
- **Project Count:** 9-10 projects
- **Resource Budget:** Critical (80% of minimum needed)
- **Random Events:** Very frequent (40% chance per round)
- **Diminishing Returns:** Extreme (logarithmic progress)

**Structural Changes:**
- Objectives are nearly impossible to meet all at once
- Constraints are tight (small violations fail)
- Extreme diminishing returns (marginal utility near zero)
- Adversarial events (target your weakest projects)
- Complex interdependencies (completing projects creates new constraints)

**Difficulty Tiers:**

**Foundations Tier:**
- Phases 1-2 only (6 rounds)
- Generous resources
- Simple constraints
- Rare events

**Intermediate Tier:**
- Phases 1-3 (9 rounds)
- Standard resources
- Standard constraints
- Occasional events

**Advanced Tier:**
- All Phases 1-4 (10 rounds)
- Tight resources
- Complex constraints
- Frequent events

**Expert Tier:**
- All Phases 1-4 (10 rounds)
- Critical resources
- Maximum constraints
- Very frequent events
- Adversarial behavior

---

## SECTION 6 — Replay Hooks and Safe Competition

**Hook 1: Daily Scenario**
- **Format:** `ALOC-YYYY-MM-DD-XXXX` challenge code
- **Mechanics:** Same scenario seed for all players on same date (UTC)
- **Content:** Same scenario parameters, same event sequence
- **Competition:** Personal best tracking (best score, best efficiency, fastest completion)
- **Storage:** Challenge code stored with completion status
- **Sharing:** Players can share codes to compare allocation strategies (plan hashes)

**Hook 2: Weekly Scenario Pack**
- **Format:** Weekly scenario rotation (7-day cycles)
- **Mechanics:** 3 scenarios per week, increasing difficulty
- **Content:** Different scenario types (budget optimization, time management, capacity planning)
- **Competition:** Weekly leaderboard (localStorage only, anonymous scores)
- **Unlock:** Completing weekly scenarios unlocks special scenario packs
- **Storage:** Weekly completion status

**Hook 3: Plan Code Sharing**
- **Format:** Compact representation of allocation strategy (plan hash)
- **Mechanics:** Players can generate plan codes for their allocation strategy
- **Competition:** Compare plan efficiency on same scenario (via score comparison)
- **Sharing:** Plan codes shared via challenge codes (includes scenario + plan)
- **Storage:** Plan codes in challenge code system

**Hook 4: Personal Best Ladder**
- **Format:** Per-scenario personal bests
- **Mechanics:** Track best score, best efficiency, fastest completion per scenario
- **Competition:** Self-improvement (compare your plans over time)
- **Display:** Progress dashboard showing improvement trends
- **Storage:** Personal bests in progression data

**Hook 5: Efficiency Leaderboard**
- **Format:** Resource utilization efficiency scores
- **Mechanics:** Compare efficiency (0-100%) for same scenarios
- **Competition:** Self-comparison (improve efficiency over time)
- **Display:** Efficiency trends in progress dashboard
- **Storage:** Efficiency scores in personal bests

**Safe Competition Mechanisms:**
- **No Real-Time Multiplayer:** All competition is async via challenge codes
- **Anonymous Scores:** Only scores stored, no player identification
- **Local Leaderboards:** Weekly leaderboards are device-local
- **Shareable Codes:** Players can share codes to compare strategies

---

## SECTION 7 — Post Run Explainability

**Post-Run Report Structure:**

**Section 1: Outcome Summary**
- Win/Loss result
- Objectives met vs total objectives
- Resource efficiency percentage
- Constraint violations (if any)
- Rounds used vs total rounds

**Section 2: Key Decision Points (Top 3)**

*Example:*
1. **Round 3 - Concentration Strategy**
   - **Your Choice:** Allocated 80% resources to 2 critical projects
   - **Impact:** Completed projects early, enabled round 4-5 focus on others
   - **Why It Mattered:** Concentration strategy was optimal for this scenario's objectives

2. **Round 5 - Robustness Investment**
   - **Your Choice:** Allocated 20% extra resources as buffer
   - **Impact:** Project survived random event in round 6
   - **Why It Mattered:** Robustness investment prevented failure, maintained objective progress

3. **Round 7 - Constraint Violation Avoidance**
   - **Your Choice:** Reduced allocation to avoid constraint violation
   - **Impact:** Maintained constraint compliance but slowed objective progress
   - **Why It Mattered:** Constraint violations would have failed scenario, trade-off was necessary

**Section 3: Mistakes and Inefficiencies (Top 3)**

*Example:*
1. **Low Resource Utilization: 75% Average**
   - **What Happened:** Ended rounds with unused resources
   - **Cost:** Missed opportunity to accelerate project progress
   - **Recommendation:** Allocate resources more aggressively, use full budget each round

2. **Late Robustness Investment: Round 6**
   - **What Happened:** Added robustness buffer too late, event occurred before buffer was sufficient
   - **Cost:** Project failed despite buffer attempt
   - **Recommendation:** Invest in robustness earlier, anticipate events

3. **Inefficient Project Sequencing**
   - **What Happened:** Completed projects in suboptimal order, created bottlenecks
   - **Cost:** Delayed dependent projects, reduced overall efficiency
   - **Recommendation:** Analyze project dependencies, prioritize critical path

**Section 4: Recommended Strategy Adjustment**

*Example:*
- **Current Strategy:** Diversified allocation, moderate robustness
- **Performance:** Good constraint compliance (100%) but low efficiency (70%)
- **Recommended Adjustment:** Try concentration strategy with early robustness investment
- **Rationale:** Your constraint management is excellent, but you're being too conservative with allocation. Concentration would improve efficiency while early robustness maintains resilience.

**Deterministic Calculation:**
- All analysis based on allocation history (stored in state)
- Optimal allocation calculated using constraint optimization algorithms
- Efficiency calculated from resource utilization and objective achievement
- Recommendations based on performance patterns (rule-based)

---

## SECTION 8 — UI and UX Specification

**Main Screen Layout:**

```
┌─────────────────────────────────────────────────────────┐
│ [Header: Round 5/10 | Budget: 450/500 | Efficiency: 85%] │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Objectives Panel (Top)                                   │
│  ┌─────────────────────────────────────────────────┐     │
│  │ Objective 1: Complete 5 projects [████████░░] 80% │     │
│  │ Objective 2: Maintain efficiency >75% [██████████] 100% │
│  └─────────────────────────────────────────────────┘     │
│                                                           │
│  Projects Panel (Middle - Scrollable)                     │
│  ┌─────────────────────────────────────────────────┐     │
│  │ Project A: [Progress Bar] [Allocate: [50] ░░░░] │     │
│  │ Project B: [Progress Bar] [Allocate: [30] ░░░░] │     │
│  │ Project C: [Progress Bar] [Allocate: [20] ░░░░] │     │
│  └─────────────────────────────────────────────────┘     │
│                                                           │
│  Constraints Panel (Bottom)                               │
│  ┌─────────────────────────────────────────────────┐     │
│  │ Budget: 450/500 (90%) [Warning: <100 remaining] │     │
│  │ Time: 3/5 rounds remaining                       │     │
│  └─────────────────────────────────────────────────┘     │
│                                                           │
│  Action Panel (Bottom Right)                              │
│  [Preview] [Confirm Allocation] [Reset]                  │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

**Mobile Control Scheme:**

- **Allocation:** Drag slider or tap +/- buttons to adjust allocation
- **Project Selection:** Tap project card to focus (shows details)
- **Preview:** Tap preview button to see projected outcomes
- **Confirm:** Swipe up or tap confirm button
- **Reset:** Long-press project to reset allocation
- **All targets:** Minimum 44x44px

**Visual Design Cues:**

- **Objectives:** Progress bars with color coding (green=met, yellow=progressing, red=failing)
- **Projects:** Cards with progress bars, requirement indicators, return curves
- **Constraints:** Warning indicators (yellow=approaching limit, red=violation)
- **Resource Budget:** Visual tokens or progress bar
- **Efficiency:** Percentage display with color coding (green>80%, yellow 60-80%, red<60%)
- **Allocation:** Sliders with snap points, visual feedback
- **High Contrast:** All text meets WCAG AA
- **Color Independence:** Icons + text for all information

**Progress Communication:**

- **Round Counter:** Clear X/Y display in header
- **Budget Display:** Always visible in header
- **Efficiency Display:** Percentage in header
- **Objective Progress:** Progress bars in objectives panel

**Consequence Communication:**

- **Allocation Preview:** Show projected outcomes before confirmation
- **Constraint Warnings:** Visual warnings when approaching limits
- **Objective Updates:** Animated progress bar updates
- **Event Notifications:** Modal alerts for random events

**Minimum Viable Animations:**

- **Allocation Change:** Smooth slider movement (100ms)
- **Progress Update:** Progress bar animation (300ms)
- **Constraint Warning:** Pulse animation (200ms)
- **Event Notification:** Slide-in animation (300ms)
- **All animations:** Respect `prefers-reduced-motion`

**Performance Targets:**

- **Initial Load:** <1s
- **Allocation Update:** <100ms
- **Preview Calculation:** <200ms
- **Frame Rate:** 60fps
- **Memory:** <40MB

---

## SECTION 9 — Capability Flags for Hub

```typescript
{
  id: "allocation-architect",
  title: "Allocation Architect",
  description: "Build optimal resource allocation plans under constraints. Balance multiple objectives while managing risk events.",
  category: "strategy",
  modes: ["solo", "daily"],
  supportsDaily: true,
  supportsPractice: true,
  supportsLearn: true,
  supportsAsyncCompetition: true, // Via challenge codes and plan codes
  hasProgression: true,
  estimatedSessionMins: 12,
  primarySkills: [
    "optimization",
    "resource-management",
    "constraint-satisfaction",
    "strategic-planning",
    "risk-management"
  ],
  difficulty: "intermediate",
  supportsMultiplayer: false,
  minPlayers: 1,
  maxPlayers: 1,
  tutorialAvailable: true
}
```

---

## SECTION 10 — Implementation Shape

**Module Structure:**

```
src/lib/games/games/allocation-architect/
├── types.ts                      # Type definitions
├── gameState.ts                  # Pure state management
├── scenarioGenerator.ts          # Seeded scenario generation
├── allocationEngine.ts           # Allocation validation and application
├── constraintEngine.ts           # Constraint checking
├── objectiveCalculator.ts        # Objective progress calculation
├── eventEngine.ts                # Random event generation and application
├── efficiencyCalculator.ts       # Resource efficiency calculation
├── explainabilityAnalyzer.ts     # Post-run analysis
├── scenarioDefinitions.ts        # Scenario packs
├── constraintDefinitions.ts      # Constraint types
├── persistence.ts                # localStorage schema
├── AllocationArchitect.tsx       # Main React component
└── index.ts                      # Exports
```

**Engine (Pure State Updates):**

- **gameState.ts:** Pure functions
  - `initializeScenario(seed, scenarioId, horizon): GameState`
  - `applyAllocation(state, allocation): GameState`
  - `checkWinCondition(state): boolean`
  - `checkLossCondition(state): boolean`

- **allocationEngine.ts:** Pure functions
  - `validateAllocation(state, allocation): ValidationResult`
  - `applyAllocation(state, allocation): GameState`
  - `calculateProjectedOutcomes(state, allocation): ProjectedState`

- **constraintEngine.ts:** Pure functions
  - `checkConstraints(state): ConstraintStatus[]`
  - `validateAllocationAgainstConstraints(allocation, constraints): boolean`

**RNG (Seeded):**

- **scenarioGenerator.ts:** Deterministic scenario generation
  - `generateScenario(seed, scenarioType, difficulty): Scenario`
  - Uses `SeededRNG` from framework

- **eventEngine.ts:** Deterministic event generation
  - `generateEvents(seed, round, scenario): Event[]`
  - Uses `SeededRNG` from framework

**Storage (Versioned Schema):**

- **persistence.ts:** localStorage management
  - Schema versioning
  - Migration functions
  - Challenge code integration
  - Plan code generation

**Renderer (UI):**

- **AllocationArchitect.tsx:** Main React component
  - Uses `GameShell`
  - Integrates sharing components
  - Mobile-responsive
  - Keyboard navigation
  - Slider controls

**Tests:**

- **gameState.test.ts:** State transitions
- **allocationEngine.test.ts:** Allocation validation and application
- **constraintEngine.test.ts:** Constraint checking
- **efficiencyCalculator.test.ts:** Efficiency calculation

**Relative Complexity: M (Medium)**

**Key Risks:**

1. **Complexity Risk:** Constraint optimization can be computationally complex
   - **Mitigation:** Use efficient algorithms, limit constraint count, cache calculations

2. **Balance Risk:** Resource budgets and constraints must be carefully balanced
   - **Mitigation:** Extensive playtesting, configurable parameters

3. **UX Risk:** Allocation interface might be complex on mobile
   - **Mitigation:** Mobile-first design, large touch targets, intuitive sliders

4. **Performance Risk:** Preview calculations might be slow
   - **Mitigation:** Efficient calculations, debounce inputs, optimize algorithms

5. **Explainability Risk:** Post-run analysis might not be insightful
   - **Mitigation:** Rule-based analysis, clear decision trees, extensive testing

---

# GAME 9: PACKET ROUTE (Network Routing Strategy)

## SECTION 1 — Game Identity

**One Sentence Pitch:**  
Design and optimize routing policies for network topologies under changing traffic patterns and failures, balancing latency, throughput, and resilience to meet SLA targets.

**Skill It Trains:**
- Network routing and topology thinking
- Graph algorithms and pathfinding
- Congestion management
- Resilience planning
- Performance optimization
- Failure analysis

**What Mastery Looks Like:**
- Consistently meets SLA targets (latency, throughput, loss)
- Maintains >95% availability during failures
- Optimizes for both performance and resilience
- Recognizes bottleneck patterns quickly
- Achieves top-tier scores (90+) on complex topologies

**Target Audience:**
- **Primary:** Intermediate (network engineers, systems designers)
- **Secondary:** Advanced (experienced network architects)
- **Tertiary:** Foundations (learners exploring network concepts)

**Why It Fits Ransford's Notes:**
- Teaches practical network design skills
- Complements Systems Mastery with network-specific focus
- Browser-only enables offline practice
- Challenge codes enable topology comparison
- Post-run explainability teaches routing principles
- No dark patterns - pure skill development

---

## SECTION 2 — Core Loop as State Machine

**State Machine Flow:**

```
[START] → Menu
    ↓
Menu → Mode Select (Learn / Practice / Daily)
    ↓
Mode Select → Topology Selection (if Practice)
    ↓
Topology Selection → Pre-Run Planning
    ↓
Pre-Run Planning:
  - Review Topology (nodes, links, capacities, latencies)
  - Select Routing Policy Type (shortest path, load balanced, resilient)
  - Review Initial Traffic Patterns
  - Set SLA Targets (latency, throughput, loss thresholds)
    ↓
[INITIALIZE] → Simulation Loop Begins
    ↓
Simulation Loop (20-40 ticks depending on difficulty):
  ├─ [TICK START]
  │   ├─ Update Traffic Patterns (seeded changes)
  │   ├─ Apply Failures (if any, seeded)
  │   ├─ Calculate Current Routes (based on policy)
  │   ├─ Simulate Packet Flow (deterministic routing)
  │   └─ Calculate Metrics (latency, throughput, loss, congestion)
  │
  ├─ [PLAYER DECISION PHASE]
  │   ├─ View Network State (graph visualization, metrics)
  │   ├─ Identify Bottlenecks (highlighted congestion points)
  │   ├─ Adjust Routing Policy (change routes, load balancing rules)
  │   ├─ Preview Changes (projected metrics)
  │   └─ Confirm Policy Changes
  │
  ├─ [RESOLUTION PHASE]
  │   ├─ Apply Policy Changes
  │   ├─ Recalculate Routes
  │   ├─ Update Packet Flow
  │   ├─ Update Metrics
  │   ├─ Check SLA Compliance
  │   └─ Generate Feedback (SLA status, warnings)
  │
  ├─ [PHASE CHECK]
  │   ├─ Check Win Condition: SLA Met for N Ticks AND No Critical Failures
  │   ├─ Check Loss Condition: SLA Violation OR Critical Failure
  │   └─ Check Tick Limit: Continue or End
  │
  └─ [END TICK] → Loop continues or transitions
      ↓
[END STATE] → Win or Lose
    ↓
Win/Lose → Post-Run Report
    ↓
Post-Run Report → Meta Progression Update
    ↓
Meta Progression Update:
  - Award XP
  - Update Mastery Tiers
  - Unlock New Topologies (if tier reached)
  - Update Personal Best
  - Update Streak
  - Store Challenge Code (includes topology + policy)
    ↓
[RETURN TO MENU]
```

**Key State Variables:**
- `currentTick: number` (1-40)
- `totalTicks: number` (simulation length)
- `topology: Topology` (nodes, links, capacities, latencies)
- `routingPolicy: RoutingPolicy` (route tables, load balancing rules)
- `trafficPatterns: TrafficPattern[]` (current traffic flows)
- `failures: Failure[]` (active link/node failures)
- `metrics: Metrics` (latency, throughput, loss, congestion)
- `slaTargets: SLATargets` (latency max, throughput min, loss max)
- `policyHistory: PolicyChange[]` (for explainability)

---

## SECTION 3 — Strategic Decision Points

**Decision 1: Lowest Latency Path vs Congestion Avoidance**

**Trade-off:**
- **Shortest Path:** Route packets through lowest-latency paths, fastest delivery but may create congestion
- **Congestion Avoidance:** Route packets through alternative paths to avoid congestion, higher latency but better throughput

**State Impact:**
- Shortest path: Lower latency but may saturate links, cause packet loss
- Congestion avoidance: Higher latency but better link utilization, lower loss
- SLA targets favor shortest path (latency requirement)
- Traffic volume favors congestion avoidance (throughput requirement)

**Example Scenario:**
- Source A to Destination B: Shortest path 10ms, alternative 15ms
- Shortest path: 2 links, capacity 1000 pkts/s, current load 900 pkts/s
- Alternative path: 3 links, capacity 2000 pkts/s, current load 500 pkts/s
- Optimal: Use shortest path if load <80%, switch to alternative if congested

**Decision 2: Spare Capacity for Failures vs Maximum Utilization**

**Trade-off:**
- **Reserve Capacity:** Keep links at <70% utilization to handle failures, better resilience but lower efficiency
- **Maximum Utilization:** Use links at 90%+ utilization for performance, better efficiency but vulnerable to failures

**State Impact:**
- Reserve capacity: Survives failures (reroutes work) but wastes resources
- Maximum utilization: High performance but fails if link/node fails (no capacity for reroute)
- Failures favor reserve capacity (need reroute capacity)
- Objectives favor maximum utilization (need throughput)

**Decision 3: Centralized Policy vs Local Heuristics**

**Trade-off:**
- **Centralized:** Single routing policy for all flows, optimal global routing but slower to adapt
- **Local Heuristics:** Per-flow routing decisions, faster adaptation but suboptimal globally

**State Impact:**
- Centralized: Better global optimization, but slow to respond to local changes
- Local heuristics: Fast adaptation, but may create suboptimal routing patterns
- Stability favors centralized (predictable routing)
- Volatility favors local (rapid adaptation)

**Example Scenario:**
- Traffic patterns change frequently (bursty)
- Centralized policy: Recalculates all routes on change, optimal but slow
- Local heuristics: Each flow adapts independently, fast but may conflict
- Optimal: Hybrid approach (centralized baseline, local adjustments)

---

## SECTION 4 — Progression Model (Browser Only)

**localStorage Schema:**

```typescript
interface PacketRouteProgress {
  version: 1;
  
  // Mastery Progression
  xp: number;
  currentTier: 'operator' | 'engineer' | 'architect' | 'master' | 'legend';
  tierProgress: number;
  
  // Unlocks
  unlockedTopologies: string[];      // Topology types (mesh, star, ring, etc.)
  unlockedPolicyTypes: string[];     // Routing policy types
  unlockedTools: string[];           // Analysis tools (bottleneck detector, etc.)
  
  // Personal Bests
  personalBests: {
    [topologyId: string]: {
      bestScore: number;             // Highest score (SLA compliance + efficiency)
      bestLatency: number;           // Best average latency
      bestThroughput: number;        // Best throughput
      bestAvailability: number;      // Best availability during failures
    };
  };
  
  // Streaks
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: string;
  
  // Challenge History
  completedChallenges: {
    challengeCode: string;
    completedDate: string;
    score: number;
    latency: number;
    throughput: number;
    availability: number;
    policyHash: string;              // Compact representation of routing policy
  }[];
  
  // Statistics
  stats: {
    topologiesCompleted: number;
    averageLatency: number;
    averageThroughput: number;
    averageAvailability: number;
    bottleneckIdentifications: number;
    policyChanges: number;
    topologyTypeStats: {
      [topologyType: string]: {
        completed: number;
        averageScore: number;
        averageLatency: number;
      };
    };
  };
}
```

**Progression Gates:**

- **Tier 1 (Operator → Engineer):** 100 XP, unlocks 3 topologies, basic policy types
- **Tier 2 (Engineer → Architect):** 300 XP, unlocks 5 topologies, advanced policy types, analysis tools
- **Tier 3 (Architect → Master):** 600 XP, unlocks 8 topologies, all policy types, expert topologies
- **Tier 4 (Master → Legend):** 1000 XP, unlocks all topologies, all tools, expert difficulty

**XP Award Formula:**
```
baseXP = 50 (win) or 10 (loss)
slaBonus = (slaCompliancePercentage) * 40
latencyBonus = (targetLatency / actualLatency) * 20
throughputBonus = (actualThroughput / targetThroughput) * 20
availabilityBonus = (availabilityDuringFailures) * 20
efficiencyPenalty = (wastedCapacity / totalCapacity) * 10 (reduces XP)
topologyMultiplier = 1.0 (simple) to 2.0 (complex)

totalXP = (baseXP + slaBonus + latencyBonus + throughputBonus + availabilityBonus - efficiencyPenalty) * topologyMultiplier
```

---

## SECTION 5 — Difficulty Model with Structural Phases

**Phase 1: Stable Traffic (Ticks 1-10)**
- **Topology Complexity:** Simple (5-10 nodes, 8-15 links)
- **Traffic Patterns:** Stable (constant flows, predictable)
- **Failure Rate:** None or rare (5% chance per tick)
- **SLA Targets:** Relaxed (high latency threshold, low throughput requirement)
- **Link Capacity:** Generous (150% of peak demand)

**Structural Changes:**
- Simple topologies (star, linear, small mesh)
- Constant traffic patterns
- No or rare failures
- Simple routing (shortest path sufficient)

**Phase 2: Bursty Traffic (Ticks 11-20)**
- **Topology Complexity:** Moderate (10-15 nodes, 15-25 links)
- **Traffic Patterns:** Bursty (variable flows, peaks and valleys)
- **Failure Rate:** Occasional (10% chance per tick)
- **SLA Targets:** Standard (moderate latency, moderate throughput)
- **Link Capacity:** Moderate (120% of peak demand)

**Structural Changes:**
- Moderate topologies (larger mesh, tree structures)
- Variable traffic patterns (bursts, surges)
- Occasional failures (single link/node)
- Routing requires load balancing

**Phase 3: Failures and Recovery (Ticks 21-30)**
- **Topology Complexity:** Complex (15-20 nodes, 25-35 links)
- **Traffic Patterns:** Volatile (rapid changes, unpredictable)
- **Failure Rate:** Frequent (20% chance per tick)
- **SLA Targets:** Tight (low latency, high throughput)
- **Link Capacity:** Tight (110% of peak demand)

**Structural Changes:**
- Complex topologies (large mesh, redundant paths)
- Volatile traffic patterns (rapid changes)
- Frequent failures (multiple links/nodes)
- Routing requires resilience planning (redundant paths)

**Phase 4: Correlated Failures (Ticks 31-40)**
- **Topology Complexity:** Very Complex (20+ nodes, 35+ links)
- **Traffic Patterns:** Adversarial (targets weak points)
- **Failure Rate:** Very Frequent (30% chance per tick)
- **SLA Targets:** Very Tight (very low latency, very high throughput)
- **Link Capacity:** Critical (105% of peak demand)

**Structural Changes:**
- Very complex topologies (large scale, many redundant paths)
- Adversarial traffic patterns (targets bottlenecks)
- Correlated failures (failures cascade, affect multiple links)
- Routing requires sophisticated policies (multi-path, adaptive)

**Difficulty Tiers:**

**Foundations Tier:**
- Phases 1-2 only (20 ticks)
- Simple topologies
- Stable traffic
- Rare failures

**Intermediate Tier:**
- Phases 1-3 (30 ticks)
- Moderate topologies
- Variable traffic
- Occasional failures

**Advanced Tier:**
- All Phases 1-4 (40 ticks)
- Complex topologies
- Volatile traffic
- Frequent failures

**Expert Tier:**
- All Phases 1-4 (40 ticks)
- Very complex topologies
- Adversarial traffic
- Very frequent failures
- Correlated failures

---

## SECTION 6 — Replay Hooks and Safe Competition

**Hook 1: Daily Topology Challenge**
- **Format:** `PKRT-YYYY-MM-DD-XXXX` challenge code
- **Mechanics:** Same topology and traffic seed for all players on same date (UTC)
- **Content:** Same topology, same traffic patterns, same failure sequence
- **Competition:** Personal best tracking (best score, best latency, best throughput, best availability)
- **Storage:** Challenge code stored with completion status
- **Sharing:** Players can share codes to compare routing policies (policy hashes)

**Hook 2: Weekly Topology Rotation**
- **Format:** Weekly topology packs (7-day cycles)
- **Mechanics:** 3 topologies per week, increasing complexity
- **Content:** Different topology types (mesh, star, tree, hybrid)
- **Competition:** Weekly leaderboard (localStorage only, anonymous scores)
- **Unlock:** Completing weekly topologies unlocks special topology packs
- **Storage:** Weekly completion status

**Hook 3: Policy Code Sharing**
- **Format:** Compact representation of routing policy (policy hash)
- **Mechanics:** Players can generate policy codes for their routing strategy
- **Competition:** Compare policy performance on same topology (via score comparison)
- **Sharing:** Policy codes shared via challenge codes (includes topology + policy)
- **Storage:** Policy codes in challenge code system

**Hook 4: Personal Best Ladder**
- **Format:** Per-topology personal bests
- **Mechanics:** Track best score, best latency, best throughput, best availability per topology
- **Competition:** Self-improvement (compare your policies over time)
- **Display:** Progress dashboard showing improvement trends
- **Storage:** Personal bests in progression data

**Hook 5: Availability Leaderboard**
- **Format:** Network availability during failures
- **Mechanics:** Compare availability (0-100%) for same topologies
- **Competition:** Self-comparison (improve availability over time)
- **Display:** Availability trends in progress dashboard
- **Storage:** Availability scores in personal bests

**Safe Competition Mechanisms:**
- **No Real-Time Multiplayer:** All competition is async via challenge codes
- **Anonymous Scores:** Only scores stored, no player identification
- **Local Leaderboards:** Weekly leaderboards are device-local
- **Shareable Codes:** Players can share codes to compare policies

---

## SECTION 7 — Post Run Explainability

**Post-Run Report Structure:**

**Section 1: Outcome Summary**
- Win/Loss result
- SLA compliance percentage
- Average latency, throughput, loss
- Availability during failures
- Ticks completed vs total ticks

**Section 2: Key Decision Points (Top 3)**

*Example:*
1. **Tick 15 - Congestion Avoidance**
   - **Your Choice:** Rerouted traffic from congested shortest path to alternative path
   - **Impact:** Reduced latency by 20ms, improved throughput by 30%
   - **Why It Mattered:** Congestion avoidance was critical for SLA compliance during traffic burst

2. **Tick 22 - Failure Resilience**
   - **Your Choice:** Maintained reserve capacity on backup paths
   - **Impact:** Survived link failure without SLA violation
   - **Why It Mattered:** Reserve capacity enabled seamless reroute, maintained availability

3. **Tick 28 - Policy Adaptation**
   - **Your Choice:** Switched from centralized to local heuristics for volatile traffic
   - **Impact:** Improved adaptation speed, maintained SLA compliance
   - **Why It Mattered:** Local heuristics better suited for rapid traffic changes

**Section 3: Mistakes and Inefficiencies (Top 3)**

*Example:*
1. **Bottleneck Identification: Late (Tick 18)**
   - **What Happened:** Identified congestion bottleneck too late, SLA violation occurred
   - **Cost:** Temporary SLA violation, reduced score
   - **Recommendation:** Monitor link utilization proactively, set alerts at 80% capacity

2. **Over-Provisioning: Excessive Reserve Capacity**
   - **What Happened:** Maintained 40% reserve capacity, wasted resources
   - **Cost:** Lower throughput, reduced efficiency
   - **Recommendation:** Optimize reserve capacity (20-30% sufficient for most failures)

3. **Inefficient Routing: Suboptimal Path Selection**
   - **What Happened:** Used longer paths when shorter paths available
   - **Cost:** Higher latency, reduced performance
   - **Recommendation:** Review routing policy, optimize path selection algorithms

**Section 4: Recommended Strategy Adjustment**

*Example:*
- **Current Strategy:** Centralized policy, moderate reserve capacity
- **Performance:** Good stability (100% availability) but slow adaptation (latency spikes)
- **Recommended Adjustment:** Try hybrid approach (centralized baseline, local adjustments)
- **Rationale:** Your stability is excellent, but you need faster adaptation for volatile traffic. Hybrid approach maintains stability while enabling rapid local adjustments.

**Deterministic Calculation:**
- All analysis based on policy history (stored in state)
- Optimal routing calculated using graph algorithms (shortest path, max flow)
- Bottleneck identification based on link utilization and packet loss
- Recommendations based on performance patterns (rule-based)

---

## SECTION 8 — UI and UX Specification

**Main Screen Layout:**

```
┌─────────────────────────────────────────────────────────┐
│ [Header: Tick 25/40 | Latency: 45ms | Throughput: 850 | Loss: 0.2%] │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Network Graph View (Primary Area)                       │
│  ┌─────────────────────────────────────────────────┐     │
│  │        [Node A]────[Node B]────[Node C]         │     │
│  │         │            │            │              │     │
│  │        [Node D]────[Node E]────[Node F]         │     │
│  │  [Link colors: Green=low load, Yellow=medium, Red=high] │
│  └─────────────────────────────────────────────────┘     │
│                                                           │
│  SLA Panel (Bottom Left)                                  │
│  ┌─────────────────────────────────────────────────┐     │
│  │ Latency: 45/50ms [████████░░] 90%               │     │
│  │ Throughput: 850/800 [██████████] 100%           │     │
│  │ Loss: 0.2/1.0% [██████████] 100%                │     │
│  └─────────────────────────────────────────────────┘     │
│                                                           │
│  Policy Panel (Bottom Right)                              │
│  [Edit Routes] [Load Balancing] [Failover] [Apply]       │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

**Mobile Control Scheme:**

- **Graph Interaction:** Pinch to zoom, drag to pan
- **Node Selection:** Tap node to select (shows details)
- **Link Selection:** Tap link to select (shows metrics)
- **Policy Editing:** Tap policy button to open editor
- **Apply Changes:** Swipe up or tap apply button
- **All targets:** Minimum 44x44px

**Visual Design Cues:**

- **Network Graph:** Nodes as circles, links as lines
- **Link Colors:** Green (low load <50%), Yellow (medium 50-80%), Red (high >80%)
- **Node Colors:** Blue (normal), Orange (high traffic), Red (failure)
- **SLA Indicators:** Progress bars with color coding (green=met, yellow=warning, red=violation)
- **Traffic Flow:** Animated arrows on links (optional, can disable)
- **Bottleneck Highlights:** Pulsing red nodes/links
- **High Contrast:** All elements meet WCAG AA
- **Color Independence:** Icons + text for all information

**Progress Communication:**

- **Tick Counter:** Clear X/Y display in header
- **SLA Metrics:** Always visible in header
- **Link Utilization:** Color coding on links
- **Node Status:** Color coding on nodes

**Consequence Communication:**

- **Policy Preview:** Show projected metrics before applying
- **SLA Warnings:** Visual warnings when approaching limits
- **Failure Notifications:** Modal alerts for failures
- **Bottleneck Alerts:** Highlight congested links/nodes

**Minimum Viable Animations:**

- **Graph Interaction:** Smooth zoom/pan (60fps)
- **Link Color Change:** Smooth transition (300ms)
- **Traffic Flow:** Optional animated arrows (can disable)
- **Failure Notification:** Slide-in animation (300ms)
- **All animations:** Respect `prefers-reduced-motion`

**Performance Targets:**

- **Initial Load:** <1s
- **Graph Rendering:** 60fps
- **Policy Update:** <200ms
- **Memory:** <60MB (graph rendering)

---

## SECTION 9 — Capability Flags for Hub

```typescript
{
  id: "packet-route",
  title: "Packet Route",
  description: "Design routing policies for network topologies. Balance latency, throughput, and resilience to meet SLA targets.",
  category: "strategy",
  modes: ["solo", "daily"],
  supportsDaily: true,
  supportsPractice: true,
  supportsLearn: true,
  supportsAsyncCompetition: true, // Via challenge codes and policy codes
  hasProgression: true,
  estimatedSessionMins: 15,
  primarySkills: [
    "networking",
    "routing",
    "graph-algorithms",
    "congestion-control",
    "resilience-planning"
  ],
  difficulty: "intermediate",
  supportsMultiplayer: false,
  minPlayers: 1,
  maxPlayers: 1,
  tutorialAvailable: true
}
```

---

## SECTION 10 — Implementation Shape

**Module Structure:**

```
src/lib/games/games/packet-route/
├── types.ts                      # Type definitions
├── gameState.ts                  # Pure state management
├── topologyGenerator.ts          # Seeded topology generation
├── routingEngine.ts              # Route calculation and packet flow
├── trafficGenerator.ts           # Seeded traffic pattern generation
├── failureEngine.ts              # Seeded failure generation and application
├── metricsCalculator.ts          # Latency, throughput, loss calculation
├── slaChecker.ts                 # SLA compliance checking
├── explainabilityAnalyzer.ts     # Post-run analysis
├── topologyDefinitions.ts        # Topology types
├── policyDefinitions.ts          # Routing policy types
├── graphRenderer.ts              # Graph visualization (Canvas/SVG)
├── persistence.ts                # localStorage schema
├── PacketRoute.tsx               # Main React component
└── index.ts                      # Exports
```

**Engine (Pure State Updates):**

- **gameState.ts:** Pure functions
  - `initializeTopology(seed, topologyId, difficulty): GameState`
  - `applyRoutingPolicy(state, policy): GameState`
  - `simulateTick(state): GameState`
  - `checkWinCondition(state): boolean`
  - `checkLossCondition(state): boolean`

- **routingEngine.ts:** Pure functions
  - `calculateRoutes(topology, policy, traffic): RouteTable`
  - `simulatePacketFlow(topology, routes, traffic): PacketFlow`
  - `updateRoutingPolicy(state, policyChanges): GameState`

- **trafficGenerator.ts:** Deterministic traffic generation
  - `generateTrafficPattern(seed, tick, topology): TrafficPattern`
  - Uses `SeededRNG` from framework

- **failureEngine.ts:** Deterministic failure generation
  - `generateFailures(seed, tick, topology): Failure[]`
  - Uses `SeededRNG` from framework

**RNG (Seeded):**

- **topologyGenerator.ts:** Deterministic topology generation
  - `generateTopology(seed, topologyType, difficulty): Topology`
  - Uses `SeededRNG` from framework

**Storage (Versioned Schema):**

- **persistence.ts:** localStorage management
  - Schema versioning
  - Migration functions
  - Challenge code integration
  - Policy code generation

**Renderer (UI):**

- **PacketRoute.tsx:** Main React component
  - Uses `GameShell`
  - Integrates sharing components
  - Mobile-responsive
  - Keyboard navigation
  - Graph visualization (Canvas or SVG)

- **graphRenderer.ts:** Graph rendering utilities
  - Canvas or SVG-based rendering
  - Zoom/pan support
  - Node/link interaction
  - Performance optimized

**Tests:**

- **gameState.test.ts:** State transitions
- **routingEngine.test.ts:** Route calculation and packet flow
- **metricsCalculator.test.ts:** Metrics calculation
- **slaChecker.test.ts:** SLA compliance checking

**Relative Complexity: M-L (Medium-Large)**

**Key Risks:**

1. **Complexity Risk:** Graph algorithms and routing simulation can be complex
   - **Mitigation:** Use efficient algorithms (Dijkstra, max flow), optimize calculations

2. **Performance Risk:** Graph rendering and simulation might be slow
   - **Mitigation:** Efficient rendering (Canvas), optimize algorithms, limit node/link count

3. **UX Risk:** Graph interaction might be difficult on mobile
   - **Mitigation:** Mobile-first design, pinch-to-zoom, large touch targets, gesture support

4. **Balance Risk:** SLA targets and topology parameters must be balanced
   - **Mitigation:** Extensive playtesting, configurable parameters

5. **Explainability Risk:** Post-run analysis might not be insightful
   - **Mitigation:** Rule-based analysis, clear decision trees, extensive testing

---

# GAME 10: GOVERNANCE SIMULATOR (Policy and Risk Trade offs)

## SECTION 1 — Game Identity

**One Sentence Pitch:**  
Make governance decisions under uncertainty, balancing controls, incentives, and stakeholder alignment while managing unintended consequences over multiple turns.

**Skill It Trains:**
- Governance reasoning and policy design
- Risk trade-off analysis
- Stakeholder management
- Long-horizon strategic thinking
- Systems thinking (second-order effects)
- Decision-making under uncertainty

**What Mastery Looks Like:**
- Maintains trust and outcomes over long horizons
- Balances controls without over-controlling
- Anticipates second-order effects
- Achieves >90% stakeholder satisfaction
- Achieves top-tier scores (90+) on complex scenarios

**Target Audience:**
- **Primary:** Advanced (governance professionals, policy makers, senior leaders)
- **Secondary:** Intermediate (managers, team leads)
- **Tertiary:** Foundations (learners exploring governance concepts)

**Why It Fits Ransford's Notes:**
- Teaches practical governance skills
- Complements Systems Mastery with governance-specific focus
- Browser-only enables offline practice
- Challenge codes enable strategy comparison
- Post-run explainability teaches governance principles
- No dark patterns - pure skill development

---

## SECTION 2 — Core Loop as State Machine

**State Machine Flow:**

```
[START] → Menu
    ↓
Menu → Mode Select (Learn / Practice / Daily / Weekly Board Review)
    ↓
Mode Select → Scenario Selection (if Practice)
    ↓
Scenario Selection → Pre-Run Planning
    ↓
Pre-Run Planning:
  - Review Scenario Context (domain, stakeholders, objectives)
  - Select Governance Strategy (controls, incentives, reporting, enforcement)
  - Review Initial State (stakeholder trust, risk levels, compliance)
  - Set Success Criteria (trust thresholds, outcome targets)
    ↓
[INITIALIZE] → Turn Loop Begins
    ↓
Turn Loop (8-12 turns depending on difficulty):
  ├─ [TURN START]
  │   ├─ Display Current State (stakeholder trust, risk levels, outcomes)
  │   ├─ Generate Events (incidents, scrutiny, budget shocks - seeded)
  │   ├─ Calculate Stakeholder Responses (based on governance strategy)
  │   └─ Update Metrics (trust, compliance, innovation, cost)
  │
  ├─ [DECISION PHASE]
  │   ├─ View Governance Dashboard (current policy settings, metrics)
  │   ├─ Review Stakeholder Feedback (satisfaction, concerns)
  │   ├─ Assess Risk Levels (current risks, emerging risks)
  │   ├─ Adjust Governance Strategy (change controls, incentives, etc.)
  │   ├─ Preview Consequences (projected stakeholder responses, risk changes)
  │   └─ Confirm Decisions
  │
  ├─ [RESOLUTION PHASE]
  │   ├─ Apply Governance Changes (deterministic based on seed)
  │   ├─ Calculate Stakeholder Responses (compliance, innovation, trust changes)
  │   ├─ Update Risk Levels (risk mitigation, new risks)
  │   ├─ Apply Events (incident impacts, scrutiny effects)
  │   ├─ Calculate Outcomes (objective progress, metrics)
  │   └─ Generate Feedback (success indicators, warnings)
  │
  ├─ [PHASE CHECK]
  │   ├─ Check Win Condition: Trust > Threshold AND Outcomes Met AND No Major Incidents
  │   ├─ Check Loss Condition: Trust < Critical OR Major Incident OR Outcomes Failed
  │   └─ Check Turn Limit: Continue or End
  │
  └─ [END TURN] → Loop continues or transitions
      ↓
[END STATE] → Win or Lose
    ↓
Win/Lose → Post-Run Report
    ↓
Post-Run Report → Meta Progression Update
    ↓
Meta Progression Update:
  - Award XP
  - Update Mastery Tiers
  - Unlock New Scenarios (if tier reached)
  - Update Personal Best
  - Update Streak
  - Store Challenge Code (includes strategy summary)
    ↓
[RETURN TO MENU]
```

**Key State Variables:**
- `currentTurn: number` (1-12)
- `totalTurns: number` (planning horizon)
- `governanceStrategy: GovernanceStrategy` (controls, incentives, reporting, enforcement)
- `stakeholders: Stakeholder[]` (trust levels, satisfaction, compliance)
- `riskLevels: RiskLevel[]` (current risks, emerging risks)
- `outcomes: Outcome[]` (objective progress, metrics)
- `events: Event[]` (incidents, scrutiny, budget shocks)
- `decisionHistory: Decision[]` (for explainability)
- `metrics: Metrics` (trust, compliance, innovation, cost)

---

## SECTION 3 — Strategic Decision Points

**Decision 1: Strict Controls vs Innovation Speed**

**Trade-off:**
- **Strict Controls:** Tight governance, high compliance, lower risk, but slower innovation and lower stakeholder satisfaction
- **Loose Controls:** Flexible governance, faster innovation, higher satisfaction, but higher risk and lower compliance

**State Impact:**
- Strict controls: High compliance, low risk, but innovation penalty, trust may decrease
- Loose controls: High innovation, high trust, but risk increases, compliance may decrease
- Objectives favor strict (need compliance)
- Stakeholders favor loose (prefer innovation, autonomy)

**Example Scenario:**
- Scenario: Data sharing governance
- Strict controls: Require approval for all data sharing, high compliance, slow innovation
- Loose controls: Self-service data sharing, fast innovation, higher risk
- Optimal: Balanced approach (controls for sensitive data, loose for low-risk data)

**Decision 2: Transparency vs Gaming Risk**

**Trade-off:**
- **High Transparency:** Open reporting, clear metrics, builds trust, but stakeholders may game the system
- **Low Transparency:** Limited reporting, reduces gaming, but lower trust and stakeholder frustration

**State Impact:**
- High transparency: High trust, but stakeholders optimize for metrics (gaming)
- Low transparency: Low gaming, but low trust, stakeholders feel controlled
- Trust favors transparency (builds confidence)
- Outcomes favor low transparency (reduces gaming)

**Decision 3: Centralized Governance vs Local Autonomy**

**Trade-off:**
- **Centralized:** Single governance policy, consistent, efficient, but slow to adapt, lower local satisfaction
- **Local Autonomy:** Delegated governance, fast adaptation, high local satisfaction, but inconsistent, higher risk

**State Impact:**
- Centralized: Consistent outcomes, efficient, but slow adaptation, lower satisfaction
- Local autonomy: Fast adaptation, high satisfaction, but inconsistent outcomes, higher risk
- Consistency favors centralized (uniform outcomes)
- Adaptation favors local (rapid response)

**Example Scenario:**
- Scenario: AI governance
- Centralized: Single AI policy for all teams, consistent but slow
- Local autonomy: Teams set own policies, fast but inconsistent
- Optimal: Hybrid (centralized principles, local implementation)

---

## SECTION 4 — Progression Model (Browser Only)

**localStorage Schema:**

```typescript
interface GovernanceSimulatorProgress {
  version: 1;
  
  // Mastery Progression
  xp: number;
  currentTier: 'assistant' | 'manager' | 'director' | 'executive' | 'master';
  tierProgress: number;
  
  // Unlocks
  unlockedScenarios: string[];        // Scenario packs (data sharing, AI, cyber, etc.)
  unlockedStrategies: string[];       // Governance strategy types
  unlockedTools: string[];            // Analysis tools (risk predictor, etc.)
  
  // Personal Bests
  personalBests: {
    [scenarioId: string]: {
      bestScore: number;              // Highest score (trust + outcomes + stability)
      bestTrust: number;              // Best average trust level
      bestStability: number;          // Best stability (low volatility)
      bestOutcomes: number;           // Best outcome achievement
    };
  };
  
  // Streaks
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: string;
  
  // Challenge History
  completedChallenges: {
    challengeCode: string;
    completedDate: string;
    score: number;
    trust: number;
    stability: number;
    outcomes: number;
    strategyHash: string;             // Compact representation of governance strategy
  }[];
  
  // Statistics
  stats: {
    scenariosCompleted: number;
    averageTrust: number;
    averageStability: number;
    averageOutcomes: number;
    incidentsPrevented: number;
    stakeholderSatisfaction: number;
    scenarioTypeStats: {
      [scenarioType: string]: {
        completed: number;
        averageScore: number;
        averageTrust: number;
      };
    };
  };
}
```

**Progression Gates:**

- **Tier 1 (Assistant → Manager):** 100 XP, unlocks 2 scenarios, basic strategies
- **Tier 2 (Manager → Director):** 300 XP, unlocks 4 scenarios, advanced strategies, analysis tools
- **Tier 3 (Director → Executive):** 600 XP, unlocks 6 scenarios, all strategies, expert scenarios
- **Tier 4 (Executive → Master):** 1000 XP, unlocks all scenarios, all tools, expert difficulty

**XP Award Formula:**
```
baseXP = 50 (win) or 10 (loss)
trustBonus = (averageTrust) * 30
outcomeBonus = (outcomesAchieved / totalOutcomes) * 40
stabilityBonus = (1 - volatility) * 20
incidentPenalty = (incidentsOccurred) * 15 (reduces XP)
stakeholderPenalty = (1 - averageSatisfaction) * 10 (reduces XP)
scenarioMultiplier = 1.0 (easy) to 2.5 (expert)

totalXP = (baseXP + trustBonus + outcomeBonus + stabilityBonus - incidentPenalty - stakeholderPenalty) * scenarioMultiplier
```

---

## SECTION 5 — Difficulty Model with Structural Phases

**Phase 1: Single Stakeholder (Turns 1-3)**
- **Stakeholder Count:** 1 primary stakeholder
- **Risk Complexity:** Simple (single risk type)
- **Event Frequency:** None or rare (10% chance per turn)
- **Trust Threshold:** High (easy to maintain)
- **Outcome Complexity:** Single objective

**Structural Changes:**
- Simple stakeholder dynamics (single actor)
- Single risk type (data privacy, security, etc.)
- No or rare events
- Simple outcome tracking

**Phase 2: Dual Stakeholder Tensions (Turns 4-6)**
- **Stakeholder Count:** 2 stakeholders with conflicting interests
- **Risk Complexity:** Moderate (2-3 risk types)
- **Event Frequency:** Occasional (20% chance per turn)
- **Trust Threshold:** Moderate (requires balance)
- **Outcome Complexity:** Dual objectives with tension

**Structural Changes:**
- Stakeholder conflicts (data teams vs security teams)
- Multiple risk types (privacy, security, compliance)
- Occasional events (incidents, scrutiny)
- Conflicting objectives (innovation vs security)

**Phase 3: Incidents and Scrutiny (Turns 7-9)**
- **Stakeholder Count:** 3-4 stakeholders
- **Risk Complexity:** Complex (3-4 risk types with interactions)
- **Event Frequency:** Frequent (30% chance per turn)
- **Trust Threshold:** Tight (difficult to maintain)
- **Outcome Complexity:** Multiple objectives with interactions

**Structural Changes:**
- Multiple stakeholders with complex relationships
- Risk interactions (one risk affects others)
- Frequent events (incidents, scrutiny, budget shocks)
- Complex outcome tracking (interdependent objectives)

**Phase 4: Multi-Stakeholder Dynamics (Turns 10-12)**
- **Stakeholder Count:** 4-5 stakeholders
- **Risk Complexity:** Very Complex (4-5 risk types with strong interactions)
- **Event Frequency:** Very Frequent (40% chance per turn)
- **Trust Threshold:** Very Tight (near-impossible to maintain all)
- **Outcome Complexity:** Many objectives with strong interactions

**Structural Changes:**
- Many stakeholders with competing interests
- Strong risk interactions (cascading effects)
- Very frequent events (adversarial incidents)
- Complex outcome tracking (many interdependent objectives)
- Second-order effects (governance changes create new risks)

**Difficulty Tiers:**

**Foundations Tier:**
- Phases 1-2 only (6 turns)
- 1-2 stakeholders
- Simple risks
- Rare events

**Intermediate Tier:**
- Phases 1-3 (9 turns)
- 2-3 stakeholders
- Moderate risks
- Occasional events

**Advanced Tier:**
- All Phases 1-4 (12 turns)
- 3-4 stakeholders
- Complex risks
- Frequent events

**Expert Tier:**
- All Phases 1-4 (12 turns)
- 4-5 stakeholders
- Very complex risks
- Very frequent events
- Adversarial events

---

## SECTION 6 — Replay Hooks and Safe Competition

**Hook 1: Daily Governance Scenario**
- **Format:** `GOVN-YYYY-MM-DD-XXXX` challenge code
- **Mechanics:** Same scenario seed for all players on same date (UTC)
- **Content:** Same scenario context, same stakeholder setup, same event sequence
- **Competition:** Personal best tracking (best score, best trust, best stability, best outcomes)
- **Storage:** Challenge code stored with completion status
- **Sharing:** Players can share codes to compare governance strategies (strategy hashes)

**Hook 2: Weekly Board Review**
- **Format:** Weekly scenario packs (7-day cycles)
- **Mechanics:** 3 scenarios per week, increasing complexity
- **Content:** Different scenario types (data sharing, AI governance, cyber controls, interoperability)
- **Competition:** Weekly leaderboard (localStorage only, anonymous scores)
- **Unlock:** Completing weekly scenarios unlocks special scenario packs
- **Storage:** Weekly completion status

**Hook 3: Strategy Code Sharing**
- **Format:** Compact representation of governance strategy (strategy hash)
- **Mechanics:** Players can generate strategy codes for their governance approach
- **Competition:** Compare strategy performance on same scenario (via score comparison)
- **Sharing:** Strategy codes shared via challenge codes (includes scenario + strategy)
- **Storage:** Strategy codes in challenge code system

**Hook 4: Personal Best Ladder**
- **Format:** Per-scenario personal bests
- **Mechanics:** Track best score, best trust, best stability, best outcomes per scenario
- **Competition:** Self-improvement (compare your strategies over time)
- **Display:** Progress dashboard showing improvement trends
- **Storage:** Personal bests in progression data

**Hook 5: Trust Leaderboard**
- **Format:** Stakeholder trust levels
- **Mechanics:** Compare trust (0-100%) for same scenarios
- **Competition:** Self-comparison (improve trust over time)
- **Display:** Trust trends in progress dashboard
- **Storage:** Trust scores in personal bests

**Safe Competition Mechanisms:**
- **No Real-Time Multiplayer:** All competition is async via challenge codes
- **Anonymous Scores:** Only scores stored, no player identification
- **Local Leaderboards:** Weekly leaderboards are device-local
- **Shareable Codes:** Players can share codes to compare strategies

---

## SECTION 7 — Post Run Explainability

**Post-Run Report Structure:**

**Section 1: Outcome Summary**
- Win/Loss result
- Final trust levels by stakeholder
- Outcome achievement percentage
- Stability score (volatility)
- Incidents occurred (if any)

**Section 2: Key Decision Points (Top 3)**

*Example:*
1. **Turn 4 - Control Adjustment**
   - **Your Choice:** Tightened controls in response to incident
   - **Impact:** Increased compliance, reduced risk, but decreased innovation and stakeholder trust
   - **Why It Mattered:** Balance between risk management and stakeholder satisfaction was critical

2. **Turn 7 - Transparency Increase**
   - **Your Choice:** Increased reporting transparency
   - **Impact:** Improved stakeholder trust, but increased gaming behavior
   - **Why It Mattered:** Transparency trade-off between trust and gaming required careful management

3. **Turn 10 - Local Autonomy Delegation**
   - **Your Choice:** Delegated some governance to local teams
   - **Impact:** Improved local satisfaction and adaptation, but increased risk and inconsistency
   - **Why It Mattered:** Centralized vs local autonomy balance was key to long-term success

**Section 3: Mistakes and Inefficiencies (Top 3)**

*Example:*
1. **Over-Controlling: Turns 5-8**
   - **What Happened:** Maintained strict controls too long, trust declined
   - **Cost:** Stakeholder dissatisfaction, reduced innovation, near-failure
   - **Recommendation:** Relax controls gradually after incidents, maintain stakeholder trust

2. **Late Risk Mitigation: Turn 9**
   - **What Happened:** Addressed emerging risk too late, incident occurred
   - **Cost:** Major incident, trust collapse, near-failure
   - **Recommendation:** Monitor risks proactively, address early warning signs

3. **Inefficient Stakeholder Management**
   - **What Happened:** Focused on one stakeholder, ignored others
   - **Cost:** Other stakeholders dissatisfied, trust imbalance
   - **Recommendation:** Balance stakeholder needs, maintain all stakeholders above threshold

**Section 4: Recommended Strategy Adjustment**

*Example:*
- **Current Strategy:** Centralized governance, moderate controls, low transparency
- **Performance:** Good stability (low volatility) but low trust (stakeholder dissatisfaction)
- **Recommended Adjustment:** Try hybrid approach (centralized principles, local implementation) with increased transparency
- **Rationale:** Your stability is excellent, but you need to improve stakeholder trust. Hybrid approach maintains stability while transparency builds trust.

**Deterministic Calculation:**
- All analysis based on decision history (stored in state)
- Stakeholder responses calculated from governance strategy (rule-based)
- Risk levels calculated from controls and events (rule-based)
- Recommendations based on performance patterns (rule-based)

---

## SECTION 8 — UI and UX Specification

**Main Screen Layout:**

```
┌─────────────────────────────────────────────────────────┐
│ [Header: Turn 7/12 | Trust: 72% | Stability: 85% | Outcomes: 60%] │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Stakeholder Panel (Top)                                  │
│  ┌─────────────────────────────────────────────────┐     │
│  │ Data Team: [Trust: 75%] [Satisfaction: 70%]    │     │
│  │ Security Team: [Trust: 80%] [Satisfaction: 85%] │     │
│  │ Compliance Team: [Trust: 65%] [Satisfaction: 60%] │     │
│  └─────────────────────────────────────────────────┘     │
│                                                           │
│  Governance Dashboard (Middle)                            │
│  ┌─────────────────────────────────────────────────┐     │
│  │ Controls: [Strict ████████░░] 80%              │     │
│  │ Transparency: [High ██████░░░░] 60%            │     │
│  │ Autonomy: [Centralized ████░░░░░░] 40%         │     │
│  │ Enforcement: [Moderate ██████░░░░] 60%         │     │
│  └─────────────────────────────────────────────────┘     │
│                                                           │
│  Risk Panel (Bottom Left)                                 │
│  ┌─────────────────────────────────────────────────┐     │
│  │ Data Privacy: [Low ████░░░░░░]                  │     │
│  │ Security: [Medium ████████░░]                   │     │
│  │ Compliance: [Low ████░░░░░░]                    │     │
│  └─────────────────────────────────────────────────┘     │
│                                                           │
│  Action Panel (Bottom Right)                              │
│  [Adjust Controls] [Change Transparency] [Apply]          │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

**Mobile Control Scheme:**

- **Stakeholder Selection:** Tap stakeholder card to focus (shows details)
- **Governance Adjustment:** Drag sliders or tap +/- buttons
- **Preview:** Tap preview button to see projected consequences
- **Confirm:** Swipe up or tap confirm button
- **Reset:** Long-press governance setting to reset
- **All targets:** Minimum 44x44px

**Visual Design Cues:**

- **Stakeholder Trust:** Progress bars with color coding (green>70%, yellow 50-70%, red<50%)
- **Governance Settings:** Sliders with snap points, visual feedback
- **Risk Levels:** Color-coded indicators (green=low, yellow=medium, red=high)
- **Outcome Progress:** Progress bars with color coding
- **Stability Score:** Percentage display with color coding (green>80%, yellow 60-80%, red<60%)
- **Event Notifications:** Modal alerts for incidents, scrutiny, budget shocks
- **High Contrast:** All text meets WCAG AA
- **Color Independence:** Icons + text for all information

**Progress Communication:**

- **Turn Counter:** Clear X/Y display in header
- **Trust Display:** Always visible in header
- **Stability Display:** Percentage in header
- **Outcome Progress:** Progress bars in outcome panel

**Consequence Communication:**

- **Governance Preview:** Show projected stakeholder responses before applying
- **Trust Warnings:** Visual warnings when approaching thresholds
- **Risk Alerts:** Highlight emerging risks
- **Event Notifications:** Modal alerts for incidents

**Minimum Viable Animations:**

- **Trust Change:** Smooth progress bar animation (300ms)
- **Governance Adjustment:** Smooth slider movement (100ms)
- **Risk Update:** Color transition (200ms)
- **Event Notification:** Slide-in animation (300ms)
- **All animations:** Respect `prefers-reduced-motion`

**Performance Targets:**

- **Initial Load:** <1s
- **Governance Update:** <100ms
- **Preview Calculation:** <200ms
- **Frame Rate:** 60fps
- **Memory:** <40MB

---

## SECTION 9 — Capability Flags for Hub

```typescript
{
  id: "governance-simulator",
  title: "Governance Simulator",
  description: "Make governance decisions under uncertainty. Balance controls, incentives, and stakeholder alignment.",
  category: "educational",
  modes: ["solo", "daily"],
  supportsDaily: true,
  supportsPractice: true,
  supportsLearn: true,
  supportsAsyncCompetition: true, // Via challenge codes and strategy codes
  hasProgression: true,
  estimatedSessionMins: 20,
  primarySkills: [
    "governance",
    "risk-management",
    "stakeholder-management",
    "strategic-thinking",
    "policy-design"
  ],
  difficulty: "advanced",
  supportsMultiplayer: false,
  minPlayers: 1,
  maxPlayers: 1,
  tutorialAvailable: true
}
```

---

## SECTION 10 — Implementation Shape

**Module Structure:**

```
src/lib/games/games/governance-simulator/
├── types.ts                      # Type definitions
├── gameState.ts                  # Pure state management
├── scenarioGenerator.ts          # Seeded scenario generation
├── governanceEngine.ts           # Governance strategy application
├── stakeholderEngine.ts          # Stakeholder response calculation
├── riskEngine.ts                 # Risk level calculation
├── outcomeCalculator.ts          # Outcome progress calculation
├── eventEngine.ts                # Event generation and application
├── explainabilityAnalyzer.ts     # Post-run analysis
├── scenarioDefinitions.ts        # Scenario packs
├── governanceDefinitions.ts      # Governance strategy types
├── persistence.ts                # localStorage schema
├── GovernanceSimulator.tsx       # Main React component
└── index.ts                      # Exports
```

**Engine (Pure State Updates):**

- **gameState.ts:** Pure functions
  - `initializeScenario(seed, scenarioId, difficulty): GameState`
  - `applyGovernanceStrategy(state, strategy): GameState`
  - `simulateTurn(state): GameState`
  - `checkWinCondition(state): boolean`
  - `checkLossCondition(state): boolean`

- **governanceEngine.ts:** Pure functions
  - `applyStrategy(state, strategyChanges): GameState`
  - `calculateStakeholderResponses(state, strategy): StakeholderResponse[]`
  - `calculateRiskLevels(state, strategy): RiskLevel[]`

- **stakeholderEngine.ts:** Pure functions
  - `calculateTrustChange(stakeholder, strategy, events): number`
  - `calculateSatisfaction(stakeholder, strategy): number`
  - `calculateCompliance(stakeholder, strategy): number`

**RNG (Seeded):**

- **scenarioGenerator.ts:** Deterministic scenario generation
  - `generateScenario(seed, scenarioType, difficulty): Scenario`
  - Uses `SeededRNG` from framework

- **eventEngine.ts:** Deterministic event generation
  - `generateEvents(seed, turn, scenario): Event[]`
  - Uses `SeededRNG` from framework

**Storage (Versioned Schema):**

- **persistence.ts:** localStorage management
  - Schema versioning
  - Migration functions
  - Challenge code integration
  - Strategy code generation

**Renderer (UI):**

- **GovernanceSimulator.tsx:** Main React component
  - Uses `GameShell`
  - Integrates sharing components
  - Mobile-responsive
  - Keyboard navigation
  - Slider controls

**Tests:**

- **gameState.test.ts:** State transitions
- **governanceEngine.test.ts:** Strategy application
- **stakeholderEngine.test.ts:** Stakeholder response calculation
- **riskEngine.test.ts:** Risk level calculation

**Relative Complexity: L (Large)**

**Key Risks:**

1. **Complexity Risk:** Stakeholder dynamics and second-order effects can be very complex
   - **Mitigation:** Start with simple models, iterate, use clear rules

2. **Balance Risk:** Governance parameters must be carefully balanced
   - **Mitigation:** Extensive playtesting, configurable parameters

3. **Explainability Risk:** Post-run analysis might not capture complexity
   - **Mitigation:** Rule-based analysis, clear decision trees, extensive testing

4. **UX Risk:** Governance dashboard might be overwhelming
   - **Mitigation:** Progressive disclosure, clear information hierarchy, mobile-first design

5. **Abstraction Risk:** Governance concepts might be too abstract
   - **Mitigation:** Clear scenarios, concrete examples, tutorial mode

---

# PORTFOLIO ANALYSIS

## How They Differ From First 5 Hub Games

### Game 6: Signal Hunt vs Existing Games

**Differences:**
- **Unique Domain:** Cybersecurity triage (not covered by existing games)
- **Time Pressure:** Real-time prioritization under pressure (different from turn-based puzzle games)
- **False Positive Management:** Core mechanic unique to this game
- **Evolving State:** Threats escalate dynamically (different from static puzzles)
- **Risk-Based Scoring:** Risk score as primary metric (unique approach)

**Overlap Prevention:**
- **vs Systems Mastery:** Signal Hunt is tactical (incident response), Systems Mastery is strategic (systems thinking)
- **vs Constraint Optimizer:** Signal Hunt is multi-turn triage, Constraint Optimizer is single optimization
- **vs Flow Planner:** Signal Hunt is security-focused, Flow Planner is flow optimization

### Game 7: Proof Sprint vs Existing Games

**Differences:**
- **Mathematical Focus:** Pure mathematical reasoning (not covered by existing games)
- **Step-by-Step Derivation:** Proof construction (different from pattern matching)
- **Elegance Scoring:** Incentivizes efficient proofs (unique mechanic)
- **Multiple Domains:** Algebra, number theory, probability, calculus, logic (broad coverage)

**Overlap Prevention:**
- **vs Deduction Grid:** Proof Sprint is mathematical derivation, Deduction Grid is logical inference from clues
- **vs Daily Logic Gauntlet:** Proof Sprint is mathematical proofs, Daily Logic Gauntlet is general logic puzzles

### Game 8: Allocation Architect vs Existing Games

**Differences:**
- **Multi-Round Planning:** Planning horizon over multiple rounds (different from single optimization)
- **Dynamic Events:** Risk events that test plan resilience (unique mechanic)
- **Marginal Utility:** Diminishing returns as core mechanic (different from linear optimization)
- **Constraint Interactions:** Constraints affect each other (more complex than Constraint Optimizer)

**Overlap Prevention:**
- **vs Constraint Optimizer:** Allocation Architect is multi-round planning, Constraint Optimizer is single optimization
- **vs Systems Mastery:** Allocation Architect is tactical planning, Systems Mastery is strategic systems thinking

### Game 9: Packet Route vs Existing Games

**Differences:**
- **Network Topology:** Graph-based gameplay (not covered by existing games)
- **Congestion Management:** Primary challenge (unique mechanic)
- **Failure Resilience:** Network failures force adaptation (unique mechanic)
- **SLA Targets:** Multiple performance metrics (latency, throughput, loss)

**Overlap Prevention:**
- **vs Flow Planner:** Packet Route is network topology + failures, Flow Planner is flow optimization without topology
- **vs Systems Mastery:** Packet Route is network-specific, Systems Mastery is general systems thinking

### Game 10: Governance Simulator vs Existing Games

**Differences:**
- **Stakeholder Dynamics:** Multi-actor systems (not covered by existing games)
- **Long-Horizon Trade-offs:** Policy consequences over time (unique focus)
- **Trust as Resource:** Trust management as core mechanic (unique)
- **Second-Order Effects:** Governance changes create new risks (complex causality)

**Overlap Prevention:**
- **vs Systems Mastery:** Governance Simulator is governance-specific, Systems Mastery is technical systems thinking
- **vs Allocation Architect:** Governance Simulator is policy/people-focused, Allocation Architect is resource optimization

## Overlap Analysis and Prevention

### Potential Overlaps Identified:

1. **Signal Hunt vs Systems Mastery:** Different scopes (tactical vs strategic)
2. **Allocation Architect vs Constraint Optimizer:** Different timeframes (multi-round vs single)
3. **Packet Route vs Flow Planner:** Different focuses (topology vs flow)
4. **Proof Sprint vs Deduction Grid:** Different approaches (derivation vs inference)
5. **Governance Simulator vs Systems Mastery:** Different domains (governance vs technical)

### Prevention Mechanisms:

- **Clear Domain Boundaries:** Each game has distinct domain focus
- **Different Timeframes:** Some games are single-optimization, others multi-round
- **Different Mechanics:** Core mechanics are distinct (triage vs optimization vs routing vs proofs vs governance)
- **Different Skill Focus:** Each game trains different skills
- **Hub Organization:** Games organized by category and difficulty in hub

## Recommended Build Order

### 1. Allocation Architect (First - Next Reference Game)

**Rationale:**
- **Moderate Complexity (M):** Not too simple, not too complex
- **Clear Learning Objectives:** Easy to understand and teach
- **Leverages Existing Patterns:** Builds on constraint/optimization concepts
- **Broad Appeal:** Appeals to wide audience (project managers, planners, analysts)
- **Good Infrastructure Test:** Tests shared infrastructure (challenge codes, scoring, achievements)
- **Reasonable Scope:** Can be built and polished in reasonable time

**Implementation Priority:** HIGH

### 2. Signal Hunt (Second)

**Rationale:**
- **Medium Complexity (M):** Manageable after Allocation Architect
- **Strong Domain Alignment:** Cybersecurity domain fits platform content
- **Unique Mechanics:** False positive management is novel
- **Good for Platform Expansion:** Expands platform into security domain
- **Reasonable Scope:** Can be built after establishing patterns

**Implementation Priority:** MEDIUM-HIGH

### 3. Proof Sprint (Third)

**Rationale:**
- **Medium-Large Complexity (M-L):** More complex, build after gaining experience
- **Niche but High-Value Audience:** Appeals to math enthusiasts, researchers
- **Unique Mechanics:** Proof construction is novel
- **Educational Value:** Strong educational alignment
- **Reasonable Scope:** Can be built with established patterns

**Implementation Priority:** MEDIUM

### 4. Packet Route (Fourth)

**Rationale:**
- **Medium Complexity (M):** Manageable complexity
- **Technical Domain:** Network domain for technical audience
- **Visual Appeal:** Graph visualization is engaging
- **Reasonable Scope:** Can be built with graph rendering libraries

**Implementation Priority:** MEDIUM

### 5. Governance Simulator (Fifth - Most Complex)

**Rationale:**
- **High Complexity (L):** Most complex game, build last
- **Advanced Audience:** Appeals to senior leaders, policy makers
- **Complex Mechanics:** Stakeholder dynamics and second-order effects
- **Builds on Lessons:** Can leverage lessons from other games
- **Reasonable Scope:** Can be built with established patterns and experience

**Implementation Priority:** MEDIUM-LOW (but high value)

---

# HIGH-VALUE QUESTIONS FOR CLARIFICATION

1. **Shared Infrastructure Enhancements:** Should we enhance the shared infrastructure (challenge codes, scoring, achievements) to support any new requirements from these games? For example, plan codes for Allocation Architect, policy codes for Packet Route, strategy codes for Governance Simulator?

2. **Difficulty Calibration:** How should we calibrate difficulty across games? Should all games have similar difficulty curves, or should some games be inherently easier/harder?

3. **Progression Balance:** How should XP and progression balance across games? Should all games award similar XP, or should more complex games award more?

4. **Scenario Content:** For games with scenarios (Signal Hunt, Allocation Architect, Packet Route, Governance Simulator), how detailed should scenario definitions be? Should we create detailed scenario packs, or keep scenarios abstract?

5. **Tutorial Depth:** How comprehensive should tutorials be for each game? Should all games have full tutorials, or should some games assume prior knowledge?

6. **Mobile Optimization:** How aggressively should we optimize for mobile? Should all games work perfectly on mobile, or can some games be desktop-optimized?

7. **Performance Targets:** Are the performance targets (load times, frame rates, memory) acceptable, or should we adjust them?

8. **Accessibility Priorities:** What are the accessibility priorities? Should all games support screen readers, keyboard navigation, reduced motion?

9. **Testing Strategy:** What is the testing strategy? Should we aim for high test coverage, or focus on critical paths?

10. **Release Schedule:** What is the expected release schedule? Should we release games individually, or in batches?

---

**END OF DESIGN SPECIFICATIONS**

All 5 games have been fully specified with:
- Complete game identity and positioning
- Detailed state machine core loops
- Strategic decision points with trade-offs
- Browser-only progression models
- Structural difficulty phases
- Replay hooks and safe competition
- Post-run explainability
- UI/UX specifications
- Capability flags
- Implementation architecture

Ready for implementation phase (when approved).
