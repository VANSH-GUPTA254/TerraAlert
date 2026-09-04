from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, predictions, incidents, alerts, sensors, analytics

app = FastAPI(
    title="TerraAlert AI - Early Warning & Landslide Risk Monitoring Engine",
    description="Backend API services for SIH26001 Landslide Early Warning and Risk Monitoring System",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth.router, prefix="/api")
app.include_router(predictions.router, prefix="/api")
app.include_router(incidents.router, prefix="/api")
app.include_router(alerts.router, prefix="/api")
app.include_router(sensors.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")

@app.get("/")
def root_status():
    return {
        "platform": "TerraAlert SIH26001",
        "status": "OPERATIONAL",
        "version": "2.0.0",
        "emergency_helpline": {
            "national_disaster": "1070",
            "state_emergency": "1077",
            "universal_sos": "112"
        },
        "docs": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "engine": "TerraAlert AI v2.0",
        "geotechnical_model": "Hydro-Geomechanical Infinite Slope Stability + Random Forest Calibrator",
        "cap_version": "OASIS CAP 1.2 Compliant"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
