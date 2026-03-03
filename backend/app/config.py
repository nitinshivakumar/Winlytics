from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    secret_key: str = "winlytics-dev-secret-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7  # 7 days
    database_url: str = "sqlite+aiosqlite:///./winlytics.db"
    google_client_id: str = ""  # Set in .env for Google Sign-In (same as frontend NEXT_PUBLIC_GOOGLE_CLIENT_ID)
    cors_origins: str = ""  # Comma-separated extra origins for production (e.g. https://winlytics.vercel.app)

    class Config:
        env_file = ".env"

    @property
    def cors_origins_list(self) -> list[str]:
        """Origins for CORS: localhost + any set in CORS_ORIGINS."""
        default = [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:3001",
            "http://127.0.0.1:3001",
        ]
        if self.cors_origins:
            default.extend(s.strip() for s in self.cors_origins.split(",") if s.strip())
        return default


settings = Settings()
