/**
 * Security Analysis API Service
 * 
 * Service to interact with security analysis endpoints
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface SecurityScore {
  overall_score: number;
  crime_analysis: {
    safety_score: number;
    crime_rates: Record<string, number>;
    weighted_crime_rate: number;
    risk_level: string;
  };
  infrastructure_analysis: {
    overall_infrastructure_score: number;
    infrastructure_breakdown: Record<string, number>;
    strengths: string[];
    weaknesses: string[];
  };
  time_analysis: {
    weekday_scores: Record<string, number>;
    weekend_scores: Record<string, number>;
    safest_time: string;
    riskiest_time: string;
    recommendations: string[];
  };
  risk_assessment: string;
  area_type: string;
}

export interface CrimeAnalysis {
  safety_score: number;
  crime_rates: Record<string, number>;
  weighted_crime_rate: number;
  risk_level: string;
}

export interface TimeBasedSafety {
  weekday_scores: Record<string, number>;
  weekend_scores: Record<string, number>;
  safest_time: string;
  riskiest_time: string;
  recommendations: string[];
}

class SecurityService {
  /**
   * Get comprehensive security score
   */
  async getSecurityScore(
    latitude: number,
    longitude: number,
    radius: number = 1000
  ): Promise<SecurityScore> {
    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        radius: radius.toString(),
      });

      const response = await fetch(`${API_BASE_URL}/security/score?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting security score:', error);
      throw error;
    }
  }

  /**
   * Get crime analysis
   */
  async getCrimeAnalysis(
    latitude: number,
    longitude: number,
    radius: number = 1000
  ): Promise<CrimeAnalysis> {
    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        radius: radius.toString(),
      });

      const response = await fetch(`${API_BASE_URL}/security/crime-analysis?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting crime analysis:', error);
      throw error;
    }
  }

  /**
   * Get time-based safety analysis
   */
  async getTimeBasedSafety(
    latitude: number,
    longitude: number
  ): Promise<TimeBasedSafety> {
    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      });

      const response = await fetch(`${API_BASE_URL}/security/time-based-safety?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting time-based safety:', error);
      throw error;
    }
  }

  /**
   * Get safety infrastructure assessment
   */
  async getSafetyInfrastructure(
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

      const response = await fetch(`${API_BASE_URL}/security/infrastructure?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting safety infrastructure:', error);
      throw error;
    }
  }

  /**
   * Get security recommendations
   */
  async getSecurityRecommendations(
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

      const response = await fetch(`${API_BASE_URL}/security/recommendations?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting security recommendations:', error);
      throw error;
    }
  }

  /**
   * Compare security between multiple locations
   */
  async compareSecurityScores(
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

      const response = await fetch(`${API_BASE_URL}/security/comparison?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error comparing security scores:', error);
      throw error;
    }
  }

  /**
   * Get risk level color for UI
   */
  getRiskLevelColor(riskLevel: string): string {
    switch (riskLevel.toLowerCase()) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'very_high':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  /**
   * Get risk level text in Portuguese
   */
  getRiskLevelText(riskLevel: string): string {
    switch (riskLevel.toLowerCase()) {
      case 'low':
        return 'Baixo Risco';
      case 'medium':
        return 'Risco Moderado';
      case 'high':
        return 'Alto Risco';
      case 'very_high':
        return 'Risco Muito Alto';
      default:
        return 'Risco Indefinido';
    }
  }
}

export const securityService = new SecurityService();
