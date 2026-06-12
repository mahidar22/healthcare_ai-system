import os
import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

MODEL_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "models"))
DATASET_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "datasets"))
os.makedirs(MODEL_DIR, exist_ok=True)
os.makedirs(DATASET_DIR, exist_ok=True)

# Disease map
DISEASES = ["Healthy", "Diabetes", "Heart Disease", "Kidney Disease", "Cancer Risk"]

def generate_synthetic_disease_data(n_samples=3000):
    np.random.seed(42)
    
    # We will generate synthetic profiles that strongly correlate with specific diseases
    data = []
    
    for _ in range(n_samples):
        # Pick target disease
        target_idx = np.random.choice([0, 1, 2, 3, 4], p=[0.25, 0.25, 0.2, 0.15, 0.15])
        disease = DISEASES[target_idx]
        
        if disease == "Healthy":
            age = np.random.randint(18, 45)
            bmi = np.random.uniform(18.5, 24.9)
            sys_bp = np.random.randint(100, 125)
            dia_bp = np.random.randint(60, 80)
            cholesterol = np.random.randint(140, 190)
            symptoms_score = np.random.uniform(0.0, 0.1)
        elif disease == "Diabetes":
            age = np.random.randint(35, 75)
            bmi = np.random.uniform(27.0, 40.0)
            sys_bp = np.random.randint(120, 160)
            dia_bp = np.random.randint(80, 95)
            cholesterol = np.random.randint(180, 260)
            symptoms_score = np.random.uniform(0.6, 0.9) # polyuria, polydipsia, fatigue
        elif disease == "Heart Disease":
            age = np.random.randint(50, 85)
            bmi = np.random.uniform(25.0, 38.0)
            sys_bp = np.random.randint(140, 185)
            dia_bp = np.random.randint(90, 115)
            cholesterol = np.random.randint(230, 320)
            symptoms_score = np.random.uniform(0.7, 1.0) # chest pain, shortness of breath
        elif disease == "Kidney Disease":
            age = np.random.randint(45, 80)
            bmi = np.random.uniform(22.0, 35.0)
            sys_bp = np.random.randint(130, 175)
            dia_bp = np.random.randint(85, 105)
            cholesterol = np.random.randint(200, 280)
            symptoms_score = np.random.uniform(0.6, 0.95) # swelling, nausea, fatigue
        elif disease == "Cancer Risk":
            age = np.random.randint(55, 85)
            bmi = np.random.uniform(17.0, 30.0)
            sys_bp = np.random.randint(110, 160)
            dia_bp = np.random.randint(70, 100)
            cholesterol = np.random.randint(160, 250)
            symptoms_score = np.random.uniform(0.75, 1.0) # unexplained weight loss, chronic chronic pain, nodules
            
        # Add a bit of noise
        age = max(18, min(90, int(age + np.random.normal(0, 3))))
        bmi = round(max(15.0, min(45.0, bmi + np.random.normal(0, 1.5))), 1)
        sys_bp = max(90, min(200, int(sys_bp + np.random.normal(0, 5))))
        dia_bp = max(50, min(120, int(dia_bp + np.random.normal(0, 4))))
        cholesterol = max(120, min(350, int(cholesterol + np.random.normal(0, 10))))
        symptoms_score = round(max(0.0, min(1.0, symptoms_score + np.random.normal(0, 0.05))), 2)
        
        data.append({
            "age": age,
            "bmi": bmi,
            "sys_bp": sys_bp,
            "dia_bp": dia_bp,
            "cholesterol": cholesterol,
            "symptoms_score": symptoms_score,
            "target": target_idx
        })
        
    df = pd.DataFrame(data)
    csv_path = os.path.join(DATASET_DIR, "synthetic_disease_dataset.csv")
    df.to_csv(csv_path, index=False)
    print(f"Synthetic disease dataset saved to {csv_path}")
    return df

def train_models():
    print("Loading synthetic dataset for training...")
    df = generate_synthetic_disease_data()
    
    X = df[["age", "bmi", "sys_bp", "dia_bp", "cholesterol", "symptoms_score"]]
    y = df["target"]
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Save scaler
    joblib.dump(scaler, os.path.join(MODEL_DIR, "scaler.pkl"))
    
    # 1. Random Forest
    rf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf.fit(X_train_scaled, y_train)
    rf_preds = rf.predict(X_test_scaled)
    print(f"Random Forest Accuracy: {accuracy_score(y_test, rf_preds):.4f}")
    joblib.dump(rf, os.path.join(MODEL_DIR, "random_forest.pkl"))
    
    # 2. XGBoost
    xgb = XGBClassifier(eval_metric='mlogloss', random_state=42)
    xgb.fit(X_train_scaled, y_train)
    xgb_preds = xgb.predict(X_test_scaled)
    print(f"XGBoost Accuracy: {accuracy_score(y_test, xgb_preds):.4f}")
    joblib.dump(xgb, os.path.join(MODEL_DIR, "xgboost.pkl"))
    
    # 3. Logistic Regression
    lr = LogisticRegression(max_iter=1000, multi_class='multinomial', random_state=42)
    lr.fit(X_train_scaled, y_train)
    lr_preds = lr.predict(X_test_scaled)
    print(f"Logistic Regression Accuracy: {accuracy_score(y_test, lr_preds):.4f}")
    joblib.dump(lr, os.path.join(MODEL_DIR, "logistic_regression.pkl"))
    
    # Save classes map
    joblib.dump(DISEASES, os.path.join(MODEL_DIR, "classes.pkl"))
    print("All Disease Prediction models trained and saved successfully!")

if __name__ == "__main__":
    train_models()
