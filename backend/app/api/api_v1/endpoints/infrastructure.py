"""
Infrastructure Analysis API Endpoints

This module handles infrastructure-related analysis operations.
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Dict, List, Optional
from pydantic import BaseModel

from app.services.infrastructure_analyzer import InfrastructureAnalyzer

router = APIRouter()

# Initialize infrastructure analyzer
infrastructure_analyzer = InfrastructureAnalyzer()


class InfrastructureScore(BaseModel):
    """Infrastructure score breakdown"""
    overall_score: float
    category_scores: Dict[str, float]
    nearby_facilities: Dict[str, List[Dict]]


class InfrastructureDetails(BaseModel):
    """Detailed infrastructure analysis"""
    score: float
    category: str
    facilities: List[Dict]
    coverage_score: float
    accessibility_score: float
    convenience_score: float


@router.get("/score", response_model=InfrastructureScore)
async def get_infrastructure_score(
    latitude: float = Query(..., description="Location latitude"),
    longitude: float = Query(..., description="Location longitude"),
    radius: float = Query(1000, ge=100, le=5000, description="Analysis radius in meters")
):
    """
    Get comprehensive infrastructure score for a location.
    
    This endpoint calculates infrastructure scores based on proximity
    to essential services and amenities.
    """
    try:
        # Calculate overall infrastructure score
        overall_score = await infrastructure_analyzer.calculate_infrastructure_score(
            latitude, longitude, int(radius)
        )
        
        # Get detailed breakdown by category
        category_scores = await infrastructure_analyzer.get_category_scores(
            latitude, longitude, int(radius)
        )
        
        # Get nearby facilities for each category
        nearby_facilities = await infrastructure_analyzer.get_nearby_facilities_by_category(
            latitude, longitude, int(radius)
        )
        
        return InfrastructureScore(
            overall_score=overall_score,
            category_scores=category_scores,
            nearby_facilities=nearby_facilities
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error calculating infrastructure score: {str(e)}"
        )


@router.get("/details/{category}", response_model=InfrastructureDetails)
async def get_infrastructure_details(
    category: str,
    latitude: float = Query(..., description="Location latitude"),
    longitude: float = Query(..., description="Location longitude"),
    radius: float = Query(1000, ge=100, le=5000, description="Analysis radius in meters")
):
    """
    Get detailed infrastructure analysis for a specific category.
    
    Available categories: healthcare, education, transportation, 
    shopping, services, recreation, dining
    """
    try:
        # Validate category
        if category not in infrastructure_analyzer.infrastructure_weights:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid category. Available: {list(infrastructure_analyzer.infrastructure_weights.keys())}"
            )
        
        # Calculate category-specific scores
        category_score = await infrastructure_analyzer.calculate_category_score(
            latitude, longitude, category, int(radius)
        )
        
        # Get facilities for this category
        facilities = await infrastructure_analyzer.get_facilities_for_category(
            latitude, longitude, category, int(radius)
        )
        
        # Calculate detailed metrics
        coverage_score = min(len(facilities) / 5.0, 1.0) * 10  # Max 10 for 5+ facilities
        accessibility_score = infrastructure_analyzer.calculate_accessibility_score(
            facilities, latitude, longitude
        )
        convenience_score = (coverage_score + accessibility_score) / 2
        
        return InfrastructureDetails(
            score=category_score,
            category=category,
            facilities=facilities,
            coverage_score=coverage_score,
            accessibility_score=accessibility_score,
            convenience_score=convenience_score
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting infrastructure details: {str(e)}"
        )


@router.get("/recommendations")
async def get_infrastructure_recommendations(
    latitude: float = Query(..., description="Location latitude"),
    longitude: float = Query(..., description="Location longitude"),
    radius: float = Query(1000, ge=100, le=5000, description="Analysis radius in meters")
):
    """
    Get infrastructure improvement recommendations for a location.
    
    This endpoint analyzes infrastructure gaps and provides suggestions
    for what types of facilities are missing or underrepresented.
    """
    try:
        # Get category scores
        category_scores = await infrastructure_analyzer.get_category_scores(
            latitude, longitude, int(radius)
        )
        
        # Identify areas for improvement
        recommendations = []
        
        for category, score in category_scores.items():
            if score < 7.0:  # Threshold for improvement
                severity = "high" if score < 5.0 else "medium" if score < 7.0 else "low"
                
                recommendation = {
                    "category": category,
                    "current_score": score,
                    "severity": severity,
                    "suggestion": infrastructure_analyzer.get_improvement_suggestion(category, score),
                    "priority": infrastructure_analyzer.infrastructure_weights[category]
                }
                recommendations.append(recommendation)
        
        # Sort by priority (weight) and severity
        recommendations.sort(key=lambda x: (x["priority"], -x["current_score"]), reverse=True)
        
        return {
            "overall_score": sum(category_scores.values()) / len(category_scores),
            "recommendations": recommendations,
            "strong_points": [
                {"category": cat, "score": score} 
                for cat, score in category_scores.items() 
                if score >= 8.0
            ]
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating recommendations: {str(e)}"
        )


@router.get("/comparison")
async def compare_infrastructure(
    locations: str = Query(..., description="Comma-separated lat,lng pairs (e.g., '-23.5505,-46.6333;-22.9068,-43.1729')"),
    radius: float = Query(1000, ge=100, le=5000, description="Analysis radius in meters")
):
    """
    Compare infrastructure scores between multiple locations.
    
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
        
        # Calculate scores for each location
        comparison_results = []
        
        for i, (lat, lng) in enumerate(location_pairs):
            overall_score = await infrastructure_analyzer.calculate_infrastructure_score(
                lat, lng, int(radius)
            )
            category_scores = await infrastructure_analyzer.get_category_scores(
                lat, lng, int(radius)
            )
            
            location_result = {
                "location_id": i + 1,
                "latitude": lat,
                "longitude": lng,
                "overall_score": overall_score,
                "category_scores": category_scores,
                "rank": 0  # Will be calculated after all scores
            }
            comparison_results.append(location_result)
        
        # Rank locations by overall score
        comparison_results.sort(key=lambda x: x["overall_score"], reverse=True)
        for i, result in enumerate(comparison_results):
            result["rank"] = i + 1
        
        # Generate insights
        best_location = comparison_results[0]
        worst_location = comparison_results[-1]
        
        insights = {
            "best_location": {
                "location_id": best_location["location_id"],
                "score": best_location["overall_score"],
                "strengths": [
                    cat for cat, score in best_location["category_scores"].items() 
                    if score >= 8.0
                ]
            },
            "areas_for_improvement": {
                "location_id": worst_location["location_id"],
                "score": worst_location["overall_score"],
                "weaknesses": [
                    cat for cat, score in worst_location["category_scores"].items() 
                    if score < 6.0
                ]
            }
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
            detail=f"Error comparing infrastructure: {str(e)}"
        )
