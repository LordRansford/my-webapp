/**
 * Compute Credit Usage Tracking
 * 
 * Tracks credit usage and provides usage analytics
 */

export interface CreditUsage {
  id: string;
  userId: string;
  studioType: string;
  toolId: string;
  operation: string;
  creditsUsed: number;
  executedAt: Date;
  metadata?: Record<string, unknown>;
}

export interface UsageSummary {
  totalCreditsUsed: number;
  totalOperations: number;
  creditsByStudio: Record<string, number>;
  creditsByOperation: Record<string, number>;
  averageCreditsPerOperation: number;
  period: {
    start: Date;
    end: Date;
  };
}

export class CreditUsageTracker {
  private storageKey = "studio-credit-usage";

  recordUsage(usage: Omit<CreditUsage, "id" | "executedAt">): void {
    if (typeof window === "undefined") return;
    
    const fullUsage: CreditUsage = {
      ...usage,
      id: crypto.randomUUID(),
      executedAt: new Date()
    };

    // In production, this would be sent to an API
    // For now, store in localStorage
    const existing = this.getUsageHistory();
    existing.push(fullUsage);
    
    // Keep only last 1000 records
    const trimmed = existing.slice(-1000);
    localStorage.setItem(this.storageKey, JSON.stringify(trimmed));
  }

  getUsageHistory(): CreditUsage[] {
    if (typeof window === "undefined") return [];
    
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      return parsed.map((u: any) => ({
        ...u,
        executedAt: new Date(u.executedAt)
      }));
    } catch {
      return [];
    }
  }

  getUsageSummary(periodDays: number = 30): UsageSummary {
    const history = this.getUsageHistory();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - periodDays);

    const filtered = history.filter(u => u.executedAt >= cutoff);
    
    const totalCreditsUsed = filtered.reduce((sum, u) => sum + u.creditsUsed, 0);
    const totalOperations = filtered.length;
    
    const creditsByStudio: Record<string, number> = {};
    const creditsByOperation: Record<string, number> = {};

    filtered.forEach(u => {
      creditsByStudio[u.studioType] = (creditsByStudio[u.studioType] || 0) + u.creditsUsed;
      creditsByOperation[u.operation] = (creditsByOperation[u.operation] || 0) + u.creditsUsed;
    });

    return {
      totalCreditsUsed,
      totalOperations,
      creditsByStudio,
      creditsByOperation,
      averageCreditsPerOperation: totalOperations > 0 ? totalCreditsUsed / totalOperations : 0,
      period: {
        start: cutoff,
        end: new Date()
      }
    };
  }

  getRemainingCredits(userId: string): number {
    // In production, this would fetch from API
    // For now, return a placeholder
    const summary = this.getUsageSummary(30);
    const purchased = 10000; // Placeholder - would come from API
    return Math.max(0, purchased - summary.totalCreditsUsed);
  }
}

export const creditUsageTracker = new CreditUsageTracker();

