#!/bin/bash
echo "Starting DropShipping Platform Locally..."

# Start Backend
echo "Starting Backend API..."
cd backend && npm run dev &

# Start Frontend
echo "Starting Frontend Shop..."
cd frontend && npm run dev &

echo "Everything is running!"
echo "- Frontend: http://localhost:3000"
echo "- Backend: http://localhost:8080"
wait
