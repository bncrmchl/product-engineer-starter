from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}


def test_create_case_success():
    case_data = {
        "procedure_name": "Facet Joint Injection",
        "cpt_codes": [
            "64490",
            "64491",
            "64492",
            "64493",
            "64494",
            "64495"
        ],
        "summary": None,
        "is_met": False,
        "is_complete": True,
        "steps": []
    }
    response = client.post("/cases", json=case_data)
    assert response.status_code == 200
    assert isinstance(response.json(), str)  # Should return the UUID as string


def test_create_case_failure():
    # Simulate a failure, for example by passing incomplete data
    case_data = {"title": "Incomplete Case"}
    response = client.post("/cases", json=case_data)
    assert response.status_code == 422  # Assuming Pydantic validation catches this


def test_get_case_success():
    # First, create a case to ensure there is one to retrieve
    case_data = {
        "procedure_name": "Facet Joint Injection",
        "cpt_codes": [
            "64490",
            "64491",
            "64492",
            "64493",
            "64494",
            "64495"
        ],
        "summary": None,
        "is_met": False,
        "is_complete": True,
        "steps": []
    }
    create_response = client.post("/cases", json=case_data)
    case_id = create_response.json()

    # Now retrieve the case
    response = client.get(f"/cases/{case_id}")
    assert response.status_code == 200
    assert response.json()['case_id'] == case_id


def test_get_case_failure():
    # Test with a non-existing UUID
    response = client.get("/cases/12345678-1234-1234-1234-123456789abc")
    assert response.status_code == 404
    assert response.json()['detail'] == "Case not found"


def test_get_cases():
    response = client.get("/cases")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
