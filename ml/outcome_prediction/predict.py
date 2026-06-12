import os
import sys
import joblib
import numpy as np

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
if ROOT_DIR not in sys.path:
    sys.path.append(ROOT_DIR)

import ml.outcome_prediction.train as trainer

MODEL_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "models"))

def load_outcome_models():
    scaler = joblib.load(os.path.join(MODEL_DIR, "outcome_scaler.pkl"))
    models = {
        "stay": joblib.load(os.path.join(MODEL_DIR, "model_stay.pkl")),
        "recovery": joblib.load(os.path.join(MODEL_DIR, "model_recovery.pkl")),
        "icu": joblib.load(os.path.join(MODEL_DIR, "model_icu.pkl")),
        "readmission": joblib.load(os.path.join(MODEL_DIR, "model_readmission.pkl"))
    }
    return scaler, models

def predict_patient_outcome(input_data):
    """
    input_data dictionary:
    {
        "age": 65,
        "bmi": 29.0,
        "chronic_count": 2,
        "severity": 7,  # 1-10
        "vital_stability": 0.6  # 0-1
    }
    """
    try:
        scaler, models = load_outcome_models()
    except Exception:
        trainer.train_outcome_models()
        scaler, models = load_outcome_models()
        
    age = float(input_data.get("age", 45))
    bmi = float(input_data.get("bmi", 24.0))
    chronic_count = int(input_data.get("chronic_count", 1))
    severity = int(input_data.get("severity", 4))
    vital_stability = float(input_data.get("vital_stability", 0.7))
    
    X_input = np.array([[age, bmi, chronic_count, severity, vital_stability]])
    X_scaled = scaler.transform(X_input)
    
    stay = max(1, int(round(models["stay"].predict(X_scaled)[0])))
    recovery = max(5.0, min(99.9, round(models["recovery"].predict(X_scaled)[0], 1)))
    icu = max(1.0, min(95.0, round(models["icu"].predict(X_scaled)[0], 1)))
    readmission = max(1.0, min(90.0, round(models["readmission"].predict(X_scaled)[0], 1)))
    
    return {
        "estimated_hospital_stay_days": stay,
        "recovery_probability_percent": recovery,
        "icu_risk_percent": icu,
        "readmission_risk_percent": readmission,
        "risk_summary": "High Care Required" if (icu > 50 or readmission > 40) else ("Moderate Care" if severity > 4 else "Stable Outpatient")
    }

if __name__ == "__main__":
    sample = {
        "age": 72,
        "bmi": 31.0,
        "chronic_count": 3,
        "severity": 8,
        "vital_stability": 0.3
    }
    print("Test Outcome Prediction:")
    print(predict_patient_outcome(sample))
