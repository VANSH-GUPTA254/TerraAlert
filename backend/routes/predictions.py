from fastapi import APIRouter
from typing import List, Dict, Any
from schemas import PredictionInput, PredictionOutput
from ml.predictor import ai_engine

router = APIRouter(prefix="/predict", tags=["AI Landslide Risk Prediction"])

PRESET_SCENARIOS = [
    {
        "id": "wayanad-monsoon-2024",
        "title": "Wayanad Chooralmala Extreme Monsoon Spate",
        "description": "214mm cloudburst, 92% saturated debris layer, 38° steep tea slope.",
        "params": {
            "rainfall_24h_mm": 214.0,
            "soil_moisture_pct": 92.5,
            "slope_angle_deg": 38.0,
            "vegetation_index_ndvi": 0.22,
            "historical_risk_score": 0.90,
            "soil_type": "Sandy Loam / Debris",
            "location_name": "Chooralmala & Mundakkai Ridge, Wayanad"
        }
    },
    {
        "id": "joshimath-subsidence",
        "title": "Joshimath Fissure & Creep Activation",
        "description": "Persistent rain infiltration on active colluvium moraine slope with high pore pressure.",
        "params": {
            "rainfall_24h_mm": 95.0,
            "soil_moisture_pct": 81.0,
            "slope_angle_deg": 44.0,
            "vegetation_index_ndvi": 0.15,
            "historical_risk_score": 0.85,
            "soil_type": "Deep Clay / Colluvium",
            "location_name": "Manohar Bagh, Joshimath Sector"
        }
    },
    {
        "id": "shimla-summerhill-warning",
        "title": "Shimla Urban Ridge Moderate Surge",
        "description": "65mm rain with moderate slope cover, perched water table.",
        "params": {
            "rainfall_24h_mm": 65.0,
            "soil_moisture_pct": 68.0,
            "slope_angle_deg": 32.0,
            "vegetation_index_ndvi": 0.52,
            "historical_risk_score": 0.55,
            "soil_type": "Silt / Clayey Loam",
            "location_name": "Summer Hill Forest Edge, Shimla"
        }
    },
    {
        "id": "nilgiris-safe-baseline",
        "title": "Nilgiris Coonoor Stable Pre-Monsoon",
        "description": "12mm light rain, deep rooted pine canopy, dry soil absorption buffer.",
        "params": {
            "rainfall_24h_mm": 12.0,
            "soil_moisture_pct": 34.0,
            "slope_angle_deg": 24.0,
            "vegetation_index_ndvi": 0.82,
            "historical_risk_score": 0.20,
            "soil_type": "Bedrock / Granite",
            "location_name": "Coonoor Ghat Section, Nilgiris"
        }
    }
]

@router.post("/", response_model=PredictionOutput)
def run_landslide_prediction(input_data: PredictionInput):
    """
    Executes real-time AI Landslide Risk Prediction evaluating:
    Precipitation (mm), Soil Moisture (%), Slope Angle (°), NDVI, Soil Cohesion, and Factor of Safety.
    """
    return ai_engine.predict(input_data)

@router.get("/scenarios")
def get_prediction_presets():
    """Returns curated realistic disaster scenarios for 1-click evaluation."""
    return PRESET_SCENARIOS
