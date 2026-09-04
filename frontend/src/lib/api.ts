import {
  PredictionInput,
  PredictionOutput,
  IncidentReport,
  IncidentCreate,
  AlertNotification,
  SensorNode,
  HotspotZone,
  AnalyticsData,
  User,
  UserRole
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Fallback seed stores for offline/standalone execution
const LOCAL_STORAGE_KEY_INCIDENTS = 'aqv_incidents_v2';
const LOCAL_STORAGE_KEY_ALERTS = 'aqv_alerts_v2';

const SEED_HOTSPOTS: HotspotZone[] = [
  {
    id: "hotspot-01",
    name: "Chooralmala & Mundakkai Ridge",
    district: "Wayanad",
    state: "Kerala",
    risk_level: "HIGH_RISK",
    risk_score: 88.4,
    latitude: 11.5348,
    longitude: 76.1783,
    elevation_m: 1280,
    vulnerable_population: 4850,
    connected_villages: ["Chooralmala", "Mundakkai", "Attamala", "Meppadi"],
    critical_infrastructure: [
      { type: "Bridge", name: "Vellarmala Bailey Pass", status: "Submerged/High Risk", lat: 11.5312, lng: 76.1750 },
      { type: "Shelter", name: "St. Joseph Relief Camp, Meppadi", capacity: 650, lat: 11.5510, lng: 76.1260 },
      { type: "Hospital", name: "Meppadi Community Health Center", beds: 45, lat: 11.5540, lng: 76.1285 }
    ],
    polygon_coordinates: [
      [11.5200, 76.1600],
      [11.5500, 76.1620],
      [11.5600, 76.1950],
      [11.5300, 76.2050],
      [11.5150, 76.1800]
    ]
  },
  {
    id: "hotspot-02",
    name: "Joshimath Manohar Bagh Slopes",
    district: "Chamoli",
    state: "Uttarakhand",
    risk_level: "HIGH_RISK",
    risk_score: 79.2,
    latitude: 30.5564,
    longitude: 79.5661,
    elevation_m: 1890,
    vulnerable_population: 3200,
    connected_villages: ["Manohar Bagh", "Sunil Ward", "Marwari", "Singdhar"],
    critical_infrastructure: [
      { type: "Helipad", name: "Joshimath Army Helibase", capacity: 4, lat: 30.5610, lng: 79.5720 },
      { type: "Shelter", name: "Municipal Community Hall Relief Center", capacity: 400, lat: 30.5520, lng: 79.5610 },
      { type: "Road", name: "Badrinath NH-7 Highway Sinking Stretch", status: "Single Lane / Monitored", lat: 30.5590, lng: 79.5640 }
    ],
    polygon_coordinates: [
      [30.5450, 79.5550],
      [30.5650, 79.5580],
      [30.5700, 79.5800],
      [30.5500, 79.5820]
    ]
  },
  {
    id: "hotspot-03",
    name: "Summer Hill & Totu Valley",
    district: "Shimla",
    state: "Himachal Pradesh",
    risk_level: "MEDIUM_RISK",
    risk_score: 58.7,
    latitude: 31.1095,
    longitude: 77.1350,
    elevation_m: 2100,
    vulnerable_population: 5400,
    connected_villages: ["Summer Hill", "Totu", "Boileauganj", "Sangti"],
    critical_infrastructure: [
      { type: "Railway", name: "Kalka-Shimla UNESCO Track Pass", status: "Speed Restricted 20km/h", lat: 31.1110, lng: 77.1320 },
      { type: "Shelter", name: "Himachal University Auditorium Shelter", capacity: 800, lat: 31.1130, lng: 77.1400 }
    ],
    polygon_coordinates: [
      [31.0950, 77.1200],
      [31.1200, 77.1250],
      [31.1250, 77.1500],
      [31.1000, 77.1480]
    ]
  },
  {
    id: "hotspot-04",
    name: "Pettimudi & Rajamala Tea Estates",
    district: "Idukki",
    state: "Kerala",
    risk_level: "MEDIUM_RISK",
    risk_score: 62.1,
    latitude: 10.1580,
    longitude: 77.0180,
    elevation_m: 1650,
    vulnerable_population: 2100,
    connected_villages: ["Pettimudi", "Nyamakad", "Rajamala"],
    critical_infrastructure: [
      { type: "Shelter", name: "KDHP Tea Estate School Hall", capacity: 350, lat: 10.1620, lng: 77.0120 },
      { type: "Bridge", name: "Periyavara Concrete Bridge", status: "Operational", lat: 10.1490, lng: 77.0250 }
    ],
    polygon_coordinates: [
      [10.1400, 77.0000],
      [10.1750, 77.0050],
      [10.1800, 77.0350],
      [10.1450, 77.0300]
    ]
  },
  {
    id: "hotspot-05",
    name: "Coonoor Marappalam Ghat Section",
    district: "Nilgiris",
    state: "Tamil Nadu",
    risk_level: "SAFE",
    risk_score: 24.3,
    latitude: 11.3530,
    longitude: 76.7959,
    elevation_m: 1850,
    vulnerable_population: 1800,
    connected_villages: ["Marappalam", "Runnymede", "Burliar"],
    critical_infrastructure: [
      { type: "Road", name: "Mettupalayam-Ooty NH 181 Ghat Road", status: "Clear / Normal Flow", lat: 11.3510, lng: 76.7940 }
    ],
    polygon_coordinates: [
      [11.3400, 76.7800],
      [11.3650, 76.7850],
      [11.3700, 76.8100],
      [11.3450, 76.8080]
    ]
  }
];

const SEED_SENSORS: SensorNode[] = [
  {
    id: "SNS-WAY-01",
    name: "Wayanad Chooralmala Inclinometer & Gauge",
    location_name: "Chooralmala Upper Ridge, Wayanad",
    latitude: 11.5380,
    longitude: 76.1760,
    elevation_m: 1320.0,
    status: "CRITICAL",
    rainfall_rate_mm_hr: 38.5,
    soil_moisture_pct: 91.2,
    tilt_degrees: 4.8,
    pore_water_pressure_kpa: 42.6,
    battery_pct: 89,
    last_ping: "2 mins ago",
    recent_trend: [
      { time: "00:00", rainfall: 12.0, moisture: 68.0, tilt: 1.2 },
      { time: "04:00", rainfall: 18.5, moisture: 74.5, tilt: 1.5 },
      { time: "08:00", rainfall: 28.0, moisture: 83.0, tilt: 2.6 },
      { time: "12:00", rainfall: 35.0, moisture: 88.4, tilt: 3.9 },
      { time: "16:00", rainfall: 38.5, moisture: 91.2, tilt: 4.8 }
    ]
  },
  {
    id: "SNS-WAY-02",
    name: "Mundakkai Piezometer Node 2",
    location_name: "Mundakkai Tea Estate, Wayanad",
    latitude: 11.5290,
    longitude: 76.1820,
    elevation_m: 1240.0,
    status: "WARNING",
    rainfall_rate_mm_hr: 26.0,
    soil_moisture_pct: 84.7,
    tilt_degrees: 2.9,
    pore_water_pressure_kpa: 34.1,
    battery_pct: 94,
    last_ping: "4 mins ago",
    recent_trend: [
      { time: "00:00", rainfall: 8.0, moisture: 62.0, tilt: 0.8 },
      { time: "04:00", rainfall: 14.0, moisture: 71.0, tilt: 1.1 },
      { time: "08:00", rainfall: 21.0, moisture: 78.5, tilt: 1.9 },
      { time: "12:00", rainfall: 24.5, moisture: 82.0, tilt: 2.4 },
      { time: "16:00", rainfall: 26.0, moisture: 84.7, tilt: 2.9 }
    ]
  },
  {
    id: "SNS-JOS-01",
    name: "Joshimath Sunil Borehole Extensometer",
    location_name: "Sunil Ward Hillside, Joshimath",
    latitude: 30.5590,
    longitude: 79.5680,
    elevation_m: 1940.0,
    status: "CRITICAL",
    rainfall_rate_mm_hr: 14.2,
    soil_moisture_pct: 78.9,
    tilt_degrees: 5.6,
    pore_water_pressure_kpa: 38.4,
    battery_pct: 92,
    last_ping: "1 min ago",
    recent_trend: [
      { time: "00:00", rainfall: 4.0, moisture: 70.0, tilt: 4.2 },
      { time: "04:00", rainfall: 6.5, moisture: 72.5, tilt: 4.6 },
      { time: "08:00", rainfall: 9.0, moisture: 74.0, tilt: 4.9 },
      { time: "12:00", rainfall: 12.0, moisture: 76.8, tilt: 5.2 },
      { time: "16:00", rainfall: 14.2, moisture: 78.9, tilt: 5.6 }
    ]
  },
  {
    id: "SNS-SHM-01",
    name: "Shimla Summer Hill Automatic Rain Gauge",
    location_name: "Summer Hill Forest Edge, Shimla",
    latitude: 31.1110,
    longitude: 77.1370,
    elevation_m: 2150.0,
    status: "WARNING",
    rainfall_rate_mm_hr: 22.4,
    soil_moisture_pct: 74.0,
    tilt_degrees: 2.1,
    pore_water_pressure_kpa: 26.8,
    battery_pct: 96,
    last_ping: "5 mins ago",
    recent_trend: [
      { time: "00:00", rainfall: 2.0, moisture: 52.0, tilt: 0.5 },
      { time: "04:00", rainfall: 8.0, moisture: 60.0, tilt: 0.9 },
      { time: "08:00", rainfall: 15.0, moisture: 67.0, tilt: 1.4 },
      { time: "12:00", rainfall: 19.5, moisture: 71.2, tilt: 1.8 },
      { time: "16:00", rainfall: 22.4, moisture: 74.0, tilt: 2.1 }
    ]
  },
  {
    id: "SNS-IDK-01",
    name: "Munnar Pettimudi Telemetric Station",
    location_name: "Pettimudi Ravine Slopes, Idukki",
    latitude: 10.1590,
    longitude: 77.0190,
    elevation_m: 1680.0,
    status: "WARNING",
    rainfall_rate_mm_hr: 19.8,
    soil_moisture_pct: 76.3,
    tilt_degrees: 2.4,
    pore_water_pressure_kpa: 29.5,
    battery_pct: 87,
    last_ping: "3 mins ago",
    recent_trend: [
      { time: "00:00", rainfall: 5.0, moisture: 58.0, tilt: 0.7 },
      { time: "04:00", rainfall: 10.0, moisture: 64.0, tilt: 1.2 },
      { time: "08:00", rainfall: 14.0, moisture: 69.5, tilt: 1.6 },
      { time: "12:00", rainfall: 17.0, moisture: 73.0, tilt: 2.0 },
      { time: "16:00", rainfall: 19.8, moisture: 76.3, tilt: 2.4 }
    ]
  },
  {
    id: "SNS-NIL-01",
    name: "Nilgiris Coonoor Slope Sensor",
    location_name: "Coonoor Ghat km-14, Nilgiris",
    latitude: 11.3520,
    longitude: 76.7970,
    elevation_m: 1820.0,
    status: "ONLINE",
    rainfall_rate_mm_hr: 4.2,
    soil_moisture_pct: 36.5,
    tilt_degrees: 0.4,
    pore_water_pressure_kpa: 12.1,
    battery_pct: 99,
    last_ping: "1 min ago",
    recent_trend: [
      { time: "00:00", rainfall: 0.0, moisture: 34.0, tilt: 0.3 },
      { time: "04:00", rainfall: 1.0, moisture: 34.5, tilt: 0.3 },
      { time: "08:00", rainfall: 2.5, moisture: 35.2, tilt: 0.4 },
      { time: "12:00", rainfall: 3.8, moisture: 36.0, tilt: 0.4 },
      { time: "16:00", rainfall: 4.2, moisture: 36.5, tilt: 0.4 }
    ]
  }
];

const INITIAL_INCIDENTS: IncidentReport[] = [
  {
    id: "inc-101",
    title: "Severe Debris Slump Blocking Meppadi-Chooralmala Main Pass",
    hazard_type: "Debris Flow",
    severity: "Critical",
    description: "Massive mud and boulder accumulation has completely severed road connectivity across the stream near Mundakkai bridge. Water levels overflowing rapidly.",
    latitude: 11.5362,
    longitude: 76.1774,
    location_name: "Chooralmala Stream Bridge, Wayanad",
    image_url: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80",
    reporter_name: "Kishore Kumar (Field Officer)",
    reporter_phone: "+91 94472 10928",
    status: "Verified",
    verified_by: "Ananya Nair (KSDMA)",
    verified_at: "2026-09-03T18:40:00Z",
    upvotes: 34,
    created_at: "2026-09-03T18:15:00Z"
  },
  {
    id: "inc-102",
    title: "Fresh 12-inch Subsidence Fissure Detected in Upper Sunil Ward",
    hazard_type: "Hillside Crack",
    severity: "Severe",
    description: "Noticeable ground cracking running 45 meters across two residential retaining walls. Minor water seepage observed emerging from the crack base.",
    latitude: 30.5582,
    longitude: 79.5675,
    location_name: "Sunil Ward Upper Path, Joshimath",
    image_url: "https://images.unsplash.com/photo-1618083707368-b3823daa2726?auto=format&fit=crop&w=800&q=80",
    reporter_name: "Vikram Singh Negi (Aapda Mitra)",
    reporter_phone: "+91 87552 19044",
    status: "Verified",
    verified_by: "Dr. Rajeshwar Sharma (NDMA HQ)",
    verified_at: "2026-09-03T20:10:00Z",
    upvotes: 28,
    created_at: "2026-09-03T19:30:00Z"
  },
  {
    id: "inc-103",
    title: "Boulders Rolling onto Shimla Bypass near Totu Crossing",
    hazard_type: "Rockfall",
    severity: "Moderate",
    description: "Intermittent rockfall from upper sandstone cutting. Two cars narrowly escaped damage. Traffic slowed to single lane crawling pace.",
    latitude: 31.1070,
    longitude: 77.1330,
    location_name: "Totu Bypass Junction, Shimla",
    image_url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80",
    reporter_name: "Rahul Chauhan (Citizen)",
    reporter_phone: "+91 98160 44219",
    status: "Pending",
    upvotes: 12,
    created_at: "2026-09-03T22:45:00Z"
  },
  {
    id: "inc-104",
    title: "Soil Slope Slip Cleared near Rajamala Tea Division 4",
    hazard_type: "Mudslide",
    severity: "Minor",
    description: "Small 10-meter embankment slide cleared by JCB backhoe. Retaining mesh reinforced and drainage ditch reopened.",
    latitude: 10.1550,
    longitude: 77.0160,
    location_name: "Rajamala Division 4 Road, Munnar",
    image_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    reporter_name: "Murugan S. (Panchayat Member)",
    reporter_phone: "+91 94883 55210",
    status: "Resolved",
    verified_by: "Ananya Nair (KSDMA)",
    verified_at: "2026-09-03T16:00:00Z",
    upvotes: 19,
    created_at: "2026-09-03T11:20:00Z"
  }
];

const INITIAL_ALERTS: AlertNotification[] = [
  {
    id: "ALT-2026-09-001",
    title: "RED ALERT: Imminent Landslide Warning – Meppadi & Chooralmala Hills",
    severity: "Critical",
    hazard_type: "Multi-Zone Landslide & Debris Torrent",
    target_area: "Wayanad High Ranges (Meppadi, Mundakkai, Chooralmala)",
    affected_villages: ["Chooralmala", "Mundakkai", "Attamala", "Meppadi Ward 10-14"],
    description: "Torrential monsoon precipitation (214mm/24h) and extreme soil pore pressure (42.6 kPa) have exceeded geological failure thresholds. Immediate mandatory evacuation ordered.",
    instructions: [
      "Evacuate vulnerable riverside and slope-adjacent homes immediately to designated relief shelters.",
      "Avoid travelling on Meppadi-Chooralmala road; bridge passes are under high risk.",
      "Keep emergency battery torches, documents, and first-aid kits ready.",
      "Call 1077 (District Emergency) or 112 for immediate rescue assistance."
    ],
    channels: ["SMS (4,250 Delivered)", "Push Siren (8,920 Devices)", "Wireless Sirens (3 Activated)", "WhatsApp Emergency Channel", "CAP 1.2 Feed"],
    latitude: 11.5348,
    longitude: 76.1783,
    radius_km: 12.0,
    is_active: true,
    dispatched_at: "2026-09-03T19:00:00Z",
    sms_recipients_count: 4250,
    push_recipients_count: 8920,
    cap_identifier: "URN:IN-GOV:NDMA:CAP:20260903:WAYANAD-RED-001"
  },
  {
    id: "ALT-2026-09-002",
    title: "ORANGE ADVISORY: Subsidence & Slope Creep Alert – Joshimath Sector",
    severity: "High",
    hazard_type: "Land Subsidence & Slope Destabilization",
    target_area: "Joshimath Municipal Limits (Manohar Bagh & Sunil)",
    affected_villages: ["Manohar Bagh", "Sunil Ward", "Marwari"],
    description: "Continuous ground displacement rate of 4.8mm/day detected by borehole inclinometers following persistent mountain drizzle. Strict building safety protocols active.",
    instructions: [
      "Do not enter buildings showing newly widened shear cracks.",
      "Municipal relief centers at Community Hall are open 24/7.",
      "Report any water seepage emerging from retaining walls to local disaster volunteers."
    ],
    channels: ["SMS (2,800 Delivered)", "Push Siren (4,100 Devices)", "CAP 1.2 Feed"],
    latitude: 30.5564,
    longitude: 79.5661,
    radius_km: 8.0,
    is_active: true,
    dispatched_at: "2026-09-03T14:30:00Z",
    sms_recipients_count: 2800,
    push_recipients_count: 4100,
    cap_identifier: "URN:IN-GOV:NDMA:CAP:20260903:CHAMOLI-ORG-002"
  },
  {
    id: "ALT-2026-09-003",
    title: "YELLOW ADVISORY: Heavy Rainfall & Rockfall Precaution – Shimla Slopes",
    severity: "Moderate",
    hazard_type: "Precipitation Induced Rockfall",
    target_area: "Shimla Urban & Rural Slopes",
    affected_villages: ["Summer Hill", "Totu", "Sangti"],
    description: "Intermittent heavy monsoon spells forecast. Travelers on NH-5 and bypass roads advised to exercise caution against loose rock rolling.",
    instructions: [
      "Avoid parking vehicles under steep rock cuttings.",
      "Adhere to 30km/h speed limit on hillside curves."
    ],
    channels: ["Push Notification (12,400 Devices)", "CAP 1.2 Feed"],
    latitude: 31.1095,
    longitude: 77.1350,
    radius_km: 15.0,
    is_active: false,
    dispatched_at: "2026-09-02T10:00:00Z",
    sms_recipients_count: 0,
    push_recipients_count: 12400,
    cap_identifier: "URN:IN-GOV:NDMA:CAP:20260902:SHIMLA-YEL-003"
  }
];

export const apiClient = {
  // Local store helpers
  getStoredIncidents(): IncidentReport[] {
    if (typeof window === 'undefined') return INITIAL_INCIDENTS;
    const item = localStorage.getItem(LOCAL_STORAGE_KEY_INCIDENTS);
    if (!item) {
      localStorage.setItem(LOCAL_STORAGE_KEY_INCIDENTS, JSON.stringify(INITIAL_INCIDENTS));
      return INITIAL_INCIDENTS;
    }
    try {
      return JSON.parse(item);
    } catch {
      return INITIAL_INCIDENTS;
    }
  },

  saveStoredIncidents(list: IncidentReport[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LOCAL_STORAGE_KEY_INCIDENTS, JSON.stringify(list));
  },

  getStoredAlerts(): AlertNotification[] {
    if (typeof window === 'undefined') return INITIAL_ALERTS;
    const item = localStorage.getItem(LOCAL_STORAGE_KEY_ALERTS);
    if (!item) {
      localStorage.setItem(LOCAL_STORAGE_KEY_ALERTS, JSON.stringify(INITIAL_ALERTS));
      return INITIAL_ALERTS;
    }
    try {
      return JSON.parse(item);
    } catch {
      return INITIAL_ALERTS;
    }
  },

  saveStoredAlerts(list: AlertNotification[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LOCAL_STORAGE_KEY_ALERTS, JSON.stringify(list));
  },

  // AI Prediction
  async predictRisk(input: PredictionInput): Promise<PredictionOutput> {
    try {
      const res = await fetch(`${API_BASE_URL}/predict/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // Fallback local heuristic calculator
    }

    // Local geotechnical calculation fallback
    const rainfall = input.rainfall_24h_mm;
    const moisture = input.soil_moisture_pct;
    const slope = input.slope_angle_deg;
    const ndvi = input.vegetation_index_ndvi;
    const hist = input.historical_risk_score;

    const rainScore = Math.min(100, (rainfall / 220.0) * 100) * 0.35;
    const moistScore = Math.min(100, (Math.max(0, moisture - 25) / 70.0) * 100) * 0.25;
    const slopeScore = Math.min(100, (Math.max(0, slope - 15) / 45.0) * 100) * 0.20;
    const vegScore = (1.0 - Math.max(0, ndvi)) * 100 * 0.10;
    const histScore = hist * 100 * 0.10;

    let rawRisk = rainScore + moistScore + slopeScore + vegScore + histScore;
    const fs = Math.max(0.4, Number((3.2 - (rawRisk / 38.0)).toFixed(2)));
    if (fs < 1.0) rawRisk = Math.max(rawRisk, 75 + (1.0 - fs) * 20);

    const riskScore = Math.min(99.4, Math.max(2.0, Number(rawRisk.toFixed(1))));
    const riskLevel = riskScore >= 70 ? 'HIGH_RISK' : (riskScore >= 38 ? 'MEDIUM_RISK' : 'SAFE');
    const urgency = riskScore >= 70 ? 'Immediate Evacuation / Red Alert' : (riskScore >= 38 ? 'Advisory / Amber Alert' : 'Normal Monitoring / Green Status');

    const totalParts = (rainScore + moistScore + slopeScore + vegScore + histScore) || 1;

    return {
      risk_level: riskLevel,
      risk_score_pct: riskScore,
      confidence_pct: 94.2,
      factor_of_safety: fs,
      summary: riskLevel === 'HIGH_RISK' 
        ? `CRITICAL WARNING: High slope failure probability in ${input.location_name || 'monitored sector'}. Heavy rain (${rainfall}mm) & saturated soil (${moisture}%) have exceeded threshold bounds.`
        : (riskLevel === 'MEDIUM_RISK'
          ? `AMBER ADVISORY: Moderate landslide risk in ${input.location_name || 'monitored sector'}. Soil saturation elevated at ${moisture}%. Keep emergency teams on standby.`
          : `GREEN / SAFE: Slope stable in ${input.location_name || 'monitored sector'}. Factor of Safety is healthy at ${fs}.`),
      factors_breakdown: [
        {
          factor: "24h Cumulative Precipitation",
          contribution_pct: Number(((rainScore / totalParts) * 100).toFixed(1)),
          impact_direction: rainfall > 60 ? "Increases Risk" : "Safe Threshold",
          value_display: `${rainfall} mm`
        },
        {
          factor: "Soil Moisture Saturation",
          contribution_pct: Number(((moistScore / totalParts) * 100).toFixed(1)),
          impact_direction: moisture > 65 ? "Increases Risk" : "Moderate Absorption",
          value_display: `${moisture}%`
        },
        {
          factor: "Slope Inclination Angle",
          contribution_pct: Number(((slopeScore / totalParts) * 100).toFixed(1)),
          impact_direction: slope > 30 ? "Increases Risk" : "Gentle Gradient",
          value_display: `${slope}°`
        },
        {
          factor: "Vegetation Root Cohesion (NDVI)",
          contribution_pct: Number(((vegScore / totalParts) * 100).toFixed(1)),
          impact_direction: ndvi > 0.45 ? "Reduces Risk" : "Weak Canopy Cover",
          value_display: `${ndvi} NDVI`
        },
        {
          factor: "Historical Hazard Susceptibility",
          contribution_pct: Number(((histScore / totalParts) * 100).toFixed(1)),
          impact_direction: hist > 0.5 ? "Increases Risk" : "Low Past Frequency",
          value_display: `${hist} Index`
        }
      ],
      recommended_actions: riskLevel === 'HIGH_RISK'
        ? [
            "Trigger automated sirens and push alerts to downstream habitations.",
            "Initiate mandatory evacuation of vulnerable riverside & slope dwellings.",
            "Close vulnerable bridges and deploy SDRF rescue battalions."
          ]
        : (riskLevel === 'MEDIUM_RISK'
          ? [
            "Issue precautionary SMS advisories to field workers and tea estate labor.",
            "Inspect roadside culverts and drainage channels to prevent pooling.",
            "Maintain continuous 15-minute polling on borehole inclinometers."
          ]
          : [
            "Routine telemetry monitoring active.",
            "No movement restrictions or evacuation required."
          ]),
      evacuation_urgency: urgency,
      timestamp: new Date().toISOString()
    };
  },

  // Incidents
  async getIncidents(): Promise<IncidentReport[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/incidents/`);
      if (res.ok) {
        const data = await res.json();
        this.saveStoredIncidents(data);
        return data;
      }
    } catch (e) {
      // ignore
    }
    return this.getStoredIncidents();
  },

  async createIncident(data: IncidentCreate): Promise<IncidentReport> {
    const fallbackId = `inc-${Date.now().toString(36)}`;
    const newInc: IncidentReport = {
      id: fallbackId,
      title: data.title,
      hazard_type: data.hazard_type as any,
      severity: data.severity as any,
      description: data.description,
      latitude: data.latitude,
      longitude: data.longitude,
      location_name: data.location_name,
      image_url: data.image_url || 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
      reporter_name: data.reporter_name || 'Citizen Reporter',
      reporter_phone: data.reporter_phone,
      status: 'Pending',
      upvotes: 1,
      created_at: new Date().toISOString()
    };

    try {
      const res = await fetch(`${API_BASE_URL}/incidents/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const created = await res.json();
        const current = this.getStoredIncidents();
        this.saveStoredIncidents([created, ...current]);
        return created;
      }
    } catch (e) {
      // ignore
    }

    const current = this.getStoredIncidents();
    const updated = [newInc, ...current];
    this.saveStoredIncidents(updated);
    return newInc;
  },

  async updateIncidentStatus(id: string, status: string, verifiedBy: string = 'District Disaster Control Room'): Promise<IncidentReport | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/incidents/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, verified_by: verifiedBy })
      });
      if (res.ok) {
        const updated = await res.json();
        const list = this.getStoredIncidents().map(i => i.id === id ? updated : i);
        this.saveStoredIncidents(list);
        return updated;
      }
    } catch (e) {
      // ignore
    }

    const list = this.getStoredIncidents();
    const target = list.find(i => i.id === id);
    if (target) {
      target.status = status as any;
      if (status === 'Verified') {
        target.verified_by = verifiedBy;
        target.verified_at = new Date().toISOString();
      }
      this.saveStoredIncidents(list);
      return target;
    }
    return null;
  },

  async upvoteIncident(id: string): Promise<IncidentReport | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/incidents/${id}/upvote`, { method: 'POST' });
      if (res.ok) {
        const updated = await res.json();
        const list = this.getStoredIncidents().map(i => i.id === id ? updated : i);
        this.saveStoredIncidents(list);
        return updated;
      }
    } catch (e) {
      // ignore
    }

    const list = this.getStoredIncidents();
    const target = list.find(i => i.id === id);
    if (target) {
      target.upvotes = (target.upvotes || 0) + 1;
      this.saveStoredIncidents(list);
      return target;
    }
    return null;
  },

  // Alerts
  async getAlerts(activeOnly: boolean = false): Promise<AlertNotification[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/alerts/?active_only=${activeOnly}`);
      if (res.ok) {
        const data = await res.json();
        this.saveStoredAlerts(data);
        return data;
      }
    } catch (e) {
      // ignore
    }
    const all = this.getStoredAlerts();
    return activeOnly ? all.filter(a => a.is_active) : all;
  },

  async createAlert(alertData: Partial<AlertNotification>): Promise<AlertNotification> {
    const newAlert: AlertNotification = {
      id: `ALT-2026-${Date.now().toString(36).toUpperCase()}`,
      title: alertData.title || 'Emergency Landslide Warning',
      severity: alertData.severity || 'High',
      hazard_type: alertData.hazard_type || 'Landslide Warning',
      target_area: alertData.target_area || 'Monitored Hill Region',
      affected_villages: alertData.affected_villages || ['Sector 1', 'Sector 2'],
      description: alertData.description || 'Emergency alert generated by TerraAlert AI early warning platform.',
      instructions: alertData.instructions || [
        'Move to higher safe ground relief shelters.',
        'Follow instructions of local disaster management officers.'
      ],
      channels: alertData.channels || ['SMS (4,100 Delivered)', 'Push Siren (7,500 Devices)', 'CAP 1.2 Feed'],
      latitude: alertData.latitude || 11.5348,
      longitude: alertData.longitude || 76.1783,
      radius_km: alertData.radius_km || 15.0,
      is_active: true,
      dispatched_at: new Date().toISOString(),
      sms_recipients_count: 4100,
      push_recipients_count: 7500,
      cap_identifier: `URN:IN-GOV:NDMA:CAP:20260904:${Date.now().toString(36).toUpperCase()}`
    };

    try {
      const res = await fetch(`${API_BASE_URL}/alerts/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAlert)
      });
      if (res.ok) {
        const created = await res.json();
        const list = this.getStoredAlerts();
        this.saveStoredAlerts([created, ...list]);
        return created;
      }
    } catch (e) {
      // ignore
    }

    const list = this.getStoredAlerts();
    const updated = [newAlert, ...list];
    this.saveStoredAlerts(updated);
    return newAlert;
  },

  // Hotspots & Sensors
  async getHotspots(): Promise<HotspotZone[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/sensors/hotspots`);
      if (res.ok) return await res.json();
    } catch (e) {
      // ignore
    }
    return SEED_HOTSPOTS;
  },

  async getSensors(): Promise<SensorNode[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/sensors/`);
      if (res.ok) return await res.json();
    } catch (e) {
      // ignore
    }
    return SEED_SENSORS;
  },

  // Analytics
  async getAnalytics(): Promise<AnalyticsData> {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/overview`);
      if (res.ok) return await res.json();
    } catch (e) {
      // ignore
    }

    const alerts = this.getStoredAlerts();
    const incidents = this.getStoredIncidents();

    return {
      active_alerts_count: alerts.filter(a => a.is_active).length,
      high_risk_zones_count: SEED_HOTSPOTS.filter(h => h.risk_level === 'HIGH_RISK').length,
      pending_incidents_count: incidents.filter(i => i.status === 'Pending').length,
      connected_villages_count: 24,
      total_sensors_online: SEED_SENSORS.filter(s => s.status !== 'OFFLINE').length,
      districts: [
        {
          district: "Wayanad",
          state: "Kerala",
          risk_level: "CRITICAL",
          active_alerts: 1,
          sensor_count: 12,
          vulnerable_population: 4850,
          primary_hotspots: ["Chooralmala", "Mundakkai", "Meppadi"]
        },
        {
          district: "Chamoli (Joshimath)",
          state: "Uttarakhand",
          risk_level: "HIGH",
          active_alerts: 1,
          sensor_count: 8,
          vulnerable_population: 3200,
          primary_hotspots: ["Manohar Bagh", "Sunil Ward", "Marwari"]
        },
        {
          district: "Shimla",
          state: "Himachal Pradesh",
          risk_level: "MODERATE",
          active_alerts: 0,
          sensor_count: 10,
          vulnerable_population: 5400,
          primary_hotspots: ["Summer Hill", "Totu", "Dhalli"]
        },
        {
          district: "Idukki (Munnar)",
          state: "Kerala",
          risk_level: "MODERATE",
          active_alerts: 0,
          sensor_count: 9,
          vulnerable_population: 2100,
          primary_hotspots: ["Pettimudi", "Rajamala"]
        },
        {
          district: "Nilgiris (Ooty)",
          state: "Tamil Nadu",
          risk_level: "SAFE",
          active_alerts: 0,
          sensor_count: 7,
          vulnerable_population: 1800,
          primary_hotspots: ["Marappalam", "Coonoor"]
        }
      ],
      monthly_incidents: [
        { month: "Apr", incidents: 2, rainfall_mm: 45, resolved: 2 },
        { month: "May", incidents: 5, rainfall_mm: 95, resolved: 5 },
        { month: "Jun", incidents: 18, rainfall_mm: 380, resolved: 16 },
        { month: "Jul", incidents: 42, rainfall_mm: 690, resolved: 37 },
        { month: "Aug", incidents: 56, rainfall_mm: 820, resolved: 48 },
        { month: "Sep", incidents: 29, rainfall_mm: 410, resolved: 24 }
      ],
      rainfall_vs_moisture_curve: [
        { rainfall_tier: "0-25mm", saturation_pct: 32, landslide_probability_pct: 4 },
        { rainfall_tier: "25-50mm", saturation_pct: 48, landslide_probability_pct: 12 },
        { rainfall_tier: "50-100mm", saturation_pct: 65, landslide_probability_pct: 28 },
        { rainfall_tier: "100-150mm", saturation_pct: 78, landslide_probability_pct: 54 },
        { rainfall_tier: "150-200mm", saturation_pct: 89, landslide_probability_pct: 79 },
        { rainfall_tier: "200mm+", saturation_pct: 96, landslide_probability_pct: 94 }
      ],
      forecast_72h: [
        { time: "Today +06h", expected_rain_mm: 42, soil_saturation: 88, risk_category: "High Risk", color: "#EF4444" },
        { time: "Today +12h", expected_rain_mm: 58, soil_saturation: 93, risk_category: "Critical Risk", color: "#DC2626" },
        { time: "Today +24h", expected_rain_mm: 35, soil_saturation: 90, risk_category: "High Risk", color: "#EF4444" },
        { time: "Day 2 +36h", expected_rain_mm: 20, soil_saturation: 82, risk_category: "Moderate Risk", color: "#F59E0B" },
        { time: "Day 2 +48h", expected_rain_mm: 12, soil_saturation: 74, risk_category: "Moderate Risk", color: "#F59E0B" },
        { time: "Day 3 +60h", expected_rain_mm: 6, soil_saturation: 62, risk_category: "Safe / Low", color: "#10B981" },
        { time: "Day 3 +72h", expected_rain_mm: 4, soil_saturation: 52, risk_category: "Safe / Low", color: "#10B981" }
      ]
    };
  }
};
