import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
from data.seed_data import (
    SEED_USERS, SEED_HOTSPOTS, SEED_SENSORS, 
    SEED_INCIDENTS, SEED_ALERTS, SEED_DISTRICTS,
    SEED_MONTHLY_INCIDENTS, SEED_RAINFALL_VS_MOISTURE, SEED_FORECAST_72H
)

class AquaVisionDB:
    def __init__(self):
        self.users: List[Dict[str, Any]] = list(SEED_USERS)
        self.hotspots: List[Dict[str, Any]] = list(SEED_HOTSPOTS)
        self.sensors: List[Dict[str, Any]] = list(SEED_SENSORS)
        self.incidents: List[Dict[str, Any]] = list(SEED_INCIDENTS)
        self.alerts: List[Dict[str, Any]] = list(SEED_ALERTS)
        self.districts: List[Dict[str, Any]] = list(SEED_DISTRICTS)
        self.monthly_incidents = list(SEED_MONTHLY_INCIDENTS)
        self.rainfall_vs_moisture = list(SEED_RAINFALL_VS_MOISTURE)
        self.forecast_72h = list(SEED_FORECAST_72H)

    # User operations
    def find_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        for u in self.users:
            if u["email"].lower() == email.lower():
                return u
        return None

    def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        user_data["id"] = f"usr-{uuid.uuid4().hex[:6]}"
        user_data["created_at"] = datetime.utcnow().isoformat() + "Z"
        self.users.append(user_data)
        return user_data

    # Incident operations
    def get_incidents(self, status: Optional[str] = None) -> List[Dict[str, Any]]:
        if status:
            return [inc for inc in self.incidents if inc["status"].lower() == status.lower()]
        return self.incidents

    def create_incident(self, data: Dict[str, Any]) -> Dict[str, Any]:
        new_inc = {
            "id": f"inc-{uuid.uuid4().hex[:6]}",
            "title": data["title"],
            "hazard_type": data["hazard_type"],
            "severity": data["severity"],
            "description": data["description"],
            "latitude": data["latitude"],
            "longitude": data["longitude"],
            "location_name": data["location_name"],
            "image_url": data.get("image_url") or "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80",
            "video_url": data.get("video_url"),
            "reporter_name": data.get("reporter_name", "Citizen Reporter"),
            "reporter_phone": data.get("reporter_phone"),
            "status": "Pending",
            "verified_by": None,
            "verified_at": None,
            "upvotes": 1,
            "created_at": datetime.utcnow().isoformat() + "Z"
        }
        self.incidents.insert(0, new_inc)
        return new_inc

    def update_incident_status(self, incident_id: str, status: str, verified_by: Optional[str] = None) -> Optional[Dict[str, Any]]:
        for inc in self.incidents:
            if inc["id"] == incident_id:
                inc["status"] = status
                if status == "Verified":
                    inc["verified_by"] = verified_by or "District Disaster Control Room"
                    inc["verified_at"] = datetime.utcnow().isoformat() + "Z"
                return inc
        return None

    def upvote_incident(self, incident_id: str) -> Optional[Dict[str, Any]]:
        for inc in self.incidents:
            if inc["id"] == incident_id:
                inc["upvotes"] = inc.get("upvotes", 0) + 1
                return inc
        return None

    # Alert operations
    def get_alerts(self, active_only: bool = False) -> List[Dict[str, Any]]:
        if active_only:
            return [alt for alt in self.alerts if alt["is_active"]]
        return self.alerts

    def create_alert(self, data: Dict[str, Any]) -> Dict[str, Any]:
        now_str = datetime.utcnow().strftime("%Y%m%d%H%M")
        new_alert = {
            "id": f"ALT-2026-{uuid.uuid4().hex[:4].upper()}",
            "title": data["title"],
            "severity": data["severity"],
            "hazard_type": data["hazard_type"],
            "target_area": data["target_area"],
            "affected_villages": data.get("affected_villages", []),
            "description": data["description"],
            "instructions": data.get("instructions", []),
            "channels": data.get("channels", ["SMS", "Push", "Sirens", "WhatsApp", "CAP"]),
            "latitude": data["latitude"],
            "longitude": data["longitude"],
            "radius_km": data.get("radius_km", 15.0),
            "is_active": True,
            "dispatched_at": datetime.utcnow().isoformat() + "Z",
            "sms_recipients_count": 3500,
            "push_recipients_count": 7800,
            "cap_identifier": f"URN:IN-GOV:NDMA:CAP:{now_str}:{uuid.uuid4().hex[:6].upper()}"
        }
        self.alerts.insert(0, new_alert)
        return new_alert

    def resolve_alert(self, alert_id: str) -> Optional[Dict[str, Any]]:
        for alt in self.alerts:
            if alt["id"] == alert_id:
                alt["is_active"] = False
                return alt
        return None

    # Sensors
    def get_sensors(self) -> List[Dict[str, Any]]:
        return self.sensors

    # Hotspots
    def get_hotspots(self) -> List[Dict[str, Any]]:
        return self.hotspots

    # Analytics
    def get_overview_metrics(self) -> Dict[str, Any]:
        active_alerts = len([a for a in self.alerts if a["is_active"]])
        high_risk_zones = len([h for h in self.hotspots if h["risk_level"] == "HIGH_RISK"])
        pending_incidents = len([i for i in self.incidents if i["status"] == "Pending"])
        
        villages_set = set()
        for h in self.hotspots:
            for v in h.get("connected_villages", []):
                villages_set.add(v)
        
        sensors_online = len([s for s in self.sensors if s["status"] in ["ONLINE", "WARNING", "CRITICAL"]])

        return {
            "active_alerts_count": active_alerts,
            "high_risk_zones_count": high_risk_zones,
            "pending_incidents_count": pending_incidents,
            "connected_villages_count": len(villages_set) if villages_set else 24,
            "total_sensors_online": sensors_online,
            "districts": self.districts,
            "monthly_incidents": self.monthly_incidents,
            "rainfall_vs_moisture_curve": self.rainfall_vs_moisture,
            "forecast_72h": self.forecast_72h
        }

db = AquaVisionDB()
