from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from schemas import IncidentCreate, IncidentOut, IncidentStatusUpdate
from database import db

router = APIRouter(prefix="/incidents", tags=["Citizen Incident Reporting"])

@router.get("/", response_model=List[IncidentOut])
def list_incidents(status: Optional[str] = Query(None, description="Filter by status: Pending | Verified | Resolved")):
    return db.get_incidents(status)

@router.post("/", response_model=IncidentOut)
def submit_citizen_incident(data: IncidentCreate):
    """
    Submits a crowd-sourced hazard report with geocoded coordinates,
    media attachment url, hazard classification, and description.
    """
    return db.create_incident(data.model_dump())

@router.patch("/{incident_id}/status", response_model=IncidentOut)
def update_incident_status(incident_id: str, update: IncidentStatusUpdate):
    """
    Allows Government Officers & Disaster Admins to verify, dispatch relief,
    or resolve reported citizen incidents.
    """
    updated = db.update_incident_status(
        incident_id=incident_id,
        status=update.status,
        verified_by=update.verified_by
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Incident report not found")
    return updated

@router.post("/{incident_id}/upvote", response_model=IncidentOut)
def upvote_incident(incident_id: str):
    """Community confirmation upvote for hazard verification."""
    updated = db.upvote_incident(incident_id)
    if not updated:
        raise HTTPException(status_code=404, detail="Incident report not found")
    return updated
