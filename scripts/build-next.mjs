#!/usr/bin/env node
/**
 * Build Next.js Application
 * This script runs next build programmatically to avoid permission issues
 */

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

try {
  // Try to use npx first (works in most environments)
  try {
    execSync('npx next build', {
      cwd: projectRoot,
      stdio: 'inherit',
      env: { ...process.env }
    });
    process.exit(0);
  } catch (npxError) {
    // If npx fails, try using node directly with the next binary
    console.warn('npx failed, trying direct node execution...');
    try {
      const nextPath = join(projectRoot, 'node_modules', 'next', 'dist', 'bin', 'next');
      execSync(`node "${nextPath}" build`, {
        cwd: projectRoot,
        stdio: 'inherit',
        env: { ...process.env }
      });
      process.exit(0);
    } catch (nodeError) {
      // Last resort: use explicit node path to avoid permission issues
      console.warn('Direct node execution failed, trying with explicit node path...');
      try {
        const nodePath = process.execPath;
        const nextPath = join(projectRoot, 'node_modules', 'next', 'dist', 'bin', 'next');
        execSync(`"${nodePath}" "${nextPath}" build`, {
          cwd: projectRoot,
          stdio: 'inherit',
          env: { ...process.env }
        });
        process.exit(0);
      } catch (finalError) {
        throw new Error(`All Next.js build methods failed. Last error: ${finalError.message}`);
      }
    }
  }
} catch (error) {
  console.error('Failed to build Next.js application:', error.message);
  process.exit(1);
}
