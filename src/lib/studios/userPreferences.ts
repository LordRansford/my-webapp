/**
 * Studio User Preferences
 * 
 * Manages user preferences for studio tools, including UI preferences,
 * default settings, and tool-specific configurations.
 */

import { readJsonFile, writeJsonFile } from "@/lib/storage/jsonFile";

const PREFERENCES_STORE_PATH = process.env.PREFERENCES_STORE_PATH || "data/user-preferences.json";

export interface StudioPreferences {
  userId: string;
  updatedAt: string;
  
  // UI Preferences
  ui: {
    theme: "light" | "dark" | "auto";
    compactMode: boolean;
    showHelpTooltips: boolean;
    showCreditEstimates: boolean;
    showExamples: boolean;
    animationEnabled: boolean;
    reducedMotion: boolean;
  };
  
  // Tool Defaults
  toolDefaults: {
    [toolId: string]: {
      // Tool-specific default values
      [key: string]: any;
    };
  };
  
  // Studio-Specific Preferences
  studios: {
    dev: {
      defaultProjectType?: string;
      defaultStack?: string[];
      autoSave: boolean;
      showAdvancedOptions: boolean;
    };
    cyber: {
      defaultFramework?: string;
      defaultSeverity?: "low" | "medium" | "high" | "critical";
      autoValidate: boolean;
      showComplianceChecks: boolean;
    };
    data: {
      defaultFormat?: "json" | "csv" | "yaml";
      defaultChartType?: string;
      autoInferSchema: boolean;
      showDataPreview: boolean;
    };
  };
  
  // Notification Preferences
  notifications: {
    creditLow: boolean;
    creditThreshold: number; // Percentage
    toolComplete: boolean;
    errors: boolean;
    updates: boolean;
  };
  
  // Accessibility
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    keyboardNavigation: boolean;
    screenReaderOptimized: boolean;
  };
  
  // Performance
  performance: {
    enableCaching: boolean;
    prefetchTools: boolean;
    lazyLoadImages: boolean;
  };
}

const DEFAULT_PREFERENCES: Omit<StudioPreferences, "userId" | "updatedAt"> = {
  ui: {
    theme: "auto",
    compactMode: false,
    showHelpTooltips: true,
    showCreditEstimates: true,
    showExamples: true,
    animationEnabled: true,
    reducedMotion: false,
  },
  toolDefaults: {},
  studios: {
    dev: {
      autoSave: true,
      showAdvancedOptions: false,
    },
    cyber: {
      autoValidate: true,
      showComplianceChecks: true,
    },
    data: {
      autoInferSchema: true,
      showDataPreview: true,
    },
  },
  notifications: {
    creditLow: true,
    creditThreshold: 20,
    toolComplete: true,
    errors: true,
    updates: true,
  },
  accessibility: {
    highContrast: false,
    largeText: false,
    keyboardNavigation: true,
    screenReaderOptimized: false,
  },
  performance: {
    enableCaching: true,
    prefetchTools: false,
    lazyLoadImages: true,
  },
};

type PreferencesStore = {
  preferences: StudioPreferences[];
};

function load(): PreferencesStore {
  const empty: PreferencesStore = { preferences: [] };
  return readJsonFile<PreferencesStore>(PREFERENCES_STORE_PATH, empty);
}

function save(store: PreferencesStore) {
  writeJsonFile(PREFERENCES_STORE_PATH, store);
}

export function getUserPreferences(userId: string): StudioPreferences {
  const store = load();
  const existing = store.preferences.find((p) => p.userId === userId);
  
  if (existing) {
    return existing;
  }
  
  // Create default preferences
  const defaultPrefs: StudioPreferences = {
    userId,
    updatedAt: new Date().toISOString(),
    ...DEFAULT_PREFERENCES,
  };
  
  store.preferences.push(defaultPrefs);
  save(store);
  
  return defaultPrefs;
}

export function updateUserPreferences(
  userId: string,
  updates: Partial<Omit<StudioPreferences, "userId" | "updatedAt">>
): StudioPreferences {
  const store = load();
  const existingIdx = store.preferences.findIndex((p) => p.userId === userId);
  
  const updated: StudioPreferences = {
    ...(existingIdx >= 0 ? store.preferences[existingIdx] : getUserPreferences(userId)),
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  if (existingIdx >= 0) {
    store.preferences[existingIdx] = updated;
  } else {
    store.preferences.push(updated);
  }
  
  save(store);
  return updated;
}

export function updateToolDefaults(
  userId: string,
  toolId: string,
  defaults: Record<string, any>
): StudioPreferences {
  const prefs = getUserPreferences(userId);
  const updated = {
    ...prefs,
    toolDefaults: {
      ...prefs.toolDefaults,
      [toolId]: {
        ...prefs.toolDefaults[toolId],
        ...defaults,
      },
    },
    updatedAt: new Date().toISOString(),
  };
  
  return updateUserPreferences(userId, updated);
}

export function getToolDefaults(userId: string, toolId: string): Record<string, any> {
  const prefs = getUserPreferences(userId);
  return prefs.toolDefaults[toolId] || {};
}
