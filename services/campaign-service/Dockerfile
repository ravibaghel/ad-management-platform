# ── Build stage ────────────────────────────────────────────────────────────────
FROM gradle:8.7-jdk21-alpine AS builder
WORKDIR /app

COPY gradle/ gradle/
COPY settings.gradle build.gradle ./

RUN gradle dependencies --no-daemon 2>/dev/null || true

COPY src/ src/
RUN gradle bootJar --no-daemon -x test

# ── Runtime stage ──────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine AS runtime
WORKDIR /app

# Non-root user for security
RUN addgroup -S adtech && adduser -S adtech -G adtech
USER adtech

COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-jar", "app.jar"]
