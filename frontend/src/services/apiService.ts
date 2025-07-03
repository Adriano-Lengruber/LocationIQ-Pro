// Serviços de APIs Gratuitas - LocationIQ Pro
// Integração com APIs reais para substituir dados mockados

export interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  description: string;
  visibility: number;
  uv_index?: number;
  air_quality?: {
    co: number;
    no2: number;
    o3: number;
    pm2_5: number;
    pm10: number;
    aqi: number;
  };
}

export interface IBGECityData {
  id: number;
  nome: string;
  microrregiao: {
    id: number;
    nome: string;
    mesorregiao: {
      id: number;
      nome: string;
      UF: {
        id: number;
        sigla: string;
        nome: string;
      };
    };
  };
}

export interface IBGEDemographicData {
  populacao: number;
  pib: number;
  area: number;
  densidade: number;
  idh?: number;
}

export interface CityStatistics {
  population: number;
  area: number;
  density: number;
  gdp?: number;
  hdi?: number;
}

// Configuração das APIs
const API_CONFIG = {
  OPENWEATHER: {
    BASE_URL: 'https://api.openweathermap.org/data/2.5',
    API_KEY: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '',
    HAS_KEY: !!(process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY && process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY !== 'sua_chave_aqui'),
  },
  IBGE: {
    BASE_URL: 'https://servicodados.ibge.gov.br/api/v1',
  },
  NOMINATIM: {
    BASE_URL: 'https://nominatim.openstreetmap.org',
  }
};

/**
 * Serviço OpenWeatherMap - Dados climáticos e qualidade do ar
 */
export class WeatherService {
  static async getCurrentWeather(lat: number, lon: number): Promise<WeatherData | null> {
    // Verificar se temos chave válida
    if (!API_CONFIG.OPENWEATHER.HAS_KEY) {
      console.warn('⚠️ OpenWeather API key não configurada. Usando dados estimados baseados na localização.');
      return WeatherService.getEstimatedWeather(lat, lon);
    }

    try {
      const response = await fetch(
        `${API_CONFIG.OPENWEATHER.BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_CONFIG.OPENWEATHER.API_KEY}&units=metric&lang=pt_br`
      );
      
      if (!response.ok) {
        console.warn('OpenWeather API não disponível, usando dados estimados');
        return WeatherService.getEstimatedWeather(lat, lon);
      }
      
      const data = await response.json();
      
      console.log('✅ Dados reais obtidos do OpenWeather');
      return {
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: data.wind.speed,
        description: data.weather[0].description,
        visibility: data.visibility / 1000, // converter para km
      };
    } catch (error) {
      console.warn('Erro ao buscar dados do clima:', error);
      return WeatherService.getEstimatedWeather(lat, lon);
    }
  }

  /**
   * Dados climáticos estimados baseados na localização (para quando não temos API key)
   */
  static getEstimatedWeather(lat: number, lon: number): WeatherData {
    // Estimativas baseadas na latitude (clima típico brasileiro)
    let temperature = 25;
    let humidity = 65;
    let description = 'Parcialmente nublado';

    // Ajustar baseado na região
    if (lat < -25) { // Sul
      temperature = 18;
      humidity = 75;
      description = 'Tempo ameno';
    } else if (lat > -10) { // Norte/Nordeste
      temperature = 32;
      humidity = 55;
      description = 'Ensolarado';
    } else if (lat < -15) { // Sudeste/Centro-Oeste
      temperature = 26;
      humidity = 60;
      description = 'Tempo bom';
    }

    console.log('📊 Usando dados climáticos estimados para a região');
    
    return {
      temperature,
      humidity,
      pressure: 1013,
      windSpeed: 3.5,
      description,
      visibility: 10,
    };
  }

  static async getAirQuality(lat: number, lon: number): Promise<WeatherData['air_quality'] | null> {
    // Verificar se temos chave válida
    if (!API_CONFIG.OPENWEATHER.HAS_KEY) {
      console.warn('⚠️ OpenWeather API key não configurada. Usando estimativa de qualidade do ar.');
      return WeatherService.getEstimatedAirQuality(lat, lon);
    }

    try {
      const response = await fetch(
        `${API_CONFIG.OPENWEATHER.BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_CONFIG.OPENWEATHER.API_KEY}`
      );
      
      if (!response.ok) {
        return WeatherService.getEstimatedAirQuality(lat, lon);
      }
      
      const data = await response.json();
      const components = data.list[0].components;
      
      console.log('✅ Dados reais de qualidade do ar obtidos');
      return {
        co: components.co,
        no2: components.no2,
        o3: components.o3,
        pm2_5: components.pm2_5,
        pm10: components.pm10,
        aqi: data.list[0].main.aqi,
      };
    } catch (error) {
      console.warn('Erro ao buscar qualidade do ar:', error);
      return WeatherService.getEstimatedAirQuality(lat, lon);
    }
  }

  /**
   * Estimativa de qualidade do ar baseada na localização
   */
  static getEstimatedAirQuality(lat: number, lon: number): WeatherData['air_quality'] {
    // Estimativas baseadas no tipo de região
    let aqi = 2; // Boa qualidade por padrão
    
    // Ajustar baseado na proximidade de grandes centros urbanos
    const metropolitanAreas = [
      { lat: -23.5505, lng: -46.6333, name: 'São Paulo', pollution: 3 },
      { lat: -22.9068, lng: -43.1729, name: 'Rio de Janeiro', pollution: 3 },
      { lat: -25.4244, lng: -49.2654, name: 'Curitiba', pollution: 2 },
      { lat: -30.0346, lng: -51.2177, name: 'Porto Alegre', pollution: 2 },
    ];

    for (const area of metropolitanAreas) {
      const distance = Math.sqrt(Math.pow(lat - area.lat, 2) + Math.pow(lon - area.lng, 2));
      if (distance < 0.5) { // Dentro da região metropolitana
        aqi = area.pollution;
        break;
      }
    }

    console.log('📊 Usando estimativa de qualidade do ar para a região');
    
    return {
      aqi,
      co: aqi * 500,
      no2: aqi * 30,
      o3: aqi * 80,
      pm2_5: aqi * 15,
      pm10: aqi * 25,
    };
  }
}

/**
 * Serviço IBGE - Dados socioeconômicos do Brasil
 */
export class IBGEService {
  static async searchCities(query: string): Promise<IBGECityData[]> {
    try {
      const response = await fetch(
        `${API_CONFIG.IBGE.BASE_URL}/localidades/municipios?nome=${encodeURIComponent(query)}`
      );
      
      if (!response.ok) {
        return [];
      }
      
      const cities = await response.json();
      return cities.slice(0, 10); // Limitar a 10 resultados
    } catch (error) {
      console.warn('Erro ao buscar cidades IBGE:', error);
      return [];
    }
  }

  static async getCityById(cityId: number): Promise<IBGECityData | null> {
    try {
      const response = await fetch(
        `${API_CONFIG.IBGE.BASE_URL}/localidades/municipios/${cityId}`
      );
      
      if (!response.ok) {
        return null;
      }
      
      return await response.json();
    } catch (error) {
      console.warn('Erro ao buscar cidade por ID:', error);
      return null;
    }
  }

  // Simulação de dados demográficos (IBGE não tem API direta para todos os dados)
  static async getCityStatistics(cityName: string): Promise<CityStatistics | null> {
    try {
      // Por enquanto, usaremos dados estimados baseados no nome da cidade
      // Em uma implementação real, poderíamos usar outras APIs ou bases de dados
      const estimates = this.getEstimatedData(cityName);
      return estimates;
    } catch (error) {
      console.warn('Erro ao buscar estatísticas da cidade:', error);
      return null;
    }
  }

  private static getEstimatedData(cityName: string): CityStatistics {
    // Dados estimados baseados em conhecimento geral das cidades brasileiras
    const cityData: Record<string, CityStatistics> = {
      'São Paulo': { population: 12396372, area: 1521.11, density: 8146, gdp: 728700000000, hdi: 0.805 },
      'Rio de Janeiro': { population: 6775561, area: 1200.27, density: 5645, gdp: 354000000000, hdi: 0.799 },
      'Brasília': { population: 3094325, area: 5760.78, density: 537, gdp: 254000000000, hdi: 0.824 },
      'Salvador': { population: 2886698, area: 692.82, density: 4167, gdp: 60000000000, hdi: 0.759 },
      'Fortaleza': { population: 2703391, area: 314.93, density: 8588, gdp: 62000000000, hdi: 0.754 },
      'Belo Horizonte': { population: 2530701, area: 331.40, density: 7637, gdp: 89000000000, hdi: 0.810 },
      'Manaus': { population: 2255903, area: 11401.06, density: 198, gdp: 74000000000, hdi: 0.737 },
      'Curitiba': { population: 1963726, area: 434.97, density: 4515, gdp: 95000000000, hdi: 0.823 },
      'Recife': { population: 1661017, area: 218.84, density: 7589, gdp: 46000000000, hdi: 0.772 },
      'Goiânia': { population: 1555626, area: 739.49, density: 2103, gdp: 47000000000, hdi: 0.799 },
    };

    return cityData[cityName] || {
      population: 500000,
      area: 300,
      density: 1667,
      gdp: 10000000000,
      hdi: 0.750
    };
  }
}

/**
 * Serviço Nominatim (OpenStreetMap) - Geocodificação
 */
export class NominatimService {
  static async searchLocation(query: string): Promise<any[]> {
    try {
      const response = await fetch(
        `${API_CONFIG.NOMINATIM.BASE_URL}/search?q=${encodeURIComponent(query)}&format=json&limit=10&countrycodes=br&addressdetails=1`
      );
      
      if (!response.ok) {
        return [];
      }
      
      return await response.json();
    } catch (error) {
      console.warn('Erro ao buscar localização:', error);
      return [];
    }
  }

  static async reverseGeocode(lat: number, lon: number): Promise<any | null> {
    try {
      const response = await fetch(
        `${API_CONFIG.NOMINATIM.BASE_URL}/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`
      );
      
      if (!response.ok) {
        return null;
      }
      
      return await response.json();
    } catch (error) {
      console.warn('Erro no geocoding reverso:', error);
      return null;
    }
  }
}

/**
 * Função para verificar se as APIs estão funcionais
 */
export async function checkAPIHealth(): Promise<Record<string, boolean>> {
  const health = {
    openweather: false,
    ibge: false,
    nominatim: false,
  };

  try {
    // Teste OpenWeather (São Paulo)
    const weatherResponse = await fetch(
      `${API_CONFIG.OPENWEATHER.BASE_URL}/weather?lat=-23.5505&lon=-46.6333&appid=${API_CONFIG.OPENWEATHER.API_KEY}&units=metric`,
      { method: 'HEAD' }
    );
    health.openweather = weatherResponse.ok;
  } catch (error) {
    console.warn('OpenWeather API não acessível');
  }

  try {
    // Teste IBGE
    const ibgeResponse = await fetch(`${API_CONFIG.IBGE.BASE_URL}/localidades/municipios?nome=São`, { method: 'HEAD' });
    health.ibge = ibgeResponse.ok;
  } catch (error) {
    console.warn('IBGE API não acessível');
  }

  try {
    // Teste Nominatim
    const nominatimResponse = await fetch(`${API_CONFIG.NOMINATIM.BASE_URL}/search?q=São Paulo&format=json&limit=1`, { method: 'HEAD' });
    health.nominatim = nominatimResponse.ok;
  } catch (error) {
    console.warn('Nominatim API não acessível');
  }

  return health;
}

// Interfaces para dados IBGE
export interface IBGEMunicipalityInfo {
  id: number;
  nome: string;
  microrregiao: string;
  mesorregiao: string | null;
  uf: {
    id: number | null;
    sigla: string | null;
    nome: string | null;
  };
  regiao: {
    id: number | null;
    sigla: string | null;
    nome: string | null;
  };
  regiao_imediata: {
    id: number;
    nome: string;
  };
  regiao_intermediaria: {
    id: number | null;
    nome: string | null;
  };
}

export interface IBGEPopulationData {
  municipality_id: number;
  municipality_name: string;
  population: number;
  year: number;
  unit: string;
  source: string;
  _cached_at?: string;
  _cache_ttl?: number;
}

export interface IBGEAreaData {
  municipality_id: number;
  municipality_name: string;
  area_km2: number;
  year: number;
  unit: string;
  source: string;
  _cached_at?: string;
  _cache_ttl?: number;
}

export interface IBGEDensityData {
  municipality_id: number;
  municipality_name: string;
  density: number;
  year: number;
  unit: string;
  source: string;
  _cached_at?: string;
  _cache_ttl?: number;
}

export interface IBGECompleteData {
  municipality_id: number;
  basic_info: IBGEMunicipalityInfo | null;
  population: IBGEPopulationData | null;
  area: IBGEAreaData | null;
  density: IBGEDensityData | null;
  economic_indicators: {
    municipality_id: number;
    indicators: Record<string, any>;
    available_indicators: string[];
    note: string;
  };
  last_updated: string;
  data_sources: string[];
  coordinates?: {
    latitude: number;
    longitude: number;
    mapbox_center: {
      lat: number;
      lng: number;
      zoom: number;
    };
  };
}

export interface IBGESearchResult {
  id: number;
  nome: string;
  uf: string;
  microrregiao: string;
  mesorregiao: string;
}

/**
 * Serviço IBGE Backend - Conecta com nosso backend LocationIQ Pro
 */
export class IBGEBackendService {
  private static readonly BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api/v1';

  /**
   * Obtém dados completos do município padrão (Itaperuna)
   */
  static async getDefaultMunicipality(): Promise<IBGECompleteData | null> {
    try {
      const response = await fetch(`${this.BASE_URL}/ibge/municipality/default`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Dados do município padrão obtidos do backend');
      return data;
    } catch (error) {
      console.error('Erro ao buscar município padrão:', error);
      return null;
    }
  }

  /**
   * Obtém dados de população de um município
   */
  static async getPopulation(municipalityId: number): Promise<IBGEPopulationData | null> {
    try {
      const response = await fetch(`${this.BASE_URL}/ibge/population/${municipalityId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✅ Dados de população obtidos para município ${municipalityId}`);
      return data;
    } catch (error) {
      console.error('Erro ao buscar população:', error);
      return null;
    }
  }

  /**
   * Obtém dados de área territorial de um município
   */
  static async getArea(municipalityId: number): Promise<IBGEAreaData | null> {
    try {
      const response = await fetch(`${this.BASE_URL}/ibge/area/${municipalityId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✅ Dados de área obtidos para município ${municipalityId}`);
      return data;
    } catch (error) {
      console.error('Erro ao buscar área:', error);
      return null;
    }
  }

  /**
   * Obtém dados de densidade demográfica de um município
   */
  static async getDensity(municipalityId: number): Promise<IBGEDensityData | null> {
    try {
      const response = await fetch(`${this.BASE_URL}/ibge/density/${municipalityId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✅ Dados de densidade obtidos para município ${municipalityId}`);
      return data;
    } catch (error) {
      console.error('Erro ao buscar densidade:', error);
      return null;
    }
  }

  /**
   * Obtém informações básicas de um município
   */
  static async getMunicipalityInfo(municipalityId: number): Promise<IBGEMunicipalityInfo | null> {
    try {
      const response = await fetch(`${this.BASE_URL}/ibge/municipality/${municipalityId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✅ Informações básicas obtidas para município ${municipalityId}`);
      return data;
    } catch (error) {
      console.error('Erro ao buscar informações do município:', error);
      return null;
    }
  }

  /**
   * Busca municípios por nome
   */
  static async searchMunicipalities(name: string, uf?: string): Promise<IBGESearchResult[] | null> {
    try {
      const params = new URLSearchParams({ name });
      if (uf) params.append('uf', uf);
      
      const response = await fetch(`${this.BASE_URL}/ibge/search?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✅ Busca de municípios realizada: ${data.length} resultados`);
      return data;
    } catch (error) {
      console.error('Erro ao buscar municípios:', error);
      return null;
    }
  }

  /**
   * Obtém dados completos de um município específico
   */
  static async getCompleteMunicipalityData(municipalityId: number): Promise<IBGECompleteData | null> {
    try {
      const response = await fetch(`${this.BASE_URL}/ibge/municipality/${municipalityId}/complete`);
      
      if (!response.ok) {
        // Se não tiver endpoint /complete, monta os dados fazendo múltiplas chamadas
        return await this.buildCompleteData(municipalityId);
      }
      
      const data = await response.json();
      console.log(`✅ Dados completos obtidos para município ${municipalityId}`);
      return data;
    } catch (error) {
      console.error('Erro ao buscar dados completos:', error);
      return await this.buildCompleteData(municipalityId);
    }
  }

  /**
   * Constrói dados completos fazendo múltiplas chamadas
   */
  private static async buildCompleteData(municipalityId: number): Promise<IBGECompleteData | null> {
    try {
      const [basicInfo, population, area, density] = await Promise.all([
        this.getMunicipalityInfo(municipalityId),
        this.getPopulation(municipalityId),
        this.getArea(municipalityId),
        this.getDensity(municipalityId)
      ]);

      return {
        municipality_id: municipalityId,
        basic_info: basicInfo,
        population,
        area,
        density,
        economic_indicators: {
          municipality_id: municipalityId,
          indicators: {},
          available_indicators: [],
          note: "Dados obtidos via múltiplas chamadas"
        },
        last_updated: new Date().toISOString().split('T')[0],
        data_sources: ["LocationIQ Pro Backend", "IBGE APIs"]
      };
    } catch (error) {
      console.error('Erro ao construir dados completos:', error);
      return null;
    }
  }
}
