from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime

# ================= AUTH SCHEMAS =================
class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    role: str = Field(default="citizen", description="citizen | officer | admin")
    phone: Optional[str] = None
    department: Optional[str] = None
    jurisdiction_district: Optional[str] = None

class UserOut(BaseModel):
    id: str
    name: str
    email: str
    role: str
    phone: Optional[str] = None
    department: Optional[str] = None
    jurisdiction_district: Optional[str] = None
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

# ================= AI PREDICTION SCHEMAS =================
class PredictionInput(BaseModel):
    rainfall_24h_mm: float = Field(..., ge=0, le=1000, description="24-hour cumulative rainfall in mm")
    soil_moisture_pct: float = Field(..., ge=0, le=100, description="Volumetric soil moisture percentage (0-100%)")
    slope_angle_deg: float = Field(..., ge=0, le=90, description="Slope inclination angle in degrees")
    vegetation_index_ndvi: float = Field(..., ge=-0.5, le=1.0, description="Normalized Difference Vegetation Index (-0.5 to 1.0)")
    historical_risk_score: float = Field(..., ge=0.0, le=1.0, description="Historical landslide susceptibility index (0.0 to 1.0)")
    soil_type: Optional[str] = Field(default="Sandy Loam / Debris", description="Soil classification: Clay, Silt, Sandy Loam / Debris, Gravel, Bedrock")
    location_name: Optional[str] = Field(default="Wayanad High Ranges", description="Target geographical area name")
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class FeatureImportanceItem(BaseModel):
    factor: str
    contribution_pct: float
    impact_direction: str  # "Increases Risk" | "Reduces Risk"
    value_display: str

class PredictionOutput(BaseModel):
    risk_level: str  # "SAFE" | "MEDIUM_RISK" | "HIGH_RISK"
    risk_score_pct: float  # 0.0 to 100.0
    confidence_pct: float  # e.g. 93.4%
    factor_of_safety: float  # Geotechnical proxy Fs
    summary: str
    factors_breakdown: List[FeatureImportanceItem]
    recommended_actions: List[str]
    evacuation_urgency: str  # "None" | "Advisory / Yellow Alert" | "Immediate Evacuation / Red Alert"
    timestamp: str

# ================= CITIZEN INCIDENT SCHEMAS =================
class IncidentCreate(BaseModel):
    title: str
    hazard_type: str = Field(..., description="Rockfall | Mudslide | Road Subsidence | Hillside Crack | River Flooding | Debris Flow")
    severity: str = Field(..., description="Minor | Moderate | Severe | Critical")
    description: str
    latitude: float
    longitude: float
    location_name: str
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    reporter_name: Optional[str] = "Citizen Reporter"
    reporter_phone: Optional[str] = None

class IncidentOut(BaseModel):
    id: str
    title: str
    hazard_type: str
    severity: str
    description: str
    latitude: float
    longitude: float
    location_name: str
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    reporter_name: str
    reporter_phone: Optional[str] = None
    status: str  # "Pending" | "Verified" | "Resolved" | "Rejected"
    verified_by: Optional[str] = None
    verified_at: Optional[str] = None
    upvotes: int = 0
    created_at: str

class IncidentStatusUpdate(BaseModel):
    status: str
    verified_by: Optional[str] = None
    action_note: Optional[str] = None

# ================= ALERT SCHEMAS =================
class AlertCreate(BaseModel):
    title: str
    severity: str = Field(..., description="Safe | Moderate | High | Critical")
    hazard_type: str
    target_area: str
    affected_villages: List[str]
    description: str
    instructions: List[str]
    channels: List[str] = Field(default=["SMS", "Push", "Sirens", "WhatsApp", "CAP"])
    latitude: float
    longitude: float
    radius_km: float = 15.0

class AlertOut(BaseModel):
    id: str
    title: str
    severity: str
    hazard_type: str
    target_area: str
    affected_villages: List[str]
    description: str
    instructions: List[str]
    channels: List[str]
    latitude: float
    longitude: float
    radius_km: float
    is_active: bool
    dispatched_at: str
    sms_recipients_count: int
    push_recipients_count: int
    cap_identifier: str

# ================= SENSOR TELEMETRY SCHEMAS =================
class SensorNode(BaseModel):
    id: str
    name: str
    location_name: str
    latitude: float
    longitude: float
    elevation_m: float
    status: str  # "ONLINE" | "WARNING" | "CRITICAL" | "OFFLINE"
    rainfall_rate_mm_hr: float
    soil_moisture_pct: float
    tilt_degrees: float
    pore_water_pressure_kpa: float
    battery_pct: int
    last_ping: str
    recent_trend: List[Dict[str, Any]]

# ================= ANALYTICS SCHEMAS =================
class DistrictRiskSummary(BaseModel):
    district: str
    state: str
    risk_level: str
    active_alerts: int
    sensor_count: int
    vulnerable_population: int
    primary_hotspots: List[str]

class AnalyticsOverview(BaseModel):
    active_alerts_count: int
    high_risk_zones_count: int
    pending_incidents_count: int
    connected_villages_count: int
    total_sensors_online: int
    districts: List[DistrictRiskSummary]
    monthly_incidents: List[Dict[str, Any]]
    rainfall_vs_moisture_curve: List[Dict[str, Any]]
    forecast_72h: List[Dict[str, Any]]
