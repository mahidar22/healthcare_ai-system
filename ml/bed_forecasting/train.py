import os
import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler

MODEL_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "models"))
DATASET_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "datasets"))
os.makedirs(MODEL_DIR, exist_ok=True)
os.makedirs(DATASET_DIR, exist_ok=True)

def generate_bed_time_series():
    np.random.seed(42)
    days = 365
    dates = pd.date_range(start="2025-06-01", periods=days, freq="D")
    
    # Base occupancy with weekly and seasonal trends
    day_of_week = dates.dayofweek
    month = dates.month
    
    # Flu season in winter (months 11, 12, 1, 2)
    seasonal_boost = np.where(month.isin([11, 12, 1, 2]), 15, 0)
    # Weekend drop
    weekly_boost = np.where(day_of_week.isin([5, 6]), -5, 5)
    
    ward_occupancy = 20 + seasonal_boost + weekly_boost + np.random.normal(0, 3, days)
    ward_occupancy = np.clip(ward_occupancy, 10, 35).astype(int)
    
    icu_occupancy = 3 + (seasonal_boost * 0.3) + (weekly_boost * 0.1) + np.random.normal(0, 1.5, days)
    icu_occupancy = np.clip(icu_occupancy, 1, 10).astype(int)
    
    df = pd.DataFrame({
        "date": dates,
        "day_of_week": day_of_week,
        "month": month,
        "ward_occupancy": ward_occupancy,
        "icu_occupancy": icu_occupancy
    })
    
    csv_path = os.path.join(DATASET_DIR, "historical_bed_occupancy.csv")
    df.to_csv(csv_path, index=False)
    print(f"Historical bed occupancy saved to {csv_path}")
    return df

def train_bed_forecaster():
    df = generate_bed_time_series()
    
    X = df[["day_of_week", "month"]]
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    joblib.dump(scaler, os.path.join(MODEL_DIR, "bed_scaler.pkl"))
    
    # Train forecasters
    rf_ward = RandomForestRegressor(n_estimators=50, random_state=42)
    rf_ward.fit(X_scaled, df["ward_occupancy"])
    joblib.dump(rf_ward, os.path.join(MODEL_DIR, "forecaster_ward.pkl"))
    
    rf_icu = RandomForestRegressor(n_estimators=50, random_state=42)
    rf_icu.fit(X_scaled, df["icu_occupancy"])
    joblib.dump(rf_icu, os.path.join(MODEL_DIR, "forecaster_icu.pkl"))
    
    print("Bed Forecasting models trained and saved successfully!")

if __name__ == "__main__":
    train_bed_forecaster()
