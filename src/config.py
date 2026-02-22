import os

# --- AUDIO SETTINGS (UPDATED FOR HIGH FPS) ---
SAMPLE_RATE = 22050  # Standard for music analysis

# CHANGED: Reduced from 1.0 to 0.05 for ~20 updates per second
# This creates the "smooth" real-time effect on the graph.
CHUNK_DURATION = 0.05 
CHUNK_SIZE = int(SAMPLE_RATE * CHUNK_DURATION) # Samples per chunk

# --- THRESHOLDS ---
SILENCE_THRESHOLD = 0.002 # Ignore audio quieter than this (0.0 to 1.0)
PITCH_MIN = 50.0   # Minimum Hz (Human voice)
PITCH_MAX = 2000.0 # Maximum Hz

# --- PATHS ---
# We use absolute paths relative to this config file to avoid "File Not Found" errors
BASE_DIR = os.path.dirname(os.path.abspath(__file__)) # src/
PROJECT_ROOT = os.path.dirname(BASE_DIR)              # VocalGuard_Project/

DATA_DIR = os.path.join(PROJECT_ROOT, "data")
TRAINING_DATA_PATH = os.path.join(DATA_DIR, "raw_training")
LIVE_LOG_PATH = os.path.join(DATA_DIR, "processed", "live_concert_log.csv")
MODEL_PATH = os.path.join(PROJECT_ROOT, "models", "singer_profile.pkl")

# Create directories if they don't exist
os.makedirs(TRAINING_DATA_PATH, exist_ok=True)
os.makedirs(os.path.dirname(LIVE_LOG_PATH), exist_ok=True)
os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)