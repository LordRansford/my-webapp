#!/usr/bin/env node

/**
 * British English Verification Script
 * 
 * Checks content files for American English spellings, em-dashes, and "generated feel" language patterns.
 * 
 * Usage:
 *   node scripts/verify-british-english.mjs [--fix] [--path <path>]
 * 
 * Options:
 *   --fix: Automatically fix common issues (use with caution)
 *   --path: Specific path to check (default: content/notes)
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";

const BRITISH_ENGLISH_RULES = {
  spelling: {
    organize: "organise",
    color: "colour",
    center: "centre",
    analyze: "analyse",
    optimize: "optimise",
    behavior: "behaviour",
    defense: "defence",
    recognize: "recognise",
    realize: "realise",
    customize: "customise",
    finalize: "finalise",
    prioritize: "prioritise",
    standardize: "standardise",
    // Note: "license" as verb → "licence" (but "license" as noun is also British)
    // This is context-dependent, so we flag it for manual review
  },
  punctuation: {
    emDash: /—/g, // Em-dash (U+2014)
    enDash: /–/g, // En-dash (U+2013) - flag for review
  },
  style: {
    generatedFeel: [
      /In this (article|section|document),? we (will|shall)/gi,
      /Let's (dive|explore|take a look)/gi,
      /Welcome to/gi, // Often used in generated content
      /In conclusion/gi, // Overused phrase
      /It's worth noting that/gi,
      /It's important to (note|remember|understand)/gi,
    ],
  },
};

const CONTENT_DIRS = ["content/notes", "content/posts"];
const FILE_EXTENSIONS = [".mdx", ".md"];

let errors = [];
let warnings = [];
let fixes = [];

function findFiles(dir, fileList = []) {
  const files = readdirSync(dir);

  files.forEach((file) => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      findFiles(filePath, fileList);
    } else if (FILE_EXTENSIONS.includes(extname(file))) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function checkFile(filePath, autoFix = false) {
  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  let modified = false;
  let newContent = content;

  // Check for American spellings
  Object.entries(BRITISH_ENGLISH_RULES.spelling).forEach(([american, british]) => {
    const regex = new RegExp(`\\b${american}\\b`, "gi");
    const matches = content.match(regex);

    if (matches) {
      matches.forEach((match) => {
        const lineNum = content.substring(0, content.indexOf(match)).split("\n").length;
        const issue = {
          file: filePath,
          line: lineNum,
          type: "spelling",
          issue: `American spelling: "${match}" should be "${british}"`,
          fix: () => {
            newContent = newContent.replace(new RegExp(`\\b${match}\\b`, "g"), british);
          },
        };

        if (autoFix) {
          issue.fix();
          modified = true;
          fixes.push(issue);
        } else {
          errors.push(issue);
        }
      });
    }
  });

  // Check for em-dashes
  const emDashMatches = content.match(BRITISH_ENGLISH_RULES.punctuation.emDash);
  if (emDashMatches) {
    emDashMatches.forEach((match) => {
      const lineNum = content.substring(0, content.indexOf(match)).split("\n").length;
      const issue = {
        file: filePath,
        line: lineNum,
        type: "punctuation",
        issue: "Em-dash (—) found. Replace with comma or full stop.",
        fix: () => {
          // Replace with comma (context-dependent, may need manual review)
          newContent = newContent.replace(/—/g, ", ");
          modified = true;
        },
      };

      if (autoFix) {
        warnings.push({
          ...issue,
          note: "Auto-fixed: replaced with comma. Please review for context.",
        });
        issue.fix();
        fixes.push(issue);
      } else {
        errors.push(issue);
      }
    });
  }

  // Check for "generated feel" language
  BRITISH_ENGLISH_RULES.style.generatedFeel.forEach((pattern) => {
    const matches = content.match(pattern);
    if (matches) {
      matches.forEach((match) => {
        const lineNum = content.substring(0, content.indexOf(match)).split("\n").length;
        warnings.push({
          file: filePath,
          line: lineNum,
          type: "style",
          issue: `"Generated feel" language pattern: "${match}"`,
          suggestion: "Consider rewriting in a more natural, direct style.",
        });
      });
    }
  });

  if (modified && autoFix) {
    writeFileSync(filePath, newContent, "utf-8");
  }

  return { errors, warnings, fixes, modified };
}

function main() {
  const args = process.argv.slice(2);
  const autoFix = args.includes("--fix");
  const pathArg = args.find((arg) => arg.startsWith("--path="));
  const targetPath = pathArg ? pathArg.split("=")[1] : null;

  const dirsToCheck = targetPath ? [targetPath] : CONTENT_DIRS;

  console.log("🔍 Checking British English compliance...\n");

  dirsToCheck.forEach((dir) => {
    if (!statSync(dir).isDirectory()) {
      console.error(`❌ Directory not found: ${dir}`);
      return;
    }

    const files = findFiles(dir);
    console.log(`📁 Checking ${files.length} files in ${dir}...\n`);

    files.forEach((file) => {
      checkFile(file, autoFix);
    });
  });

  // Report results
  if (errors.length === 0 && warnings.length === 0) {
    console.log("✅ All checks passed! No issues found.\n");
    process.exit(0);
  }

  if (errors.length > 0) {
    console.log(`❌ Found ${errors.length} error(s):\n`);
    errors.forEach((error) => {
      console.log(`  ${error.file}:${error.line}`);
      console.log(`    ${error.issue}\n`);
    });
  }

  if (warnings.length > 0) {
    console.log(`⚠️  Found ${warnings.length} warning(s):\n`);
    warnings.forEach((warning) => {
      console.log(`  ${warning.file}:${warning.line}`);
      console.log(`    ${warning.issue}`);
      if (warning.suggestion) {
        console.log(`    Suggestion: ${warning.suggestion}`);
      }
      if (warning.note) {
        console.log(`    Note: ${warning.note}`);
      }
      console.log();
    });
  }

  if (fixes.length > 0) {
    console.log(`✅ Auto-fixed ${fixes.length} issue(s)\n`);
  }

  if (autoFix) {
    console.log("💡 Review the changes and commit if satisfied.\n");
  } else {
    console.log("💡 Run with --fix to automatically fix common issues (use with caution).\n");
  }

  process.exit(errors.length > 0 ? 1 : 0);
}

main();

