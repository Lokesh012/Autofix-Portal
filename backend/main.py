from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, get_db, Base
from models import Incident
from schemas import IncidentCreate

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Autofix API",
    description="Incident and Operations Management API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "application": "Autofix",
        "service": "FastAPI Backend"
    }


@app.get("/incidents")
def get_incidents(db: Session = Depends(get_db)):

    incidents = db.query(Incident).all()

    return {
        "count": len(incidents),
        "incidents": incidents
    }


@app.post("/incidents")
def create_incident(
    incident: IncidentCreate,
    db: Session = Depends(get_db)
):

    count = db.query(Incident).count()

    new_incident = Incident(
        incident_id=f"INC-{10483 + count}",
        title=incident.title,
        description=incident.description,
        service=incident.service,
        severity=incident.severity,
        status="New",
        environment=incident.environment,
        assigned_to=incident.assigned_to
    )

    db.add(new_incident)
    db.commit()
    db.refresh(new_incident)

    return new_incident
