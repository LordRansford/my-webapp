#!/usr/bin/env node
/**
 * Quick check script to verify email service (Resend) configuration
 */

const requiredVars = [
  'RESEND_API_KEY',
  'EMAIL_SERVER',
  'EMAIL_FROM',
];

const optionalVars = [
  'NEXTAUTH_URL',
];

console.log('🔍 Checking Email Service (Resend) Configuration...\n');

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
    const displayValue = varName.includes('KEY') || varName.includes('SECRET')
      ? `${value.substring(0, 8)}...${value.substring(value.length - 4)}`
      : varName === 'EMAIL_SERVER'
      ? value.replace(/:[^:@]+@/, ':****@/) // Mask password in SMTP URL
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
if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.startsWith('re_')) {
  console.log('\n⚠️  Warning: RESEND_API_KEY format looks incorrect (should start with "re_")');
}

if (process.env.EMAIL_SERVER && !process.env.EMAIL_SERVER.includes('smtp.resend.com')) {
  console.log('\n⚠️  Warning: EMAIL_SERVER should use smtp.resend.com for Resend');
}

if (process.env.EMAIL_FROM && process.env.EMAIL_FROM.includes('resend.dev') && process.env.NODE_ENV === 'production') {
  console.log('\n⚠️  Warning: Using onboarding@resend.dev in production. Verify your domain in Resend and update EMAIL_FROM.');
}

// Check if using test email
if (process.env.EMAIL_FROM === 'onboarding@resend.dev') {
  console.log('\nℹ️  Using test email address. For production:');
  console.log('   1. Verify your domain in Resend Dashboard');
  console.log('   2. Update EMAIL_FROM to: noreply@yourdomain.com');
}

console.log('\n' + '='.repeat(60));

if (allSet) {
  console.log('✅ All required email environment variables are set!');
  console.log('\nNext steps:');
  console.log('1. Test magic link at: http://localhost:3000/signin');
  console.log('2. Verify domain in Resend Dashboard (for production)');
  console.log('3. Update EMAIL_FROM to use verified domain');
} else {
  console.log('❌ Missing required environment variables:');
  missing.forEach(v => console.log(`   - ${v}`));
  console.log('\nSee SETUP-EMAIL-PLAUSIBLE-DOMAIN.md for setup instructions');
  process.exit(1);
}
