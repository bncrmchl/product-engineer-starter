from pydantic import BaseModel


# An option represents one option within a step for assessing a Case
class Option(BaseModel):
    key: str
    text: str
    selected: bool
