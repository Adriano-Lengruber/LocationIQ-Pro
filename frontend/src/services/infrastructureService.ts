/**
 * Infrastructure Analysis API Service
 * 
 * Service to interact with infrastructure analysis endpoints
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface InfrastructureScore {
  overall_score: number;
  category_scores: Record<string, number>;
  nearby_facilities: Record<string, Array<{
    name: string;
    distance: number;
    score: number;
    rating: number;
  }>>;
}

export interface InfrastructureDetails {
  score: number;
  category: string;
  facilities: Array<{
    name: string;
    distance: number;
    score: number;
    rating: number;
  }>;
  coverage_score: number;
  accessibility_score: number;
  convenience_score: number;
}

class InfrastructureService {
  /**
   * Get comprehensive infrastructure score
   */
  async getInfrastructureScore(
    latitude: number,
    longitude: number,
    radius: number = 1000
  ): Promise<InfrastructureScore> {
    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        radius: radius.toString(),
      });

      const response = await fetch(`${API_BASE_URL}/infrastructure/score?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting infrastructure score:', error);
      throw error;
    }
  }

  /**
   * Get detailed infrastructure analysis for a category
   */
  async getInfrastructureDetails(
    category: string,
    latitude: number,
    longitude: number,
    radius: number = 1000
  ): Promise<InfrastructureDetails> {
    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        radius: radius.toString(),
      });

      const response = await fetch(`${API_BASE_URL}/infrastructure/details/${category}?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting infrastructure details:', error);
      throw error;
    }
  }

  /**
   * Get infrastructure recommendations
   */
  async getInfrastructureRecommendations(
    latitude: number,
    longitude: number,
    radius: number = 1000
  ) {
    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        radius: radius.toString(),
      });

      const response = await fetch(`${API_BASE_URL}/infrastructure/recommendations?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting infrastructure recommendations:', error);
      throw error;
    }
  }

  /**
   * Compare infrastructure between multiple locations
   */
  async compareInfrastructure(
    locations: Array<{ latitude: number; longitude: number }>,
    radius: number = 1000
  ) {
    try {
      const locationString = locations
        .map(loc => `${loc.latitude},${loc.longitude}`)
        .join(';');

      const params = new URLSearchParams({
        locations: locationString,
        radius: radius.toString(),
      });

      const response = await fetch(`${API_BASE_URL}/infrastructure/comparison?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error comparing infrastructure:', error);
      throw error;
    }
  }

  /**
   * Get category name in Portuguese
   */
  getCategoryName(category: string): string {
    const categoryNames: Record<string, string> = {
      healthcare: 'Saúde',
      education: 'Educação',
      transportation: 'Transporte',
      shopping: 'Comércio',
      services: 'Serviços',
      recreation: 'Lazer',
      dining: 'Alimentação'
    };

    return categoryNames[category] || category;
  }

  /**
   * Get category icon for UI
   */
  getCategoryIcon(category: string): string {
    const categoryIcons: Record<string, string> = {
      healthcare: '🏥',
      education: '🎓',
      transportation: '🚌',
      shopping: '🛒',
      services: '🏢',
      recreation: '🎮',
      dining: '🍽️'
    };

    return categoryIcons[category] || '📍';
  }

  /**
   * Get score color for UI
   */
  getScoreColor(score: number): string {
    if (score >= 8) {
      return 'text-green-600 bg-green-100';
    } else if (score >= 6) {
      return 'text-yellow-600 bg-yellow-100';
    } else if (score >= 4) {
      return 'text-orange-600 bg-orange-100';
    } else {
      return 'text-red-600 bg-red-100';
    }
  }

  /**
   * Get score description
   */
  getScoreDescription(score: number): string {
    if (score >= 8) {
      return 'Excelente';
    } else if (score >= 6) {
      return 'Bom';
    } else if (score >= 4) {
      return 'Regular';
    } else {
      return 'Limitado';
    }
  }

  /**
   * Format distance for display
   */
  formatDistance(distanceMeters: number): string {
    if (distanceMeters < 1000) {
      return `${Math.round(distanceMeters)}m`;
    } else {
      return `${(distanceMeters / 1000).toFixed(1)}km`;
    }
  }

  /**
   * Get available infrastructure categories
   */
  getAvailableCategories(): Array<{ key: string; name: string; icon: string }> {
    return [
      { key: 'healthcare', name: 'Saúde', icon: '🏥' },
      { key: 'education', name: 'Educação', icon: '🎓' },
      { key: 'transportation', name: 'Transporte', icon: '🚌' },
      { key: 'shopping', name: 'Comércio', icon: '🛒' },
      { key: 'services', name: 'Serviços', icon: '🏢' },
      { key: 'recreation', name: 'Lazer', icon: '🎮' },
      { key: 'dining', name: 'Alimentação', icon: '🍽️' }
    ];
  }
}

export const infrastructureService = new InfrastructureService();
