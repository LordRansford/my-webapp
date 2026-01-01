"use client";

import React, { useState, useMemo } from "react";
import { CheckCircle2, AlertCircle, XCircle, Loader2 } from "lucide-react";

interface ValidationRule {
  id: string;
  name: string;
  description: string;
  validate: (content: string, metadata?: any) => Promise<ValidationResult>;
  severity: "error" | "warning" | "info";
}

interface ValidationResult {
  passed: boolean;
  message?: string;
  details?: string;
}

interface OutputValidatorProps {
  content: string;
  type: "code" | "config" | "documentation" | "tests";
  language?: string;
  rules?: ValidationRule[];
  onValidate?: (results: ValidationResult[]) => void;
  className?: string;
}

const defaultRules: ValidationRule[] = [
  {
    id: "syntax-check",
    name: "Syntax Check",
    description: "Validates basic syntax",
    severity: "error",
    validate: async (content) => {
      // Basic syntax validation (would use language-specific parsers in production)
      try {
        if (content.trim().length === 0) {
          return { passed: false, message: "Content is empty" };
        }
        // Check for common syntax errors
        const openBraces = (content.match(/\{/g) || []).length;
        const closeBraces = (content.match(/\}/g) || []).length;
        if (openBraces !== closeBraces) {
          return { passed: false, message: "Mismatched braces" };
        }
        return { passed: true, message: "Syntax is valid" };
      } catch (error) {
        return { passed: false, message: "Syntax validation failed" };
      }
    }
  },
  {
    id: "security-check",
    name: "Security Check",
    description: "Checks for common security issues",
    severity: "error",
    validate: async (content) => {
      const securityPatterns = [
        { pattern: /eval\s*\(/, message: "Use of eval() detected" },
        { pattern: /innerHTML\s*=/, message: "Direct innerHTML assignment detected" },
        { pattern: /password\s*=\s*["'][^"']+["']/, message: "Hardcoded password detected" },
        { pattern: /api[_-]?key\s*=\s*["'][^"']+["']/i, message: "Hardcoded API key detected" }
      ];

      for (const { pattern, message } of securityPatterns) {
        if (pattern.test(content)) {
          return { passed: false, message };
        }
      }

      return { passed: true, message: "No obvious security issues found" };
    }
  },
  {
    id: "best-practices",
    name: "Best Practices",
    description: "Checks for coding best practices",
    severity: "warning",
    validate: async (content) => {
      const warnings: string[] = [];
      
      if (!content.includes("TODO") && content.length > 100) {
        // Check for comments
        const hasComments = /\/\/|\/\*|#/.test(content);
        if (!hasComments) {
          warnings.push("Consider adding comments for complex logic");
        }
      }

      if (warnings.length > 0) {
        return { passed: true, message: "Best practices check passed", details: warnings.join("; ") };
      }

      return { passed: true, message: "Follows best practices" };
    }
  }
];

export function OutputValidator({
  content,
  type,
  language,
  rules = defaultRules,
  onValidate,
  className = ""
}: OutputValidatorProps) {
  const [validating, setValidating] = useState(false);
  const [results, setResults] = useState<Record<string, ValidationResult>>({});

  const runValidation = async () => {
    setValidating(true);
    const validationResults: Record<string, ValidationResult> = {};

    for (const rule of rules) {
      try {
        const result = await rule.validate(content, { type, language });
        validationResults[rule.id] = result;
      } catch (error) {
        validationResults[rule.id] = {
          passed: false,
          message: `Validation error: ${error instanceof Error ? error.message : "Unknown error"}`
        };
      }
    }

    setResults(validationResults);
    setValidating(false);

    if (onValidate) {
      onValidate(Object.values(validationResults));
    }
  };

  const allPassed = useMemo(() => {
    return Object.values(results).every(r => r.passed);
  }, [results]);

  const errorCount = useMemo(() => {
    return Object.values(results).filter(r => !r.passed && 
      rules.find(rule => rule.id === Object.keys(results).find(k => results[k] === r))?.severity === "error"
    ).length;
  }, [results, rules]);

  const warningCount = useMemo(() => {
    return Object.values(results).filter(r => !r.passed && 
      rules.find(rule => rule.id === Object.keys(results).find(k => results[k] === r))?.severity === "warning"
    ).length;
  }, [results, rules]);

  React.useEffect(() => {
    if (content) {
      runValidation();
    }
  }, [content, type, language]);

  const getResultIcon = (result: ValidationResult, severity: string) => {
    if (!result.passed) {
      return severity === "error" ? (
        <XCircle className="w-5 h-5 text-rose-600" />
      ) : (
        <AlertCircle className="w-5 h-5 text-amber-600" />
      );
    }
    return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
  };

  const getResultColor = (result: ValidationResult, severity: string) => {
    if (!result.passed) {
      return severity === "error" 
        ? "border-rose-200 bg-rose-50"
        : "border-amber-200 bg-amber-50";
    }
    return "border-emerald-200 bg-emerald-50";
  };

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-sky-600" />
          <h3 className="text-lg font-semibold text-slate-900">Output Validation</h3>
        </div>
        {validating ? (
          <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
        ) : (
          <div className="flex items-center gap-2 text-sm">
            {errorCount > 0 && (
              <span className="text-rose-600 font-medium">{errorCount} errors</span>
            )}
            {warningCount > 0 && (
              <span className="text-amber-600 font-medium">{warningCount} warnings</span>
            )}
            {allPassed && (
              <span className="text-emerald-600 font-medium">All checks passed</span>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {rules.map((rule) => {
          const result = results[rule.id];
          if (!result) return null;

          return (
            <div
              key={rule.id}
              className={`rounded-lg border-2 p-4 ${getResultColor(result, rule.severity)}`}
            >
              <div className="flex items-start gap-3">
                {getResultIcon(result, rule.severity)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-slate-900">{rule.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      rule.severity === "error" 
                        ? "bg-rose-100 text-rose-700"
                        : rule.severity === "warning"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-700"
                    }`}>
                      {rule.severity}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-1">{rule.description}</p>
                  {result.message && (
                    <p className={`text-sm font-medium ${
                      result.passed ? "text-emerald-700" : rule.severity === "error" ? "text-rose-700" : "text-amber-700"
                    }`}>
                      {result.message}
                    </p>
                  )}
                  {result.details && (
                    <p className="text-xs text-slate-600 mt-1">{result.details}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {Object.keys(results).length === 0 && !validating && (
        <div className="text-center py-8 text-slate-500 text-sm">
          Run validation to check your output
        </div>
      )}
    </div>
  );
}
