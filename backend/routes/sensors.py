from fastapi import APIRouter
from typing import List, Dict, Any
from schemas import SensorNode
from database import db

router = APIRouter(prefix="/sensors", tags=["IoT Sensor Mesh Telemetry"])

@router.get("/", response_model=List[SensorNode])
def get_sensor_nodes():
    """
    Returns live telemetry from IoT sensor stations (Rain gauges, Inclinometers, Piezometers).
    """
    return db.get_sensors()

@router.get("/hotspots")
def get_hotspots():
    """
    Returns high/medium/safe risk zone polygons with vulnerable assets and shelters.
    """
    return db.get_hotspots()
