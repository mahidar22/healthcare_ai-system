import os
import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

MODEL_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "models"))
DATASET_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "datasets"))
os.makedirs(MODEL_DIR, exist_ok=True)
os.makedirs(DATASET_DIR, exist_ok=True)

def generate_outcome_data(n_samples=2500):
    np.random.seed(42)
    
    data = []
    for _ in range(n_samples):
        age = np.random.randint(18, 90)
        bmi = round(np.random.uniform(18.5, 42.0), 1)
        chronic_count = np.random.randint(0, 5)
        severity = np.random.randint(1, 10) # 1 mild, 10 critical
        vital_stability = round(np.random.uniform(0.1, 1.0), 2)
        
        # Calculate outcomes
        # 1. Hospital stay (days)
        base_stay = 2 + (severity * 1.5) + (chronic_count * 1.2) + (age / 15.0) - (vital_stability * 3)
        hospital_stay = max(1, min(45, int(base_stay + np.random.normal(0, 2))))
        
        # 2. Recovery Probability (0-100)
        base_rec = 95 - (severity * 5) - (chronic_count * 4) - (age / 4.0) + (vital_stability * 15)
        recovery_prob = max(10.0, min(99.0, round(base_rec + np.random.normal(0, 3), 1)))
        
        # 3. ICU Risk (0-100)
        base_icu = (severity * 8) + (chronic_count * 6) + (age / 5.0) - (vital_stability * 20)
        icu_risk = max(1.0, min(95.0, round(base_icu + np.random.normal(0, 5), 1)))
        
        # 4. Readmission Risk (0-100)
        base_readm = 5 + (chronic_count * 8) + (severity * 3) + (age / 6.0) - (vital_stability * 10)
        readmission_risk = max(2.0, min(85.0, round(base_readm + np.random.normal(0, 4), 1)))
        
        data.append({
            "age": age,
            "bmi": bmi,
            "chronic_count": chronic_count,
            "severity": severity,
            "vital_stability": vital_stability,
            "hospital_stay": hospital_stay,
            "recovery_prob": recovery_prob,
            "icu_risk": icu_risk,
            "readmission_risk": readmission_risk
        })
        
    df = pd.DataFrame(data)
    csv_path = os.path.join(DATASET_DIR, "synthetic_outcomes.csv")
    df.to_csv(csv_path, index=False)
    print(f"Synthetic outcome dataset saved to {csv_path}")
    return df

def train_outcome_models():
    df = generate_outcome_data()
    
    X = df[["age", "bmi", "chronic_count", "severity", "vital_stability"]]
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    joblib.dump(scaler, os.path.join(MODEL_DIR, "outcome_scaler.pkl"))
    
    # Train 4 independent Random Forest Regressors
    # 1. Hospital Stay
    rf_stay = RandomForestRegressor(n_estimators=100, random_state=42)
    rf_stay.fit(X_scaled, df["hospital_stay"])
    joblib.dump(rf_stay, os.path.join(MODEL_DIR, "model_stay.pkl"))
    
    # 2. Recovery Prob
    rf_rec = RandomForestRegressor(n_estimators=100, random_state=42)
    rf_rec.fit(X_scaled, df["recovery_prob"])
    joblib.dump(rf_rec, os.path.join(MODEL_DIR, "model_recovery.pkl"))
    
    # 3. ICU Risk
    rf_icu = RandomForestRegressor(n_estimators=100, random_state=42)
    rf_icu.fit(X_scaled, df["icu_risk"])
    joblib.dump(rf_icu, os.path.join(MODEL_DIR, "model_icu.pkl"))
    
    # 4. Readmission Risk
    rf_readm = RandomForestRegressor(n_estimators=100, random_state=42)
    rf_readm.fit(X_scaled, df["readmission_risk"])
    joblib.dump(rf_readm, os.path.join(MODEL_DIR, "model_readmission.pkl"))
    
    print("All Patient Outcome models trained and saved successfully!")

if __name__ == "__main__":
    train_outcome_models()
