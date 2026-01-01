# Cross-Game Engagement Systems

**Version:** 1.0  
**Date:** Current  
**Status:** Design Complete  
**Target Platform:** Browser (Next.js), Mobile-First

---

## Executive Summary

This document defines the cross-game engagement systems that work across all games in the platform. These systems enable social sharing, progression tracking, and unified player experience while maintaining privacy-first, browser-only architecture.

**Core Systems:**
1. Universal Challenge Code System
2. Enhanced Achievement System
3. Unified Mastery Tiers
4. Daily Challenge Hub
5. Progress Analytics

---

## 1. Universal Challenge Code System

### Overview

Every daily challenge across all games generates a unique, shareable code that enables players to compare results without revealing solutions. The system works entirely client-side using localStorage and code matching.

### Code Format

**Pattern**: `GAME-YYYY-MM-DD-XXXX`

**Examples:**
- `DLG-2024-03-15-A7K2` (Daily Logic Gauntlet)
- `COPT-2024-03-15-B3M9` (Constraint Optimizer)
- `PATT-2024-03-15-C4N1` (Pattern Architect)
- `DEDU-2024-03-15-D5O2` (Deduction Grid)
- `FLOW-2024-03-15-E6P3` (Flow Planner)
- `MEMO-2024-03-15-F7Q4` (Memory Palace)

**Components:**
- **GAME**: 4-letter game identifier (uppercase)
- **YYYY-MM-DD**: Challenge date (ISO format)
- **XXXX**: 4-character seed hash (alphanumeric)

### Functionality

#### Code Generation

```typescript
interface ChallengeCode {
  gameId: string;        // Game identifier
  date: string;          // YYYY-MM-DD
  seed: string;          // Challenge seed
  hash: string;          // 4-character hash
}

function generateChallengeCode(gameId: string, seed: string): string {
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const hash = generateHash(seed).substring(0, 4).toUpperCase();
  return `${gameId.toUpperCase()}-${date}-${hash}`;
}
```

#### Code Sharing

**Sharing Methods:**
- Copy code to clipboard
- Share via social media (code as text)
- Share via messaging apps
- Generate shareable link (optional, future)

**Privacy:**
- Codes contain no personal information
- Codes only identify challenge parameters (game, date, seed)
- Player data never shared, only challenge identification

#### Code Comparison

**How It Works:**
1. Player enters challenge code
2. System loads challenge parameters from code
3. System generates same challenge (from seed)
4. Player completes challenge
5. Results compared to other players who used same code

**Comparison Data:**
- Efficiency scores
- Completion times
- Achievement unlocks
- Percentile rankings
- No solutions shared (privacy-first)

**Implementation:**
- `localStorage` stores comparison data per code
- Anonymous aggregation (no user identification)
- Client-side only (no server required for MVP)

### Storage

**localStorage Keys:**
- `challenge-codes-${gameId}`: Stored codes per game
- `comparison-data-${code}`: Comparison data per code
- `player-codes-${gameId}`: Player's completed codes

**Data Structure:**
```typescript
interface CodeStorage {
  code: string;
  gameId: string;
  date: string;
  playerResult: {
    score: number;
    time: number;
    achievements: string[];
    timestamp: number;
  };
  comparison?: {
    averageScore: number;
    percentile: number;
    participantCount: number;
  };
}
```

---

## 2. Enhanced Achievement System

### Overview

A unified achievement system across all games that tracks player accomplishments, unlocks rewards, and provides shareable badges. Achievements are categorized by rarity and type.

### Achievement Categories

#### 1. Game-Specific Achievements

**Daily Logic Gauntlet:**
- "Perfect Gauntlet": Complete daily challenge with 100% accuracy
- "Speed Runner": Complete daily challenge in under 5 minutes
- "Logic Master": Solve 100 puzzles correctly
- "Streak Keeper": Maintain 30-day streak
- "Hint-Free Hero": Complete 10 puzzles without hints

**Constraint Optimizer:**
- "Efficiency Expert": Achieve >95% efficiency score
- "Resource Minimalist": Solve challenge with minimal resource waste
- "Constraint Master": Solve challenge with all constraints satisfied
- "Optimization Legend": Top 1% efficiency for daily challenge

**Pattern Architect:**
- "Symmetry Perfectionist": Perfect symmetry score on 10 patterns
- "Pattern Creator": Create 10 player-designed patterns
- "Speed Architect": Solve pattern in under 30 seconds
- "Beauty Master": Achieve >90 beauty score

**Deduction Grid:**
- "Deduction Chain": Complete puzzle with 5+ step deduction chain
- "Technique Master": Master all deduction techniques
- "Speed Logician": Solve puzzle in under 2 minutes
- "Perfect Logic": Complete puzzle without hints

**Flow Planner:**
- "Flow Optimizer": Achieve >95% efficiency score
- "Bottleneck Master": Identify and optimize all bottlenecks
- "Template Creator": Create 10 reusable flow templates
- "Efficiency Legend": Top 1% efficiency for daily challenge

**Memory Palace:**
- "Memory Master": Achieve >90% recall accuracy
- "Palace Builder": Build memory palace with 100 locations
- "Technique Expert": Master all memory techniques
- "Spaced Repetition Champion": Complete 100 spaced reviews

#### 2. Cross-Game Achievements

**Platform-Wide:**
- "Multi-Game Master": Play all 6 games
- "Daily Champion": Complete daily challenge in all games
- "Streak Collector": Maintain 7-day streak across all games
- "Achievement Hunter": Unlock 50 achievements
- "Platform Explorer": Reach intermediate tier in all games
- "Master Strategist": Reach expert tier in 3+ games
- "Completionist": Complete 100 daily challenges total
- "Social Sharer": Share 10 challenge codes
- "Community Contributor": Create 5 user-generated patterns/templates

#### 3. Milestone Achievements

**Streak Milestones:**
- "Week Warrior": 7-day streak
- "Month Master": 30-day streak
- "Century Club": 100-day streak
- "Year Champion": 365-day streak

**Progression Milestones:**
- "First Steps": Complete first challenge
- "Novice": Reach Novice tier in any game
- "Intermediate": Reach Intermediate tier in any game
- "Expert": Reach Expert tier in any game
- "Master": Reach Master tier in any game

### Achievement Rarity Tiers

1. **Common** (Gray)
   - Easy to achieve
   - First-time accomplishments
   - Basic progression milestones

2. **Uncommon** (Green)
   - Moderate difficulty
   - Regular play accomplishments
   - Tier progression

3. **Rare** (Blue)
   - Significant accomplishment
   - Skill-based achievements
   - Streak milestones (7-30 days)

4. **Epic** (Purple)
   - Difficult to achieve
   - Expert-level accomplishments
   - Long streaks (100+ days)
   - Top percentile performances

5. **Legendary** (Gold)
   - Extremely rare
   - Perfect achievements
   - Maximum mastery
   - Top 1% performances
   - Year-long streaks

### Achievement Storage

**localStorage Key**: `achievements-profile`

**Data Structure:**
```typescript
interface AchievementData {
  unlocked: string[];              // Array of achievement IDs
  progress: Record<string, number>; // Progress tracking (e.g., "puzzles-solved": 47)
  stats: {
    totalUnlocked: number;
    byRarity: Record<string, number>;
    byGame: Record<string, number>;
  };
  recentUnlocks: Array<{
    id: string;
    unlockedAt: number;
  }>;
}
```

### Achievement Display

**In-Game Notification:**
- Toast notification on unlock
- Achievement card with icon, name, description, rarity
- Dismissible, non-intrusive

**Achievement Gallery:**
- Visual gallery of all achievements
- Filter by game, rarity, unlocked/locked
- Progress indicators for in-progress achievements
- Shareable badge images

**Shareable Badges:**
- Visual badge images for social sharing
- Include achievement name, rarity, unlock date
- Optional: Include game context
- Privacy-first: No personal data in badge

---

## 3. Unified Mastery Tiers

### Overview

A unified tier system that tracks player progression across all games. Tiers provide clear progression goals, unlock new features, and enable cross-game comparison.

### Tier Structure

**5 Tiers (Per Game):**

1. **Novice** (0-100 XP)
   - Entry level
   - Basic features unlocked
   - Learning phase

2. **Optimizer/Builder/Apprentice/Expert** (100-300 XP)
   - Intermediate level
   - Core features unlocked
   - Skill development

3. **Expert/Master** (300-600 XP)
   - Advanced level
   - Advanced features unlocked
   - Technique mastery

4. **Master/Grandmaster** (600-1000 XP)
   - Expert level
   - Most features unlocked
   - Advanced techniques

5. **Grandmaster/Master** (1000+ XP)
   - Maximum level
   - All features unlocked
   - Mastery achieved

**Game-Specific Tier Names:**
- Daily Logic Gauntlet: Novice → Strategist → Logician → Master → Grandmaster
- Constraint Optimizer: Novice → Optimizer → Efficiency Expert → Master Planner → Optimization Master
- Pattern Architect: Pattern Learner → Pattern Builder → Symmetry Master → Pattern Architect → Master Architect
- Deduction Grid: Logic Novice → Deduction Apprentice → Inference Expert → Logic Master → Deduction Grandmaster
- Flow Planner: Flow Beginner → Path Optimizer → Efficiency Expert → Flow Master → Master Planner
- Memory Palace: Memory Novice → Technique Learner → Palace Builder → Memory Master → Master Mnemonist

### Platform-Wide Tiers

**Aggregate Tiers:**
- **Platform Novice**: Novice tier in 1+ games
- **Platform Explorer**: Intermediate tier in 3+ games
- **Platform Strategist**: Expert tier in 3+ games
- **Platform Master**: Master tier in 4+ games
- **Platform Grandmaster**: Master tier in all games

### Tier Benefits

**Progression Unlocks:**
- New game modes
- Advanced features
- Technique unlocks
- Challenge types
- Sharing capabilities

**Visual Recognition:**
- Tier badges
- Profile display
- Achievement integration
- Shareable tier progress

### Tier Storage

**localStorage Key**: `mastery-tiers-profile`

**Data Structure:**
```typescript
interface TierData {
  games: Record<string, {
    xp: number;
    tier: number;
    tierName: string;
    progress: number; // 0-100% to next tier
  }>;
  platform: {
    aggregateTier: string;
    gamesAtTier: Record<string, number>; // Count of games at each tier
  };
}
```

---

## 4. Daily Challenge Hub

### Overview

A unified dashboard that displays all daily challenges across all games in one place. Enables quick access, streak tracking, and multi-game engagement.

### Hub Features

#### Challenge Overview

**Display Per Game:**
- Game name and icon
- Challenge availability (available/completed)
- Challenge difficulty indicator
- Estimated completion time
- Challenge code (for sharing)

**Visual Status:**
- ✅ Completed
- 🔄 In Progress
- ⏰ Available
- 🔒 Locked (not yet unlocked)

#### Quick Actions

**Per Challenge:**
- "Start Challenge" button
- "View Details" link
- "Share Code" button
- "View Archive" link

#### Streak Overview

**Display:**
- Current streak per game
- Combined streak (all games)
- Streak calendar (visual)
- Streak milestones progress

**Streak Freeze:**
- One free pass per month (platform-wide)
- Can be used for any game
- Prevents streak loss

#### Challenge Calendar

**Visual Calendar:**
- Shows upcoming challenges
- Highlights completed challenges
- Shows streak pattern
- Monthly view

#### Progress Summary

**Platform Stats:**
- Total daily challenges completed
- Games played today
- Current streaks
- Tier progress overview

### Hub Storage

**localStorage Keys:**
- `daily-challenge-hub-state`: Hub UI state
- `daily-challenges-${gameId}`: Per-game challenge data
- `hub-streaks`: Combined streak data

**Data Structure:**
```typescript
interface HubState {
  games: Array<{
    gameId: string;
    challengeAvailable: boolean;
    challengeCompleted: boolean;
    challengeCode: string;
    streak: number;
    tier: string;
  }>;
  combinedStreak: number;
  lastVisit: number;
}
```

---

## 5. Progress Analytics

### Overview

A comprehensive analytics system that tracks player progress across all games, providing insights into skill development, game preferences, and improvement over time.

### Analytics Features

#### Skill Development Charts

**Visualizations:**
- XP progression over time (per game, combined)
- Tier progression timeline
- Skill improvement curves
- Performance trends

**Metrics Tracked:**
- Accuracy/score trends
- Completion time trends
- Efficiency improvements
- Technique mastery progress

#### Game Preference Insights

**Analysis:**
- Time spent per game
- Games played most frequently
- Preferred game types
- Skill strengths by game

**Insights Generated:**
- "You excel at spatial reasoning games"
- "You prefer logic-based challenges"
- "Your fastest improvement is in optimization games"

#### Time Investment Tracking

**Metrics:**
- Total play time
- Average session length
- Time per game
- Daily/weekly/monthly activity

**Visualizations:**
- Time distribution pie chart
- Activity heatmap (calendar view)
- Session frequency graph

#### Goal Setting

**Goal Types:**
- Daily challenge completion goals
- Streak goals (e.g., "30-day streak")
- Tier progression goals
- Achievement unlock goals

**Goal Tracking:**
- Progress indicators
- Goal reminders
- Completion celebrations
- Goal history

### Analytics Storage

**localStorage Key**: `progress-analytics-profile`

**Data Structure:**
```typescript
interface AnalyticsData {
  games: Record<string, {
    xpHistory: Array<{ date: string; xp: number }>;
    performanceHistory: Array<{
      date: string;
      score: number;
      time: number;
    }>;
    sessionHistory: Array<{
      date: string;
      duration: number;
      challengesCompleted: number;
    }>;
  }>;
  platform: {
    totalPlayTime: number;
    totalSessions: number;
    activityHeatmap: Record<string, number>; // Date -> activity count
    goals: Array<{
      id: string;
      type: string;
      target: number;
      current: number;
      deadline?: string;
    }>;
  };
}
```

### Privacy Considerations

**Data Collection:**
- All analytics stored locally only
- No server-side analytics (for MVP)
- No personal information collected
- Opt-in only (player can disable analytics)

**Data Usage:**
- Used only for player insights
- Never shared externally
- Player can export/delete data
- Transparent about what's tracked

---

## Implementation Notes

### Browser-Only Architecture

**Storage:**
- All data stored in `localStorage`
- No server required for MVP
- Client-side code generation and matching
- Anonymous aggregation only

**Limitations:**
- Comparison data only available locally
- No global leaderboards (without server)
- Limited sharing capabilities (codes only)
- No cross-device sync (localStorage only)

**Future Enhancements:**
- Optional server sync (if accounts added)
- Global leaderboards
- Enhanced sharing
- Cross-device sync

### Privacy-First Design

**Principles:**
- No personal data in codes
- Anonymous comparisons only
- All data stored locally
- Player controls data
- Transparent about data usage

**Sharing Safety:**
- Codes contain no personal information
- Only challenge parameters shared
- Solutions never shared
- Player data never exposed

### Performance Considerations

**Optimization:**
- Lazy loading of analytics data
- Efficient localStorage usage
- Caching of comparison data
- Debounced analytics updates

**Scalability:**
- localStorage has size limits (~5-10MB)
- May need data pruning for long-term use
- Consider IndexedDB for larger datasets (future)

---

## Integration Checklist

### Per-Game Integration

- [ ] Generate challenge codes for daily challenges
- [ ] Store codes in localStorage
- [ ] Implement code sharing UI
- [ ] Implement code comparison logic
- [ ] Integrate achievement system
- [ ] Track tier progression
- [ ] Report progress to analytics
- [ ] Integrate with Daily Challenge Hub

### Platform Integration

- [ ] Implement Daily Challenge Hub UI
- [ ] Aggregate streak data across games
- [ ] Implement progress analytics dashboard
- [ ] Create achievement gallery
- [ ] Implement cross-game achievement tracking
- [ ] Create tier progression UI
- [ ] Implement sharing infrastructure

---

**Design Complete.** These cross-game systems provide unified engagement mechanics while maintaining privacy-first, browser-only architecture. They enable social sharing, progression tracking, and player insights without requiring accounts or servers.
