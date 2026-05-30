# SLO Runbook

## Purpose

This runbook defines proposed service-level objectives for the platform and the operating steps needed to keep reliability visible. These targets are readiness goals for production maturity; they should be validated against real usage before becoming external customer commitments.

## Proposed SLIs and SLOs

| Capability | SLI | Initial SLO |
| --- | --- | --- |
| Frontend availability | Successful dashboard page loads | 99.5% monthly |
| Campaign API availability | Non-5xx responses for campaign endpoints | 99.9% monthly |
| Campaign API latency | P95 latency for read/write endpoints | < 300 ms for reads, < 500 ms for writes |
| Auth reliability | Successful login and token refresh attempts | 99.9% monthly |
| Analytics freshness | Time from campaign event to queryable aggregate | P95 < 5 minutes |
| Optimization API latency | P95 recommendation response time | < 1 second |
| Event processing | Kafka consumer lag for analytics events | P95 lag < 2 minutes |

## Error Budget Policy

- If a service burns more than 50% of its monthly error budget in one week, pause non-critical feature work for that service and prioritize reliability fixes.
- If a service exhausts its monthly error budget, require engineering manager and tech lead approval before shipping risky changes.
- Incident follow-ups that protect the SLO take priority over new roadmap work until mitigations are complete.

## Dashboards

Minimum dashboard coverage:

- Request rate, error rate, and latency by service.
- Campaign endpoint latency and status code distribution.
- Auth login failures and token refresh failures.
- Kafka consumer lag by topic and consumer group.
- Database connection pool health and slow queries.
- Redis latency and cache hit rate for cached paths.

## Alerting Principles

- Alert on user impact or clear leading indicators of user impact.
- Route warnings to working channels and pages to on-call only for urgent action.
- Every page-level alert must have a runbook link.
- Review noisy alerts during monthly engineering review.

## Triage Steps

1. Confirm whether the issue is user-facing.
2. Identify affected service, endpoint, and time window.
3. Check recent deploys, error rate, latency, and dependency health.
4. Inspect logs and traces for representative failed requests.
5. Mitigate before root-causing when customers are affected.
6. Record timeline and follow-up actions in the incident document.

## Routine Operational Checks

Weekly:

- Review SLO dashboard and error budget burn.
- Check alert noise and missing runbook links.
- Inspect slowest campaign and analytics endpoints.
- Review dependency and container vulnerability reports.

Monthly:

- Review incident trends and recurring causes.
- Confirm runbooks match current architecture.
- Revisit SLO targets based on actual traffic and customer expectations.
- Validate backup and restore procedures for PostgreSQL.
