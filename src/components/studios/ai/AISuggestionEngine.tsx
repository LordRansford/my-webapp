"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Sparkles, Lightbulb, TrendingUp, Zap, CheckCircle2, X } from "lucide-react";

interface Suggestion {
  id: string;
  type: "optimization" | "workflow" | "configuration" | "best-practice" | "warning";
  title: string;
  description: string;
  confidence: number; // 0-1
  impact: "low" | "medium" | "high";
  action?: () => void;
  reasoning?: string;
}

interface AISuggestionEngineProps {
  context: Record<string, any>;
  history?: Array<{ action: string; result: any; timestamp: number }>;
  onSuggestionApply?: (suggestion: Suggestion) => void;
  onSuggestionDismiss?: (suggestionId: string) => void;
  generateSuggestions?: (context: Record<string, any>, history?: any[]) => Suggestion[];
  maxSuggestions?: number;
  className?: string;
}

const defaultSuggestionGenerator = (
  context: Record<string, any>,
  history?: Array<{ action: string; result: any; timestamp: number }>
): Suggestion[] => {
  const suggestions: Suggestion[] = [];

  // Analyze context for optimization opportunities
  if (context.fileSize && context.fileSize > 5 * 1024 * 1024) {
    suggestions.push({
      id: "optimize-file-size",
      type: "optimization",
      title: "Large File Detected",
      description: "Consider chunking or streaming for better performance",
      confidence: 0.8,
      impact: "high",
      reasoning: `File size (${(context.fileSize / 1024 / 1024).toFixed(1)}MB) may cause performance issues`
    });
  }

  // Analyze workflow patterns from history
  if (history && history.length > 0) {
    const commonPattern = findCommonPattern(history);
    if (commonPattern) {
      suggestions.push({
        id: "workflow-pattern",
        type: "workflow",
        title: "Workflow Pattern Detected",
        description: `You frequently ${commonPattern}. Consider automating this.`,
        confidence: 0.7,
        impact: "medium",
        reasoning: "Based on your usage history"
      });
    }
  }

  // Configuration suggestions
  if (context.taskType && !context.model) {
    suggestions.push({
      id: "model-suggestion",
      type: "configuration",
      title: "Model Recommendation",
      description: `For ${context.taskType} tasks, we recommend using a specialized model`,
      confidence: 0.9,
      impact: "high",
      reasoning: "Based on task type analysis"
    });
  }

  // Best practice suggestions
  if (context.rowCount && context.rowCount > 10000 && !context.batchSize) {
    suggestions.push({
      id: "batch-processing",
      type: "best-practice",
      title: "Enable Batch Processing",
      description: "For large datasets, batch processing improves performance",
      confidence: 0.85,
      impact: "high",
      reasoning: `Dataset has ${context.rowCount} rows`
    });
  }

  return suggestions.sort((a, b) => {
    // Sort by impact and confidence
    const impactWeight = { high: 3, medium: 2, low: 1 };
    const aScore = impactWeight[a.impact] * a.confidence;
    const bScore = impactWeight[b.impact] * b.confidence;
    return bScore - aScore;
  });
};

function findCommonPattern(history: Array<{ action: string; result: any; timestamp: number }>): string | null {
  // Simple pattern detection - would use ML in production
  const actionCounts: Record<string, number> = {};
  history.forEach(entry => {
    actionCounts[entry.action] = (actionCounts[entry.action] || 0) + 1;
  });

  const sorted = Object.entries(actionCounts).sort((a, b) => b[1] - a[1]);
  if (sorted.length > 0 && sorted[0][1] > history.length * 0.3) {
    return sorted[0][0];
  }
  return null;
}

export function AISuggestionEngine({
  context,
  history,
  onSuggestionApply,
  onSuggestionDismiss,
  generateSuggestions = defaultSuggestionGenerator,
  maxSuggestions = 5,
  className = ""
}: AISuggestionEngineProps) {
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set());

  const suggestions = useMemo(() => {
    return generateSuggestions(context, history)
      .filter(s => !appliedSuggestions.has(s.id) && !dismissedSuggestions.has(s.id))
      .slice(0, maxSuggestions);
  }, [context, history, generateSuggestions, appliedSuggestions, dismissedSuggestions, maxSuggestions]);

  const handleApply = useCallback((suggestion: Suggestion) => {
    setAppliedSuggestions(prev => new Set([...prev, suggestion.id]));
    if (suggestion.action) {
      suggestion.action();
    }
    if (onSuggestionApply) {
      onSuggestionApply(suggestion);
    }
  }, [onSuggestionApply]);

  const handleDismiss = useCallback((suggestionId: string) => {
    setDismissedSuggestions(prev => new Set([...prev, suggestionId]));
    if (onSuggestionDismiss) {
      onSuggestionDismiss(suggestionId);
    }
  }, [onSuggestionDismiss]);

  if (suggestions.length === 0) {
    return null;
  }

  const getSuggestionIcon = (type: Suggestion["type"]) => {
    switch (type) {
      case "optimization":
        return <TrendingUp className="w-4 h-4 text-amber-600" />;
      case "workflow":
        return <Zap className="w-4 h-4 text-purple-600" />;
      case "configuration":
        return <Lightbulb className="w-4 h-4 text-sky-600" />;
      case "best-practice":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case "warning":
        return <Sparkles className="w-4 h-4 text-rose-600" />;
      default:
        return <Lightbulb className="w-4 h-4 text-slate-600" />;
    }
  };

  const getSuggestionColor = (type: Suggestion["type"], impact: Suggestion["impact"]) => {
    if (impact === "high") {
      return type === "warning" 
        ? "bg-rose-50 border-rose-200"
        : "bg-sky-50 border-sky-200";
    }
    if (impact === "medium") {
      return "bg-amber-50 border-amber-200";
    }
    return "bg-slate-50 border-slate-200";
  };

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-sky-600" />
          <h3 className="text-lg font-semibold text-slate-900">AI Suggestions</h3>
          <span className="text-sm text-slate-500">({suggestions.length})</span>
        </div>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion) => {
          const confidencePercent = Math.round(suggestion.confidence * 100);

          return (
            <div
              key={suggestion.id}
              className={`rounded-xl border-2 p-4 ${getSuggestionColor(suggestion.type, suggestion.impact)}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex-shrink-0 mt-0.5">
                    {getSuggestionIcon(suggestion.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-900">{suggestion.title}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-white/60">
                        {confidencePercent}% confident
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        suggestion.impact === "high"
                          ? "bg-sky-100 text-sky-700"
                          : suggestion.impact === "medium"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-slate-100 text-slate-700"
                      }`}>
                        {suggestion.impact} impact
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 mb-2">{suggestion.description}</p>
                    {suggestion.reasoning && (
                      <p className="text-xs text-slate-500 italic">💡 {suggestion.reasoning}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleApply(suggestion)}
                    className="px-3 py-1.5 text-sm bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => handleDismiss(suggestion.id)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Dismiss"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {suggestions.length === 0 && appliedSuggestions.size > 0 && (
        <div className="text-center py-4 text-slate-600 text-sm">
          All suggestions have been applied or dismissed.
        </div>
      )}
    </div>
  );
}
