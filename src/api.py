from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt
import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd
import os
import requests
import datetime
from google import genai
import src.config as config
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="VocalGuard Backend API", version="1.0.0")

# ==========================================
# CORS Configuration for Frontend
# ==========================================
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    FRONTEND_URL,
    "*"  # For development - remove in production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# 1. INITIALIZE FIREBASE
# ==========================================
db = None  # Initialize as None, will be set if Firebase connects successfully
try:
    # Make sure firebase_key.json is in your main VocalGuard_Project folder
    cred = credentials.Certificate("firebase_key.json")
    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("🔥 Firebase successfully connected!")
except Exception as e:
    print(f"❌ Firebase Error: {e}")
    db = None

# ==========================================
# 2. INITIALIZE GEMINI 2.5 FLASH
# ==========================================
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyCFj3QShX1P_UsnbwkAL5_5ruDmEKSHMj0")
client = genai.Client(api_key=GEMINI_API_KEY)

# ==========================================
# 3. INITIALIZE AUTH0 BOUNCER
# ==========================================
security = HTTPBearer()
AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN", "vocalguard-dev.us.auth0.com")
API_AUDIENCE = os.getenv("API_AUDIENCE", "https://vocalguard-api")

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Auth0 Bouncer: Checks the VIP Wristband and gets the Singer's ID"""
    token = credentials.credentials
    try:
        jwks_url = f"https://{AUTH0_DOMAIN}/.well-known/jwks.json"
        jwks = requests.get(jwks_url).json()
        payload = jwt.decode(token, jwks, algorithms=["RS256"], audience=API_AUDIENCE, issuer=f"https://{AUTH0_DOMAIN}/")
        return payload["sub"] # Returns the secure User ID
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid Token: {e}")

# ==========================================
# HEALTH CHECK ENDPOINT
# ==========================================
@app.get("/")
def health_check():
    """Check if backend is running"""
    return {
        "status": "running",
        "message": "VocalGuard Backend API is healthy",
        "version": "1.0.0"
    }

@app.get("/api/health")
def api_health():
    """Check API health without authentication"""
    return {
        "status": "healthy",
        "backend_connected": True,
        "firebase": "connected" if db else "disconnected",
        "gemini": "available" if GEMINI_API_KEY else "missing"
    }

# ==========================================
# 4. PIPELINE 1: FAST GRAPH DATA (React Graph)
# ==========================================
@app.get("/api/data")
def get_live_data():
    try:
        if not os.path.exists(config.LIVE_LOG_PATH):
            return {"status": "waiting", "data": []}
            
        df = pd.read_csv(config.LIVE_LOG_PATH)
        if df.empty:
            return {"status": "waiting", "data": []}
            
        tail_df = df.tail(60).fillna(0)
        data = tail_df.to_dict(orient="records")
        return {"status": "active", "data": data}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# ==========================================
# 5. PIPELINE 2: GEMINI AI ADVICE (React AI Box)
# ==========================================
@app.get("/api/advice")
def get_llm_advice():
    try:
        if not os.path.exists(config.LIVE_LOG_PATH):
            return {"advice": "Waiting for singer..."}
            
        df = pd.read_csv(config.LIVE_LOG_PATH)
        if df.empty:
            return {"advice": "Waiting for singer..."}
            
        latest_data = df.iloc[-1]
        pitch = latest_data.get("Pitch_Hz", 0)
        strain = latest_data.get("Strain_Score", 0)
        status = "CRITICAL VOCAL STRAIN" if latest_data.get("Is_Anomaly", 1) == -1 else "HEALTHY"

        prompt = f"You are a vocal coach monitoring a live singer. Pitch: {pitch:.1f}Hz. Strain Score: {strain:.2f}. Status: {status}. Give exactly ONE short sentence (under 10 words) of actionable physical advice to help them right now. Do not use quotes."

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        return {"advice": response.text.strip()}
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return {"advice": "AI Coach is analyzing..."}

# ==========================================
# 6. PIPELINE 3: HARDWARE INPUT (Arduino/Mic)
# ==========================================
@app.post("/api/biometrics")
async def receive_biometrics(data: dict):
    """The 'Mailbox' for your Arduino data."""
    try:
        # 1. Print to Terminal 1 so you can see it's working
        print(f"📥 Received from Arduino: {data}")

        # 2. Save to Firebase (Current session log) - only if Firebase is connected
        if db:
            db.collection("live_sessions").add({
                "strain": data.get("strain", 0),
                "hr": data.get("hr", 0),
                "spo2": data.get("spo2", 0),
                "timestamp": firestore.SERVER_TIMESTAMP
            })
        else:
            print("⚠️ Firebase not connected - biometrics received but not saved")

        return {"status": "success", "received": data}
    except Exception as e:
        print(f"❌ API Save Error: {e}")
        return {"status": "error", "message": str(e)}

# ==========================================
# MAIN ENTRY POINT
# ==========================================
if __name__ == "__main__":
    import uvicorn
    
    backend_host = os.getenv("BACKEND_HOST", "0.0.0.0")
    backend_port = int(os.getenv("BACKEND_PORT", 8000))
    
    print(f"""
    ╔════════════════════════════════════════╗
    ║    🎤 VocalGuard Backend Starting...   ║
    ╚════════════════════════════════════════╝
    
    📡 Backend URL: http://localhost:{backend_port}
    📊 Health Check: http://localhost:{backend_port}/api/health
    📚 API Docs: http://localhost:{backend_port}/docs
    
    """)
    
    uvicorn.run(
        "src.api:app",
        host=backend_host,
        port=backend_port,
        reload=True
    )