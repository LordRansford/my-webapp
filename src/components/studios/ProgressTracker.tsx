"use client";

import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { CheckCircle2, Circle, TrendingUp, BookOpen, Rocket } from "lucide-react";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import { studioErrorHandler } from "@/lib/studios/security/errorHandler";

interface ProgressItem {
  id: string;
  label: string;
  completed: boolean;
  link?: string;
  studioId?: string;
}

interface ProgressTrackerProps {
  studioId?: string;
  items: ProgressItem[];
  showSummary?: boolean;
  className?: string;
}

function ProgressTracker({ 
  studioId, 
  items, 
  showSummary = true,
  className = "" 
}: ProgressTrackerProps) {
  const [progress, setProgress] = useState<ProgressItem[]>(items);

  useEffect(() => {
    if (typeof window === "undefined") {
      setProgress(items);
      return;
    }
    
    // Load progress from localStorage
    const storageKey = studioId 
      ? `studio-${studioId}-progress` 
      : "studios-hub-progress";
    
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const savedProgress = JSON.parse(saved);
        // Merge saved progress with current items
        const merged = items.map(item => {
          const savedItem = savedProgress.find((p: ProgressItem) => p.id === item.id);
          return savedItem ? { ...item, ...savedItem } : item;
        });
        setProgress(merged);
      } catch (e) {
        // Handle error securely
        studioErrorHandler.handleError(e, "ProgressTracker", studioId || "unknown");
        setProgress(items);
      }
    } else {
      setProgress(items);
    }
  }, [studioId, items]);

  // Memoize computed values
  const completed = useMemo(() => progress.filter(p => p.completed).length, [progress]);
  const total = useMemo(() => progress.length, [progress]);
  const percentage = useMemo(() => total > 0 ? Math.round((completed / total) * 100) : 0, [completed, total]);

  const toggleItem = useCallback((id: string) => {
    if (typeof window === "undefined") return;
    
    setProgress(prev => {
      const updated = prev.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      );
      
      // Save to localStorage
      const storageKey = studioId 
        ? `studio-${studioId}-progress` 
        : "studios-hub-progress";
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (e) {
        studioErrorHandler.handleError(e, "ProgressTracker", studioId || "unknown");
      }
      
      return updated;
    });
  }, [studioId]);

  return (
    <SecureErrorBoundary studio={studioId || "studios"}>
      <div className={`space-y-4 ${className}`}>
        {showSummary && (
          <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-slate-900">Progress</span>
              </div>
              <span className="text-lg font-bold text-slate-900">{percentage}%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-xs text-slate-600 mt-2">
              {completed} of {total} items completed
            </p>
          </div>
        )}

        <div className="space-y-2">
          {progress.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                item.completed
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                aria-label={item.completed ? `Mark ${item.label} as incomplete` : `Mark ${item.label} as complete`}
              >
                {item.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-400" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                {item.link ? (
                  <a
                    href={item.link}
                    className="text-sm font-medium text-slate-900 hover:text-blue-600 transition-colors"
                  >
                    {item.label}
                  </a>
                ) : (
                  <span className="text-sm font-medium text-slate-900">{item.label}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SecureErrorBoundary>
  );
}

const MemoizedProgressTracker = memo(ProgressTracker);
export default MemoizedProgressTracker;

