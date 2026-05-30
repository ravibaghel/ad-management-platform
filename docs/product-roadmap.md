# Product Roadmap

## Product Vision

The Ad Campaign Management and Optimization Platform helps advertisers create, manage, measure, and improve digital campaigns from one dashboard. The roadmap should turn the current campaign-management MVP into a decision-support product that combines campaign workflow, performance analytics, and optimization recommendations.

## Strategic Outcomes

| Outcome | Why it matters | Example metric |
| --- | --- | --- |
| Faster campaign launch | Advertisers need low-friction setup | Median time from login to active campaign |
| Trustworthy campaign control | Teams need safe editing, status changes, and ownership | Campaign mutation error rate |
| Actionable performance insight | Analytics make the platform valuable beyond CRUD | Percentage of campaigns viewed with analytics |
| Optimization guidance | Recommendations create differentiation | Recommendation adoption rate |
| Enterprise readiness | Governance unlocks larger customers | Audit coverage and role-based access adoption |

## Roadmap Horizons

### Horizon 1: Complete the Campaign MVP

Focus: make the core campaign workflow usable, safe, and testable.

Planned capabilities:

- Email/password registration, login, refresh tokens, and user-owned campaigns.
- Campaign editing, soft deletion, detail pages, and status transition UI.
- Search, filtering, pagination improvements, optimistic updates, and clear error states.
- Focused frontend, backend, and API tests around campaign lifecycle paths.

Success criteria:

- Users can create, update, activate, pause, and inspect campaigns without direct API calls.
- Campaign ownership is enforced consistently.
- Critical user flows have automated coverage.
- The UI handles validation, unauthorized access, and network errors clearly.

### Horizon 2: Analytics and Reporting

Focus: turn campaign activity into visibility.

Planned capabilities:

- Campaign performance dashboards for impressions, clicks, CTR, conversions, and budget pacing.
- Redis-backed analytics caching for common reporting windows.
- CSV export and shareable reporting views.
- Real-time or near-real-time updates for high-value metrics.

Success criteria:

- Advertisers can understand campaign performance without leaving the platform.
- P95 analytics query latency stays within the SLO targets in [SLO Runbook](./slo-runbook.md).
- Analytics data lineage is documented from campaign events through reporting views.

### Horizon 3: Optimization and Recommendations

Focus: move from reporting to guidance.

Planned capabilities:

- CTR prediction improvements in the optimization service.
- Budget reallocation recommendations with confidence levels.
- "Apply recommendation" workflows with audit trails.
- A/B testing support for campaign variants.

Success criteria:

- Recommendations explain both the suggested action and the confidence level.
- Users can accept or reject recommendations with traceable outcomes.
- Optimization changes are reversible and auditable.

### Horizon 4: Enterprise Governance

Focus: make the platform appropriate for larger teams and regulated buyers.

Planned capabilities:

- Role-based access control and team management.
- Audit logs for campaign, creative, billing, and permission changes.
- Data retention policy controls.
- Security reviews, dependency scanning, and compliance evidence collection.

Success criteria:

- Administrative users can manage team access without engineering support.
- Material user and campaign changes are recorded in immutable audit logs.
- Security and compliance evidence can be produced from documented controls.

## Prioritization Model

Use a weighted score for roadmap decisions:

| Criterion | Weight | Notes |
| --- | ---: | --- |
| Customer value | 35% | Does this solve a clear advertiser workflow or pain point? |
| Risk reduction | 25% | Does it reduce reliability, security, compliance, or support risk? |
| Strategic differentiation | 20% | Does it strengthen analytics or optimization advantage? |
| Delivery confidence | 10% | Is scope well understood and testable? |
| Reuse leverage | 10% | Does it create capabilities used by future features? |

## Key Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| Core workflow remains incomplete while advanced features expand | Gate Horizon 2 work on Horizon 1 acceptance criteria |
| Analytics data becomes hard to reconcile | Define event contracts and data quality checks before broad reporting |
| Optimization recommendations lose user trust | Show confidence, rationale, and rollback options |
| Enterprise features add process without value | Tie governance work to explicit buyer requirements and audit needs |

## Review Cadence

- Review roadmap quarterly.
- Re-score active and proposed work after each major release.
- Use incident reviews, customer feedback, support tickets, and performance metrics as roadmap inputs.
