"use client";

import React, { useState, useMemo } from "react";
import { Brain, TrendingUp, Target, CheckCircle2 } from "lucide-react";

interface LearningPattern {
  id: string;
  pattern: string;
  frequency: number;
  successRate: number;
  lastUsed: number;
  recommendation?: string;
}

interface LearningSystemProps {
  userActions?: Array<{ action: string; success: boolean; timestamp: number }>;
  onRecommend?: (pattern: LearningPattern) => void;
  showInsights?: boolean;
  className?: string;
}

export function LearningSystem({
  userActions = [],
  onRecommend,
  showInsights = true,
  className = ""
}: LearningSystemProps) {
  const [patterns, setPatterns] = useState<LearningPattern[]>([]);

  const analyzePatterns = useMemo(() => {
    if (userActions.length === 0) return [];

    const patternMap: Record<string, { count: number; successes: number; lastUsed: number }> = {};

    userActions.forEach(action => {
      if (!patternMap[action.action]) {
        patternMap[action.action] = { count: 0, successes: 0, lastUsed: action.timestamp };
      }
      patternMap[action.action].count++;
      if (action.success) {
        patternMap[action.action].successes++;
      }
      if (action.timestamp > patternMap[action.action].lastUsed) {
        patternMap[action.action].lastUsed = action.timestamp;
      }
    });

    const learnedPatterns: LearningPattern[] = Object.entries(patternMap)
      .map(([pattern, data]) => {
        const successRate = data.successes / data.count;
        return {
          id: pattern,
          pattern,
          frequency: data.count,
          successRate,
          lastUsed: data.lastUsed,
          recommendation: successRate > 0.8 
            ? "This pattern works well for you"
            : successRate < 0.5
            ? "Consider trying a different approach"
            : undefined
        };
      })
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5);

    setPatterns(learnedPatterns);
    return learnedPatterns;
  }, [userActions]);

  const insights = useMemo(() => {
    if (patterns.length === 0) return [];

    const insights: string[] = [];
    const mostUsed = patterns[0];
    const mostSuccessful = patterns.reduce((best, current) => 
      current.successRate > best.successRate ? current : best
    );

    if (mostUsed) {
      insights.push(`You frequently use "${mostUsed.pattern}" (${mostUsed.frequency} times)`);
    }

    if (mostSuccessful && mostSuccessful.successRate > 0.8) {
      insights.push(`"${mostSuccessful.pattern}" has a ${Math.round(mostSuccessful.successRate * 100)}% success rate`);
    }

    const avgSuccessRate = patterns.reduce((sum, p) => sum + p.successRate, 0) / patterns.length;
    if (avgSuccessRate > 0.7) {
      insights.push("Your workflows are performing well overall");
    }

    return insights;
  }, [patterns]);

  if (!showInsights && patterns.length === 0) {
    return null;
  }

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-sky-600" />
        <h3 className="text-lg font-semibold text-slate-900">Learning System</h3>
      </div>

      {patterns.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-sm">
          <Brain className="w-12 h-12 mx-auto mb-4 text-slate-400" />
          <p>No patterns detected yet.</p>
          <p className="text-xs mt-1">The system will learn from your usage patterns.</p>
        </div>
      ) : (
        <>
          {/* Insights */}
          {insights.length > 0 && (
            <div className="mb-6 p-4 rounded-lg bg-sky-50 border border-sky-200">
              <div className="flex items-start gap-2">
                <Target className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-sky-900 mb-2">Insights</p>
                  <ul className="space-y-1">
                    {insights.map((insight, index) => (
                      <li key={index} className="text-sm text-sky-800 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Learned Patterns */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-900">Learned Patterns</h4>
            {patterns.map((pattern) => (
              <div
                key={pattern.id}
                className="rounded-lg border border-slate-200 p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-900">{pattern.pattern}</span>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <TrendingUp className="w-3 h-3" />
                    <span>{pattern.frequency}x</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100">
                      {Math.round(pattern.successRate * 100)}% success
                    </span>
                  </div>
                </div>
                {pattern.recommendation && (
                  <p className="text-xs text-slate-600 italic">{pattern.recommendation}</p>
                )}
                {onRecommend && (
                  <button
                    onClick={() => onRecommend(pattern)}
                    className="mt-2 text-xs text-sky-600 hover:text-sky-700 underline"
                  >
                    Use this pattern
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
