import serial
import requests
import time
import sounddevice as sd
import numpy as np

# --- CONFIGURATION ---
ARDUINO_PORT = '/dev/cu.usbmodem11401'
API_URL = "http://127.0.0.1:8000/api/biometrics"
SEND_INTERVAL = 4.0  # 4-second data window

# --- INITIALIZE SERIAL (Arduino) ---
ser = None
try:
    # Short timeout (0.1) is CRITICAL so it doesn't lag the audio recording
    ser = serial.Serial(ARDUINO_PORT, 115200, timeout=0.1)
    time.sleep(2) 
    print(f"✅ Arduino (HR/O2) Connected on {ARDUINO_PORT}")
except Exception as e:
    print(f"⚠️ Arduino NOT found. Pulse/O2 will be 0. Error: {e}")

def get_biometrics_and_mic():
    """Records audio from Mac AUX for 4s and fetches latest Arduino data."""
    fs = 44100
    # 1. Start background audio recording from Mac AUX
    recording = sd.rec(int(SEND_INTERVAL * fs), samplerate=fs, channels=1)
    
    latest_hr = 0
    latest_spo2 = 0
    end_time = time.time() + SEND_INTERVAL
    
    # 2. While Mac records audio, constantly 'sniff' the Arduino Serial port
    while time.time() < end_time:
        if ser and ser.in_waiting > 0:
            try:
                # Flush the buffer to get the absolute freshest line
                lines = ser.readlines() 
                if lines:
                    last_line = lines[-1].decode('utf-8', errors='ignore').strip()
                    parts = last_line.split(',')
                    
                    if len(parts) == 3:
                        # parts[0]=Arduino Mic (Ignore), parts[1]=HR, parts[2]=O2
                        hr_val = int(parts[1])
                        spo2_val = int(parts[2])
                        
                        # Update our local variables with the latest non-zero values
                        if spo2_val > 0: latest_spo2 = spo2_val
                        if hr_val > 0: latest_hr = hr_val
            except Exception:
                pass 
        
        # Micro-sleep to keep the CPU cool while waiting for the 4s to end
        time.sleep(0.1)

    sd.wait() # Ensure the 4s recording is finished
    
    # 3. Calculate Vocal Strain from the Mac AUX recording
    # We use RMS (Root Mean Square) to find the average loudness
    volume = np.sqrt(np.mean(recording**2))
    # Multiplier of 120.0 for high sensitivity on Mac AUX
    strain = min(1.0, volume * 120.0)
    
    return latest_hr, latest_spo2, strain

print(f"🚀 VocalGuard Hybrid Bridge Active!")
print(f"🎙️ Mic: Mac AUX Port | 📡 Biometrics: Arduino USB")

# --- MAIN LOOP ---
while True:
    try:
        # Capture the 4-second snapshot
        hr, o2, strain = get_biometrics_and_mic()

        payload = {
            "hr": hr,
            "spo2": o2,
            "strain": float(round(strain, 2))
        }

        # Send to FastAPI (Terminal 1)
        response = requests.post(API_URL, json=payload, timeout=5.0)
        
        # Status Logic
        status_icon = "❤️" if (hr > 0) else "☁️ (Calculating...)"
        
        print("\n" + "—"*40)
        print(f"📊 4-SECOND SESSION SUMMARY")
        print(f"  Vocal Strain : {strain:.2f} (from Mac AUX)")
        print(f"  Heart Rate   : {hr if hr > 0 else 'Waiting...'} BPM {status_icon}")
        print(f"  Oxygen (O2)  : {o2}%")
        print(f"  Cloud Sync   : {response.status_code} OK")
        print("—"*40)

    except Exception as e:
        print(f"⚠️ Bridge Error: {e}")