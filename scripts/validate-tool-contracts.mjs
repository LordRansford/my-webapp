#!/usr/bin/env node

/**
 * Validates that all tools have complete contracts in data/tool-contracts.json
 * 
 * CI gate: fails build if:
 * - Any tool in src/pages/tools.js lacks a contract
 * - Any contract lacks required fields
 * - Any tool page exists without a contract entry
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");

// Required fields for each tool contract
const REQUIRED_FIELDS = [
  "id",
  "route",
  "title",
  "purpose",
  "execution",
  "inputs",
  "limits",
  "credits",
  "runner",
  "failureModes",
  "statusStates"
];

// Required limit fields
const REQUIRED_LIMIT_FIELDS = ["cpuMs", "memoryMb", "outputKb"];

// Required credit fields
const REQUIRED_CREDIT_FIELDS = ["costPerRun"];

// Valid execution types
const VALID_EXECUTION_TYPES = ["browser-only", "sandboxed-server", "static-analysis"];

function extractToolsFromToolsPage() {
  const toolsPagePath = path.join(rootDir, "src", "pages", "tools.js");
  const content = fs.readFileSync(toolsPagePath, "utf8");
  
  // Extract tool IDs from the tools array
  const toolMatches = content.matchAll(/id:\s*"([^"]+)"/g);
  const toolIds = Array.from(toolMatches, (m) => m[1]);
  
  return toolIds;
}

function loadContracts() {
  const contractsPath = path.join(rootDir, "data", "tool-contracts.json");
  const content = fs.readFileSync(contractsPath, "utf8");
  const data = JSON.parse(content);
  return data.tools || [];
}

function validateContract(contract, index) {
  const errors = [];
  const prefix = `Tool #${index + 1} (id: ${contract.id || "unknown"}):`;
  
  // Check required fields
  for (const field of REQUIRED_FIELDS) {
    if (!(field in contract)) {
      errors.push(`${prefix} Missing required field: ${field}`);
    }
  }
  
  // Validate execution type
  if (contract.execution && !VALID_EXECUTION_TYPES.includes(contract.execution)) {
    errors.push(`${prefix} Invalid execution type: ${contract.execution}. Must be one of: ${VALID_EXECUTION_TYPES.join(", ")}`);
  }
  
  // Validate limits
  if (contract.limits) {
    for (const field of REQUIRED_LIMIT_FIELDS) {
      if (typeof contract.limits[field] !== "number") {
        errors.push(`${prefix} Missing or invalid limits.${field} (must be number)`);
      }
    }
  } else {
    errors.push(`${prefix} Missing limits object`);
  }
  
  // Validate credits
  if (contract.credits) {
    for (const field of REQUIRED_CREDIT_FIELDS) {
      if (typeof contract.credits[field] !== "number") {
        errors.push(`${prefix} Missing or invalid credits.${field} (must be number)`);
      }
    }
  } else {
    errors.push(`${prefix} Missing credits object`);
  }
  
  // Validate inputs is array
  if (contract.inputs && !Array.isArray(contract.inputs)) {
    errors.push(`${prefix} inputs must be an array`);
  }
  
  // Validate failureModes is array
  if (contract.failureModes && !Array.isArray(contract.failureModes)) {
    errors.push(`${prefix} failureModes must be an array`);
  }
  
  // Validate statusStates is array
  if (contract.statusStates && !Array.isArray(contract.statusStates)) {
    errors.push(`${prefix} statusStates must be an array`);
  }
  
  // Validate runner
  if (contract.runner && contract.execution === "sandboxed-server") {
    if (!contract.runner.startsWith("/api/")) {
      errors.push(`${prefix} sandboxed-server tools must have runner starting with /api/`);
    }
  }
  
  return errors;
}

function main() {
  console.log("Validating tool contracts...\n");
  
  const toolIds = extractToolsFromToolsPage();
  const contracts = loadContracts();
  
  const contractMap = new Map(contracts.map((c) => [c.id, c]));
  const errors = [];
  const warnings = [];
  
  // Check that every tool has a contract
  for (const toolId of toolIds) {
    if (!contractMap.has(toolId)) {
      errors.push(`Tool "${toolId}" in tools.js has no contract in tool-contracts.json`);
    }
  }
  
  // Validate each contract
  for (let i = 0; i < contracts.length; i++) {
    const contract = contracts[i];
    const contractErrors = validateContract(contract, i);
    errors.push(...contractErrors);
  }
  
  // Check for contracts that don't have corresponding tools
  for (const contract of contracts) {
    if (!toolIds.includes(contract.id)) {
      warnings.push(`Contract for "${contract.id}" exists but tool not found in tools.js`);
    }
  }
  
  // Print results
  if (warnings.length > 0) {
    console.log("⚠️  Warnings:");
    warnings.forEach((w) => console.log(`  - ${w}`));
    console.log();
  }
  
  if (errors.length > 0) {
    console.error("❌ Validation failed:\n");
    errors.forEach((e) => console.error(`  - ${e}`));
    console.error(`\nTotal errors: ${errors.length}`);
    process.exit(1);
  }
  
  console.log("✅ All tool contracts are valid!");
  console.log(`   - ${contracts.length} tool contracts validated`);
  console.log(`   - ${toolIds.length} tools from tools.js have contracts`);
  process.exit(0);
}

main();

