/**
 * Compliance and Governance Utilities for Studios
 * 
 * Provides utilities for data retention, privacy controls, and compliance checks.
 */

"use client";

interface ComplianceSettings {
  dataRetentionDays: number;
  allowDataExport: boolean;
  allowDataDeletion: boolean;
  requireConsent: boolean;
}

const DEFAULT_SETTINGS: ComplianceSettings = {
  dataRetentionDays: 90,
  allowDataExport: true,
  allowDataDeletion: true,
  requireConsent: true
};

class ComplianceManager {
  private storageKey = "studio-compliance-settings";

  /**
   * Get compliance settings
   */
  getSettings(): ComplianceSettings {
    if (typeof window === "undefined") {
      return DEFAULT_SETTINGS;
    }

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.warn("Failed to read compliance settings:", error);
    }

    return DEFAULT_SETTINGS;
  }

  /**
   * Update compliance settings
   */
  updateSettings(settings: Partial<ComplianceSettings>): void {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const current = this.getSettings();
      const updated = { ...current, ...settings };
      localStorage.setItem(this.storageKey, JSON.stringify(updated));
    } catch (error) {
      console.warn("Failed to update compliance settings:", error);
    }
  }

  /**
   * Check if data should be retained based on age
   */
  shouldRetainData(timestamp: number): boolean {
    const settings = this.getSettings();
    const ageInDays = (Date.now() - timestamp) / (1000 * 60 * 60 * 24);
    return ageInDays < settings.dataRetentionDays;
  }

  /**
   * Clean up old data based on retention policy
   */
  cleanupOldData(data: Array<{ timestamp: number }>): Array<{ timestamp: number }> {
    return data.filter(item => this.shouldRetainData(item.timestamp));
  }

  /**
   * Check GDPR compliance
   */
  checkGDPRCompliance(): {
    compliant: boolean;
    issues: string[];
  } {
    const issues: string[] = [];
    const settings = this.getSettings();

    if (!settings.requireConsent) {
      issues.push("User consent is not required");
    }

    if (!settings.allowDataDeletion) {
      issues.push("Data deletion is not allowed");
    }

    if (!settings.allowDataExport) {
      issues.push("Data export is not allowed");
    }

    if (settings.dataRetentionDays > 365) {
      issues.push("Data retention period exceeds recommended limit");
    }

    return {
      compliant: issues.length === 0,
      issues
    };
  }
}

export const complianceManager = new ComplianceManager();



