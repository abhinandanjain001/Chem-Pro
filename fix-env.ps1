# ChemGenius Environment Setup Script
# This script helps you update your .env.local file with the correct variable name

Write-Host "🔧 ChemGenius Environment Variable Fixer" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

$envFile = ".env.local"

if (Test-Path $envFile) {
    Write-Host "✓ Found .env.local file" -ForegroundColor Green
    
    $content = Get-Content $envFile -Raw
    
    # Check if it needs fixing
    if ($content -match "^API_KEY=|^GEMINI_API_KEY=") {
        Write-Host "⚠️  Found incorrect environment variable name" -ForegroundColor Yellow
        
        # Create backup
        Copy-Item $envFile "$envFile.backup"
        Write-Host "✓ Created backup: .env.local.backup" -ForegroundColor Green
        
        # Fix the variable name
        $newContent = $content -replace "^API_KEY=", "VITE_API_KEY="
        $newContent = $newContent -replace "^GEMINI_API_KEY=", "VITE_API_KEY="
        
        Set-Content $envFile $newContent
        Write-Host "✓ Fixed environment variable name to VITE_API_KEY" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "Current .env.local contents:" -ForegroundColor Cyan
        Get-Content $envFile
    }
    elseif ($content -match "^VITE_API_KEY=") {
        Write-Host "✓ Environment variable is already correct!" -ForegroundColor Green
    }
    else {
        Write-Host "⚠️  Could not find API_KEY variable" -ForegroundColor Yellow
        Write-Host "Please manually add: VITE_API_KEY=your_gemini_api_key_here" -ForegroundColor Yellow
    }
}
else {
    Write-Host "❌ .env.local file not found" -ForegroundColor Red
    Write-Host "Creating .env.local from example..." -ForegroundColor Yellow
    
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" $envFile
        Write-Host "✓ Created .env.local from .env.example" -ForegroundColor Green
        Write-Host "⚠️  Please add your Gemini API key to .env.local" -ForegroundColor Yellow
    }
    else {
        Write-Host "Please create .env.local with: VITE_API_KEY=your_gemini_api_key_here" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Verify your API key is set in .env.local" -ForegroundColor White
Write-Host "2. Run: npm install" -ForegroundColor White
Write-Host "3. Run: npm run dev" -ForegroundColor White
Write-Host ""
