import os
import pandas as pd
import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime

router = APIRouter(prefix="/analytics", tags=["Dashboard & Resource Analytics"])

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../data"))
BEDS_CSV = os.path.join(DATA_DIR, "beds.csv")
RESOURCES_CSV = os.path.join(DATA_DIR, "resources.csv")
PATIENTS_CSV = os.path.join(DATA_DIR, "patients.csv")
DOCTORS_CSV = os.path.join(DATA_DIR, "doctors.csv")
APP_CSV = os.path.join(DATA_DIR, "appointments.csv")
NOTIFICATIONS_FILE = os.path.join(DATA_DIR, "notifications.json")

class OutcomeInput(BaseModel):
    age: int
    bmi: float
    chronic_count: int
    severity: int
    vital_stability: float

class ResourceUpdate(BaseModel):
    available_quantity: int
    in_use_quantity: int
    maintenance_quantity: int
    status: str

@router.post("/patient_outcome")
def get_patient_outcome(data: OutcomeInput):
    import ml.outcome_prediction.predict as outcome_predictor
    res = outcome_predictor.predict_patient_outcome(data.dict())
    return {
        "status": "success",
        "inputs": data.dict(),
        "outcome": res
    }

@router.get("/beds")
def get_bed_management():
    df = pd.read_csv(BEDS_CSV).fillna("") if os.path.exists(BEDS_CSV) else pd.DataFrame()
    if df.empty:
        return {"total_beds": 0, "available_beds": 0, "icu_beds": 0, "available_icu": 0, "beds": [], "seven_day_demand_forecast": []}
        
    total_beds = len(df)
    available_beds = len(df[df['status'] == 'Available'])
    icu_df = df[df['bed_type'] == 'ICU']
    icu_beds = len(icu_df)
    available_icu = len(icu_df[icu_df['status'] == 'Available'])
    
    import ml.bed_forecasting.predict as bed_forecaster
    forecast = bed_forecaster.forecast_next_days(7)
    
    return {
        "status": "success",
        "statistics": {
            "total_beds": total_beds,
            "available_beds": available_beds,
            "occupied_beds": total_beds - available_beds,
            "occupancy_rate_percent": round(((total_beds - available_beds) / total_beds) * 100, 1) if total_beds else 0,
            "icu_beds_total": icu_beds,
            "icu_beds_available": available_icu,
            "icu_occupancy_percent": round(((icu_beds - available_icu) / icu_beds) * 100, 1) if icu_beds else 0
        },
        "beds_list": df.to_dict(orient="records"),
        "seven_day_demand_forecast": forecast
    }

@router.get("/resources")
def get_resource_management():
    df = pd.read_csv(RESOURCES_CSV).fillna("") if os.path.exists(RESOURCES_CSV) else pd.DataFrame()
    if df.empty:
        return []
    return df.to_dict(orient="records")

@router.put("/resources/{resource_id}")
def update_resource(resource_id: str, payload: ResourceUpdate):
    df = pd.read_csv(RESOURCES_CSV).fillna("") if os.path.exists(RESOURCES_CSV) else pd.DataFrame()
    idx = df[df['id'] == resource_id].index
    if idx.empty:
        raise HTTPException(status_code=404, detail="Resource not found.")
        
    df.at[idx[0], 'available_quantity'] = payload.available_quantity
    df.at[idx[0], 'in_use_quantity'] = payload.in_use_quantity
    df.at[idx[0], 'maintenance_quantity'] = payload.maintenance_quantity
    df.at[idx[0], 'status'] = payload.status
    
    df.to_csv(RESOURCES_CSV, index=False)
    return {"status": "success", "resource": df.iloc[idx[0]].to_dict()}

@router.get("/dashboard/admin")
def get_admin_dashboard_analytics():
    pat_df = pd.read_csv(PATIENTS_CSV).fillna("") if os.path.exists(PATIENTS_CSV) else pd.DataFrame()
    doc_df = pd.read_csv(DOCTORS_CSV).fillna("") if os.path.exists(DOCTORS_CSV) else pd.DataFrame()
    app_df = pd.read_csv(APP_CSV).fillna("") if os.path.exists(APP_CSV) else pd.DataFrame()
    res_df = pd.read_csv(RESOURCES_CSV).fillna("") if os.path.exists(RESOURCES_CSV) else pd.DataFrame()
    beds_df = pd.read_csv(BEDS_CSV).fillna("") if os.path.exists(BEDS_CSV) else pd.DataFrame()
    
    total_patients = len(pat_df)
    total_doctors = len(doc_df)
    total_appointments = len(app_df)
    
    total_beds = len(beds_df)
    occupied_beds = len(beds_df[beds_df['status'] == 'Occupied']) if not beds_df.empty else 0
    
    total_ventilators = res_df[res_df['item_name'].str.contains('Ventilator', case=False, na=False)]['total_quantity'].sum() if not res_df.empty else 0
    in_use_ventilators = res_df[res_df['item_name'].str.contains('Ventilator', case=False, na=False)]['in_use_quantity'].sum() if not res_df.empty else 0
    
    total_oxygen = res_df[res_df['item_name'].str.contains('Oxygen', case=False, na=False)]['total_quantity'].sum() if not res_df.empty else 0
    available_oxygen = res_df[res_df['item_name'].str.contains('Oxygen', case=False, na=False)]['available_quantity'].sum() if not res_df.empty else 0
    
    recent_appointments = app_df.tail(6).to_dict(orient="records") if not app_df.empty else []
    
    return {
        "status": "success",
        "overview": {
            "total_patients": total_patients,
            "total_doctors": total_doctors,
            "total_appointments": total_appointments,
            "total_beds": total_beds,
            "occupied_beds": occupied_beds,
            "bed_occupancy_rate": round((occupied_beds / total_beds) * 100, 1) if total_beds else 0,
            "ventilator_utilization_percent": round((in_use_ventilators / total_ventilators) * 100, 1) if total_ventilators else 0,
            "oxygen_cylinders_available": int(available_oxygen)
        },
        "resource_breakdown": res_df.to_dict(orient="records") if not res_df.empty else [],
        "recent_appointments": recent_appointments
    }

@router.get("/notifications")
def get_notifications():
    if not os.path.exists(NOTIFICATIONS_FILE):
        return []
    with open(NOTIFICATIONS_FILE, "r") as f:
        return json.load(f)

class NotificationCreate(BaseModel):
    title: str
    message: str
    type: str # "warning", "info", "success", "error"

@router.post("/notifications")
def add_notification(notif: NotificationCreate):
    notifications = []
    if os.path.exists(NOTIFICATIONS_FILE):
        with open(NOTIFICATIONS_FILE, "r") as f:
            notifications = json.load(f)
            
    new_n = {
        "id": f"N{len(notifications)+1:03d}",
        "title": notif.title,
        "message": notif.message,
        "date": datetime.now().strftime("%Y-%m-%d %I:%M %p"),
        "type": notif.type,
        "read": False
    }
    
    notifications.insert(0, new_n)
    with open(NOTIFICATIONS_FILE, "w") as f:
        json.dump(notifications, f, indent=4)
    return {"status": "success", "notification": new_n}

@router.put("/notifications/{notif_id}/read")
def mark_notification_read(notif_id: str):
    notifications = []
    if os.path.exists(NOTIFICATIONS_FILE):
        with open(NOTIFICATIONS_FILE, "r") as f:
            notifications = json.load(f)
            
    for n in notifications:
        if n["id"] == notif_id:
            n["read"] = True
            
    with open(NOTIFICATIONS_FILE, "w") as f:
        json.dump(notifications, f, indent=4)
    return {"status": "success"}
