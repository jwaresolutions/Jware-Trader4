"""
Configuration management for Market Data Service
"""
from pydantic_settings import BaseSettings
from pydantic import Field, validator
from typing import List, Optional
import os


class Settings(BaseSettings):
    """
    Application settings with validation
    """
    # Environment
    PYTHON_ENV: str = Field(default="development", env="PYTHON_ENV")
    
    # Database
    POSTGRES_USER: str = Field(..., env="POSTGRES_USER")
    POSTGRES_PASSWORD: str = Field(..., env="POSTGRES_PASSWORD")
    POSTGRES_DB: str = Field(..., env="POSTGRES_DB")
    POSTGRES_HOST: str = Field(default="jware-postgres", env="POSTGRES_HOST")
    POSTGRES_PORT: int = Field(default=5432, env="POSTGRES_PORT")
    
    # Redis
    REDIS_HOST: str = Field(default="jware-redis", env="REDIS_HOST")
    REDIS_PORT: int = Field(default=6379, env="REDIS_PORT")
    REDIS_PASSWORD: str = Field(..., env="REDIS_PASSWORD")
    
    # CORS
    ALLOWED_ORIGINS: List[str] = Field(
        default=["http://localhost:3000", "http://localhost:3001"]
    )
    
    # Rate limiting
    RATE_LIMIT_REQUESTS: int = Field(default=100)
    RATE_LIMIT_PERIOD: int = Field(default=60)  # seconds
    
    # Logging
    LOG_LEVEL: str = Field(default="INFO")
    LOG_FORMAT: str = Field(default="json")
    
    @validator("PYTHON_ENV")
    def validate_environment(cls, v):
        allowed = ["development", "staging", "production"]
        if v not in allowed:
            raise ValueError(f"PYTHON_ENV must be one of {allowed}")
        return v
    
    @validator("LOG_LEVEL")
    def validate_log_level(cls, v):
        allowed = ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]
        if v.upper() not in allowed:
            raise ValueError(f"LOG_LEVEL must be one of {allowed}")
        return v.upper()
    
    @property
    def DATABASE_URL(self) -> str:
        """
        Construct database URL
        """
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
            f"?ssl=disable"
        )
    
    @property
    def SYNC_DATABASE_URL(self) -> str:
        """
        Construct synchronous database URL for Alembic
        """
        return (
            f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )
    
    @property
    def REDIS_URL(self) -> str:
        """
        Construct Redis URL
        """
        return f"redis://:{self.REDIS_PASSWORD}@{self.REDIS_HOST}:{self.REDIS_PORT}/0"
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        
        # Allow extra fields for forward compatibility
        extra = "allow"


# Create settings instance
settings = Settings()

# Export configuration as dict for logging (without sensitive data)
def get_safe_config() -> dict:
    """
    Get configuration without sensitive data for logging
    """
    config = settings.dict()
    sensitive_keys = [
        "POSTGRES_PASSWORD", 
        "REDIS_PASSWORD", 
        "DATABASE_URL",
        "SYNC_DATABASE_URL",
        "REDIS_URL"
    ]
    
    for key in sensitive_keys:
        if key in config:
            config[key] = "***REDACTED***"
    
    return config
