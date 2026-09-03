export type UserRole = 'citizen' | 'officer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  department?: string;
  jurisdiction_district?: string;
  created_at?: string;
}

export type RiskLevel = 'SAFE' | 'MEDIUM_RISK' | 'HIGH_RISK';

export interface FeatureImportanceItem {
  factor: string;
  contribution_pct: number;
  impact_direction: string;
  value_display: string;
}

export interface PredictionInput {
  rainfall_24h_mm: number;
  soil_moisture_pct: number;
  slope_angle_deg: number;
  vegetation_index_ndvi: number;
  historical_risk_score: number;
  soil_type?: string;
  location_name?: string;
  latitude?: number;
  longitude?: number;
}

export interface PredictionOutput {
  risk_level: RiskLevel;
  risk_score_pct: number;
  confidence_pct: number;
  factor_of_safety: number;
  summary: string;
  factors_breakdown: FeatureImportanceItem[];
  recommended_actions: string[];
  evacuation_urgency: string;
  timestamp: string;
}

export type HazardType = 'Rockfall' | 'Mudslide' | 'Road Subsidence' | 'Hillside Crack' | 'River Flooding' | 'Debris Flow';
export type IncidentSeverity = 'Minor' | 'Moderate' | 'Severe' | 'Critical';
export type IncidentStatus = 'Pending' | 'Verified' | 'Resolved' | 'Rejected';

export interface IncidentCreate {
  title: string;
  hazard_type: HazardType;
  severity: IncidentSeverity;
  description: string;
  latitude: number;
  longitude: number;
  location_name: string;
  image_url?: string;
  video_url?: string;
  reporter_name?: string;
  reporter_phone?: string;
}

export interface IncidentReport {
  id: string;
  title: string;
  hazard_type: HazardType;
  severity: IncidentSeverity;
  description: string;
  latitude: number;
  longitude: number;
  location_name: string;
  image_url?: string;
  video_url?: string;
  reporter_name: string;
  reporter_phone?: string;
  status: IncidentStatus;
  verified_by?: string;
  verified_at?: string;
  upvotes: number;
  created_at: string;
}

export interface AlertNotification {
  id: string;
  title: string;
  severity: 'Safe' | 'Moderate' | 'High' | 'Critical';
  hazard_type: string;
  target_area: string;
  affected_villages: string[];
  description: string;
  instructions: string[];
  channels: string[];
  latitude: number;
  longitude: number;
  radius_km: number;
  is_active: boolean;
  dispatched_at: string;
  sms_recipients_count: number;
  push_recipients_count: number;
  cap_identifier: string;
}

export interface CriticalInfrastructure {
  type: 'Bridge' | 'Shelter' | 'Hospital' | 'Road' | 'Helipad' | 'Railway';
  name: string;
  status?: string;
  capacity?: number;
  beds?: number;
  lat: number;
  lng: number;
}

export interface HotspotZone {
  id: string;
  name: string;
  district: string;
  state: string;
  risk_level: RiskLevel;
  risk_score: number;
  latitude: number;
  longitude: number;
  elevation_m: number;
  vulnerable_population: number;
  connected_villages: string[];
  critical_infrastructure: CriticalInfrastructure[];
  polygon_coordinates: [number, number][];
}

export interface SensorNode {
  id: string;
  name: string;
  location_name: string;
  latitude: number;
  longitude: number;
  elevation_m: number;
  status: 'ONLINE' | 'WARNING' | 'CRITICAL' | 'OFFLINE';
  rainfall_rate_mm_hr: number;
  soil_moisture_pct: number;
  tilt_degrees: number;
  pore_water_pressure_kpa: number;
  battery_pct: number;
  last_ping: string;
  recent_trend: {
    time: string;
    rainfall: number;
    moisture: number;
    tilt: number;
  }[];
}

export interface DistrictSummary {
  district: string;
  state: string;
  risk_level: string;
  active_alerts: number;
  sensor_count: number;
  vulnerable_population: number;
  primary_hotspots: string[];
}

export interface AnalyticsData {
  active_alerts_count: number;
  high_risk_zones_count: number;
  pending_incidents_count: number;
  connected_villages_count: number;
  total_sensors_online: number;
  districts: DistrictSummary[];
  monthly_incidents: {
    month: string;
    incidents: number;
    rainfall_mm: number;
    resolved: number;
  }[];
  rainfall_vs_moisture_curve: {
    rainfall_tier: string;
    saturation_pct: number;
    landslide_probability_pct: number;
  }[];
  forecast_72h: {
    time: string;
    expected_rain_mm: number;
    soil_saturation: number;
    risk_category: string;
    color: string;
  }[];
}
