# Security and Compliance

## Security Posture

The platform should treat security and compliance as product requirements, not late-stage review items. The current architecture already separates user-facing workflows, campaign ownership, analytics processing, optimization logic, and infrastructure. The next step is to make controls explicit, testable, and auditable.

## Security Principles

- Authenticate every user-facing request.
- Authorize every campaign operation by owner or role.
- Store secrets outside source control.
- Log material changes without exposing sensitive data.
- Prefer least privilege for services, users, and infrastructure.
- Make security controls part of delivery readiness.

## Current Control Areas

| Area | Current direction | Maturity goal |
| --- | --- | --- |
| Authentication | JWT-based auth flow in campaign service | Email/password, refresh rotation, secure token storage |
| Authorization | Advertiser-owned campaign access | Role-based access control and team permissions |
| Data protection | PostgreSQL source of truth and environment-driven config | Encryption in transit, backup validation, data retention |
| Secrets | `.env.example` documents configuration | Secret manager integration for production |
| Observability | Prometheus, Grafana, Jaeger in local stack | Security-relevant logging and alerting |
| Auditability | Planned for future phases | Immutable audit logs for critical changes |

## Compliance Roadmap

### Phase 1: Secure MVP

- Add email/password registration with bcrypt password hashing.
- Implement refresh token rotation.
- Enforce campaign ownership on all campaign read and write paths.
- Add dependency scanning to CI.
- Document secure local development practices.

### Phase 2: Governance Foundation

- Add audit logging for campaign lifecycle changes.
- Add role-based access control for team use.
- Define data retention expectations for campaign and analytics data.
- Add access review process for production systems.
- Validate backup and restore procedures.

### Phase 3: Enterprise Readiness

- Support SSO or enterprise identity providers.
- Produce compliance evidence from documented controls.
- Add formal incident response handling for security events.
- Add data deletion and export workflows where required by privacy commitments.
- Review third-party integrations for data-sharing and vendor risk.

## Secure Delivery Checklist

Before release, security-sensitive changes should confirm:

- Authentication and authorization behavior is tested.
- Secrets are not committed.
- Logs do not expose passwords, tokens, or sensitive campaign data.
- New endpoints have validation and rate-limit considerations.
- Database migrations preserve least-privilege assumptions.
- Operational runbooks include security-relevant failure modes.

## Incident Handling for Security Events

Security incidents follow the [Incident Response Playbook](./incident-response-playbook.md) with SEV1 classification when there is confirmed or likely data exposure, credential compromise, unauthorized campaign access, or material compliance risk.

## Manager Responsibilities

The engineering manager is responsible for making security work visible in planning, ensuring owners are assigned, tracking control gaps, and escalating compliance risks early. The manager should also protect time for remediation work when security findings are discovered.
