"""
Google Places API Integration

This module handles integration with Google Places API for real geocoding,
place search, and nearby places functionality.
"""

import logging
import aiohttp
import asyncio
from typing import List, Dict, Optional, Tuple
from fastapi import HTTPException

from app.core.config import settings
from app.services.api_config import get_api_service


class GooglePlacesService:
    """Service for Google Places API integration"""
    
    def __init__(self):
        self.api_service = get_api_service()
        self.api_key = settings.GOOGLE_PLACES_API_KEY
        self.base_url = "https://maps.googleapis.com/maps/api"
        self.logger = logging.getLogger(__name__)
        
        # Check API availability
        if not self.api_service.is_api_available("google_places"):
            self.logger.warning("⚠️  Google Places API not configured. Using mock data.")
            self.logger.warning("   Get your API key at: https://developers.google.com/maps/documentation/places")
    
    async def _make_request(self, endpoint: str, params: Dict) -> Dict:
        """Make async request to Google Places API"""
        if not self.api_key:
            self.logger.warning("Google Places API key not configured, returning mock data")
            return {"status": "REQUEST_DENIED", "error_message": "No API key configured"}
        
        params["key"] = self.api_key
        url = f"{self.base_url}/{endpoint}"
        
        async with aiohttp.ClientSession() as session:
            try:
                async with session.get(url, params=params) as response:
                    result = await response.json()
                    
                    if response.status != 200:
                        self.logger.error(f"Google Places API HTTP error {response.status}: {result}")
                        raise HTTPException(
                            status_code=response.status,
                            detail=f"Google Places API error: {result.get('error_message', 'Unknown error')}"
                        )
                    
                    return result
                    
            except aiohttp.ClientError as e:
                raise HTTPException(
                    status_code=500,
                    detail=f"Network error accessing Google Places API: {str(e)}"
                )
    
    async def geocode_address(self, address: str) -> Optional[Dict]:
        """
        Convert address to coordinates using Google Geocoding API
        
        Args:
            address: Human-readable address
            
        Returns:
            Dict with location data or None if not found
        """
        if not self.api_key:
            # Return mock data when API key is not available
            return {
                "place_id": "mock_place_id",
                "formatted_address": f"Mock result for: {address}",
                "geometry": {
                    "location": {"lat": -23.5505, "lng": -46.6333}
                },
                "address_components": [
                    {"long_name": "São Paulo", "types": ["locality"]},
                    {"long_name": "SP", "types": ["administrative_area_level_1"]},
                    {"long_name": "Brazil", "types": ["country"]}
                ]
            }
        
        params = {
            "address": address,
            "language": "pt-BR",
            "region": "br"
        }
        
        try:
            result = await self._make_request("geocode/json", params)
            
            if result.get("status") == "OK" and result.get("results"):
                return result["results"][0]
            else:
                return None
                
        except HTTPException:
            return None
    
    async def reverse_geocode(self, latitude: float, longitude: float) -> Optional[Dict]:
        """
        Convert coordinates to address using Google Reverse Geocoding API
        
        Args:
            latitude: Latitude coordinate
            longitude: Longitude coordinate
            
        Returns:
            Dict with address data or None if not found
        """
        if not self.api_key:
            # Return mock data when API key is not available
            return {
                "place_id": "mock_reverse_place_id",
                "formatted_address": f"Mock address for {latitude}, {longitude}",
                "geometry": {
                    "location": {"lat": latitude, "lng": longitude}
                },
                "address_components": [
                    {"long_name": "São Paulo", "types": ["locality"]},
                    {"long_name": "SP", "types": ["administrative_area_level_1"]},
                    {"long_name": "Brazil", "types": ["country"]}
                ]
            }
        
        params = {
            "latlng": f"{latitude},{longitude}",
            "language": "pt-BR"
        }
        
        try:
            result = await self._make_request("geocode/json", params)
            
            if result.get("status") == "OK" and result.get("results"):
                return result["results"][0]
            else:
                return None
                
        except HTTPException:
            return None
    
    async def search_places(self, query: str, location: Optional[Tuple[float, float]] = None, radius: int = 50000) -> List[Dict]:
        """
        Search for places using Google Places Text Search API
        
        Args:
            query: Search query
            location: Optional (lat, lng) tuple to bias results
            radius: Search radius in meters
            
        Returns:
            List of place dictionaries
        """
        if not self.api_key:
            # Return mock data when API key is not available
            return [
                {
                    "place_id": f"mock_place_{i}",
                    "name": f"Mock result {i+1} for '{query}'",
                    "formatted_address": f"Mock address {i+1}, São Paulo, SP, Brazil",
                    "geometry": {
                        "location": {
                            "lat": -23.5505 + (i * 0.001),
                            "lng": -46.6333 + (i * 0.001)
                        }
                    },
                    "rating": 4.0 + (i * 0.1),
                    "types": ["establishment"]
                }
                for i in range(min(5, 3))  # Return max 3 mock results
            ]
        
        params = {
            "query": query,
            "language": "pt-BR",
            "region": "br"
        }
        
        if location:
            params["location"] = f"{location[0]},{location[1]}"
            params["radius"] = radius
        
        try:
            result = await self._make_request("place/textsearch/json", params)
            
            if result.get("status") == "OK":
                return result.get("results", [])
            else:
                return []
                
        except HTTPException:
            return []
    
    async def get_nearby_places(
        self, 
        latitude: float, 
        longitude: float, 
        place_type: Optional[str] = None, 
        radius: int = 1000,
        keyword: Optional[str] = None
    ) -> List[Dict]:
        """
        Get nearby places using Google Places Nearby Search API
        
        Args:
            latitude: Center latitude
            longitude: Center longitude
            place_type: Type of place (e.g., 'restaurant', 'hospital', 'school')
            radius: Search radius in meters (max 50,000)
            keyword: Optional keyword to refine search
            
        Returns:
            List of nearby places
        """
        if not self.api_key:
            # Return mock data when API key is not available
            mock_places = [
                {
                    "place_id": "mock_hospital_1",
                    "name": "Hospital Mock",
                    "types": ["hospital", "health"],
                    "geometry": {
                        "location": {"lat": latitude + 0.001, "lng": longitude + 0.001}
                    },
                    "rating": 4.2,
                    "vicinity": "Rua Mock, 123"
                },
                {
                    "place_id": "mock_school_1",
                    "name": "Escola Mock",
                    "types": ["school", "education"],
                    "geometry": {
                        "location": {"lat": latitude - 0.001, "lng": longitude - 0.001}
                    },
                    "rating": 4.5,
                    "vicinity": "Avenida Mock, 456"
                }
            ]
            
            if place_type:
                return [p for p in mock_places if place_type in p["types"]]
            return mock_places
        
        params = {
            "location": f"{latitude},{longitude}",
            "radius": min(radius, 50000),  # Google API limit
            "language": "pt-BR"
        }
        
        if place_type:
            params["type"] = place_type
        if keyword:
            params["keyword"] = keyword
        
        try:
            result = await self._make_request("place/nearbysearch/json", params)
            
            if result.get("status") == "OK":
                return result.get("results", [])
            else:
                return []
                
        except HTTPException:
            return []
    
    def extract_address_components(self, place_data: Dict) -> Dict[str, str]:
        """
        Extract standardized address components from Google Places result
        
        Args:
            place_data: Place data from Google Places API
            
        Returns:
            Dictionary with extracted address components
        """
        components = {
            "street_number": "",
            "route": "",
            "sublocality": "",
            "locality": "",
            "administrative_area_level_1": "",
            "administrative_area_level_2": "",
            "country": "",
            "postal_code": ""
        }
        
        address_components = place_data.get("address_components", [])
        
        for component in address_components:
            types = component.get("types", [])
            long_name = component.get("long_name", "")
            
            for component_type in types:
                if component_type in components:
                    components[component_type] = long_name
                    break
        
        return components


# Global instance
google_places_service = GooglePlacesService()
