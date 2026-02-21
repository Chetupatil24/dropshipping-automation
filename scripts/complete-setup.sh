#!/bin/bash
# Complete Ruthan Setup - One Command
# This script sets up everything needed to run Ruthan - The Shopping Spot

set -e  # Exit on any error

echo "🚀 Setting up Ruthan - The Shopping Spot"
echo "========================================="
echo ""

# Step 1: Database Setup
echo "Step 1/3: Setting up PostgreSQL database..."
echo "You may be asked for your sudo password."
echo ""

# Check if database already exists
DB_EXISTS=$(sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -w dropshipping_db | wc -l)

if [ $DB_EXISTS -eq 0 ]; then
    echo "Creating database..."
    sudo -u postgres psql <<EOF
CREATE DATABASE dropshipping_db;
CREATE USER "chetan-patil" WITH PASSWORD 'ruthan2026';
GRANT ALL PRIVILEGES ON DATABASE dropshipping_db TO "chetan-patil";
\c dropshipping_db
GRANT ALL ON SCHEMA public TO "chetan-patil";
EOF
    echo "✅ Database created successfully!"
else
    echo "✅ Database already exists!"
fi

echo ""
echo "Step 2/3: Installing dependencies..."
cd /home/chetan-patil/myprojects/dropshipping-automation/backend

if [ ! -d "node_modules" ]; then
    npm install
    echo "✅ Dependencies installed!"
else
    echo "✅ Dependencies already installed!"
fi

echo ""
echo "Step 3/3: Loading sample products..."
node scripts/seed-products.js

echo ""
echo "========================================="
echo "🎉 SETUP COMPLETE!"
echo "========================================="
echo ""
echo "Your Ruthan - The Shopping Spot platform is ready!"
echo ""
echo "📊 What's been set up:"
echo "  ✅ PostgreSQL database (dropshipping_db)"
echo "  ✅ 10 sample products loaded"
echo "  ✅ All backend dependencies installed"
echo ""
echo "🚀 To start your backend:"
echo "  cd backend && npm run dev"
echo ""
echo "🌐 To access your site:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:5000"
echo ""
echo "📦 Products loaded:"
echo "  - Premium Cotton T-Shirt (₹599)"
echo "  - Running Shoes (₹1,999)"
echo "  - Wireless Earbuds (₹2,499)"
echo "  - Women's Kurti (₹799)"
echo "  - Smart Watch (₹3,499)"
echo "  - Laptop Backpack (₹1,299)"
echo "  - Denim Jeans (₹1,199)"
echo "  - Yoga Mat (₹699)"
echo "  - Water Bottle (₹499)"
echo "  - Sunglasses (₹899)"
echo ""
echo "Total catalog value: ₹12,489"
echo ""
echo "✨ Happy selling! ✨"
