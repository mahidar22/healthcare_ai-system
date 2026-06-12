import os
import sys
import joblib
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
if ROOT_DIR not in sys.path:
    sys.path.append(ROOT_DIR)

import ml.bed_forecasting.train as trainer

MODEL_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "models"))

def load_bed_models():
    scaler = joblib.load(os.path.join(MODEL_DIR, "bed_scaler.pkl"))
    models = {
        "ward": joblib.load(os.path.join(MODEL_DIR, "forecaster_ward.pkl")),
        "icu": joblib.load(os.path.join(MODEL_DIR, "forecaster_icu.pkl"))
    }
    return scaler, models

def forecast_next_days(days=7):
    try:
        scaler, models = load_bed_models()
    except Exception:
        trainer.train_bed_forecaster()
        scaler, models = load_bed_models()
        
    start_date = datetime.now()
    forecasts = []
    
    for i in range(days):
        target_date = start_date + timedelta(days=i)
        dow = target_date.weekday()
        mon = target_date.month
        
        X_input = np.array([[dow, mon]])
        X_scaled = scaler.transform(X_input)
        
        pred_ward = int(round(models["ward"].predict(X_scaled)[0]))
        pred_icu = int(round(models["icu"].predict(X_scaled)[0]))
        
        forecasts.append({
            "date": target_date.strftime("%Y-%m-%d"),
            "day_name": target_date.strftime("%A"),
            "projected_ward_occupancy": pred_ward,
            "projected_icu_occupancy": pred_icu,
            "total_projected": pred_ward + pred_icu
        })
        
    return forecasts

if __name__ == "__main__":
    print("Test Bed Forecast:")
    print(forecast_next_days(5))
