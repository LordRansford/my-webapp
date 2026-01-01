# Archive System Documentation

## Overview

The Archive System stores and retrieves completed daily puzzle sets, allowing players to:
- Review previous daily challenges
- Replay puzzles from past days
- Track their progress over time
- Compare performance across different days

## Features

### Core Functionality
- **Storage**: Stores completed daily puzzle sets in localStorage
- **Retrieval**: Loads archived sets by date
- **Replay**: Reconstructs puzzle sets for replay
- **Statistics**: Provides archive statistics and insights

### Data Persistence
- Uses localStorage with versioning support
- Stores up to 365 days (1 year) of archives
- Automatic cleanup of old entries
- Migration support for future updates

## Architecture

### Data Structures

#### `ArchivedPuzzleSet`
```typescript
interface ArchivedPuzzleSet {
  date: string; // YYYY-MM-DD
  seed: number;
  puzzles: Puzzle[];
  completedAt: number; // Timestamp
  score: number;
  totalPuzzles: number;
  accuracy: number;
  timeSpent: number; // Milliseconds
  playerXP: number; // XP at time of completion
}
```

#### `ArchiveData`
```typescript
interface ArchiveData {
  version: number;
  archivedSets: ArchivedPuzzleSet[];
  lastArchivedDate: string;
}
```

## API Reference

### Core Functions

#### `archivePuzzleSet()`
Archives a completed daily puzzle set.

```typescript
archivePuzzleSet(
  puzzles: Puzzle[],
  score: number,
  timeSpent: number,
  playerXP: number
): void
```

**Parameters**:
- `puzzles`: Array of completed puzzles
- `score`: Number of correct answers
- `timeSpent`: Total time in milliseconds
- `playerXP`: Player's XP at time of completion

**Example**:
```typescript
archivePuzzleSet(puzzles, 8, 450000, 1250);
```

#### `getArchivedSet()`
Retrieves an archived puzzle set for a specific date.

```typescript
getArchivedSet(date: string): ArchivedPuzzleSet | null
```

**Parameters**:
- `date`: Date string in YYYY-MM-DD format

**Returns**: Archived puzzle set or null if not found

**Example**:
```typescript
const archived = getArchivedSet('2024-01-15');
if (archived) {
  // Replay puzzles
}
```

#### `getAllArchivedSets()`
Gets all archived sets, sorted by date (newest first).

```typescript
getAllArchivedSets(): ArchivedPuzzleSet[]
```

**Returns**: Array of all archived sets

**Example**:
```typescript
const allArchived = getAllArchivedSets();
console.log(`You have ${allArchived.length} archived sets`);
```

#### `isDateArchived()`
Checks if a specific date is archived.

```typescript
isDateArchived(date: string): boolean
```

**Parameters**:
- `date`: Date string in YYYY-MM-DD format

**Returns**: True if date is archived, false otherwise

#### `reconstructPuzzleSet()`
Reconstructs puzzle set from archive for replay.

```typescript
reconstructPuzzleSet(archivedSet: ArchivedPuzzleSet): Puzzle[]
```

**Parameters**:
- `archivedSet`: Archived puzzle set

**Returns**: Array of puzzles ready for replay

#### `regeneratePuzzleSetFromSeed()`
Regenerates puzzle set from seed (for verification/comparison).

```typescript
regeneratePuzzleSetFromSeed(seed: number, playerTier?: string): Puzzle[]
```

**Parameters**:
- `seed`: Puzzle seed
- `playerTier`: Player tier (optional)

**Returns**: Regenerated puzzle set

#### `getArchiveStats()`
Gets comprehensive archive statistics.

```typescript
getArchiveStats(): ArchiveStats
```

**Returns**: Archive statistics including:
- Total archived sets
- Perfect scores count
- Average score and accuracy
- Best score
- Longest streak
- First and last archived dates

**Example**:
```typescript
const stats = getArchiveStats();
console.log(`Average score: ${stats.averageScore.toFixed(1)}`);
console.log(`Best score: ${stats.bestScore}`);
console.log(`Longest streak: ${stats.longestStreak} days`);
```

### Storage Functions

#### `loadArchive()`
Loads archive data from localStorage.

```typescript
loadArchive(): ArchiveData
```

**Returns**: Archive data (creates default if none exists)

#### `saveArchive()`
Saves archive data to localStorage.

```typescript
saveArchive(data: ArchiveData): void
```

**Parameters**:
- `data`: Archive data to save

#### `clearArchive()`
Clears all archive data (for testing/reset).

```typescript
clearArchive(): void
```

## Usage Examples

### Archiving a Completed Game

```typescript
import { archivePuzzleSet } from './archive';

// After game completion
const score = performances.filter(p => p.correct).length;
const timeSpent = Date.now() - sessionStartTime;
const playerXP = currentXP;

archivePuzzleSet(puzzles, score, timeSpent, playerXP);
```

### Loading and Replaying Archived Puzzles

```typescript
import { getArchivedSet, reconstructPuzzleSet } from './archive';

// Get archived set for a specific date
const archived = getArchivedSet('2024-01-15');

if (archived) {
  // Reconstruct puzzles for replay
  const puzzles = reconstructPuzzleSet(archived);
  
  // Load into game state
  setPuzzles(puzzles);
  setStatus('playing');
  
  // Display archived info
  console.log(`Score: ${archived.score}/${archived.totalPuzzles}`);
  console.log(`Accuracy: ${(archived.accuracy * 100).toFixed(1)}%`);
}
```

### Displaying Archive Statistics

```typescript
import { getArchiveStats } from './archive';

const stats = getArchiveStats();

// Display in UI
<div>
  <h3>Archive Statistics</h3>
  <p>Total Archived: {stats.totalArchived}</p>
  <p>Average Score: {stats.averageScore.toFixed(1)}</p>
  <p>Perfect Scores: {stats.totalPerfectScores}</p>
  <p>Longest Streak: {stats.longestStreak} days</p>
</div>
```

### Listing All Archived Dates

```typescript
import { getAllArchivedSets } from './archive';

const archived = getAllArchivedSets();

// Display date list
archived.forEach(set => {
  console.log(`${set.date}: ${set.score}/${set.totalPuzzles} (${(set.accuracy * 100).toFixed(0)}%)`);
});
```

## Storage Details

### localStorage Key
- Key: `daily-logic-gauntlet-archive`
- Format: JSON stringified `ArchiveData`

### Storage Limits
- Maximum entries: 365 (1 year)
- Automatic cleanup: Oldest entries removed when limit exceeded
- Storage size: ~50-100KB per entry (depends on puzzle complexity)

### Version Management
- Current version: 1
- Migration support: Future versions can migrate data
- Backward compatibility: Old versions are migrated on load

## Integration

### With Game Component

The archive system should be integrated into the game's finish handler:

```typescript
const handleFinish = useCallback(async () => {
  // ... existing finish logic ...
  
  // Archive the completed set
  if (puzzles.length > 0 && performances.length > 0) {
    const score = performances.filter(p => p.correct).length;
    const timeSpent = sessionStartTime ? Date.now() - sessionStartTime : 0;
    
    archivePuzzleSet(puzzles, score, timeSpent, playerXP);
  }
  
  // ... rest of finish logic ...
}, [/* dependencies */]);
```

### With Archive UI Component

Create an archive browser component:

```typescript
import { getAllArchivedSets, getArchivedSet } from './archive';

function ArchiveBrowser() {
  const archived = getAllArchivedSets();
  
  return (
    <div>
      {archived.map(set => (
        <ArchiveEntry
          key={set.date}
          date={set.date}
          score={set.score}
          total={set.totalPuzzles}
          accuracy={set.accuracy}
          onReplay={() => replaySet(set.date)}
        />
      ))}
    </div>
  );
}
```

## Best Practices

1. **Archive on Completion**: Always archive after game completion
2. **Check Before Archiving**: Verify puzzles are complete before archiving
3. **Handle Storage Errors**: Wrap archive operations in try-catch
4. **Limit Display**: When showing archive lists, paginate or limit results
5. **Validate Dates**: Ensure dates are in YYYY-MM-DD format

## Future Enhancements

- Export/import archive data
- Cloud sync (with user permission)
- Archive search and filtering
- Archive statistics visualization
- Compare performance across days
- Archive sharing (with privacy controls)
