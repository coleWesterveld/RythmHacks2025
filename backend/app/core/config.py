from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Hackathon API"
    API_V1_STR: str = "/api/v1"
    
    # Database
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///./hackathon.db"
    
    class Config:
        case_sensitive = True

settings = Settings()
