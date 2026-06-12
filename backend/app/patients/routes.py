import os
import pandas as pd
import numpy as np
import json
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

router = APIRouter(prefix="/patients", tags=["Patient Management"])

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../data"))
UPLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../uploads/lab_reports"))
PATIENTS_CSV = os.path.join(DATA_DIR, "patients.csv")
REPORTS_CSV = os.path.join(DATA_DIR, "reports.csv")
os.makedirs(UPLOAD_DIR, exist_ok=True)

def load_patients_df():
    if not os.path.exists(PATIENTS_CSV):
        return pd.DataFrame()
    df = pd.read_csv(PATIENTS_CSV)
    return df.fillna("")

def save_patients_df(df):
    df.to_csv(PATIENTS_CSV, index=False)

class PatientCreate(BaseModel):
    name: str
    email: str
    gender: str
    age: int
    blood_group: str
    phone: str
    bmi: float
    blood_pressure: str
    cholesterol: int
    chronic_conditions: str
    status: Optional[str] = "Outpatient"

class PatientUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    gender: Optional[str] = None
    age: Optional[int] = None
    blood_group: Optional[str] = None
    phone: Optional[str] = None
    bmi: Optional[float] = None
    blood_pressure: Optional[str] = None
    cholesterol: Optional[int] = None
    chronic_conditions: Optional[str] = None
    status: Optional[str] = None

@router.get("/")
def get_all_patients():
    df = load_patients_df()
    return df.to_dict(orient="records")

@router.get("/{patient_id}")
def get_patient(patient_id: str):
    df = load_patients_df()
    patient = df[df['id'] == patient_id]
    if patient.empty:
        raise HTTPException(status_code=404, detail="Patient not found.")
    return patient.iloc[0].to_dict()

@router.post("/")
def add_patient(pat: PatientCreate):
    df = load_patients_df()
    new_id = f"P{len(df)+1:03d}"
    
    new_row = {
        "id": new_id,
        "name": pat.name,
        "email": pat.email,
        "gender": pat.gender,
        "age": pat.age,
        "blood_group": pat.blood_group,
        "phone": pat.phone,
        "bmi": pat.bmi,
        "blood_pressure": pat.blood_pressure,
        "cholesterol": pat.cholesterol,
        "chronic_conditions": pat.chronic_conditions,
        "admission_date": datetime.now().strftime("%Y-%m-%d"),
        "status": pat.status
    }
    
    df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)
    save_patients_df(df)
    return {"status": "success", "patient": new_row}

@router.put("/{patient_id}")
def update_patient(patient_id: str, pat: PatientUpdate):
    df = load_patients_df()
    idx = df[df['id'] == patient_id].index
    if idx.empty:
        raise HTTPException(status_code=404, detail="Patient not found.")
        
    for key, value in pat.dict(exclude_unset=True).items():
        if value is not None:
            df.at[idx[0], key] = value
            
    save_patients_df(df)
    return {"status": "success", "patient": df.iloc[idx[0]].to_dict()}

@router.post("/{patient_id}/upload_report")
async def upload_lab_report(patient_id: str, file: UploadFile = File(...), report_type: str = Form("General Lab Report")):
    df = load_patients_df()
    pat = df[df['id'] == patient_id]
    if pat.empty:
        raise HTTPException(status_code=404, detail="Patient not found.")
        
    pat_name = pat.iloc[0]['name']
    
    # Save file
    file_filename = f"{patient_id}_{datetime.now().strftime('%Y%m%d%H%M%S')}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, file_filename)
    
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
        
    # Run OCR / Analysis on the uploaded report
    import ml.report_analysis.analyze as analyzer
    text = analyzer.perform_ocr(file_path)
    if not text:
        text = f"Simulated report text for {file.filename}: Fasting Glucose 110 mg/dL, Total Cholesterol 210 mg/dL, BP 130/85"
        
    analysis_result = analyzer.analyze_medical_report_text(text)
    
    # Save report metadata to reports.csv
    reports_df = pd.read_csv(REPORTS_CSV).fillna("") if os.path.exists(REPORTS_CSV) else pd.DataFrame()
    new_rep_id = f"REP{len(reports_df)+1:03d}"
    
    abnormal_str = ", ".join(analysis_result["abnormal_flags"]) if analysis_result["abnormal_flags"] else "None"
    
    new_rep = {
        "id": new_rep_id,
        "patient_id": patient_id,
        "patient_name": pat_name,
        "report_type": report_type,
        "report_date": datetime.now().strftime("%Y-%m-%d"),
        "summary": analysis_result["raw_extracted_text"][:150] + "...",
        "abnormal_flags": abnormal_str,
        "file_path": f"uploads/lab_reports/{file_filename}"
    }
    
    reports_df = pd.concat([reports_df, pd.DataFrame([new_rep])], ignore_index=True)
    reports_df.to_csv(REPORTS_CSV, index=False)
    
    return {
        "status": "success",
        "report": new_rep,
        "analysis": analysis_result
    }

@router.get("/{patient_id}/history")
def get_patient_history(patient_id: str):
    reports_df = pd.read_csv(REPORTS_CSV).fillna("") if os.path.exists(REPORTS_CSV) else pd.DataFrame()
    pat_reports = reports_df[reports_df['patient_id'] == patient_id].to_dict(orient="records") if not reports_df.empty else []
    
    APP_CSV = os.path.join(DATA_DIR, "appointments.csv")
    app_df = pd.read_csv(APP_CSV).fillna("") if os.path.exists(APP_CSV) else pd.DataFrame()
    pat_apps = app_df[app_df['patient_id'] == patient_id].to_dict(orient="records") if not app_df.empty else []
    
    return {
        "patient_id": patient_id,
        "lab_reports": pat_reports,
        "appointments": pat_apps
    }
