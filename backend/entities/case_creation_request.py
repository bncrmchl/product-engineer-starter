from typing import List, Optional
from entities.step import Step
from pydantic import BaseModel


# A case request contains all the necessary fields to create a Case, it is ingested by the API
class CaseCreationRequest(BaseModel):
    procedure_name: str
    cpt_codes: List[str]
    summary: Optional[str]
    is_met: bool
    is_complete: bool
    steps: List[Step]
