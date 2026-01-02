#!/usr/bin/env node
/**
 * Quick check script to verify Google OAuth configuration
 */

const requiredVars = [
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
];

const optionalVars = [
  'NEXT_PUBLIC_SITE_URL',
];

console.log('🔍 Checking Google OAuth Configuration...\n');

let allSet = true;
const missing = [];
const partial = [];

// Check required variables
for (const varName of requiredVars) {
  const value = process.env[varName];
  if (!value) {
    missing.push(varName);
    allSet = false;
    console.log(`❌ ${varName}: Missing`);
  } else {
    // Mask sensitive values
    const displayValue = varName.includes('SECRET') || varName.includes('SECRET')
      ? `${value.substring(0, 8)}...${value.substring(value.length - 4)}`
      : value;
    console.log(`✅ ${varName}: ${displayValue}`);
  }
}

// Check optional variables
for (const varName of optionalVars) {
  const value = process.env[varName];
  if (value) {
    console.log(`ℹ️  ${varName}: ${value}`);
  } else {
    console.log(`○ ${varName}: Not set (optional)`);
  }
}

// Validate format
if (process.env.GOOGLE_CLIENT_ID && !process.env.GOOGLE_CLIENT_ID.includes('.apps.googleusercontent.com')) {
  console.log('\n⚠️  Warning: GOOGLE_CLIENT_ID format looks incorrect (should contain .apps.googleusercontent.com)');
}

if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length < 32) {
  console.log('\n⚠️  Warning: NEXTAUTH_SECRET should be at least 32 characters for security');
}

// Check callback URL
if (process.env.NEXTAUTH_URL) {
  const callbackUrl = `${process.env.NEXTAUTH_URL}/api/auth/callback/google`;
  console.log(`\n📋 Callback URL to add in Google Console:`);
  console.log(`   ${callbackUrl}`);
}

console.log('\n' + '='.repeat(60));

if (allSet) {
  console.log('✅ All required environment variables are set!');
  console.log('\nNext steps:');
  console.log('1. Verify callback URL in Google Cloud Console');
  console.log('2. Test sign-in at: http://localhost:3000/signin');
  console.log('3. Check browser console for any errors');
} else {
  console.log('❌ Missing required environment variables:');
  missing.forEach(v => console.log(`   - ${v}`));
  console.log('\nSee SETUP-GOOGLE-AUTH.md for setup instructions');
  process.exit(1);
}
