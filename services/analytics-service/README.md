# analytics-service

Python 3.12 / FastAPI — event ingestion and metrics aggregation.

## Responsibilities
- Consume impression, click, conversion events from Kafka
- Aggregate into hourly buckets (stored in PostgreSQL)
- Serve time-series metrics for dashboards
- Expose Prometheus metrics endpoint

## Run locally

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8081
```
