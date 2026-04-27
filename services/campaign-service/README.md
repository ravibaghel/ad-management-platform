# campaign-service

Java 21 / Spring Boot 3 / Gradle — transactional core of the platform.

## Responsibilities
- Campaign CRUD with full lifecycle state machine
- Budget tracking with optimistic locking (prevents over-spend)
- JWT authentication
- Kafka event publishing for all lifecycle changes
- Flyway database migrations

## Run locally (standalone)

```bash
# Requires postgres, redis, kafka running (use root docker-compose)
./gradlew bootRun
```

## API docs
http://localhost:8080/swagger-ui.html

## Key packages
| Package | Purpose |
|---|---|
| `model` | JPA entities + enums |
| `repository` | Spring Data JPA repositories |
| `service` | Business logic, state machine |
| `controller` | REST endpoints |
| `dto` | Request/response objects |
| `kafka` | Event publishers |
| `config` | Security, JWT, OpenAPI |
| `exception` | Domain exceptions + global handler |
