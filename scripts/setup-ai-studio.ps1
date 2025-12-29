# AI Studio Setup Script (PowerShell)
# This script helps set up the AI Studio environment

Write-Host "🚀 AI Studio Setup Script" -ForegroundColor Cyan
Write-Host "==========================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (-not (Test-Path .env.local)) {
    Write-Host "📝 Creating .env.local file..." -ForegroundColor Yellow
    if (Test-Path .env.example) {
        Copy-Item .env.example .env.local
    } else {
        New-Item -Path .env.local -ItemType File | Out-Null
    }
    Write-Host "✅ Created .env.local" -ForegroundColor Green
} else {
    Write-Host "✅ .env.local already exists" -ForegroundColor Green
}

# Check for DATABASE_URL
$envContent = Get-Content .env.local -ErrorAction SilentlyContinue
if ($envContent -notmatch "DATABASE_URL") {
    Write-Host ""
    Write-Host "⚠️  DATABASE_URL not found in .env.local" -ForegroundColor Yellow
    Write-Host "Please add your database connection string:"
    Write-Host 'DATABASE_URL="postgresql://user:password@localhost:5432/database"'
    Read-Host "Press Enter to continue"
}

# Check for BLOB_READ_WRITE_TOKEN
if ($envContent -notmatch "BLOB_READ_WRITE_TOKEN") {
    Write-Host ""
    Write-Host "⚠️  BLOB_READ_WRITE_TOKEN not found in .env.local" -ForegroundColor Yellow
    Write-Host "To get your token:"
    Write-Host "1. Go to https://vercel.com/dashboard"
    Write-Host "2. Navigate to Storage → Blob"
    Write-Host "3. Create a new store (or use existing)"
    Write-Host "4. Copy the BLOB_READ_WRITE_TOKEN"
    Write-Host ""
    $blobToken = Read-Host "Enter your BLOB_READ_WRITE_TOKEN (or press Enter to skip)"
    if ($blobToken) {
        Add-Content -Path .env.local -Value "BLOB_READ_WRITE_TOKEN=`"$blobToken`""
        Write-Host "✅ Added BLOB_READ_WRITE_TOKEN to .env.local" -ForegroundColor Green
    }
}

# Check for NEXTAUTH_SECRET
if ($envContent -notmatch "NEXTAUTH_SECRET") {
    Write-Host ""
    Write-Host "⚠️  NEXTAUTH_SECRET not found in .env.local" -ForegroundColor Yellow
    Write-Host "Generating a random secret..."
    $bytes = New-Object byte[] 32
    [System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
    $secret = [Convert]::ToBase64String($bytes)
    Add-Content -Path .env.local -Value "NEXTAUTH_SECRET=`"$secret`""
    Write-Host "✅ Generated and added NEXTAUTH_SECRET" -ForegroundColor Green
}

# Check for NEXTAUTH_URL
if ($envContent -notmatch "NEXTAUTH_URL") {
    Write-Host ""
    Write-Host "⚠️  NEXTAUTH_URL not found in .env.local" -ForegroundColor Yellow
    Add-Content -Path .env.local -Value 'NEXTAUTH_URL="http://localhost:3000"'
    Write-Host "✅ Added NEXTAUTH_URL (default: http://localhost:3000)" -ForegroundColor Green
}

# Install dependencies
Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm install

# Generate Prisma client
Write-Host ""
Write-Host "🔧 Generating Prisma client..." -ForegroundColor Cyan
try {
    npx prisma generate
    Write-Host "✅ Prisma client generated" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Prisma generate failed (this is okay if schema isn't set up yet)" -ForegroundColor Yellow
}

# Check if migrations are needed
Write-Host ""
Write-Host "🗄️  Database setup..." -ForegroundColor Cyan
if (Test-Path "prisma/schema.prisma") {
    Write-Host "Checking for pending migrations..."
    try {
        npx prisma migrate status
    } catch {
        Write-Host "⚠️  Migration check failed (this is okay if database isn't set up yet)" -ForegroundColor Yellow
    }
    
    $runMigrations = Read-Host "Do you want to run migrations now? (y/n)"
    if ($runMigrations -eq "y") {
        try {
            npx prisma migrate dev
            Write-Host "✅ Migrations completed" -ForegroundColor Green
        } catch {
            Write-Host "⚠️  Migrations failed (check your DATABASE_URL)" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "⚠️  Prisma schema not found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Ensure DATABASE_URL is set in .env.local"
Write-Host "2. Ensure BLOB_READ_WRITE_TOKEN is set in .env.local"
Write-Host "3. Run: npm run dev"
Write-Host "4. Visit: http://localhost:3000/ai-studio"
Write-Host ""

