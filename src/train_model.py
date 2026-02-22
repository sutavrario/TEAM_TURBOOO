import os
import glob
import numpy as np
import joblib
import librosa
from sklearn.ensemble import IsolationForest
import src.config as config
from src.feature_extractor import extract_features

def train():
    print(f"🔍 Looking for training audio in: {config.TRAINING_DATA_PATH}")
    audio_files = glob.glob(os.path.join(config.TRAINING_DATA_PATH, "*.wav"))
    
    if not audio_files:
        print("❌ No .wav files found! Please add studio recordings to data/raw_training/")
        return

    training_data = []

    for file in audio_files:
        print(f"🎵 Processing {os.path.basename(file)}...")
        try:
            # Load the full song
            y, sr = librosa.load(file, sr=config.SAMPLE_RATE)
            
            # Slice into 1-second chunks (just like the live system will see)
            # We skip the last incomplete chunk
            num_chunks = len(y) // config.CHUNK_SIZE
            
            for i in range(num_chunks):
                start = i * config.CHUNK_SIZE
                end = start + config.CHUNK_SIZE
                chunk = y[start:end]
                
                features = extract_features(chunk, sr)
                if features is not None:
                    training_data.append(features)
                    
        except Exception as e:
            print(f"⚠️ Error processing {file}: {e}")

    if not training_data:
        print("❌ No valid audio features extracted.")
        return

    # Convert to numpy array
    X_train = np.vstack(training_data)
    print(f"✅ Extracted {len(X_train)} valid samples.")

    # Train Model
    # contamination=0.05 means we assume 5% of the studio data might be 'noise' or 'imperfections'
    print("🧠 Training Isolation Forest...")
    clf = IsolationForest(n_estimators=100, contamination=0.05, random_state=42)
    clf.fit(X_train)

    # Save Model
    joblib.dump(clf, config.MODEL_PATH)
    print(f"🎉 Model saved to {config.MODEL_PATH}")

if __name__ == "__main__":
    train()