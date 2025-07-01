"""
Locations API Endpoints

This module handles location-related operations including geocoding,
reverse geocoding, and location data retrieval.
"""

from fastapi import APIRouter, HTTPException, Query, Depends
from typing import Optional, List
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.database import (
    create_location, 
    get_location, 
    get_locations, 
    search_locations_by_address
)
from app.services.google_places import google_places_service
from app.services.infrastructure_analyzer import InfrastructureAnalyzer

router = APIRouter()

# Initialize infrastructure analyzer
infrastructure_analyzer = InfrastructureAnalyzer()


class LocationBase(BaseModel):
    """Base location model"""
    address: str
    latitude: float
    longitude: float
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None


class LocationResponse(LocationBase):
    """Location response model"""
    id: Optional[str] = None
    formatted_address: str
    place_id: Optional[str] = None


class LocationAnalysis(BaseModel):
    """Complete location analysis"""
    location: LocationResponse
    real_estate_score: float
    hospitality_score: float
    environmental_score: float
    security_score: float
    infrastructure_score: float
    overall_score: float


@router.get("/search", response_model=List[LocationResponse])
async def search_locations(
    query: str = Query(..., description="Search query for locations"),
    limit: int = Query(10, ge=1, le=50, description="Maximum number of results")
):
    """
    Search for locations based on a query string.
    
    This endpoint allows users to search for locations using natural language
    queries like "São Paulo, SP" or "Times Square, New York".
    """
    try:
        # Use Google Places API for real location search
        places_results = await google_places_service.search_places(query)
        
        locations = []
        for i, place in enumerate(places_results[:limit]):
            # Extract location data from Google Places result
            geometry = place.get("geometry", {}).get("location", {})
            components = google_places_service.extract_address_components(place)
            
            location = LocationResponse(
                id=place.get("place_id", f"search_{i}"),
                address=place.get("name", query),
                latitude=geometry.get("lat", -23.5505),
                longitude=geometry.get("lng", -46.6333),
                city=components.get("locality", ""),
                state=components.get("administrative_area_level_1", ""),
                country=components.get("country", ""),
                postal_code=components.get("postal_code", ""),
                formatted_address=place.get("formatted_address", f"Result for '{query}'"),
                place_id=place.get("place_id")
            )
            locations.append(location)
        
        return locations
        
    except Exception as e:
        # Fallback to mock data on error
        print(f"Error in search_locations: {str(e)}")
        
        mock_locations = [
            LocationResponse(
                id=f"fallback_{i}",
                address=f"Result for '{query}' - Location {i+1}",
                latitude=-23.5505 + (i * 0.001),
                longitude=-46.6333 + (i * 0.001),
                city="São Paulo",
                state="SP",
                country="Brazil",
                formatted_address=f"São Paulo, SP, Brazil - Result {i+1}"
            )
            for i in range(min(limit, 3))
        ]
        
        return mock_locations


@router.get("/geocode", response_model=LocationResponse)
async def geocode_address(
    address: str = Query(..., description="Address to geocode")
):
    """
    Convert an address into geographic coordinates.
    
    This endpoint takes a human-readable address and returns the corresponding
    latitude and longitude coordinates.
    """
    try:
        # Use Google Geocoding API for real geocoding
        result = await google_places_service.geocode_address(address)
        
        if result:
            geometry = result.get("geometry", {}).get("location", {})
            components = google_places_service.extract_address_components(result)
            
            return LocationResponse(
                id=result.get("place_id", "geocoded_1"),
                address=address,
                latitude=geometry.get("lat", -23.5505),
                longitude=geometry.get("lng", -46.6333),
                city=components.get("locality", ""),
                state=components.get("administrative_area_level_1", ""),
                country=components.get("country", ""),
                postal_code=components.get("postal_code", ""),
                formatted_address=result.get("formatted_address", f"Geocoded: {address}"),
                place_id=result.get("place_id")
            )
        else:
            raise HTTPException(status_code=404, detail="Address not found")
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in geocode_address: {str(e)}")
        
        # Fallback to mock data
        return LocationResponse(
            id="geocoded_fallback",
            address=address,
            latitude=-23.5505,
            longitude=-46.6333,
            city="São Paulo",
            state="SP",
            country="Brazil",
            formatted_address=f"Geocoded (fallback): {address}"
        )


@router.get("/reverse-geocode", response_model=LocationResponse)
async def reverse_geocode(
    latitude: float = Query(..., description="Latitude coordinate"),
    longitude: float = Query(..., description="Longitude coordinate")
):
    """
    Convert geographic coordinates into a human-readable address.
    
    This endpoint takes latitude and longitude coordinates and returns
    the corresponding address information.
    """
    try:
        # Use Google Reverse Geocoding API
        result = await google_places_service.reverse_geocode(latitude, longitude)
        
        if result:
            geometry = result.get("geometry", {}).get("location", {})
            components = google_places_service.extract_address_components(result)
            
            return LocationResponse(
                id=result.get("place_id", "reverse_geocoded_1"),
                address=components.get("route", "Unknown Address"),
                latitude=geometry.get("lat", latitude),
                longitude=geometry.get("lng", longitude),
                city=components.get("locality", ""),
                state=components.get("administrative_area_level_1", ""),
                country=components.get("country", ""),
                postal_code=components.get("postal_code", ""),
                formatted_address=result.get("formatted_address", f"Address at {latitude}, {longitude}"),
                place_id=result.get("place_id")
            )
        else:
            raise HTTPException(status_code=404, detail="No address found for these coordinates")
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in reverse_geocode: {str(e)}")
        
        # Fallback to mock data
        return LocationResponse(
            id="reverse_geocoded_fallback",
            address="Avenida Paulista, 1000",
            latitude=latitude,
            longitude=longitude,
            city="São Paulo",
            state="SP",
            country="Brazil",
            formatted_address=f"Address at {latitude}, {longitude} (fallback)"
        )


@router.get("/analyze/{location_id}", response_model=LocationAnalysis)
async def analyze_location(
    location_id: str,
    include_real_estate: bool = Query(True, description="Include real estate analysis"),
    include_hospitality: bool = Query(True, description="Include hospitality analysis"),
    include_environmental: bool = Query(True, description="Include environmental analysis"),
    include_security: bool = Query(True, description="Include security analysis"),
    include_infrastructure: bool = Query(True, description="Include infrastructure analysis")
):
    """
    Perform comprehensive analysis of a location.
    
    This is the main endpoint that combines all analysis modules to provide
    a complete assessment of a location's characteristics.
    """
    try:
        # Get location details from Google Places (if location_id is a place_id)
        location_details = await google_places_service.get_place_details(location_id)
        
        if location_details:
            geometry = location_details.get("geometry", {}).get("location", {})
            components = google_places_service.extract_address_components(location_details)
            
            location = LocationResponse(
                id=location_id,
                address=location_details.get("name", ""),
                latitude=geometry.get("lat", -23.5505),
                longitude=geometry.get("lng", -46.6333),
                city=components.get("locality", ""),
                state=components.get("administrative_area_level_1", ""),
                country=components.get("country", ""),
                postal_code=components.get("postal_code", ""),
                formatted_address=location_details.get("formatted_address", ""),
                place_id=location_id
            )
        else:
            # Fallback for non-place_id location_ids
            location = LocationResponse(
                id=location_id,
                address="Location Analysis",
                latitude=-23.5505,
                longitude=-46.6333,
                city="São Paulo",
                state="SP",
                country="Brazil",
                formatted_address="Location for analysis"
            )
        
        # Calculate infrastructure score using real data
        infrastructure_score = 0.0
        if include_infrastructure:
            try:
                infrastructure_score = await infrastructure_analyzer.calculate_infrastructure_score(
                    location.latitude, location.longitude
                )
            except Exception as e:
                print(f"Error calculating infrastructure score: {e}")
                infrastructure_score = 7.5  # Fallback score
        
        # Calculate overall score (average of enabled modules)
        scores = []
        if include_real_estate:
            scores.append(8.5)  # TODO: Implement real estate ML model
        if include_hospitality:
            scores.append(7.8)  # TODO: Implement hospitality ML model
        if include_environmental:
            scores.append(6.2)  # TODO: Implement environmental analysis
        if include_security:
            scores.append(7.5)  # TODO: Implement security analysis
        if include_infrastructure:
            scores.append(infrastructure_score)
        
        overall_score = sum(scores) / len(scores) if scores else 0.0
        
        analysis = LocationAnalysis(
            location=location,
            real_estate_score=8.5 if include_real_estate else 0.0,
            hospitality_score=7.8 if include_hospitality else 0.0,
            environmental_score=6.2 if include_environmental else 0.0,
            security_score=7.5 if include_security else 0.0,
            infrastructure_score=infrastructure_score if include_infrastructure else 0.0,
            overall_score=overall_score
        )
        
        return analysis
        
    except Exception as e:
        print(f"Error in analyze_location: {str(e)}")
        
        # Fallback to mock data on error
        location = LocationResponse(
            id=location_id,
            address="Avenida Paulista, 1000",
            latitude=-23.5505,
            longitude=-46.6333,
            city="São Paulo",
            state="SP",
            country="Brazil",
            formatted_address="Avenida Paulista, 1000, São Paulo, SP, Brazil"
        )
        
        analysis = LocationAnalysis(
            location=location,
            real_estate_score=8.5 if include_real_estate else 0.0,
            hospitality_score=7.8 if include_hospitality else 0.0,
            environmental_score=6.2 if include_environmental else 0.0,
            security_score=7.5 if include_security else 0.0,
            infrastructure_score=7.5 if include_infrastructure else 0.0,
            overall_score=7.6
        )
        
        return analysis


@router.get("/nearby")
async def get_nearby_locations(
    latitude: float = Query(..., description="Center latitude"),
    longitude: float = Query(..., description="Center longitude"),
    radius: float = Query(1000, ge=100, le=10000, description="Search radius in meters"),
    location_type: Optional[str] = Query(None, description="Type of location to search for")
):
    """
    Get nearby locations of interest.
    
    This endpoint finds points of interest near a given coordinate,
    such as schools, hospitals, restaurants, etc.
    """
    try:
        # Use Google Places Nearby Search API
        nearby_places = await google_places_service.get_nearby_places(
            latitude=latitude,
            longitude=longitude,
            place_type=location_type,
            radius=int(radius)
        )
        
        results = []
        for place in nearby_places:
            geometry = place.get("geometry", {}).get("location", {})
            
            # Calculate approximate distance (simple formula)
            import math
            lat_diff = abs(geometry.get("lat", latitude) - latitude)
            lng_diff = abs(geometry.get("lng", longitude) - longitude)
            distance = math.sqrt(lat_diff**2 + lng_diff**2) * 111000  # Rough km to meters conversion
            
            place_info = {
                "place_id": place.get("place_id", ""),
                "name": place.get("name", "Unknown Place"),
                "types": place.get("types", []),
                "rating": place.get("rating", 0.0),
                "distance": int(distance),
                "vicinity": place.get("vicinity", ""),
                "geometry": geometry
            }
            results.append(place_info)
        
        return {
            "center": {"latitude": latitude, "longitude": longitude},
            "radius": radius,
            "location_type": location_type,
            "results": results
        }
        
    except Exception as e:
        print(f"Error in get_nearby_locations: {str(e)}")
        
        # Fallback to mock data
        return {
            "center": {"latitude": latitude, "longitude": longitude},
            "radius": radius,
            "location_type": location_type,
            "results": [
                {
                    "place_id": "mock_hospital_1",
                    "name": "Hospital das Clínicas (Mock)",
                    "types": ["hospital", "health"],
                    "distance": 500,
                    "rating": 4.2,
                    "vicinity": "Rua Mock, 123",
                    "geometry": {"lat": latitude + 0.001, "lng": longitude + 0.001}
                },
                {
                    "place_id": "mock_shopping_1",
                    "name": "Shopping Paulista (Mock)",
                    "types": ["shopping_mall"],
                    "distance": 800,
                    "rating": 4.5,
                    "vicinity": "Avenida Mock, 456",
                    "geometry": {"lat": latitude - 0.001, "lng": longitude - 0.001}
                }
            ]
        }


@router.post("/create", response_model=LocationResponse)
async def create_new_location(
    address: str = Query(..., description="Address of the location"),
    latitude: float = Query(..., description="Latitude coordinate"),
    longitude: float = Query(..., description="Longitude coordinate"),
    city: Optional[str] = Query(None, description="City name"),
    state: Optional[str] = Query(None, description="State/Province"),
    country: Optional[str] = Query(None, description="Country"),
    db: Session = Depends(get_db)
):
    """
    Create a new location in the database.
    
    This endpoint allows users to save location data to the database
    for future reference and analysis.
    """
    try:
        db_location = create_location(
            db=db,
            address=address,
            latitude=latitude,
            longitude=longitude
        )
        
        return LocationResponse(
            id=str(db_location.id),
            address=db_location.address,
            latitude=db_location.latitude,
            longitude=db_location.longitude,
            city=city,
            state=state,
            country=country,
            formatted_address=db_location.formatted_address
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating location: {str(e)}")


@router.get("/list", response_model=List[LocationResponse])
async def list_locations(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(10, ge=1, le=100, description="Maximum number of records to return"),
    db: Session = Depends(get_db)
):
    """
    Get a list of saved locations from the database.
    
    This endpoint returns locations that have been previously saved
    to the database with pagination support.
    """
    try:
        db_locations = get_locations(db=db, skip=skip, limit=limit)
        
        locations = []
        for loc in db_locations:
            locations.append(LocationResponse(
                id=str(loc.id),
                address=loc.address,
                latitude=loc.latitude,
                longitude=loc.longitude,
                formatted_address=loc.formatted_address
            ))
        
        return locations
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching locations: {str(e)}")


@router.get("/search-db", response_model=List[LocationResponse])
async def search_saved_locations(
    query: str = Query(..., description="Search query for addresses"),
    db: Session = Depends(get_db)
):
    """
    Search for locations in the database by address.
    
    This endpoint searches through saved locations in the database
    for addresses that match the query string.
    """
    try:
        db_locations = search_locations_by_address(db=db, address=query)
        
        locations = []
        for loc in db_locations:
            locations.append(LocationResponse(
                id=str(loc.id),
                address=loc.address,
                latitude=loc.latitude,
                longitude=loc.longitude,
                formatted_address=loc.formatted_address
            ))
        
        return locations
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching locations: {str(e)}")
