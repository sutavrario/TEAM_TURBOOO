#!/bin/bash

# VocalGuard Quick Setup Guide
# This script sets up and starts both frontend and backend for local development

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║        🎤 VocalGuard Frontend-Backend Connection Setup        ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Step 1: Check Python
echo "${YELLOW}[1/5]${NC} Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo "${RED}❌ Python 3 not found. Please install Python 3.9 or later.${NC}"
    exit 1
fi
echo "${GREEN}✓ Python found: $(python3 --version)${NC}"
echo ""

# Step 2: Setup Python venv
echo "${YELLOW}[2/5]${NC} Setting up Python virtual environment..."
if [ ! -d "$PROJECT_ROOT/.venv" ]; then
    python3 -m venv "$PROJECT_ROOT/.venv"
    echo "${GREEN}✓ Virtual environment created${NC}"
else
    echo "${GREEN}✓ Virtual environment already exists${NC}"
fi
source "$PROJECT_ROOT/.venv/bin/activate"
echo ""

# Step 3: Install Python dependencies
echo "${YELLOW}[3/5]${NC} Installing Python dependencies..."
pip install -q -r "$PROJECT_ROOT/requirements.txt"
echo "${GREEN}✓ Python dependencies installed${NC}"
echo ""

# Step 4: Check Node.js
echo "${YELLOW}[4/5]${NC} Checking Node.js installation..."
if ! command -v npm &> /dev/null; then
    echo "${RED}❌ Node.js/npm not found. Please install Node.js 16 or later.${NC}"
    exit 1
fi
echo "${GREEN}✓ Node.js found: $(node --version)${NC}"
echo ""

# Step 5: Install frontend dependencies
echo "${YELLOW}[5/5]${NC} Installing frontend dependencies..."
cd "$PROJECT_ROOT/frontend"
npm install -q
cd "$PROJECT_ROOT"
echo "${GREEN}✓ Frontend dependencies installed${NC}"
echo ""

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    ✅ Setup Complete!                         ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📋 Next Steps:"
echo ""
echo "Option A: Run both frontend and backend together"
echo "  ${GREEN}./start.sh${NC}"
echo ""
echo "Option B: Run backend and frontend separately (in different terminals)"
echo "  Terminal 1: ${GREEN}./start-backend.sh${NC}"
echo "  Terminal 2: ${GREEN}./start-frontend.sh${NC}"
echo ""
echo "Once running:"
echo "  🌐 Frontend:   ${GREEN}http://localhost:5173${NC}"
echo "  🔗 Backend:    ${GREEN}http://localhost:8000${NC}"
echo "  📚 API Docs:   ${GREEN}http://localhost:8000/docs${NC}"
echo "  🏥 Health:     ${GREEN}http://localhost:8000/api/health${NC}"
echo ""
echo "📖 For more details, see: FRONTEND_BACKEND_CONNECTION.md"
echo ""
