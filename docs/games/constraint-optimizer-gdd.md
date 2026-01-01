# Constraint Optimizer - Game Design Document (Enhanced)

**Version:** 2.0 (Enhanced Engagement)  
**Date:** Current  
**Status:** Design Complete  
**Target Platform:** Browser (Next.js), Mobile-First

---

## Executive Summary

Constraint Optimizer is a multi-objective optimization game that trains trade-off analysis, constraint satisfaction, and efficiency thinking. Players must balance conflicting objectives under resource constraints, creating deep strategic gameplay with multiple valid solutions.

**Core Value Proposition:**
- Daily optimization challenges with shared seeds
- Multiple valid solutions (Pareto-optimal design)
- Efficiency leaderboards enable friendly competition
- Solution gallery showcases creative approaches
- Teaches real-world optimization thinking

---

## Game Identity

### Learning Objectives

**Primary Skills Trained:**
1. **Trade-off Analysis**: Understanding cost/benefit of different approaches
2. **Constraint Satisfaction**: Working within limits to find valid solutions
3. **Multi-Objective Optimization**: Balancing competing goals simultaneously
4. **Efficiency Thinking**: Maximizing outcomes with minimal resources
5. **Strategic Planning**: Early decisions affect later options (constraint cascades)

**Real-World Application:**
- Project Management: Resource allocation, timeline optimization
- Systems Design: Performance vs. cost trade-offs
- Business Strategy: ROI optimization under constraints
- Engineering: Design optimization problems

### Why It Fits Ransford's Notes

- **Educational Focus**: Teaches optimization thinking applicable to professional decisions
- **High Trust**: Transparent scoring, no pay-to-win, ethical design
- **Browser-First**: Works offline, no installation, accessible anywhere
- **Free**: All content unlockable through play, no purchases
- **Unique Mechanics**: No other game focuses specifically on constraint optimization

---

## Core Gameplay Loop

### State Machine Flow

```
[IDLE]
  ↓
[Tutorial?] → Yes → [Tutorial] → [IDLE]
  ↓ No
[SELECT CHALLENGE] → [Daily Challenge] OR [Practice Mode] OR [Archive] OR [Weekly Impossible]
  ↓
[VIEW CONSTRAINTS] → Read objectives → Identify constraints → Analyze trade-offs
  ↓
[PLAN SOLUTION] → Allocate resources → Set priorities → Make strategic choices
  ↓
[VALIDATE CONSTRAINTS] → Check constraints satisfied → Identify violations
  ↓
[OPTIMIZE] → Adjust allocation → Refine approach → Revalidate
  ↓
[SUBMIT] → Calculate efficiency → Compare to PB → Update leaderboard
  ↓
[SOLUTION GALLERY] → View others' approaches → Learn techniques → Favorite solutions
  ↓
[ANALYSIS] → Efficiency breakdown → Constraint mastery → Achievement check
  ↓
[END] → Archive solution → Update streaks → Unlock next challenge
```

### Detailed Flow States

#### 1. IDLE State
- **UI**: Main menu with challenge options
- **Actions Available**:
  - Start Daily Challenge
  - Practice Mode (unlimited challenges)
  - View Archive (previous daily challenges)
  - Weekly "Impossible" Challenge
  - Solution Gallery
  - View Progress/Stats
  - Settings

#### 2. Challenge Selection State
- **Daily Challenge**: Automatically loads today's optimization problem
- **Practice Mode**: Player selects constraint complexity level
- **Archive**: Player selects date to replay
- **Weekly Impossible**: Maximum difficulty challenge (5% solve rate)

#### 3. Constraint View State
- **Components**:
  - Optimization objectives (e.g., "Minimize cost", "Maximize quality", "Minimize time")
  - Resource constraints (budget, materials, time limits)
  - Constraint relationships (which constraints conflict)
  - Efficiency target (what score to aim for)
  - Previous attempts (if replaying)

#### 4. Planning State
- **Player Actions**:
  - Allocate resources to different objectives
  - Set priority weights (which objectives matter more)
  - Make strategic trade-offs
  - Preview efficiency score
  - Save partial solutions

#### 5. Validation State
- **Feedback**:
  - Visual constraint indicators (satisfied = green, violated = red)
  - Efficiency meter shows real-time score
  - Constraint violation explanations
  - Suggestions for improvement

#### 6. Optimization State
- **Actions**:
  - Adjust resource allocation
  - Relax/strengthen constraint priorities
  - Try different approaches
  - Compare multiple solutions

#### 7. Submission State
- **Processing**:
  - Calculate efficiency score
  - Compare to personal best
  - Compare to leaderboard (if daily challenge)
  - Generate efficiency breakdown
  - Check for achievements

---

## Strategic Trade-offs (Minimum 3)

### 1. Speed vs. Quality vs. Cost (Triple Constraint)

**The Trade-off:**
- **Fast & Cheap**: Low quality, high waste, misses objectives
- **Fast & High Quality**: Very expensive, resource-intensive
- **Cheap & High Quality**: Takes longer, time constraints violated
- **Balanced**: Moderate on all fronts, but doesn't excel at any

**Strategic Depth:**
- No single optimal solution - depends on priority weights
- Players must choose which objectives matter most
- Early resource allocation affects later options
- Creates replay value (try different priority strategies)

### 2. Resource Allocation vs. Constraint Flexibility

**The Trade-off:**
- **Conservative Allocation**: Satisfies all constraints safely, but low efficiency (resources wasted)
- **Aggressive Allocation**: High efficiency, but risks constraint violations
- **Constraint Relaxation**: Some constraints can be relaxed for efficiency bonuses, but reduces score in that category

**Strategic Depth:**
- Risk/reward calculus - push boundaries or play safe?
- Learning which constraints can be safely relaxed
- Efficiency score rewards optimal resource usage
- Constraint violations have clear penalties

### 3. Early Commitment vs. Flexibility Reserve

**The Trade-off:**
- **Early Commitment**: Allocate resources early, lock in strategy, potentially higher efficiency
- **Flexibility Reserve**: Hold resources back, adapt to later constraints, but lower efficiency score
- **Cascade Effects**: Early decisions limit later options (constraint cascades)

**Strategic Depth:**
- Must think ahead, not just react
- Strategic planning vs. tactical adjustment
- Replay value: Try different early decisions, see consequences
- Depth emerges from simple rules + cascading constraints

---

## Progression Model

### Mastery Tiers (5 Levels)

1. **Novice** (0-100 XP)
   - Simple 2-objective problems
   - Few constraints
   - Clear feedback
   - Unlocks: Basic practice mode

2. **Optimizer** (100-300 XP)
   - 3-objective problems
   - Moderate constraints
   - Efficiency scoring introduced
   - Unlocks: Solution gallery access, efficiency leaderboards

3. **Efficiency Expert** (300-600 XP)
   - 4-objective problems
   - Complex constraint relationships
   - Constraint relaxation mechanics
   - Unlocks: Weekly challenges, solution sharing

4. **Master Planner** (600-1000 XP)
   - 5+ objective problems
   - Constraint cascades
   - Advanced optimization techniques
   - Unlocks: Template creation, expert challenges

5. **Optimization Master** (1000+ XP)
   - Maximum complexity
   - "Impossible" challenges
   - All features unlocked
   - Unlocks: Challenge creation, solution curation

### Unlock System

- **Practice Mode**: Available from start
- **Daily Challenges**: Unlocked after first practice challenge
- **Solution Gallery**: Unlocked at Optimizer tier
- **Efficiency Leaderboards**: Unlocked at Optimizer tier
- **Solution Sharing**: Unlocked at Efficiency Expert tier
- **Weekly Challenges**: Unlocked at Efficiency Expert tier
- **Template Creation**: Unlocked at Master Planner tier
- **Challenge Creation**: Unlocked at Optimization Master tier

### Browser-Only Persistence

- **localStorage Key**: `constraint-optimizer-profile`
- **Stored Data**:
  - XP and tier level
  - Completed challenges (by date)
  - Personal best efficiency scores
  - Saved solutions/templates
  - Achievement progress
  - Streak data
  - Favorite solutions (gallery)

### Versioning & Migration

- **Profile Version**: Increments with schema changes
- **Migration System**: Handles version upgrades automatically
- **Backward Compatibility**: Old saves remain playable

---

## Difficulty Model

### Structural Phases (Not Just "More Items")

#### Phase 1: Simple Optimization (Novice)
- **2 Objectives**: Clear trade-off between two goals
- **Single Resource Type**: One constraint to manage
- **No Cascades**: Decisions are independent
- **Example**: "Minimize cost while maximizing quality" with budget constraint

#### Phase 2: Multi-Objective (Optimizer)
- **3 Objectives**: Triple constraint (cost, quality, time)
- **Multiple Resource Types**: Budget, materials, time
- **Simple Relationships**: Some constraints interact
- **Example**: "Build product with cost/quality/time balance" with multiple constraints

#### Phase 3: Constraint Relationships (Efficiency Expert)
- **4+ Objectives**: More competing goals
- **Constraint Dependencies**: Satisfying one constraint affects others
- **Relaxation Options**: Some constraints can be relaxed for bonuses
- **Example**: "Optimize production line" with cascading constraints

#### Phase 4: Constraint Cascades (Master Planner)
- **5+ Objectives**: Maximum complexity
- **Early Decision Impact**: Choices early limit later options
- **Dynamic Constraints**: Constraints change based on decisions
- **Example**: "Design system architecture" with cascading design decisions

#### Phase 5: "Impossible" Challenges (Optimization Master)
- **Maximum Complexity**: All constraints active
- **Minimal Resources**: Tightest resource limits
- **No Obvious Solution**: Requires creative optimization
- **5% Solve Rate**: Creates aspirational goals

### Adaptive Difficulty

- **Performance-Based**: Adjusts based on efficiency scores
- **If Too Easy**: Constraints tighten, objectives increase
- **If Too Hard**: Constraints relax, more resources provided
- **Optimal Challenge**: Maintains 70-80% efficiency scores (challenging but achievable)

---

## Replay Hooks

### 1. Daily Challenges (Primary Hook)
- **Same Problem, All Players**: Shared seed creates community experience
- **Efficiency Leaderboard**: Compare your score to others
- **Solution Gallery**: See how top players approached it
- **Challenge Code**: `COPT-YYYY-MM-DD-XXXX` for sharing/comparison
- **Why Return**: New challenge every day, social comparison, improvement tracking

### 2. Efficiency Streaks (Habit Formation)
- **Streak Definition**: Consecutive days with >80% efficiency score
- **Streak Freeze**: One free pass per month (prevents anxiety)
- **Streak Milestones**: 7, 30, 100 days unlock special challenges
- **Visual Calendar**: See your consistency pattern
- **Why Return**: Maintain streak, achieve milestones, visual progress

### 3. Personal Best Tracking (Improvement)
- **Efficiency PB**: Track best efficiency score per challenge
- **Improvement Metrics**: See efficiency improvement over time
- **PB Notifications**: "New personal best!" celebrations
- **Historical Comparison**: Compare current vs. past attempts
- **Why Return**: Beat your own scores, see improvement, satisfaction from progress

### 4. Solution Gallery (Social Learning)
- **Anonymous Solutions**: See how others solved (after you complete)
- **Efficiency-Ranked**: Top solutions shown first
- **Solution of the Day**: Highlight creative approaches
- **Favorite System**: Save clever solutions for reference
- **Why Return**: Learn new strategies, get inspired, discover techniques

### 5. Weekly "Impossible" Challenges (Aspirational)
- **Maximum Difficulty**: All constraints active, minimal resources
- **5% Solve Rate**: Only experts can solve
- **Special Rewards**: Unique badges, recognition
- **Community Focus**: Everyone attempts same challenge
- **Why Return**: Test your skills, achieve rare accomplishments, expert status

### 6. Constraint Mastery Progression (Long-term)
- **Constraint Types**: Different constraint categories to master
- **Mastery Badges**: Unlock by solving challenges with specific constraints
- **Progressive Unlocks**: Harder constraint types unlock with mastery
- **Why Return**: Complete mastery collection, unlock new content, progression goals

---

## Multiplayer Stance

### Async Competitive

**How It Works:**
- **Shared Daily Seeds**: All players get same challenge each day
- **Challenge Codes**: `COPT-YYYY-MM-DD-XXXX` format
- **Efficiency Leaderboards**: Compare scores without revealing solutions
- **Solution Comparison**: See others' approaches (after you complete)

**Safety:**
- **No Real-Time Interaction**: All comparisons are asynchronous
- **No Chat/Communication**: Only efficiency scores and anonymized solutions
- **No Accounts Required**: Works via localStorage + code matching
- **Privacy-First**: Only efficiency metrics shared, no personal data

**Implementation:**
- **localStorage-Based**: Challenge codes map to challenge parameters
- **Comparison System**: Enter code to see leaderboard for that challenge
- **Anonymous Sharing**: Solutions anonymized before sharing
- **No Server Required**: Works entirely client-side (for MVP)

---

## UI/UX Intent

### Visual Design

**Look & Feel:**
- **Clean & Professional**: Data-focused aesthetic (charts, metrics, efficiency graphs)
- **Visual Hierarchy**: Constraints clearly labeled, resources visually organized
- **Color Coding**: Constraints (red = violated, green = satisfied, yellow = close)
- **Efficiency Visualization**: Real-time efficiency meter, score breakdown charts
- **Satisfaction Moments**: Celebratory animations for >95% efficiency, PB achievements

**Information Architecture:**
- **Clear Objectives**: Optimization goals prominently displayed
- **Constraint Panel**: All constraints visible, status indicators
- **Resource Allocation Interface**: Drag-and-drop or slider-based allocation
- **Efficiency Dashboard**: Real-time score, breakdown, comparison metrics
- **Solution Gallery**: Visual browsing of saved/comparison solutions

### Mobile Interaction Model

**Touch Optimization:**
- **Drag-and-Drop**: Allocate resources by dragging
- **Pinch-to-Zoom**: Zoom in on complex constraint relationships
- **Swipe Gestures**: Swipe between solution variations
- **Large Touch Targets**: All interactive elements ≥44px (WCAG compliant)

**Responsive Layout:**
- **Mobile-First**: Single column on small screens, sidebar on larger
- **Constraint Panel**: Collapsible on mobile, always visible on desktop
- **Efficiency Meter**: Compact on mobile, detailed on desktop
- **Solution Gallery**: Grid on desktop, list on mobile

### Accessibility Considerations

**Keyboard Navigation:**
- **Full Functionality**: All features accessible via keyboard
- **Tab Order**: Logical navigation flow
- **Keyboard Shortcuts**: Quick actions (e.g., "S" to submit, "R" to reset)

**Screen Reader Support:**
- **ARIA Labels**: All interactive elements properly labeled
- **Live Regions**: Efficiency score updates announced
- **Semantic HTML**: Proper heading hierarchy, landmark regions

**Visual Accessibility:**
- **High Contrast**: Readable in all lighting conditions
- **Color Independence**: Information not conveyed by color alone
- **Text Alternatives**: Icons have text labels

**Motor Accessibility:**
- **Large Targets**: All buttons/interactive elements ≥44px
- **Touch-Friendly**: Gestures support, no precision required
- **Reduced Motion**: Respects prefers-reduced-motion

---

## Enhanced Engagement Mechanics

### 1. Efficiency Leaderboards (Viral Hook)

**Implementation:**
- **Challenge Code System**: Every daily challenge generates unique code `COPT-YYYY-MM-DD-XXXX`
- **Code Sharing**: Players share codes → others can compare scores
- **Leaderboard Display**: "You solved this 23% more efficiently than average"
- **Percentile Rankings**: Show where you rank (top 10%, top 1%, etc.)
- **No Spoilers**: Only efficiency metrics shared, solutions remain private

**Why It Works:**
- **Social Currency**: Comparing performance creates engagement
- **Motivation**: Seeing others' scores motivates improvement
- **Community**: Shared experience (same challenge) creates connection
- **Viral Potential**: Sharing codes brings new players

### 2. Solution Gallery (Social Currency)

**Implementation:**
- **Anonymous Solutions**: After completing challenge, see how others solved
- **Efficiency-Ranked**: Top solutions shown first
- **Solution of the Day**: Highlight creative/unexpected approaches
- **Favorite System**: Players can "favorite" clever solutions
- **Unlock Requirement**: Must complete challenge before viewing solutions

**Why It Works:**
- **Learning Tool**: Learn new strategies from community
- **Investment**: Favoriting solutions creates personal collection
- **Social Proof**: Seeing others' approaches validates your own
- **Discovery**: Find creative solutions you didn't consider

### 3. Constraint Mastery Badges (Variable Rewards)

**Implementation:**
- **Unexpected Unlocks**: "First to solve with minimal resource waste!"
- **Rare Badges**: "Solved with only 3 resource types" (1% of players)
- **Hidden Achievements**: Discover through exploration
- **Badge Showcase**: Shareable badge collection for social media

**Why It Works:**
- **Variable Reward**: Unpredictable unlocks create excitement
- **Status Symbol**: Rare badges provide social currency
- **Progression**: Visible progress through badge collection
- **Discovery**: Hidden achievements reward exploration

### 4. Adaptive Challenge Scaling (Flow State)

**Implementation:**
- **Real-Time Adjustment**: Difficulty adapts based on performance
- **If Too Easy**: Constraints tighten automatically, objectives increase
- **If Too Hard**: Hint system offers constraint relaxation options
- **Optimal Balance**: Maintains 70-80% efficiency scores

**Why It Works:**
- **Flow State**: Challenge matches skill level
- **No Frustration**: Prevents overly difficult challenges
- **No Boredom**: Prevents overly easy challenges
- **Skill Development**: Gradually increases difficulty as skill improves

### 5. Efficiency Streaks (Habit Formation)

**Implementation:**
- **Streak Definition**: Consecutive days with >80% efficiency score
- **Streak Freeze**: One "free pass" per month (prevents streak anxiety)
- **Streak Milestones**: 7, 30, 100 days unlock special challenges
- **Visual Calendar**: See your consistency pattern over time

**Why It Works:**
- **Habit Formation**: Daily return creates routine
- **Loss Aversion**: Streak protection prevents anxiety
- **Milestone Goals**: Clear targets (7, 30, 100 days)
- **Visual Progress**: Calendar shows long-term consistency

### 6. Constraint Combinations (Strategic Depth)

**Implementation:**
- **Weekly Challenges**: "Constraint Combo" with impossible-seeming combinations
- **Community Discovery**: Players discover which combinations are solvable
- **Popular Labeling**: Combos get labeled as "solved by 10%"
- **Aspirational Goals**: Creates challenges for expert players

**Why It Works:**
- **Strategic Depth**: Complex constraint interactions
- **Community Knowledge**: Shared understanding of difficulty
- **Expert Challenges**: Goals for advanced players
- **Discovery**: Finding solvable combos feels rewarding

---

## UX/UI Enhancements

### Visual Feedback
- **Constraint Indicators**: Visual "relax" or "tighten" as you adjust
- **Efficiency Meter**: Real-time efficiency calculation visible during planning
- **Resource Visualization**: See resource allocation visually (pie charts, bars)
- **Constraint Relationships**: Visual connections between related constraints

### Solution Comparison
- **Side-by-Side View**: Compare your solution to others
- **Efficiency Breakdown**: See where solutions differ
- **Highlight Differences**: Visual indicators of key differences
- **Learn from Others**: Understand optimization techniques

### Satisfaction Moments
- **Celebration Animations**: >95% efficiency triggers celebration
- **PB Achievements**: "New personal best!" notifications
- **Badge Unlocks**: Visual badge reveal animations
- **Streak Milestones**: Special animations for 7/30/100 day streaks

### Mobile-First Design
- **Drag-and-Drop**: Touch-optimized resource allocation
- **Pinch-to-Zoom**: Zoom in on complex constraint views
- **Gesture Support**: Swipe between solutions, undo/redo
- **Responsive Layout**: Optimized for all screen sizes

---

## Retention Hooks Summary

1. **Daily Challenges**: New optimization problem every day
2. **Efficiency Leaderboards**: Compare scores with others
3. **Solution Gallery**: Learn from community solutions
4. **Efficiency Streaks**: Maintain daily consistency
5. **Personal Best Tracking**: Beat your own scores
6. **Weekly "Impossible" Challenges**: Test expert skills
7. **Constraint Mastery**: Unlock new constraint types
8. **Badge Collection**: Collect rare achievements
9. **Template Creation**: Save and share solution templates
10. **Progress Analytics**: Visualize improvement over time

---

## Effort, Risk, and Sequencing

### Relative Complexity: **Medium**

**Technical Complexity:**
- Optimization algorithm (efficiency scoring)
- Constraint validation system
- Solution comparison/gallery system
- Leaderboard system (localStorage-based)
- Challenge code generation

**Design Complexity:**
- Constraint relationship design
- Efficiency scoring balance
- UI for resource allocation
- Solution visualization
- Mobile optimization

### Main Technical Risks

1. **Efficiency Scoring Balance**: Ensuring scoring is fair and meaningful
2. **Constraint Generation**: Creating solvable but challenging constraints
3. **Solution Comparison**: Implementing meaningful solution comparison
4. **Mobile UI**: Complex constraint interface on small screens
5. **Performance**: Real-time efficiency calculation performance

### Main Design Risks

1. **Difficulty Balance**: Too easy = boring, too hard = frustrating
2. **Constraint Clarity**: Players must understand constraints clearly
3. **Strategic Depth**: Ensuring meaningful trade-offs exist
4. **Tutorial**: Teaching optimization thinking to new players
5. **Engagement**: Maintaining interest beyond initial novelty

### Sequencing Recommendation: **Early-Mid**

**Why Early:**
- Builds on logic game foundations
- Different enough from existing games (optimization focus)
- High engagement potential (leaderboards, sharing)
- Teaches valuable real-world skills

**Dependencies:**
- Challenge code system (shared infrastructure)
- Leaderboard system (shared infrastructure)
- Achievement system (shared infrastructure)
- Solution gallery system (game-specific)

**Recommended Order:**
1. After Daily Logic Gauntlet (establishes patterns)
2. Before Pattern Architect (optimization is more analytical)
3. Can be built in parallel with Deduction Grid (different mechanics)

---

## Integration with Platform

### Shared Framework Components

- **SeededRNG**: Daily challenge generation
- **PersistenceManager**: Profile and progress storage
- **Achievement System**: Cross-game achievements
- **Streak Tracker**: Daily streak management
- **Analysis Report**: Post-challenge analysis

### Game-Specific Components

- **Efficiency Calculator**: Optimization scoring algorithm
- **Constraint Validator**: Constraint satisfaction checking
- **Solution Comparator**: Solution comparison logic
- **Resource Allocator**: Resource allocation UI/interactions
- **Challenge Generator**: Constraint/problem generation

### Cross-Game Features

- **Challenge Codes**: Universal code system (`COPT-YYYY-MM-DD-XXXX`)
- **Daily Challenge Hub**: Multi-game dashboard
- **Mastery Tiers**: Unified tier system across games
- **Achievement Showcase**: Shareable achievements
- **Progress Analytics**: Cross-game skill development tracking

---

## Success Criteria

### "This is a Real Game Now"

- ✅ Multiple valid solutions (not one right answer)
- ✅ Meaningful strategic choices with trade-offs
- ✅ Replay value (daily challenges, PB tracking, solution gallery)
- ✅ Progression system (tiers, unlocks, mastery)
- ✅ Social elements (leaderboards, solution sharing)

### "Interesting After 10+ Minutes"

- ✅ Constraint complexity provides depth
- ✅ Efficiency optimization creates challenge
- ✅ Solution gallery provides learning/exploration
- ✅ Multiple challenge types (daily, weekly, practice)
- ✅ Progressive difficulty maintains engagement

### "Choices Matter"

- ✅ Resource allocation directly affects efficiency
- ✅ Constraint priorities change outcomes
- ✅ Early decisions limit later options (cascades)
- ✅ Trade-offs are visible and meaningful
- ✅ No single dominant strategy

---

## Research-Backed Design Principles Applied

1. **Hook Model**: Daily trigger → optimization action → variable rewards (badges, PBs) → investment (solutions, templates)
2. **Flow State**: Adaptive difficulty maintains optimal challenge-skill balance
3. **Social Currency**: Efficiency leaderboards, solution gallery, badge sharing
4. **Habit Formation**: Daily challenges, streaks, consistent engagement
5. **Strategic Depth**: Meaningful trade-offs, constraint cascades, multiple valid paths
6. **Variable Rewards**: Unexpected badge unlocks, rare achievements, solution discoveries
7. **Investment Loops**: Saved solutions, templates, favorited approaches, progress accumulation
8. **Emotional Design**: Celebration animations, progress visualization, satisfaction moments

---

**Design Complete.** Constraint Optimizer combines strategic depth, social engagement, and optimization thinking into a game that teaches valuable real-world skills while maintaining high engagement and replay value.
