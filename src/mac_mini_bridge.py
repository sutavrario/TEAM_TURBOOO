import serial
import requests
import time
import sounddevice as sd
import numpy as np

# --- CONFIG ---
ARDUINO_PORT = '/dev/cu.usbmodem11401'
API_URL = "http://127.0.0.1:8000/api/biometrics"

# --- 1. ARDUINO SETUP (For Heart Rate) ---
try:
    ser = serial.Serial(ARDUINO_PORT, 115200, timeout=1)
    print(f"✅ Arduino connected for Heart Rate")
except:
    print("⚠️ Arduino not found. Running Mic only mode.")
    ser = None

# --- 2. AUDIO SETUP (For Mac AUX) ---
def get_mic_strain():
    duration = 0.1  # 100ms chunks
    fs = 44100
    recording = sd.rec(int(duration * fs), samplerate=fs, channels=1)
    sd.wait()
    # Calculate Volume (RMS)
    volume = np.linalg.norm(recording) * 10 
    return min(1.0, volume) # Cap at 1.0

print("🎤 Mac Mic and Arduino Bridge Active...")

last_send_time = 0

while True:
    try:
        hr, spo2 = 0, 0
        
        # Read HR from Arduino if available
        if ser and ser.in_waiting > 0:
            line = ser.readline().decode('utf-8').strip()
            parts = line.split(',')
            if len(parts) == 3:
                _, hr, spo2 = map(int, parts)

        # Read Strain from Mac AUX Port
        strain = get_mic_strain()

        # Send to API every 0.3s
        if time.time() - last_send_time > 0.3:
            payload = {
                "hr": hr,
                "spo2": spo2,
                "strain": float(strain)
            }
            requests.post(API_URL, json=payload, timeout=1.0)
            
            status = "❤️" if hr > 0 else "☁️"
            print(f"{status} HR: {hr} | 🎙️ Mic Strain: {strain:.2f}")
            last_send_time = time.time()

    except Exception as e:
        print(f"Error: {e}")