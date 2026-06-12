import os
import sys
import joblib
import numpy as np

# Add root to sys.path
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
if ROOT_DIR not in sys.path:
    sys.path.append(ROOT_DIR)

import ml.disease_prediction.train as trainer

MODEL_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "models"))

def load_models():
    scaler = joblib.load(os.path.join(MODEL_DIR, "scaler.pkl"))
    classes = joblib.load(os.path.join(MODEL_DIR, "classes.pkl"))
    models = {
        "random_forest": joblib.load(os.path.join(MODEL_DIR, "random_forest.pkl")),
        "xgboost": joblib.load(os.path.join(MODEL_DIR, "xgboost.pkl")),
        "logistic_regression": joblib.load(os.path.join(MODEL_DIR, "logistic_regression.pkl"))
    }
    return scaler, classes, models

def analyze_symptoms_score(symptoms):
    """
    Given a string or list of symptoms, calculate a simulated severity score 0-1
    """
    if not symptoms or symptoms == "None" or symptoms == "none":
        return 0.05
    
    symptoms_text = str(symptoms).lower()
    
    # Severe keywords
    critical_kw = ["chest pain", "breath", "fainting", "seizure", "vomiting blood", "weight loss", "paralysis", "coughing blood"]
    moderate_kw = ["fever", "nausea", "swelling", "fatigue", "dizziness", "polyuria", "thirst", "blurred", "joint pain", "headache"]
    
    score = 0.1
    for kw in critical_kw:
        if kw in symptoms_text:
            score += 0.35
    for kw in moderate_kw:
        if kw in symptoms_text:
            score += 0.15
            
    return min(1.0, round(score, 2))

def predict_disease(input_data, model_type="random_forest"):
    """
    input_data dictionary:
    {
        "age": 45,
        "bmi": 28.5,
        "blood_pressure": "140/90",
        "cholesterol": 240,
        "symptoms": "chest pain, severe fatigue"
    }
    """
    try:
        scaler, classes, models = load_models()
    except Exception:
        # If models are not built yet, build them on the fly
        trainer.train_models()
        scaler, classes, models = load_models()
        
    age = float(input_data.get("age", 30))
    bmi = float(input_data.get("bmi", 22.0))
    
    # parse blood pressure
    bp_str = input_data.get("blood_pressure", "120/80")
    try:
        sys_bp, dia_bp = map(float, bp_str.split("/"))
    except Exception:
        sys_bp, dia_bp = 120.0, 80.0
        
    cholesterol = float(input_data.get("cholesterol", 180))
    
    # parse symptoms
    symptoms = input_data.get("symptoms", "")
    symptoms_score = analyze_symptoms_score(symptoms)
    
    # Prepare feature array
    X_input = np.array([[age, bmi, sys_bp, dia_bp, cholesterol, symptoms_score]])
    X_scaled = scaler.transform(X_input)
    
    selected_model = models.get(model_type, models["random_forest"])
    
    # Predict probabilities
    probs = selected_model.predict_proba(X_scaled)[0]
    best_idx = np.argmax(probs)
    disease_prediction = classes[best_idx]
    
    # Calculate Risk Score (0 - 100%)
    if disease_prediction == "Healthy":
        risk_score = round(float(probs[best_idx]) * 15.0, 1)  # Low risk score if healthy
        severity_level = "Low"
    else:
        risk_score = round(float(probs[best_idx]) * 100.0, 1)
        if risk_score > 80:
            severity_level = "Critical"
        elif risk_score > 60:
            severity_level = "High"
        elif risk_score > 40:
            severity_level = "Moderate"
        else:
            severity_level = "Low"
            
    # Breakdown of probabilities across all diseases
    prob_breakdown = {classes[i]: round(float(probs[i]) * 100, 1) for i in range(len(classes))}
    
    return {
        "prediction": disease_prediction,
        "risk_score": risk_score,
        "severity_level": severity_level,
        "model_used": model_type,
        "symptoms_analyzed_score": symptoms_score,
        "probability_breakdown": prob_breakdown
    }

if __name__ == "__main__":
    sample = {
        "age": 68,
        "bmi": 32.1,
        "blood_pressure": "165/95",
        "cholesterol": 280,
        "symptoms": "chest pain and shortness of breath"
    }
    res = predict_disease(sample, "random_forest")
    print("Test Prediction:")
    print(res)
