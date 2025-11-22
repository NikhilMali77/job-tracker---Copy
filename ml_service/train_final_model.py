# ml_service/train_real_model.py
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib

def main():
    # 1. Load your dataset
    try:
        dataset = pd.read_csv('recruitment_data.csv')
    except FileNotFoundError:
        print("Error: recruitment_data.csv not found.")
        print("Please make sure it's in the 'ml_service' folder.")
        return

    print(f"Loaded dataset with {len(dataset)} rows.")

    # 2. Define our 6 REAL Features (X) and Target (y)
    # These are all things the user knows about themselves.
    features = [
        'Age', 
        'Gender', 
        'EducationLevel', 
        'ExperienceYears', 
        'PreviousCompanies', 
        'DistanceFromCompany'
    ]
    target = 'HiringDecision'
    
    X = dataset[features]
    y = dataset[target]
    
    # 3. Split data for Evaluation
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)
    
    print(f"Training RandomForestClassifier on {len(X_train)} samples...")
    model = RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced')
    model.fit(X_train, y_train)
    
    # 4. Evaluate the model
    print("\n--- Model Evaluation (on 20% test data) ---")
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {accuracy * 100:.2f}%")
    print(classification_report(y_test, y_pred))
    
    # 5. Train the FINAL model on ALL data
    print("\nTraining final model on 100% of data...")
    final_model = RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced')
    final_model.fit(X, y)
    
    # 6. Save the final model
    model_filename = 'offer_predictor.pkl'
    joblib.dump(final_model, model_filename)
    print(f"\n✅ Final model (trained on real CSV data) saved as '{model_filename}'")

if __name__ == "__main__":
    main()