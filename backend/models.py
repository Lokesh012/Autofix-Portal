from sqlalchemy import Column, Integer, String, Text
from database import Base


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(String(50), unique=True, nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    service = Column(String(100), nullable=False)
    severity = Column(String(30), nullable=False)
    status = Column(String(50), default="New")
    environment = Column(String(50), default="Production")
    assigned_to = Column(String(100))
