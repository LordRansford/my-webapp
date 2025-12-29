#!/usr/bin/env node

/**
 * Enforces credit system patterns across the codebase
 * Checks that all API routes requiring credits use enforceCreditGate
 * and all client components use CreditConsent
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");

const API_ROUTE_PATTERN = /src\/app\/api\/.*\/route\.(ts|js|tsx|jsx)$/;
const CLIENT_COMPONENT_PATTERN = /src\/components\/.*\.(tsx|jsx)$/;

const CREDIT_REQUIRED_OPERATIONS = [
  "certificate",
  "pdf",
  "dns",
  "whois",
  "ip-reputation",
  "tls-inspect",
  "template",
  "download",
  "export",
  "mentor",
  "query",
  "architecture-diagram",
];

let errors = [];
let warnings = [];

function checkFile(filePath, content) {
  const relativePath = path.relative(rootDir, filePath);
  const isApiRoute = API_ROUTE_PATTERN.test(relativePath);
  const isClientComponent = CLIENT_COMPONENT_PATTERN.test(relativePath);

  // Check if this file likely requires credits
  const requiresCredits = CREDIT_REQUIRED_OPERATIONS.some((op) =>
    relativePath.toLowerCase().includes(op)
  );

  if (isApiRoute && requiresCredits) {
    // Skip admin routes - they don't require credits
    if (relativePath.includes("/admin/")) {
      return;
    }
    
    // Skip read-only status/check routes
    if (relativePath.includes("/status") || relativePath.includes("/check")) {
      return;
    }
    
    // Skip payment/Stripe routes
    if (relativePath.includes("/request") && (content.includes("stripe") || content.includes("checkout"))) {
      return;
    }
    
    // Skip telemetry routes
    if (relativePath.includes("/telemetry/") || relativePath.includes("/event")) {
      return;
    }
    
    // Skip simple download routes that just serve files (not generating)
    if (relativePath.includes("/download") && !content.includes("generate") && !content.includes("create") && !content.includes("pdf-lib") && !content.includes("html2canvas")) {
      return;
    }
    
    // Skip export routes that just format existing data (not generating new content)
    if (relativePath.includes("/export") && (content.includes("csv") || content.includes("markdown")) && !content.includes("generate") && !content.includes("create")) {
      return;
    }
    
    // Skip revoke routes (admin operations)
    if (relativePath.includes("/revoke")) {
      return;
    }
    
    // Skip workspace export (just formats existing data)
    if (relativePath.includes("/workspace") && relativePath.includes("/export")) {
      return;
    }
    
    // Skip routes that use assertToolRunAllowed (billing check, different from credits)
    if (content.includes("assertToolRunAllowed")) {
      return;
    }
    
    // Check for enforceCreditGate or runWithMetering (which handles credits internally)
    if (!content.includes("enforceCreditGate") && !content.includes("runWithMetering")) {
      errors.push(
        `❌ ${relativePath}: Missing enforceCreditGate for credit-requiring operation`
      );
    }

    // Check for creditGateErrorResponse
    if (content.includes("enforceCreditGate") && !content.includes("creditGateErrorResponse")) {
      warnings.push(
        `⚠️  ${relativePath}: Uses enforceCreditGate but may not handle errors correctly`
      );
    }

    // Check for deductCredits
    if (content.includes("enforceCreditGate") && !content.includes("deductCredits")) {
      warnings.push(
        `⚠️  ${relativePath}: Uses enforceCreditGate but may not deduct credits after operation`
      );
    }
  }

  if (isClientComponent && requiresCredits) {
    // Check for CreditConsent
    if (!content.includes("CreditConsent") && !content.includes("useCreditConsent")) {
      warnings.push(
        `⚠️  ${relativePath}: May need CreditConsent component for credit-requiring operation`
      );
    }

    // Check for ESTIMATE disclaimer
    if (content.includes("CreditConsent") && !content.includes("ESTIMATE")) {
      warnings.push(
        `⚠️  ${relativePath}: Uses CreditConsent but may be missing ESTIMATE disclaimer`
      );
    }
  }

  // Check for estimate disclaimers in UI components only (not utility files)
  if (
    isClientComponent &&
    relativePath.includes("Credit") &&
    !relativePath.includes("/lib/") &&
    !relativePath.includes("/utils/") &&
    (content.includes("estimated") || content.includes("estimate")) &&
    !content.includes("ESTIMATE") &&
    !content.includes("may be higher or lower")
  ) {
    warnings.push(
      `⚠️  ${relativePath}: Shows estimates but may be missing required disclaimers`
    );
  }
}

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules, .next, etc.
      if (
        !file.startsWith(".") &&
        file !== "node_modules" &&
        file !== ".next" &&
        file !== "dist"
      ) {
        walkDir(filePath, callback);
      }
    } else if (stat.isFile()) {
      if (
        file.endsWith(".ts") ||
        file.endsWith(".tsx") ||
        file.endsWith(".js") ||
        file.endsWith(".jsx")
      ) {
        callback(filePath);
      }
    }
  }
}

console.log("🔍 Checking credit enforcement patterns...\n");

walkDir(path.join(rootDir, "src"), (filePath) => {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    checkFile(filePath, content);
  } catch (err) {
    // Ignore read errors
  }
});

// Report results
if (errors.length > 0) {
  console.log("❌ ERRORS (must be fixed):\n");
  errors.forEach((err) => console.log(err));
  console.log();
}

if (warnings.length > 0) {
  console.log("⚠️  WARNINGS (should be reviewed):\n");
  warnings.forEach((warn) => console.log(warn));
  console.log();
}

if (errors.length === 0 && warnings.length === 0) {
  console.log("✅ All credit enforcement patterns look good!\n");
  process.exit(0);
} else if (errors.length > 0) {
  console.log(`\n❌ Found ${errors.length} error(s) and ${warnings.length} warning(s)\n`);
  console.log("Please fix errors before committing.\n");
  process.exit(1);
} else {
  console.log(`\n⚠️  Found ${warnings.length} warning(s) - please review\n`);
  process.exit(0);
}

