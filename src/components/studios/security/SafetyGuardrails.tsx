"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Shield, AlertTriangle, XCircle, CheckCircle2, Info } from "lucide-react";

interface Guardrail {
  id: string;
  name: string;
  description: string;
  check: (context: Record<string, any>) => { passed: boolean; message?: string; severity: "error" | "warning" | "info" };
  enabled: boolean;
}

interface SafetyGuardrailsProps {
  context: Record<string, any>;
  guardrails?: Guardrail[];
  onViolation?: (guardrail: Guardrail, message: string) => void;
  showDetails?: boolean;
  className?: string;
}

const defaultGuardrails: Guardrail[] = [
  {
    id: "file-size",
    name: "File Size Limit",
    description: "Prevents processing of excessively large files",
    enabled: true,
    check: (context) => {
      const size = context.fileSize || 0;
      const maxSize = context.maxFileSize || 10 * 1024 * 1024; // 10MB default
      if (size > maxSize) {
        return {
          passed: false,
          message: `File size (${(size / 1024 / 1024).toFixed(1)}MB) exceeds limit (${(maxSize / 1024 / 1024).toFixed(1)}MB)`,
          severity: "error"
        };
      }
      return { passed: true, severity: "info" };
    }
  },
  {
    id: "resource-usage",
    name: "Resource Usage",
    description: "Monitors CPU and memory usage",
    enabled: true,
    check: (context) => {
      const cpu = context.cpuUsage || 0;
      const memory = context.memoryUsage || 0;
      if (cpu > 90 || memory > 90) {
        return {
          passed: false,
          message: `High resource usage detected (CPU: ${cpu}%, Memory: ${memory}%)`,
          severity: "warning"
        };
      }
      return { passed: true, severity: "info" };
    }
  },
  {
    id: "sensitive-data",
    name: "Sensitive Data Detection",
    description: "Warns about potentially sensitive data",
    enabled: true,
    check: (context) => {
      const content = String(context.content || "").toLowerCase();
      const sensitivePatterns = [
        /password\s*[:=]\s*["'][^"']+["']/i,
        /api[_-]?key\s*[:=]\s*["'][^"']+["']/i,
        /\b\d{3}-\d{2}-\d{4}\b/, // SSN pattern
        /\b\d{16}\b/ // Credit card pattern
      ];

      for (const pattern of sensitivePatterns) {
        if (pattern.test(content)) {
          return {
            passed: false,
            message: "Potentially sensitive data detected in content",
            severity: "warning"
          };
        }
      }
      return { passed: true, severity: "info" };
    }
  },
  {
    id: "rate-limit",
    name: "Rate Limiting",
    description: "Prevents excessive API calls",
    enabled: true,
    check: (context) => {
      const requests = context.requestCount || 0;
      const timeWindow = context.timeWindow || 60000; // 1 minute
      const maxRequests = context.maxRequests || 100;
      
      if (requests > maxRequests) {
        return {
          passed: false,
          message: `Rate limit exceeded: ${requests} requests in ${timeWindow / 1000}s`,
          severity: "error"
        };
      }
      return { passed: true, severity: "info" };
    }
  },
  {
    id: "output-size",
    name: "Output Size Limit",
    description: "Prevents generation of excessively large outputs",
    enabled: true,
    check: (context) => {
      const outputSize = context.outputSize || 0;
      const maxOutputSize = context.maxOutputSize || 50 * 1024 * 1024; // 50MB default
      
      if (outputSize > maxOutputSize) {
        return {
          passed: false,
          message: `Output size (${(outputSize / 1024 / 1024).toFixed(1)}MB) exceeds limit`,
          severity: "error"
        };
      }
      return { passed: true, severity: "info" };
    }
  }
];

export function SafetyGuardrails({
  context,
  guardrails = defaultGuardrails,
  onViolation,
  showDetails = true,
  className = ""
}: SafetyGuardrailsProps) {
  const [results, setResults] = useState<Record<string, { passed: boolean; message?: string; severity: string }>>({});

  const enabledGuardrails = useMemo(() => {
    return guardrails.filter(g => g.enabled);
  }, [guardrails]);

  const runChecks = useCallback(() => {
    const newResults: Record<string, { passed: boolean; message?: string; severity: string }> = {};

    enabledGuardrails.forEach(guardrail => {
      const result = guardrail.check(context);
      newResults[guardrail.id] = result;

      if (!result.passed && onViolation) {
        onViolation(guardrail, result.message || "Guardrail violation");
      }
    });

    setResults(newResults);
  }, [context, enabledGuardrails, onViolation]);

  React.useEffect(() => {
    runChecks();
  }, [runChecks]);

  const allPassed = useMemo(() => {
    return Object.values(results).every(r => r.passed);
  }, [results]);

  const errorCount = useMemo(() => {
    return Object.values(results).filter(r => !r.passed && r.severity === "error").length;
  }, [results]);

  const warningCount = useMemo(() => {
    return Object.values(results).filter(r => !r.passed && r.severity === "warning").length;
  }, [results]);

  if (!showDetails && allPassed) {
    return null;
  }

  const getIcon = (result: { passed: boolean; severity: string }) => {
    if (result.passed) {
      return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
    }
    if (result.severity === "error") {
      return <XCircle className="w-4 h-4 text-rose-600" />;
    }
    return <AlertTriangle className="w-4 h-4 text-amber-600" />;
  };

  const getColor = (result: { passed: boolean; severity: string }) => {
    if (result.passed) {
      return "border-emerald-200 bg-emerald-50";
    }
    if (result.severity === "error") {
      return "border-rose-200 bg-rose-50";
    }
    return "border-amber-200 bg-amber-50";
  };

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-sky-600" />
          <h3 className="text-lg font-semibold text-slate-900">Safety Guardrails</h3>
        </div>
        {!allPassed && (
          <div className="flex items-center gap-2 text-sm">
            {errorCount > 0 && (
              <span className="text-rose-600 font-medium">{errorCount} errors</span>
            )}
            {warningCount > 0 && (
              <span className="text-amber-600 font-medium">{warningCount} warnings</span>
            )}
          </div>
        )}
      </div>

      {showDetails && (
        <div className="space-y-2">
          {enabledGuardrails.map((guardrail) => {
            const result = results[guardrail.id];
            if (!result) return null;

            return (
              <div
                key={guardrail.id}
                className={`rounded-lg border-2 p-3 ${getColor(result)}`}
              >
                <div className="flex items-start gap-2">
                  {getIcon(result)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-slate-900">{guardrail.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        result.severity === "error"
                          ? "bg-rose-100 text-rose-700"
                          : result.severity === "warning"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-slate-100 text-slate-700"
                      }`}>
                        {result.severity}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-1">{guardrail.description}</p>
                    {result.message && (
                      <p className={`text-sm font-medium ${
                        result.passed ? "text-emerald-700" : result.severity === "error" ? "text-rose-700" : "text-amber-700"
                      }`}>
                        {result.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {allPassed && !showDetails && (
        <div className="flex items-center gap-2 text-emerald-700">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-medium">All safety checks passed</span>
        </div>
      )}
    </div>
  );
}
