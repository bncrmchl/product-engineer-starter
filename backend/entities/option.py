from pydantic import BaseModel


class Option(BaseModel):
    key: str
    text: str
    selected: bool
