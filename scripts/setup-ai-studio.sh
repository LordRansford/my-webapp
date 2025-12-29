#!/bin/bash

# AI Studio Setup Script
# This script helps set up the AI Studio environment

set -e

echo "🚀 AI Studio Setup Script"
echo "=========================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo "📝 Creating .env.local file..."
  cp .env.example .env.local 2>/dev/null || touch .env.local
  echo "✅ Created .env.local"
else
  echo "✅ .env.local already exists"
fi

# Check for DATABASE_URL
if ! grep -q "DATABASE_URL" .env.local; then
  echo ""
  echo "⚠️  DATABASE_URL not found in .env.local"
  echo "Please add your database connection string:"
  echo "DATABASE_URL=\"postgresql://user:password@localhost:5432/database\""
  read -p "Press Enter to continue..."
fi

# Check for BLOB_READ_WRITE_TOKEN
if ! grep -q "BLOB_READ_WRITE_TOKEN" .env.local; then
  echo ""
  echo "⚠️  BLOB_READ_WRITE_TOKEN not found in .env.local"
  echo "To get your token:"
  echo "1. Go to https://vercel.com/dashboard"
  echo "2. Navigate to Storage → Blob"
  echo "3. Create a new store (or use existing)"
  echo "4. Copy the BLOB_READ_WRITE_TOKEN"
  echo ""
  read -p "Enter your BLOB_READ_WRITE_TOKEN (or press Enter to skip): " blob_token
  if [ ! -z "$blob_token" ]; then
    echo "BLOB_READ_WRITE_TOKEN=\"$blob_token\"" >> .env.local
    echo "✅ Added BLOB_READ_WRITE_TOKEN to .env.local"
  fi
fi

# Check for NEXTAUTH_SECRET
if ! grep -q "NEXTAUTH_SECRET" .env.local; then
  echo ""
  echo "⚠️  NEXTAUTH_SECRET not found in .env.local"
  echo "Generating a random secret..."
  secret=$(openssl rand -base64 32)
  echo "NEXTAUTH_SECRET=\"$secret\"" >> .env.local
  echo "✅ Generated and added NEXTAUTH_SECRET"
fi

# Check for NEXTAUTH_URL
if ! grep -q "NEXTAUTH_URL" .env.local; then
  echo ""
  echo "⚠️  NEXTAUTH_URL not found in .env.local"
  echo "NEXTAUTH_URL=\"http://localhost:3000\"" >> .env.local
  echo "✅ Added NEXTAUTH_URL (default: http://localhost:3000)"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo ""
echo "🔧 Generating Prisma client..."
npx prisma generate || echo "⚠️  Prisma generate failed (this is okay if schema isn't set up yet)"

# Check if migrations are needed
echo ""
echo "🗄️  Database setup..."
if [ -f "prisma/schema.prisma" ]; then
  echo "Checking for pending migrations..."
  npx prisma migrate status || echo "⚠️  Migration check failed (this is okay if database isn't set up yet)"
  
  read -p "Do you want to run migrations now? (y/n): " run_migrations
  if [ "$run_migrations" = "y" ]; then
    npx prisma migrate dev || echo "⚠️  Migrations failed (check your DATABASE_URL)"
  fi
else
  echo "⚠️  Prisma schema not found"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Ensure DATABASE_URL is set in .env.local"
echo "2. Ensure BLOB_READ_WRITE_TOKEN is set in .env.local"
echo "3. Run: npm run dev"
echo "4. Visit: http://localhost:3000/ai-studio"
echo ""

