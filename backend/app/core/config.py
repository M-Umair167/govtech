from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "GovTech"
    API_V1_STR: str = "/api/v1"
    
    # These values must be provided via environment variables or .env.local file
    DATABASE_URL: str
    SECRET_KEY: str
    
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        # Look for .env.local in the root directory (govtech/.env.local)
        # file: backend/app/core/config.py
        # dirname 1: backend/app/core
        # dirname 2: backend/app
        # dirname 3: backend
        # dirname 4: govtech (root)
        env_file = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), ".env.local")
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
