from pydantic import BaseModel


class CaseCreationRequest(BaseModel):
    title: str
    description: str
