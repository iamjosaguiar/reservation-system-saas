#!/bin/bash

# Vercel Environment Setup Script
# Run this script to set up all required environment variables for production

echo "Setting up Vercel environment variables..."
echo ""

# Set NEXTAUTH_URL
echo "Setting NEXTAUTH_URL..."
echo "https://reservation-system-saas-j4zn.vercel.app" | vercel env add NEXTAUTH_URL production

echo ""
echo "Setting NEXTAUTH_URL for preview..."
echo "https://reservation-system-saas-j4zn.vercel.app" | vercel env add NEXTAUTH_URL preview

echo ""
echo "Setting NEXTAUTH_SECRET..."
echo "UX/7dwOV2iaCkYUHlEdFsDc06VGjqxxa16hwtyE+mEE=" | vercel env add NEXTAUTH_SECRET production

echo ""
echo "Setting NEXTAUTH_SECRET for preview..."
echo "UX/7dwOV2iaCkYUHlEdFsDc06VGjqxxa16hwtyE+mEE=" | vercel env add NEXTAUTH_SECRET preview

echo ""
echo "Setting NEXT_PUBLIC_APP_URL..."
echo "https://reservation-system-saas-j4zn.vercel.app" | vercel env add NEXT_PUBLIC_APP_URL production

echo ""
echo "Setting NEXT_PUBLIC_APP_URL for preview..."
echo "https://reservation-system-saas-j4zn.vercel.app" | vercel env add NEXT_PUBLIC_APP_URL preview

echo ""
echo "✓ Environment variables set successfully!"
echo ""
echo "⚠️  IMPORTANT: You still need to set DATABASE_URL"
echo "Options:"
echo "1. Vercel Postgres: vercel postgres create"
echo "2. Or use another provider and run:"
echo "   vercel env add DATABASE_URL production"
echo ""
echo "After setting DATABASE_URL, redeploy with: vercel --prod"
