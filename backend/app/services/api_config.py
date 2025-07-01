"""
🔧 API Configuration Service

This module provides centralized API configuration management and validation
for all external services used in LocationIQ Pro.
"""

import os
import logging
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from enum import Enum

from app.core.config import settings


class APIStatus(Enum):
    """API configuration status"""
    CONFIGURED = "configured"
    MISSING = "missing"
    INVALID = "invalid"


class APIPriority(Enum):
    """API priority levels"""
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


@dataclass
class APIConfig:
    """API configuration information"""
    name: str
    key_name: str
    description: str
    priority: APIPriority
    docs_url: str
    is_configured: bool
    validation_pattern: Optional[str] = None


class APIConfigurationService:
    """Service for managing external API configurations"""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self._api_configs = self._initialize_api_configs()
    
    def _initialize_api_configs(self) -> Dict[str, APIConfig]:
        """Initialize API configuration definitions"""
        apis = {
            # Core/Critical APIs
            "google_places": APIConfig(
                name="Google Places API",
                key_name="GOOGLE_PLACES_API_KEY",
                description="Location search, geocoding, and nearby places",
                priority=APIPriority.CRITICAL,
                docs_url="https://developers.google.com/maps/documentation/places",
                is_configured=bool(settings.GOOGLE_PLACES_API_KEY),
                validation_pattern=r"^AIza[0-9A-Za-z_-]{35}$"
            ),
            "mapbox": APIConfig(
                name="Mapbox API",
                key_name="MAPBOX_ACCESS_TOKEN",
                description="Interactive maps and map visualization",
                priority=APIPriority.CRITICAL,
                docs_url="https://docs.mapbox.com/api/",
                is_configured=bool(settings.MAPBOX_ACCESS_TOKEN),
                validation_pattern=r"^pk\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$"
            ),
            "openweather": APIConfig(
                name="OpenWeatherMap API",
                key_name="OPENWEATHER_API_KEY",
                description="Weather data and air quality information",
                priority=APIPriority.CRITICAL,
                docs_url="https://openweathermap.org/api",
                is_configured=bool(settings.OPENWEATHER_API_KEY),
                validation_pattern=r"^[a-f0-9]{32}$"
            ),
            
            # High Priority APIs
            "airvisual": APIConfig(
                name="AirVisual API",
                key_name="AIRVISUAL_API_KEY",
                description="Enhanced air quality and pollution data",
                priority=APIPriority.HIGH,
                docs_url="https://www.iqair.com/air-pollution-data-api",
                is_configured=bool(settings.AIRVISUAL_API_KEY)
            ),
            "openai": APIConfig(
                name="OpenAI API",
                key_name="OPENAI_API_KEY",
                description="AI-powered analysis and descriptions",
                priority=APIPriority.HIGH,
                docs_url="https://platform.openai.com/docs",
                is_configured=bool(settings.OPENAI_API_KEY),
                validation_pattern=r"^sk-[a-zA-Z0-9]{48}$"
            ),
            "booking": APIConfig(
                name="Booking.com API",
                key_name="BOOKING_API_KEY",
                description="Hotel prices and availability data",
                priority=APIPriority.HIGH,
                docs_url="https://developers.booking.com/",
                is_configured=bool(settings.BOOKING_API_KEY)
            ),
            
            # Medium Priority APIs
            "rentspree": APIConfig(
                name="RentSpree API",
                key_name="RENTSPREE_API_KEY",
                description="Real estate listings and rental data",
                priority=APIPriority.MEDIUM,
                docs_url="https://www.rentspree.com/api",
                is_configured=bool(settings.RENTSPREE_API_KEY)
            ),
            "amadeus": APIConfig(
                name="Amadeus Travel API",
                key_name="AMADEUS_API_KEY",
                description="Comprehensive travel and hospitality data",
                priority=APIPriority.MEDIUM,
                docs_url="https://developers.amadeus.com/",
                is_configured=bool(settings.AMADEUS_API_KEY)
            ),
            "sentry": APIConfig(
                name="Sentry",
                key_name="SENTRY_DSN",
                description="Error monitoring and performance tracking",
                priority=APIPriority.MEDIUM,
                docs_url="https://docs.sentry.io/",
                is_configured=bool(settings.SENTRY_DSN)
            ),
            
            # Low Priority APIs
            "sendgrid": APIConfig(
                name="SendGrid API",
                key_name="SENDGRID_API_KEY",
                description="Email notifications and communications",
                priority=APIPriority.LOW,
                docs_url="https://docs.sendgrid.com/",
                is_configured=bool(settings.SENDGRID_API_KEY)
            ),
            "stripe": APIConfig(
                name="Stripe API",
                key_name="STRIPE_SECRET_KEY",
                description="Payment processing for premium features",
                priority=APIPriority.LOW,
                docs_url="https://stripe.com/docs/api",
                is_configured=bool(settings.STRIPE_SECRET_KEY)
            ),
        }
        
        return apis
    
    def get_api_config(self, api_name: str) -> Optional[APIConfig]:
        """Get configuration for a specific API"""
        return self._api_configs.get(api_name)
    
    def get_apis_by_priority(self, priority: APIPriority) -> List[APIConfig]:
        """Get all APIs of a specific priority level"""
        return [
            config for config in self._api_configs.values()
            if config.priority == priority
        ]
    
    def get_configured_apis(self) -> List[APIConfig]:
        """Get list of configured APIs"""
        return [
            config for config in self._api_configs.values()
            if config.is_configured
        ]
    
    def get_missing_apis(self, priority: Optional[APIPriority] = None) -> List[APIConfig]:
        """Get list of missing APIs, optionally filtered by priority"""
        missing = [
            config for config in self._api_configs.values()
            if not config.is_configured
        ]
        
        if priority:
            missing = [config for config in missing if config.priority == priority]
        
        return missing
    
    def get_critical_apis_status(self) -> Dict[str, bool]:
        """Get status of critical APIs"""
        critical_apis = self.get_apis_by_priority(APIPriority.CRITICAL)
        return {api.name.lower().replace(" ", "_"): api.is_configured for api in critical_apis}
    
    def validate_configuration(self) -> Dict[str, str]:
        """Validate all configured APIs and return status report"""
        report = {
            "total_apis": len(self._api_configs),
            "configured_count": len(self.get_configured_apis()),
            "critical_missing": len(self.get_missing_apis(APIPriority.CRITICAL)),
            "high_missing": len(self.get_missing_apis(APIPriority.HIGH)),
            "warnings": [],
            "errors": []
        }
        
        # Check critical APIs
        critical_missing = self.get_missing_apis(APIPriority.CRITICAL)
        if critical_missing:
            for api in critical_missing:
                report["errors"].append(
                    f"Critical API missing: {api.name} ({api.key_name})"
                )
        
        # Check high priority APIs
        high_missing = self.get_missing_apis(APIPriority.HIGH)
        if high_missing:
            for api in high_missing:
                report["warnings"].append(
                    f"Recommended API missing: {api.name} ({api.key_name})"
                )
        
        return report
    
    def log_configuration_status(self):
        """Log current API configuration status"""
        report = self.validate_configuration()
        
        self.logger.info(f"API Configuration Status:")
        self.logger.info(f"  Total APIs: {report['total_apis']}")
        self.logger.info(f"  Configured: {report['configured_count']}")
        
        if report["errors"]:
            self.logger.error("Critical API configuration issues:")
            for error in report["errors"]:
                self.logger.error(f"  - {error}")
        
        if report["warnings"]:
            self.logger.warning("API configuration recommendations:")
            for warning in report["warnings"]:
                self.logger.warning(f"  - {warning}")
        
        if not report["errors"] and not report["warnings"]:
            self.logger.info("✅ All critical and recommended APIs are configured!")
    
    def get_setup_instructions(self) -> Dict[str, List[str]]:
        """Get setup instructions for missing APIs"""
        instructions = {
            "critical": [],
            "recommended": [],
            "optional": []
        }
        
        missing_critical = self.get_missing_apis(APIPriority.CRITICAL)
        missing_high = self.get_missing_apis(APIPriority.HIGH)
        missing_medium = self.get_missing_apis(APIPriority.MEDIUM)
        
        for api in missing_critical:
            instructions["critical"].append(
                f"{api.name}: {api.docs_url}"
            )
        
        for api in missing_high:
            instructions["recommended"].append(
                f"{api.name}: {api.docs_url}"
            )
        
        for api in missing_medium:
            instructions["optional"].append(
                f"{api.name}: {api.docs_url}"
            )
        
        return instructions
    
    def is_api_available(self, api_name: str) -> bool:
        """Check if a specific API is configured and available"""
        config = self.get_api_config(api_name)
        return config.is_configured if config else False
    
    def require_api(self, api_name: str) -> None:
        """Require an API to be configured, raise exception if not"""
        if not self.is_api_available(api_name):
            config = self.get_api_config(api_name)
            if config:
                raise ValueError(
                    f"Required API not configured: {config.name} ({config.key_name}). "
                    f"See documentation: {config.docs_url}"
                )
            else:
                raise ValueError(f"Unknown API: {api_name}")


# Global service instance
api_service = APIConfigurationService()


def get_api_service() -> APIConfigurationService:
    """Get the global API configuration service instance"""
    return api_service
