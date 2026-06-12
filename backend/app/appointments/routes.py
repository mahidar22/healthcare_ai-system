import os
import pandas as pd
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/appointments", tags=["Appointment Management"])

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../data"))
APP_CSV = os.path.join(DATA_DIR, "appointments.csv")

def load_appointments_df():
    if not os.path.exists(APP_CSV):
        return pd.DataFrame()
    return pd.read_csv(APP_CSV).fillna("")

def save_appointments_df(df):
    df.to_csv(APP_CSV, index=False)

class AppointmentBook(BaseModel):
    patient_id: str
    patient_name: str
    doctor_id: str
    doctor_name: str
    specialization: str
    appointment_date: str
    appointment_time: str
    notes: Optional[str] = "Routine consultation."

class RescheduleRequest(BaseModel):
    appointment_date: str
    appointment_time: str

@router.get("/")
def get_all_appointments():
    df = load_appointments_df()
    return df.to_dict(orient="records")

@router.post("/book")
def book_appointment(app: AppointmentBook):
    df = load_appointments_df()
    new_id = f"A{len(df)+1:03d}"
    
    new_row = {
        "id": new_id,
        "patient_id": app.patient_id,
        "patient_name": app.patient_name,
        "doctor_id": app.doctor_id,
        "doctor_name": app.doctor_name,
        "specialization": app.specialization,
        "appointment_date": app.appointment_date,
        "appointment_time": app.appointment_time,
        "status": "Pending",
        "notes": app.notes
    }
    
    df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)
    save_appointments_df(df)
    return {"status": "success", "appointment": new_row}

@router.put("/{appointment_id}/approve")
def approve_appointment(appointment_id: str):
    df = load_appointments_df()
    idx = df[df['id'] == appointment_id].index
    if idx.empty:
        raise HTTPException(status_code=404, detail="Appointment not found.")
        
    df.at[idx[0], 'status'] = "Confirmed"
    save_appointments_df(df)
    return {"status": "success", "appointment": df.iloc[idx[0]].to_dict()}

@router.put("/{appointment_id}/reschedule")
def reschedule_appointment(appointment_id: str, payload: RescheduleRequest):
    df = load_appointments_df()
    idx = df[df['id'] == appointment_id].index
    if idx.empty:
        raise HTTPException(status_code=404, detail="Appointment not found.")
        
    df.at[idx[0], 'appointment_date'] = payload.appointment_date
    df.at[idx[0], 'appointment_time'] = payload.appointment_time
    df.at[idx[0], 'status'] = "Rescheduled"
    save_appointments_df(df)
    return {"status": "success", "appointment": df.iloc[idx[0]].to_dict()}
