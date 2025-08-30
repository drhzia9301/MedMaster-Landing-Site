#!/bin/bash

# Set Vercel environment variables for MedMaster Landing Page
echo "🚀 Setting Vercel environment variables..."

# Function to set environment variable
set_env_var() {
    local key=$1
    local value=$2
    echo "Setting $key..."
    
    # Remove existing variable (ignore errors)
    vercel env rm "$key" production --yes 2>/dev/null || true
    
    # Add new variable
    echo "$value" | vercel env add "$key" production
}

# Set all environment variables
set_env_var "VITE_API_URL" "https://medmaster-production.up.railway.app"
set_env_var "VITE_APP_DOMAIN" "https://app.medmaster.com"
set_env_var "VITE_APP_ENV" "production"

# Supabase Configuration
set_env_var "VITE_SUPABASE_URL" "https://fylvbbbnrykuawayvkat.supabase.co"
set_env_var "VITE_SUPABASE_ANON_KEY" "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5bHZiYmJucnlrdWF3YXl2a2F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1Mzg4MjgsImV4cCI6MjA3MTExNDgyOH0.zs_KlULsvZdXtXeqPJBtGyBEdZF65uGTCX06mvAQfNU"

# Firebase Configuration
set_env_var "VITE_FIREBASE_API_KEY" "AIzaSyCsy00m3pl76bitsNcffnGpm9DObgKELcM"
set_env_var "VITE_FIREBASE_APP_ID" "1:1073454322288:web:2dd42bd0d731d6c2bb5ab5"
set_env_var "VITE_FIREBASE_AUTH_DOMAIN" "medmaster-auth.firebaseapp.com"
set_env_var "VITE_FIREBASE_MESSAGING_SENDER_ID" "1073454322288"
set_env_var "VITE_FIREBASE_PROJECT_ID" "medmaster-auth"
set_env_var "VITE_FIREBASE_STORAGE_BUCKET" "medmaster-auth.firebasestorage.app"
set_env_var "VITE_FIREBASE_MEASUREMENT_ID" "G-6V494YYG8Z"

# Domain Configuration
set_env_var "VITE_LANDING_DOMAIN" "https://medmaster.site"
set_env_var "VITE_MAIN_APP_URL" "https://medmaster-main-app.vercel.app"

echo "✅ Environment variables set successfully!"
echo "🚀 Now deploying to Vercel..."

# Deploy to production
vercel --prod

echo "✅ Deployment completed!"
echo "🌐 Your landing page should now be available at: https://medmaster.site"
