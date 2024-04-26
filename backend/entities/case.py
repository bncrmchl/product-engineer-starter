from uuid import UUID
from typing import List, Optional
from pydantic import BaseModel
from entities.step import Step


class Case(BaseModel):
    case_id: UUID
    status: str
    created_at: int
    procedure_name: str
    cpt_codes: List[str]
    summary: Optional[str]
    is_met: bool
    is_complete: bool
    steps: List[Step]
