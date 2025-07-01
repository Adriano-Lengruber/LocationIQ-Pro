"""
Security Analysis Service

This module provides security analysis for locations, including crime data analysis,
safety scoring, and risk assessment using available data sources.
"""

import numpy as np
from typing import Dict, List, Optional, Tuple
import random
from datetime import datetime, timedelta


class SecurityAnalyzer:
    """Service for security analysis and safety scoring"""
    
    def __init__(self):
        # Crime type weights for security scoring
        self.crime_weights = {
            'violent_crime': 0.4,        # Homicide, assault, robbery
            'property_crime': 0.25,      # Theft, burglary, vandalism
            'drug_related': 0.15,        # Drug trafficking, possession
            'traffic_violations': 0.10,   # Traffic accidents, violations
            'public_disorder': 0.10      # Noise complaints, disturbances
        }
        
        # Base security factors by area type
        self.area_security_base = {
            'commercial': 7.5,        # Business districts
            'residential_upscale': 8.5, # High-end neighborhoods
            'residential_middle': 7.0,  # Middle-class areas
            'residential_low': 5.5,     # Lower-income areas
            'industrial': 6.0,         # Industrial zones
            'mixed': 6.8,              # Mixed-use areas
            'tourist': 7.8             # Tourist areas
        }
        
        # Time-based risk factors
        self.time_risk_factors = {
            'morning': 0.8,    # 6-12h
            'afternoon': 0.7,  # 12-18h
            'evening': 1.0,    # 18-22h
            'night': 1.4,      # 22-6h
            'weekend': 1.2     # Weekend multiplier
        }
        
        # Safety infrastructure weights
        self.safety_infrastructure = {
            'police_station': 0.15,
            'security_cameras': 0.10,
            'lighting': 0.08,
            'emergency_services': 0.12,
            'private_security': 0.05
        }
    
    def identify_area_type(self, latitude: float, longitude: float) -> str:
        """
        Identify area type based on coordinates for security assessment
        
        Args:
            latitude: Location latitude
            longitude: Location longitude
            
        Returns:
            Area type classification
        """
        # Mock area type identification (in production, use land use data)
        # This is a simplified classification based on coordinates
        
        # São Paulo example areas
        if -23.52 <= latitude <= -23.54 and -46.64 <= longitude <= -46.62:
            return 'commercial'  # Paulista area
        elif -23.56 <= latitude <= -23.58 and -46.67 <= longitude <= -46.65:
            return 'residential_upscale'  # Jardins
        elif -23.50 <= latitude <= -23.52 and -46.62 <= longitude <= -46.60:
            return 'tourist'  # Centro histórico
        else:
            # Random assignment for demo (replace with real classification)
            return random.choice(['residential_middle', 'mixed', 'commercial'])
    
    def calculate_crime_score(
        self, 
        latitude: float, 
        longitude: float, 
        radius_meters: int = 1000
    ) -> Dict:
        """
        Calculate crime score based on historical data
        
        Args:
            latitude: Location latitude
            longitude: Location longitude
            radius_meters: Analysis radius
            
        Returns:
            Crime score analysis
        """
        # Mock crime data (in production, use real crime databases)
        # Generate realistic but random crime statistics
        
        # Base crime rates per 1000 residents annually
        base_rates = {
            'violent_crime': np.random.normal(2.5, 1.0),      # 2.5 ± 1.0
            'property_crime': np.random.normal(15.0, 5.0),    # 15 ± 5
            'drug_related': np.random.normal(8.0, 3.0),       # 8 ± 3
            'traffic_violations': np.random.normal(25.0, 8.0), # 25 ± 8
            'public_disorder': np.random.normal(12.0, 4.0)    # 12 ± 4
        }
        
        # Ensure non-negative values
        for crime_type in base_rates:
            base_rates[crime_type] = max(0, base_rates[crime_type])
        
        # Calculate weighted crime score (lower is better)
        weighted_crime_rate = sum(
            rate * self.crime_weights[crime_type]
            for crime_type, rate in base_rates.items()
        )
        
        # Convert to safety score (0-10, higher is safer)
        # Assume average crime rate of 10 weighted units = score 5
        safety_score = max(0, min(10, 10 - (weighted_crime_rate / 2)))
        
        return {
            'safety_score': round(safety_score, 2),
            'crime_rates': {k: round(v, 2) for k, v in base_rates.items()},
            'weighted_crime_rate': round(weighted_crime_rate, 2),
            'risk_level': self._get_risk_level(safety_score)
        }
    
    def _get_risk_level(self, safety_score: float) -> str:
        """Determine risk level based on safety score"""
        if safety_score >= 8.0:
            return 'low'
        elif safety_score >= 6.0:
            return 'medium'
        elif safety_score >= 4.0:
            return 'high'
        else:
            return 'very_high'
    
    def analyze_time_based_safety(
        self, 
        latitude: float, 
        longitude: float
    ) -> Dict:
        """
        Analyze safety scores for different times of day
        
        Args:
            latitude: Location latitude
            longitude: Location longitude
            
        Returns:
            Time-based safety analysis
        """
        base_score = self.calculate_crime_score(latitude, longitude)['safety_score']
        
        time_scores = {}
        for time_period, risk_factor in self.time_risk_factors.items():
            if time_period != 'weekend':  # Weekend is a multiplier, not a time period
                adjusted_score = base_score / risk_factor
                adjusted_score = max(0, min(10, adjusted_score))
                time_scores[time_period] = round(adjusted_score, 2)
        
        # Weekend scores (apply weekend multiplier to each time period)
        weekend_multiplier = self.time_risk_factors['weekend']
        weekend_scores = {
            f"{period}_weekend": round(score / weekend_multiplier, 2)
            for period, score in time_scores.items()
        }
        
        return {
            'weekday_scores': time_scores,
            'weekend_scores': weekend_scores,
            'safest_time': max(time_scores, key=time_scores.get),
            'riskiest_time': min(time_scores, key=time_scores.get),
            'recommendations': self._get_time_recommendations(time_scores)
        }
    
    def _get_time_recommendations(self, time_scores: Dict) -> List[str]:
        """Generate time-based safety recommendations"""
        recommendations = []
        
        night_score = time_scores.get('night', 5)
        if night_score < 6:
            recommendations.append("Evite circulação noturna - considere transporte por aplicativo")
        
        morning_score = time_scores.get('morning', 7)
        if morning_score >= 8:
            recommendations.append("Período matinal é ideal para atividades na área")
        
        afternoon_score = time_scores.get('afternoon', 7)
        if afternoon_score >= 8:
            recommendations.append("Tardes são seguras para comércio e lazer")
        
        evening_score = time_scores.get('evening', 6)
        if evening_score < 6:
            recommendations.append("Cuidado redobrado no período noturno")
        
        return recommendations
    
    def assess_safety_infrastructure(
        self, 
        latitude: float, 
        longitude: float, 
        radius_meters: int = 1000
    ) -> Dict:
        """
        Assess safety infrastructure in the area
        
        Args:
            latitude: Location latitude
            longitude: Location longitude
            radius_meters: Analysis radius
            
        Returns:
            Safety infrastructure assessment
        """
        # Mock infrastructure data (in production, use real GIS data)
        infrastructure_scores = {}
        
        # Generate realistic infrastructure presence
        infrastructure_scores['police_station'] = min(10, np.random.exponential(3))
        infrastructure_scores['security_cameras'] = min(10, np.random.normal(6, 2))
        infrastructure_scores['lighting'] = min(10, np.random.normal(7, 1.5))
        infrastructure_scores['emergency_services'] = min(10, np.random.exponential(4))
        infrastructure_scores['private_security'] = min(10, np.random.normal(5, 2))
        
        # Ensure non-negative values
        infrastructure_scores = {k: max(0, v) for k, v in infrastructure_scores.items()}
        
        # Calculate weighted infrastructure score
        total_score = sum(
            score * self.safety_infrastructure[infra_type]
            for infra_type, score in infrastructure_scores.items()
        )
        
        # Normalize to 0-10 scale
        normalized_score = total_score / sum(self.safety_infrastructure.values())
        
        return {
            'overall_infrastructure_score': round(normalized_score, 2),
            'infrastructure_breakdown': {
                k: round(v, 2) for k, v in infrastructure_scores.items()
            },
            'strengths': [
                infra for infra, score in infrastructure_scores.items() 
                if score >= 7
            ],
            'weaknesses': [
                infra for infra, score in infrastructure_scores.items() 
                if score < 5
            ]
        }
    
    def calculate_overall_security_score(
        self, 
        latitude: float, 
        longitude: float, 
        radius_meters: int = 1000
    ) -> Dict:
        """
        Calculate comprehensive security score
        
        Args:
            latitude: Location latitude
            longitude: Location longitude
            radius_meters: Analysis radius
            
        Returns:
            Comprehensive security analysis
        """
        try:
            # Get area type
            area_type = self.identify_area_type(latitude, longitude)
            base_security = self.area_security_base.get(area_type, 6.5)
            
            # Get crime score
            crime_analysis = self.calculate_crime_score(latitude, longitude, radius_meters)
            crime_score = crime_analysis['safety_score']
            
            # Get infrastructure score
            infrastructure_analysis = self.assess_safety_infrastructure(
                latitude, longitude, radius_meters
            )
            infrastructure_score = infrastructure_analysis['overall_infrastructure_score']
            
            # Get time-based analysis
            time_analysis = self.analyze_time_based_safety(latitude, longitude)
            
            # Calculate weighted overall score
            weights = {'crime': 0.4, 'infrastructure': 0.3, 'area_type': 0.3}
            
            overall_score = (
                crime_score * weights['crime'] +
                infrastructure_score * weights['infrastructure'] +
                base_security * weights['area_type']
            )
            
            overall_score = min(10, max(0, overall_score))
            
            # Generate insights and recommendations
            insights = self._generate_security_insights(
                overall_score, area_type, crime_analysis, infrastructure_analysis
            )
            
            return {
                'location': {'latitude': latitude, 'longitude': longitude},
                'overall_security_score': round(overall_score, 2),
                'area_type': area_type,
                'analysis_components': {
                    'crime_analysis': crime_analysis,
                    'infrastructure_analysis': infrastructure_analysis,
                    'time_analysis': time_analysis,
                    'base_area_security': base_security
                },
                'risk_assessment': self._get_risk_level(overall_score),
                'insights': insights,
                'recommendations': self._generate_security_recommendations(
                    overall_score, crime_analysis, infrastructure_analysis
                )
            }
            
        except Exception as e:
            print(f"Error in security analysis: {str(e)}")
            
            # Return fallback data
            return {
                'location': {'latitude': latitude, 'longitude': longitude},
                'overall_security_score': 6.5,
                'area_type': 'mixed',
                'risk_assessment': 'medium',
                'insights': ['Dados limitados disponíveis'],
                'recommendations': ['Mantenha precauções básicas de segurança'],
                'error': str(e)
            }
    
    def _generate_security_insights(
        self, 
        overall_score: float, 
        area_type: str, 
        crime_analysis: Dict, 
        infrastructure_analysis: Dict
    ) -> List[str]:
        """Generate security insights based on analysis"""
        insights = []
        
        # Overall assessment
        if overall_score >= 8.5:
            insights.append("Área com excelente segurança e baixo risco")
        elif overall_score >= 7.0:
            insights.append("Área com boa segurança e precauções básicas")
        elif overall_score >= 5.5:
            insights.append("Área com segurança moderada - cuidados necessários")
        else:
            insights.append("Área com desafios de segurança - precauções extras")
        
        # Area type insights
        if area_type == 'commercial':
            insights.append("Área comercial com movimento durante horário comercial")
        elif area_type == 'residential_upscale':
            insights.append("Bairro residencial de alto padrão")
        elif area_type == 'tourist':
            insights.append("Área turística com policiamento reforçado")
        
        # Crime-specific insights
        crime_score = crime_analysis['safety_score']
        if crime_score >= 8:
            insights.append("Baixos índices de criminalidade")
        elif crime_score < 5:
            insights.append("Atenção aos índices de criminalidade da região")
        
        # Infrastructure insights
        infra_score = infrastructure_analysis['overall_infrastructure_score']
        if infra_score >= 7:
            insights.append("Boa infraestrutura de segurança")
        elif infra_score < 5:
            insights.append("Infraestrutura de segurança pode ser melhorada")
        
        return insights
    
    def _generate_security_recommendations(
        self, 
        overall_score: float, 
        crime_analysis: Dict, 
        infrastructure_analysis: Dict
    ) -> List[str]:
        """Generate security recommendations"""
        recommendations = []
        
        # General recommendations based on score
        if overall_score < 6:
            recommendations.extend([
                "Evite carregar objetos de valor visíveis",
                "Prefira transporte por aplicativo à noite",
                "Mantenha-se em áreas bem iluminadas e movimentadas"
            ])
        
        # Crime-specific recommendations
        crime_rates = crime_analysis['crime_rates']
        if crime_rates.get('property_crime', 0) > 20:
            recommendations.append("Cuidado especial com pertences pessoais")
        
        if crime_rates.get('violent_crime', 0) > 5:
            recommendations.append("Evite circular sozinho em horários de menor movimento")
        
        # Infrastructure-based recommendations
        infra_breakdown = infrastructure_analysis['infrastructure_breakdown']
        if infra_breakdown.get('lighting', 10) < 5:
            recommendations.append("Atenção especial em áreas mal iluminadas")
        
        if infra_breakdown.get('police_station', 10) < 3:
            recommendations.append("Localize delegacias e postos policiais próximos")
        
        # Positive recommendations
        if overall_score >= 8:
            recommendations.append("Área segura para atividades diurnas e noturnas")
        elif overall_score >= 6:
            recommendations.append("Área adequada com precauções básicas")
        
        return recommendations


# Global instance
security_analyzer = SecurityAnalyzer()
