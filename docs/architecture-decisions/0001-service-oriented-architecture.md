# ADR 0001: Service-Oriented Platform Architecture

## Status

Accepted

## Context

The platform needs to support campaign management, analytics ingestion, optimization recommendations, and an advertiser dashboard. These concerns have different scaling patterns, release risks, and technical needs.

## Decision

Use a service-oriented architecture with:

- React frontend for advertiser workflows.
- Spring Boot campaign service for campaign lifecycle, auth, ownership, and transactional APIs.
- FastAPI analytics service for metrics ingestion and aggregation.
- FastAPI optimization service for CTR prediction and recommendations.
- Shared infrastructure through PostgreSQL, Redis, Kafka, MinIO, Prometheus, Grafana, and Jaeger.

## Consequences

Benefits:

- Clear ownership boundaries.
- Independent evolution of campaign, analytics, and optimization capabilities.
- Better fit between language/framework choices and domain needs.
- Cleaner path to scale high-throughput analytics separately from transactional APIs.

Tradeoffs:

- Requires stronger API and event contracts.
- Adds operational complexity compared with a monolith.
- Needs consistent observability and deployment practices across services.

## Leadership Notes

This decision supports team growth because ownership can be assigned by domain. The engineering manager should ensure boundaries stay clear and that cross-service dependencies are planned deliberately.
