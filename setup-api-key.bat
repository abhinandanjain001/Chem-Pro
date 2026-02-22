@echo off
color 0A
echo.
echo ========================================
echo   ChemGenius API Key Setup
echo ========================================
echo.
echo Please paste your Gemini API key below
echo (It should start with AIzaSy...)
echo.
set /p apikey="API Key: "

echo.
echo Saving API key to .env.local...
echo VITE_API_KEY=%apikey% > .env.local

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Restart your dev server (Ctrl+C, then npm run dev)
echo 2. Hard refresh browser (Ctrl+Shift+R)
echo 3. Test by generating a quiz!
echo.
pause
