# Achievement System Documentation

## Overview

The Achievement System tracks player accomplishments and unlocks badges for various milestones. Achievements provide progression goals, unlock features, and give players recognition for their dedication and skill development.

## Features

### Core Functionality
- **21 Unique Achievements**: Covering progress, skill, streaks, milestones, and special accomplishments
- **5 Rarity Levels**: Common, Uncommon, Rare, Epic, Legendary
- **5 Categories**: Progress, Skill, Streak, Milestone, Special
- **Progress Tracking**: For achievements with progress requirements
- **Unlock Notifications**: Alert players when achievements are unlocked
- **Statistics**: Track completion rates and progress

### Achievement Categories

#### Progress Achievements (5)
- First Steps - Complete first puzzle
- Gauntlet Runner - Complete first daily gauntlet
- Novice - Reach Novice tier
- Apprentice - Reach Apprentice tier
- Adept - Reach Adept tier

#### Skill Achievements (3)
- Perfect Score - Answer all 10 puzzles correctly
- Expert - Reach Expert tier
- Master - Reach Master tier

#### Streak Achievements (4)
- Getting Started - 3-day streak
- Week Warrior - 7-day streak
- Monthly Master - 30-day streak
- Centurion - 100-day streak

#### Milestone Achievements (6)
- Aspiring Learner - 1,000 XP
- Dedicated Scholar - 5,000 XP
- Logic Legend - 10,000 XP
- Week Collector - Archive 7 sets
- Monthly Archive - Archive 30 sets
- Century Archive - Archive 100 sets

#### Special Achievements (3)
- Speed Demon - Complete gauntlet in under 5 minutes
- Persistent - Complete 50 gauntlets
- Hint-Free Hero - Complete a gauntlet without hints

## Architecture

### Data Structures

#### `AchievementId`
```typescript
type AchievementId =
  | 'first-puzzle'
  | 'first-complete'
  | 'perfect-score'
  | 'streak-3'
  | 'streak-7'
  | 'streak-30'
  | 'streak-100'
  | 'xp-1000'
  | 'xp-5000'
  | 'xp-10000'
  | 'master-novice'
  | 'master-apprentice'
  | 'master-adept'
  | 'master-expert'
  | 'master-master'
  | 'speed-demon'
  | 'persistent'
  | 'hint-free'
  | 'archive-7'
  | 'archive-30'
  | 'archive-100';
```

#### `Achievement`
```typescript
interface Achievement {
  id: AchievementId;
  name: string;
  description: string;
  category: 'progress' | 'skill' | 'streak' | 'milestone' | 'special';
  icon: string; // Emoji
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: number; // Timestamp
  progress?: number; // 0-1
  maxProgress?: number;
}
```

#### `AchievementData`
```typescript
interface AchievementData {
  version: number;
  unlocked: Set<AchievementId>;
  progress: Map<AchievementId, number>;
  unlockedTimestamps: Map<AchievementId, number>;
}
```

## API Reference

### Core Functions

#### `checkAndUnlockAchievements()`
Checks game state and unlocks any eligible achievements.

```typescript
checkAndUnlockAchievements(context: AchievementCheckContext): AchievementId[]
```

**Parameters**:
- `context`: Achievement check context with game state

**Returns**: Array of newly unlocked achievement IDs

**Example**:
```typescript
const context = {
  totalXP: 1250,
  currentTier: 'apprentice',
  currentStreak: 5,
  gamesCompleted: 12,
  perfectScores: 2,
  archivedSets: 12,
  hintFreeCompletions: 1,
};

const newlyUnlocked = checkAndUnlockAchievements(context);
if (newlyUnlocked.length > 0) {
  showAchievementNotification(newlyUnlocked);
}
```

#### `unlockAchievement()`
Manually unlock an achievement (usually called by check function).

```typescript
unlockAchievement(achievementId: AchievementId): boolean
```

**Parameters**:
- `achievementId`: Achievement ID to unlock

**Returns**: True if newly unlocked, false if already unlocked

#### `isAchievementUnlocked()`
Check if an achievement is unlocked.

```typescript
isAchievementUnlocked(achievementId: AchievementId): boolean
```

**Parameters**:
- `achievementId`: Achievement ID to check

**Returns**: True if unlocked

#### `getAchievement()`
Get achievement data by ID.

```typescript
getAchievement(achievementId: AchievementId): Achievement | undefined
```

**Parameters**:
- `achievementId`: Achievement ID

**Returns**: Achievement data or undefined

#### `getUnlockedAchievements()`
Get all unlocked achievements.

```typescript
getUnlockedAchievements(): Achievement[]
```

**Returns**: Array of unlocked achievements

#### `getAchievementsByCategory()`
Get achievements filtered by category.

```typescript
getAchievementsByCategory(category: Achievement['category']): Achievement[]
```

**Parameters**:
- `category`: Achievement category

**Returns**: Array of achievements in category

#### `getAchievementStats()`
Get comprehensive achievement statistics.

```typescript
getAchievementStats(): AchievementStats
```

**Returns**: Statistics including:
- Total achievements
- Unlocked count
- Progress percentage
- Breakdown by category
- Breakdown by rarity

### Progress Functions

#### `updateAchievementProgress()`
Update progress for progress-based achievements.

```typescript
updateAchievementProgress(achievementId: AchievementId, progress: number): void
```

**Parameters**:
- `achievementId`: Achievement ID
- `progress`: Progress value (0-1)

#### `getAchievementProgress()`
Get current progress for an achievement.

```typescript
getAchievementProgress(achievementId: AchievementId): number
```

**Parameters**:
- `achievementId`: Achievement ID

**Returns**: Progress value (0-1)

### State Management Functions

#### `loadAchievements()`
Load achievement data from localStorage.

```typescript
loadAchievements(): AchievementData
```

**Returns**: Achievement data

#### `saveAchievements()`
Save achievement data to localStorage.

```typescript
saveAchievements(data: AchievementData): void
```

**Parameters**:
- `data`: Achievement data to save

#### `clearAchievements()`
Clear all achievements (for testing).

```typescript
clearAchievements(): void
```

## Usage Examples

### Checking Achievements After Game Completion

```typescript
import { checkAndUnlockAchievements, getAchievement } from './achievements';
import { getArchiveStats } from './archive';

const handleFinish = async () => {
  // ... game completion logic ...
  
  // Check and unlock achievements
  const archiveStats = getArchiveStats();
  const context = {
    totalXP: playerXP,
    currentTier: getTierFromXP(playerXP),
    currentStreak: streakData.currentStreak,
    gamesCompleted: profile.mastery[GAME_CONFIG.id].stats.gamesPlayed,
    perfectScores: performances.every(p => p.correct) ? 1 : 0,
    archivedSets: archiveStats.totalArchived,
    fastestCompletion: timeSpent,
    hintFreeCompletions: Object.values(hintsUsed).every(h => h === 0) ? 1 : 0,
  };
  
  const newlyUnlocked = checkAndUnlockAchievements(context);
  
  // Show notifications for new achievements
  newlyUnlocked.forEach(id => {
    const achievement = getAchievement(id);
    if (achievement) {
      showAchievementNotification(achievement);
    }
  });
};
```

### Displaying Achievement List

```typescript
import { ALL_ACHIEVEMENTS, isAchievementUnlocked } from './achievements';

function AchievementList() {
  const unlocked = ALL_ACHIEVEMENTS.filter(a => isAchievementUnlocked(a.id));
  const locked = ALL_ACHIEVEMENTS.filter(a => !isAchievementUnlocked(a.id));
  
  return (
    <div>
      <h2>Achievements</h2>
      
      <section>
        <h3>Unlocked ({unlocked.length})</h3>
        {unlocked.map(achievement => (
          <AchievementCard key={achievement.id} achievement={achievement} unlocked />
        ))}
      </section>
      
      <section>
        <h3>Locked ({locked.length})</h3>
        {locked.map(achievement => (
          <AchievementCard key={achievement.id} achievement={achievement} locked />
        ))}
      </section>
    </div>
  );
}
```

### Achievement Notification Component

```typescript
import { Achievement } from './achievements';

function AchievementNotification({ achievement }: { achievement: Achievement }) {
  return (
    <div className="achievement-notification">
      <div className="achievement-icon">{achievement.icon}</div>
      <div className="achievement-content">
        <div className="achievement-name">{achievement.name}</div>
        <div className="achievement-description">{achievement.description}</div>
        <div className="achievement-rarity">{achievement.rarity}</div>
      </div>
    </div>
  );
}
```

### Displaying Achievement Statistics

```typescript
import { getAchievementStats } from './achievements';

function AchievementStats() {
  const stats = getAchievementStats();
  
  return (
    <div>
      <h3>Achievement Progress</h3>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${stats.progress}%` }}
        />
      </div>
      <p>{stats.unlocked} / {stats.total} unlocked</p>
      
      <div>
        <h4>By Category</h4>
        {Object.entries(stats.byCategory).map(([category, data]) => (
          <div key={category}>
            {category}: {data.unlocked} / {data.total}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Achievement List

### Progress Achievements
1. **First Steps** 🎯 - Complete your first puzzle (Common)
2. **Gauntlet Runner** 🏁 - Complete your first daily gauntlet (Common)
3. **Novice** 🌱 - Reach Novice tier (Common)
4. **Apprentice** 🌿 - Reach Apprentice tier (Common)
5. **Adept** 🌳 - Reach Adept tier (Uncommon)

### Skill Achievements
1. **Perfect Score** ⭐ - Answer all 10 puzzles correctly (Rare)
2. **Expert** 🌲 - Reach Expert tier (Rare)
3. **Master** 👑 - Reach Master tier (Epic)

### Streak Achievements
1. **Getting Started** 🔥 - Maintain a 3-day streak (Common)
2. **Week Warrior** 💪 - Maintain a 7-day streak (Uncommon)
3. **Monthly Master** 👑 - Maintain a 30-day streak (Rare)
4. **Centurion** 🏆 - Maintain a 100-day streak (Legendary)

### Milestone Achievements
1. **Aspiring Learner** 📚 - Reach 1,000 XP (Common)
2. **Dedicated Scholar** 🎓 - Reach 5,000 XP (Uncommon)
3. **Logic Legend** 🌟 - Reach 10,000 XP (Rare)
4. **Week Collector** 📦 - Archive 7 different daily sets (Common)
5. **Monthly Archive** 📚 - Archive 30 different daily sets (Uncommon)
6. **Century Archive** 🏛️ - Archive 100 different daily sets (Rare)

### Special Achievements
1. **Speed Demon** ⚡ - Complete a gauntlet in under 5 minutes (Uncommon)
2. **Persistent** 💎 - Complete 50 gauntlets (Rare)
3. **Hint-Free Hero** 🎖️ - Complete a gauntlet without using any hints (Uncommon)

## Integration

### With Game Completion
- Check achievements after each game completion
- Include all relevant context data
- Show notifications for new unlocks

### With Progression System
- Check tier achievements when tier changes
- Check XP achievements when XP milestones reached
- Update progress for progress-based achievements

### With Archive System
- Check archive achievements when sets are archived
- Use archive stats in achievement context

### With UI
- Display achievement list in profile/stats
- Show achievement notifications
- Display achievement progress
- Show achievement statistics

## Best Practices

1. **Check Regularly**: Check achievements after significant events
2. **Provide Context**: Include all relevant data in check context
3. **Show Notifications**: Alert players to new unlocks
4. **Track Progress**: Update progress for progress-based achievements
5. **Persist State**: Save achievement data regularly
6. **Validate Data**: Ensure achievement data is valid before saving

## Future Enhancements

- Achievement tiers (bronze, silver, gold)
- Seasonal achievements
- Community achievements
- Achievement rewards
- Achievement sharing
- Achievement leaderboards
- Custom achievement notifications
