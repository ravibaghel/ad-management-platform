# Ad Campaign Management & Optimization Platform

A cloud-agnostic, end-to-end platform for creating, managing, and optimizing digital ad campaigns.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                        │
│           Dashboard · Campaigns · Analytics              │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/REST
┌──────────────────────▼──────────────────────────────────┐
│               campaign-service  (Java 21 / Spring Boot)  │
│   Campaign CRUD · Budget Engine · Lifecycle State Machine │
│              Delivery Integration · Billing              │
└───────┬──────────────────────────────────┬──────────────┘
        │ Kafka events                     │ Kafka events
┌───────▼───────────┐           ┌──────────▼──────────────┐
│ analytics-service │           │  optimization-service   │
│  (Python/FastAPI) │           │    (Python/FastAPI)     │
│ Metrics ingestion │           │  CTR prediction · Recs  │
│  Aggregation      │           │  Budget reallocation    │
└───────────────────┘           └─────────────────────────┘
        │                                  │
┌───────▼──────────────────────────────────▼──────────────┐
│           Data Layer                                     │
│   PostgreSQL · Redis · Kafka · MinIO (S3-compatible)    │
└─────────────────────────────────────────────────────────┘
```

## Services

| Service | Language | Port | Purpose |
|---|---|---|---|
| `campaign-service` | Java 21 / Spring Boot 3 | 8080 | Campaign CRUD, lifecycle, budget, billing |
| `analytics-service` | Python 3.12 / FastAPI | 8081 | Event ingestion, metrics aggregation |
| `optimization-service` | Python 3.12 / FastAPI | 8082 | CTR prediction, recommendations |
| `frontend` | React 18 / Vite | 3000 | Advertiser dashboard |

## Infrastructure (all self-hosted, cloud-agnostic)

| Component | Image | Port | Purpose |
|---|---|---|---|
| PostgreSQL | postgres:16 | 5432 | Primary datastore |
| Redis | redis:7 | 6379 | Cache, sessions, rate limiting |
| Kafka | apache/kafka:3.7 | 9092 | Event streaming (KRaft, no Zookeeper) |
| MinIO | minio/minio | 9000/9001 | S3-compatible object storage |
| Jaeger | jaegertracing/all-in-one | 16686 | Distributed tracing |
| Prometheus | prom/prometheus | 9090 | Metrics collection |
| Grafana | grafana/grafana | 3001 | Metrics dashboards |

## Quick Start

### Prerequisites
- Docker 24+ and Docker Compose v2
- Git

### Run locally

```bash
git clone https://github.com/ravibaghel/ad-management-platform.git
cd ad-management-platform

# Copy environment template
cp .env.example .env

# Start the full stack
docker compose up -d

# Seed initial data
./infra/scripts/seed.sh
```

### Service URLs (local)
- Frontend: http://localhost:3000
- Campaign API: http://localhost:8080/api
- API Docs (Swagger): http://localhost:8080/swagger-ui.html
- Analytics API: http://localhost:8081/api
- Optimization API: http://localhost:8082/api
- MinIO Console: http://localhost:9001
- Grafana: http://localhost:3001 (admin/admin)
- Jaeger UI: http://localhost:16686
- Prometheus: http://localhost:9090

## Project Structure

```
.
├── services/
│   ├── campaign-service/      # Java 21 / Spring Boot 3 / Gradle
│   ├── analytics-service/     # Python 3.12 / FastAPI
│   └── optimization-service/  # Python 3.12 / FastAPI
├── frontend/                  # React 18 / Vite / Tailwind CSS
├── infra/
│   ├── docker-compose.yml     # Full local stack
│   ├── helm/                  # Kubernetes Helm charts (prod)
│   └── scripts/               # Seed & utility scripts
├── docs/
│   └── adr/                   # Architecture Decision Records
├── .env.example               # Environment variable template
└── README.md
```

## Development

Each service has its own README with service-specific setup instructions.

## Environment Variables

All configuration is environment-variable driven for cloud-agnostic deployment.
See `.env.example` for the full list with descriptions.

## Contributing

1. Branch from `main`: `git checkout -b feat/your-feature`
2. Make changes and test locally with `docker compose up`
3. Open a PR — CI runs automatically
