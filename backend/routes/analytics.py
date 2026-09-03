from fastapi import APIRouter
from schemas import AnalyticsOverview
from database import db

router = APIRouter(prefix="/analytics", tags=["Disaster Analytics & Forecasting"])

@router.get("/overview", response_model=AnalyticsOverview)
def get_analytics_overview():
    """
    Returns aggregated disaster metrics, rainfall trends, 
    risk distribution, and 72-hour forecast projections.
    """
    return db.get_overview_metrics()
