import os
import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime

router = APIRouter(prefix="/ehr", tags=["Electronic Health Records"])

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../data"))
EHR_JSON = os.path.join(DATA_DIR, "ehr.json")

def load_ehr():
    if not os.path.exists(EHR_JSON):
        return []
    with open(EHR_JSON, "r") as f:
        return json.load(f)

def save_ehr(records):
    with open(EHR_JSON, "w") as f:
        json.dump(records, f, indent=4)

class PrescriptionItem(BaseModel):
    medicine: str
    dosage: str
    frequency: str
    duration: str

class EHRCreate(BaseModel):
    patient_id: str
    patient_name: str
    doctor_id: str
    doctor_name: str
    diagnosis: str
    treatment_given: str
    prescriptions: List[PrescriptionItem]
    vitals: Dict[str, str]

@router.get("/")
def get_all_ehr():
    return load_ehr()

@router.get("/patient/{patient_id}")
def get_patient_ehr(patient_id: str):
    records = load_ehr()
    pat_records = [r for r in records if r["patient_id"] == patient_id]
    return pat_records

@router.post("/")
def add_ehr_record(ehr: EHRCreate):
    records = load_ehr()
    new_id = f"EHR{len(records)+1:03d}"
    
    new_rec = {
        "id": new_id,
        "patient_id": ehr.patient_id,
        "patient_name": ehr.patient_name,
        "doctor_id": ehr.doctor_id,
        "doctor_name": ehr.doctor_name,
        "date": datetime.now().strftime("%Y-%m-%d"),
        "diagnosis": ehr.diagnosis,
        "treatment_given": ehr.treatment_given,
        "prescriptions": [p.dict() for p in ehr.prescriptions],
        "vitals": ehr.vitals
    }
    
    records.append(new_rec)
    save_ehr(records)
    return {"status": "success", "record": new_rec}

@router.post("/{ehr_id}/prescriptions")
def add_prescription_to_ehr(ehr_id: str, presc: PrescriptionItem):
    records = load_ehr()
    for r in records:
        if r["id"] == ehr_id:
            r["prescriptions"].append(presc.dict())
            save_ehr(records)
            return {"status": "success", "record": r}
    raise HTTPException(status_code=404, detail="EHR Record not found.")
