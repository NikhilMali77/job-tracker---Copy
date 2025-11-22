# ml_service/app.py
from flask import Flask, request, jsonify
import joblib
import pandas as pd
import logging

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)

# Load the model trained on 'recruitment_data.csv'
try:
    model = joblib.load('offer_predictor.pkl')
    logging.info("Model loaded successfully.")
except FileNotFoundError:
    logging.error("Model file 'offer_predictor.pkl' not found!")
    logging.error("Please run 'train_real_model.py' first.")
    model = None

# --- THIS IS THE KEY CHANGE ---
# The model was trained on these 6 features
MODEL_FEATURES = [
    'Age', 
    'Gender', 
    'EducationLevel', 
    'ExperienceYears', 
    'PreviousCompanies', 
    'DistanceFromCompany'
]

@app.route('/api/ml/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not loaded, check server logs.'}), 500

    try:
        data = request.get_json()
        if data is None:
            return jsonify({'error': 'No JSON data received'}), 400
            
        logging.info(f"Received data: {data}")

        # --- UPDATED FEATURE PREPARATION ---
        # We extract all 6 features from the request.
        # We use .get() to provide a default (0) if any are missing.
        features_data = [
            data.get('age', 0),
            data.get('gender', 0),
            data.get('educationLevel', 0),
            data.get('experience', 0), # App sends 'experience'
            data.get('previousCompanies', 0),
            data.get('distanceFromCompany', 0)
        ]
        
        # Create a DataFrame with the correct column names
        # Note: 'experience' is renamed to 'ExperienceYears'
        df_features = {
            'Age': data.get('age', 0),
            'Gender': data.get('gender', 0),
            'EducationLevel': data.get('educationLevel', 0),
            'ExperienceYears': data.get('experience', 0), # Rename
            'PreviousCompanies': data.get('previousCompanies', 0),
            'DistanceFromCompany': data.get('distanceFromCompany', 0)
        }
        
        df = pd.DataFrame([df_features], columns=MODEL_FEATURES)
        
        # Get the probability [prob_no, prob_yes]
        probability = model.predict_proba(df)[0][1] # Get prob of class '1' (Hired)
        
        offer_prob_percent = round(probability * 100, 1)
        
        logging.info(f"Prediction: {offer_prob_percent}%")
        
        return jsonify({
            'offer_probability': offer_prob_percent
        })

    except Exception as e:
        logging.error(f"Error during prediction: {e}")
        return jsonify({'error': str(e)}), 400

@app.route('/', methods=['GET'])
def health_check():
    return "ML Service is alive and running."

if __name__ == '__main__':
    app.run(port=5001, debug=True)