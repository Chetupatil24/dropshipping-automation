#!/bin/bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
echo "Starting DropShipping Platform Locally..."

# Start Backend
echo "Starting Backend API..."
(cd "$ROOT_DIR/backend" && npm run dev) &
BACKEND_PID=$!

# Start Frontend
echo "Starting Frontend Shop..."
(cd "$ROOT_DIR/frontend" && npm run dev) &
FRONTEND_PID=$!

echo ""
echo "Everything is running!"
echo "- Frontend:  http://localhost:3000"
echo "- Backend:   http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop all services."

# Stop all on exit
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM
wait
