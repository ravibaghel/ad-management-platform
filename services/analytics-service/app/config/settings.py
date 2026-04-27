from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # App
    app_name: str = "analytics-service"
    port: int = 8081
    debug: bool = False

    # Database
    postgres_host: str = "localhost"
    postgres_port: int = 5432
    postgres_db: str = "adtech"
    postgres_user: str = "adtech"
    postgres_password: str = "adtech_secret"

    # Redis
    redis_host: str = "localhost"
    redis_port: int = 6379
    redis_password: str = ""

    # Kafka
    kafka_bootstrap_servers: str = "localhost:9092"

    # OTEL
    otel_exporter_otlp_endpoint: str = "http://localhost:4318"

    @property
    def database_url(self) -> str:
        return (f"postgresql+asyncpg://{self.postgres_user}:{self.postgres_password}"
                f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}")

    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
