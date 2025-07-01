"""
Real Estate Analysis Service

This module provides real estate market analysis, price prediction,
and property valuation using machine learning models and market data.
"""

import numpy as np
from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
import math


class RealEstateAnalyzer:
    """Service for real estate analysis and price prediction"""
    
    def __init__(self):
        # Base price per square meter for different areas (mock data for now)
        self.base_prices_per_sqm = {
            'centro': 8500,       # Downtown areas
            'jardins': 12000,     # Upscale neighborhoods
            'vila_madalena': 9500, # Trendy areas
            'moema': 10000,       # Mid-upscale
            'copacabana': 11000,  # Prime locations
            'ipanema': 13000,     # Premium areas
            'default': 7000       # Average areas
        }
        
        # Property type multipliers
        self.property_type_multipliers = {
            'apartment': 1.0,
            'house': 1.15,
            'penthouse': 1.8,
            'studio': 0.75,
            'commercial': 0.9,
            'loft': 1.2
        }
        
        # Age depreciation factors
        self.age_depreciation = {
            'new': 1.0,      # 0-2 years
            'recent': 0.95,   # 3-10 years
            'established': 0.85,  # 11-20 years
            'older': 0.75,    # 21-30 years
            'vintage': 0.65   # 30+ years
        }
        
        # Amenity value additions (percentage)
        self.amenity_values = {
            'parking': 0.08,      # 8% increase per space
            'furnished': 0.15,    # 15% increase
            'pool': 0.12,         # 12% increase
            'gym': 0.08,          # 8% increase
            'security': 0.10,     # 10% increase
            'elevator': 0.05      # 5% increase
        }
    
    def identify_neighborhood(self, address: str) -> str:
        """
        Identify neighborhood from address for pricing
        
        Args:
            address: Property address
            
        Returns:
            Neighborhood identifier
        """
        address_lower = address.lower()
        
        # Simple keyword matching (in production, use geocoding)
        if any(word in address_lower for word in ['centro', 'sé', 'república']):
            return 'centro'
        elif any(word in address_lower for word in ['jardins', 'jardim']):
            return 'jardins'
        elif 'vila madalena' in address_lower:
            return 'vila_madalena'
        elif 'moema' in address_lower:
            return 'moema'
        elif 'copacabana' in address_lower:
            return 'copacabana'
        elif 'ipanema' in address_lower:
            return 'ipanema'
        else:
            return 'default'
    
    def get_age_category(self, age_years: int) -> str:
        """Get age category for depreciation calculation"""
        if age_years <= 2:
            return 'new'
        elif age_years <= 10:
            return 'recent'
        elif age_years <= 20:
            return 'established'
        elif age_years <= 30:
            return 'older'
        else:
            return 'vintage'
    
    def calculate_base_price(
        self, 
        address: str, 
        property_type: str, 
        area_sqm: float,
        age_years: int = 10
    ) -> Tuple[float, Dict]:
        """
        Calculate base property price
        
        Args:
            address: Property address
            property_type: Type of property
            area_sqm: Area in square meters
            age_years: Age of property in years
            
        Returns:
            Tuple of (base_price, breakdown)
        """
        # Get neighborhood base price
        neighborhood = self.identify_neighborhood(address)
        base_price_per_sqm = self.base_prices_per_sqm.get(neighborhood, 
                                                          self.base_prices_per_sqm['default'])
        
        # Apply property type multiplier
        type_multiplier = self.property_type_multipliers.get(property_type.lower(), 1.0)
        
        # Apply age depreciation
        age_category = self.get_age_category(age_years)
        age_factor = self.age_depreciation[age_category]
        
        # Calculate base price
        adjusted_price_per_sqm = base_price_per_sqm * type_multiplier * age_factor
        base_price = adjusted_price_per_sqm * area_sqm
        
        breakdown = {
            'neighborhood': neighborhood,
            'base_price_per_sqm': base_price_per_sqm,
            'type_multiplier': type_multiplier,
            'age_factor': age_factor,
            'adjusted_price_per_sqm': adjusted_price_per_sqm,
            'area_sqm': area_sqm
        }
        
        return base_price, breakdown
    
    def calculate_amenity_adjustments(
        self, 
        base_price: float,
        parking_spaces: int = 0,
        furnished: bool = False,
        amenities: List[str] = None
    ) -> Tuple[float, Dict]:
        """
        Calculate price adjustments for amenities
        
        Args:
            base_price: Base property price
            parking_spaces: Number of parking spaces
            furnished: Whether property is furnished
            amenities: List of additional amenities
            
        Returns:
            Tuple of (adjusted_price, adjustments)
        """
        if amenities is None:
            amenities = []
        
        adjustments = {}
        total_adjustment = 0.0
        
        # Parking adjustment
        if parking_spaces > 0:
            parking_adj = self.amenity_values['parking'] * parking_spaces
            adjustments['parking'] = parking_adj
            total_adjustment += parking_adj
        
        # Furnished adjustment
        if furnished:
            furnished_adj = self.amenity_values['furnished']
            adjustments['furnished'] = furnished_adj
            total_adjustment += furnished_adj
        
        # Other amenities
        for amenity in amenities:
            if amenity.lower() in self.amenity_values:
                amenity_adj = self.amenity_values[amenity.lower()]
                adjustments[amenity] = amenity_adj
                total_adjustment += amenity_adj
        
        adjusted_price = base_price * (1 + total_adjustment)
        
        return adjusted_price, adjustments
    
    def predict_property_price(
        self,
        address: str,
        property_type: str,
        bedrooms: int = 2,
        bathrooms: int = 1,
        area_sqm: float = 60,
        age_years: int = 10,
        parking_spaces: int = 0,
        furnished: bool = False,
        amenities: List[str] = None
    ) -> Dict:
        """
        Predict property price using ML-like calculations
        
        Args:
            address: Property address
            property_type: Type of property
            bedrooms: Number of bedrooms
            bathrooms: Number of bathrooms
            area_sqm: Area in square meters
            age_years: Age of property
            parking_spaces: Number of parking spaces
            furnished: Whether furnished
            amenities: Additional amenities
            
        Returns:
            Price prediction results
        """
        try:
            # Calculate base price
            base_price, price_breakdown = self.calculate_base_price(
                address, property_type, area_sqm, age_years
            )
            
            # Apply amenity adjustments
            final_price, amenity_adjustments = self.calculate_amenity_adjustments(
                base_price, parking_spaces, furnished, amenities or []
            )
            
            # Room configuration adjustments
            room_score = bedrooms * 0.8 + bathrooms * 0.4
            room_multiplier = 0.9 + (room_score - 2.5) * 0.05  # Base around 2br/1ba
            room_multiplier = max(0.8, min(1.3, room_multiplier))  # Cap between 80% and 130%
            
            final_price *= room_multiplier
            
            # Add some realistic variance
            market_variance = np.random.normal(1.0, 0.05)  # ±5% market variance
            market_price = final_price * market_variance
            
            # Calculate confidence score
            confidence_factors = [
                1.0 if area_sqm > 30 else 0.8,  # Size factor
                1.0 if bedrooms > 0 else 0.9,   # Room data factor
                0.95 if age_years > 50 else 1.0, # Age uncertainty
                1.0 if parking_spaces >= 0 else 0.9  # Parking data
            ]
            confidence_score = min(0.95, np.mean(confidence_factors))
            
            # Determine market trend (simplified)
            neighborhood = price_breakdown['neighborhood']
            if neighborhood in ['jardins', 'ipanema', 'moema']:
                trend = 'rising'
            elif neighborhood in ['centro']:
                trend = 'stable'
            else:
                trend = 'stable'
            
            return {
                'predicted_price': round(market_price, 2),
                'base_price': round(base_price, 2),
                'price_per_sqm': round(market_price / area_sqm, 2),
                'confidence_score': round(confidence_score, 3),
                'market_trend': trend,
                'breakdown': {
                    'base_calculation': price_breakdown,
                    'amenity_adjustments': amenity_adjustments,
                    'room_multiplier': round(room_multiplier, 3),
                    'final_adjustments': {
                        'market_variance': round(market_variance, 3)
                    }
                },
                'price_range': {
                    'min': round(market_price * 0.85, 2),
                    'max': round(market_price * 1.15, 2)
                }
            }
            
        except Exception as e:
            print(f"Error in price prediction: {e}")
            
            # Fallback calculation
            return {
                'predicted_price': area_sqm * 8000,  # Simple fallback
                'base_price': area_sqm * 7500,
                'price_per_sqm': 8000,
                'confidence_score': 0.6,
                'market_trend': 'stable',
                'error': str(e)
            }
    
    def analyze_market_trends(
        self, 
        latitude: float, 
        longitude: float, 
        property_type: str = 'apartment',
        radius_km: float = 2.0
    ) -> Dict:
        """
        Analyze market trends for a location
        
        Args:
            latitude: Location latitude
            longitude: Location longitude
            property_type: Type of property to analyze
            radius_km: Analysis radius in kilometers
            
        Returns:
            Market analysis results
        """
        try:
            # Mock market data (in production, use real estate APIs)
            base_area_price = 8500  # Base price per sqm
            
            # Simulate market data
            current_avg_price = base_area_price * np.random.normal(1.0, 0.1)
            median_price = current_avg_price * 0.92  # Median typically lower
            
            # Price trends (mock data)
            trend_6m = np.random.normal(0.03, 0.05)  # 3% average growth ±5%
            trend_12m = np.random.normal(0.08, 0.08)  # 8% average growth ±8%
            
            # Market velocity (days on market)
            base_velocity = 45
            velocity_variance = np.random.normal(1.0, 0.3)
            market_velocity = max(20, int(base_velocity * velocity_variance))
            
            # Supply/demand ratio (1.0 = balanced)
            supply_demand = np.random.normal(1.0, 0.2)
            supply_demand = max(0.5, min(2.0, supply_demand))
            
            # Market insights
            insights = []
            if trend_12m > 0.10:
                insights.append("Mercado em forte crescimento")
            elif trend_12m > 0.05:
                insights.append("Mercado em crescimento moderado")
            elif trend_12m < -0.05:
                insights.append("Mercado em declínio")
            else:
                insights.append("Mercado estável")
            
            if market_velocity < 30:
                insights.append("Alta velocidade de vendas")
            elif market_velocity > 60:
                insights.append("Mercado mais lento")
            
            if supply_demand < 0.8:
                insights.append("Alta demanda, baixa oferta")
            elif supply_demand > 1.3:
                insights.append("Oferta superior à demanda")
            
            return {
                'location': {'latitude': latitude, 'longitude': longitude},
                'property_type': property_type,
                'analysis_radius_km': radius_km,
                'market_metrics': {
                    'average_price_per_sqm': round(current_avg_price, 2),
                    'median_price_per_sqm': round(median_price, 2),
                    'price_trend_6m': round(trend_6m, 4),
                    'price_trend_12m': round(trend_12m, 4),
                    'market_velocity_days': market_velocity,
                    'supply_demand_ratio': round(supply_demand, 2)
                },
                'insights': insights,
                'investment_recommendation': self._get_investment_recommendation(
                    trend_12m, supply_demand, market_velocity
                )
            }
            
        except Exception as e:
            print(f"Error in market analysis: {e}")
            
            return {
                'location': {'latitude': latitude, 'longitude': longitude},
                'market_metrics': {
                    'average_price_per_sqm': 8500,
                    'median_price_per_sqm': 7800,
                    'price_trend_6m': 0.03,
                    'price_trend_12m': 0.08,
                    'market_velocity_days': 45,
                    'supply_demand_ratio': 1.0
                },
                'insights': ['Dados limitados disponíveis'],
                'error': str(e)
            }
    
    def _get_investment_recommendation(
        self, 
        trend_12m: float, 
        supply_demand: float, 
        velocity: int
    ) -> Dict:
        """Get investment recommendation based on market metrics"""
        
        score = 5.0  # Base score
        
        # Trend impact
        if trend_12m > 0.10:
            score += 1.5
        elif trend_12m > 0.05:
            score += 1.0
        elif trend_12m < -0.05:
            score -= 1.5
        
        # Supply/demand impact
        if supply_demand < 0.8:
            score += 1.0
        elif supply_demand > 1.3:
            score -= 1.0
        
        # Velocity impact
        if velocity < 30:
            score += 0.5
        elif velocity > 60:
            score -= 0.5
        
        score = max(1.0, min(10.0, score))
        
        if score >= 8.0:
            recommendation = "Excelente oportunidade de investimento"
        elif score >= 6.5:
            recommendation = "Boa oportunidade de investimento"
        elif score >= 5.0:
            recommendation = "Investimento moderado - avaliar outros fatores"
        else:
            recommendation = "Cuidado - mercado desfavorável"
        
        return {
            'score': round(score, 1),
            'recommendation': recommendation,
            'risk_level': 'low' if score >= 7 else 'medium' if score >= 5 else 'high'
        }
    
    def calculate_rental_yield(
        self, 
        property_price: float, 
        monthly_rent: float,
        annual_costs: float = 0
    ) -> Dict:
        """
        Calculate rental yield for investment analysis
        
        Args:
            property_price: Property purchase price
            monthly_rent: Expected monthly rent
            annual_costs: Annual maintenance/tax costs
            
        Returns:
            Rental yield analysis
        """
        annual_rent = monthly_rent * 12
        net_annual_rent = annual_rent - annual_costs
        
        gross_yield = (annual_rent / property_price) * 100
        net_yield = (net_annual_rent / property_price) * 100
        
        # Calculate ROI considerations
        if net_yield >= 8:
            yield_assessment = "Excelente rentabilidade"
        elif net_yield >= 6:
            yield_assessment = "Boa rentabilidade"
        elif net_yield >= 4:
            yield_assessment = "Rentabilidade moderada"
        else:
            yield_assessment = "Baixa rentabilidade"
        
        return {
            'gross_yield_percent': round(gross_yield, 2),
            'net_yield_percent': round(net_yield, 2),
            'annual_rental_income': round(annual_rent, 2),
            'net_annual_income': round(net_annual_rent, 2),
            'yield_assessment': yield_assessment,
            'payback_period_years': round(property_price / net_annual_rent, 1) if net_annual_rent > 0 else float('inf')
        }


# Global instance
real_estate_analyzer = RealEstateAnalyzer()
