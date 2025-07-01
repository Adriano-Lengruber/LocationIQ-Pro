"""
Security Models

This module contains models for security and crime data.
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class CrimeData(Base):
    """
    Crime incident data for locations.
    """
    __tablename__ = "crime_data"

    id = Column(Integer, primary_key=True, index=True)
    
    # Location reference
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    location = relationship("Location")
    
    # Crime details
    crime_type = Column(String(50), nullable=False)  # theft, robbery, assault, etc.
    crime_category = Column(String(30))  # violent, property, drug, etc.
    crime_description = Column(Text)
    
    # Incident details
    incident_date = Column(DateTime(timezone=True), nullable=False)
    incident_time = Column(String(10))  # HH:MM format
    day_of_week = Column(String(15))
    month = Column(Integer)
    year = Column(Integer)
    
    # Location details
    exact_latitude = Column(Float)
    exact_longitude = Column(Float)
    street_address = Column(String(300))
    neighborhood = Column(String(100))
    
    # Incident characteristics
    severity_level = Column(Integer)  # 1-5 scale
    was_resolved = Column(Boolean, default=False)
    victims_count = Column(Integer)
    suspects_count = Column(Integer)
    
    # Data source
    data_source = Column(String(50))  # ssp, civil_police, military_police
    incident_id = Column(String(100))  # external incident ID
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<CrimeData(type='{self.crime_type}', date={self.incident_date})>"


class SecurityInfrastructure(Base):
    """
    Security infrastructure data for areas.
    """
    __tablename__ = "security_infrastructure"

    id = Column(Integer, primary_key=True, index=True)
    
    # Location reference
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    location = relationship("Location")
    
    # Infrastructure counts (within radius)
    police_stations_count = Column(Integer, default=0)
    police_patrols_count = Column(Integer, default=0)
    security_cameras_count = Column(Integer, default=0)
    emergency_centers_count = Column(Integer, default=0)
    fire_stations_count = Column(Integer, default=0)
    hospitals_count = Column(Integer, default=0)
    
    # Lighting and visibility
    street_lighting_quality = Column(Float)  # 0-10 scale
    visibility_score = Column(Float)  # 0-10 scale
    
    # Response times (minutes)
    police_response_time = Column(Float)
    ambulance_response_time = Column(Float)
    fire_response_time = Column(Float)
    
    # Analysis metadata
    analysis_radius_meters = Column(Integer)
    analysis_date = Column(DateTime(timezone=True), server_default=func.now())
    data_sources = Column(Text)  # JSON string with data sources
    
    def __repr__(self):
        return f"<SecurityInfrastructure(location_id={self.location_id})>"


class SecurityScore(Base):
    """
    Comprehensive security score for locations.
    """
    __tablename__ = "security_scores"

    id = Column(Integer, primary_key=True, index=True)
    
    # Location reference
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    location = relationship("Location")
    
    # Component scores (0-10 scale)
    crime_rate_score = Column(Float)  # lower crime = higher score
    police_presence_score = Column(Float)
    infrastructure_score = Column(Float)
    lighting_score = Column(Float)
    response_time_score = Column(Float)
    
    # Time-based scores
    daytime_score = Column(Float)
    nighttime_score = Column(Float)
    weekend_score = Column(Float)
    
    # Overall security score
    overall_score = Column(Float)
    security_category = Column(String(20))  # very_safe, safe, moderate, unsafe, dangerous
    
    # Crime statistics (last 12 months)
    total_crimes = Column(Integer)
    violent_crimes = Column(Integer)
    property_crimes = Column(Integer)
    crime_trend = Column(String(20))  # increasing, stable, decreasing
    
    # Risk factors
    high_risk_hours = Column(String(100))  # JSON array of risky hours
    high_risk_areas = Column(Text)  # JSON array of specific risk areas
    
    # Score calculation metadata
    calculation_date = Column(DateTime(timezone=True), server_default=func.now())
    model_version = Column(String(50))
    confidence_level = Column(Float)
    analysis_period_months = Column(Integer, default=12)
    
    def __repr__(self):
        return f"<SecurityScore(location_id={self.location_id}, score={self.overall_score})>"


class PoliceStation(Base):
    """
    Police station locations and information.
    """
    __tablename__ = "police_stations"

    id = Column(Integer, primary_key=True, index=True)
    
    # Location reference
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    location = relationship("Location")
    
    # Station details
    station_name = Column(String(200), nullable=False)
    station_type = Column(String(50))  # civil, military, federal
    phone_number = Column(String(20))
    operating_hours = Column(String(100))
    
    # Services offered
    emergency_service = Column(Boolean, default=True)
    report_service = Column(Boolean, default=True)
    patrol_service = Column(Boolean, default=True)
    investigation_service = Column(Boolean, default=False)
    
    # Coverage area
    coverage_radius_km = Column(Float)
    coverage_neighborhoods = Column(Text)  # JSON array
    
    # Performance metrics
    response_time_avg = Column(Float)  # average response time in minutes
    satisfaction_rating = Column(Float)  # 0-5 scale
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<PoliceStation(name='{self.station_name}', type='{self.station_type}')>"
