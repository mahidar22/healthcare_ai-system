from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict
import re

router = APIRouter(prefix="/chatbot", tags=["AI Chatbot"])

class ChatMessage(BaseModel):
    message: str
    user_role: str = "patient" # "patient", "doctor", "admin"

@router.post("/")
def chat_with_bot(payload: ChatMessage):
    msg = payload.message.lower()
    
    # 1. Greeting
    if msg in ["hi", "hello", "hey", "help", "start"]:
        reply = "Hello! I am your AI Healthcare Assistant. How can I assist you today? I can help you with:\n" \
                "• AI Symptom Checking & Disease Risk Assessment\n" \
                "• Booking or Checking Appointments\n" \
                "• Hospital Bed & Resource Availability\n" \
                "• General Health & Hospital FAQs"
        return {"status": "success", "reply": reply, "intent": "greeting"}

    # 2. Symptom Checking & Triage
    if "symptom" in msg or "pain" in msg or "fever" in msg or "cough" in msg or "headache" in msg or "dizzy" in msg or "fatigue" in msg or "sick" in msg:
        reply = "I understand you're experiencing some symptoms. Based on general triage:\n" \
                "• If you have **severe chest pain**, **sudden shortness of breath**, or **active bleeding**, please seek emergency hospital admission immediately.\n" \
                "• If it's persistent fever or body ache, ensure plenty of fluids. Would you like me to guide you to the **AI Disease Prediction** module or help you **book an appointment** with one of our General Physicians or Specialists?"
        return {"status": "success", "reply": reply, "intent": "symptom_checking"}

    # 3. Appointment Assistance
    if "appointment" in msg or "book" in msg or "doctor" in msg or "meet" in msg or "schedule" in msg:
        reply = "I can certainly help you with appointments! You can visit the **Appointments Module** from the navigation bar to easily book a confirmed slot with any of our specialized doctors (such as Dr. Sarah Jenkins in Cardiology or Dr. Rajesh Sharma in Endocrinology)."
        return {"status": "success", "reply": reply, "intent": "appointment_assistance"}

    # 4. Bed / ICU / Resource Management
    if "bed" in msg or "icu" in msg or "ventilator" in msg or "ward" in msg or "oxygen" in msg:
        reply = "Our hospital is currently equipped with 50 advanced beds (including 10 Specialized ICU beds) and fully tracked medical resources (Ventilators, Oxygen Cylinders). You can view real-time occupancy and 7-day projected AI forecasts directly in the **Bed Management** or **Admin Dashboard**."
        return {"status": "success", "reply": reply, "intent": "bed_assistance"}

    # 5. Health FAQs
    if "diabetes" in msg or "sugar" in msg:
        reply = "Diabetes is a chronic condition that affects how your body turns food into energy. Key signs include excessive thirst, frequent urination, and unexplained fatigue. We recommend monitoring your Fasting Blood Glucose and keeping HbA1c below 6.5%."
        return {"status": "success", "reply": reply, "intent": "faq"}
        
    if "pressure" in msg or "hypertension" in msg or "bp" in msg:
        reply = "Normal blood pressure is generally considered to be around 120/80 mmHg. Anything above 140/90 mmHg indicates Hypertension. Reducing dietary sodium, regular light aerobics, and avoiding chronic stress are excellent preventive steps."
        return {"status": "success", "reply": reply, "intent": "faq"}

    # Default fallback
    reply = f"Thank you for sharing. As an AI Healthcare Assistant, I recommend consulting one of our verified medical professionals or checking your personalized Patient Dashboard for exact health trends. Can I assist you with booking an appointment or running a detailed AI Medical Report Analysis?"
    return {"status": "success", "reply": reply, "intent": "general_assistance"}
