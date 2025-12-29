"use client";

/**
 * Proof of Concept: Data Validation & Legal Compliance
 * 
 * This component demonstrates:
 * - File upload with validation
 * - License detection and verification
 * - Copyright checking
 * - PII detection
 * - Quality scoring
 * - User attestation
 */

import React, { useState, useCallback } from "react";
import { Upload, CheckCircle, XCircle, AlertTriangle, FileText, Shield } from "lucide-react";

interface ValidationResult {
  status: "pending" | "validating" | "valid" | "invalid" | "needs-review";
  checks: {
    license: {
      status: "pass" | "fail" | "warning";
      detected: string | null;
      verified: boolean;
      message: string;
    };
    copyright: {
      status: "pass" | "fail" | "warning";
      watermarks: boolean;
      knownContent: boolean;
      message: string;
    };
    quality: {
      status: "pass" | "fail" | "warning";
      score: number;
      issues: string[];
      message: string;
    };
    pii: {
      status: "pass" | "fail" | "warning";
      detected: boolean;
      types: string[];
      message: string;
    };
  };
  warnings: string[];
  errors: string[];
}

export default function DataValidationPOC() {
  const [file, setFile] = useState<File | null>(null);
  const [attestation, setAttestation] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setValidationResult(null);
    }
  }, []);

  // Simulate license detection
  const detectLicense = useCallback(async (file: File): Promise<string | null> => {
    // In real implementation, this would:
    // 1. Check for LICENSE file in archive
    // 2. Parse file headers/comments
    // 3. Query license database
    // 4. Check metadata
    
    // Simulate detection
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const fileName = file.name.toLowerCase();
    if (fileName.includes("mit") || fileName.includes("apache")) {
      return "MIT";
    }
    if (fileName.includes("user") || fileName.includes("own")) {
      return "user-owned";
    }
    
    return null;
  }, []);

  // Simulate copyright checking
  const checkCopyright = useCallback(async (file: File) => {
    // In real implementation, this would:
    // 1. Check for watermarks
    // 2. Compare against known copyrighted content database
    // 3. Analyze content patterns
    // 4. Check metadata
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    return {
      watermarks: false,
      knownContent: false,
    };
  }, []);

  // Simulate PII detection
  const detectPII = useCallback(async (file: File) => {
    // In real implementation, this would:
    // 1. Scan for email patterns
    // 2. Detect phone numbers
    // 3. Find credit card numbers
    // 4. Identify SSN/other identifiers
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Simulate: 10% chance of PII detection
    const hasPII = Math.random() < 0.1;
    
    return {
      detected: hasPII,
      types: hasPII ? ["email", "phone"] : [],
    };
  }, []);

  // Simulate quality scoring
  const scoreQuality = useCallback(async (file: File) => {
    // In real implementation, this would:
    // 1. Parse and validate structure
    // 2. Check for missing values
    // 3. Detect duplicates
    // 4. Analyze distributions
    // 5. Check data types
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const score = 0.7 + Math.random() * 0.25; // 0.7-0.95
    
    const issues: string[] = [];
    if (score < 0.8) {
      issues.push("Some missing values detected");
    }
    if (score < 0.85) {
      issues.push("Potential duplicates found");
    }
    
    return { score, issues };
  }, []);

  const validateFile = useCallback(async () => {
    if (!file || !attestation) return;

    setIsValidating(true);
    setValidationResult({
      status: "validating",
      checks: {
        license: { status: "pending", detected: null, verified: false, message: "" },
        copyright: { status: "pending", watermarks: false, knownContent: false, message: "" },
        quality: { status: "pending", score: 0, issues: [], message: "" },
        pii: { status: "pending", detected: false, types: [], message: "" },
      },
      warnings: [],
      errors: [],
    });

    try {
      // Run all checks in parallel
      const [detectedLicense, copyrightCheck, piiCheck, qualityCheck] = await Promise.all([
        detectLicense(file),
        checkCopyright(file),
        detectPII(file),
        scoreQuality(file),
      ]);

      const warnings: string[] = [];
      const errors: string[] = [];

      // License check
      let licenseStatus: "pass" | "fail" | "warning" = "pass";
      let licenseMessage = "License verified";
      
      if (!detectedLicense) {
        if (attestation) {
          licenseStatus = "warning";
          licenseMessage = "No license detected, relying on user attestation";
          warnings.push("License not automatically detected");
        } else {
          licenseStatus = "fail";
          licenseMessage = "License required";
          errors.push("License must be specified or attested");
        }
      } else if (detectedLicense === "user-owned") {
        licenseMessage = "User-owned data (attested)";
      } else {
        licenseMessage = `Detected license: ${detectedLicense}`;
      }

      // Copyright check
      let copyrightStatus: "pass" | "fail" | "warning" = "pass";
      let copyrightMessage = "No copyright issues detected";
      
      if (copyrightCheck.watermarks || copyrightCheck.knownContent) {
        copyrightStatus = "fail";
        copyrightMessage = "Potential copyright issues detected";
        errors.push("Copyrighted content detected");
      }

      // PII check
      let piiStatus: "pass" | "fail" | "warning" = "pass";
      let piiMessage = "No PII detected";
      
      if (piiCheck.detected) {
        piiStatus = "warning";
        piiMessage = `PII detected: ${piiCheck.types.join(", ")}`;
        warnings.push(`Personal data detected: ${piiCheck.types.join(", ")}`);
      }

      // Quality check
      let qualityStatus: "pass" | "fail" | "warning" = "pass";
      let qualityMessage = `Quality score: ${(qualityCheck.score * 100).toFixed(1)}%`;
      
      if (qualityCheck.score < 0.7) {
        qualityStatus = "fail";
        qualityMessage = `Low quality score: ${(qualityCheck.score * 100).toFixed(1)}%`;
        errors.push("Data quality below threshold");
      } else if (qualityCheck.score < 0.85) {
        qualityStatus = "warning";
        warnings.push("Data quality could be improved");
      }

      const overallStatus =
        errors.length > 0 ? "invalid" : warnings.length > 0 ? "needs-review" : "valid";

      setValidationResult({
        status: overallStatus,
        checks: {
          license: {
            status: licenseStatus,
            detected: detectedLicense,
            verified: !!detectedLicense || attestation,
            message: licenseMessage,
          },
          copyright: {
            status: copyrightStatus,
            watermarks: copyrightCheck.watermarks,
            knownContent: copyrightCheck.knownContent,
            message: copyrightMessage,
          },
          quality: {
            status: qualityStatus,
            score: qualityCheck.score,
            issues: qualityCheck.issues,
            message: qualityMessage,
          },
          pii: {
            status: piiStatus,
            detected: piiCheck.detected,
            types: piiCheck.types,
            message: piiMessage,
          },
        },
        warnings,
        errors,
      });
    } catch (error) {
      console.error("Validation error:", error);
      setValidationResult({
        status: "invalid",
        checks: {
          license: { status: "fail", detected: null, verified: false, message: "Validation error" },
          copyright: { status: "fail", watermarks: false, knownContent: false, message: "Validation error" },
          quality: { status: "fail", score: 0, issues: [], message: "Validation error" },
          pii: { status: "fail", detected: false, types: [], message: "Validation error" },
        },
        warnings: [],
        errors: ["Validation failed. Please try again."],
      });
    } finally {
      setIsValidating(false);
    }
  }, [file, attestation, detectLicense, checkCopyright, detectPII, scoreQuality]);

  const getStatusIcon = (status: "pass" | "fail" | "warning" | "pending") => {
    switch (status) {
      case "pass":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "fail":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default:
        return <div className="w-5 h-5 border-2 border-slate-300 border-t-primary-500 rounded-full animate-spin" />;
    }
  };

  const getStatusColor = (status: "pass" | "fail" | "warning" | "pending") => {
    switch (status) {
      case "pass":
        return "bg-green-50 border-green-200";
      case "fail":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-amber-50 border-amber-200";
      default:
        return "bg-slate-50 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-2xl shadow-lg border border-slate-200">
      <div className="flex items-center gap-3">
        <Shield className="w-6 h-6 text-primary-500" />
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Data Validation POC</h2>
          <p className="text-sm text-slate-600 mt-1">
            Legal compliance and quality checking for uploaded datasets
          </p>
        </div>
      </div>

      {/* File Upload */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Upload Dataset</label>
          <div className="flex items-center gap-4">
            <label className="flex-1 cursor-pointer">
              <input
                type="file"
                accept=".csv,.json,.jsonl"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex items-center gap-3 p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-primary-500 transition-colors">
                <Upload className="w-5 h-5 text-slate-400" />
                <div className="flex-1">
                  {file ? (
                    <div>
                      <p className="font-medium text-slate-900">{file.name}</p>
                      <p className="text-sm text-slate-600">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-slate-700">Click to upload or drag and drop</p>
                      <p className="text-xs text-slate-500 mt-1">CSV, JSON, JSONL (max 10MB)</p>
                    </div>
                  )}
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* User Attestation */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <input
            type="checkbox"
            id="attestation"
            checked={attestation}
            onChange={(e) => setAttestation(e.target.checked)}
            className="mt-1 w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
          />
          <label htmlFor="attestation" className="flex-1 text-sm text-slate-700">
            <span className="font-semibold">I attest that:</span>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>I own or have legal rights to use this data</li>
              <li>This data does not contain copyrighted content without permission</li>
              <li>I understand the terms of service and will be responsible for any violations</li>
            </ul>
          </label>
        </div>

        {/* Validate Button */}
        <button
          onClick={validateFile}
          disabled={!file || !attestation || isValidating}
          className="w-full px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          {isValidating ? "Validating..." : "Validate Dataset"}
        </button>
      </div>

      {/* Validation Results */}
      {validationResult && (
        <div className="space-y-4">
          <div
            className={`p-4 rounded-lg border-2 ${
              validationResult.status === "valid"
                ? "bg-green-50 border-green-200"
                : validationResult.status === "invalid"
                ? "bg-red-50 border-red-200"
                : "bg-amber-50 border-amber-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {validationResult.status === "valid" ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : validationResult.status === "invalid" ? (
                <XCircle className="w-5 h-5 text-red-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              )}
              <h3 className="font-semibold text-slate-900">
                {validationResult.status === "valid"
                  ? "Validation Passed"
                  : validationResult.status === "invalid"
                  ? "Validation Failed"
                  : "Review Required"}
              </h3>
            </div>
            {validationResult.errors.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-red-800">Errors:</p>
                <ul className="mt-1 space-y-1 list-disc list-inside text-sm text-red-700">
                  {validationResult.errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            {validationResult.warnings.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-amber-800">Warnings:</p>
                <ul className="mt-1 space-y-1 list-disc list-inside text-sm text-amber-700">
                  {validationResult.warnings.map((warning, i) => (
                    <li key={i}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Individual Checks */}
          <div className="grid grid-cols-2 gap-4">
            {/* License Check */}
            <div className={`p-4 rounded-lg border ${getStatusColor(validationResult.checks.license.status)}`}>
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(validationResult.checks.license.status)}
                <h4 className="font-semibold text-slate-900">License</h4>
              </div>
              <p className="text-sm text-slate-700">{validationResult.checks.license.message}</p>
              {validationResult.checks.license.detected && (
                <p className="text-xs text-slate-600 mt-1">
                  Detected: {validationResult.checks.license.detected}
                </p>
              )}
            </div>

            {/* Copyright Check */}
            <div className={`p-4 rounded-lg border ${getStatusColor(validationResult.checks.copyright.status)}`}>
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(validationResult.checks.copyright.status)}
                <h4 className="font-semibold text-slate-900">Copyright</h4>
              </div>
              <p className="text-sm text-slate-700">{validationResult.checks.copyright.message}</p>
            </div>

            {/* Quality Check */}
            <div className={`p-4 rounded-lg border ${getStatusColor(validationResult.checks.quality.status)}`}>
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(validationResult.checks.quality.status)}
                <h4 className="font-semibold text-slate-900">Quality</h4>
              </div>
              <p className="text-sm text-slate-700">{validationResult.checks.quality.message}</p>
              {validationResult.checks.quality.issues.length > 0 && (
                <ul className="mt-2 space-y-1 list-disc list-inside text-xs text-slate-600">
                  {validationResult.checks.quality.issues.map((issue, i) => (
                    <li key={i}>{issue}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* PII Check */}
            <div className={`p-4 rounded-lg border ${getStatusColor(validationResult.checks.pii.status)}`}>
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(validationResult.checks.pii.status)}
                <h4 className="font-semibold text-slate-900">Personal Data</h4>
              </div>
              <p className="text-sm text-slate-700">{validationResult.checks.pii.message}</p>
              {validationResult.checks.pii.types.length > 0 && (
                <p className="text-xs text-slate-600 mt-1">
                  Types: {validationResult.checks.pii.types.join(", ")}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

