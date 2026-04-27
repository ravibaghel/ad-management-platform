from fastapi import APIRouter, Query
from datetime import datetime, timedelta
from typing import Optional

router = APIRouter(prefix="/api/v1/analytics", tags=["analytics"])

@router.get("/campaigns/{campaign_id}/metrics")
async def get_campaign_metrics(
    campaign_id: str,
    from_date: Optional[datetime] = Query(default=None),
    to_date: Optional[datetime] = Query(default=None),
):
    """Return aggregated metrics for a campaign over a time range."""
    if not from_date:
        from_date = datetime.utcnow() - timedelta(days=7)
    if not to_date:
        to_date = datetime.utcnow()

    # TODO: query impression_metrics table
    return {
        "campaign_id": campaign_id,
        "from_date": from_date,
        "to_date": to_date,
        "impressions": 0,
        "clicks": 0,
        "conversions": 0,
        "ctr": 0.0,
        "spend": 0.0,
    }

@router.get("/campaigns/{campaign_id}/timeseries")
async def get_timeseries(campaign_id: str, granularity: str = "hourly"):
    """Return time-series data for dashboard charts."""
    return {"campaign_id": campaign_id, "granularity": granularity, "data": []}
