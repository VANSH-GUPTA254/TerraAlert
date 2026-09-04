# TerraAlert – AI-Based Landslide Early Warning & Risk Monitoring System
### Smart India Hackathon (SIH) – Problem Statement SIH26001

**TerraAlert** is a production-ready, full-stack disaster management and early warning web platform engineered for hill citizens, field volunteers (Aapda Mitra), State Disaster Management Authorities (SDMA), and the National Disaster Management Authority (NDMA HQ).

---

## 🌟 Key Features

1. **AI Geotechnical Risk Prediction Engine**:
   - Evaluates 24-hour cumulative precipitation, volumetric soil moisture saturation, digital elevation slope angles, Normalized Difference Vegetation Index (NDVI canopy root cohesion), and historical recurrence indices.
   - Calculates **Factor of Safety ($Fs$)** proxy using Infinite Slope Stability mechanics.
   - Computes **SHAP-style Feature Contribution Attribution** for full algorithmic transparency.
   - Generates automated disaster mitigation protocols and early warning triggers.

2. **Interactive Multi-Layer GIS Command Map**:
   - OpenStreetMap, OpenTopoMap, and Satellite tile views.
   - Landslide risk polygons across high-vulnerability Indian mountain corridors (*Wayanad, Joshimath, Shimla, Munnar, Nilgiris*).
   - Live IoT sensor station telemetry pins (Rain gauges, Inclinometers, Piezometers, Tiltmeters).
   - Critical infrastructure overlays (Relief shelters with capacity counts, hospitals, bridges, bypass roads, helipads).

3. **Citizen Hazard Reporting Hub**:
   - Mobile-first reporting with automatic GPS geolocation detection.
   - Multi-hazard taxonomy (Rockfall, Mudslide, Road Subsidence, Hillside Crack, Debris Flow).
   - Photo attachment preview and community confirmation upvoting.
   - Live status tracking (`Pending` → `Officer Verified` → `Relief Dispatched / Resolved`).

4. **Emergency Early Warning & Broadcaster (CAP 1.2)**:
   - OASIS Common Alerting Protocol (CAP v1.2) XML compliant exporter.
   - Web Audio API real-time acoustic emergency siren simulator.
   - Simulated cell broadcast SMS engine (reaching 4,200+ local residents) and mobile push notification drawer.

5. **Disaster Analytics & 72-Hour Monsoon Forecasting**:
   - Monthly incident frequency correlated with cumulative monsoon precipitation.
   - Rainfall infiltration vs ground saturation failure curves.
   - 72-Hour future predictive landslide risk timeline.

6. **Government Operations & Triage Console**:
   - Incident triage review queue for disaster management officers.
   - IoT sensor mesh health monitor and automated alarm threshold tuner.
   - 1-Click Printable Situation Report (SitRep) generator.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: Next.js 14+ (App Router), React 19, TypeScript, Tailwind CSS, Leaflet & OpenStreetMap, Recharts, Lucide Icons, Web Audio API.
- **Backend**: FastAPI, Python 3.13, Uvicorn, Pydantic v2, Scikit-Learn, NumPy, SQLite / GeoJSON spatial store.
- **Authentication**: JWT & Role-Based Access Control with 1-Click Demo Persona Switcher (*Citizen*, *Disaster Officer*, *Admin HQ*).
- **Dual-Mode Guarantee**: Intelligent API client with seamless fallback to high-fidelity cached state if backend is offline.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+

### Option A: Run Everything (1-Click)
Double click `run_all.bat` in the project root.

### Option B: Run Manually

#### 1. Start Backend (FastAPI)
```bash
cd backend
python -m pip install -r requirements.txt
python main.py
```
*API running at: `http://localhost:8000` | Interactive Docs: `http://localhost:8000/docs`*

#### 2. Start Frontend (Next.js)
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
*Open `http://localhost:3000` in your web browser.*

---

## 👥 Demo Personas (1-Click Switchers)
- **Disaster Officer**: `officer@terraalert.gov.in` (Kerala SDMA / Wayanad EOC)
- **System Admin**: `admin@terraalert.gov.in` (NDMA HQ National EOC)
- **Citizen / Volunteer**: `citizen@terraalert.gov.in` (Aapda Mitra Chamoli)

---

## 📞 24x7 National Disaster Helplines
- **NDMA National Control Room**: 1070
- **State Emergency Operation Center (SEOC)**: 1077
- **Universal Emergency (ERSS)**: 112
- **Disaster Ambulance / Medical**: 108
