import numpy as np
import librosa
import src.config as config

def extract_features(audio_chunk, sr=config.SAMPLE_RATE):
    """
    Analyzes an audio chunk and returns [Pitch, Roughness, Strain_Indicator]
    Returns None if the chunk is silence or invalid.
    """
    
    # 1. Check for Silence (Root Mean Square Energy)
    rms = np.sqrt(np.mean(audio_chunk**2))
    if rms < config.SILENCE_THRESHOLD:
        return None

    # 2. Extract Pitch (Fundamental Frequency - F0)
    # Yin algorithm is robust for pitch detection
    f0 = librosa.yin(audio_chunk, fmin=config.PITCH_MIN, fmax=config.PITCH_MAX, sr=sr)
    f0 = f0[~np.isnan(f0)] # Remove 'Not a Number' errors
    
    if len(f0) == 0:
        return None

    avg_pitch = np.mean(f0)

    # 3. Extract Spectral Flatness (Roughness)
    # A value closer to 1.0 means "White Noise" (very rough/raspy)
    # A value closer to 0.0 means "Pure Tone" (clean singing)
    flatness = np.mean(librosa.feature.spectral_flatness(y=audio_chunk))

    # 4. Extract Zero Crossing Rate (Breathiness/High Frequency Noise)
    # High ZCR can indicate vocal frying or straining
    zcr = np.mean(librosa.feature.zero_crossing_rate(audio_chunk))

    # Return the feature vector
    # Shape must be (1, 3) for the model
    return np.array([avg_pitch, flatness, zcr])