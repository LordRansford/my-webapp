"use client";

import React, { useState, useMemo } from "react";
import { Filter, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

interface FilterRule {
  id: string;
  name: string;
  pattern: RegExp;
  action: "block" | "warn" | "flag";
  message: string;
}

interface ContentFilterProps {
  content: string;
  rules?: FilterRule[];
  onFilter?: (filtered: string, violations: string[]) => void;
  showDetails?: boolean;
  className?: string;
}

const defaultRules: FilterRule[] = [
  {
    id: "profanity",
    name: "Profanity Filter",
    pattern: /\b(bad|word|list)\b/i, // Simplified - would use comprehensive list
    action: "warn",
    message: "Potentially inappropriate content detected"
  },
  {
    id: "pii",
    name: "PII Detection",
    pattern: /\b\d{3}-\d{2}-\d{4}\b/, // SSN pattern
    action: "block",
    message: "Personally Identifiable Information (PII) detected"
  },
  {
    id: "secrets",
    name: "Secret Detection",
    pattern: /(api[_-]?key|password|secret|token)\s*[:=]\s*["'][^"']+["']/i,
    action: "block",
    message: "Potential secrets or credentials detected"
  },
  {
    id: "malicious",
    name: "Malicious Content",
    pattern: /<script|javascript:|eval\(|on\w+\s*=/i,
    action: "block",
    message: "Potentially malicious content detected"
  }
];

export function ContentFilter({
  content,
  rules = defaultRules,
  onFilter,
  showDetails = true,
  className = ""
}: ContentFilterProps) {
  const [violations, setViolations] = useState<string[]>([]);
  const [filtered, setFiltered] = useState<string>("");

  const filterContent = useMemo(() => {
    const foundViolations: string[] = [];
    let filteredContent = content;

    for (const rule of rules) {
      if (rule.pattern.test(content)) {
        foundViolations.push(rule.message);

        if (rule.action === "block") {
          // Remove or mask the content
          filteredContent = filteredContent.replace(rule.pattern, "[FILTERED]");
        }
      }
    }

    setViolations(foundViolations);
    setFiltered(filteredContent);

    if (onFilter) {
      onFilter(filteredContent, foundViolations);
    }

    return { filtered: filteredContent, violations: foundViolations };
  }, [content, rules, onFilter]);

  const hasBlocked = useMemo(() => {
    return violations.some(v => {
      const rule = rules.find(r => r.message === v);
      return rule?.action === "block";
    });
  }, [violations, rules]);

  const hasWarnings = useMemo(() => {
    return violations.some(v => {
      const rule = rules.find(r => r.message === v);
      return rule?.action === "warn";
    });
  }, [violations, rules]);

  if (!showDetails && violations.length === 0) {
    return null;
  }

  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-sky-600" />
          <span className="text-sm font-medium text-slate-900">Content Filter</span>
        </div>
        {violations.length === 0 ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        ) : hasBlocked ? (
          <XCircle className="w-4 h-4 text-rose-600" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-amber-600" />
        )}
      </div>

      {showDetails && violations.length > 0 && (
        <div className="space-y-2">
          {violations.map((violation, index) => {
            const rule = rules.find(r => r.message === violation);
            const isBlocked = rule?.action === "block";

            return (
              <div
                key={index}
                className={`text-xs p-2 rounded ${
                  isBlocked
                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  {isBlocked ? (
                    <XCircle className="w-3 h-3" />
                  ) : (
                    <AlertTriangle className="w-3 h-3" />
                  )}
                  <span className="font-medium">{violation}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {violations.length === 0 && showDetails && (
        <p className="text-xs text-emerald-700">Content passed all filters</p>
      )}
    </div>
  );
}
