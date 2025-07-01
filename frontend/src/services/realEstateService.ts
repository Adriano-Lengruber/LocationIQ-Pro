/**
 * Real Estate API Service
 * 
 * Service to interact with real estate analysis endpoints
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface PropertyData {
  address: string;
  property_type: string;
  bedrooms?: number;
  bathrooms?: number;
  area_sqm?: number;
  age_years?: number;
  parking_spaces?: number;
  furnished?: boolean;
}

export interface PropertyPrice {
  current_price: number;
  predicted_price: number;
  price_per_sqm: number;
  confidence_score: number;
  market_trend: string;
}

export interface MarketAnalysis {
  average_price: number;
  median_price: number;
  price_trend_6m: number;
  price_trend_12m: number;
  market_velocity: number;
  supply_demand_ratio: number;
}

export interface RentalYieldAnalysis {
  gross_yield_percent: number;
  net_yield_percent: number;
  annual_rental_income: number;
  net_annual_income: number;
  yield_assessment: string;
  payback_period_years: number;
}

class RealEstateService {
  /**
   * Predict property price
   */
  async predictPrice(propertyData: PropertyData): Promise<PropertyPrice> {
    try {
      const response = await fetch(`${API_BASE_URL}/real-estate/predict-price`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error predicting property price:', error);
      throw error;
    }
  }

  /**
   * Get market analysis for a location
   */
  async getMarketAnalysis(
    latitude: number,
    longitude: number,
    radius: number = 1000,
    propertyType: string = 'apartment'
  ): Promise<MarketAnalysis> {
    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        radius: radius.toString(),
        property_type: propertyType,
      });

      const response = await fetch(`${API_BASE_URL}/real-estate/market-analysis?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting market analysis:', error);
      throw error;
    }
  }

  /**
   * Calculate rental yield
   */
  async calculateRentalYield(
    propertyPrice: number,
    monthlyRent: number,
    annualCosts: number = 0
  ): Promise<RentalYieldAnalysis> {
    try {
      const params = new URLSearchParams({
        property_price: propertyPrice.toString(),
        monthly_rent: monthlyRent.toString(),
        annual_costs: annualCosts.toString(),
      });

      const response = await fetch(`${API_BASE_URL}/real-estate/rental-yield?${params}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error calculating rental yield:', error);
      throw error;
    }
  }

  /**
   * Get comparable properties
   */
  async getComparableProperties(
    latitude: number,
    longitude: number,
    propertyType: string,
    bedrooms?: number,
    areaMin?: number,
    areaMax?: number
  ) {
    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        property_type: propertyType,
      });

      if (bedrooms !== undefined) params.append('bedrooms', bedrooms.toString());
      if (areaMin !== undefined) params.append('area_min', areaMin.toString());
      if (areaMax !== undefined) params.append('area_max', areaMax.toString());

      const response = await fetch(`${API_BASE_URL}/real-estate/comparable-properties?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting comparable properties:', error);
      throw error;
    }
  }

  /**
   * Get investment analysis
   */
  async getInvestmentAnalysis(
    latitude: number,
    longitude: number,
    purchasePrice: number,
    rentalIncome?: number
  ) {
    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        purchase_price: purchasePrice.toString(),
      });

      if (rentalIncome !== undefined) {
        params.append('rental_income', rentalIncome.toString());
      }

      const response = await fetch(`${API_BASE_URL}/real-estate/investment-analysis?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting investment analysis:', error);
      throw error;
    }
  }
}

export const realEstateService = new RealEstateService();
