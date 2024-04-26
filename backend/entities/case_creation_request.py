from typing import List, Optional
from entities.step import Step
from pydantic import BaseModel


class CaseCreationRequest(BaseModel):
    procedure_name: str
    cpt_codes: List[str]
    summary: Optional[str]
    is_met: bool
    is_complete: bool
    steps: List[Step]
