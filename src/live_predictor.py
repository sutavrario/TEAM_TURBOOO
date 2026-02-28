import joblib
import warnings
import pandas as pd

# Ignore annoying sklearn warnings about missing feature names
warnings.filterwarnings("ignore", category=UserWarning)

print("⏳ Waking up the AI Brain...")
# 1. Load the trained AI Model
try:
    model = joblib.load('vocal_health_ai_model.pkl')
    print("🧠 AI Brain successfully loaded and ready for live diagnostics!")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    exit()

def predict_health(hr, spo2, strain):
    # 2. Package the live data exactly how the AI expects it
    live_data = pd.DataFrame({
        'Heart Rate (BPM)': [hr],
        'SpO2 (%)': [spo2],
        'Vocal Strain Index': [strain]
    })
    
    # 3. Ask the AI to diagnose the singer!
    prediction = model.predict(live_data)[0]
    return prediction

# ==========================================
# 🎤 LIVE SIMULATION TEST
# ==========================================
if __name__ == "__main__":
    print("\n" + "="*40)
    print("🩺 VOCALGUARD LIVE DIAGNOSTICS")
    print("="*40)
    
    # We will eventually replace these with the live variables from your Arduino/Mic
    # But for now, let's test it with 3 different scenarios!
    
    scenarios = [
        {"name": "Resting/Good Technique", "hr": 85, "spo2": 98, "strain": 0.2},
        {"name": "Bad Breathing/Throat Singing", "hr": 105, "spo2": 93, "strain": 1.1},
        {"name": "Stage Panic/Exhaustion", "hr": 145, "spo2": 92, "strain": 1.4}
    ]
    
    for s in scenarios:
        diagnosis = predict_health(s['hr'], s['spo2'], s['strain'])
        print(f"\nScenario: {s['name']}")
        print(f"📊 Live Vitals -> HR: {s['hr']} | SpO2: {s['spo2']}% | Strain: {s['strain']}")
        print(f"🚨 AI DIAGNOSIS: {diagnosis}")
        
    print("\n" + "="*40)
