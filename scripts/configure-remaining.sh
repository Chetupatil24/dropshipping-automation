#!/bin/bash

# ============================================
# RUTHAN - Quick Configuration Helper Script
# ============================================

echo "🎯 Ruthan Configuration Helper"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Automated Updates Complete!${NC}"
echo ""
echo "The following have been automatically configured:"
echo "  ✅ JWT_SECRET - Secure 64-character secret generated"
echo "  ✅ frontend/.env.local - Development URLs configured"
echo ""

echo -e "${YELLOW}⚠️  Manual Configuration Needed:${NC}"
echo ""
echo "Please complete these steps manually:"
echo ""

echo "1️⃣  EMAIL SERVICE (15 minutes)"
echo "   • Go to: https://myaccount.google.com/security"
echo "   • Enable 2-Step Verification"
echo "   • Generate App Password"
echo "   • Update .env line 74: EMAIL_PASSWORD=your_16_char_password"
echo ""

echo "2️⃣  SHIPROCKET (30 minutes)"
echo "   • Sign up: https://www.shiprocket.in"
echo "   • Complete profile"
echo "   • Get credentials from Settings → API"
echo "   • Update .env line 60: SHIPROCKET_PASSWORD=your_password"
echo ""

echo "3️⃣  DATABASE SETUP (5 minutes)"
echo "   • Check running terminals for PostgreSQL setup"
echo "   • Enter your sudo password when prompted"
echo "   • OR run: bash setup-database.sh"
echo ""

echo "4️⃣  RAZORPAY - LIVE KEYS (Optional - can use test mode initially)"
echo "   • Sign up: https://razorpay.com"
echo "   • Complete KYC (takes 2-3 days)"
echo "   • Get live keys from dashboard"
echo "   • Update .env lines 46-48 with live keys"
echo ""

echo "5️⃣  PRINTROVE API (Optional)"
echo "   • Sign up: https://www.printrove.com"
echo "   • Request API access"
echo "   • Update .env line 123: PRINTROVE_API_TOKEN=your_token"
echo ""

echo ""
echo -e "${GREEN}📊 Configuration Status:${NC}"
echo "  ✅ JWT Secret: DONE"
echo "  ✅ Frontend Config: DONE"
echo "  ⚠️  Email Service: MANUAL NEEDED"
echo "  ⚠️  Shiprocket: MANUAL NEEDED"
echo "  ⚠️  Database: MANUAL NEEDED"
echo "  ⏭️  Razorpay Live: OPTIONAL (test mode works)"
echo "  ⏭️  Printrove: OPTIONAL"
echo ""

echo -e "${YELLOW}🚀 Minimum to Launch:${NC}"
echo "  Complete items 1, 2, and 3 above (50 minutes total)"
echo ""

echo -e "${GREEN}💡 Quick Commands:${NC}"
echo "  Test email:     node backend/scripts/test-email.js"
echo "  Setup database: bash setup-database.sh"
echo "  Start backend:  npm start"
echo "  Start frontend: cd frontend && npm run dev"
echo ""

echo "Need help? Check: /home/chetan-patil/.gemini/antigravity/brain/bf6cb19f-9026-48bb-b6a6-3c16e70b7df3/final_launch_checklist.md"
echo ""
