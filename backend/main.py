from uuid import UUID, uuid4
from http.client import HTTPException
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from entities.case import Case
from entities.case_creation_request import CaseCreationRequest
from typing import List
from tinydb import TinyDB, Query

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

cases_db = TinyDB('cases_db.json')


@app.exception_handler(HTTPException)
async def http_exception_handler(exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail},
    )


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/cases", response_model=UUID)
async def create_case(case_creation_request: CaseCreationRequest) -> UUID:
    case_uuid = uuid4()
    created_case = Case(id=case_uuid, title=case_creation_request.title, description=case_creation_request.description)
    created_case_dict = created_case.dict()
    created_case_dict['id'] = str(case_uuid)
    try:
        cases_db.insert(created_case_dict)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Unable to persist case information")
    return case_uuid


@app.get("/cases/{case_id}")
async def get_case(case_id: UUID) -> Case:
    case_query = Query()
    result = cases_db.search(case_query.id == str(case_id))
    if result:
        return result[0]
    raise HTTPException(status_code=404, detail="Case not found")


@app.get("/cases")
async def get_cases() -> List[Case]:
    try:
        return cases_db.all()
    except Exception:
        raise HTTPException(status_code=503, detail="Unable to load case information from the database")
