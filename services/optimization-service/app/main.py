import logging
from fastapi import FastAPI
from prometheus_fastapi_instrumentator import Instrumentator
from app.api.routes import router
from app.config.settings import settings

logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title="Optimization Service",
    description="CTR prediction and campaign optimisation recommendations",
    version="0.1.0",
)

Instrumentator().instrument(app).expose(app, endpoint="/metrics")
app.include_router(router)

@app.get("/health")
def health():
    return {"status": "ok", "service": settings.app_name}
