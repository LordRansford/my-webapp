#!/usr/bin/env node

/**
 * Mentor Safety Validation Script
 * 
 * Ensures that only public-facing content is indexed and no backend secrets
 * are exposed in the mentor system.
 */

import fs from "node:fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, "..");

// Files/directories to exclude from indexing
const EXCLUDED_PATHS = [
  /\.env/,
  /node_modules/,
  /\.next/,
  /prisma\/schema\.prisma/,
  /\.git/,
  /\.vercel/,
  /data\/mentor\/embeddings\.json/,
  /src\/server\/.*\.ts$/,
  /src\/lib\/.*\.ts$/, // Only check content/ directory
  /src\/app\/api\/.*/,
  /\.(log|lock|json)$/,
];

// Patterns that indicate secrets or internal information
const SECRET_PATTERNS = [
  /api[_-]?key/i,
  /secret/i,
  /password/i,
  /token/i,
  /private[_-]?key/i,
  /database[_-]?url/i,
  /connection[_-]?string/i,
  /oauth[_-]?client[_-]?secret/i,
  /stripe[_-]?secret/i,
  /jwt[_-]?secret/i,
  /session[_-]?secret/i,
];

// Directories that are safe to index (public content only)
const SAFE_CONTENT_DIRS = [
  "content/courses",
  "content/notes",
  "content/posts",
  "content/tools",
];

function checkContentIndex() {
  const indexPath = path.join(ROOT, "public", "content-index.json");
  if (!fs.existsSync(indexPath)) {
    console.log("⚠️  Content index not found. Run: npm run build:content-index");
    return false;
  }

  const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  let issues = 0;

  for (const page of index.pages || []) {
    // Check that routes don't expose internal paths
    if (page.route?.includes("/api/") || page.route?.includes("/admin/")) {
      console.error(`❌ Content index contains internal route: ${page.route}`);
      issues++;
    }

    // Check that source paths are in safe directories
    if (page.sourcePath) {
      const isSafe = SAFE_CONTENT_DIRS.some((dir) => page.sourcePath.startsWith(dir));
      if (!isSafe) {
        console.error(`❌ Content index contains unsafe source path: ${page.sourcePath}`);
        issues++;
      }
    }

    // Check sections for secret patterns
    for (const section of page.sections || []) {
      const text = `${section.title} ${section.excerpt}`.toLowerCase();
      for (const pattern of SECRET_PATTERNS) {
        if (pattern.test(text)) {
          // Only warn if it's not just educational content
          if (!text.includes("example") && !text.includes("placeholder")) {
            console.warn(`⚠️  Potential secret pattern in content: ${section.title} (${page.route})`);
          }
        }
      }
    }
  }

  if (issues === 0) {
    console.log("✅ Content index validation passed");
    return true;
  }

  console.error(`❌ Found ${issues} issues in content index`);
  return false;
}

function checkToolsIndex() {
  const toolsPath = path.join(ROOT, "public", "tools-index.json");
  if (!fs.existsSync(toolsPath)) {
    console.log("⚠️  Tools index not found. Run: npm run build:tools-index");
    return false;
  }

  const index = JSON.parse(fs.readFileSync(toolsPath, "utf8"));
  let issues = 0;

  for (const tool of index.tools || []) {
    // Check descriptions for secret patterns
    const text = `${tool.description || ""} ${tool.explain || ""}`.toLowerCase();
    for (const pattern of SECRET_PATTERNS) {
      if (pattern.test(text)) {
        if (!text.includes("example") && !text.includes("placeholder")) {
          console.warn(`⚠️  Potential secret pattern in tool: ${tool.title}`);
          issues++;
        }
      }
    }

    // Check that routes don't expose internal paths
    if (tool.route?.includes("/api/") || tool.route?.includes("/admin/")) {
      console.error(`❌ Tools index contains internal route: ${tool.route}`);
      issues++;
    }
  }

  if (issues === 0) {
    console.log("✅ Tools index validation passed");
    return true;
  }

  console.error(`❌ Found ${issues} issues in tools index`);
  return false;
}

function checkMentorCode() {
  const mentorDir = path.join(ROOT, "src", "lib", "mentor");
  const files = ["llm.ts", "enhancedRetrieve.ts", "retrieveContent.ts"];

  let issues = 0;

  for (const file of files) {
    const filePath = path.join(mentorDir, file);
    if (!fs.existsSync(filePath)) continue;

    const content = fs.readFileSync(filePath, "utf8");

    // Check for hardcoded secrets
    if (/["'](sk-|pk_|rk_)[\w-]+["']/.test(content)) {
      console.error(`❌ Potential hardcoded API key in ${file}`);
      issues++;
    }

    // Check that file system operations only read safe paths
    if (content.includes("fs.readFileSync") || content.includes("fs.readdirSync")) {
      // Should only read from public/ or content/ directories
      const unsafePaths = content.match(/readFileSync\([^,)]+/g) || [];
      for (const pathMatch of unsafePaths) {
        if (!pathMatch.includes("public") && !pathMatch.includes("content")) {
          console.warn(`⚠️  File system read in ${file} may access unsafe path`);
        }
      }
    }
  }

  if (issues === 0) {
    console.log("✅ Mentor code validation passed");
    return true;
  }

  console.error(`❌ Found ${issues} issues in mentor code`);
  return false;
}

function main() {
  console.log("🔍 Validating mentor system safety...\n");

  const results = [
    checkContentIndex(),
    checkToolsIndex(),
    checkMentorCode(),
  ];

  const allPassed = results.every((r) => r);

  if (allPassed) {
    console.log("\n✅ All safety checks passed!");
    process.exit(0);
  } else {
    console.log("\n❌ Safety validation failed. Please review the issues above.");
    process.exit(1);
  }
}

main();

