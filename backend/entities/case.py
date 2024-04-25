from pydantic import BaseModel
import uuid


class Case(BaseModel):
    id: uuid.UUID
    title: str
    description: str
    created_at: int
    status: str
