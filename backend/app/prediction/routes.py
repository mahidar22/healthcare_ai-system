from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/prediction", tags=["AI Disease Prediction"])

class DiseasePredictionInput(BaseModel):
    age: int
    bmi: float
    blood_pressure: str
    cholesterol: int
    symptoms: str
    model_type: Optional[str] = "random_forest" # "random_forest", "xgboost", "logistic_regression"

@router.post("/disease")
def predict_disease_api(data: DiseasePredictionInput):
    import ml.disease_prediction.predict as disease_predictor
    
    input_dict = {
        "age": data.age,
        "bmi": data.bmi,
        "blood_pressure": data.blood_pressure,
        "cholesterol": data.cholesterol,
        "symptoms": data.symptoms
    }
    
    res = disease_predictor.predict_disease(input_dict, data.model_type)
    return {
        "status": "success",
        "input_features": input_dict,
        "prediction_results": res
    }
