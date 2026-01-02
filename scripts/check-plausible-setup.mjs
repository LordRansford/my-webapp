#!/usr/bin/env node
/**
 * Quick check script to verify Plausible analytics configuration
 */

const requiredVars = [
  'NEXT_PUBLIC_PLAUSIBLE_DOMAIN',
];

console.log('🔍 Checking Plausible Analytics Configuration...\n');

let allSet = true;
const missing = [];

// Check required variables
for (const varName of requiredVars) {
  const value = process.env[varName];
  if (!value) {
    missing.push(varName);
    allSet = false;
    console.log(`❌ ${varName}: Missing`);
  } else {
    console.log(`✅ ${varName}: ${value}`);
  }
}

// Check if domain looks like a test domain
if (process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN.includes('vercel.app')) {
  console.log('\nℹ️  Using Vercel preview domain. For production:');
  console.log('   1. Add your custom domain in Plausible Dashboard');
  console.log('   2. Update NEXT_PUBLIC_PLAUSIBLE_DOMAIN to your custom domain');
}

console.log('\n' + '='.repeat(60));

if (allSet) {
  console.log('✅ Plausible analytics is configured!');
  console.log('\nNext steps:');
  console.log('1. Visit your site to generate analytics events');
  console.log('2. Check Plausible Dashboard for real-time visitors');
  console.log('3. Update domain to custom domain when ready');
} else {
  console.log('❌ Missing required environment variable:');
  missing.forEach(v => console.log(`   - ${v}`));
  console.log('\nSee SETUP-EMAIL-PLAUSIBLE-DOMAIN.md for setup instructions');
  process.exit(1);
}
