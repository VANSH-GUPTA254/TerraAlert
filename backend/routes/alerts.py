from fastapi import APIRouter, Response, HTTPException, Query
from typing import List, Optional
from schemas import AlertCreate, AlertOut
from database import db
from datetime import datetime

router = APIRouter(prefix="/alerts", tags=["Emergency Alerts & Early Warning"])

@router.get("/", response_model=List[AlertOut])
def get_alerts(active_only: bool = Query(False, description="Filter for active warnings")):
    return db.get_alerts(active_only=active_only)

@router.post("/", response_model=AlertOut)
def broadcast_emergency_alert(data: AlertCreate):
    """
    Broadcasts a new early warning alert across SMS, Push Notification,
    Outdoor Acoustic Sirens, WhatsApp Broadcast, and CAP 1.2 Feed.
    """
    return db.create_alert(data.model_dump())

@router.post("/{alert_id}/resolve", response_model=AlertOut)
def resolve_emergency_alert(alert_id: str):
    updated = db.resolve_alert(alert_id)
    if not updated:
        raise HTTPException(status_code=404, detail="Alert not found")
    return updated

@router.get("/{alert_id}/cap.xml")
def export_cap_xml(alert_id: str):
    """
    Generates standard OASIS Common Alerting Protocol (CAP v1.2) XML
    for NDMA / national emergency integration.
    """
    alert = next((a for a in db.alerts if a["id"] == alert_id), None)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    instructions_xml = "\n".join([f"    <instruction>{inst}</instruction>" for inst in alert.get("instructions", [])])
    
    xml_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>{alert["cap_identifier"]}</identifier>
  <sender>ndma-control@terraalert.gov.in</sender>
  <sent>{alert["dispatched_at"]}</sent>
  <status>Actual</status>
  <msgType>Alert</msgType>
  <scope>Public</scope>
  <info>
    <category>Geo</category>
    <event>{alert["hazard_type"]}</event>
    <urgency>Immediate</urgency>
    <severity>{alert["severity"]}</severity>
    <certainty>Observed</certainty>
    <eventCode>
      <valueName>SAME</valueName>
      <value>EWW</value>
    </eventCode>
    <headline>{alert["title"]}</headline>
    <description>{alert["description"]}</description>
{instructions_xml}
    <area>
      <areaDesc>{alert["target_area"]}</areaDesc>
      <circle>{alert["latitude"]},{alert["longitude"]},{alert["radius_km"]}</circle>
    </area>
  </info>
</alert>"""

    return Response(content=xml_content, media_type="application/xml")
