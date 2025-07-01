"""
Location Model

This module contains the Location model for storing location data.
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean
from sqlalchemy.sql import func
from app.core.database import Base


class Location(Base):
    """
    Location model for storing location information.
    
    This model stores basic location data including coordinates,
    address information, and metadata.
    """
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    
    # Address information
    address = Column(String(500), nullable=False)
    formatted_address = Column(String(500))
    
    # Coordinates
    latitude = Column(Float, nullable=False, index=True)
    longitude = Column(Float, nullable=False, index=True)
    
    # Location details
    city = Column(String(100))
    state = Column(String(100))
    country = Column(String(100))
    postal_code = Column(String(20))
    
    # External IDs
    place_id = Column(String(200), unique=True, index=True)
    google_place_id = Column(String(200))
    
    # Metadata
    location_type = Column(String(50))  # residential, commercial, mixed
    is_verified = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<Location(id={self.id}, address='{self.address}')>"
