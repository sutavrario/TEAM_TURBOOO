import pyaudio
import numpy as np
import joblib
import csv
import time
import os
import src.config as config
from src.feature_extractor import extract_features

def start_monitoring():
    # 1. Load Model
    if not os.path.exists(config.MODEL_PATH):
        print("❌ Model not found! Run src/train_model.py first.")
        return
    
    clf = joblib.load(config.MODEL_PATH)
    print("✅ Singer Profile Loaded.")

    # 2. Setup CSV Logger
    # We overwrite the file every new session
    with open(config.LIVE_LOG_PATH, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(["Timestamp", "Strain_Score", "Pitch_Hz", "Is_Anomaly"])

    # 3. Setup Audio Stream
    p = pyaudio.PyAudio()
    stream = p.open(format=pyaudio.paFloat32,
                    channels=1,
                    rate=config.SAMPLE_RATE,
                    input=True,
                    frames_per_buffer=config.CHUNK_SIZE)

    print(f"🎤 Listening... (Press Ctrl+C to stop)")
    print(f"📁 Logging to: {config.LIVE_LOG_PATH}")

    try:
        while True:
            # Read Raw Data
            data = stream.read(config.CHUNK_SIZE, exception_on_overflow=False)
            audio_chunk = np.frombuffer(data, dtype=np.float32)

            # Extract Features
            features = extract_features(audio_chunk)

            if features is not None:
                # Reshape for sklearn (1 sample, 3 features)
                features_reshaped = features.reshape(1, -1)
                
                # Predict
                # 1 = Normal, -1 = Anomaly
                prediction = clf.predict(features_reshaped)[0]
                
                # Score (Negative values are anomalies, Positive are normal)
                # The lower the score, the more "abnormal" (strained) it is
                score = clf.score_samples(features_reshaped)[0]
                
                pitch = features[0]

                # Log to CSV
                with open(config.LIVE_LOG_PATH, 'a', newline='') as f:
                    writer = csv.writer(f)
                    writer.writerow([time.time(), score, pitch, prediction])
                
                # Simple Console Output
                status = "✅ Normal" if prediction == 1 else "⚠️ STRAIN"
                print(f"Pitch: {int(pitch)}Hz | Score: {score:.2f} | {status}")

    except KeyboardInterrupt:
        print("\n🛑 Monitoring Stopped.")
        stream.stop_stream()
        stream.close()
        p.terminate()

if __name__ == "__main__":
    start_monitoring()