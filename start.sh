#!/bin/bash

# VocalGuard - Full Stack Startup Script
# This script starts both the backend and frontend servers

echo "╔════════════════════════════════════════╗"
echo "║    🎤 VocalGuard Full Stack Startup   ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check if virtual environment exists
if [ ! -d "$PROJECT_ROOT/.venv" ]; then
    echo "❌ Virtual environment not found."
    echo "📌 Please run: python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt"
    exit 1
fi

# Activate virtual environment
echo "🔄 Activating Python virtual environment..."
source "$PROJECT_ROOT/.venv/bin/activate"

# Install backend requirements if needed
if [ ! -d "$PROJECT_ROOT/.venv/lib/python3.11/site-packages/fastapi" ]; then
    echo "📦 Installing backend dependencies..."
    pip install -r "$PROJECT_ROOT/requirements.txt"
fi

# Check if node_modules exists
if [ ! -d "$PROJECT_ROOT/frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd "$PROJECT_ROOT/frontend"
    npm install
    cd "$PROJECT_ROOT"
fi

echo ""
echo "╔════════════════════════════════════════╗"
echo "║    Starting Services...                ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Create a named pipe for cleanup
cleanup() {
    echo ""
    echo "🛑 Shutting down VocalGuard..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start backend in background
echo "🚀 Starting Backend Server (Port 8000)..."
cd "$PROJECT_ROOT"
python -m src.api &
BACKEND_PID=$!

# Wait for backend to start
sleep 2

# Start frontend in background
echo "🚀 Starting Frontend Server (Port 5173)..."
cd "$PROJECT_ROOT/frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "╔════════════════════════════════════════╗"
echo "║    ✅ Services Started                 ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "📱 Frontend:   http://localhost:5173"
echo "🔗 Backend:    http://localhost:8000"
echo "📚 API Docs:   http://localhost:8000/docs"
echo "🏥 Health:     http://localhost:8000/api/health"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
