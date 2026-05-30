# ADR 0002: Event-Driven Analytics with Kafka

## Status

Accepted

## Context

Campaign lifecycle events and performance metrics should feed analytics and optimization without making user-facing campaign workflows wait on downstream processing. The platform also needs a path toward real-time dashboards, recommendations, and anomaly detection.

## Decision

Use Kafka as the event backbone between campaign activity, analytics processing, and optimization workflows. The campaign service publishes domain events, while analytics and optimization consumers process those events asynchronously.

## Consequences

Benefits:

- Decouples campaign writes from analytics processing.
- Supports replay and future consumers.
- Creates a foundation for real-time reporting and optimization.
- Reduces direct service-to-service coupling.

Tradeoffs:

- Requires event schema discipline.
- Requires monitoring for consumer lag and failed processing.
- Introduces eventual consistency between campaign writes and analytics views.

## Leadership Notes

The team should define event contracts before analytics usage expands. The engineering manager should track data freshness as a product quality metric, not only an infrastructure metric.
