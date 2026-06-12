import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Ensure both the root project directory (for ML) and the backend directory (for app) are in sys.path
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../"))

if ROOT_DIR not in sys.path:
    sys.path.append(ROOT_DIR)
if BACKEND_DIR not in sys.path:
    sys.path.append(BACKEND_DIR)

# Import Routers
from app.auth.routes import router as auth_router
from app.patients.routes import router as patients_router
from app.doctors.routes import router as doctors_router
from app.appointments.routes import router as appointments_router
from app.ehr.routes import router as ehr_router
from app.prediction.routes import router as prediction_router
from app.recommendations.routes import router as recommendations_router
from app.analytics.routes import router as analytics_router
from app.chatbot.routes import router as chatbot_router
from app.reports.routes import router as reports_router

app = FastAPI(
    title="AI-Powered Healthcare Prediction & Resource Management System",
    description="Complete self-contained local ML & Operations Backend",
    version="1.0.0"
)

# Enable CORS for complete frontend compatibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads directory exists and mount static files
UPLOADS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../uploads"))
os.makedirs(UPLOADS_DIR, exist_ok=True)
os.makedirs(os.path.join(UPLOADS_DIR, "lab_reports"), exist_ok=True)

app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

# API Prefix registration
api_prefix = "/api"
app.include_router(auth_router, prefix=api_prefix)
app.include_router(patients_router, prefix=api_prefix)
app.include_router(doctors_router, prefix=api_prefix)
app.include_router(appointments_router, prefix=api_prefix)
app.include_router(ehr_router, prefix=api_prefix)
app.include_router(prediction_router, prefix=api_prefix)
app.include_router(recommendations_router, prefix=api_prefix)
app.include_router(analytics_router, prefix=api_prefix)
app.include_router(chatbot_router, prefix=api_prefix)
app.include_router(reports_router, prefix=api_prefix)

@app.get("/")
@app.get("/api")
def health_check():
    return {
        "status": "operative",
        "system": "AI Healthcare Operational Core",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
