import asyncio
import json
import logging
from aiokafka import AIOKafkaConsumer
from app.config.settings import settings

logger = logging.getLogger(__name__)

TOPICS = [
    "impression-events",
    "click-events",
    "conversion-events",
]

async def consume_events():
    """Kafka consumer — processes impression/click/conversion events and aggregates metrics."""
    consumer = AIOKafkaConsumer(
        *TOPICS,
        bootstrap_servers=settings.kafka_bootstrap_servers,
        group_id="analytics-service",
        auto_offset_reset="earliest",
        value_deserializer=lambda m: json.loads(m.decode("utf-8")),
        enable_auto_commit=True,
    )
    await consumer.start()
    logger.info("Kafka consumer started for topics: %s", TOPICS)
    try:
        async for msg in consumer:
            await handle_event(msg.topic, msg.value)
    except asyncio.CancelledError:
        pass
    finally:
        await consumer.stop()
        logger.info("Kafka consumer stopped")

async def handle_event(topic: str, event: dict):
    """Route events to appropriate aggregation handlers."""
    campaign_id = event.get("campaignId")
    if not campaign_id:
        logger.warning("Event missing campaignId on topic %s", topic)
        return

    if topic == "impression-events":
        logger.debug("Impression event for campaign %s", campaign_id)
        # TODO: upsert hourly bucket in impression_metrics
    elif topic == "click-events":
        logger.debug("Click event for campaign %s", campaign_id)
    elif topic == "conversion-events":
        logger.debug("Conversion event for campaign %s", campaign_id)
