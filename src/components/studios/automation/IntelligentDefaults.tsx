"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Sparkles, CheckCircle2, X, AlertCircle, Lightbulb } from "lucide-react";

interface Suggestion {
  id: string;
  type: "field" | "action" | "optimization" | "warning";
  field?: string;
  value?: any;
  confidence: number; // 0-1
  reason: string;
  action?: () => void;
}

interface IntelligentDefaultsProps {
  context: Record<string, any>;
  fields: Array<{
    id: string;
    label: string;
    type: string;
    currentValue?: any;
  }>;
  onApply?: (fieldId: string, value: any) => void;
  onApplyAll?: (suggestions: Suggestion[]) => void;
  generateSuggestions?: (context: Record<string, any>, fields: any[]) => Suggestion[];
  className?: string;
}

const defaultSuggestionGenerator = (context: Record<string, any>, fields: any[]): Suggestion[] => {
  const suggestions: Suggestion[] = [];

  // Example: Auto-detect file type from filename
  if (context.filename) {
    const ext = context.filename.split('.').pop()?.toLowerCase();
    if (ext) {
      const fileTypeField = fields.find(f => f.id === "fileType" || f.id === "format");
      if (fileTypeField && !fileTypeField.currentValue) {
        suggestions.push({
          id: `filetype-${ext}`,
          type: "field",
          field: fileTypeField.id,
          value: ext,
          confidence: 0.9,
          reason: `Detected file extension: .${ext}`
        });
      }
    }
  }

  // Example: Suggest batch size based on data size
  if (context.rowCount) {
    const batchSizeField = fields.find(f => f.id === "batchSize");
    if (batchSizeField && !batchSizeField.currentValue) {
      const suggested = Math.min(100, Math.max(10, Math.floor(context.rowCount / 10)));
      suggestions.push({
        id: "batch-size",
        type: "optimization",
        field: batchSizeField.id,
        value: suggested,
        confidence: 0.7,
        reason: `Based on ${context.rowCount} rows, suggested batch size: ${suggested}`
      });
    }
  }

  // Example: Suggest model based on task type
  if (context.taskType) {
    const modelField = fields.find(f => f.id === "model" || f.id === "algorithm");
    if (modelField && !modelField.currentValue) {
      const modelMap: Record<string, string> = {
        "classification": "logistic",
        "regression": "linear",
        "clustering": "kmeans"
      };
      const suggested = modelMap[context.taskType];
      if (suggested) {
        suggestions.push({
          id: "model-suggestion",
          type: "field",
          field: modelField.id,
          value: suggested,
          confidence: 0.8,
          reason: `Recommended model for ${context.taskType} task`
        });
      }
    }
  }

  return suggestions;
};

export function IntelligentDefaults({
  context,
  fields,
  onApply,
  onApplyAll,
  generateSuggestions = defaultSuggestionGenerator,
  className = ""
}: IntelligentDefaultsProps) {
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set());

  const suggestions = useMemo(() => {
    return generateSuggestions(context, fields)
      .filter(s => !appliedSuggestions.has(s.id) && !dismissedSuggestions.has(s.id))
      .sort((a, b) => b.confidence - a.confidence);
  }, [context, fields, generateSuggestions, appliedSuggestions, dismissedSuggestions]);

  const handleApply = useCallback((suggestion: Suggestion) => {
    if (suggestion.field && suggestion.value !== undefined) {
      if (onApply) {
        onApply(suggestion.field, suggestion.value);
      }
      setAppliedSuggestions(prev => new Set([...prev, suggestion.id]));
    }
    if (suggestion.action) {
      suggestion.action();
    }
  }, [onApply]);

  const handleDismiss = useCallback((suggestionId: string) => {
    setDismissedSuggestions(prev => new Set([...prev, suggestionId]));
  }, []);

  const handleApplyAll = useCallback(() => {
    suggestions.forEach(suggestion => {
      if (suggestion.field && suggestion.value !== undefined) {
        if (onApply) {
          onApply(suggestion.field, suggestion.value);
        }
      }
      if (suggestion.action) {
        suggestion.action();
      }
    });
    setAppliedSuggestions(prev => new Set([...prev, ...suggestions.map(s => s.id)]));
    if (onApplyAll) {
      onApplyAll(suggestions);
    }
  }, [suggestions, onApply, onApplyAll]);

  if (suggestions.length === 0) {
    return null;
  }

  const getSuggestionIcon = (type: Suggestion["type"]) => {
    switch (type) {
      case "field":
        return <CheckCircle2 className="w-4 h-4 text-sky-600" />;
      case "action":
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      case "optimization":
        return <Lightbulb className="w-4 h-4 text-amber-600" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-rose-600" />;
      default:
        return <Lightbulb className="w-4 h-4 text-slate-600" />;
    }
  };

  const getSuggestionColor = (type: Suggestion["type"]) => {
    switch (type) {
      case "field":
        return "bg-sky-50 border-sky-200";
      case "action":
        return "bg-purple-50 border-purple-200";
      case "optimization":
        return "bg-amber-50 border-amber-200";
      case "warning":
        return "bg-rose-50 border-rose-200";
      default:
        return "bg-slate-50 border-slate-200";
    }
  };

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-sky-600" />
          <h3 className="text-lg font-semibold text-slate-900">Smart Suggestions</h3>
        </div>
        {suggestions.length > 1 && (
          <button
            onClick={handleApplyAll}
            className="text-sm text-sky-600 hover:text-sky-700 font-medium"
          >
            Apply All
          </button>
        )}
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion) => {
          const confidencePercent = Math.round(suggestion.confidence * 100);
          const field = fields.find(f => f.id === suggestion.field);

          return (
            <div
              key={suggestion.id}
              className={`rounded-xl border-2 p-4 ${getSuggestionColor(suggestion.type)}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex-shrink-0 mt-0.5">
                    {getSuggestionIcon(suggestion.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-slate-900">
                        {suggestion.type === "field" && field
                          ? `Set ${field.label}`
                          : suggestion.type === "optimization"
                          ? "Optimization"
                          : suggestion.type === "warning"
                          ? "Warning"
                          : "Action"}
                      </span>
                      <span className="text-xs text-slate-500 bg-white px-2 py-0.5 rounded">
                        {confidencePercent}% confident
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 mb-2">{suggestion.reason}</p>
                    {suggestion.field && suggestion.value !== undefined && (
                      <div className="text-xs text-slate-600 bg-white/60 px-2 py-1 rounded">
                        <span className="font-medium">{field?.label || suggestion.field}:</span>{" "}
                        <span className="font-mono">{String(suggestion.value)}</span>
                      </div>
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
