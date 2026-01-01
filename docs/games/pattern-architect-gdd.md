# Pattern Architect - Game Design Document (Enhanced)

**Version:** 2.0 (Enhanced Engagement)  
**Date:** Current  
**Status:** Design Complete  
**Target Platform:** Browser (Next.js), Mobile-First

---

## Executive Summary

Pattern Architect is a spatial reasoning and pattern construction game that trains visual pattern recognition, symmetry, and structural thinking. Players build patterns following rules, with emphasis on symmetry, hierarchy, and aesthetic beauty.

**Core Value Proposition:**
- Daily pattern challenges with shared seeds
- Pattern sharing and remixing enable creativity
- Symmetry mastery creates visual rewards
- Free-build mode allows player-created content
- Teaches spatial reasoning and pattern thinking

---

## Game Identity

### Learning Objectives

**Primary Skills Trained:**
1. **Spatial Reasoning**: Visualizing patterns in 2D/3D space
2. **Pattern Recognition**: Identifying pattern rules and structures
3. **Symmetry Understanding**: Creating and recognizing symmetric patterns
4. **Structural Thinking**: Building hierarchical pattern relationships
5. **Aesthetic Design**: Creating visually pleasing patterns

**Real-World Application:**
- Architecture: Symmetry, structural design, spatial planning
- Engineering: Pattern-based design, structural integrity
- Design: Visual patterns, aesthetics, composition
- Mathematics: Symmetry groups, pattern theory

### Why It Fits Ransford's Notes

- **Educational Focus**: Teaches spatial reasoning applicable to design/engineering
- **High Trust**: Transparent pattern rules, no pay-to-win, ethical design
- **Browser-First**: Works offline, no installation, accessible anywhere
- **Free**: All content unlockable through play, no purchases
- **Unique Mechanics**: Focus on spatial patterns and symmetry (distinct from logic puzzles)

---

## Core Gameplay Loop

### State Machine Flow

```
[IDLE]
  ↓
[Tutorial?] → Yes → [Tutorial] → [IDLE]
  ↓ No
[SELECT PATTERN] → [Daily Challenge] OR [Practice] OR [Free-Build] OR [Gallery]
  ↓
[VIEW PATTERN RULES] → Read rules → Understand constraints → Identify pattern type
  ↓
[PLACE ELEMENTS] → Add pattern pieces → Follow rules → Build structure
  ↓
[VALIDATE PATTERN] → Check rules satisfied → Verify symmetry → Confirm integrity
  ↓
[COMPLETE PATTERN] → Final validation → Calculate beauty score → Check symmetry
  ↓
[SUBMIT] → Pattern score → Unlock next pattern → Update gallery
  ↓
[PATTERN SHARING] → Generate share code → View others' patterns → Remix patterns
  ↓
[ANALYSIS] → Symmetry analysis → Beauty breakdown → Achievement check
  ↓
[END] → Save pattern → Update streaks → Unlock pattern types
```

### Detailed Flow States

#### 1. IDLE State
- **UI**: Main menu with pattern options
- **Actions Available**:
  - Start Daily Challenge
  - Practice Mode (unlimited patterns)
  - Free-Build Mode (create your own)
  - Pattern Gallery (browse community patterns)
  - View Progress/Stats
  - Settings

#### 2. Pattern Selection State
- **Daily Challenge**: Automatically loads today's pattern challenge
- **Practice Mode**: Player selects pattern type and difficulty
- **Free-Build**: Create patterns from scratch
- **Gallery**: Browse and load shared patterns

#### 3. Pattern Rules State
- **Components**:
  - Pattern type description
  - Rules and constraints
  - Symmetry requirements (if any)
  - Example patterns
  - Difficulty indicator

#### 4. Building State
- **Player Actions**:
  - Place pattern elements
  - Rotate/reflect elements
  - Remove elements
  - Preview symmetry
  - Check rule compliance
  - Save partial progress

#### 5. Validation State
- **Feedback**:
  - Rule compliance indicators
  - Symmetry visualization
  - Structural integrity checks
  - Beauty score preview
  - Suggestion system

#### 6. Completion State
- **Processing**:
  - Final validation
  - Symmetry analysis
  - Beauty score calculation
  - Comparison to PB
  - Achievement checks
  - Pattern code generation

---

## Strategic Trade-offs (Minimum 3)

### 1. Complexity vs. Simplicity

**The Trade-off:**
- **Simple Patterns**: Easy to complete, reliable, but lower beauty scores
- **Complex Patterns**: Higher beauty scores, more impressive, but harder to validate
- **Risk/Reward**: Complex patterns risk rule violations, simple patterns are safe but less rewarding

**Strategic Depth:**
- Players must balance ambition vs. reliability
- Complexity scoring rewards creative patterns
- Rule violations have clear penalties
- Creates meaningful choice between safe and ambitious approaches

### 2. Symmetry Enforcement vs. Free-Form Design

**The Trade-off:**
- **Perfect Symmetry**: Symmetric patterns score bonus points, but limit placement options
- **Free-Form Patterns**: More creative freedom, easier placement, but miss symmetry bonuses
- **Asymmetric Designs**: Some patterns intentionally break symmetry for artistic effect (advanced)

**Strategic Depth:**
- Symmetry bonuses create incentive for constrained design
- Free-form allows more creative expression
- Players choose design philosophy (symmetry vs. creativity)
- Different pattern types reward different approaches

### 3. Pattern Density vs. Validation Ease

**The Trade-off:**
- **Dense Patterns**: More elements, higher scores, but harder to validate (more rules to check)
- **Sparse Patterns**: Easier validation, clear structure, but lower scores
- **Optimal Density**: Finding the balance between complexity and clarity

**Strategic Depth:**
- Density directly affects score
- Validation complexity creates cognitive load
- Players must balance ambition with manageability
- Pattern type determines optimal density

---

## Progression Model

### Mastery Tiers (5 Levels)

1. **Pattern Learner** (0-100 XP)
   - Simple linear patterns (sequences)
   - No symmetry requirements
   - Basic rule sets
   - Unlocks: Practice mode, basic patterns

2. **Pattern Builder** (100-300 XP)
   - 2D grid patterns
   - Simple symmetry (horizontal/vertical)
   - Moderate rule complexity
   - Unlocks: Daily challenges, pattern gallery access

3. **Symmetry Master** (300-600 XP)
   - Complex symmetry (rotational, multiple axes)
   - Multi-layer patterns
   - Advanced rule sets
   - Unlocks: Free-build mode, pattern sharing

4. **Pattern Architect** (600-1000 XP)
   - Dynamic patterns (rules change during construction)
   - Hierarchical patterns
   - Maximum complexity
   - Unlocks: Pattern creation tools, community features

5. **Master Architect** (1000+ XP)
   - All pattern types mastered
   - Pattern design expertise
   - All features unlocked
   - Unlocks: Pattern curation, design challenges

### Unlock System

- **Practice Mode**: Available from start
- **Daily Challenges**: Unlocked at Pattern Builder tier
- **Pattern Gallery**: Unlocked at Pattern Builder tier
- **Free-Build Mode**: Unlocked at Symmetry Master tier
- **Pattern Sharing**: Unlocked at Symmetry Master tier
- **Pattern Creation Tools**: Unlocked at Pattern Architect tier
- **Community Features**: Unlocked at Pattern Architect tier

### Browser-Only Persistence

- **localStorage Key**: `pattern-architect-profile`
- **Stored Data**:
  - XP and tier level
  - Completed patterns (by date)
  - Created patterns (free-build)
  - Favorite patterns (gallery)
  - Pattern library (saved patterns)
  - Achievement progress
  - Streak data
  - Symmetry mastery by type

---

## Difficulty Model

### Structural Phases

#### Phase 1: Simple Linear Patterns (Pattern Learner)
- **Sequences**: One-dimensional patterns (ABAB, ABCABC, etc.)
- **Simple Rules**: Clear, explicit pattern rules
- **No Symmetry**: Focus on rule compliance only
- **Example**: "Create pattern: Red, Blue, Red, Blue..."

#### Phase 2: 2D Grid Patterns (Pattern Builder)
- **Grid-Based**: Patterns on 2D grid
- **Basic Symmetry**: Horizontal or vertical symmetry required
- **Moderate Rules**: Multiple rules, some interactions
- **Example**: "Create symmetric pattern on 4x4 grid"

#### Phase 3: Multi-Layer Patterns (Symmetry Master)
- **Layered Structure**: Patterns at multiple scales
- **Complex Symmetry**: Rotational, multiple axes
- **Rule Interactions**: Rules affect each other
- **Example**: "Create pattern with rotational symmetry and nested sub-patterns"

#### Phase 4: Dynamic Patterns (Pattern Architect)
- **Changing Rules**: Pattern rules evolve during construction
- **Hierarchical Patterns**: Patterns within patterns
- **Maximum Complexity**: All pattern types combined
- **Example**: "Build pattern where symmetry rules change based on element placement"

#### Phase 5: Expert Challenges (Master Architect)
- **"Impossible" Patterns**: Maximum complexity combinations
- **Creative Constraints**: Unusual rule combinations
- **5% Solve Rate**: Creates aspirational goals
- **Example**: "Create pattern with 4-way symmetry, 3 layers, and dynamic rules"

### Adaptive Difficulty

- **Pattern Generation**: Patterns match current skill level
- **If Too Easy**: Pattern complexity increases, symmetry requirements added
- **If Too Hard**: Patterns simplify, symmetry optional, more examples provided
- **Optimal Balance**: Maintains 70-80% completion rate

---

## Replay Hooks

### 1. Daily Pattern Challenges (Primary Hook)
- **Same Pattern, All Players**: Shared seed creates community experience
- **Pattern Sharing**: Share pattern codes, compare approaches
- **Pattern of the Week**: Community-voted favorite pattern
- **Challenge Code**: `PATT-YYYY-MM-DD-XXXX` for sharing/comparison
- **Why Return**: New pattern every day, see others' creative solutions, improvement tracking

### 2. Symmetry Streaks (Habit Formation)
- **Streak Definition**: Consecutive days with perfect symmetry scores
- **Streak Freeze**: One free pass per month
- **Streak Milestones**: 7, 30, 100 days unlock visual themes
- **Visual Calendar**: See symmetry journey over time
- **Why Return**: Maintain streak, unlock visual rewards, consistency goals

### 3. Pattern Discovery Rewards (Variable Rewards)
- **Hidden Pattern Types**: Discover new categories through exploration
- **"First Discovery" Badges**: Be among first to solve new pattern types
- **Pattern Rarity**: Some patterns appear 1% of the time (creates excitement)
- **Unexpected Unlocks**: Creative solutions unlock new pattern types
- **Why Return**: Discover rare patterns, achieve firsts, unlock new content

### 4. Free-Build Mode with Sharing (Investment)
- **Player-Created Patterns**: Create your own patterns from scratch
- **Pattern Sharing**: Share pattern codes for others to solve
- **Community Ratings**: Patterns rated "Most Creative", "Hardest", "Most Beautiful"
- **Pattern Collections**: Curated sets of player-created patterns
- **Why Return**: Creative expression, community recognition, pattern library building

### 5. Pattern Speed Challenges (Social Currency)
- **Daily Speed Run**: Solve standard pattern as fast as possible
- **Leaderboard**: Compare solve times for same pattern
- **Speed Tiers**: Bronze (<60s), Silver (<45s), Gold (<30s), Platinum (<20s)
- **Shareable Badges**: Speed achievements for social sharing
- **Why Return**: Competitive element, speed mastery, recognition

### 6. Pattern Type Mastery (Long-term Progression)
- **Pattern Categories**: Different pattern types to master
- **Mastery Badges**: Unlock by solving patterns of each type
- **Progressive Unlocks**: Harder pattern types unlock with mastery
- **Why Return**: Complete mastery collection, unlock new pattern types, progression goals

---

## Multiplayer Stance

### Single-Player Focused (with Async Sharing)

**Primary Mode**: Single-player pattern building and solving

**Async Sharing Features:**
- **Pattern Code Sharing**: `PATT-XXXX-YYYY` format
- **Pattern Remixing**: Load others' patterns, attempt to solve, create variations
- **Community Gallery**: Browse shared patterns (anonymous)
- **Pattern Ratings**: Rate patterns for creativity/difficulty (no chat)

**Safety:**
- **No Real-Time Interaction**: All sharing is asynchronous
- **No Communication**: Only pattern codes and ratings shared
- **Privacy-First**: Patterns anonymized, no personal data
- **Optional Sharing**: Players choose what to share

**Implementation:**
- **localStorage-Based**: Pattern codes map to pattern data
- **Optional Server**: Can sync patterns via server (future enhancement)
- **Client-Side First**: MVP works entirely client-side

---

## UI/UX Intent

### Visual Design

**Look & Feel:**
- **Clean & Geometric**: Visual pattern aesthetic (inspired by Islamic art, mandalas)
- **Satisfying Animations**: Pattern pieces snap into place with visual/audio feedback
- **Symmetry Visualization**: Real-time symmetry preview as you build
- **Beauty Scoring**: Aesthetic evaluation displayed (symmetry, balance, harmony)
- **Color Coding**: Pattern elements color-coded by type/rule

**Information Architecture:**
- **Pattern Canvas**: Central workspace for building
- **Rule Panel**: Pattern rules and constraints displayed
- **Symmetry Preview**: Live symmetry visualization
- **Element Palette**: Available pattern pieces/elements
- **Validation Indicators**: Visual feedback on rule compliance

### Mobile Interaction Model

**Touch Optimization:**
- **Drag-and-Drop**: Place elements by dragging
- **Pinch-to-Zoom**: Zoom in on complex patterns
- **Rotate Gestures**: Rotate elements with gestures
- **Swipe to Undo**: Swipe left to undo placement
- **Long-Press**: Long-press for element options

**Responsive Layout:**
- **Mobile-First**: Canvas optimized for touch
- **Collapsible Panels**: Rules/elements collapse on mobile
- **Gesture Support**: Full gesture navigation
- **Adaptive UI**: Interface adapts to screen size

### Accessibility Considerations

**Keyboard Navigation:**
- **Full Functionality**: All features accessible via keyboard
- **Grid Navigation**: Arrow keys move selection, Enter places element
- **Keyboard Shortcuts**: Quick actions (e.g., "U" to undo, "R" to rotate)

**Screen Reader Support:**
- **ARIA Labels**: All elements properly labeled
- **Pattern Description**: Screen reader describes pattern rules
- **Validation Announcements**: Rule compliance announced
- **Semantic HTML**: Proper structure for assistive technology

**Visual Accessibility:**
- **High Contrast**: Patterns readable in all conditions
- **Color Independence**: Information not color-only
- **Pattern Alternatives**: Texture/shape differences for colorblind users
- **Text Alternatives**: Icons have text labels

**Motor Accessibility:**
- **Large Targets**: All interactive elements ≥44px
- **Gesture Alternatives**: Keyboard alternatives for all gestures
- **Reduced Motion**: Respects prefers-reduced-motion

---

## Enhanced Engagement Mechanics

### 1. Pattern Sharing & Remixing (Viral Hook)

**Implementation:**
- **Pattern Codes**: Every pattern generates shareable code `PATT-XXXX-YYYY`
- **Pattern Loading**: Enter code to load pattern, attempt to solve
- **Remixing**: Build on others' patterns, create variations
- **"Pattern of the Week"**: Community-voted favorite pattern showcased

**Why It Works:**
- **Creative Expression**: Players create and share their patterns
- **Community**: Shared patterns create connection
- **Learning**: See creative approaches from others
- **Viral Potential**: Sharing patterns brings new players

### 2. Symmetry Streaks (Habit Formation)

**Implementation:**
- **Streak Definition**: Consecutive days with perfect symmetry scores
- **Streak Milestones**: 7, 30, 100 days unlock visual themes
- **Streak Calendar**: Visual calendar showing symmetry journey
- **Free Pass**: One streak freeze per month

**Why It Works:**
- **Habit Formation**: Daily return creates routine
- **Visual Rewards**: Unlock themes for consistency
- **Loss Aversion**: Streak protection prevents anxiety
- **Long-Term Goals**: Clear milestones (7, 30, 100 days)

### 3. Pattern Discovery Rewards (Variable Rewards)

**Implementation:**
- **Hidden Pattern Types**: Discover new categories through exploration
- **"First Discovery" Badges**: Be among first to solve new pattern types
- **Pattern Rarity**: Some patterns appear 1% of the time
- **Unexpected Unlocks**: Creative solutions unlock new pattern types

**Why It Works:**
- **Variable Reward**: Unpredictable discoveries create excitement
- **Status Symbol**: First discovery badges provide recognition
- **Exploration Rewarded**: Hidden content encourages experimentation
- **Rare Events**: 1% patterns feel special when encountered

### 4. Free-Build Mode with Sharing (Investment)

**Implementation:**
- **Pattern Creation**: Players create patterns from scratch
- **Pattern Sharing**: Share pattern codes for others to solve
- **Community Ratings**: Patterns rated for creativity/difficulty/beauty
- **Pattern Collections**: Curated sets of player-created patterns

**Why It Works:**
- **Creative Investment**: Players invest time creating patterns
- **Social Recognition**: Community ratings provide validation
- **Long-Term Value**: Pattern library accumulates over time
- **Personal Expression**: Creative outlet beyond solving

### 5. Pattern Speed Challenges (Social Currency)

**Implementation:**
- **Daily Speed Run**: Solve standard pattern as fast as possible
- **Leaderboard**: Compare solve times for same pattern code
- **Speed Tiers**: Bronze, Silver, Gold, Platinum based on time
- **Shareable Badges**: Speed achievements for social sharing

**Why It Works:**
- **Competitive Element**: Speed adds challenge dimension
- **Social Comparison**: Leaderboards enable competition
- **Skill Demonstration**: Fast solves showcase expertise
- **Achievement Sharing**: Speed badges provide social currency

### 6. Progressive Pattern Complexity (Flow State)

**Implementation:**
- **Adaptive Generation**: Patterns match current skill level
- **Difficulty Ramps**: Simple → Symmetric → Multi-layer → Dynamic
- **Complexity Indicators**: Visual difficulty rating before starting
- **Opt-Out Option**: Can attempt harder patterns early (aspirational)

**Why It Works:**
- **Flow State**: Challenge matches skill level
- **Progressive Mastery**: Gradual skill development
- **Optimal Challenge**: Maintains engagement without frustration
- **Player Choice**: Can challenge yourself with harder patterns

---

## UX/UI Enhancements

### Satisfying Animations
- **Snap Feedback**: Pattern pieces snap into place with satisfying visual/audio
- **Symmetry Preview**: Real-time symmetry visualization as you build
- **Completion Celebration**: Pattern completion triggers celebration animation
- **Beauty Score Reveal**: Score reveal animation for completed patterns

### Symmetry Visualization
- **Live Preview**: See symmetry as you build (mirror lines, rotation centers)
- **Symmetry Highlighting**: Visual indicators of symmetric elements
- **Symmetry Validation**: Clear feedback on symmetry compliance
- **Multiple Symmetries**: Support for multiple symmetry types simultaneously

### Pattern Beauty Scoring
- **Aesthetic Evaluation**: Score based on symmetry, balance, harmony
- **Visual Breakdown**: See beauty score components
- **Beauty Tiers**: "Beautiful", "Stunning", "Masterpiece" ratings
- **Shareable Scores**: Beauty scores included in pattern sharing

### Mobile Gestures
- **Pinch-to-Zoom**: Zoom in on complex patterns
- **Rotate**: Rotate elements with rotation gesture
- **Swipe Undo**: Swipe left to undo last placement
- **Long-Press Options**: Long-press for element manipulation menu

### Pattern Gallery
- **Visual Browsing**: Thumbnail grid of completed patterns
- **Filter/Sort**: By type, difficulty, beauty score, date
- **Pattern Preview**: Quick preview before loading
- **Community Patterns**: Browse shared community patterns

---

## Retention Hooks Summary

1. **Daily Pattern Challenges**: New pattern every day
2. **Symmetry Streaks**: Maintain perfect symmetry consistency
3. **Pattern Sharing**: Create and share your own patterns
4. **Pattern Discovery**: Find rare pattern types
5. **Speed Challenges**: Compete on solve speed
6. **Pattern Type Mastery**: Unlock new pattern categories
7. **Free-Build Mode**: Creative expression and pattern creation
8. **Pattern Gallery**: Browse community patterns
9. **Beauty Scoring**: Create aesthetically pleasing patterns
10. **Community Recognition**: Pattern ratings and "Pattern of the Week"

---

## Effort, Risk, and Sequencing

### Relative Complexity: **Medium-High**

**Technical Complexity:**
- Pattern generation algorithm
- Symmetry validation system
- Pattern sharing/remixing system
- Beauty scoring algorithm
- Visual pattern rendering
- Pattern code generation

**Design Complexity:**
- Pattern rule design
- Symmetry system design
- Visual pattern aesthetics
- Mobile gesture system
- Pattern gallery UI

### Main Technical Risks

1. **Pattern Generation**: Creating interesting, solvable patterns
2. **Symmetry Validation**: Complex symmetry checking algorithms
3. **Visual Rendering**: Pattern visualization on mobile
4. **Pattern Sharing**: Efficient pattern serialization/storage
5. **Beauty Scoring**: Subjective aesthetic evaluation

### Main Design Risks

1. **Pattern Clarity**: Rules must be clear and understandable
2. **Difficulty Balance**: Too easy = boring, too hard = frustrating
3. **Visual Design**: Patterns must be visually appealing
4. **Mobile Interaction**: Complex pattern building on small screens
5. **Tutorial**: Teaching pattern thinking to new players

### Sequencing Recommendation: **Mid**

**Why Mid:**
- Requires more visual/graphic work than logic games
- Pattern generation is complex
- Can learn from earlier games (UI patterns, sharing systems)
- High engagement potential (creative expression, sharing)

**Dependencies:**
- Challenge code system (shared infrastructure)
- Pattern sharing system (game-specific)
- Visual rendering system (game-specific)
- Symmetry validation (game-specific)

**Recommended Order:**
1. After Constraint Optimizer (establishes sharing systems)
2. Before Memory Palace (spatial vs. memory focus)
3. Can be built in parallel with Flow Planner (different mechanics)

---

## Integration with Platform

### Shared Framework Components

- **SeededRNG**: Daily pattern generation
- **PersistenceManager**: Profile and pattern storage
- **Achievement System**: Pattern-related achievements
- **Streak Tracker**: Symmetry streak tracking
- **Challenge Codes**: Pattern code system

### Game-Specific Components

- **Pattern Generator**: Pattern creation algorithm
- **Symmetry Validator**: Symmetry checking system
- **Beauty Scorer**: Aesthetic evaluation algorithm
- **Pattern Renderer**: Visual pattern rendering
- **Pattern Serializer**: Pattern code encoding/decoding

### Cross-Game Features

- **Challenge Codes**: Universal code system (`PATT-XXXX-YYYY`)
- **Daily Challenge Hub**: Multi-game dashboard
- **Mastery Tiers**: Unified tier system
- **Achievement Showcase**: Shareable pattern achievements
- **Progress Analytics**: Spatial reasoning skill tracking

---

## Success Criteria

### "This is a Real Game Now"

- ✅ Multiple valid solutions (no single correct pattern)
- ✅ Meaningful strategic choices (complexity, symmetry, density)
- ✅ Replay value (daily challenges, pattern creation, gallery)
- ✅ Progression system (tiers, unlocks, pattern type mastery)
- ✅ Creative expression (free-build mode, pattern sharing)

### "Interesting After 10+ Minutes"

- ✅ Pattern complexity provides depth
- ✅ Symmetry requirements create challenge
- ✅ Pattern gallery provides exploration
- ✅ Free-build mode allows creativity
- ✅ Progressive difficulty maintains engagement

### "Choices Matter"

- ✅ Complexity choices affect scores
- ✅ Symmetry choices have clear trade-offs
- ✅ Pattern density choices impact validation
- ✅ All decisions affect final pattern
- ✅ No single dominant strategy

---

## Research-Backed Design Principles Applied

1. **Hook Model**: Daily trigger → pattern building action → variable rewards (discoveries, badges) → investment (created patterns, gallery)
2. **Flow State**: Adaptive difficulty maintains optimal challenge-skill balance
3. **Social Currency**: Pattern sharing, speed badges, community recognition
4. **Habit Formation**: Daily challenges, symmetry streaks, consistent engagement
5. **Strategic Depth**: Complexity trade-offs, symmetry choices, density decisions
6. **Variable Rewards**: Pattern discoveries, rare patterns, unexpected unlocks
7. **Investment Loops**: Created patterns, pattern library, favorited patterns
8. **Emotional Design**: Satisfying animations, beauty scoring, celebration moments

---

**Design Complete.** Pattern Architect combines spatial reasoning, creative expression, and pattern thinking into a visually engaging game that teaches valuable design skills while maintaining high engagement through sharing and community features.
