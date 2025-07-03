// Serviço Híbrido de Dados - LocationIQ Pro
// Prioriza APIs reais, com fallback para dados mockados

import { WeatherService, IBGEService, NominatimService, checkAPIHealth } from './apiService';
import { LocationData, LocationAnalysis, ModuleScore } from './mockDataService';

export interface RealDataOptions {
  preferRealData: boolean;
  useCache: boolean;
  fallbackToMock: boolean;
}

export class HybridDataService {
  private static apiHealth: Record<string, boolean> = {
    openweather: false,
    ibge: false,
    nominatim: false,
  };

  private static lastHealthCheck = 0;
  private static readonly HEALTH_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutos

  /**
   * Verifica a saúde das APIs periodicamente
   */
  private static async ensureAPIHealth(): Promise<void> {
    const now = Date.now();
    if (now - this.lastHealthCheck > this.HEALTH_CHECK_INTERVAL) {
      this.apiHealth = await checkAPIHealth();
      this.lastHealthCheck = now;
      console.log('🔍 Status das APIs:', this.apiHealth);
    }
  }

  /**
   * Busca dados de localização usando APIs reais primeiro
   */
  static async searchLocations(
    query: string, 
    options: RealDataOptions = { preferRealData: true, useCache: true, fallbackToMock: true }
  ): Promise<LocationData[]> {
    await this.ensureAPIHealth();

    const results: LocationData[] = [];

    // 1. Tentar Nominatim (OpenStreetMap) primeiro
    if (options.preferRealData && this.apiHealth.nominatim) {
      try {
        console.log('🌍 Buscando dados reais via Nominatim...');
        const nominatimResults = await NominatimService.searchLocation(query);
        
        for (const result of nominatimResults.slice(0, 5)) {
          results.push({
            coordinates: {
              lat: parseFloat(result.lat),
              lng: parseFloat(result.lon),
            },
            address: result.display_name,
            city: result.address?.city || result.address?.town || result.address?.village,
            state: result.address?.state,
            country: result.address?.country_code?.toUpperCase(),
          });
        }

        if (results.length > 0) {
          console.log(`✅ Encontrados ${results.length} resultados via Nominatim`);
          return results;
        }
      } catch (error) {
        console.warn('⚠️ Erro ao buscar via Nominatim:', error);
      }
    }

    // 2. Tentar IBGE para cidades brasileiras
    if (options.preferRealData && this.apiHealth.ibge && query.length >= 2) {
      try {
        console.log('🇧🇷 Buscando cidades brasileiras via IBGE...');
        const ibgeCities = await IBGEService.searchCities(query);
        
        for (const city of ibgeCities.slice(0, 5)) {
          // Usar coordenadas aproximadas das capitais/cidades principais
          const coords = this.getEstimatedCoordinates(city.nome, city.microrregiao.mesorregiao.UF.sigla);
          
          results.push({
            coordinates: coords,
            address: `${city.nome}, ${city.microrregiao.mesorregiao.UF.sigla}, Brasil`,
            city: city.nome,
            state: city.microrregiao.mesorregiao.UF.nome,
            country: 'BR',
          });
        }

        if (results.length > 0) {
          console.log(`✅ Encontradas ${results.length} cidades via IBGE`);
          return results;
        }
      } catch (error) {
        console.warn('⚠️ Erro ao buscar via IBGE:', error);
      }
    }

    // 3. Fallback para dados mockados
    if (options.fallbackToMock) {
      console.log('📋 Usando dados mockados como fallback...');
      const { MockLocationAPI } = await import('./mockDataService');
      return MockLocationAPI.searchLocations(query);
    }

    return [];
  }

  /**
   * Analisa uma localização usando dados reais quando possível
   */
  static async analyzeLocation(
    location: LocationData,
    options: RealDataOptions = { preferRealData: true, useCache: true, fallbackToMock: true }
  ): Promise<LocationAnalysis | null> {
    await this.ensureAPIHealth();

    console.log('🔍 Analisando localização:', location.address);

    try {
      // Dados base da análise
      const analysis: Partial<LocationAnalysis> = {
        location,
        lastUpdated: new Date(),
        insights: [],
        recommendations: [],
      };

      // 1. Dados ambientais reais (OpenWeather)
      let environmentalData: ModuleScore | null = null;
      if (this.apiHealth.openweather) {
        environmentalData = await this.getEnvironmentalDataFromAPI(location);
      }

      // 2. Dados socioeconômicos (IBGE)
      let infrastructureData: ModuleScore | null = null;
      if (this.apiHealth.ibge && location.city) {
        infrastructureData = await this.getInfrastructureDataFromAPI(location.city);
      }

      // 3. Combinar dados reais com estimativas
      const modules = await this.buildModuleScores(location, environmentalData, infrastructureData);
      
      analysis.modules = modules;
      analysis.overallScore = this.calculateOverallScore(modules);
      analysis.insights = this.generateInsights(modules, location);
      analysis.recommendations = this.generateRecommendations(modules);

      console.log('✅ Análise concluída com dados híbridos');
      return analysis as LocationAnalysis;

    } catch (error) {
      console.warn('⚠️ Erro na análise híbrida:', error);
      
      // Fallback para dados mockados
      if (options.fallbackToMock) {
        console.log('📋 Usando análise mockada como fallback...');
        const { MockLocationAPI } = await import('./mockDataService');
        return MockLocationAPI.analyzeLocation(location);
      }
    }

    return null;
  }

  /**
   * Obter dados ambientais reais via OpenWeather
   */
  private static async getEnvironmentalDataFromAPI(location: LocationData): Promise<ModuleScore | null> {
    try {
      const weather = await WeatherService.getCurrentWeather(location.coordinates.lat, location.coordinates.lng);
      const airQuality = await WeatherService.getAirQuality(location.coordinates.lat, location.coordinates.lng);

      if (!weather) return null;

      // Calcular score baseado nos dados reais/estimados
      let score = 7.0; // Base score
      
      // Ajustar baseado na qualidade do ar
      if (airQuality) {
        const aqi = airQuality.aqi;
        if (aqi <= 1) score += 1.5; // Muito boa
        else if (aqi <= 2) score += 0.5; // Boa
        else if (aqi <= 3) score -= 0.5; // Moderada
        else if (aqi <= 4) score -= 1.5; // Ruim
        else score -= 2.5; // Muito ruim
      }

      // Ajustar baseado na temperatura (conforto)
      if (weather.temperature >= 18 && weather.temperature <= 28) {
        score += 0.5; // Temperatura confortável
      } else if (weather.temperature < 10 || weather.temperature > 35) {
        score -= 0.5; // Temperatura extrema
      }

      const isRealData = !!(process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY && process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY !== 'sua_chave_aqui');

      return {
        score: Math.max(0, Math.min(10, score)),
        factors: [
          `Temperatura: ${weather.temperature}°C`,
          `Umidade: ${weather.humidity}%`,
          `Qualidade do ar: ${airQuality ? this.getAQILabel(airQuality.aqi) : 'N/A'}`,
          `Condição: ${weather.description}`,
          `Fonte: ${isRealData ? 'API OpenWeather' : 'Estimativa por região'}`
        ],
        trend: 'stable',
        details: {
          temperature: weather.temperature,
          humidity: weather.humidity,
          airQuality: airQuality?.aqi || 0,
          weather: weather.description,
          realData: isRealData,
          dataSource: isRealData ? 'openweather' : 'estimated'
        }
      };
    } catch (error) {
      console.warn('Erro ao obter dados ambientais:', error);
      return null;
    }
  }

  /**
   * Obter dados de infraestrutura via IBGE
   */
  private static async getInfrastructureDataFromAPI(cityName: string): Promise<ModuleScore | null> {
    try {
      const stats = await IBGEService.getCityStatistics(cityName);
      if (!stats) return null;

      // Calcular score baseado nos dados reais
      let score = 5.0; // Base score

      // Ajustar baseado no IDH
      if (stats.hdi) {
        if (stats.hdi >= 0.800) score += 2.5; // Muito alto
        else if (stats.hdi >= 0.700) score += 1.5; // Alto
        else if (stats.hdi >= 0.600) score += 0.5; // Médio
        else score -= 0.5; // Baixo
      }

      // Ajustar baseado na densidade populacional (indicador de infraestrutura)
      if (stats.density > 5000) score += 1.0; // Alta densidade = boa infraestrutura
      else if (stats.density < 100) score -= 0.5; // Baixa densidade = infraestrutura limitada

      return {
        score: Math.max(0, Math.min(10, score)),
        factors: [
          `População: ${stats.population.toLocaleString('pt-BR')}`,
          `Densidade: ${stats.density.toFixed(0)} hab/km²`,
          `IDH: ${stats.hdi?.toFixed(3) || 'N/A'}`,
          `PIB: R$ ${stats.gdp ? (stats.gdp / 1000000000).toFixed(1) + 'B' : 'N/A'}`
        ],
        trend: 'stable',
        details: {
          population: stats.population,
          density: stats.density,
          hdi: stats.hdi || 0,
          gdp: stats.gdp || 0,
          realData: true
        }
      };
    } catch (error) {
      console.warn('Erro ao obter dados de infraestrutura:', error);
      return null;
    }
  }

  /**
   * Construir scores dos módulos combinando dados reais e estimados
   */
  private static async buildModuleScores(
    location: LocationData,
    environmentalData: ModuleScore | null,
    infrastructureData: ModuleScore | null
  ): Promise<LocationAnalysis['modules']> {
    // Importar dados mockados para completar o que não temos APIs
    const { MockLocationAPI } = await import('./mockDataService');
    const mockAnalysis = await MockLocationAPI.analyzeLocation(location);
    
    if (!mockAnalysis) {
      throw new Error('Não foi possível obter dados de fallback');
    }

    return {
      residential: mockAnalysis.modules.residential, // Por enquanto mockado
      hospitality: mockAnalysis.modules.hospitality, // Por enquanto mockado
      investment: mockAnalysis.modules.investment, // Por enquanto mockado
      environmental: environmentalData || mockAnalysis.modules.environmental,
      security: mockAnalysis.modules.security, // Por enquanto mockado
      infrastructure: infrastructureData || mockAnalysis.modules.infrastructure,
    };
  }

  /**
   * Utilitários
   */
  private static calculateOverallScore(modules: LocationAnalysis['modules']): number {
    const scores = Object.values(modules).map(m => m.score);
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }

  private static generateInsights(modules: LocationAnalysis['modules'], location: LocationData): string[] {
    const insights: string[] = [];
    
    // Insights baseados nos dados reais
    Object.entries(modules).forEach(([key, module]) => {
      if (module.details.realData) {
        insights.push(`📊 Dados reais obtidos para ${key}`);
      }
    });

    if (modules.environmental.details.realData) {
      insights.push(`🌡️ Temperatura atual: ${modules.environmental.details.temperature}°C`);
    }

    if (modules.infrastructure.details.realData) {
      insights.push(`👥 População: ${(modules.infrastructure.details.population as number).toLocaleString('pt-BR')} habitantes`);
    }

    return insights;
  }

  private static generateRecommendations(modules: LocationAnalysis['modules']): string[] {
    const recommendations: string[] = [];
    
    if (modules.environmental.score >= 8) {
      recommendations.push('🌱 Excelente qualidade ambiental para moradia');
    } else if (modules.environmental.score <= 5) {
      recommendations.push('⚠️ Considere os fatores ambientais ao escolher esta localização');
    }

    if (modules.infrastructure.score >= 8) {
      recommendations.push('🏗️ Infraestrutura bem desenvolvida');
    } else if (modules.infrastructure.score <= 5) {
      recommendations.push('🚧 Infraestrutura pode precisar de melhorias');
    }

    return recommendations;
  }

  private static getAQILabel(aqi: number): string {
    switch (aqi) {
      case 1: return 'Muito Boa';
      case 2: return 'Boa';
      case 3: return 'Moderada';
      case 4: return 'Ruim';
      case 5: return 'Muito Ruim';
      default: return 'Desconhecida';
    }
  }

  private static getEstimatedCoordinates(cityName: string, state: string): { lat: number; lng: number } {
    // Coordenadas aproximadas de cidades brasileiras principais
    const coordinates: Record<string, { lat: number; lng: number }> = {
      'São Paulo': { lat: -23.5505, lng: -46.6333 },
      'Rio de Janeiro': { lat: -22.9068, lng: -43.1729 },
      'Brasília': { lat: -15.8267, lng: -47.9218 },
      'Salvador': { lat: -12.9714, lng: -38.5014 },
      'Fortaleza': { lat: -3.7319, lng: -38.5267 },
      'Belo Horizonte': { lat: -19.9167, lng: -43.9345 },
      'Manaus': { lat: -3.1190, lng: -60.0217 },
      'Curitiba': { lat: -25.4244, lng: -49.2654 },
      'Recife': { lat: -8.0476, lng: -34.8770 },
      'Goiânia': { lat: -16.6869, lng: -49.2648 },
      'Belém': { lat: -1.4558, lng: -48.5044 },
      'Porto Alegre': { lat: -30.0346, lng: -51.2177 },
      'São Luís': { lat: -2.5387, lng: -44.2825 },
      'Maceió': { lat: -9.6658, lng: -35.7353 },
      'Campo Grande': { lat: -20.4697, lng: -54.6201 },
    };

    return coordinates[cityName] || { lat: -15.7801, lng: -47.9292 }; // Default para centro do Brasil
  }

  /**
   * Método público para verificar status das APIs
   */
  static async getAPIStatus(): Promise<Record<string, boolean>> {
    await this.ensureAPIHealth();
    return { ...this.apiHealth };
  }
}

export default HybridDataService;
