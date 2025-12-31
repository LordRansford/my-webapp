/**
 * Credit Settings Store
 * 
 * Manages user credit alert thresholds and notification preferences.
 * Uses JSON file storage similar to other settings stores.
 */

import { readJsonFile, writeJsonFile } from "@/lib/storage/jsonFile";

const CREDIT_SETTINGS_STORE_PATH = process.env.CREDIT_SETTINGS_STORE_PATH || "data/credit-settings.json";

export interface CreditAlertThresholds {
  daily: number[]; // Array of percentages [50, 80, 100]
  monthly: number[]; // Array of percentages [50, 80, 100]
}

export interface CreditNotificationPreferences {
  email: boolean;
  inApp: boolean;
}

export interface CreditSettings {
  userId: string;
  alertThresholds: CreditAlertThresholds;
  notifications: CreditNotificationPreferences;
  updatedAt: string;
}

interface CreditSettingsStore {
  settings: CreditSettings[];
}

const DEFAULT_ALERT_THRESHOLDS: CreditAlertThresholds = {
  daily: [50, 80, 100],
  monthly: [50, 80, 100],
};

const DEFAULT_NOTIFICATIONS: CreditNotificationPreferences = {
  email: true,
  inApp: true,
};

function load(): CreditSettingsStore {
  const empty: CreditSettingsStore = { settings: [] };
  return readJsonFile<CreditSettingsStore>(CREDIT_SETTINGS_STORE_PATH, empty);
}

function save(store: CreditSettingsStore): void {
  writeJsonFile(CREDIT_SETTINGS_STORE_PATH, store);
}

/**
 * Get user's credit settings
 */
export function getCreditSettings(userId: string): CreditSettings {
  const store = load();
  const existing = store.settings.find((s) => s.userId === userId);

  if (existing) {
    return existing;
  }

  // Create default settings
  const defaultSettings: CreditSettings = {
    userId,
    alertThresholds: DEFAULT_ALERT_THRESHOLDS,
    notifications: DEFAULT_NOTIFICATIONS,
    updatedAt: new Date().toISOString(),
  };

  store.settings.push(defaultSettings);
  save(store);

  return defaultSettings;
}

/**
 * Update user's credit settings
 */
export function updateCreditSettings(
  userId: string,
  updates: Partial<Omit<CreditSettings, "userId" | "updatedAt">>
): CreditSettings {
  const store = load();
  const existingIdx = store.settings.findIndex((s) => s.userId === userId);

  const updated: CreditSettings = {
    ...(existingIdx >= 0 ? store.settings[existingIdx] : getCreditSettings(userId)),
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  if (existingIdx >= 0) {
    store.settings[existingIdx] = updated;
  } else {
    store.settings.push(updated);
  }

  save(store);
  return updated;
}

/**
 * Update alert thresholds
 */
export function updateAlertThresholds(
  userId: string,
  thresholds: Partial<CreditAlertThresholds>
): CreditSettings {
  const current = getCreditSettings(userId);
  return updateCreditSettings(userId, {
    alertThresholds: {
      ...current.alertThresholds,
      ...thresholds,
    },
  });
}

/**
 * Update notification preferences
 */
export function updateNotificationPreferences(
  userId: string,
  preferences: Partial<CreditNotificationPreferences>
): CreditSettings {
  const current = getCreditSettings(userId);
  return updateCreditSettings(userId, {
    notifications: {
      ...current.notifications,
      ...preferences,
    },
  });
}
