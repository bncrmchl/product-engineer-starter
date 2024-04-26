# Standard library imports
import threading
import time
from typing import List
from uuid import UUID, uuid4

# Third-party library imports
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from tinydb import TinyDB, Query

# Local application imports
from entities.case import Case
from entities.case_creation_request import CaseCreationRequest
from process_simulator.backend_process_simulator import simulate_backend_process

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

cases_db = TinyDB('cases_db.json')


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/cases", response_model=UUID)
async def create_case(case_creation_request: CaseCreationRequest) -> UUID:
    case_uuid = uuid4()
    current_timestamp = int(time.time())
    created_case = Case(
        case_id=case_uuid,
        created_at=current_timestamp,
        status="submitted",
        **case_creation_request.model_dump()
    )

    created_case_dict = created_case.model_dump()
    created_case_dict['case_id'] = str(case_uuid)

    print(created_case_dict)

    try:
        cases_db.insert(created_case_dict)
        threading.Thread(target=simulate_backend_process, args=(case_uuid, cases_db)).start()
    except Exception:
        raise HTTPException(status_code=500, detail="Unable to persist case information")
    return created_case_dict['case_id']


@app.get("/cases/{case_id}")
async def get_case(case_id: UUID) -> Case:
    case_query = Query()
    result = cases_db.search(case_query.case_id == str(case_id))
    if result:
        return result[0]
    raise HTTPException(status_code=404, detail="Case not found")


@app.get("/cases")
async def get_cases() -> List[Case]:
    try:
        return cases_db.all()
    except Exception:
        raise HTTPException(status_code=503, detail="Unable to load case information from the database")
