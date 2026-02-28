#!/bin/bash

# VocalGuard Backend Startup Script
# Starts only the backend server on port 8000

echo "╔════════════════════════════════════════╗"
echo "║    🎤 VocalGuard Backend Server       ║"
echo "╚════════════════════════════════════════╝"
echo ""

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Activate virtual environment
if [ ! -d "$PROJECT_ROOT/.venv" ]; then
    echo "❌ Virtual environment not found."
    echo "📌 Please run: python3 -m venv .venv"
    exit 1
fi

source "$PROJECT_ROOT/.venv/bin/activate"

# Check if requirements are installed
if ! python -c "import fastapi" 2>/dev/null; then
    echo "📦 Installing dependencies..."
    pip install -r "$PROJECT_ROOT/requirements.txt"
fi

cd "$PROJECT_ROOT"

echo ""
echo "🚀 Starting Backend Server..."
echo "📡 Backend URL: http://localhost:8000"
echo "📚 API Docs:    http://localhost:8000/docs"
echo "🏥 Health:      http://localhost:8000/api/health"
echo ""

python -m src.api
