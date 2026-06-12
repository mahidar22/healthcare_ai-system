import os
import sys
from fastapi.testclient import TestClient

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../backend"))
if ROOT_DIR not in sys.path:
    sys.path.append(ROOT_DIR)

from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api")
    assert response.status_code == 200
    assert response.json()["status"] == "operative"

def test_get_users():
    response = client.get("/api/auth/users")
    assert response.status_code == 200
    assert len(response.json()) >= 3

def test_get_patients():
    response = client.get("/api/patients/")
    assert response.status_code == 200

def test_get_doctors():
    response = client.get("/api/doctors/")
    assert response.status_code == 200

def test_disease_prediction():
    payload = {
        "age": 55,
        "bmi": 28.5,
        "blood_pressure": "140/90",
        "cholesterol": 230,
        "symptoms": "chest pain, shortness of breath",
        "model_type": "random_forest"
    }
    response = client.post("/api/prediction/disease", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert res["status"] == "success"
    assert "prediction_results" in res

def test_chatbot():
    payload = {"message": "hi", "user_role": "patient"}
    response = client.post("/api/chatbot/", json=payload)
    assert response.status_code == 200
    assert response.json()["status"] == "success"

if __name__ == "__main__":
    test_health_check()
    test_get_users()
    test_get_patients()
    test_get_doctors()
    test_disease_prediction()
    test_chatbot()
    print("All backend API integration tests passed successfully!")
