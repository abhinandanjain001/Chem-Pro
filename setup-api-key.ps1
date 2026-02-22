# Quick API Key Setup Script
# Run this after you get your API key from Google AI Studio

Write-Host "🔑 ChemGenius API Key Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Prompt for API key
Write-Host "Please paste your Gemini API key here:" -ForegroundColor Yellow
Write-Host "(It should start with 'AIzaSy...')" -ForegroundColor Gray
Write-Host ""
$apiKey = Read-Host "API Key"

# Validate the key format
if ($apiKey -match "^AIzaSy") {
    Write-Host ""
    Write-Host "✓ Valid API key format detected!" -ForegroundColor Green
    
    # Update .env.local
    $envContent = "VITE_API_KEY=$apiKey"
    Set-Content -Path ".env.local" -Value $envContent
    
    Write-Host "✓ API key saved to .env.local" -ForegroundColor Green
    Write-Host ""
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host "✅ Setup Complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Restart your dev server (Ctrl+C, then 'npm run dev')" -ForegroundColor White
    Write-Host "2. Hard refresh your browser (Ctrl+Shift+R)" -ForegroundColor White
    Write-Host "3. Test by generating a quiz!" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Invalid API key format!" -ForegroundColor Red
    Write-Host "API keys should start with 'AIzaSy'" -ForegroundColor Yellow
    Write-Host "Please check and try again." -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
