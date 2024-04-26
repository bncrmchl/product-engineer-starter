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

# Set up the app, this is what will create our RESTful API
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set up the database where we will persist case information
cases_db = TinyDB('cases_db.json')


# This route is here for development and testing purposes, and simply returns a "hello world" message
@app.get("/")
async def root():
    return {"message": "Hello World"}


# This route allows the user to POST a Case, and have it persisted in the database
@app.post("/cases", response_model=UUID)
async def create_case(case_creation_request: CaseCreationRequest) -> UUID:

    # Generate the ID, and record the creation time, then store in the 'created_case'
    case_uuid = uuid4()
    current_timestamp = int(time.time())
    created_case = Case(
        case_id=case_uuid,
        created_at=current_timestamp,
        status="submitted",
        **case_creation_request.model_dump()
    )

    # Convert the created case to a dict, and convert the uuid to string since tinydb does not like uuids
    created_case_dict = created_case.model_dump()
    created_case_dict['case_id'] = str(case_uuid)

    # Insert the record, return the ID that was used to the caller. Also, begin the simulated backend update process
    try:
        cases_db.insert(created_case_dict)
        # Here we spawn a separate thread to handle the case processing, since it takes 30 seconds
        threading.Thread(target=simulate_backend_process, args=(case_uuid, cases_db)).start()
    except Exception:
        raise HTTPException(status_code=500, detail="Unable to persist case information")
    return created_case_dict['case_id']


# This route retrieve a specific case from the tinydb database
@app.get("/cases/{case_id}")
async def get_case(case_id: UUID) -> Case:
    case_query = Query()
    result = cases_db.search(case_query.case_id == str(case_id))
    if result:
        return result[0]
    raise HTTPException(status_code=404, detail="Case not found")


# This route returns a list of all cases in the tinydb database
@app.get("/cases")
async def get_cases() -> List[Case]:
    try:
        return cases_db.all()
    except Exception:
        raise HTTPException(status_code=503, detail="Unable to load case information from the database")
