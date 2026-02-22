from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os
import src.config as config
import ollama  # <-- NEW: Import Ollama

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- PIPELINE 1: Fast Graph Data (100ms) ---
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

# --- PIPELINE 2: Slow LLM Advice (5 seconds) ---
@app.get("/api/advice")
def get_llm_advice():
    try:
        if not os.path.exists(config.LIVE_LOG_PATH):
            return {"advice": "Waiting for singer..."}
            
        df = pd.read_csv(config.LIVE_LOG_PATH)
        if df.empty:
            return {"advice": "Waiting for singer..."}
            
        # Get the absolute latest data point
        latest_data = df.iloc[-1]
        pitch = latest_data.get("Pitch_Hz", 0)
        strain = latest_data.get("Strain_Score", 0)
        status = "CRITICAL VOCAL STRAIN" if latest_data.get("Is_Anomaly", 1) == -1 else "HEALTHY"

        # The Prompt: Give the LLM strict rules so it answers quickly
        prompt = f"You are a vocal coach monitoring a live singer. Pitch: {pitch:.1f}Hz. Strain Score: {strain:.2f}. Status: {status}. Give exactly ONE short sentence (under 10 words) of actionable physical advice to help them right now. Do not use quotes."

        # Ask Ollama (phi3)
        response = ollama.chat(model='phi3', messages=[
            {'role': 'user', 'content': prompt}
        ])
        
        return {"advice": response['message']['content'].strip()}
        
    except Exception as e:
        return {"advice": "AI Coach is analyzing..."}