#!/usr/bin/env node
/**
 * Generate Prisma Client
 * This script runs prisma generate programmatically to avoid permission issues
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
    execSync('npx prisma generate', {
      cwd: projectRoot,
      stdio: 'inherit',
      env: { ...process.env, PRISMA_GENERATE_DATAPROXY: 'false' }
    });
    process.exit(0);
  } catch (npxError) {
    // If npx fails, try using node directly with the prisma binary
    try {
      const prismaPath = join(projectRoot, 'node_modules', 'prisma', 'build', 'index.js');
      execSync(`node "${prismaPath}" generate`, {
        cwd: projectRoot,
        stdio: 'inherit',
        env: { ...process.env, PRISMA_GENERATE_DATAPROXY: 'false' }
      });
      process.exit(0);
    } catch (nodeError) {
      // Last resort: try direct binary execution (may work on some systems)
      console.warn('Standard methods failed, trying direct binary execution...');
      try {
        const { platform } = process;
        const binPath = platform === 'win32' 
          ? join(projectRoot, 'node_modules', '.bin', 'prisma.cmd')
          : join(projectRoot, 'node_modules', '.bin', 'prisma');
        
        execSync(`node "${binPath}" generate`, {
          cwd: projectRoot,
          stdio: 'inherit',
          env: { ...process.env, PRISMA_GENERATE_DATAPROXY: 'false' }
        });
        process.exit(0);
      } catch (finalError) {
        throw new Error(`All Prisma generation methods failed. Last error: ${finalError.message}`);
      }
    }
  }
} catch (error) {
  console.error('Failed to generate Prisma client:', error.message);
  process.exit(1);
}
