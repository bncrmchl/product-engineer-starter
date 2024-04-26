from typing import List
from pydantic import BaseModel
from entities.option import Option


class Step(BaseModel):
    key: str
    question: str
    options: List[Option]
    reasoning: str
    decision: str
    next_step: str
    is_met: bool
    is_final: bool
    evidence: List[dict]
