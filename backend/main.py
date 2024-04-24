import uuid

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from entities.case import Case
from entities.case_creation_request import CaseCreationRequest
from uuid import uuid4

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# For development, we'll define a few pre-canned responses here and remove in a later step.
example_case_a = Case(id="62b13a15-d4a0-42f5-828c-552fed688a30", title="example_case_a", description="This is an example case")
example_case_b = Case(id="b50b5a38-3111-4914-b0fd-0b817852dbda", title="example_case_b", description="This is an example case")
example_case_c = Case(id="ece3712f-f888-47e6-87f1-370faa9f166a", title="example_case_c", description="This is an example case")
cases_db = {
    example_case_a.id: example_case_a,
    example_case_b.id: example_case_b,
    example_case_c.id: example_case_c,
}


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/cases")
async def create_case(case_creation_request: CaseCreationRequest):
    created_case = Case(id=uuid4(), title=case_creation_request.title, description=case_creation_request.description)
    # persist this case to the database in the next exercise (2.2)
    return created_case.id


@app.get("/cases/{case_id}")
async def get_case(case_id: uuid.UUID):
    print(cases_db)
    return cases_db[case_id]


@app.get("/cases")
async def get_cases():
    return list(cases_db.values())
