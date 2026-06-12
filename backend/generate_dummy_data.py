import os
import pandas as pd
import numpy as np
import random
import json
from datetime import datetime, timedelta

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../data"))
os.makedirs(DATA_DIR, exist_ok=True)

def generate_patients():
    np.random.seed(42)
    random.seed(42)
    n = 50
    first_names = ["John", "Sarah", "Michael", "Emily", "David", "Jessica", "Robert", "Jennifer", "James", "Maria",
                   "William", "Lisa", "Joseph", "Karen", "Charles", "Nancy", "Thomas", "Betty", "Daniel", "Margaret"]
    last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Wilson",
                  "Martinez", "Anderson", "Taylor", "Thomas", "Hernandez", "Moore", "Martin", "Jackson", "Thompson", "White"]
    
    blood_groups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    
    patients = []
    for i in range(1, n + 1):
        age = int(np.random.randint(18, 85))
        bmi = round(np.random.uniform(18.5, 38.0), 1)
        sys_bp = int(np.random.randint(100, 180))
        dia_bp = int(np.random.randint(60, 110))
        cholesterol = int(np.random.randint(150, 300))
        gender = np.random.choice(["Male", "Female"])
        
        fname = np.random.choice(first_names)
        lname = np.random.choice(last_names)
        email = f"patient{i}@health.ai" if i > 1 else "patient@health.ai"
        
        # Use Python's built-in random.randint for 10-digit bignums to avoid Windows int32 overflow in Numpy
        phone = f"+91 {random.randint(9000000000, 9999999999)}"
        
        patients.append({
            "id": f"P{i:03d}",
            "name": f"{fname} {lname}" if i > 1 else "John Doe",
            "email": email,
            "gender": gender,
            "age": age,
            "blood_group": np.random.choice(blood_groups),
            "phone": phone,
            "bmi": bmi,
            "blood_pressure": f"{sys_bp}/{dia_bp}",
            "cholesterol": cholesterol,
            "chronic_conditions": np.random.choice(["None", "Diabetes", "Hypertension", "Asthma", "Heart Disease"], p=[0.5, 0.2, 0.15, 0.07, 0.08]),
            "admission_date": (datetime.now() - timedelta(days=int(np.random.randint(1, 30)))).strftime("%Y-%m-%d"),
            "status": np.random.choice(["Outpatient", "Inpatient", "ICU", "Discharged"], p=[0.5, 0.3, 0.05, 0.15])
        })
    
    df = pd.DataFrame(patients)
    df.to_csv(os.path.join(DATA_DIR, "patients.csv"), index=False)
    print("Created patients.csv")

def generate_doctors():
    doctors = [
        {"id": "D001", "name": "Dr. Sarah Jenkins", "email": "doctor@health.ai", "specialization": "Cardiology", "phone": "+91 9876543210", "department": "Cardiology", "availability": "Available", "rating": 4.9, "experience_years": 14},
        {"id": "D002", "name": "Dr. Rajesh Sharma", "email": "rajesh.sharma@health.ai", "specialization": "Endocrinology", "phone": "+91 9876543211", "department": "Endocrinology", "availability": "Available", "rating": 4.8, "experience_years": 10},
        {"id": "D003", "name": "Dr. Priya Anandan", "email": "priya.anandan@health.ai", "specialization": "Nephrology", "phone": "+91 9876543212", "department": "Nephrology", "availability": "On Leave", "rating": 4.7, "experience_years": 8},
        {"id": "D004", "name": "Dr. Amit Patel", "email": "amit.patel@health.ai", "specialization": "Oncology", "phone": "+91 9876543213", "department": "Oncology", "availability": "Available", "rating": 4.9, "experience_years": 18},
        {"id": "D005", "name": "Dr. Emily Watson", "email": "emily.watson@health.ai", "specialization": "Neurology", "phone": "+91 9876543214", "department": "Neurology", "availability": "In Surgery", "rating": 4.6, "experience_years": 12},
        {"id": "D006", "name": "Dr. Vikram Malhotra", "email": "vikram.malhotra@health.ai", "specialization": "General Medicine", "phone": "+91 9876543215", "department": "General Medicine", "availability": "Available", "rating": 4.8, "experience_years": 22},
    ]
    df = pd.DataFrame(doctors)
    df.to_csv(os.path.join(DATA_DIR, "doctors.csv"), index=False)
    print("Created doctors.csv")

def generate_appointments():
    appointments = [
        {"id": "A001", "patient_id": "P001", "patient_name": "John Doe", "doctor_id": "D001", "doctor_name": "Dr. Sarah Jenkins", "specialization": "Cardiology", "appointment_date": (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d"), "appointment_time": "10:00 AM", "status": "Confirmed", "notes": "Routine heart checkup and ECG review."},
        {"id": "A002", "patient_id": "P002", "patient_name": "Sarah Smith", "doctor_id": "D002", "doctor_name": "Dr. Rajesh Sharma", "specialization": "Endocrinology", "appointment_date": (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d"), "appointment_time": "11:30 AM", "status": "Confirmed", "notes": "HbA1c consultation."},
        {"id": "A003", "patient_id": "P003", "patient_name": "Michael Johnson", "doctor_id": "D001", "doctor_name": "Dr. Sarah Jenkins", "specialization": "Cardiology", "appointment_date": (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d"), "appointment_time": "02:00 PM", "status": "Pending", "notes": "High blood pressure follow-up."},
        {"id": "A004", "patient_id": "P004", "patient_name": "Emily Williams", "doctor_id": "D004", "doctor_name": "Dr. Amit Patel", "specialization": "Oncology", "appointment_date": (datetime.now() + timedelta(days=4)).strftime("%Y-%m-%d"), "appointment_time": "04:00 PM", "status": "Rescheduled", "notes": "Biopsy report discussion."},
        {"id": "A005", "patient_id": "P001", "patient_name": "John Doe", "doctor_id": "D006", "doctor_name": "Dr. Vikram Malhotra", "specialization": "General Medicine", "appointment_date": (datetime.now() - timedelta(days=5)).strftime("%Y-%m-%d"), "appointment_time": "09:00 AM", "status": "Completed", "notes": "Viral fever and body ache."},
    ]
    df = pd.DataFrame(appointments)
    df.to_csv(os.path.join(DATA_DIR, "appointments.csv"), index=False)
    print("Created appointments.csv")

def generate_beds():
    beds = []
    for i in range(1, 51):
        btype = "ICU" if i <= 10 else ("General Ward" if i <= 35 else "Private Suite")
        status = np.random.choice(["Occupied", "Available", "Maintenance"], p=[0.65, 0.30, 0.05])
        patient = f"P{np.random.randint(1, 50):03d}" if status == "Occupied" else ""
        beds.append({
            "id": f"B{i:03d}",
            "room_number": f"RM-{100 + i}",
            "bed_type": btype,
            "status": status,
            "current_patient_id": patient,
            "last_sanitized": (datetime.now() - timedelta(hours=int(np.random.randint(1, 24)))).strftime("%Y-%m-%d %H:%M:%S")
        })
    df = pd.DataFrame(beds)
    df.to_csv(os.path.join(DATA_DIR, "beds.csv"), index=False)
    print("Created beds.csv")

def generate_resources():
    resources = [
        {"id": "R001", "item_name": "Advanced ICU Ventilators", "category": "Life Support", "total_quantity": 45, "available_quantity": 12, "in_use_quantity": 30, "maintenance_quantity": 3, "location": "ICU Block A", "status": "Critical Storage"},
        {"id": "R002", "item_name": "Portable Oxygen Cylinders", "category": "Oxygen Supply", "total_quantity": 250, "available_quantity": 180, "in_use_quantity": 60, "maintenance_quantity": 10, "location": "Central Oxygen Store", "status": "Optimal"},
        {"id": "R003", "item_name": "Liquid Oxygen Concentrators", "category": "Oxygen Supply", "total_quantity": 80, "available_quantity": 35, "in_use_quantity": 42, "maintenance_quantity": 3, "location": "Ward Block B", "status": "Optimal"},
        {"id": "R004", "item_name": "Defibrillators", "category": "Emergency", "total_quantity": 30, "available_quantity": 22, "in_use_quantity": 7, "maintenance_quantity": 1, "location": "Emergency Ward", "status": "Optimal"},
        {"id": "R005", "item_name": "Dialysis Machines", "category": "Specialized", "total_quantity": 20, "available_quantity": 4, "in_use_quantity": 15, "maintenance_quantity": 1, "location": "Nephrology Dept", "status": "Critical Storage"},
        {"id": "R006", "item_name": "ECG Monitors", "category": "Diagnostic", "total_quantity": 100, "available_quantity": 45, "in_use_quantity": 52, "maintenance_quantity": 3, "location": "Cardiology & General", "status": "Optimal"},
        {"id": "R007", "item_name": "Infusion Pumps", "category": "Equipment", "total_quantity": 150, "available_quantity": 65, "in_use_quantity": 80, "maintenance_quantity": 5, "location": "All Wards", "status": "Optimal"},
    ]
    df = pd.DataFrame(resources)
    df.to_csv(os.path.join(DATA_DIR, "resources.csv"), index=False)
    print("Created resources.csv")

def generate_reports():
    reports = [
        {"id": "REP001", "patient_id": "P001", "patient_name": "John Doe", "report_type": "Complete Blood Count (CBC)", "report_date": "2026-06-01", "summary": "Mild anemia with hemoglobin at 12.8 g/dL. WBC count normal.", "abnormal_flags": "Hemoglobin (Low)", "file_path": "uploads/lab_reports/REP001_CBC.pdf"},
        {"id": "REP002", "patient_id": "P001", "patient_name": "John Doe", "report_type": "Lipid Profile", "report_date": "2026-06-05", "summary": "Total Cholesterol is elevated at 245 mg/dL. High LDL observed.", "abnormal_flags": "Cholesterol (High), LDL (High)", "file_path": "uploads/lab_reports/REP002_Lipid.pdf"},
        {"id": "REP003", "patient_id": "P002", "patient_name": "Sarah Smith", "report_type": "Fasting Blood Sugar", "report_date": "2026-06-08", "summary": "Fasting blood glucose elevated at 142 mg/dL. Indicative of Type 2 Diabetes.", "abnormal_flags": "Fasting Glucose (High)", "file_path": "uploads/lab_reports/REP003_FBS.pdf"},
        {"id": "REP004", "patient_id": "P003", "patient_name": "Michael Johnson", "report_type": "Renal Function Test", "report_date": "2026-06-10", "summary": "Serum Creatinine slightly elevated at 1.4 mg/dL. BUN within normal margin.", "abnormal_flags": "Creatinine (Elevated)", "file_path": "uploads/lab_reports/REP004_RFT.pdf"},
    ]
    df = pd.DataFrame(reports)
    df.to_csv(os.path.join(DATA_DIR, "reports.csv"), index=False)
    print("Created reports.csv")

def generate_ehr():
    ehr_records = [
        {
            "id": "EHR001",
            "patient_id": "P001",
            "patient_name": "John Doe",
            "doctor_id": "D001",
            "doctor_name": "Dr. Sarah Jenkins",
            "date": "2026-06-05",
            "diagnosis": "Stage 1 Hypertension & Hyperlipidemia",
            "treatment_given": "Prescribed lifestyle modification and cholesterol-lowering medication.",
            "prescriptions": [
                {"medicine": "Atorvastatin", "dosage": "20mg", "frequency": "Once daily at night", "duration": "30 Days"},
                {"medicine": "Amlodipine", "dosage": "5mg", "frequency": "Once daily in morning", "duration": "30 Days"}
            ],
            "vitals": {"bp": "145/92", "hr": "82", "temp": "98.6 F", "spO2": "98%"}
        },
        {
            "id": "EHR002",
            "patient_id": "P002",
            "patient_name": "Sarah Smith",
            "doctor_id": "D002",
            "doctor_name": "Dr. Rajesh Sharma",
            "date": "2026-06-08",
            "diagnosis": "Type 2 Diabetes Mellitus",
            "treatment_given": "Initiated Metformin therapy. Recommended dietary overhaul and regular walking.",
            "prescriptions": [
                {"medicine": "Metformin", "dosage": "500mg", "frequency": "Twice daily with meals", "duration": "60 Days"}
            ],
            "vitals": {"bp": "125/80", "hr": "76", "temp": "98.4 F", "spO2": "99%"}
        }
    ]
    with open(os.path.join(DATA_DIR, "ehr.json"), "w") as f:
        json.dump(ehr_records, f, indent=4)
    print("Created ehr.json")

def generate_notifications():
    notifications = [
        {"id": "N1", "title": "Critical Resource Alert", "message": "ICU Ventilators availability is below 30% capacity in ICU Block A.", "date": "2026-06-12 08:00 AM", "type": "warning", "read": False},
        {"id": "N2", "title": "New Appointment Requested", "message": "Michael Johnson booked a Cardiology appointment with Dr. Sarah Jenkins.", "date": "2026-06-12 07:30 AM", "type": "info", "read": False},
        {"id": "N3", "title": "Lab Report Ready", "message": "John Doe's Lipid Profile report has been automatically parsed and flagged.", "date": "2026-06-11 04:15 PM", "type": "success", "read": True},
    ]
    with open(os.path.join(DATA_DIR, "notifications.json"), "w") as f:
        json.dump(notifications, f, indent=4)
    print("Created notifications.json")

if __name__ == "__main__":
    generate_patients()
    generate_doctors()
    generate_appointments()
    generate_beds()
    generate_resources()
    generate_reports()
    generate_ehr()
    generate_notifications()
    print("All dummy datasets generated successfully!")
