# ADR 0003: Cloud-Agnostic Infrastructure

## Status

Accepted

## Context

The platform should be portable across local development, self-hosted environments, and future cloud deployments. Early vendor lock-in could slow experimentation and make portfolio review harder to reproduce.

## Decision

Use cloud-agnostic infrastructure primitives:

- Docker Compose for local orchestration.
- PostgreSQL for relational persistence.
- Redis for caching and session-oriented patterns.
- Kafka for event streaming.
- MinIO for S3-compatible object storage.
- Prometheus, Grafana, and Jaeger for observability.

## Consequences

Benefits:

- Developers can run the full stack locally.
- Production deployment can move to managed equivalents later.
- Architecture remains understandable without vendor-specific assumptions.
- Portfolio reviewers can inspect the system without cloud account access.

Tradeoffs:

- The team must still design production-grade deployment, backup, and security controls.
- Managed services may eventually be preferable for operational burden.
- Local parity does not guarantee production resilience.

## Leadership Notes

Cloud agnosticism is useful while the platform is maturing. The engineering manager should revisit this decision when reliability requirements, team size, and customer commitments make managed services more cost-effective.
