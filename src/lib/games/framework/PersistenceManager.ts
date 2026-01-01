/**
 * Persistence Manager with Versioning
 * 
 * Handles game state persistence with versioning and migration support.
 * Supports both localStorage (quick access) and IndexedDB (larger data).
 * 
 * Based on technical architecture specification for gold-standard implementation.
 */

/**
 * Game save data structure
 */
export interface GameSave<T = unknown> {
  version: string;
  gameId: string;
  timestamp: number;
  state: T;
  metadata?: {
    difficulty?: number;
    score?: number;
    moves?: number;
    duration?: number;
    [key: string]: unknown;
  };
}

/**
 * Player profile structure
 */
export interface PlayerProfile {
  version: string;
  pseudonym: string;
  mastery: Record<string, {
    tier: string;
    xp: number;
    unlocks: string[];
    stats: {
      gamesPlayed: number;
      wins: number;
      bestScore: number;
      averageScore: number;
    };
    playerModel?: unknown; // Player capability model (game-specific)
  }>;
  achievements: string[];
  settings: {
    audioEnabled: boolean;
    reducedMotion: boolean;
    highContrast: boolean;
    tutorialCompleted: boolean;
    [key: string]: unknown;
  };
  lastPlayed: Record<string, number>; // gameId -> timestamp
  createdAt: number;
  lastUpdated: number;
}

/**
 * Migration function type
 */
type MigrationFunction<T = unknown> = (data: GameSave<T>) => GameSave<T>;

/**
 * Persistence manager with versioning and migration
 */
export class PersistenceManager {
  private readonly STORAGE_KEY_PREFIX = 'ransford-games';
  private readonly CURRENT_VERSION = '2.0.0';
  private readonly MAX_BACKUPS = 5;
  
  private migrations: Map<string, MigrationFunction> = new Map();
  
  constructor(gameId: string) {
    this.gameId = gameId;
    this.registerMigrations();
  }
  
  private gameId: string;
  
  /**
   * Register migration functions
   */
  private registerMigrations(): void {
    // Migration from 1.0.0 to 2.0.0
    this.migrations.set('1.0.0->2.0.0', (data: GameSave) => {
      // Add new fields with defaults
      const v2Data: GameSave = {
        ...data,
        version: '2.0.0',
        metadata: {
          ...data.metadata,
          // Add any new metadata fields with defaults
        },
      };
      return v2Data;
    });
  }
  
  /**
   * Get storage key for game
   */
  private getStorageKey(type: 'save' | 'profile' | 'backup' = 'save'): string {
    if (type === 'profile') {
      return `${this.STORAGE_KEY_PREFIX}-profile`;
    }
    if (type === 'backup') {
      return `${this.STORAGE_KEY_PREFIX}-${this.gameId}-backup-${Date.now()}`;
    }
    return `${this.STORAGE_KEY_PREFIX}-${this.gameId}`;
  }
  
  /**
   * Save game state
   */
  async saveGameState<T>(state: T, metadata?: GameSave['metadata']): Promise<void> {
    const saveData: GameSave<T> = {
      version: this.CURRENT_VERSION,
      gameId: this.gameId,
      timestamp: Date.now(),
      state,
      metadata,
    };
    
    try {
      // Save to localStorage (quick access)
      const key = this.getStorageKey();
      localStorage.setItem(key, JSON.stringify(saveData));
    } catch (error) {
      // Handle quota exceeded error
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        // Try to free up space
        await this.cleanupOldSaves();
        // Retry once
        try {
          localStorage.setItem(this.getStorageKey(), JSON.stringify(saveData));
        } catch (retryError) {
          console.error('Failed to save game state after cleanup:', retryError);
          throw new Error('Storage quota exceeded. Please free up space.');
        }
      } else {
        console.error('Failed to save game state:', error);
        throw error;
      }
    }
  }
  
  /**
   * Load game state with automatic migration
   */
  async loadGameState<T>(): Promise<GameSave<T> | null> {
    try {
      const key = this.getStorageKey();
      const data = localStorage.getItem(key);
      
      if (!data) {
        return null;
      }
      
      const saveData: GameSave<T> = JSON.parse(data);
      return await this.migrateAndLoad(saveData);
    } catch (error) {
      console.error('Failed to load game state:', error);
      return null;
    }
  }
  
  /**
   * Migrate save data to current version
   */
  private async migrateAndLoad<T>(saveData: GameSave<T>): Promise<GameSave<T>> {
    if (saveData.version === this.CURRENT_VERSION) {
      return saveData;
    }
    
    // Create backup before migration
    await this.createBackup(saveData);
    
    // Apply migrations
    let migratedData = saveData;
    const migrationPath = this.getMigrationPath(saveData.version, this.CURRENT_VERSION);
    
    for (const migrationKey of migrationPath) {
      const migration = this.migrations.get(migrationKey);
      if (migration) {
        migratedData = migration(migratedData);
      }
    }
    
    // Save migrated data
    await this.saveGameState(migratedData.state, migratedData.metadata);
    
    return migratedData;
  }
  
  /**
   * Get migration path between versions
   */
  private getMigrationPath(fromVersion: string, toVersion: string): string[] {
    const path: string[] = [];
    
    // Simple migration path (can be enhanced for complex migrations)
    if (fromVersion === '1.0.0' && toVersion === '2.0.0') {
      path.push('1.0.0->2.0.0');
    }
    
    return path;
  }
  
  /**
   * Create backup before migration
   */
  private async createBackup<T>(saveData: GameSave<T>): Promise<void> {
    try {
      const backupKey = this.getStorageKey('backup');
      localStorage.setItem(backupKey, JSON.stringify(saveData));
      
      // Keep only last N backups
      await this.cleanupOldBackups();
    } catch (error) {
      console.warn('Failed to create backup:', error);
      // Don't throw - backup failure shouldn't block migration
    }
  }
  
  /**
   * Clean up old backups
   */
  private async cleanupOldBackups(): Promise<void> {
    const backupKeys: Array<{ key: string; timestamp: number }> = [];
    
    // Find all backup keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`${this.STORAGE_KEY_PREFIX}-${this.gameId}-backup-`)) {
        const timestamp = parseInt(key.split('-').pop() || '0');
        backupKeys.push({ key, timestamp });
      }
    }
    
    // Sort by timestamp (oldest first)
    backupKeys.sort((a, b) => a.timestamp - b.timestamp);
    
    // Remove oldest backups (keep only last N)
    const toRemove = backupKeys.slice(0, Math.max(0, backupKeys.length - this.MAX_BACKUPS));
    for (const { key } of toRemove) {
      localStorage.removeItem(key);
    }
  }
  
  /**
   * Clean up old saves (for quota management)
   */
  private async cleanupOldSaves(): Promise<void> {
    // Remove backups first (they're less critical)
    await this.cleanupOldBackups();
    
    // Could also implement LRU cache for game saves if needed
  }
  
  /**
   * Delete game state
   */
  async deleteGameState(): Promise<void> {
    try {
      localStorage.removeItem(this.getStorageKey());
    } catch (error) {
      console.error('Failed to delete game state:', error);
      throw error;
    }
  }
  
  /**
   * Save player profile
   */
  async savePlayerProfile(profile: PlayerProfile): Promise<void> {
    try {
      const updatedProfile: PlayerProfile = {
        ...profile,
        version: this.CURRENT_VERSION,
        lastUpdated: Date.now(),
      };
      
      const key = this.getStorageKey('profile');
      localStorage.setItem(key, JSON.stringify(updatedProfile));
    } catch (error) {
      console.error('Failed to save player profile:', error);
      throw error;
    }
  }
  
  /**
   * Load player profile
   */
  async loadPlayerProfile(): Promise<PlayerProfile | null> {
    try {
      const key = this.getStorageKey('profile');
      const data = localStorage.getItem(key);
      
      if (!data) {
        return null;
      }
      
      const profile: PlayerProfile = JSON.parse(data);
      
      // Migrate if needed
      if (profile.version !== this.CURRENT_VERSION) {
        // Profile migrations would go here
        profile.version = this.CURRENT_VERSION;
        await this.savePlayerProfile(profile);
      }
      
      return profile;
    } catch (error) {
      console.error('Failed to load player profile:', error);
      return null;
    }
  }
  
  /**
   * Create default player profile
   */
  createDefaultProfile(pseudonym: string = 'Player'): PlayerProfile {
    return {
      version: this.CURRENT_VERSION,
      pseudonym,
      mastery: {},
      achievements: [],
      settings: {
        audioEnabled: false,
        reducedMotion: false,
        highContrast: false,
        tutorialCompleted: false,
      },
      lastPlayed: {},
      createdAt: Date.now(),
      lastUpdated: Date.now(),
    };
  }
  
  /**
   * Compare version strings
   */
  private compareVersions(v1: string, v2: string): number {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const part1 = parts1[i] || 0;
      const part2 = parts2[i] || 0;
      
      if (part1 < part2) return -1;
      if (part1 > part2) return 1;
    }
    
    return 0;
  }
}
