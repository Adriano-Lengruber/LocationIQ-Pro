"""
API Router Configuration

This module sets up all API routes for the LocationIQ Pro application.
"""

from fastapi import APIRouter

from app.api.api_v1.endpoints import (
    locations,
    real_estate,
    hotels,
    environmental,
    security,
    infrastructure,
    analysis
)
from app.api.v1 import config

api_router = APIRouter()

# Include configuration endpoints
api_router.include_router(
    config.router,
    tags=["configuration"]
)

# Include all endpoint routers
api_router.include_router(
    locations.router,
    prefix="/locations",
    tags=["locations"]
)

api_router.include_router(
    real_estate.router,
    prefix="/real-estate",
    tags=["real-estate"]
)

api_router.include_router(
    hotels.router,
    prefix="/hotels",
    tags=["hotels"]
)

api_router.include_router(
    environmental.router,
    prefix="/environmental",
    tags=["environmental"]
)

api_router.include_router(
    security.router,
    prefix="/security",
    tags=["security"]
)

api_router.include_router(
    infrastructure.router,
    prefix="/infrastructure",
    tags=["infrastructure"]
)

api_router.include_router(
    analysis.router,
    prefix="/analysis",
    tags=["analysis"]
)
