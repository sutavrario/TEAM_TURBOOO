import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

# 1. Load the upgraded 1000-row dataset
file_path = 'final_training_dataset.csv'

if not os.path.exists(file_path):
    print(f"❌ Error: Cannot find '{file_path}'. Make sure you ran the upgrade script!")
    exit()

print("🧠 Loading your medical data...")
df = pd.read_csv(file_path)

# 2. Define the Inputs (X) and the Output we want to predict (y)
X = df[['Heart Rate (BPM)', 'SpO2 (%)', 'Vocal Strain Index']]
y = df['Health Condition']

# 3. Split the data: 80% for training the AI, 20% for testing it like a final exam
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. Create the AI Brain
print("⚙️ Training the Random Forest AI Model. Please wait...")
model = RandomForestClassifier(n_estimators=100, random_state=42)

# 5. Train the Model! 
model.fit(X_train, y_train)

# 6. Test the Model's Accuracy
predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print(f"\n✅ Training Complete!")
print(f"🎯 AI Accuracy Score: {accuracy * 100:.2f}%")
print("\n📊 Detailed Report:")
print(classification_report(y_test, predictions))

# 7. Save the trained AI to a file
model_filename = 'vocal_health_ai_model.pkl'
joblib.dump(model, model_filename)
print(f"\n💾 Saved the trained AI brain as: {model_filename} in your main folder.")
