#!/usr/bin/env pwsh

# Deploy MedMaster Landing Page to Vercel with correct environment variables
Write-Host "🚀 Deploying MedMaster Landing Page to Vercel..." -ForegroundColor Green

Write-Host "📝 Please set the following environment variables in Vercel Dashboard:" -ForegroundColor Yellow
Write-Host "Go to: https://vercel.com/dashboard -> Your Project -> Settings -> Environment Variables" -ForegroundColor Cyan
Write-Host ""

# Production environment variables to set manually
Write-Host "Environment Variables to set:" -ForegroundColor Green
Write-Host "VITE_API_URL = https://medmaster-production.up.railway.app" -ForegroundColor White
Write-Host "VITE_APP_DOMAIN = https://app.medmaster.com" -ForegroundColor White
Write-Host "VITE_APP_ENV = production" -ForegroundColor White
Write-Host "VITE_FIREBASE_API_KEY = AIzaSyCsy00m3pl76bitsNcffnGpm9DObgKELcM" -ForegroundColor White
Write-Host "VITE_FIREBASE_APP_ID = 1:1073454322288:web:2dd42bd0d731d6c2bb5ab5" -ForegroundColor White
Write-Host "VITE_FIREBASE_AUTH_DOMAIN = medmaster-auth.firebaseapp.com" -ForegroundColor White
Write-Host "VITE_FIREBASE_MESSAGING_SENDER_ID = 1073454322288" -ForegroundColor White
Write-Host "VITE_FIREBASE_PROJECT_ID = medmaster-auth" -ForegroundColor White
Write-Host "VITE_FIREBASE_STORAGE_BUCKET = medmaster-auth.firebasestorage.app" -ForegroundColor White
Write-Host "VITE_FIREBASE_MEASUREMENT_ID = G-6V494YYG8Z" -ForegroundColor White
Write-Host "VITE_LANDING_DOMAIN = https://medmaster.site" -ForegroundColor White
Write-Host ""

Write-Host "⚠️  Make sure to set these for 'Production' environment!" -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter after you've set the environment variables in Vercel Dashboard"

Write-Host "✅ Environment variables set successfully!" -ForegroundColor Green

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow
vercel --prod

Write-Host "✅ Deployment completed!" -ForegroundColor Green
Write-Host "🌐 Your landing page should now be available at: https://medmaster.site" -ForegroundColor Cyan
