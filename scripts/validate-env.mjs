#!/usr/bin/env node

/**
 * Environment Variable Validation Script
 * 
 * This script validates that all required environment variables are properly
 * configured for the application to run. It checks both required and optional
 * variables and provides clear feedback about what's missing or misconfigured.
 * 
 * Usage:
 *   node scripts/validate-env.mjs
 * 
 * Exit codes:
 *   0 - All required variables are set
 *   1 - One or more required variables are missing or invalid
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('');
  log(`${'='.repeat(60)}`, colors.cyan);
  log(`${title}`, colors.bold + colors.cyan);
  log(`${'='.repeat(60)}`, colors.cyan);
}

function checkRequired(name, value, description) {
  if (!value || value.trim() === '') {
    log(`✗ ${name}`, colors.red);
    log(`  ${description}`, colors.reset);
    log(`  Status: MISSING (required)`, colors.red);
    return false;
  }
  log(`✓ ${name}`, colors.green);
  log(`  ${description}`, colors.reset);
  return true;
}

function checkOptional(name, value, description, required = false) {
  if (!value || value.trim() === '') {
    const status = required ? 'MISSING (required for feature)' : 'Not set (optional)';
    const color = required ? colors.yellow : colors.reset;
    log(`○ ${name}`, color);
    log(`  ${description}`, colors.reset);
    log(`  Status: ${status}`, color);
    return !required;
  }
  log(`✓ ${name}`, colors.green);
  log(`  ${description}`, colors.reset);
  return true;
}

function validateSecretStrength(name, value) {
  if (!value) return false;
  
  const issues = [];
  
  if (value.length < 32) {
    issues.push('Should be at least 32 characters for security');
  }
  
  if (value === 'your-secret-key-here-change-this-in-production') {
    issues.push('Using example value - change this in production!');
  }
  
  if (issues.length > 0) {
    log(`  ⚠ Security warnings:`, colors.yellow);
    issues.forEach(issue => log(`    - ${issue}`, colors.yellow));
    return false;
  }
  
  return true;
}

function checkEnvFile() {
  const envPath = join(__dirname, '..', '.env.local');
  const envExamplePath = join(__dirname, '..', '.env.example');
  
  try {
    readFileSync(envPath, 'utf-8');
    log(`✓ .env.local file found`, colors.green);
    return true;
  } catch {
    log(`○ .env.local file not found`, colors.yellow);
    log(`  For local development, copy .env.example to .env.local`, colors.reset);
    
    try {
      readFileSync(envExamplePath, 'utf-8');
      log(`  ✓ .env.example file is available as a template`, colors.green);
    } catch {
      log(`  ✗ .env.example file not found`, colors.red);
    }
    return false;
  }
}

async function main() {
  log(`
███████╗███╗   ██╗██╗   ██╗    ██╗   ██╗ █████╗ ██╗     ██╗██████╗  █████╗ ████████╗███╗   ███╗██████╗ 
██╔════╝████╗  ██║██║   ██║    ██║   ██║██╔══██╗██║     ██║██╔══██╗██╔══██╗╚══██╔══╝████╗ ████║██╔══██╗
█████╗  ██╔██╗ ██║██║   ██║    ██║   ██║███████║██║     ██║██║  ██║███████║   ██║   ██╔████╔██║██████╔╝
██╔══╝  ██║╚██╗██║╚██╗ ██╔╝    ╚██╗ ██╔╝██╔══██║██║     ██║██║  ██║██╔══██║   ██║   ██║╚██╔╝██║██╔══██╗
███████╗██║ ╚████║ ╚████╔╝      ╚████╔╝ ██║  ██║███████╗██║██████╔╝██║  ██║   ██║   ██║ ╚═╝ ██║██║  ██║
╚══════╝╚═╝  ╚═══╝  ╚═══╝        ╚═══╝  ╚═╝  ╚═╝╚══════╝╚═╝╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝     ╚═╝╚═╝  ╚═╝
`, colors.cyan);
  
  logSection('Environment Configuration Validation');
  
  console.log('');
  log('Checking environment file...', colors.bold);
  checkEnvFile();
  
  logSection('Required Variables (Core Authentication)');
  
  const requiredChecks = [
    checkRequired(
      'NEXTAUTH_URL',
      process.env.NEXTAUTH_URL,
      'Base URL of the application for NextAuth (e.g., https://yourdomain.com)'
    ),
    checkRequired(
      'NEXTAUTH_SECRET',
      process.env.NEXTAUTH_SECRET,
      'Secret key for encrypting JWT tokens and session data'
    ),
  ];
  
  // Validate NEXTAUTH_SECRET strength if present
  if (process.env.NEXTAUTH_SECRET) {
    validateSecretStrength('NEXTAUTH_SECRET', process.env.NEXTAUTH_SECRET);
  }
  
  logSection('Optional Variables (OAuth Providers)');
  
  const hasGoogleId = !!process.env.GOOGLE_CLIENT_ID;
  const hasGoogleSecret = !!process.env.GOOGLE_CLIENT_SECRET;
  const hasPartialGoogle = hasGoogleId !== hasGoogleSecret;
  
  if (hasPartialGoogle) {
    log('⚠ Partial Google OAuth configuration detected', colors.yellow);
    log('  Both GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set', colors.yellow);
  }
  
  const googleChecks = [
    checkOptional(
      'GOOGLE_CLIENT_ID',
      process.env.GOOGLE_CLIENT_ID,
      'Google OAuth Client ID for Google Sign-In',
      hasGoogleSecret
    ),
    checkOptional(
      'GOOGLE_CLIENT_SECRET',
      process.env.GOOGLE_CLIENT_SECRET,
      'Google OAuth Client Secret for Google Sign-In',
      hasGoogleId
    ),
  ];
  
  logSection('Optional Variables (Email Magic Links)');
  
  const hasEmailServer = !!process.env.EMAIL_SERVER;
  const hasEmailFrom = !!process.env.EMAIL_FROM;
  const hasPartialEmail = hasEmailServer !== hasEmailFrom;
  
  if (hasPartialEmail) {
    log('⚠ Partial Email provider configuration detected', colors.yellow);
    log('  Both EMAIL_SERVER and EMAIL_FROM must be set', colors.yellow);
  }
  
  const emailChecks = [
    checkOptional(
      'EMAIL_SERVER',
      process.env.EMAIL_SERVER,
      'SMTP server connection string for email authentication',
      hasEmailFrom
    ),
    checkOptional(
      'EMAIL_FROM',
      process.env.EMAIL_FROM,
      'From email address for magic link emails',
      hasEmailServer
    ),
  ];
  
  logSection('Optional Variables (Database)');
  
  checkOptional(
    'DATABASE_URL',
    process.env.DATABASE_URL,
    'Database connection string (defaults to SQLite if not set)',
    false
  );
  
  logSection('Optional Variables (Stripe Payments)');
  
  const hasStripeKey = !!process.env.STRIPE_SECRET_KEY;
  const hasStripeWebhook = !!process.env.STRIPE_WEBHOOK_SECRET;
  const hasPartialStripe = hasStripeKey !== hasStripeWebhook;
  
  if (hasPartialStripe) {
    log('⚠ Partial Stripe configuration detected', colors.yellow);
    log('  Both STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET should be set', colors.yellow);
  }
  
  checkOptional(
    'STRIPE_SECRET_KEY',
    process.env.STRIPE_SECRET_KEY,
    'Stripe secret key for payment processing',
    false
  );
  
  checkOptional(
    'STRIPE_WEBHOOK_SECRET',
    process.env.STRIPE_WEBHOOK_SECRET,
    'Stripe webhook secret for verifying webhook signatures',
    false
  );
  
  logSection('Summary');
  
  const allRequiredSet = requiredChecks.every(check => check);
  const allGoogleSet = googleChecks.every(check => check);
  const allEmailSet = emailChecks.every(check => check);
  
  console.log('');
  
  if (allRequiredSet) {
    log('✓ Core authentication is properly configured', colors.green);
  } else {
    log('✗ Core authentication is NOT properly configured', colors.red);
    log('  Set NEXTAUTH_URL and NEXTAUTH_SECRET to enable authentication', colors.red);
  }
  
  console.log('');
  
  if (hasGoogleId || hasGoogleSecret) {
    if (allGoogleSet) {
      log('✓ Google OAuth is properly configured', colors.green);
    } else {
      log('⚠ Google OAuth is partially configured', colors.yellow);
      log('  Set both GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET', colors.yellow);
    }
  } else {
    log('○ Google OAuth is not configured (optional)', colors.reset);
  }
  
  console.log('');
  
  if (hasEmailServer || hasEmailFrom) {
    if (allEmailSet) {
      log('✓ Email authentication is properly configured', colors.green);
    } else {
      log('⚠ Email authentication is partially configured', colors.yellow);
      log('  Set both EMAIL_SERVER and EMAIL_FROM', colors.yellow);
    }
  } else {
    log('○ Email authentication is not configured (optional)', colors.reset);
  }
  
  console.log('');
  log(`${'='.repeat(60)}`, colors.cyan);
  
  if (!allRequiredSet) {
    console.log('');
    log('❌ VALIDATION FAILED', colors.bold + colors.red);
    log('   Required environment variables are missing.', colors.red);
    log('   See .env.example for a complete template.', colors.reset);
    console.log('');
    process.exit(1);
  } else {
    console.log('');
    log('✅ VALIDATION PASSED', colors.bold + colors.green);
    log('   All required environment variables are set.', colors.green);
    console.log('');
    
    if (process.env.NODE_ENV === 'production') {
      console.log('');
      log('Production Environment Checklist:', colors.bold);
      log('  1. Use strong, randomly generated NEXTAUTH_SECRET (32+ chars)', colors.reset);
      log('  2. Set NEXTAUTH_URL to your actual production domain', colors.reset);
      log('  3. Use different credentials for production vs development', colors.reset);
      log('  4. Store secrets in your platform\'s secure variable system', colors.reset);
      log('  5. Never commit .env.local or production secrets to git', colors.reset);
      console.log('');
    }
    
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Validation script error:', err);
  process.exit(1);
});
