"""
OpenWeather API Integration

This module handles integration with OpenWeather API for weather data,
air quality information, and environmental analysis.
"""

import logging
import aiohttp
from typing import Dict, Optional, List
from fastapi import HTTPException
from datetime import datetime, timedelta

from app.core.config import settings
from app.services.api_config import get_api_service


class OpenWeatherService:
    """Service for OpenWeather API integration"""
    
    def __init__(self):
        self.api_service = get_api_service()
        self.api_key = settings.OPENWEATHER_API_KEY
        self.base_url = "https://api.openweathermap.org/data/2.5"
        self.onecall_url = "https://api.openweathermap.org/data/3.0"
        self.air_pollution_url = "http://api.openweathermap.org/data/2.5"
        self.logger = logging.getLogger(__name__)
        
        # Check API availability
        if not self.api_service.is_api_available("openweather"):
            self.logger.warning("⚠️  OpenWeather API not configured. Using mock data.")
            self.logger.warning("   Get your API key at: https://openweathermap.org/api")
    
    async def _make_request(self, url: str, params: Dict) -> Dict:
        """Make async request to OpenWeather API"""
        if not self.api_key:
            self.logger.warning("OpenWeather API key not configured, returning mock data")
            return {"status": "REQUEST_DENIED", "error_message": "No API key configured"}
        
        params["appid"] = self.api_key
        
        async with aiohttp.ClientSession() as session:
            try:
                async with session.get(url, params=params) as response:
                    result = await response.json()
                    
                    if response.status != 200:
                        raise HTTPException(
                            status_code=response.status,
                            detail=f"OpenWeather API error: {result.get('message', 'Unknown error')}"
                        )
                    
                    return result
                    
            except aiohttp.ClientError as e:
                raise HTTPException(
                    status_code=500,
                    detail=f"Network error accessing OpenWeather API: {str(e)}"
                )
    
    async def get_current_weather(self, latitude: float, longitude: float) -> Dict:
        """
        Get current weather data for a location
        
        Args:
            latitude: Latitude coordinate
            longitude: Longitude coordinate
            
        Returns:
            Current weather data
        """
        if not self.api_key:
            # Return mock data when API key is not available
            return {
                "coord": {"lat": latitude, "lon": longitude},
                "weather": [
                    {
                        "id": 800,
                        "main": "Clear",
                        "description": "clear sky",
                        "icon": "01d"
                    }
                ],
                "main": {
                    "temp": 25.0,
                    "feels_like": 27.0,
                    "temp_min": 22.0,
                    "temp_max": 28.0,
                    "pressure": 1013,
                    "humidity": 65,
                    "sea_level": 1013,
                    "grnd_level": 1013
                },
                "visibility": 10000,
                "wind": {
                    "speed": 3.5,
                    "deg": 180,
                    "gust": 5.2
                },
                "clouds": {
                    "all": 0
                },
                "dt": int(datetime.now().timestamp()),
                "sys": {
                    "country": "BR",
                    "sunrise": int((datetime.now().replace(hour=6, minute=30)).timestamp()),
                    "sunset": int((datetime.now().replace(hour=18, minute=30)).timestamp())
                },
                "timezone": -10800,
                "name": "Mock Location"
            }
        
        params = {
            "lat": latitude,
            "lon": longitude,
            "units": "metric",
            "lang": "pt"
        }
        
        try:
            return await self._make_request(f"{self.base_url}/weather", params)
        except HTTPException:
            # Return fallback mock data on error
            return await self.get_current_weather(latitude, longitude)
    
    async def get_air_quality(self, latitude: float, longitude: float) -> Dict:
        """
        Get air quality data for a location
        
        Args:
            latitude: Latitude coordinate
            longitude: Longitude coordinate
            
        Returns:
            Air quality data
        """
        if not self.api_key:
            # Return mock data when API key is not available
            return {
                "coord": {"lat": latitude, "lon": longitude},
                "list": [
                    {
                        "main": {
                            "aqi": 2  # Air Quality Index: 1=Good, 2=Fair, 3=Moderate, 4=Poor, 5=Very Poor
                        },
                        "components": {
                            "co": 233.5,      # Carbon monoxide (μg/m³)
                            "no": 0.12,       # Nitrogen monoxide (μg/m³)
                            "no2": 13.4,      # Nitrogen dioxide (μg/m³)
                            "o3": 85.2,       # Ozone (μg/m³)
                            "so2": 2.1,       # Sulphur dioxide (μg/m³)
                            "pm2_5": 15.3,    # Fine particles matter (μg/m³)
                            "pm10": 25.7,     # Coarse particulate matter (μg/m³)
                            "nh3": 1.2        # Ammonia (μg/m³)
                        },
                        "dt": int(datetime.now().timestamp())
                    }
                ]
            }
        
        params = {
            "lat": latitude,
            "lon": longitude
        }
        
        try:
            return await self._make_request(f"{self.air_pollution_url}/air_pollution", params)
        except HTTPException:
            # Return fallback mock data on error
            return await self.get_air_quality(latitude, longitude)
    
    async def get_weather_forecast(self, latitude: float, longitude: float, days: int = 5) -> Dict:
        """
        Get weather forecast for a location
        
        Args:
            latitude: Latitude coordinate
            longitude: Longitude coordinate
            days: Number of days to forecast (max 5 for free tier)
            
        Returns:
            Weather forecast data
        """
        if not self.api_key:
            # Return mock data when API key is not available
            mock_forecast = {
                "cod": "200",
                "message": 0,
                "cnt": days * 8,  # 8 forecasts per day (every 3 hours)
                "list": [],
                "city": {
                    "id": 3448439,
                    "name": "Mock City",
                    "coord": {"lat": latitude, "lon": longitude},
                    "country": "BR",
                    "timezone": -10800
                }
            }
            
            # Generate mock forecast data
            base_date = datetime.now()
            for day in range(days):
                for hour in range(0, 24, 3):  # Every 3 hours
                    forecast_time = base_date + timedelta(days=day, hours=hour)
                    temp = 20 + (day * 2) + (hour % 10)  # Varying temperature
                    
                    forecast_item = {
                        "dt": int(forecast_time.timestamp()),
                        "main": {
                            "temp": temp,
                            "feels_like": temp + 2,
                            "temp_min": temp - 2,
                            "temp_max": temp + 3,
                            "pressure": 1010 + (day % 10),
                            "humidity": 60 + (hour % 20)
                        },
                        "weather": [
                            {
                                "id": 800,
                                "main": "Clear" if hour < 18 else "Clouds",
                                "description": "clear sky" if hour < 18 else "few clouds",
                                "icon": "01d" if hour < 18 else "02n"
                            }
                        ],
                        "clouds": {"all": 0 if hour < 18 else 20},
                        "wind": {
                            "speed": 2.5 + (hour % 5),
                            "deg": 180 + (day * 10)
                        },
                        "visibility": 10000,
                        "dt_txt": forecast_time.strftime("%Y-%m-%d %H:%M:%S")
                    }
                    mock_forecast["list"].append(forecast_item)
            
            return mock_forecast
        
        params = {
            "lat": latitude,
            "lon": longitude,
            "cnt": days * 8,  # OpenWeather returns data every 3 hours
            "units": "metric",
            "lang": "pt"
        }
        
        try:
            return await self._make_request(f"{self.base_url}/forecast", params)
        except HTTPException:
            # Return fallback mock data on error
            return await self.get_weather_forecast(latitude, longitude, days)
    
    def calculate_environmental_score(self, weather_data: Dict, air_quality_data: Dict) -> Dict:
        """
        Calculate environmental score based on weather and air quality data
        
        Args:
            weather_data: Current weather data
            air_quality_data: Air quality data
            
        Returns:
            Environmental analysis with scores
        """
        scores = {
            "air_quality_score": 0.0,
            "weather_comfort_score": 0.0,
            "overall_environmental_score": 0.0,
            "analysis": {}
        }
        
        # Air Quality Score (based on AQI)
        if air_quality_data.get("list"):
            aqi = air_quality_data["list"][0]["main"]["aqi"]
            # Convert AQI (1-5) to score (10-0)
            scores["air_quality_score"] = max(0, 10 - (aqi - 1) * 2.5)
            
            # Detailed air quality analysis
            components = air_quality_data["list"][0]["components"]
            scores["analysis"]["air_quality"] = {
                "aqi": aqi,
                "aqi_description": ["Excelente", "Bom", "Moderado", "Ruim", "Muito Ruim"][aqi-1],
                "pm2_5": components.get("pm2_5", 0),
                "pm10": components.get("pm10", 0),
                "o3": components.get("o3", 0),
                "no2": components.get("no2", 0)
            }
        
        # Weather Comfort Score
        if weather_data.get("main"):
            temp = weather_data["main"]["temp"]
            humidity = weather_data["main"]["humidity"]
            wind_speed = weather_data.get("wind", {}).get("speed", 0)
            
            # Temperature comfort (ideal range: 20-26°C)
            temp_score = max(0, 10 - abs(temp - 23) * 0.5)
            
            # Humidity comfort (ideal range: 40-60%)
            humidity_score = max(0, 10 - abs(humidity - 50) * 0.2)
            
            # Wind comfort (ideal: 2-10 km/h)
            wind_score = max(0, 10 - abs(wind_speed * 3.6 - 6) * 0.3)
            
            scores["weather_comfort_score"] = (temp_score + humidity_score + wind_score) / 3
            
            scores["analysis"]["weather"] = {
                "temperature": temp,
                "humidity": humidity,
                "wind_speed": wind_speed,
                "comfort_level": "Excelente" if scores["weather_comfort_score"] > 8 else
                               "Bom" if scores["weather_comfort_score"] > 6 else
                               "Moderado" if scores["weather_comfort_score"] > 4 else "Desconfortável"
            }
        
        # Overall Environmental Score
        scores["overall_environmental_score"] = (
            scores["air_quality_score"] * 0.6 +  # Air quality is more important
            scores["weather_comfort_score"] * 0.4
        )
        
        return scores


# Global instance
openweather_service = OpenWeatherService()
