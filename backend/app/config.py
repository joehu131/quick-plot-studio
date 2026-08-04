import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "QuickPlot Studio API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-3.5-flash-lite"
    MAX_UPLOAD_SIZE_MB: int = 5
    DATASET_CACHE_TTL_SECONDS: int = 3600
    AI_API_TIMEOUT_SECONDS: float = 3.0

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
