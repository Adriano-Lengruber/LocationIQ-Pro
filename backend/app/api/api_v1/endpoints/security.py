"""
Security Analysis API Endpoints

This module handles security analysis including crime data, safety scores,
and risk assessment for locations.
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Dict, List, Optional
from pydantic import BaseModel

from app.services.security_analyzer import security_analyzer

router = APIRouter()


class SecurityScore(BaseModel):
    """Security score model"""
    overall_score: float
    crime_analysis: Dict
    infrastructure_analysis: Dict
    time_analysis: Dict
    risk_assessment: str
    area_type: str


class CrimeAnalysis(BaseModel):
    """Crime analysis model"""
    safety_score: float
    crime_rates: Dict[str, float]
    weighted_crime_rate: float
    risk_level: str


class TimeBasedSafety(BaseModel):
    """Time-based safety analysis model"""
    weekday_scores: Dict[str, float]
    weekend_scores: Dict[str, float]
    safest_time: str
    riskiest_time: str
    recommendations: List[str]


@router.get("/score", response_model=SecurityScore)
async def get_security_score(
    latitude: float = Query(..., description="Location latitude"),
    longitude: float = Query(..., description="Location longitude"),
    radius: float = Query(1000, ge=100, le=5000, description="Analysis radius in meters")
):
    """
    Get comprehensive security score for a location.
    
    This endpoint provides a complete security analysis including crime data,
    safety infrastructure, and time-based risk assessments.
    """
    try:
        # Get comprehensive security analysis
        security_analysis = security_analyzer.calculate_overall_security_score(
            latitude, longitude, int(radius)
        )
        
        return SecurityScore(
            overall_score=security_analysis['overall_security_score'],
            crime_analysis=security_analysis['analysis_components']['crime_analysis'],
            infrastructure_analysis=security_analysis['analysis_components']['infrastructure_analysis'],
            time_analysis=security_analysis['analysis_components']['time_analysis'],
            risk_assessment=security_analysis['risk_assessment'],
            area_type=security_analysis['area_type']
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error calculating security score: {str(e)}"
        )


@router.get("/crime-analysis", response_model=CrimeAnalysis)
async def get_crime_analysis(
    latitude: float = Query(..., description="Location latitude"),
    longitude: float = Query(..., description="Location longitude"),
    radius: float = Query(1000, ge=100, le=5000, description="Analysis radius in meters")
):
    """
    Get detailed crime analysis for a location.
    
    This endpoint provides crime statistics and safety scoring
    based on historical crime data.
    """
    try:
        crime_data = security_analyzer.calculate_crime_score(
            latitude, longitude, int(radius)
        )
        
        return CrimeAnalysis(
            safety_score=crime_data['safety_score'],
            crime_rates=crime_data['crime_rates'],
            weighted_crime_rate=crime_data['weighted_crime_rate'],
            risk_level=crime_data['risk_level']
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing crime data: {str(e)}"
        )


@router.get("/time-based-safety", response_model=TimeBasedSafety)
async def get_time_based_safety(
    latitude: float = Query(..., description="Location latitude"),
    longitude: float = Query(..., description="Location longitude")
):
    """
    Get time-based safety analysis for a location.
    
    This endpoint provides safety scores for different times of day
    and days of the week, helping users plan safer activities.
    """
    try:
        time_analysis = security_analyzer.analyze_time_based_safety(
            latitude, longitude
        )
        
        return TimeBasedSafety(
            weekday_scores=time_analysis['weekday_scores'],
            weekend_scores=time_analysis['weekend_scores'],
            safest_time=time_analysis['safest_time'],
            riskiest_time=time_analysis['riskiest_time'],
            recommendations=time_analysis['recommendations']
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing time-based safety: {str(e)}"
        )


@router.get("/infrastructure")
async def get_safety_infrastructure(
    latitude: float = Query(..., description="Location latitude"),
    longitude: float = Query(..., description="Location longitude"),
    radius: float = Query(1000, ge=100, le=5000, description="Analysis radius in meters")
):
    """
    Get safety infrastructure assessment for a location.
    
    This endpoint evaluates the presence and quality of safety infrastructure
    such as police stations, lighting, security cameras, etc.
    """
    try:
        infrastructure_data = security_analyzer.assess_safety_infrastructure(
            latitude, longitude, int(radius)
        )
        
        return infrastructure_data
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error assessing safety infrastructure: {str(e)}"
        )


@router.get("/recommendations")
async def get_security_recommendations(
    latitude: float = Query(..., description="Location latitude"),
    longitude: float = Query(..., description="Location longitude"),
    radius: float = Query(1000, ge=100, le=5000, description="Analysis radius in meters")
):
    """
    Get security recommendations for a location.
    
    This endpoint provides personalized security recommendations
    based on the location's safety profile and risk factors.
    """
    try:
        security_analysis = security_analyzer.calculate_overall_security_score(
            latitude, longitude, int(radius)
        )
        
        return {
            'overall_score': security_analysis['overall_security_score'],
            'risk_level': security_analysis['risk_assessment'],
            'insights': security_analysis['insights'],
            'recommendations': security_analysis['recommendations'],
            'area_type': security_analysis['area_type']
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating security recommendations: {str(e)}"
        )


@router.get("/comparison")
async def compare_security(
    locations: str = Query(..., description="Comma-separated lat,lng pairs (e.g., '-23.5505,-46.6333;-22.9068,-43.1729')"),
    radius: float = Query(1000, ge=100, le=5000, description="Analysis radius in meters")
):
    """
    Compare security scores between multiple locations.
    
    Format: lat1,lng1;lat2,lng2;lat3,lng3
    """
    try:
        # Parse location coordinates
        location_pairs = []
        for location_str in locations.split(';'):
            try:
                lat, lng = map(float, location_str.strip().split(','))
                location_pairs.append((lat, lng))
            except ValueError:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid location format: {location_str}. Use 'lat,lng' format."
                )
        
        if len(location_pairs) < 2:
            raise HTTPException(
                status_code=400,
                detail="At least 2 locations required for comparison"
            )
        
        # Calculate security scores for each location
        comparison_results = []
        
        for i, (lat, lng) in enumerate(location_pairs):
            security_analysis = security_analyzer.calculate_overall_security_score(
                lat, lng, int(radius)
            )
            
            location_result = {
                "location_id": i + 1,
                "latitude": lat,
                "longitude": lng,
                "overall_score": security_analysis['overall_security_score'],
                "risk_level": security_analysis['risk_assessment'],
                "area_type": security_analysis['area_type'],
                "rank": 0  # Will be calculated after all scores
            }
            comparison_results.append(location_result)
        
        # Rank locations by security score
        comparison_results.sort(key=lambda x: x["overall_score"], reverse=True)
        for i, result in enumerate(comparison_results):
            result["rank"] = i + 1
        
        # Generate insights
        safest_location = comparison_results[0]
        least_safe_location = comparison_results[-1]
        
        insights = {
            "safest_location": {
                "location_id": safest_location["location_id"],
                "score": safest_location["overall_score"],
                "risk_level": safest_location["risk_level"]
            },
            "least_safe_location": {
                "location_id": least_safe_location["location_id"],
                "score": least_safe_location["overall_score"],
                "risk_level": least_safe_location["risk_level"]
            },
            "score_variance": round(
                safest_location["overall_score"] - least_safe_location["overall_score"], 2
            )
        }
        
        return {
            "comparison": comparison_results,
            "insights": insights,
            "analysis_radius": radius
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error comparing security: {str(e)}"
        )
