from fastapi import APIRouter
from app.services.ctr_model import default_predictor, CampaignFeatures

router = APIRouter(prefix="/api/v1/optimization", tags=["optimization"])

@router.post("/campaigns/{campaign_id}/predict-ctr")
async def predict_ctr(campaign_id: str, features: dict):
    """Return CTR prediction for a campaign given its current features."""
    f = CampaignFeatures(
        objective_encoded=features.get("objective_encoded", 0),
        historical_ctr=features.get("historical_ctr", 0.0),
        budget_utilization=features.get("budget_utilization", 0.0),
        days_running=features.get("days_running", 0),
        hour_of_day=features.get("hour_of_day", 12),
        day_of_week=features.get("day_of_week", 0),
    )
    return {
        "campaign_id": campaign_id,
        "predicted_ctr": default_predictor.predict(f),
    }

@router.get("/campaigns/{campaign_id}/recommendations")
async def get_recommendations(campaign_id: str):
    """Return budget and audience optimisation recommendations."""
    # TODO: pull metrics from analytics-service, run optimisation logic
    return {
        "campaign_id": campaign_id,
        "recommendations": [
            {"type": "BUDGET_REALLOCATION", "message": "Increase daily cap by 15% — budget depleting before peak hours"},
            {"type": "AUDIENCE_EXPANSION", "message": "Lookalike audience based on converters could increase reach 2x"},
        ],
        "confidence": 0.0,  # Will be populated once model is trained on real data
    }
