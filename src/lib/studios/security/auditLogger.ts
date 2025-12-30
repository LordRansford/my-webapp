/**
 * Audit Logger for Studios
 * 
 * Logs important actions for governance, compliance, and security monitoring.
 * All logs are stored client-side only (localStorage) for privacy.
 */

"use client";

interface AuditLogEntry {
  timestamp: number;
  action: string;
  studio: string;
  tool?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

class AuditLogger {
  private storageKey = "studio-audit-logs";
  private maxLogs = 1000; // Keep last 1000 entries

  /**
   * Log an action
   */
  log(action: string, studio: string, metadata?: Record<string, unknown>): void {
    if (typeof window === "undefined") {
      return; // Server-side rendering
    }

    try {
      const entry: AuditLogEntry = {
        timestamp: Date.now(),
        action,
        studio,
        metadata: metadata || {}
      };

      const logs = this.getLogs();
      logs.push(entry);

      // Keep only the most recent logs
      if (logs.length > this.maxLogs) {
        logs.splice(0, logs.length - this.maxLogs);
      }

      localStorage.setItem(this.storageKey, JSON.stringify(logs));
    } catch (error) {
      // Silently fail if localStorage is not available
      console.warn("Failed to log audit entry:", error);
    }
  }

  /**
   * Get all logs
   */
  getLogs(): AuditLogEntry[] {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) {
        return [];
      }
      return JSON.parse(stored) as AuditLogEntry[];
    } catch (error) {
      console.warn("Failed to read audit logs:", error);
      return [];
    }
  }

  /**
   * Get logs for a specific studio
   */
  getLogsForStudio(studio: string): AuditLogEntry[] {
    return this.getLogs().filter(log => log.studio === studio);
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.storageKey);
    }
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.getLogs(), null, 2);
  }
}

export const auditLogger = new AuditLogger();

// Common audit actions
export const AuditActions = {
  TOOL_OPENED: "tool_opened",
  FILE_UPLOADED: "file_uploaded",
  PROJECT_CREATED: "project_created",
  PROJECT_DELETED: "project_deleted",
  DEPLOYMENT_INITIATED: "deployment_initiated",
  CREDITS_CONSUMED: "credits_consumed",
  SETTINGS_CHANGED: "settings_changed",
  ERROR_OCCURRED: "error_occurred",
  ERROR_BOUNDARY_TRIGGERED: "error_boundary_triggered",
  ERROR_BOUNDARY_RESET: "error_boundary_reset",
  PERFORMANCE_ISSUE: "performance_issue",
  RETRY_ATTEMPTED: "retry_attempted"
} as const;

