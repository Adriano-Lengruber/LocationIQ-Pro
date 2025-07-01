"""
Real Estate API Endpoints

This module handles real estate analysis including price prediction,
market trends, and property valuation.
"""

from fastapi import APIRouter, Query
from typing import Optional
from pydantic import BaseModel

from app.services.real_estate_analyzer import real_estate_analyzer

router = APIRouter()


class PropertyData(BaseModel):
    """Property data model"""
    address: str
    property_type: str  # apartment, house, commercial
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    area_sqm: Optional[float] = None
    age_years: Optional[int] = None
    parking_spaces: Optional[int] = None
    furnished: bool = False


class PropertyPrice(BaseModel):
    """Property price model"""
    current_price: float
    predicted_price: float
    price_per_sqm: float
    confidence_score: float
    market_trend: str  # rising, stable, declining


class MarketAnalysis(BaseModel):
    """Market analysis model"""
    average_price: float
    median_price: float
    price_trend_6m: float  # percentage change
    price_trend_12m: float
    market_velocity: int  # days on market
    supply_demand_ratio: float


class RentalYieldAnalysis(BaseModel):
    """Rental yield analysis model"""
    gross_yield_percent: float
    net_yield_percent: float
    annual_rental_income: float
    net_annual_income: float
    yield_assessment: str
    payback_period_years: float


@router.post("/predict-price", response_model=PropertyPrice)
async def predict_property_price(property_data: PropertyData):
    """
    Predict property price using machine learning models.
    
    This endpoint takes property characteristics and returns a predicted
    price along with confidence scores and market trends.
    """
    try:
        # Use real estate analyzer for prediction
        prediction_result = real_estate_analyzer.predict_property_price(
            address=property_data.address,
            property_type=property_data.property_type,
            bedrooms=property_data.bedrooms or 2,
            bathrooms=property_data.bathrooms or 1,
            area_sqm=property_data.area_sqm or 60,
            age_years=property_data.age_years or 10,
            parking_spaces=property_data.parking_spaces or 0,
            furnished=property_data.furnished,
            amenities=[]
        )
        
        return PropertyPrice(
            current_price=prediction_result['base_price'],
            predicted_price=prediction_result['predicted_price'],
            price_per_sqm=prediction_result['price_per_sqm'],
            confidence_score=prediction_result['confidence_score'],
            market_trend=prediction_result['market_trend']
        )
        
    except Exception as e:
        # Fallback to mock calculation on error
        print(f"Error in price prediction: {e}")
        
        base_price_per_sqm = {
            "apartment": 8000,
            "house": 6000, 
            "commercial": 10000
        }.get(property_data.property_type, 7000)
        
        area = property_data.area_sqm or 80
        predicted_price = base_price_per_sqm * area
        
        return PropertyPrice(
            current_price=predicted_price * 0.95,
            predicted_price=predicted_price,
            price_per_sqm=base_price_per_sqm,
            confidence_score=0.75,
            market_trend="stable"
        )


@router.get("/market-analysis")
async def get_market_analysis(
    latitude: float = Query(..., description="Property latitude"),
    longitude: float = Query(..., description="Property longitude"),
    radius: float = Query(1000, description="Analysis radius in meters"),
    property_type: Optional[str] = Query("apartment", description="Property type filter")
):
    """
    Get market analysis for a specific area.
    
    This endpoint provides comprehensive market statistics for properties
    in a given geographic area.
    """
    try:
        # Use real estate analyzer for market analysis
        market_data = real_estate_analyzer.analyze_market_trends(
            latitude=latitude,
            longitude=longitude,
            property_type=property_type,
            radius_km=radius / 1000  # Convert meters to kilometers
        )
        
        metrics = market_data['market_metrics']
        
        return MarketAnalysis(
            average_price=metrics['average_price_per_sqm'] * 60,  # Assume 60sqm average
            median_price=metrics['median_price_per_sqm'] * 60,
            price_trend_6m=metrics['price_trend_6m'] * 100,  # Convert to percentage
            price_trend_12m=metrics['price_trend_12m'] * 100,
            market_velocity=metrics['market_velocity_days'],
            supply_demand_ratio=metrics['supply_demand_ratio']
        )
        
    except Exception as e:
        print(f"Error in market analysis: {e}")
        
        # Fallback to mock analysis
        return MarketAnalysis(
            average_price=450000,
            median_price=420000,
            price_trend_6m=5.2,
            price_trend_12m=12.8,
            market_velocity=35,
            supply_demand_ratio=1.1
        )


@router.get("/comparable-properties")
async def get_comparable_properties(
    latitude: float = Query(..., description="Property latitude"),
    longitude: float = Query(..., description="Property longitude"),
    property_type: str = Query(..., description="Property type"),
    bedrooms: Optional[int] = Query(None, description="Number of bedrooms"),
    area_min: Optional[float] = Query(None, description="Minimum area"),
    area_max: Optional[float] = Query(None, description="Maximum area")
):
    """
    Find comparable properties in the area.
    
    This endpoint finds similar properties that have been recently sold
    or are currently on the market for comparison purposes.
    """
    # TODO: Implement actual comparable property search
    # For now, return mock data
    
    return {
        "search_criteria": {
            "location": f"{latitude}, {longitude}",
            "property_type": property_type,
            "bedrooms": bedrooms,
            "area_range": [area_min, area_max]
        },
        "comparable_properties": [
            {
                "address": "Rua Augusta, 1200",
                "price": 480000,
                "area_sqm": 85,
                "bedrooms": 3,
                "bathrooms": 2,
                "sale_date": "2024-11-15",
                "distance_meters": 250
            },
            {
                "address": "Rua Consolação, 800", 
                "price": 520000,
                "area_sqm": 92,
                "bedrooms": 3,
                "bathrooms": 2,
                "sale_date": "2024-10-28",
                "distance_meters": 420
            }
        ]
    }


@router.get("/investment-analysis")
async def get_investment_analysis(
    latitude: float = Query(..., description="Property latitude"),
    longitude: float = Query(..., description="Property longitude"),
    purchase_price: float = Query(..., description="Property purchase price"),
    rental_income: Optional[float] = Query(None, description="Expected monthly rental income")
):
    """
    Analyze investment potential of a property.
    
    This endpoint calculates various investment metrics including ROI,
    cap rate, and cash flow projections.
    """
    # TODO: Implement actual investment analysis
    # For now, return mock analysis
    
    monthly_rental = rental_income or (purchase_price * 0.006)  # 0.6% rule
    annual_rental = monthly_rental * 12
    
    return {
        "property_details": {
            "purchase_price": purchase_price,
            "estimated_monthly_rental": monthly_rental,
            "estimated_annual_rental": annual_rental
        },
        "investment_metrics": {
            "gross_yield_percent": (annual_rental / purchase_price) * 100,
            "cap_rate_percent": 6.8,
            "cash_on_cash_return_percent": 8.2,
            "break_even_months": 18
        },
        "market_outlook": {
            "appreciation_forecast_5y": 45.2,  # 45.2% in 5 years
            "rental_growth_forecast": 4.5,  # 4.5% annually
            "market_risk_score": "medium"
        }
    }


@router.post("/rental-yield", response_model=RentalYieldAnalysis)
async def calculate_rental_yield(
    property_price: float = Query(..., description="Property purchase price"),
    monthly_rent: float = Query(..., description="Expected monthly rent"),
    annual_costs: float = Query(0, description="Annual maintenance and tax costs")
):
    """
    Calculate rental yield for investment analysis.
    
    This endpoint calculates gross and net rental yields to help
    evaluate the profitability of a rental property investment.
    """
    try:
        # Use real estate analyzer for rental yield calculation
        yield_analysis = real_estate_analyzer.calculate_rental_yield(
            property_price=property_price,
            monthly_rent=monthly_rent,
            annual_costs=annual_costs
        )
        
        return RentalYieldAnalysis(
            gross_yield_percent=yield_analysis['gross_yield_percent'],
            net_yield_percent=yield_analysis['net_yield_percent'],
            annual_rental_income=yield_analysis['annual_rental_income'],
            net_annual_income=yield_analysis['net_annual_income'],
            yield_assessment=yield_analysis['yield_assessment'],
            payback_period_years=yield_analysis['payback_period_years']
        )
        
    except Exception as e:
        print(f"Error calculating rental yield: {e}")
        
        # Fallback calculation
        annual_rent = monthly_rent * 12
        net_annual_rent = annual_rent - annual_costs
        gross_yield = (annual_rent / property_price) * 100
        net_yield = (net_annual_rent / property_price) * 100
        
        return RentalYieldAnalysis(
            gross_yield_percent=round(gross_yield, 2),
            net_yield_percent=round(net_yield, 2),
            annual_rental_income=annual_rent,
            net_annual_income=net_annual_rent,
            yield_assessment="Análise básica",
            payback_period_years=round(property_price / net_annual_rent, 1) if net_annual_rent > 0 else 999
        )
