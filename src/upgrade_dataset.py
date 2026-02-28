import pandas as pd
import numpy as np
import os

# 1. Define the path to your dataset (since it's in the main folder)
# We use os.path to make sure it works perfectly on your Mac
file_path = 'synthetic_spo2_hr_1000.csv'

if not os.path.exists(file_path):
    print(f"❌ Error: Cannot find '{file_path}'. Make sure it is in the main VocalGuard_Project folder!")
    exit()

print("✅ Found the dataset! Upgrading now...")

# 2. Load the dataset
df = pd.read_csv(file_path)

# 3. Add a synthetic Vocal Strain Index (Random values between 0.0 and 1.5)
np.random.seed(42)
df['Vocal Strain Index'] = np.random.uniform(0.0, 1.5, size=len(df)).round(2)

# 4. Create the Medical Rules (The Health Matrix)
def determine_health(row):
    hr = row['Heart Rate (BPM)']
    spo2 = row['SpO2 (%)']
    strain = row['Vocal Strain Index']
    
    if hr > 130 and spo2 >= 97 and strain > 1.0:
        return "CRITICAL TENSION (Panic)"
    elif hr > 140 and spo2 <= 94:
        return "PHYSICAL EXHAUSTION"
    elif spo2 <= 94 and strain > 0.8:
        return "POOR BREATH SUPPORT"
    elif hr <= 110 and spo2 >= 96 and strain <= 0.5:
        return "OPTIMAL / HEALTHY"
    else:
        return "MODERATE FATIGUE"

# 5. Apply the rules to create your Labels
df['Health Condition'] = df.apply(determine_health, axis=1)

# 6. Save the new, perfect dataset!
output_name = 'final_training_dataset.csv'
df.to_csv(output_name, index=False)

print(f"🎉 Success! Your new labeled dataset is saved as: {output_name}")
print(df.head(5).to_string())