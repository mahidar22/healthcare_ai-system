import os
import json
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/auth", tags=["Authentication"])

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../data"))
USERS_FILE = os.path.join(DATA_DIR, "users.json")

def load_users():
    if not os.path.exists(USERS_FILE):
        default_users = [
            {"id": "U001", "name": "John Doe", "email": "patient@health.ai", "password": "password123", "role": "patient", "patient_id": "P001"},
            {"id": "U002", "name": "Dr. Sarah Jenkins", "email": "doctor@health.ai", "password": "password123", "role": "doctor", "doctor_id": "D001", "specialization": "Cardiology"},
            {"id": "U003", "name": "Super Admin", "email": "admin@health.ai", "password": "password123", "role": "admin"}
        ]
        with open(USERS_FILE, "w") as f:
            json.dump(default_users, f, indent=4)
        return default_users
    with open(USERS_FILE, "r") as f:
        return json.load(f)

def save_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=4)

class LoginRequest(BaseModel):
    email: str
    password: str
    role: Optional[str] = None

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str # "patient", "doctor", "admin"
    specialization: Optional[str] = "General"

@router.post("/login")
def login(req: LoginRequest):
    users = load_users()
    for u in users:
        if u["email"].lower() == req.email.lower() and u["password"] == req.password:
            # If role is specified, verify or allow login
            if req.role and u["role"] != req.role and u["role"] != "admin":
                continue
            return {"status": "success", "user": u, "token": f"mock-jwt-token-{u['id']}"}
    raise HTTPException(status_code=401, detail="Invalid email or password or role mismatch.")

@router.post("/register")
def register(req: RegisterRequest):
    users = load_users()
    for u in users:
        if u["email"].lower() == req.email.lower():
            raise HTTPException(status_code=400, detail="User with this email already exists.")
            
    new_id = f"U{len(users)+1:03d}"
    user_data = {
        "id": new_id,
        "name": req.name,
        "email": req.email,
        "password": req.password,
        "role": req.role
    }
    
    if req.role == "patient":
        user_data["patient_id"] = f"P{len(users)+1:03d}"
    elif req.role == "doctor":
        user_data["doctor_id"] = f"D{len(users)+1:03d}"
        user_data["specialization"] = req.specialization
        
    users.append(user_data)
    save_users(users)
    return {"status": "success", "user": user_data, "token": f"mock-jwt-token-{new_id}"}

@router.get("/users")
def get_all_users():
    return load_users()
