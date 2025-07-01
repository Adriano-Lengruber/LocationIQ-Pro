"""
🔧 API Configuration Endpoints

Endpoints for checking and managing external API configurations.
"""

from fastapi import APIRouter, HTTPException
from typing import Dict, List, Any

from app.services.api_config import get_api_service, APIPriority

router = APIRouter(prefix="/api/config", tags=["Configuration"])


@router.get("/apis/status", response_model=Dict[str, Any])
async def get_apis_status():
    """
    Get the status of all external API configurations.
    
    Returns information about which APIs are configured, missing,
    and their priority levels.
    """
    api_service = get_api_service()
    
    # Get validation report
    report = api_service.validate_configuration()
    
    # Get APIs by priority
    critical_apis = api_service.get_apis_by_priority(APIPriority.CRITICAL)
    high_apis = api_service.get_apis_by_priority(APIPriority.HIGH)
    medium_apis = api_service.get_apis_by_priority(APIPriority.MEDIUM)
    low_apis = api_service.get_apis_by_priority(APIPriority.LOW)
    
    def format_api_list(apis):
        return [
            {
                "name": api.name,
                "key_name": api.key_name,
                "configured": api.is_configured,
                "description": api.description,
                "docs_url": api.docs_url
            }
            for api in apis
        ]
    
    return {
        "summary": {
            "total_apis": report["total_apis"],
            "configured_count": report["configured_count"],
            "critical_missing": report["critical_missing"],
            "high_missing": report["high_missing"],
            "configuration_level": "complete" if report["critical_missing"] == 0 else "partial"
        },
        "apis_by_priority": {
            "critical": format_api_list(critical_apis),
            "high": format_api_list(high_apis),
            "medium": format_api_list(medium_apis),
            "low": format_api_list(low_apis)
        },
        "issues": {
            "errors": report["errors"],
            "warnings": report["warnings"]
        },
        "setup_instructions": api_service.get_setup_instructions()
    }


@router.get("/apis/{api_name}/status")
async def get_api_status(api_name: str):
    """
    Get the status of a specific API.
    
    Args:
        api_name: Name of the API to check (e.g., 'google_places', 'openweather')
    """
    api_service = get_api_service()
    config = api_service.get_api_config(api_name)
    
    if not config:
        raise HTTPException(
            status_code=404,
            detail=f"API configuration not found: {api_name}"
        )
    
    return {
        "name": config.name,
        "key_name": config.key_name,
        "configured": config.is_configured,
        "priority": config.priority.value,
        "description": config.description,
        "docs_url": config.docs_url,
        "available": api_service.is_api_available(api_name)
    }


@router.get("/apis/health")
async def check_apis_health():
    """
    Quick health check for critical APIs.
    
    Returns a simple status indicating if the application
    can function with the current API configuration.
    """
    api_service = get_api_service()
    report = api_service.validate_configuration()
    
    critical_missing = report["critical_missing"]
    health_status = "healthy" if critical_missing == 0 else "degraded"
    
    configured_apis = api_service.get_configured_apis()
    missing_critical = api_service.get_missing_apis(APIPriority.CRITICAL)
    
    return {
        "status": health_status,
        "configured_apis_count": len(configured_apis),
        "critical_apis_missing": len(missing_critical),
        "can_function": critical_missing == 0,
        "message": (
            "All critical APIs configured" if critical_missing == 0
            else f"{critical_missing} critical API(s) missing"
        ),
        "missing_critical_apis": [
            {
                "name": api.name,
                "key_name": api.key_name,
                "docs_url": api.docs_url
            }
            for api in missing_critical
        ]
    }


@router.get("/setup/instructions")
async def get_setup_instructions():
    """
    Get step-by-step setup instructions for configuring APIs.
    
    Returns organized instructions for setting up missing APIs
    based on their priority levels.
    """
    api_service = get_api_service()
    instructions = api_service.get_setup_instructions()
    
    return {
        "message": "API Setup Instructions for LocationIQ Pro",
        "setup_steps": [
            {
                "step": 1,
                "title": "Edit the central configuration file",
                "description": "Open api_keys_config.env in the project root"
            },
            {
                "step": 2,
                "title": "Add your API keys",
                "description": "Replace placeholder values with your actual API keys"
            },
            {
                "step": 3,
                "title": "Run the setup script",
                "description": "Execute: python setup_api_keys.py"
            },
            {
                "step": 4,
                "title": "Restart the application",
                "description": "Restart both backend and frontend services"
            }
        ],
        "apis_to_configure": {
            "critical": {
                "description": "Required for basic functionality",
                "apis": instructions["critical"]
            },
            "recommended": {
                "description": "Enhances features and functionality",
                "apis": instructions["recommended"]
            },
            "optional": {
                "description": "Additional features and integrations",
                "apis": instructions["optional"]
            }
        },
        "useful_links": {
            "setup_guide": "/docs/api_keys_setup_guide.md",
            "central_config": "/api_keys_config.env",
            "backend_template": "/backend/.env.example"
        }
    }
