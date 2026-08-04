import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Application metadata
    PROJECT_NAME: str = "QuickPlot Studio API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"

    # Debug & Pipeline Logging Toggle
    DEBUG: bool = True

    # Gemini AI configuration
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-3.5-flash-lite"
    AI_API_TIMEOUT_SECONDS: float = 3.0

    # Data upload & session caching
    MAX_UPLOAD_SIZE_MB: int = 5
    DATASET_CACHE_TTL_SECONDS: int = 3600  # TTL (Time-To-Live) for cached CSV datasets

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
