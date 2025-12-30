/**
 * Source health monitoring component
 */

import React, { memo, useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";
import type { NewsSnapshot } from "@/lib/updates/types";

interface SourceHealthIndicatorProps {
  snapshot: NewsSnapshot;
  className?: string;
}

const SourceHealthIndicator = memo(function SourceHealthIndicator({
  snapshot,
  className = "",
}: SourceHealthIndicatorProps) {
  const [sourceHealth, setSourceHealth] = useState<Record<string, "healthy" | "degraded" | "unknown">>({});

  useEffect(() => {
    // Calculate health based on item counts and recency
    const health: Record<string, "healthy" | "degraded" | "unknown"> = {};
    
    Object.entries(snapshot.metadata.per_source_counts).forEach(([sourceId, count]) => {
      if (count === 0) {
        health[sourceId] = "degraded";
      } else {
        // Check if items from this source are recent
        const sourceItems = snapshot.items.filter((item) => item.source_id === sourceId);
        const recentItems = sourceItems.filter((item) => {
          const daysSincePublished = (Date.now() - new Date(item.published_at).getTime()) / (1000 * 60 * 60 * 24);
          return daysSincePublished < 30;
        });
        
        if (recentItems.length === 0 && sourceItems.length > 0) {
          health[sourceId] = "degraded";
        } else {
          health[sourceId] = "healthy";
        }
      }
    });

    setSourceHealth(health);
  }, [snapshot]);

  const healthyCount = Object.values(sourceHealth).filter((h) => h === "healthy").length;
  const totalSources = Object.keys(sourceHealth).length;

  if (totalSources === 0) return null;

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-4 ${className}`}>
      <h3 className="text-sm font-semibold text-slate-900 mb-3">Source Health</h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Overall Status</span>
          <div className="flex items-center gap-2">
            {healthyCount === totalSources ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-600" aria-hidden="true" />
                <span className="text-green-700 font-medium">All Healthy</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-amber-600" aria-hidden="true" />
                <span className="text-amber-700 font-medium">
                  {healthyCount}/{totalSources} Healthy
                </span>
              </>
            )}
          </div>
        </div>
        <div className="text-xs text-slate-500">
          Last updated: {new Date(snapshot.metadata.generated_at).toLocaleString()}
        </div>
      </div>
    </div>
  );
});

export default SourceHealthIndicator;
