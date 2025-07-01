"""
Environmental Models

This module contains models for environmental data and analysis.
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class AirQualityData(Base):
    """
    Air quality measurements for different locations.
    """
    __tablename__ = "air_quality_data"

    id = Column(Integer, primary_key=True, index=True)
    
    # Location reference
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    location = relationship("Location")
    
    # Air Quality Index
    aqi = Column(Integer)  # Air Quality Index
    aqi_category = Column(String(20))  # good, moderate, unhealthy, hazardous
    
    # Pollutant concentrations (μg/m³)
    pm25 = Column(Float)  # Fine particulate matter
    pm10 = Column(Float)  # Coarse particulate matter
    co = Column(Float)    # Carbon monoxide
    no2 = Column(Float)   # Nitrogen dioxide
    so2 = Column(Float)   # Sulfur dioxide
    o3 = Column(Float)    # Ozone
    
    # Data source
    data_source = Column(String(50))  # openweather, aqicn, cetesb
    source_station_id = Column(String(100))
    
    # Timestamps
    measured_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<AirQualityData(location_id={self.location_id}, aqi={self.aqi})>"


class ClimateData(Base):
    """
    Climate and weather data for locations.
    """
    __tablename__ = "climate_data"

    id = Column(Integer, primary_key=True, index=True)
    
    # Location reference
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    location = relationship("Location")
    
    # Temperature data (°C)
    temperature = Column(Float)
    temperature_min = Column(Float)
    temperature_max = Column(Float)
    feels_like = Column(Float)
    
    # Other climate metrics
    humidity = Column(Float)  # percentage
    pressure = Column(Float)  # hPa
    wind_speed = Column(Float)  # km/h
    wind_direction = Column(Float)  # degrees
    visibility = Column(Float)  # km
    uv_index = Column(Float)
    
    # Weather conditions
    weather_condition = Column(String(50))  # sunny, cloudy, rainy, etc.
    weather_description = Column(String(200))
    cloud_coverage = Column(Float)  # percentage
    
    # Precipitation
    precipitation = Column(Float)  # mm
    precipitation_probability = Column(Float)  # percentage
    
    # Data source
    data_source = Column(String(50))  # openweather, inmet
    
    # Timestamps
    measured_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<ClimateData(location_id={self.location_id}, temp={self.temperature})>"


class EnvironmentalRisk(Base):
    """
    Environmental risk assessment for locations.
    """
    __tablename__ = "environmental_risks"

    id = Column(Integer, primary_key=True, index=True)
    
    # Location reference
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    location = relationship("Location")
    
    # Risk categories (0-10 scale)
    flood_risk = Column(Float)
    earthquake_risk = Column(Float)
    fire_risk = Column(Float)
    landslide_risk = Column(Float)
    drought_risk = Column(Float)
    pollution_risk = Column(Float)
    
    # Overall risk score
    overall_risk_score = Column(Float)
    risk_category = Column(String(20))  # low, medium, high, extreme
    
    # Risk factors
    risk_factors = Column(Text)  # JSON string with detailed factors
    
    # Analysis metadata
    analysis_date = Column(DateTime(timezone=True), server_default=func.now())
    model_version = Column(String(50))
    data_sources = Column(Text)  # JSON string with data sources used
    
    def __repr__(self):
        return f"<EnvironmentalRisk(location_id={self.location_id}, score={self.overall_risk_score})>"


class EnvironmentalScore(Base):
    """
    Comprehensive environmental quality score for locations.
    """
    __tablename__ = "environmental_scores"

    id = Column(Integer, primary_key=True, index=True)
    
    # Location reference
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    location = relationship("Location")
    
    # Component scores (0-10 scale)
    air_quality_score = Column(Float)
    climate_score = Column(Float)
    risk_score = Column(Float)
    noise_level_score = Column(Float)
    green_space_score = Column(Float)
    
    # Overall environmental score
    overall_score = Column(Float)
    score_category = Column(String(20))  # excellent, good, fair, poor
    
    # Score calculation metadata
    calculation_date = Column(DateTime(timezone=True), server_default=func.now())
    model_version = Column(String(50))
    confidence_level = Column(Float)
    
    def __repr__(self):
        return f"<EnvironmentalScore(location_id={self.location_id}, score={self.overall_score})>"
