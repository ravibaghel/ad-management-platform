import asyncio
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from prometheus_fastapi_instrumentator import Instrumentator

from app.api.routes import router
from app.config.settings import settings
from app.kafka.consumer import consume_events

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start Kafka consumer in background
    consumer_task = asyncio.create_task(consume_events())
    logger.info("Analytics service started")
    yield
    consumer_task.cancel()
    await asyncio.gather(consumer_task, return_exceptions=True)
    logger.info("Analytics service stopped")

app = FastAPI(
    title="Analytics Service",
    description="Ingests ad events and serves aggregated campaign metrics",
    version="0.1.0",
    lifespan=lifespan,
)

# Prometheus metrics
Instrumentator().instrument(app).expose(app, endpoint="/metrics")

app.include_router(router)

@app.get("/health")
def health():
    return {"status": "ok", "service": settings.app_name}
