# 🚀 VocalGuard - Get Started in 2 Minutes

## Quick Start

### First Time Only
```bash
./setup.sh
```

### Start Everything
```bash
./start.sh
```

Then open:
- **Frontend**: http://localhost:5173
- **Backend API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/api/health

## Alternative: Run Separately

### Terminal 1 - Backend
```bash
./start-backend.sh
```

### Terminal 2 - Frontend
```bash
./start-frontend.sh
```

## What Got Connected?

✅ **Frontend** (Port 5173)
- React dashboard displays real-time data
- Fetches data from backend every 2 seconds
- Shows AI coaching advice

✅ **Backend** (Port 8000)  
- FastAPI server with Auth0 authentication
- Serves live biometric data from CSV
- Generates AI advice using Gemini
- Exposes API documentation at `/docs`

✅ **Authentication**
- Auth0 login on frontend
- Tokens sent with all API requests
- Backend validates tokens

## Project Files Modified

| File | Changes |
|------|---------|
| `src/api.py` | Added env vars, health checks, CORS |
| `frontend/src/main.tsx` | Vite env vars, Auth0 config |
| `frontend/src/services/api.ts` | Vite env var support |
| `frontend/src/app/pages/DashboardPage.tsx` | ✨ Full API integration |
| `requirements.txt` | Added FastAPI, Firebase, Gemini |

## New Files Created

| File | Purpose |
|------|---------|
| `start.sh` | Run both servers together |
| `start-backend.sh` | Run backend only |
| `start-frontend.sh` | Run frontend only |
| `setup.sh` | Install all dependencies |
| `frontend/.env.local` | Frontend config |
| `frontend/.env.example` | Frontend config template |
| `.env.example` | Backend config template |
| `FRONTEND_BACKEND_CONNECTION.md` | Full technical guide |
| `CONNECTION_SUMMARY.md` | Detailed change log |

## Environment Variables

Frontend (`.env.local` - already configured):
```
VITE_API_URL=http://localhost:8000
VITE_AUTH0_DOMAIN=vocalguard-dev.us.auth0.com
VITE_AUTH0_CLIENT_ID=3OyUz30IO6bZYCiFB1JdeOz2tzseyjPk
VITE_AUTH0_AUDIENCE=https://vocalguard-api
```

Backend (optional `.env` - has defaults):
```
BACKEND_PORT=8000
AUTH0_DOMAIN=vocalguard-dev.us.auth0.com
GEMINI_API_KEY=your-key
```

## Verify Connection

### Test Backend is Running
```bash
curl http://localhost:8000/api/health
```

Should return:
```json
{"status": "healthy", "backend_connected": true, ...}
```

### Test Frontend Can Reach Backend
1. Open http://localhost:5173
2. Login with Auth0
3. See data on dashboard = ✅ Connected!

## Common Issues

### Port Already in Use
```bash
# Kill process on port 8000
lsof -i :8000 | grep -v COMMAND | awk '{print $2}' | xargs kill -9

# Kill process on port 5173
lsof -i :5173 | grep -v COMMAND | awk '{print $2}' | xargs kill -9
```

### Missing Dependencies
```bash
# Backend
pip install -r requirements.txt

# Frontend
cd frontend && npm install
```

### No Data on Dashboard
1. Check if `data/processed/live_concert_log.csv` exists
2. Check backend logs for errors
3. Verify Auth0 login worked
4. Visit http://localhost:8000/docs to test API manually

## API Endpoints

- `GET /` - Server is running
- `GET /api/health` - Detailed health status  
- `GET /api/data` - Live biometric data (requires Auth0)
- `GET /api/advice` - AI coaching advice (requires Auth0)
- `POST /api/biometrics` - Send hardware sensor data

## Full Documentation

For detailed information, see:
- **FRONTEND_BACKEND_CONNECTION.md** - Complete technical guide
- **CONNECTION_SUMMARY.md** - All changes made

## Next Steps

1. Run `./setup.sh` to install dependencies
2. Run `./start.sh` to start both servers
3. Open http://localhost:5173 and login
4. Dashboard should show live data and AI advice
5. Check http://localhost:8000/docs for interactive API testing

---

**That's it!** Frontend and backend are fully connected and ready to use. 🎉

Need help? Check the full guides in the documentation files above.
