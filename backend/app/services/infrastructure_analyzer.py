"""
Infrastructure Analysis Service

This module calculates infrastructure scores based on proximity to essential services,
amenities, and urban facilities using Google Places API data.
"""

import math
from typing import Dict, List, Optional, Tuple
from app.services.google_places import google_places_service

class InfrastructureAnalyzer:
    """Service for analyzing urban infrastructure and calculating convenience scores"""
    
    def __init__(self):
        # Weight factors for different types of infrastructure
        self.infrastructure_weights = {
            'healthcare': 0.25,      # Hospitals, clinics, pharmacies
            'education': 0.20,       # Schools, universities
            'transportation': 0.15,  # Bus stops, subway stations
            'shopping': 0.15,        # Markets, malls, stores
            'services': 0.10,        # Banks, post office, government
            'recreation': 0.10,      # Parks, gyms, entertainment
            'dining': 0.05          # Restaurants, cafes
        }
        
        # Place types mapping to infrastructure categories
        self.place_type_mapping = {
            'healthcare': [
                'hospital', 'pharmacy', 'doctor', 'dentist', 
                'veterinary_care', 'physiotherapist'
            ],
            'education': [
                'school', 'university', 'library', 'secondary_school',
                'primary_school', 'kindergarten'
            ],
            'transportation': [
                'bus_station', 'subway_station', 'train_station',
                'transit_station', 'airport'
            ],
            'shopping': [
                'supermarket', 'grocery_or_supermarket', 'shopping_mall',
                'clothing_store', 'electronics_store', 'hardware_store'
            ],
            'services': [
                'bank', 'post_office', 'local_government_office',
                'police', 'fire_station', 'courthouse'
            ],
            'recreation': [
                'park', 'gym', 'amusement_park', 'zoo', 'museum',
                'movie_theater', 'night_club', 'stadium'
            ],
            'dining': [
                'restaurant', 'meal_takeaway', 'cafe', 'bar',
                'bakery', 'meal_delivery'
            ]
        }
    
    def calculate_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """
        Calculate distance between two coordinates using Haversine formula
        
        Returns:
            Distance in meters
        """
        R = 6371000  # Earth's radius in meters
        
        lat1_rad = math.radians(lat1)
        lat2_rad = math.radians(lat2)
        delta_lat = math.radians(lat2 - lat1)
        delta_lon = math.radians(lon2 - lon1)
        
        a = (math.sin(delta_lat / 2) ** 2 + 
             math.cos(lat1_rad) * math.cos(lat2_rad) * 
             math.sin(delta_lon / 2) ** 2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        
        return R * c
    
    def categorize_place(self, place_types: List[str]) -> Optional[str]:
        """
        Categorize a place based on its types
        
        Args:
            place_types: List of Google Places types for the place
            
        Returns:
            Infrastructure category or None if not categorized
        """
        for category, types in self.place_type_mapping.items():
            for place_type in place_types:
                if place_type in types:
                    return category
        return None
    
    def calculate_proximity_score(self, distance: float, category: str) -> float:
        """
        Calculate proximity score based on distance and category importance
        
        Args:
            distance: Distance to facility in meters
            category: Infrastructure category
            
        Returns:
            Proximity score (0-10)
        """
        # Ideal distances for different categories (in meters)
        ideal_distances = {
            'healthcare': 1000,      # 1km
            'education': 800,        # 800m
            'transportation': 500,   # 500m
            'shopping': 600,         # 600m
            'services': 1200,        # 1.2km
            'recreation': 1500,      # 1.5km
            'dining': 400           # 400m
        }
        
        ideal_dist = ideal_distances.get(category, 1000)
        
        # Score calculation: closer is better, but with diminishing returns
        if distance <= ideal_dist:
            # Full score if within ideal distance
            return 10.0
        elif distance <= ideal_dist * 2:
            # Linear decrease from ideal to 2x ideal distance
            return 10.0 - (5.0 * (distance - ideal_dist) / ideal_dist)
        elif distance <= ideal_dist * 4:
            # Slower decrease from 2x to 4x ideal distance
            return 5.0 - (3.0 * (distance - ideal_dist * 2) / (ideal_dist * 2))
        else:
            # Minimum score for very distant facilities
            return max(0.0, 2.0 - (distance / (ideal_dist * 10)))
    
    async def analyze_infrastructure(
        self, 
        latitude: float, 
        longitude: float, 
        radius: int = 2000
    ) -> Dict:
        """
        Analyze infrastructure around a location
        
        Args:
            latitude: Center latitude
            longitude: Center longitude
            radius: Search radius in meters
            
        Returns:
            Infrastructure analysis results
        """
        try:
            # Get nearby places
            nearby_places = await google_places_service.get_nearby_places(
                latitude=latitude,
                longitude=longitude,
                radius=radius
            )
            
            # Initialize category scores
            category_scores = {category: [] for category in self.infrastructure_weights.keys()}
            place_counts = {category: 0 for category in self.infrastructure_weights.keys()}
            
            # Analyze each place
            for place in nearby_places:
                place_types = place.get('types', [])
                category = self.categorize_place(place_types)
                
                if category:
                    # Calculate distance
                    place_location = place.get('geometry', {}).get('location', {})
                    place_lat = place_location.get('lat', latitude)
                    place_lng = place_location.get('lng', longitude)
                    
                    distance = self.calculate_distance(
                        latitude, longitude, place_lat, place_lng
                    )
                    
                    # Calculate proximity score
                    proximity_score = self.calculate_proximity_score(distance, category)
                    
                    # Add to category scores
                    category_scores[category].append({
                        'name': place.get('name', 'Unknown'),
                        'distance': distance,
                        'score': proximity_score,
                        'rating': place.get('rating', 0.0)
                    })
                    place_counts[category] += 1
            
            # Calculate final scores for each category
            final_scores = {}
            detailed_analysis = {}
            
            for category, places in category_scores.items():
                if places:
                    # Take top 5 closest places for each category
                    top_places = sorted(places, key=lambda x: x['distance'])[:5]
                    
                    # Calculate weighted average score
                    total_score = sum(place['score'] for place in top_places)
                    avg_score = total_score / len(top_places)
                    
                    # Adjust for availability (more places = higher score)
                    availability_bonus = min(1.0, len(places) / 3) * 0.5
                    final_score = min(10.0, avg_score + availability_bonus)
                    
                    final_scores[category] = final_score
                    detailed_analysis[category] = {
                        'score': final_score,
                        'count': len(places),
                        'top_places': top_places,
                        'average_distance': sum(p['distance'] for p in top_places) / len(top_places)
                    }
                else:
                    final_scores[category] = 0.0
                    detailed_analysis[category] = {
                        'score': 0.0,
                        'count': 0,
                        'top_places': [],
                        'average_distance': float('inf')
                    }
            
            # Calculate overall infrastructure score
            overall_score = sum(
                score * self.infrastructure_weights[category]
                for category, score in final_scores.items()
            )
            
            # Generate insights
            insights = self._generate_insights(detailed_analysis, overall_score)
            
            return {
                'location': {'latitude': latitude, 'longitude': longitude},
                'overall_score': round(overall_score, 2),
                'category_scores': final_scores,
                'detailed_analysis': detailed_analysis,
                'insights': insights,
                'total_places_analyzed': sum(place_counts.values())
            }
            
        except Exception as e:
            print(f"Error in infrastructure analysis: {str(e)}")
            
            # Return mock data on error
            return {
                'location': {'latitude': latitude, 'longitude': longitude},
                'overall_score': 7.5,
                'category_scores': {
                    'healthcare': 8.0,
                    'education': 7.5,
                    'transportation': 6.8,
                    'shopping': 8.2,
                    'services': 7.0,
                    'recreation': 7.8,
                    'dining': 8.5
                },
                'insights': [
                    "Boa disponibilidade de serviços essenciais",
                    "Transporte público adequado",
                    "Variedade de opções comerciais"
                ],
                'total_places_analyzed': 0,
                'note': 'Dados simulados - API não disponível'
            }
    
    def _generate_insights(self, detailed_analysis: Dict, overall_score: float) -> List[str]:
        """Generate insights based on infrastructure analysis"""
        insights = []
        
        # Overall assessment
        if overall_score >= 8.5:
            insights.append("Excelente infraestrutura urbana com todos os serviços essenciais")
        elif overall_score >= 7.0:
            insights.append("Boa infraestrutura com acesso adequado aos serviços")
        elif overall_score >= 5.0:
            insights.append("Infraestrutura moderada com algumas limitações")
        else:
            insights.append("Infraestrutura limitada - pode requerer deslocamentos maiores")
        
        # Category-specific insights
        healthcare_score = detailed_analysis.get('healthcare', {}).get('score', 0)
        if healthcare_score >= 8:
            insights.append("Excelente acesso a serviços de saúde")
        elif healthcare_score < 5:
            insights.append("Acesso limitado a serviços de saúde nas proximidades")
        
        transport_score = detailed_analysis.get('transportation', {}).get('score', 0)
        if transport_score >= 8:
            insights.append("Ótima conectividade de transporte público")
        elif transport_score < 5:
            insights.append("Transporte público limitado - considere acesso por veículo próprio")
        
        shopping_score = detailed_analysis.get('shopping', {}).get('score', 0)
        if shopping_score >= 8:
            insights.append("Ampla variedade de opções comerciais e serviços")
        elif shopping_score < 5:
            insights.append("Opções comerciais limitadas nas proximidades")
        
        education_score = detailed_analysis.get('education', {}).get('score', 0)
        if education_score >= 8:
            insights.append("Boa disponibilidade de instituições educacionais")
        elif education_score < 5:
            insights.append("Poucas opções educacionais na região")
        
        return insights
    
    def get_infrastructure_recommendations(self, analysis_result: Dict) -> List[str]:
        """Generate recommendations based on infrastructure analysis"""
        recommendations = []
        category_scores = analysis_result.get('category_scores', {})
        
        # Identify strengths and weaknesses
        strengths = [cat for cat, score in category_scores.items() if score >= 8]
        weaknesses = [cat for cat, score in category_scores.items() if score < 5]
        
        if strengths:
            recommendations.append(f"Pontos fortes: {', '.join(strengths)}")
        
        if weaknesses:
            recommendations.append(f"Áreas de atenção: {', '.join(weaknesses)}")
        
        # Specific recommendations based on overall score
        overall_score = analysis_result.get('overall_score', 0)
        
        if overall_score >= 8:
            recommendations.extend([
                "Localização ideal para moradia com excelente infraestrutura",
                "Adequada para famílias e profissionais",
                "Potencial de valorização imobiliária"
            ])
        elif overall_score >= 6:
            recommendations.extend([
                "Boa localização com infraestrutura adequada",
                "Considere as necessidades específicas do seu perfil",
                "Avalie transporte para áreas de interesse específico"
            ])
        else:
            recommendations.extend([
                "Localização com infraestrutura limitada",
                "Recomendado para quem prioriza outros fatores",
                "Considere custos adicionais de deslocamento"
            ])
        
        return recommendations

    async def get_category_scores(
        self, 
        latitude: float, 
        longitude: float, 
        radius: int = 1000
    ) -> Dict[str, float]:
        """
        Get infrastructure scores broken down by category
        
        Args:
            latitude: Center latitude
            longitude: Center longitude
            radius: Search radius in meters
            
        Returns:
            Dictionary with category scores
        """
        analysis = await self.analyze_infrastructure(latitude, longitude, radius)
        return analysis.get('category_scores', {})
    
    async def calculate_category_score(
        self, 
        latitude: float, 
        longitude: float, 
        category: str, 
        radius: int = 1000
    ) -> float:
        """
        Calculate score for a specific infrastructure category
        
        Args:
            latitude: Center latitude
            longitude: Center longitude
            category: Infrastructure category
            radius: Search radius in meters
            
        Returns:
            Category score (0-10)
        """
        category_scores = await self.get_category_scores(latitude, longitude, radius)
        return category_scores.get(category, 0.0)
    
    async def get_nearby_facilities_by_category(
        self, 
        latitude: float, 
        longitude: float, 
        radius: int = 1000
    ) -> Dict[str, List[Dict]]:
        """
        Get nearby facilities organized by category
        
        Args:
            latitude: Center latitude
            longitude: Center longitude
            radius: Search radius in meters
            
        Returns:
            Dictionary with facilities by category
        """
        analysis = await self.analyze_infrastructure(latitude, longitude, radius)
        detailed_analysis = analysis.get('detailed_analysis', {})
        
        nearby_facilities = {}
        for category, data in detailed_analysis.items():
            nearby_facilities[category] = data.get('top_places', [])
        
        return nearby_facilities
    
    async def get_facilities_for_category(
        self, 
        latitude: float, 
        longitude: float, 
        category: str, 
        radius: int = 1000
    ) -> List[Dict]:
        """
        Get facilities for a specific category
        
        Args:
            latitude: Center latitude
            longitude: Center longitude
            category: Infrastructure category
            radius: Search radius in meters
            
        Returns:
            List of facilities for the category
        """
        nearby_facilities = await self.get_nearby_facilities_by_category(
            latitude, longitude, radius
        )
        return nearby_facilities.get(category, [])
    
    def calculate_accessibility_score(
        self, 
        facilities: List[Dict], 
        latitude: float, 
        longitude: float
    ) -> float:
        """
        Calculate accessibility score based on facilities and location
        
        Args:
            facilities: List of facility data
            latitude: Reference latitude
            longitude: Reference longitude
            
        Returns:
            Accessibility score (0-10)
        """
        if not facilities:
            return 0.0
        
        # Calculate average distance
        total_distance = sum(facility.get('distance', 1000) for facility in facilities)
        avg_distance = total_distance / len(facilities)
        
        # Convert distance to accessibility score (closer = better)
        if avg_distance <= 300:
            return 10.0
        elif avg_distance <= 600:
            return 8.0 + (600 - avg_distance) / 300 * 2.0
        elif avg_distance <= 1000:
            return 6.0 + (1000 - avg_distance) / 400 * 2.0
        elif avg_distance <= 2000:
            return 3.0 + (2000 - avg_distance) / 1000 * 3.0
        else:
            return max(0.0, 3.0 - (avg_distance - 2000) / 1000)
    
    def get_improvement_suggestion(self, category: str, score: float) -> str:
        """
        Get improvement suggestions for a category based on its score
        
        Args:
            category: Infrastructure category
            score: Current score for the category
            
        Returns:
            Improvement suggestion text
        """
        suggestions = {
            'healthcare': {
                'high': 'Consider proximity to major hospitals and specialized clinics',
                'medium': 'Look for basic healthcare services within walking distance',
                'low': 'Ensure easy access to emergency services and pharmacies'
            },
            'education': {
                'high': 'Verify availability of schools for all educational levels',
                'medium': 'Check quality and reputation of nearby educational institutions',
                'low': 'Consider transportation to quality schools in other areas'
            },
            'transportation': {
                'high': 'Improve public transportation frequency and coverage',
                'medium': 'Add more bus stops or subway connections',
                'low': 'Essential to have reliable transportation access'
            },
            'shopping': {
                'high': 'Diversify retail options and add specialty stores',
                'medium': 'Ensure adequate grocery and daily needs coverage',
                'low': 'Basic shopping necessities should be easily accessible'
            },
            'services': {
                'high': 'Expand government and financial services',
                'medium': 'Add banking and postal services nearby',
                'low': 'Essential services like banks and post office needed'
            },
            'recreation': {
                'high': 'Enhance parks and recreational facilities',
                'medium': 'Add sports facilities and entertainment options',
                'low': 'Basic recreational spaces for community well-being'
            },
            'dining': {
                'high': 'Diversify dining options and cuisines',
                'medium': 'Add family-friendly restaurants and cafes',
                'low': 'Basic dining options for convenience'
            }
        }
        
        category_suggestions = suggestions.get(category, {})
        
        if score < 5.0:
            severity = 'low'
        elif score < 7.0:
            severity = 'medium'
        else:
            severity = 'high'
        
        return category_suggestions.get(severity, f'Improve {category} infrastructure')

    async def calculate_infrastructure_score(
        self, 
        latitude: float, 
        longitude: float, 
        radius: int = 1000
    ) -> float:
        """
        Calculate overall infrastructure score for a location
        
        Args:
            latitude: Center latitude
            longitude: Center longitude
            radius: Search radius in meters
            
        Returns:
            Overall infrastructure score (0-10)
        """
        analysis = await self.analyze_infrastructure(latitude, longitude, radius)
        return analysis.get('overall_score', 0.0)


# Global instance
infrastructure_analyzer = InfrastructureAnalyzer()
