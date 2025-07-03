"""
Application Configuration Settings

This module contains all configuration settings for the LocationIQ Pro application.
It uses Pydantic for settings validation and environment variable management.
"""

try:
    from pydantic_settings import BaseSettings
except ImportError:
    from pydantic import BaseSettings
    
from typing import List, Optional


class Settings(BaseSettings):
    """Application settings with environment variable support"""
    
    # Application
    APP_NAME: str = "LocationIQ Pro"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Security
    SECRET_KEY: str = "your-secret-key-here"  # Change in production
    ALLOWED_HOSTS: List[str] = ["*"]
    
    # Database
    DATABASE_URL: str = "sqlite:///./locationiq_pro.db"
    DATABASE_ECHO: bool = False  # Set to True for SQL query logging
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    CACHE_TTL: int = 3600  # Cache TTL in seconds
    
    # External APIs - Core Services
    GOOGLE_PLACES_API_KEY: Optional[str] = None
    MAPBOX_ACCESS_TOKEN: Optional[str] = None
    OPENWEATHER_API_KEY: Optional[str] = None
    
    # IBGE APIs (Públicas)
    IBGE_BASE_URL: str = "https://servicodados.ibge.gov.br/api/v1"
    IBGE_LOCALIDADES_URL: str = "https://servicodados.ibge.gov.br/api/v1/localidades"
    IBGE_INDICADORES_URL: str = "https://servicodados.ibge.gov.br/api/v3/agregados"
    
    # Localização padrão (Itaperuna, RJ)
    DEFAULT_CITY_NAME: str = "Itaperuna"
    DEFAULT_STATE: str = "RJ"
    DEFAULT_COUNTRY: str = "Brasil"
    DEFAULT_LATITUDE: float = -21.2061
    DEFAULT_LONGITUDE: float = -41.8881
    DEFAULT_MUNICIPALITY_ID: int = 3302205  # Código IBGE de Itaperuna
    MAPBOX_CENTER_LAT: float = -21.2061
    MAPBOX_CENTER_LNG: float = -41.8881
    MAPBOX_ZOOM: int = 12
    
    # External APIs - Enhanced Services
    AIRVISUAL_API_KEY: Optional[str] = None
    RENTSPREE_API_KEY: Optional[str] = None
    REALTOR_API_KEY: Optional[str] = None
    BOOKING_API_KEY: Optional[str] = None
    AMADEUS_API_KEY: Optional[str] = None
    AMADEUS_API_SECRET: Optional[str] = None
    CRIME_DATA_API_KEY: Optional[str] = None
    
    # AI Services
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    
    # Analytics & Monitoring
    GOOGLE_ANALYTICS_ID: Optional[str] = None
    MIXPANEL_TOKEN: Optional[str] = None
    SENTRY_DSN: Optional[str] = None
    NEW_RELIC_LICENSE_KEY: Optional[str] = None
    
    # Communications
    SENDGRID_API_KEY: Optional[str] = None
    TWILIO_ACCOUNT_SID: Optional[str] = None
    TWILIO_AUTH_TOKEN: Optional[str] = None
    
    # Payments (Future)
    STRIPE_PUBLISHABLE_KEY: Optional[str] = None
    STRIPE_SECRET_KEY: Optional[str] = None
    
    # Machine Learning
    ML_MODEL_PATH: str = "app/ml/models"
    ML_DATA_PATH: str = "data"
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    # Data Collection
    MAX_CONCURRENT_REQUESTS: int = 10
    REQUEST_TIMEOUT: int = 30
    
    # File Upload
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_FILE_TYPES: List[str] = [".csv", ".json", ".xlsx"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create global settings instance
settings = Settings()


def get_database_url() -> str:
    """Get the complete database URL"""
    return settings.DATABASE_URL


def get_redis_url() -> str:
    """Get the complete Redis URL"""
    return settings.REDIS_URL


def is_production() -> bool:
    """Check if running in production environment"""
    return settings.ENVIRONMENT.lower() == "production"


def is_development() -> bool:
    """Check if running in development environment"""
    return settings.ENVIRONMENT.lower() == "development"


def get_critical_apis_status() -> dict:
    """Check status of critical API keys"""
    critical_apis = {
        "google_places": settings.GOOGLE_PLACES_API_KEY is not None,
        "mapbox": settings.MAPBOX_ACCESS_TOKEN is not None,
        "openweather": settings.OPENWEATHER_API_KEY is not None,
    }
    return critical_apis


def get_optional_apis_status() -> dict:
    """Check status of optional API keys"""
    optional_apis = {
        "airvisual": settings.AIRVISUAL_API_KEY is not None,
        "openai": settings.OPENAI_API_KEY is not None,
        "booking": settings.BOOKING_API_KEY is not None,
        "sentry": settings.SENTRY_DSN is not None,
    }
    return optional_apis


def validate_critical_apis() -> list:
    """Validate critical APIs and return list of missing ones"""
    missing_apis = []
    critical_status = get_critical_apis_status()
    
    for api_name, is_configured in critical_status.items():
        if not is_configured:
            missing_apis.append(api_name)
    
    return missing_apis


def log_api_status():
    """Log the status of all APIs for debugging"""
    import logging
    logger = logging.getLogger(__name__)
    
    critical_apis = get_critical_apis_status()
    optional_apis = get_optional_apis_status()
    
    logger.info("API Keys Status:")
    logger.info(f"Critical APIs configured: {sum(critical_apis.values())}/{len(critical_apis)}")
    logger.info(f"Optional APIs configured: {sum(optional_apis.values())}/{len(optional_apis)}")
    
    missing_critical = [name for name, status in critical_apis.items() if not status]
    if missing_critical:
        logger.warning(f"Missing critical API keys: {', '.join(missing_critical)}")
        logger.warning("Some features may not work properly. See api_keys_setup_guide.md")
