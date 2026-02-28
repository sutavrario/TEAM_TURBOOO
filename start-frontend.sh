#!/bin/bash

# VocalGuard Frontend Startup Script
# Starts only the frontend dev server on port 5173

echo "╔════════════════════════════════════════╗"
echo "║    🎨 VocalGuard Frontend Server      ║"
echo "╚════════════════════════════════════════╝"
echo ""

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

# Check if node_modules exists
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd "$FRONTEND_DIR"
    npm install
fi

cd "$FRONTEND_DIR"

echo ""
echo "🚀 Starting Frontend Server..."
echo "📱 Frontend URL: http://localhost:5173"
echo "🔗 Backend:      http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop"
echo ""

npm run dev
