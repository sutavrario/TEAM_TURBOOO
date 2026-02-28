# 🎤 VocalGuard - Frontend & Backend Connection Guide

This document explains how the frontend and backend are connected and how to set everything up.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    VocalGuard System                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────┐         ┌──────────────────┐    │
│  │    Frontend      │         │     Backend      │    │
│  │  (React/Vite)    │────────▶│   (FastAPI)      │    │
│  │  Port 5173       │  HTTP   │   Port 8000      │    │
│  └──────────────────┘         └──────────────────┘    │
│         │                              │               │
│         │                              ├─▶ Auth0       │
│         │                              ├─▶ Firebase    │
│         │                              ├─▶ Gemini AI   │
│         │                              └─▶ Data Files  │
│         │                                              │
│         └─────────────▶ Auth0 (Login)                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Components

### Backend (Python + FastAPI)
- **Location**: `src/api.py`
- **Port**: 8000
- **Purpose**: 
  - Serve API endpoints for frontend
  - Handle authentication via Auth0
  - Connect to Firebase for data persistence
  - Generate AI coaching advice using Gemini
  - Process live biometric data

### Frontend (React + TypeScript + Vite)
- **Location**: `frontend/src/`
- **Port**: 5173
- **Purpose**:
  - Display dashboard with real-time graphs
  - Show AI coaching advice
  - Handle user authentication
  - Display biometric data

## API Endpoints

### Public Endpoints (No Auth Required)
- `GET /` - Health check
- `GET /api/health` - Detailed API health status

### Protected Endpoints (Require Auth0 Token)
- `GET /api/data` - Get live biometric data for graph
- `GET /api/advice` - Get AI coaching advice from Gemini
- `POST /api/biometrics` - Receive hardware sensor data

## Setup Instructions

### 1. Prerequisites
```bash
# Required:
- Python 3.9+
- Node.js 16+
- npm or yarn
- Auth0 account
- Firebase account
- Gemini API key
```

### 2. Backend Setup

```bash
# 1. Activate virtual environment (if not already)
source .venv/bin/activate

# 2. Install backend dependencies
pip install -r requirements.txt

# 3. Set up environment variables
# Copy .env.example to .env and fill in credentials
cp .env.example .env

# 4. Run backend
python -m src.api
# OR use the startup script
./start-backend.sh
```

### 3. Frontend Setup

```bash
# 1. Install frontend dependencies
cd frontend
npm install

# 2. Set up environment variables
# The file .env.local is already configured with defaults
# Update it if your backend runs on a different URL

# 3. Run frontend in development mode
npm run dev
# OR use the startup script from project root
./start-frontend.sh
```

### 4. Run Both Together

```bash
# From project root directory
./start.sh

# This will start:
# - Backend on http://localhost:8000
# - Frontend on http://localhost:5173
```

## Configuration Files

### Environment Variables

**Frontend** (`.env.local`):
```
VITE_API_URL=http://localhost:8000
VITE_AUTH0_DOMAIN=vocalguard-dev.us.auth0.com
VITE_AUTH0_CLIENT_ID=3OyUz30IO6bZYCiFB1JdeOz2tzseyjPk
VITE_AUTH0_AUDIENCE=https://vocalguard-api
```

**Backend** (`.env`):
```
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
AUTH0_DOMAIN=vocalguard-dev.us.auth0.com
API_AUDIENCE=https://vocalguard-api
GEMINI_API_KEY=your-gemini-api-key
FIREBASE_KEY_PATH=./firebase_key.json
FRONTEND_URL=http://localhost:5173
```

## How Frontend Communicates with Backend

### 1. API Client Service
The frontend uses a custom API client hook at `frontend/src/services/api.ts`:

```typescript
export const useApiClient = () => {
  const { getAccessTokenSilently } = useAuth0();
  
  const request = async (endpoint: string, options: RequestInit = {}) => {
    const token = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    return await response.json();
  };

  return {
    getLiveData: () => request('/api/data'),
    getAdvice: () => request('/api/advice'),
    sendBiometrics: (hr, spo2, strain) => request('/api/biometrics', {...}),
  };
};
```

### 2. Dashboard Integration
The dashboard component (`frontend/src/app/pages/DashboardPage.tsx`):
1. Gets the API client from the hook
2. Fetches data on component mount
3. Polls for new data every 2 seconds
4. Displays data and status to the user

### 3. Authentication Flow
1. User logs in via Auth0 on frontend
2. Auth0 returns access token
3. Frontend includes token in API requests
4. Backend validates token with Auth0
5. Backend returns data only if token is valid

## Testing the Connection

### 1. Check Backend is Running
```bash
curl http://localhost:8000/api/health
# Expected response: {"status": "healthy", ...}
```

### 2. Check Frontend Can Reach Backend
- Open http://localhost:5173
- Check browser console for any errors
- If you see a green "✓ Connected" status, connection works!

### 3. Test API Endpoints
```bash
# Get health status (no auth required)
curl http://localhost:8000/api/health

# View API documentation
# Visit http://localhost:8000/docs in your browser
```

## Troubleshooting

### Backend won't start
```bash
# Check if port 8000 is in use
lsof -i :8000

# Install missing dependencies
pip install -r requirements.txt

# Check if virtual environment is activated
source .venv/bin/activate
```

### Frontend won't connect to backend
1. Check if backend is running on port 8000
2. Verify `VITE_API_URL` in `.env.local` is correct
3. Check browser console for CORS errors
4. Verify Auth0 credentials are correct

### CORS errors
- Backend CORS is configured in `src/api.py`
- Frontend URL must be in `ALLOWED_ORIGINS`
- For development, all origins are allowed (*)

### Missing data in dashboard
1. Check if `live_concert_log.csv` exists in `data/processed/`
2. Verify backend can read the CSV file
3. Check backend logs for errors

## Development Workflow

### Making Changes to Backend
1. Edit files in `src/`
2. Backend auto-reloads due to `reload=True` in uvicorn
3. Frontend will automatically retry connection

### Making Changes to Frontend
1. Edit files in `frontend/src/`
2. Vite automatically hot-reloads changes
3. Check http://localhost:5173 in browser

### Testing Changes
1. Open browser DevTools (F12)
2. Check Network tab to see API calls
3. Check Console for errors
4. Use backend at http://localhost:8000/docs for interactive API testing

## Production Deployment

When deploying to production:

1. **Environment Variables**:
   - Use `.env` file with production credentials
   - Set `FRONTEND_URL` correctly
   - Update CORS origins to only allow your domain

2. **Build Frontend**:
   ```bash
   cd frontend
   npm run build
   # Creates optimized build in frontend/dist/
   ```

3. **Run Backend**:
   ```bash
   # Set reload=False for production
   # Use a production ASGI server like Gunicorn
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker src.api:app
   ```

## Next Steps

1. ✅ Ensure data files exist in `data/processed/live_concert_log.csv`
2. ✅ Test both servers are running with startup scripts
3. ✅ Verify frontend dashboard shows data from backend
4. ✅ Test Auth0 login flow
5. ✅ Test sending biometric data to `/api/biometrics`

## API Reference

See full API documentation at: **http://localhost:8000/docs** (when backend is running)

Interactive Swagger UI allows you to:
- View all endpoints
- Test endpoints with sample data
- See request/response formats
- Check status codes and error messages

---

**Questions?** Check the main README.md for more information about the VocalGuard project.
