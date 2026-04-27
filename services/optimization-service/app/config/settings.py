from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "optimization-service"
    port: int = 8082
    analytics_service_url: str = "http://localhost:8081"
    kafka_bootstrap_servers: str = "localhost:9092"
    postgres_host: str = "localhost"
    postgres_port: int = 5432
    postgres_db: str = "adtech"
    postgres_user: str = "adtech"
    postgres_password: str = "adtech_secret"

    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
