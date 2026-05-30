# Incident Response Playbook

## Purpose

This playbook defines how the team should respond to reliability, security, and data incidents. The goal is fast mitigation, clear ownership, calm communication, and durable learning.

## Severity Levels

| Severity | Definition | Examples | Response target |
| --- | --- | --- | --- |
| SEV1 | Broad customer impact or data/security risk | Campaign API unavailable, data exposure, widespread auth failure | Acknowledge in 5 minutes, mitigate urgently |
| SEV2 | Significant degraded functionality | Analytics stale for many users, high error rate on campaign updates | Acknowledge in 15 minutes |
| SEV3 | Limited impact or clear workaround | Single dashboard widget failing, isolated integration issue | Acknowledge same business day |
| SEV4 | Minor defect or operational concern | Non-urgent alert, documentation mismatch | Track in normal backlog |

## Incident Roles

| Role | Responsibility |
| --- | --- |
| Incident Commander | Coordinates response, owns timeline, keeps team focused |
| Technical Lead | Drives diagnosis and mitigation |
| Communications Lead | Shares status updates with stakeholders |
| Scribe | Records timeline, decisions, and follow-ups |
| Engineering Manager | Handles prioritization tradeoffs and stakeholder escalation |

For small incidents, one person may hold multiple roles, but ownership should still be explicit.

## Response Flow

1. Declare severity and open an incident channel.
2. Assign roles.
3. Confirm customer impact and affected systems.
4. Stabilize or mitigate first.
5. Communicate status at the severity-appropriate cadence.
6. Validate recovery with metrics and user-flow checks.
7. Close the incident only after impact is resolved.
8. Schedule a post-incident review for SEV1 and SEV2 incidents.

## Communication Cadence

| Severity | Internal updates | Stakeholder updates |
| --- | --- | --- |
| SEV1 | Every 15 minutes | Every 30 minutes or at major changes |
| SEV2 | Every 30 minutes | Hourly or at major changes |
| SEV3 | At start and resolution | As needed |
| SEV4 | Normal backlog updates | Not usually needed |

## Mitigation Playbook

Common mitigation options:

- Roll back the most recent deploy.
- Disable a risky feature flag or workflow.
- Scale affected service replicas.
- Drain or pause a failing consumer.
- Temporarily bypass cache if stale data is worse than latency.
- Apply database connection or query limits to protect shared resources.

Mitigation decisions should prefer customer recovery over perfect root cause analysis during active impact.

## Post-Incident Review

Post-incident reviews should be blameless and completed within five business days for SEV1 and SEV2 incidents.

Required sections:

- Customer impact.
- Timeline.
- Root cause and contributing factors.
- What worked well.
- What made response harder.
- Corrective actions with owners and due dates.
- SLO impact and error budget consumed.

## Follow-Up Ownership

The engineering manager owns follow-up completion tracking. The technical lead owns technical correctness of mitigations. Product ownership is required when follow-ups change user experience, roadmap priority, or customer commitments.
