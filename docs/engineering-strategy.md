# Engineering Strategy

## Strategy Summary

The engineering strategy is to preserve the platform's modular architecture while raising the bar for reliability, security, observability, and delivery confidence. The current service boundaries are appropriate for the product direction: campaign lifecycle in the Java service, analytics ingestion in FastAPI, optimization in a dedicated FastAPI service, and advertiser workflows in the React frontend.

## Technical Direction

| Area | Direction |
| --- | --- |
| Frontend | Keep React/Vite for the dashboard, with typed API clients and reusable workflow components |
| Campaign domain | Keep Spring Boot as the system of record for campaign lifecycle, auth, and ownership |
| Analytics | Use Kafka events and FastAPI workers for ingestion, aggregation, and reporting APIs |
| Optimization | Keep ML and recommendation logic isolated from transactional campaign workflows |
| Data stores | PostgreSQL for source-of-truth data, Redis for cache/session patterns, MinIO for future creative assets |
| Observability | Standardize metrics, logs, traces, dashboards, and runbooks before production scale |

## Quality Bar

Every production-grade feature should meet this bar before release:

- Clear owner and user outcome.
- API contract documented or typed.
- Auth, ownership, and validation behavior covered.
- Happy path and critical failure path tests.
- Metrics or logs for support diagnosis.
- Rollback or mitigation plan for risky changes.
- Documentation updated when the feature changes operating behavior.

## Architecture Evolution

### Near Term

- Finish campaign workflow and authentication hardening.
- Add typed request/response models across frontend and backend boundaries.
- Add API-level tests for campaign lifecycle and ownership.
- Introduce consistent error response shapes across services.

### Mid Term

- Define versioned Kafka event contracts for campaign changes and analytics events.
- Add Redis caching for high-traffic read paths with explicit invalidation rules.
- Standardize service health endpoints and readiness checks.
- Add audit logging to campaign, auth, and recommendation actions.

### Long Term

- Introduce multi-tenant access controls and team-level permissions.
- Add scalable analytics storage patterns if PostgreSQL aggregation becomes a bottleneck.
- Add model monitoring for recommendation quality and drift.
- Prepare production deployment patterns for Kubernetes or managed container platforms.

## Build vs. Buy Posture

| Capability | Default posture | Rationale |
| --- | --- | --- |
| Campaign workflow | Build | Core product differentiation and domain ownership |
| Authentication | Build now, evaluate managed providers later | MVP already includes JWT; enterprise SSO may require external providers |
| Observability | Buy or standardize on open-source stack | Prometheus, Grafana, and Jaeger are already aligned with cloud-agnostic goals |
| Creative storage | Use S3-compatible storage | MinIO provides local parity and cloud portability |
| ML optimization | Build incrementally | Recommendation quality is a product differentiator |

## Engineering Metrics

Track a balanced scorecard:

- Delivery: lead time, deployment frequency, planned vs. completed work.
- Quality: escaped defects, test coverage of critical paths, rollback rate.
- Reliability: availability, P95 latency, error rate, incident count.
- Operability: alert quality, mean time to acknowledge, mean time to restore.
- Maintainability: dependency freshness, code ownership clarity, architectural decision coverage.

## Technical Debt Policy

Technical debt should be visible, ranked, and tied to product risk. Debt gets priority when it blocks roadmap delivery, creates operational risk, increases security exposure, or makes onboarding materially harder. Small cleanup should happen inside feature work when it directly improves the touched area; broad refactors require their own business case.
