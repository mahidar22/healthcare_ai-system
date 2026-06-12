import os
import pandas as pd
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/doctors", tags=["Doctor Management"])

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../data"))
DOCTORS_CSV = os.path.join(DATA_DIR, "doctors.csv")

def load_doctors_df():
    if not os.path.exists(DOCTORS_CSV):
        return pd.DataFrame()
    return pd.read_csv(DOCTORS_CSV).fillna("")

def save_doctors_df(df):
    df.to_csv(DOCTORS_CSV, index=False)

class DoctorCreate(BaseModel):
    name: str
    email: str
    specialization: str
    phone: str
    department: str
    availability: Optional[str] = "Available"
    rating: Optional[float] = 4.8
    experience_years: int

class AvailabilityUpdate(BaseModel):
    availability: str

@router.get("/")
def get_all_doctors():
    df = load_doctors_df()
    return df.to_dict(orient="records")

@router.post("/")
def add_doctor(doc: DoctorCreate):
    df = load_doctors_df()
    new_id = f"D{len(df)+1:03d}"
    
    new_row = {
        "id": new_id,
        "name": doc.name,
        "email": doc.email,
        "specialization": doc.specialization,
        "phone": doc.phone,
        "department": doc.department,
        "availability": doc.availability,
        "rating": doc.rating,
        "experience_years": doc.experience_years
    }
    
    df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)
    save_doctors_df(df)
    return {"status": "success", "doctor": new_row}

@router.put("/{doctor_id}/availability")
def update_availability(doctor_id: str, payload: AvailabilityUpdate):
    df = load_doctors_df()
    idx = df[df['id'] == doctor_id].index
    if idx.empty:
        raise HTTPException(status_code=404, detail="Doctor not found.")
        
    df.at[idx[0], 'availability'] = payload.availability
    save_doctors_df(df)
    return {"status": "success", "doctor": df.iloc[idx[0]].to_dict()}

@router.get("/{doctor_id}/assigned_patients")
def get_assigned_patients(doctor_id: str):
    APP_CSV = os.path.join(DATA_DIR, "appointments.csv")
    if not os.path.exists(APP_CSV):
        return []
    app_df = pd.read_csv(APP_CSV).fillna("")
    assigned = app_df[app_df['doctor_id'] == doctor_id].to_dict(orient="records")
    return assigned
