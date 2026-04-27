#!/usr/bin/env bash
set -euo pipefail

echo "⏳ Waiting for services to be healthy..."
sleep 5

echo "📦 Creating MinIO buckets..."
docker compose exec minio mc alias set local http://localhost:9000 minioadmin minioadmin
docker compose exec minio mc mb --ignore-existing local/creatives
docker compose exec minio mc mb --ignore-existing local/reports

echo "📨 Creating Kafka topics..."
docker compose exec kafka kafka-topics.sh \
  --bootstrap-server localhost:9092 --create --if-not-exists \
  --topic campaign-lifecycle-events --partitions 3 --replication-factor 1

docker compose exec kafka kafka-topics.sh \
  --bootstrap-server localhost:9092 --create --if-not-exists \
  --topic impression-events --partitions 6 --replication-factor 1

docker compose exec kafka kafka-topics.sh \
  --bootstrap-server localhost:9092 --create --if-not-exists \
  --topic click-events --partitions 6 --replication-factor 1

docker compose exec kafka kafka-topics.sh \
  --bootstrap-server localhost:9092 --create --if-not-exists \
  --topic conversion-events --partitions 3 --replication-factor 1

docker compose exec kafka kafka-topics.sh \
  --bootstrap-server localhost:9092 --create --if-not-exists \
  --topic billing-events --partitions 3 --replication-factor 1

docker compose exec kafka kafka-topics.sh \
  --bootstrap-server localhost:9092 --create --if-not-exists \
  --topic optimization-recommendations --partitions 3 --replication-factor 1

docker compose exec kafka kafka-topics.sh \
  --bootstrap-server localhost:9092 --create --if-not-exists \
  --topic campaign-outbox --partitions 3 --replication-factor 1

echo "✅ Seed complete!"
echo ""
echo "Service URLs:"
echo "  Frontend:       http://localhost:3000"
echo "  Campaign API:   http://localhost:8080/api"
echo "  Swagger UI:     http://localhost:8080/swagger-ui.html"
echo "  Analytics API:  http://localhost:8081/api"
echo "  Optimizer API:  http://localhost:8082/api"
echo "  MinIO Console:  http://localhost:9001  (minioadmin/minioadmin)"
echo "  Grafana:        http://localhost:3001  (admin/admin)"
echo "  Jaeger:         http://localhost:16686"
echo "  Prometheus:     http://localhost:9090"
