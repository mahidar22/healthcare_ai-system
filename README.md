# 🏥 AI-Powered Healthcare Prediction & Resource Management System

A cutting-edge, state-of-the-art Operational & Machine Learning Healthcare platform built with **React.js (Vite + Tailwind CSS)** and **Python (FastAPI + Scikit-Learn + XGBoost)**. 

This system runs completely on your local machine without needing cloud databases, external APIs, Docker, or external hosting services. It simulates hospital resource usage, provides automated OCR medical report extraction, parses electronic health records, predicts disease risks via custom pre-trained ML ensembles, and tracks hospital infrastructure in real time.

---

## 📂 Complete Project Structure

```
healthcare-ai-system/             <-- (Your VS Code Workspace Root)
│
├── frontend/                     # Modern React.js (Vite + Tailwind v4) Frontend SPA
│   ├── src/
│   │   ├── components/           # Navbar, Sidebar, AIChatbotModal, Notifications
│   │   ├── context/              # AuthContext (Instant Role Switcher)
│   │   ├── layouts/              # MainLayout
│   │   ├── pages/                # Patient, Doctor, Admin, EHR, ML, Beds & Resource Centers
│   │   ├── services/             # Axios API Client setup
│   │   ├── App.jsx               # Main React Router Routing
│   │   └── index.css             # Base Healthcare styling & custom animations
│   ├── vercel.json               # Edge Rewrite Rules for Vercel SPA deployment
│   └── package.json
│
├── backend/                      # High-Performance Python FastAPI Backend
│   ├── app/
│   │   ├── analytics/            # Admin dashboard, Bed usage, Resource Tracking APIs
│   │   ├── appointments/         # Appointment booking & scheduling Core
│   │   ├── auth/                 # Role-based user authentication Core
│   │   ├── chatbot/              # Self-contained Rule/NLP healthcare Triage Assistant
│   │   ├── doctors/              # Specialist availability & Assigned patient APIs
│   │   ├── ehr/                  # Electronic Health Records & Prescriptions Storage
│   │   ├── patients/             # Patient census & Lab scan OCR Parse Gateway
│   │   ├── prediction/           # Machine Learning Forward Pass Engine
│   │   ├── recommendations/      # Treatment protocol & Diagnostic recommendation engine
│   │   ├── reports/              # Aggregated statistical reporting Core
│   │   └── main.py               # Uvicorn ASGI Server Initializer & Static Mounter
│   ├── generate_dummy_data.py    # Automated dataset & dummy entry Populator
│   └── requirements.txt
│
├── ml/                           # Complete Machine Learning Pipelines & Pre-trained Pickles
│   ├── disease_prediction/       # Random Forest, XGBoost, Logistic Regressors
│   ├── outcome_prediction/       # Hospital recovery probability & ICU Regressors
│   ├── bed_forecasting/          # 7-Day multi-step hospital bed demand Time-Series Models
│   └── report_analysis/          # OCR-based visual lab extractor & Physiological rules
│
├── data/                         # Local Self-Contained CSV/JSON Databases
│   ├── patients.csv, doctors.csv, appointments.csv, beds.csv, resources.csv, reports.csv
│   └── ehr.json, users.json, notifications.json
│
├── uploads/                      # Mounted lab reports, PDF prescriptions & Medical scans
│
├── tests/                        # Automated backend API integration testing Core
│
├── README.md                     # Comprehensive execution guide
├── render.yaml                   # Render.com Blueprint spec for Instant Cloud Backend Deployment
└── requirements.txt              # Root Python dependency dependencies
```

---

## 💻 Exact Execution Commands in VS Code (Windows)

Since you have already opened `healthcare-ai-system` in VS Code, you are already inside the root directory (`PS C:\Users\LENOVO\Desktop\healthcare-ai-system>`). 

Use these exact commands in your two separate terminals:

### 🐍 1. Start the Python FastAPI Backend
In your first VS Code terminal (already in the root folder):
```powershell
# Activate your Virtual Environment
.\venv\Scripts\activate

# Install all required dependencies
pip install -r requirements.txt

# Generate local dummy datasets and pre-train the Machine Learning Models
python backend/generate_dummy_data.py

# Launch the FastAPI Operational Server
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
*The backend API will run at [http://localhost:8000/api](http://localhost:8000/api) and Swagger Docs at [http://localhost:8000/docs](http://localhost:8000/docs).*

### ⚛️ 2. Start the React UI SPA
Open a second terminal in VS Code and run:
```powershell
# Simply jump directly into the frontend folder
cd frontend

# Install Node dependencies
npm install

# Start Vite live React server
npm run dev
```
*Your frontend UI will launch automatically at [http://localhost:3000](http://localhost:3000) (or http://localhost:5173). All `/api` requests are auto-proxied to your Python server on port 8000!*

---

## 🚀 Cloud Deployment Guide

### 🔺 Deploying Frontend on Vercel
Your React application is completely configured for Vercel with a built-in `vercel.json` rewrite configuration so client-side routing works without 404 errors.

1. Connect your GitHub repository.
2. In your [Vercel Dashboard](https://vercel.com), click **Add New Project** and import your repository.
3. Configure the following project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. **Environment Variables**:
   - Add `VITE_API_URL` pointing to your deployed Render backend URL (e.g., `https://healthcare-ai-backend.onrender.com/api`).
5. Click **Deploy**.

### ☁️ Deploying Backend on Render
Your Python application includes a fully optimized `render.yaml` infrastructure Blueprint.

**Option A: Automated Blueprint Deployment (Easiest)**
1. In your [Render Dashboard](https://dashboard.render.com), click **New** -> **Blueprint**.
2. Connect your GitHub repository. Render will automatically detect `render.yaml` and provision your Web Service instantly.

**Option B: Manual Web Service Setup**
1. Click **New** -> **Web Service** in Render.
2. Connect your GitHub repo.
3. Configure the following execution specifications:
   - **Name**: `healthcare-ai-backend`
   - **Language / Runtime**: `Python 3`
   - **Root Directory**: Leave blank (or `/`)
   - **Build Command**: 
     ```bash
     pip install -r backend/requirements.txt && python backend/generate_dummy_data.py
     ```
   - **Start Command**: 
     ```bash
     uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT
     ```
4. Click **Create Web Service**. Render manages your `$PORT` dynamically.
