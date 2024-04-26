from typing import List
from pydantic import BaseModel
from entities.option import Option


# A Step represents one step in the process of assessing a Case, and contains a question and several options for the next step
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
