#!/bin/bash

# Dropshipping Automation - Quick Start Script

echo "🚀 Starting Dropshipping Automation Platform..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file. Please update it with your API keys."
    echo "   Then run this script again."
    exit 1
fi

# Run system health check
echo "🔍 Running system health check..."
echo ""
node scripts/check-system.js
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ System check failed. Please fix the issues above."
    exit 1
fi
echo ""

# Check if PostgreSQL is running
if ! pg_isready > /dev/null 2>&1; then
    echo "⚠️  PostgreSQL is not running. Please start PostgreSQL and try again."
    echo "   Ubuntu/Debian: sudo service postgresql start"
    echo "   macOS: brew services start postgresql"
    exit 1
fi

# Check if Redis is running
if ! redis-cli ping > /dev/null 2>&1; then
    echo "⚠️  Redis is not running. Please start Redis and try again."
    echo "   Ubuntu/Debian: sudo service redis-server start"
    echo "   macOS: brew services start redis"
    exit 1
fi

# Check if database exists
DB_NAME=$(grep DB_NAME .env | cut -d '=' -f2)
if ! psql -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo "📦 Creating database: $DB_NAME"
    createdb $DB_NAME
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing root dependencies..."
    npm install
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

if [ ! -d "admin-dashboard/node_modules" ]; then
    echo "📦 Installing admin dashboard dependencies..."
    cd admin-dashboard && npm install && cd ..
fi

echo ""
echo "✅ All checks passed!"
echo ""
echo "Starting services..."
echo ""

# Create logs directory
mkdir -p logs

# Function to kill processes on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all services..."
    kill $BACKEND_PID $WORKER_PID $FRONTEND_PID $ADMIN_PID 2>/dev/null
    exit
}

trap cleanup EXIT INT TERM

# Start backend
echo "🔧 Starting Backend API on http://localhost:5000"
npm run dev > logs/backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start worker
echo "⚙️  Starting Background Job Worker"
npm run jobs > logs/worker.log 2>&1 &
WORKER_PID=$!

# Wait a bit
sleep 2

# Start frontend
echo "🎨 Starting Customer Frontend on http://localhost:3000"
cd frontend
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Start admin dashboard
echo "🔐 Starting Admin Dashboard on http://localhost:3001"
cd admin-dashboard
npm run dev > ../logs/admin.log 2>&1 &
ADMIN_PID=$!
cd ..

echo ""
echo "✨ All services started successfully!"
echo ""
echo "📱 Access your applications:"
echo "   Customer Store:   http://localhost:3000"
echo "   Admin Dashboard:  http://localhost:3001"
echo "   Backend API:      http://localhost:5000"
echo "   API Health:       http://localhost:5000/health"
echo ""
echo "📋 Logs are being written to logs/ directory"
echo "   Backend:          tail -f logs/backend.log"
echo "   Worker:           tail -f logs/worker.log"
echo "   Frontend:         tail -f logs/frontend.log"
echo "   Admin:            tail -f logs/admin.log"
echo ""
echo "⚡ Quick Setup Steps:"
echo "   1. Update .env with your API keys (Razorpay, Shiprocket, etc.)"
echo "   2. Create admin user (see SETUP.md)"
echo "   3. Login to admin panel: http://localhost:3001"
echo "   4. Add suppliers and import products"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for any process to exit
wait
