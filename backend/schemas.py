from pydantic import BaseModel
from typing import Optional


class IncidentCreate(BaseModel):
    title: str
    description: str
    service: str
    severity: str
    environment: str = "Production"
    assigned_to: Optional[str] = None
