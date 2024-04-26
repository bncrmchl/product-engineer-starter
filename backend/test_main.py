from fastapi.testclient import TestClient
import time
from main import app

client = TestClient(app)


# A simple test for the root API endpoint
def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}


# Verify that case creation fails when submitting malformed request
def test_create_case_failure():
    # Simulate a failure, for example by passing incomplete data
    case_data = {"title": "Incomplete Case"}
    response = client.post("/cases", json=case_data)
    assert response.status_code == 422  # Assuming Pydantic validation catches this


# Verify creating a case, backend processing of a case. Since the simulated case processing takes 30 seconds, so does this test.
def test_create_processing_and_deletion():
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
    response = client.post("/cases", json=case_data)

    assert response.status_code == 200
    assert isinstance(response.json(), str)

    case_id = response.json()

    # Now retrieve the case
    response = client.get(f"/cases/{case_id}")
    assert response.status_code == 200
    assert response.json()['case_id'] == case_id
    assert response.json()['status'] == "submitted"

    time.sleep(10)

    # Now retrieve the case again, the status should be processing.
    response = client.get(f"/cases/{case_id}")
    assert response.status_code == 200
    assert response.json()['case_id'] == case_id
    assert response.json()['status'] == "processing"

    time.sleep(20)

    # Now retrieve the case again, the status should be complete.
    response = client.get(f"/cases/{case_id}")
    assert response.status_code == 200
    assert response.json()['case_id'] == case_id
    assert response.json()['status'] == "complete"


# Verify that get case fails when using an invalid key
def test_get_case_failure():
    # Test with a non-existing UUID
    response = client.get("/cases/12345678-1234-1234-1234-123456789abc")
    assert response.status_code == 404
    assert response.json()['detail'] == "Case not found"


# Verify that the get cases endpoint returns a list (may be empty)
def test_get_cases():
    response = client.get("/cases")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
