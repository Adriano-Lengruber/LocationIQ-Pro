"""
Real Estate Models

This module contains models for real estate data and analysis.
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Property(Base):
    """
    Property model for storing real estate property information.
    """
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    
    # Location reference
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    location = relationship("Location", back_populates="properties")
    
    # Property details
    property_type = Column(String(50), nullable=False)  # apartment, house, commercial
    title = Column(String(200))
    description = Column(Text)
    
    # Physical characteristics
    bedrooms = Column(Integer)
    bathrooms = Column(Integer)
    area_sqm = Column(Float)
    built_area_sqm = Column(Float)
    land_area_sqm = Column(Float)
    age_years = Column(Integer)
    parking_spaces = Column(Integer)
    floors = Column(Integer)
    
    # Features
    furnished = Column(Boolean, default=False)
    has_elevator = Column(Boolean, default=False)
    has_pool = Column(Boolean, default=False)
    has_gym = Column(Boolean, default=False)
    has_security = Column(Boolean, default=False)
    
    # Financial information
    price = Column(Float)
    price_per_sqm = Column(Float)
    condominium_fee = Column(Float)
    iptu_tax = Column(Float)  # Property tax in Brazil
    
    # Listing information
    listing_type = Column(String(20))  # sale, rent
    listing_url = Column(String(500))
    listing_source = Column(String(50))  # zap, vivareal, olx
    listing_id = Column(String(100))
    
    # Status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<Property(id={self.id}, type='{self.property_type}', price={self.price})>"


class PropertyPrice(Base):
    """
    Property price history and predictions.
    """
    __tablename__ = "property_prices"

    id = Column(Integer, primary_key=True, index=True)
    
    # Property reference
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False)
    property = relationship("Property", back_populates="price_history")
    
    # Price information
    price = Column(Float, nullable=False)
    price_per_sqm = Column(Float)
    price_type = Column(String(20))  # current, predicted, historical
    
    # Prediction metadata
    confidence_score = Column(Float)
    model_version = Column(String(50))
    prediction_date = Column(DateTime(timezone=True))
    
    # Market data
    market_trend = Column(String(20))  # rising, stable, declining
    comparable_count = Column(Integer)
    
    # Timestamps
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<PropertyPrice(property_id={self.property_id}, price={self.price})>"


class MarketAnalysis(Base):
    """
    Market analysis data for different areas.
    """
    __tablename__ = "market_analysis"

    id = Column(Integer, primary_key=True, index=True)
    
    # Location reference
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    location = relationship("Location")
    
    # Market metrics
    average_price = Column(Float)
    median_price = Column(Float)
    price_trend_6m = Column(Float)  # percentage change in 6 months
    price_trend_12m = Column(Float)  # percentage change in 12 months
    market_velocity = Column(Integer)  # average days on market
    supply_demand_ratio = Column(Float)
    
    # Property counts
    total_properties = Column(Integer)
    active_listings = Column(Integer)
    sold_last_30d = Column(Integer)
    
    # Analysis metadata
    analysis_date = Column(DateTime(timezone=True), server_default=func.now())
    radius_meters = Column(Integer)  # analysis radius
    property_type = Column(String(50))  # apartment, house, all
    
    def __repr__(self):
        return f"<MarketAnalysis(location_id={self.location_id}, avg_price={self.average_price})>"
