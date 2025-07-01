"""
Database Service

This module contains database operations and CRUD functions.
"""

from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.location import Location
from app.models.real_estate import Property


def create_location(db: Session, address: str, latitude: float, longitude: float) -> Location:
    """Create a new location in the database."""
    db_location = Location(
        address=address,
        latitude=latitude,
        longitude=longitude,
        formatted_address=address
    )
    db.add(db_location)
    db.commit()
    db.refresh(db_location)
    return db_location


def get_location(db: Session, location_id: int) -> Optional[Location]:
    """Get a location by ID."""
    return db.query(Location).filter(Location.id == location_id).first()


def get_locations(db: Session, skip: int = 0, limit: int = 100) -> List[Location]:
    """Get a list of locations."""
    return db.query(Location).offset(skip).limit(limit).all()


def search_locations_by_address(db: Session, address: str) -> List[Location]:
    """Search locations by address."""
    return db.query(Location).filter(
        Location.address.contains(address)
    ).all()


def create_property(db: Session, location_id: int, property_type: str, 
                   bedrooms: int, area_sqm: float, price: float) -> Property:
    """Create a new property in the database."""
    db_property = Property(
        location_id=location_id,
        property_type=property_type,
        bedrooms=bedrooms,
        area_sqm=area_sqm,
        price=price
    )
    db.add(db_property)
    db.commit()
    db.refresh(db_property)
    return db_property


def get_properties_by_location(db: Session, location_id: int) -> List[Property]:
    """Get all properties for a specific location."""
    return db.query(Property).filter(Property.location_id == location_id).all()


def get_properties(db: Session, skip: int = 0, limit: int = 100) -> List[Property]:
    """Get a list of properties."""
    return db.query(Property).offset(skip).limit(limit).all()
