from sqlalchemy import Column, String, BigInteger, Numeric, DateTime, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase
from datetime import datetime
import uuid

class Base(DeclarativeBase):
    pass

class ImpressionMetric(Base):
    """Hourly-aggregated impression metrics per campaign."""
    __tablename__ = "impression_metrics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    campaign_id = Column(String(36), nullable=False, index=True)
    hour_bucket = Column(DateTime, nullable=False)   # Truncated to the hour
    impressions = Column(BigInteger, default=0)
    clicks = Column(BigInteger, default=0)
    conversions = Column(BigInteger, default=0)
    spend = Column(Numeric(15, 2), default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        Index("idx_metrics_campaign_hour", "campaign_id", "hour_bucket"),
    )
