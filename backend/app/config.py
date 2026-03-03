from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    secret_key: str = "winlytics-dev-secret-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7  # 7 days
    database_url: str = "sqlite+aiosqlite:///./winlytics.db"
    google_client_id: str = ""  # Set in .env for Google Sign-In (same as frontend NEXT_PUBLIC_GOOGLE_CLIENT_ID)

    class Config:
        env_file = ".env"


settings = Settings()
