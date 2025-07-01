"""
Database Models

This module imports all database models and sets up relationships.
"""

from sqlalchemy.orm import relationship

# Import all models to ensure they are registered with SQLAlchemy
from app.models.location import Location
from app.models.real_estate import Property, PropertyPrice, MarketAnalysis
from app.models.environmental import (
    AirQualityData, 
    ClimateData, 
    EnvironmentalRisk, 
    EnvironmentalScore
)
from app.models.security import (
    CrimeData,
    SecurityInfrastructure, 
    SecurityScore,
    PoliceStation
)

# Set up relationships after all models are imported

# Location relationships
Location.properties = relationship("Property", back_populates="location")
Location.air_quality_data = relationship("AirQualityData", back_populates="location")
Location.climate_data = relationship("ClimateData", back_populates="location")
Location.environmental_risks = relationship("EnvironmentalRisk", back_populates="location")
Location.environmental_scores = relationship("EnvironmentalScore", back_populates="location")
Location.crime_data = relationship("CrimeData", back_populates="location")
Location.security_infrastructure = relationship("SecurityInfrastructure", back_populates="location")
Location.security_scores = relationship("SecurityScore", back_populates="location")

# Property relationships
Property.price_history = relationship("PropertyPrice", back_populates="property")

# Export all models
__all__ = [
    "Location",
    "Property", 
    "PropertyPrice", 
    "MarketAnalysis",
    "AirQualityData",
    "ClimateData", 
    "EnvironmentalRisk",
    "EnvironmentalScore",
    "CrimeData",
    "SecurityInfrastructure",
    "SecurityScore", 
    "PoliceStation"
]
