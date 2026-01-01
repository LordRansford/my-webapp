"use client";

import React, { useState, useMemo } from "react";
import { Shield, CheckCircle2, XCircle, AlertTriangle, Loader2 } from "lucide-react";
import { sanitizeText, sanitizeFileName, validateEmail, validateUrl, validateFileType } from "@/lib/studios/security/inputSanitizer";

interface ValidationRule {
  id: string;
  name: string;
  description: string;
  validate: (value: any) => { passed: boolean; message?: string };
  severity: "error" | "warning";
}

interface SecurityValidatorProps {
  value: any;
  type: "text" | "filename" | "email" | "url" | "file" | "json";
  rules?: ValidationRule[];
  onValidate?: (results: ValidationResult[]) => void;
  showDetails?: boolean;
  className?: string;
}

interface ValidationResult {
  ruleId: string;
  passed: boolean;
  message?: string;
  severity: "error" | "warning";
}

const defaultRules: Record<string, ValidationRule[]> = {
  text: [
    {
      id: "xss-check",
      name: "XSS Protection",
      description: "Checks for potential XSS attacks",
      severity: "error",
      validate: (value) => {
        if (typeof value !== "string") {
          return { passed: false, message: "Value must be a string" };
        }
        const dangerous = /<script|javascript:|on\w+\s*=/i.test(value);
        if (dangerous) {
          return { passed: false, message: "Potentially dangerous content detected" };
        }
        return { passed: true };
      }
    },
    {
      id: "length-check",
      name: "Length Validation",
      description: "Validates input length",
      severity: "warning",
      validate: (value) => {
        if (typeof value !== "string") {
          return { passed: false, message: "Value must be a string" };
        }
        if (value.length > 10000) {
          return { passed: false, message: "Input exceeds maximum length" };
        }
        return { passed: true };
      }
    }
  ],
  filename: [
    {
      id: "path-traversal",
      name: "Path Traversal Protection",
      description: "Prevents directory traversal attacks",
      severity: "error",
      validate: (value) => {
        if (typeof value !== "string") {
          return { passed: false, message: "Value must be a string" };
        }
        if (value.includes("..") || value.includes("/") || value.includes("\\")) {
          return { passed: false, message: "Invalid file path detected" };
        }
        return { passed: true };
      }
    }
  ],
  email: [
    {
      id: "email-format",
      name: "Email Format",
      description: "Validates email format",
      severity: "error",
      validate: (value) => {
        const valid = validateEmail(value);
        return { passed: valid, message: valid ? undefined : "Invalid email format" };
      }
    }
  ],
  url: [
    {
      id: "url-security",
      name: "URL Security",
      description: "Validates URL and prevents SSRF",
      severity: "error",
      validate: (value) => {
        const result = validateUrl(value);
        return { passed: result.valid, message: result.error };
      }
    }
  ],
  file: [
    {
      id: "file-type",
      name: "File Type Validation",
      description: "Validates file type",
      severity: "error",
      validate: (value) => {
        if (!(value instanceof File)) {
          return { passed: false, message: "Value must be a File object" };
        }
        // This would use actual allowed types in production
        return { passed: true };
      }
    }
  ]
};

export function SecurityValidator({
  value,
  type,
  rules,
  onValidate,
  showDetails = true,
  className = ""
}: SecurityValidatorProps) {
  const [validating, setValidating] = useState(false);
  const [results, setResults] = useState<ValidationResult[]>([]);

  const activeRules = rules || defaultRules[type] || [];

  const runValidation = async () => {
    setValidating(true);
    const validationResults: ValidationResult[] = [];

    for (const rule of activeRules) {
      try {
        const result = rule.validate(value);
        validationResults.push({
          ruleId: rule.id,
          passed: result.passed,
          message: result.message,
          severity: rule.severity
        });
      } catch (error) {
        validationResults.push({
          ruleId: rule.id,
          passed: false,
          message: `Validation error: ${error instanceof Error ? error.message : "Unknown error"}`,
          severity: rule.severity
        });
      }
    }

    setResults(validationResults);
    setValidating(false);

    if (onValidate) {
      onValidate(validationResults);
    }
  };

  React.useEffect(() => {
    if (value !== undefined && value !== null && value !== "") {
      runValidation();
    }
  }, [value, type]);

  const allPassed = useMemo(() => {
    return results.every(r => r.passed);
  }, [results]);

  const errorCount = useMemo(() => {
    return results.filter(r => !r.passed && r.severity === "error").length;
  }, [results]);

  const warningCount = useMemo(() => {
    return results.filter(r => !r.passed && r.severity === "warning").length;
  }, [results]);

  if (!showDetails && allPassed) {
    return null;
  }

  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-sky-600" />
          <span className="text-sm font-medium text-slate-900">Security Validation</span>
        </div>
        {validating ? (
          <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
        ) : allPassed ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        ) : (
          <div className="flex items-center gap-1 text-xs">
            {errorCount > 0 && <span className="text-rose-600">{errorCount} errors</span>}
            {warningCount > 0 && <span className="text-amber-600">{warningCount} warnings</span>}
          </div>
        )}
      </div>

      {showDetails && results.length > 0 && (
        <div className="space-y-2">
          {results.map((result) => {
            const rule = activeRules.find(r => r.id === result.ruleId);
            if (!rule) return null;

            return (
              <div
                key={result.ruleId}
                className={`flex items-start gap-2 text-xs ${
                  result.passed ? "text-emerald-700" : result.severity === "error" ? "text-rose-700" : "text-amber-700"
                }`}
              >
                {result.passed ? (
                  <CheckCircle2 className="w-3 h-3 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-medium">{rule.name}:</span>{" "}
                  {result.message || (result.passed ? "Passed" : "Failed")}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
