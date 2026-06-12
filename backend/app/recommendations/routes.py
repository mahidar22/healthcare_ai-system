from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict

router = APIRouter(prefix="/recommendations", tags=["Treatment Recommendations"])

class RecommendationInput(BaseModel):
    disease: str
    risk_score: float
    symptoms: str
    severity_level: str

@router.post("/")
def get_treatment_recommendation(data: RecommendationInput):
    disease_key = data.disease.lower()
    
    # Defaults
    recommended_specialist = "General Physician"
    suggested_treatments = ["Rest and hydration", "Regular follow-up"]
    diagnostic_tests = ["Complete Blood Count (CBC)", "Basic Metabolic Panel"]
    lifestyle_changes = ["Maintain a balanced diet", "Aim for 7-8 hours of quality sleep"]
    
    if "diabetes" in disease_key:
        recommended_specialist = "Endocrinologist"
        suggested_treatments = [
            "Metformin 500mg initial therapy (Subject to doctor prescription)",
            "Continuous Glucose Monitoring (CGM)",
            "Strict glycemic control and insulin sensitivity optimization"
        ]
        diagnostic_tests = ["HbA1c Test", "Fasting & Post-Prandial Plasma Glucose", "Renal Function Test (Microalbuminuria)"]
        lifestyle_changes = ["Low glycemic index diet", "30-45 minutes of daily cardiovascular exercise", "Avoid artificial sweeteners and refined sugar"]
        
    elif "heart" in disease_key or "cardio" in disease_key:
        recommended_specialist = "Cardiologist"
        suggested_treatments = [
            "Statins (e.g., Atorvastatin) for cholesterol management",
            "Anti-hypertensive therapy (e.g., ACE inhibitors or Beta-blockers)",
            "Aspirin low-dose prophylaxis (Consult specialist)"
        ]
        diagnostic_tests = ["12-Lead Electrocardiogram (ECG)", "2D Echocardiogram", "TMT (Treadmill Test)", "Lipid Profile & hs-CRP"]
        lifestyle_changes = ["DASH Diet (Low sodium < 1.5g daily)", "Avoid trans fats and saturated animal fats", "Stress mitigation via yoga or meditation"]
        
    elif "kidney" in disease_key or "renal" in disease_key:
        recommended_specialist = "Nephrologist"
        suggested_treatments = [
            "Blood pressure regulation to preserve remaining GFR",
            "Diuretics for edema and fluid retention",
            "Erythropoiesis-stimulating agents if severe anemia is present"
        ]
        diagnostic_tests = ["Estimated Glomerular Filtration Rate (eGFR)", "Serum Creatinine & BUN", "Kidney Ultrasound", "Urine Protein-to-Creatinine Ratio"]
        lifestyle_changes = ["Restricted protein diet", "Strict potassium and phosphorus monitoring", "Accurate fluid intake regulation"]
        
    elif "cancer" in disease_key or "oncology" in disease_key:
        recommended_specialist = "Oncologist"
        suggested_treatments = [
            "Thorough oncology staging and multi-disciplinary tumor board review",
            "Targeted immunotherapy or localized radiotherapy evaluation",
            "Surgical biopsy and staging assessment"
        ]
        diagnostic_tests = ["Whole-body PET-CT Scan", "Specific Tumor Markers (e.g., PSA, CA 125, CEA)", "Targeted Tissue Biopsy", "Genetic sequencing (BRCA1/2)"]
        lifestyle_changes = ["Antioxidant-rich whole food nutrition", "Complete cessation of smoking and alcohol", "Gentle physical therapy"]
        
    return {
        "status": "success",
        "disease_analyzed": data.disease,
        "recommended_specialist": recommended_specialist,
        "suggested_treatments": suggested_treatments,
        "recommended_diagnostic_tests": diagnostic_tests,
        "recommended_lifestyle_modifications": lifestyle_changes,
        "urgency": "Immediate Appointment Required" if data.severity_level in ["High", "Critical"] else "Routine Consultation"
    }
